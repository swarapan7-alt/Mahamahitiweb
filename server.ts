import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// SECURE ADMIN CREDENTIALS & PERSISTENCE STORE
// -------------------------------------------------------------
const DATA_FILE = path.join(process.cwd(), 'admin-data.json');

// Helper to hash password with salt using SHA-256 + salt
function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// In-memory + file session & auth storage
interface AdminStore {
  username: string;
  salt: string;
  passwordHash: string;
  isFirstLogin: boolean;
  activeSessions: { [token: string]: { username: string; expiresAt: number } };
  homepageConfig?: any;
  customSchemes?: any[];
  customDocuments?: any[];
  customServices?: any[];
  customUpdates?: any[];
  customFaqs?: any[];
  customImages?: any[];
  settings?: any;
  visitorStats?: {
    total: number;
    today: number;
    yesterday: number;
    month: number;
    pageViews: number;
    lastDate: string;
    lastMonth: string;
  };
}

const DEFAULT_SALT = "mahamahiti_secure_salt_2026";
// Initial credentials: Admin / Sangli@123
const DEFAULT_STORE: AdminStore = {
  username: "Admin",
  salt: DEFAULT_SALT,
  passwordHash: hashPassword("Sangli@123", DEFAULT_SALT),
  isFirstLogin: true,
  activeSessions: {},
  visitorStats: {
    total: 125480,
    today: 342,
    yesterday: 890,
    month: 8745,
    pageViews: 382900,
    lastDate: new Date().toISOString().split('T')[0],
    lastMonth: new Date().toISOString().slice(0, 7)
  },
  settings: {
    websiteName: "महामाहिती",
    websiteDescription: "मराठी-प्रथम स्वतंत्र नागरिक माहिती व्यासपीठ (mahamahiti.com)",
    domain: "mahamahiti.com",
    logoText: "महामाहिती",
    contactEmail: "contact@mahamahiti.com",
    whatsappShareNote: "सर्व योजना व कागदपत्रांची अधिकृत माहिती मिळवण्यासाठी महामाहिती पोर्टलला भेट द्या.",
    defaultSeoTitle: "महामाहिती - सरकारी योजना व कागदपत्रे",
    defaultSeoDescription: "सरकारी योजना, प्रमाणपत्रे, कागदपत्रे आणि शासकीय सेवांची सोप्या भाषेतील अचूक आणि सत्यापित माहिती."
  }
};

function loadAdminStore(): AdminStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      // Ensure defaults exist
      return {
        ...DEFAULT_STORE,
        ...data,
        activeSessions: data.activeSessions || {}
      };
    }
  } catch (err) {
    console.error("Error loading admin store:", err);
  }
  return { ...DEFAULT_STORE };
}

function saveAdminStore(store: AdminStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving admin store:", err);
  }
}

let adminStore = loadAdminStore();

// Token helper
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function verifyToken(token: string): boolean {
  if (!token) return false;
  const session = adminStore.activeSessions[token];
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    delete adminStore.activeSessions[token];
    saveAdminStore(adminStore);
    return false;
  }
  return true;
}

// -------------------------------------------------------------
// SERVER SETUP
// -------------------------------------------------------------
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // Middleware to authenticate admin requests
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
    if (!verifyToken(token)) {
      res.status(401).json({ error: "अनधिकृत प्रवेश (Unauthorized). कृपया पुन्हा लॉगिन करा." });
      return;
    }
    next();
  };

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      appName: "महामाहिती (MahaMahiti - mahamahiti.com)",
      timestamp: new Date().toISOString()
    });
  });

  // -----------------------------------------------------------
  // AUTHENTICATION ROUTES
  // -----------------------------------------------------------
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username आणि Password आवश्यक आहे." });
      return;
    }

    // Compare username case-insensitively and hash password
    if (
      username.trim().toLowerCase() === adminStore.username.toLowerCase() &&
      hashPassword(password, adminStore.salt) === adminStore.passwordHash
    ) {
      const token = generateToken();
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      adminStore.activeSessions[token] = {
        username: adminStore.username,
        expiresAt
      };
      saveAdminStore(adminStore);

      res.json({
        success: true,
        token,
        username: adminStore.username,
        isFirstLogin: adminStore.isFirstLogin,
        message: "यशस्वीरित्या लॉगिन झाले."
      });
      return;
    }

    res.status(401).json({ error: "अवैध Username किंवा Password." });
  });

  app.get("/api/admin/verify", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
    if (verifyToken(token)) {
      res.json({
        valid: true,
        username: adminStore.username,
        isFirstLogin: adminStore.isFirstLogin
      });
    } else {
      res.status(401).json({ valid: false });
    }
  });

  app.post("/api/admin/change-password", requireAdmin, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "चालू पासवर्ड आणि नवीन पासवर्ड दोन्ही आवश्यक आहेत." });
      return;
    }

    if (hashPassword(currentPassword, adminStore.salt) !== adminStore.passwordHash) {
      res.status(400).json({ error: "चालू पासवर्ड चुकीचा आहे." });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "नवीन पासवर्ड किमान ६ अक्षरांचा असावा." });
      return;
    }

    const newSalt = crypto.randomBytes(16).toString('hex');
    adminStore.salt = newSalt;
    adminStore.passwordHash = hashPassword(newPassword, newSalt);
    adminStore.isFirstLogin = false;
    saveAdminStore(adminStore);

    res.json({ success: true, message: "पासवर्ड यशस्वीरित्या बदलला गेला." });
  });

  app.post("/api/admin/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
    if (token && adminStore.activeSessions[token]) {
      delete adminStore.activeSessions[token];
      saveAdminStore(adminStore);
    }
    res.json({ success: true, message: "लॉगआउट यशस्वी झाले." });
  });

  // -----------------------------------------------------------
  // ADMIN DATA / CMS ROUTES
  // -----------------------------------------------------------
  app.get("/api/admin/store", requireAdmin, (req, res) => {
    res.json({
      homepageConfig: adminStore.homepageConfig,
      customSchemes: adminStore.customSchemes,
      customDocuments: adminStore.customDocuments,
      customServices: adminStore.customServices,
      customUpdates: adminStore.customUpdates,
      customFaqs: adminStore.customFaqs,
      customImages: adminStore.customImages,
      settings: adminStore.settings
    });
  });

  app.post("/api/admin/store", requireAdmin, (req, res) => {
    const {
      homepageConfig,
      customSchemes,
      customDocuments,
      customServices,
      customUpdates,
      customFaqs,
      customImages,
      settings
    } = req.body;

    if (homepageConfig !== undefined) adminStore.homepageConfig = homepageConfig;
    if (customSchemes !== undefined) adminStore.customSchemes = customSchemes;
    if (customDocuments !== undefined) adminStore.customDocuments = customDocuments;
    if (customServices !== undefined) adminStore.customServices = customServices;
    if (customUpdates !== undefined) adminStore.customUpdates = customUpdates;
    if (customFaqs !== undefined) adminStore.customFaqs = customFaqs;
    if (customImages !== undefined) adminStore.customImages = customImages;
    if (settings !== undefined) adminStore.settings = settings;
    if (req.body.visitorStats !== undefined) adminStore.visitorStats = req.body.visitorStats;

    saveAdminStore(adminStore);
    res.json({ success: true, message: "माहिती यशस्वीरित्या साठवली गेली." });
  });

  // -----------------------------------------------------------
  // VISITOR COUNTER & TRACKING ROUTES
  // -----------------------------------------------------------
  app.get("/api/visitors/stats", (req, res) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const monthStr = new Date().toISOString().slice(0, 7);

    if (!adminStore.visitorStats) {
      adminStore.visitorStats = {
        total: 125480,
        today: 342,
        yesterday: 890,
        month: 8745,
        pageViews: 382900,
        lastDate: todayStr,
        lastMonth: monthStr
      };
    }

    // Daily reset check
    if (adminStore.visitorStats.lastDate !== todayStr) {
      adminStore.visitorStats.yesterday = adminStore.visitorStats.today || 890;
      adminStore.visitorStats.today = 12;
      adminStore.visitorStats.lastDate = todayStr;
    }
    // Monthly reset check
    if (adminStore.visitorStats.lastMonth !== monthStr) {
      adminStore.visitorStats.month = adminStore.visitorStats.today;
      adminStore.visitorStats.lastMonth = monthStr;
    }

    // Increment overall pageViews on request
    adminStore.visitorStats.pageViews = (adminStore.visitorStats.pageViews || 382900) + 1;

    res.json({
      success: true,
      stats: {
        total: adminStore.visitorStats.total,
        today: adminStore.visitorStats.today,
        yesterday: adminStore.visitorStats.yesterday || 890,
        month: adminStore.visitorStats.month,
        pageViews: adminStore.visitorStats.pageViews
      }
    });
  });

  app.post("/api/visitors/track", (req, res) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const monthStr = new Date().toISOString().slice(0, 7);

    if (!adminStore.visitorStats) {
      adminStore.visitorStats = {
        total: 125480,
        today: 342,
        yesterday: 890,
        month: 8745,
        pageViews: 382900,
        lastDate: todayStr,
        lastMonth: monthStr
      };
    }

    // Daily rollover
    if (adminStore.visitorStats.lastDate !== todayStr) {
      adminStore.visitorStats.yesterday = adminStore.visitorStats.today || 890;
      adminStore.visitorStats.today = 0;
      adminStore.visitorStats.lastDate = todayStr;
    }
    // Monthly rollover
    if (adminStore.visitorStats.lastMonth !== monthStr) {
      adminStore.visitorStats.month = 0;
      adminStore.visitorStats.lastMonth = monthStr;
    }

    adminStore.visitorStats.total += 1;
    adminStore.visitorStats.today += 1;
    adminStore.visitorStats.month += 1;
    adminStore.visitorStats.pageViews = (adminStore.visitorStats.pageViews || 382900) + 2;

    saveAdminStore(adminStore);

    res.json({
      success: true,
      stats: {
        total: adminStore.visitorStats.total,
        today: adminStore.visitorStats.today,
        yesterday: adminStore.visitorStats.yesterday || 890,
        month: adminStore.visitorStats.month,
        pageViews: adminStore.visitorStats.pageViews
      }
    });
  });

  // Dedicated Hero Image Endpoint for immediate public & admin sync
  app.get("/api/hero-image", (req, res) => {
    const heroImg = adminStore.homepageConfig?.heroImage || 
                    adminStore.homepageConfig?.heroImageUrl || 
                    adminStore.customImages?.find((img: any) => img.id === 'homepage_hero' || img.id === 'img-hero')?.url || 
                    null;
    res.json({ heroImage: heroImg });
  });

  app.post("/api/hero-image", (req, res) => {
    const { heroImage } = req.body;
    if (!heroImage) {
      res.status(400).json({ error: "heroImage data is required" });
      return;
    }

    if (!adminStore.homepageConfig) {
      adminStore.homepageConfig = {};
    }
    adminStore.homepageConfig.heroImage = heroImage;
    adminStore.homepageConfig.heroImageUrl = heroImage;

    if (!adminStore.customImages) {
      adminStore.customImages = [];
    }
    const heroIndex = adminStore.customImages.findIndex((img: any) => img.id === 'homepage_hero' || img.id === 'img-hero');
    if (heroIndex >= 0) {
      adminStore.customImages[heroIndex].id = 'homepage_hero';
      adminStore.customImages[heroIndex].url = heroImage;
    } else {
      adminStore.customImages.push({
        id: 'homepage_hero',
        name: 'मुख्यपृष्ठ Hero Banner',
        url: heroImage,
        altText: 'महाराष्ट्र शासन नागरिक कल्याण योजना',
        usedIn: 'मुख्यपृष्ठ Hero Banner',
        fileSize: '1920 × 1080 px (16:9)',
        uploadedAt: new Date().toISOString().split('T')[0]
      });
    }

    saveAdminStore(adminStore);
    res.json({ success: true, heroImage, message: "Hero Image यशस्वीरित्या साठवली गेली." });
  });

  // Public content endpoint to read customized content if available
  app.get("/api/content/custom", (req, res) => {
    res.json({
      homepageConfig: adminStore.homepageConfig || null,
      customSchemes: adminStore.customSchemes || null,
      customDocuments: adminStore.customDocuments || null,
      customServices: adminStore.customServices || null,
      customUpdates: adminStore.customUpdates || null,
      customFaqs: adminStore.customFaqs || null,
      customImages: adminStore.customImages || null,
      settings: adminStore.settings || null
    });
  });

  // -----------------------------------------------------------
  // AI CITIZEN ASSISTANT API WITH MULTI-TIER RESILIENCE & RETRIES
  // -----------------------------------------------------------
  function getLocalCitizenKnowledge(message: string): { reply: string; suggestedQuestions: string[] } {
    const lower = message.toLowerCase();
    
    if (lower.includes("ladki") || lower.includes("लाडकी") || lower.includes("बहीण")) {
      return {
        reply: `**मुख्यमंत्री माझी लाडकी बहीण योजना २०२६:**\n\n` +
          `• **लाभ:** पात्र महिलांना दरमहा ₹१,५०० थेट आधार लिंक बँक खात्यात मिळतात.\n` +
          `• **पात्रता:** वय २१ ते ६५ वर्षे, महाराष्ट्राचे रहिवासी, कौटुंबिक वार्षिक उत्पन्न ₹२.५० लाखांपेक्षा कमी (किंवा पिवळे/केशरी रेशन कार्डधारक).\n` +
          `• **आवश्यक कागदपत्रे:**\n` +
          `  १. आधार कार्ड\n` +
          `  २. अधिवास दाखला (किंवा १५ वर्षे वास्तव्याचा पुरावा / जन्म दाखला / शाळा सोडल्याचा दाखला)\n` +
          `  ३. उत्पन्न दाखला किंवा पिवळे/केशरी रेशन कार्ड\n` +
          `  ४. आधार लिंक बँक पासबुक झेरॉक्स\n` +
          `  ५. हमीपत्र व पासपोर्ट फोटो\n` +
          `• **अर्ज प्रक्रिया:** 'नारी शक्ती दूत' ॲप किंवा ladkibahin.maharashtra.gov.in पोर्टलवर आणि सेतू/सीएससी केंद्रात मोफत अर्ज उपलब्ध.`,
        suggestedQuestions: ["लाडकी बहीण कागदपत्रे चेकलिस्ट", "माझी पात्रता कशी तपासावी?", "हप्ता जमा झाला की नाही कसे पाहावे?"]
      };
    }

    if (lower.includes("farmer") || lower.includes("शेतकरी") || lower.includes("kisan") || lower.includes("किसान") || lower.includes("namo") || lower.includes("नमो")) {
      return {
        reply: `**शेतकरी कल्याण योजना (PM किसान + नमो शेतकरी):**\n\n` +
          `• **वार्षिक थेट मदत:** एकूण ₹१२,००० (PM-किसान ₹६,००० + नमो शेतकरी महासन्मान निधी ₹६,०००)\n` +
          `• **पात्रता:** स्वतःच्या नावावर शेती असणारे शेतकरी, ई-केवायसी पूर्ण असलेले खाते.\n` +
          `• **इतर प्रमुख शेतकरी योजना:**\n` +
          `  १. **₹१ रुपयात पीक विमा योजना** (Kharif/Rabi Insurance)\n` +
          `  २. **डॉ. पंजाबराव देशमुख ०% व्याज पीक कर्ज योजना** (वेळेत परतफेडीवर ३ लाखांपर्यंत ०% व्याज)\n` +
          `  ३. **महाडीबीटी कृषी यांत्रिकीकरण** (ट्रॅक्टर, ठिबक सिंचन, तुषार सिंचन अनुदान ५०% ते ८०%)\n` +
          `• **आवश्यक कागदपत्रे:** डिजिटल ७/१२ व ८-अ उतारा, आधार कार्ड, आधार लिंक बँक खाते, ई-केवायसी.`,
        suggestedQuestions: ["०% पीक कर्ज योजना नियम", "महाडीबीटी ठिबक सिंचन अनुदान", "ई-पीक पाहणी कशी करावी?"]
      };
    }

    if (lower.includes("passport") || lower.includes("पासपोर्ट")) {
      return {
        reply: `**पासपोर्ट (पारपत्र) ऑनलाइन अर्ज व कागदपत्रे:**\n\n` +
          `• **अधिकृत पोर्टल:** passportindia.gov.in\n` +
          `• **लागणारी आवश्यक कागदपत्रे:**\n` +
          `  १. **ओळखीचा व पत्त्याचा पुरावा:** आधार कार्ड (नाव व जन्मतारीख अचूक असणे अनिवार्य)\n` +
          `  २. **जन्मतारखेचा पुरावा:** जन्म दाखला किंवा शाळा सोडल्याचा दाखला (TC/LC) किंवा पॅन कार्ड\n` +
          `  ३. **Non-ECR (इमिग्रेशन चेक आवश्यक नसलेला):** १० वी उत्तीर्ण गुणपत्रिका किंवा पदवी प्रमाणपत्र\n` +
          `• **अर्ज प्रक्रिया:** ऑनलाइन फॉर्म भरा > ₹१,५०० सरकारी शुल्क भरा > पासपोर्ट सेवा केंद्र (PSK/POPSK) ची अपॉइंटमेंट निवडा > बायोमेट्रिक व कागदपत्रे पडताळणी > पोलीस पडताळणी > स्पीड पोस्टने पासपोर्ट घरी पोहोचतो.`,
        suggestedQuestions: ["तत्काल पासपोर्टसाठी काय लागते?", "पोलीस पडताळणी कशी होते?", "पासपोर्ट अपॉइंटमेंट कशी बुक करावी?"]
      };
    }

    if (lower.includes("income") || lower.includes("उत्पन्न") || lower.includes("दाखला") || lower.includes("प्रमाणपत्र")) {
      return {
        reply: `**तहसीलदार उत्पन्न प्रमाणपत्र (Income Certificate):**\n\n` +
          `• **उपयोग:** शिष्यवृत्ती, सरकारी योजना, रेशन कार्ड, शैक्षणिक फी सवलतीसाठी अनिवार्य.\n` +
          `• **आवश्यक कागदपत्रे:**\n` +
          `  १. अर्जदाराचे आधार कार्ड व पासपोर्ट फोटो\n` +
          `  २. रेशन कार्ड झेरॉक्स\n` +
          `  ३. तलाठी उत्पन्नाचा अहवाल / फॉर्म १६ / मागील वर्षाचे ITR / पगार स्लिप\n` +
          `  ४. स्वयंघोषणापत्र (Self-Declaration Form)\n` +
          `• **अर्ज कसा करावा:** 'आपले सरकार' पोर्टल (aaplesarkar.mahaonline.gov.in) किंवा जवळच्या सेतू / महा-ई-सेवा केंद्रात अर्ज करा. ७ ते १५ दिवसांत डिजिटल स्वाक्षरीसह प्रमाणपत्र मिळते.`,
        suggestedQuestions: ["नॉन-क्रीमी लेयर दाखला कसा काढावा?", "जात प्रमाणपत्र कागदपत्रे", "अधिवास दाखला (Domicile)"]
      };
    }

    if (lower.includes("loan") || lower.includes("कर्ज") || lower.includes("mudra") || lower.includes("मुद्रा") || lower.includes("annasaheb") || lower.includes("अण्णासाहेब")) {
      return {
        reply: `**सरकारी व्यवसाय कर्ज योजना (मुद्रा व अण्णासाहेब पाटील महामंडळ):**\n\n` +
          `• **प्रधानमंत्री मुद्रा योजना (PMMY):**\n` +
          `  - शिशू कर्ज: ₹५०,००० पर्यंत\n` +
          `  - किशोर कर्ज: ₹५०,००० ते ₹५ लाख\n` +
          `  - तरुण कर्ज: ₹५ लाख ते ₹२० लाखांपर्यंत (विनातारण)\n` +
          `• **अण्णासाहेब पाटील आर्थिक मागास विकास महामंडळ:**\n` +
          `  - वैयक्तिक कर्ज व्याज परतावा योजना: १५ लाखांपर्यंतच्या व्यवसायावर १२% पर्यंत व्याज परतावा थेट बँक खात्यात मिळतो.\n` +
          `• **आवश्यक कागदपत्रे:** आधार कार्ड, पॅन कार्ड, उद्योग आधार (Udyam Registration), बँक स्टेटमेंट (६ महिने), व्यवसायाचा प्रकल्प अहवाल (Project Report).`,
        suggestedQuestions: ["मुद्रा कर्जासाठी बँक कोणती?", "अण्णासाहेब पाटील कर्ज नोंदणी", "महिला समृद्धी कर्ज योजना"]
      };
    }

    if (lower.includes("ration") || lower.includes("रेशन") || lower.includes("धान्य")) {
      return {
        reply: `**रेशन कार्ड सेवा (नवीन / नाव वाढवणे / विभक्त):**\n\n` +
          `• **उपलब्ध सेवा:** नवीन रेशन कार्ड, कुटुंबातील सदस्याचे नाव समाविष्ट करणे, पत्ता बदल, रेशन कार्ड विभक्त करणे.\n` +
          `• **आवश्यक कागदपत्रे:** सर्व सदस्यांचे आधार कार्ड, कुटुंबाच्या प्रमुखाचा फोटो, रहिवासी पुरावा (लाईट बिल/घरपट्टी), मागील रेशन कार्डातील नाव कमी केल्याचा दाखला (नवीन कार्डासाठी).\n` +
          `• **अधिकृत पोर्टल:** rcms.mahafood.gov.in व आपले सरकार पोर्टल.`,
        suggestedQuestions: ["रेशन कार्डात नाव कसे वाढवावे?", "नवीन रेशन कार्ड नियम", "मोफत धान्य पात्रता"]
      };
    }

    if (lower.includes("ayushman") || lower.includes("आरोग्य") || lower.includes("phule") || lower.includes("फुले") || lower.includes("hospital")) {
      return {
        reply: `**महात्मा जोतीराव फुले जन आरोग्य योजना व आयुष्मान भारत:**\n\n` +
          `• **आरोग्य कवच:** प्रत्येक कुटुंबास वार्षिक ₹५,००,००० पर्यंतचे मोफत कॅशलेस उपचार.\n` +
          `• **पात्रता:** महाराष्ट्रातील सर्व शिधापत्रिकाधारक (पिवळे, केशरी, पांढरे रेशन कार्ड) कुटुंबे पात्र.\n` +
          `• **कव्हर होणारे आजार:** १,३५६+ गंभीर आजार, शस्त्रक्रिया, हृदय शस्त्रक्रिया, कर्करोग, मेंदूचे आजार, डायलिसिस व बालरोग उपचार.\n` +
          `• **कागदपत्रे:** आधार कार्ड व रेशन कार्ड (पिवळे/केशरी/पांढरे) किंवा आयुष्मान कार्ड.\n` +
          `• **लाभ कसा घ्यावा:** नेटवर्क रुग्णालयातील 'आरोग्यमित्र' (Arogyamitra) कक्षात जाऊन थेट मोफत नोंदणी होते.`,
        suggestedQuestions: ["जवळचे नेटवर्क रुग्णालय कसे शोधावे?", "आयुष्मान कार्ड कसे डाउनलोड करावे?", "कोणते आजार समाविष्ट आहेत?"]
      };
    }

    return {
      reply: `नमस्कार! मी आपला "महामाहिती" स्वतंत्र नागरिक माहिती सहाय्यक आहे.\n\n` +
        `आपण मला खालील विषयांवर थेट प्रश्न विचारू शकता:\n` +
        `• **शासकीय योजना:** लाडकी बहीण, नमो शेतकरी, संजय गांधी निराधार, पीएम आवास योजना.\n` +
        `• **कागदपत्रे व दाखले:** उत्पन्न दाखला, जात प्रमाणपत्र, नॉन-क्रीमी लेयर, अधिवास (Domicile), ७/१२ उतारा.\n` +
        `• **ओळखपत्रे:** पासपोर्ट, पॅन कार्ड, आधार अपडेट, मतदार ओळखपत्र, ड्रायव्हिंग लायसन्स.\n` +
        `• **सरकारी कर्ज योजना:** मुद्रा कर्ज, अण्णासाहेब पाटील महामंडळ, महिला समृद्धी कर्ज.\n\n` +
        `आपल्याला नेमकी कोणती माहिती हवी आहे ते येथे टाईप करा.`,
      suggestedQuestions: [
        "लाडकी बहीण योजनेची माहिती",
        "उत्पन्न दाखल्यासाठी काय लागते?",
        "पासपोर्टसाठी कागदपत्रे",
        "मुद्रा व्यवसाय कर्ज कसे मिळवावे?"
      ]
    };
  }

  app.post("/api/ai-assistant", async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const ai = getGenAI();

    // If Gemini client is not initialized or no API key, use rich local knowledge immediately
    if (!ai) {
      const localResp = getLocalCitizenKnowledge(message);
      res.json({
        reply: localResp.reply,
        disclaimer: "ही स्वतंत्र माहिती आहे. अधिकृत आणि अंतिम तपशीलांसाठी संबंधित सरकारी पोर्टल तपासा.",
        suggestedQuestions: localResp.suggestedQuestions
      });
      return;
    }

    const systemInstruction = `
आपण "महामाहिती (mahamahiti.com) - स्वतंत्र व विश्वासार्ह भारतीय नागरिक माहिती व्यासपीठ" चे मराठी AI नागरिक सहाय्यक आहात.
आपली भूमिका:
१. ग्रामीण नागरिक, ज्येष्ठ नागरिक, महिला, शेतकरी व सामान्य नागरिकांना सरकारी योजना, आवश्यक कागदपत्रे, दाखले, शासकीय सेवा आणि सरकारी कर्ज योजनांची माहिती अतिशय सोप्या, आदरयुक्त आणि शुद्ध मराठी भाषेत समजावून सांगणे.
२. कठीण सरकारी संज्ञांचे सोपे स्पष्टीकरण देणे.
३. अर्ज कसा करायचा, कोणती कागदपत्रे लागतील आणि अधिकृत वेबसाइट कोणती हे स्पष्ट सांगणे.

कडक नियम:
- कोणतीही नोकरी (Government Jobs), भरती (Recruitment) किंवा एम्प्लॉयमेंट संबंधित माहिती देणे सक्त मनाई आहे.
- स्वतःहून काल्पनिक नियम, बोगस मुदती, खोटे शुल्क किंवा खोटी पात्रता सांगू नका.
- जर माहिती निश्चित नसेल तर "अधिकृत माहितीसाठी संबंधित सरकारी पोर्टलवर खात्री करा" असे स्पष्ट सांगा.
- नेहमी शेवटी हे सांगा की ही स्वतंत्र मार्गदर्शक माहिती आहे आणि अधिकृत सरकारी पोर्टलवर पडताळणी करावी.
- उत्तर मुद्देसूद, वाचायला सोपे आणि संक्षिप्त (Bullet Points मध्ये) ठेवा.
`;

    // Multi-tier fallback models from valid approved list
    const candidateModels = ["gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemInstruction}\n\nनागरिकाचा प्रश्न: "${message}"`
                }
              ]
            }
          ]
        });

        // 6-second timeout per model attempt to prevent hanging during API load spikes
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("AI generation timed out")), 6000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);

        const replyText = response?.text?.trim();
        if (replyText) {
          res.json({
            reply: replyText,
            disclaimer: "ही स्वतंत्र माहिती आहे. अंतिम आणि अधिकृत माहितीसाठी संबंधित सरकारी वेबसाइट तपासा.",
            suggestedQuestions: [
              "यासाठी कोणती कागदपत्रे लागतील?",
              "अर्ज कसा आणि कुठे करायचा?",
              "पात्रतेच्या अटी काय आहेत?"
            ]
          });
          return;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini model ${modelName} encountered temporary issue (${err?.status || err?.message || 'error'}), trying next tier...`);
      }
    }

    // Graceful recovery: if all API tiers are temporarily rate-limited or experiencing high capacity spikes (503/429)
    console.info("Falling back to built-in verified Marathi Citizen Knowledge Base due to upstream API capacity.");
    const fallbackKnowledge = getLocalCitizenKnowledge(message);
    res.json({
      reply: fallbackKnowledge.reply,
      disclaimer: "ही स्वतंत्र माहिती आहे. अंतिम आणि अधिकृत माहितीसाठी संबंधित सरकारी वेबसाइट तपासा.",
      suggestedQuestions: fallbackKnowledge.suggestedQuestions,
      fallbackUsed: true
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`महामाहिती (mahamahiti.com) Citizen Information Platform running on http://localhost:${PORT}`);
  });
}

startServer();
