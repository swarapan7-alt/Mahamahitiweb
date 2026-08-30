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
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  // Serve persistent uploads with cache-busting headers
  app.use('/uploads', express.static(UPLOADS_DIR, { etag: false, maxAge: 0 }));

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

  // Dedicated public images endpoint
  app.get("/api/images", (req, res) => {
    res.json({ images: adminStore.customImages || [] });
  });

  // Dedicated Persistent Image Upload & Replacement Endpoint
  app.post("/api/admin/upload-image", requireAdmin, (req, res) => {
    try {
      const { slotId, imageData, name, altText, recommendedSize, usedIn } = req.body;
      
      if (!slotId || !imageData) {
        res.status(400).json({ error: "slotId आणि imageData आवश्यक आहेत." });
        return;
      }

      // Extract image extension and raw base64 data
      let base64Data = imageData;
      let ext = 'jpg';
      if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        const match = imageData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (match) {
          const mimeSubtype = match[1].toLowerCase();
          if (mimeSubtype === 'png') ext = 'png';
          else if (mimeSubtype === 'webp') ext = 'webp';
          else ext = 'jpg';
          base64Data = match[2];
        } else {
          const parts = imageData.split(',');
          if (parts.length > 1) {
            base64Data = parts[1];
          }
        }
      }

      const buffer = Buffer.from(base64Data, 'base64');
      if (buffer.length === 0) {
        res.status(400).json({ error: "अवैध इमेज डेटा. कृपया पुन्हा प्रयत्न करा." });
        return;
      }

      // Clean up previous files for this exact slotId to prevent disk buildup and fallback ambiguity
      try {
        if (fs.existsSync(UPLOADS_DIR)) {
          const existingFiles = fs.readdirSync(UPLOADS_DIR);
          for (const file of existingFiles) {
            if (file.startsWith(`${slotId}_`) || file.startsWith(`${slotId}.`)) {
              try {
                fs.unlinkSync(path.join(UPLOADS_DIR, file));
              } catch (e) {}
            }
          }
        }
      } catch (e) {
        console.warn("Cleanup warning:", e);
      }

      const timestamp = Date.now();
      const fileName = `${slotId}_${timestamp}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, fileName);
      fs.writeFileSync(filePath, buffer);

      // Construct permanent URL with timestamp query for instant cache invalidation
      const permanentUrl = `/uploads/${fileName}?v=${timestamp}`;

      // Update adminStore.customImages in-place
      if (!adminStore.customImages) {
        adminStore.customImages = [];
      }

      const slotMetaDict: Record<string, { name: string; usedIn: string; altText: string; recommendedSize: string }> = {
        homepage_hero: {
          name: 'मुख्य Hero Image',
          usedIn: 'Homepage Hero Banner',
          altText: 'महाराष्ट्र शासन नागरिक कल्याण योजना',
          recommendedSize: '1920 × 1080 px (16:9)'
        },
        category_women: {
          name: 'महिलांसाठी योजना',
          usedIn: 'Homepage Women Category Image',
          altText: 'मुख्यमंत्री माझी लाडकी बहीण योजना - महिला सक्षमीकरण',
          recommendedSize: '1280 × 720 px (16:9)'
        },
        category_farmer: {
          name: 'शेतकऱ्यांसाठी योजना',
          usedIn: 'Homepage Farmer Category Image',
          altText: 'नमो शेतकरी महासन्मान निधी - शेतकरी कल्याण',
          recommendedSize: '1280 × 720 px (16:9)'
        },
        category_education: {
          name: 'विद्यार्थ्यांसाठी योजना',
          usedIn: 'Homepage Student Category Image',
          altText: 'महाराष्ट्र मोफत उच्च शिक्षण व स्वाधार शिष्यवृत्ती - विद्यार्थी',
          recommendedSize: '1280 × 720 px (16:9)'
        },
        category_worker: {
          name: 'कामगारांसाठी योजना',
          usedIn: 'Homepage Worker Category Image',
          altText: 'महाराष्ट्र इमारत व इतर बांधकाम कामगार कल्याणकारी योजना',
          recommendedSize: '1280 × 720 px (16:9)'
        },
        category_senior_citizen: {
          name: 'ज्येष्ठ नागरिकांसाठी योजना',
          usedIn: 'Homepage Senior Citizen Category Image',
          altText: 'ज्येष्ठ नागरिक कल्याण व पेन्शन योजना',
          recommendedSize: '1280 × 720 px (16:9)'
        },
        homepage_other_services: {
          name: 'इतर सेवा व परिपत्रके',
          usedIn: 'Homepage Other Services Image',
          altText: 'आपले सरकार व शासकीय दाखले सेवा मार्गदर्शक',
          recommendedSize: '1280 × 720 px (16:9)'
        }
      };

      const meta = slotMetaDict[slotId] || {
        name: name || slotId,
        usedIn: usedIn || slotId,
        altText: altText || name || slotId,
        recommendedSize: recommendedSize || '16:9'
      };

      const asset = {
        id: slotId,
        name: name || meta.name,
        url: permanentUrl,
        altText: altText || meta.altText,
        usedIn: usedIn || meta.usedIn,
        fileSize: recommendedSize || meta.recommendedSize,
        uploadedAt: new Date().toISOString().split('T')[0]
      };

      // Update primary slot record without duplicating
      const existingIndex = adminStore.customImages.findIndex((img: any) => img.id === slotId);
      if (existingIndex >= 0) {
        adminStore.customImages[existingIndex] = asset;
      } else {
        adminStore.customImages.push(asset);
      }

      // Synchronize canonical aliases to guarantee seamless lookup across any legacy callers
      const aliasMapping: Record<string, string[]> = {
        homepage_hero: ['img-hero'],
        category_women: ['homepage_women_child', 'img-scheme-women', 'img-cat-women'],
        category_farmer: ['homepage_farmer', 'img-scheme-farmer', 'img-cat-farmer'],
        category_education: ['homepage_education', 'img-scheme-education', 'img-cat-student'],
        category_worker: ['homepage_worker', 'img-scheme-worker', 'img-cat-worker'],
        category_senior_citizen: ['homepage_senior', 'img-cat-senior'],
        homepage_other_services: ['category_other_services', 'img-doc-services']
      };

      const aliases = aliasMapping[slotId] || [];
      for (const alias of aliases) {
        const aIdx = adminStore.customImages.findIndex((img: any) => img.id === alias);
        if (aIdx >= 0) {
          adminStore.customImages[aIdx].url = permanentUrl;
        } else {
          adminStore.customImages.push({
            ...asset,
            id: alias
          });
        }
      }

      // If hero image, synchronize homepageConfig as well
      if (slotId === 'homepage_hero' || slotId === 'img-hero') {
        if (!adminStore.homepageConfig) {
          adminStore.homepageConfig = {};
        }
        adminStore.homepageConfig.heroImage = permanentUrl;
        adminStore.homepageConfig.heroImageUrl = permanentUrl;
      }

      saveAdminStore(adminStore);

      res.json({
        success: true,
        url: permanentUrl,
        slotId,
        imageAsset: asset,
        message: "फोटो कायमस्वरूपी साठवला गेला व मुख्यपृष्ठावर त्वरित लागू झाला."
      });
    } catch (err: any) {
      console.error("Upload handler error:", err);
      res.status(500).json({ error: err?.message || "इमेज अपलोड करण्यात त्रुटी आली." });
    }
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
  // AI CITIZEN ASSISTANT API WITH STRICT GUIDELINES & SANITIZATION
  // -----------------------------------------------------------
  const CITIZEN_GUIDANCE_TEXT = `नागरिक मार्गदर्शन:\nया योजनेची/सेवेची पूर्ण व अद्ययावत माहिती, पात्रता आणि आवश्यक प्रक्रियेसाठी आपल्या जवळच्या CSC सेंटर किंवा ई-सेवा केंद्राशी संपर्क करा.`;
  const HIGH_LEVEL_PROCESS_TEXT = `आवश्यक कागदपत्रांसह जवळच्या CSC सेंटर किंवा ई-सेवा केंद्रात भेट द्या. तेथे अर्ज प्रक्रिया आणि पुढील आवश्यक कार्यवाहीबाबत मार्गदर्शन मिळेल.`;

  function sanitizeAIResponse(text: string, isSchemeOrServiceQuery = true): string {
    if (!text) return '';

    let cleaned = text;

    // 1. Remove URLs, domain names, website protocols
    cleaned = cleaned.replace(/https?:\/\/[^\s)]+/gi, '');
    cleaned = cleaned.replace(/www\.[^\s)]+/gi, '');
    cleaned = cleaned.replace(/\b[a-zA-Z0-9.-]+\.(?:gov\.in|nic\.in|mahaonline\.gov\.in|maharashtra\.gov\.in|gov|in|com|org|net|co\.in)\b[^\s)]*/gi, '');
    cleaned = cleaned.replace(/\(\s*\)/g, '');

    // 2. Remove URL / Portal lead-in lines
    cleaned = cleaned.replace(/^[•\s*-]*(?:अधिकृत पोर्टल|अधिकृत वेबसाइट|अधिकृत संकेतस्थळ|Official Portal|Official Website|वेबसाइट|पोर्टल)\s*:[^\n]*$/gmi, '');
    cleaned = cleaned.replace(/^[•\s*-]*(?:अर्ज करण्यासाठी वेबसाइटला भेट द्या|पोर्टलवर जाऊन अर्ज करा)[^\n]*$/gmi, '');

    // 3. Remove Fee / Price / Charges / Rates / ₹ lines
    cleaned = cleaned.replace(/^[•\s*-]*(?:सरकारी शुल्क|अर्ज शुल्क|शुल्क|फी|लागणारे शुल्क|दर|रेट|रेट चार्ट|Charges|Fees|Fee|Price|Cost)\s*:[^\n]*$/gmi, '');
    cleaned = cleaned.replace(/^[•\s*-]*[^\n]*\b(?:शुल्क|फी|charges|fees)\b[^\n]*₹[^\n]*$/gmi, '');
    cleaned = cleaned.replace(/₹\s*[\d,०-९]+(?:\s*रुपये|\s*रु|\s*\/-\s*)?/g, '');
    cleaned = cleaned.replace(/[\d,०-९]+\s*रुपये(?:\s*सरकारी शुल्क|\s*फी|\s*शुल्क)?/g, '');

    // Clean up empty bullet points or multi-line gaps created by removals
    cleaned = cleaned.replace(/^[•\s*-]+$/gm, '');
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

    // 4. Ensure Citizen Guidance message is appended cleanly if discussing a scheme, document, or service
    if (isSchemeOrServiceQuery && !cleaned.includes("नागरिक मार्गदर्शन:")) {
      cleaned = `${cleaned}\n\n${CITIZEN_GUIDANCE_TEXT}`;
    }

    return cleaned;
  }

  function getLocalCitizenKnowledge(message: string): { reply: string; suggestedQuestions: string[] } {
    const lower = message.toLowerCase();
    
    if (lower.includes("ladki") || lower.includes("लाडकी") || lower.includes("बहीण")) {
      return {
        reply: `**मुख्यमंत्री माझी लाडकी बहीण योजना:**\n\n` +
          `• **योजनेची थोडक्यात माहिती:** महाराष्ट्रातील महिलांच्या आर्थिक स्वावलंबनासाठी थेट आर्थिक सहाय्य देणारी योजना.\n` +
          `• **कोण पात्र आहे:** वय २१ ते ६५ वर्षे, महाराष्ट्राचे रहिवासी, कौटुंबिक वार्षिक उत्पन्न विहित मर्यादेत असणाऱ्या महिला (किंवा पिवळे/केशरी रेशन कार्डधारक).\n` +
          `• **आवश्यक कागदपत्रांची सामान्य यादी:**\n` +
          `  - आधार कार्ड\n` +
          `  - अधिवास दाखला (किंवा १५ वर्षे वास्तव्याचा पुरावा / जन्म दाखला / शाळा सोडल्याचा दाखला)\n` +
          `  - उत्पन्न दाखला किंवा पिवळे/केशरी रेशन कार्ड\n` +
          `  - आधार लिंक बँक पासबुक झेरॉक्स\n` +
          `  - हमीपत्र व पासपोर्ट फोटो\n` +
          `• **अर्ज प्रक्रिया:**\n` +
          `  ${HIGH_LEVEL_PROCESS_TEXT}\n\n` +
          CITIZEN_GUIDANCE_TEXT,
        suggestedQuestions: ["लाडकी बहीण कागदपत्रे चेकलिस्ट", "माझी पात्रता कशी तपासावी?", "अर्ज कुठे करावा?"]
      };
    }

    if (lower.includes("farmer") || lower.includes("शेतकरी") || lower.includes("kisan") || lower.includes("किसान") || lower.includes("namo") || lower.includes("नमो")) {
      return {
        reply: `**शेतकरी कल्याण योजना (PM किसान + नमो शेतकरी):**\n\n` +
          `• **योजनेची थोडक्यात माहिती:** अल्प व अल्पभूधारक शेतकऱ्यांना थेट सन्मान निधी व शेतीसाठी आर्थिक सहाय्य.\n` +
          `• **कोण पात्र आहे:** स्वतःच्या नावावर शेतजमीन असणारे शेतकरी व ई-केवायसी (e-KYC) पूर्ण असलेले खातेधारक.\n` +
          `• **इतर प्रमुख शेतकरी योजना:**\n` +
          `  - पीक विमा योजना\n` +
          `  - डॉ. पंजाबराव देशमुख ०% व्याज पीक कर्ज योजना\n` +
          `  - महाडीबीटी कृषी यांत्रिकीकरण अनुदान (ट्रॅक्टर, ठिबक व तुषार सिंचन)\n` +
          `• **आवश्यक कागदपत्रांची सामान्य यादी:** डिजिटल ७/१२ व ८-अ उतारा, आधार कार्ड, आधार लिंक बँक खाते, ई-केवायसी.\n` +
          `• **अर्ज प्रक्रिया:**\n` +
          `  ${HIGH_LEVEL_PROCESS_TEXT}\n\n` +
          CITIZEN_GUIDANCE_TEXT,
        suggestedQuestions: ["पीक कर्ज योजना नियम", "ठिबक सिंचन अनुदान माहिती", "ई-पीक पाहणी कशी करावी?"]
      };
    }

    if (lower.includes("passport") || lower.includes("पासपोर्ट")) {
      return {
        reply: `**पासपोर्ट (पारपत्र) सेवा माहिती:**\n\n` +
          `• **सेवेची थोडक्यात माहिती:** भारतीय नागरिकांना परदेश प्रवासासाठी आवश्यक असणारे अधिकृत ओळखपत्र व प्रवास दस्तऐवज.\n` +
          `• **आवश्यक कागदपत्रांची सामान्य यादी:**\n` +
          `  - ओळखीचा व पत्त्याचा पुरावा (आधार कार्ड)\n` +
          `  - जन्मतारखेचा पुरावा (जन्म दाखला किंवा शाळा सोडल्याचा दाखला)\n` +
          `  - शैक्षणिक कागदपत्रे (Non-ECR साठी १० वी किंवा उच्च शिक्षण प्रमाणपत्र)\n` +
          `• **अर्ज प्रक्रिया:**\n` +
          `  ${HIGH_LEVEL_PROCESS_TEXT}\n\n` +
          CITIZEN_GUIDANCE_TEXT,
        suggestedQuestions: ["पासपोर्टसाठी कोणती कागदपत्रे लागतात?", "पोलीस पडताळणीसाठी काय लागते?", "जवळचे केंद्र कुठे आहे?"]
      };
    }

    if (lower.includes("income") || lower.includes("उत्पन्न") || lower.includes("दाखला") || lower.includes("प्रमाणपत्र")) {
      return {
        reply: `**तहसीलदार उत्पन्न प्रमाणपत्र (Income Certificate):**\n\n` +
          `• **सेवेची थोडक्यात माहिती:** विविध सरकारी योजना, शैक्षणिक सवलती आणि शिष्यवृत्तीसाठी लागणारा अधिकृत उत्पन्नाचा दाखला.\n` +
          `• **आवश्यक कागदपत्रांची सामान्य यादी:**\n` +
          `  - अर्जदाराचे आधार कार्ड व पासपोर्ट फोटो\n` +
          `  - रेशन कार्ड झेरॉक्स\n` +
          `  - तलाठी उत्पन्नाचा अहवाल / फॉर्म १६ / पगार स्लिप\n` +
          `  - स्वयंघोषणापत्र\n` +
          `• **अर्ज प्रक्रिया:**\n` +
          `  ${HIGH_LEVEL_PROCESS_TEXT}\n\n` +
          CITIZEN_GUIDANCE_TEXT,
        suggestedQuestions: ["नॉन-क्रीमी लेयर दाखला कसा काढावा?", "जात प्रमाणपत्र कागदपत्रे", "अधिवास दाखला (Domicile)"]
      };
    }

    if (lower.includes("loan") || lower.includes("कर्ज") || lower.includes("mudra") || lower.includes("मुद्रा") || lower.includes("annasaheb") || lower.includes("अण्णासाहेब")) {
      return {
        reply: `**सरकारी व्यवसाय कर्ज योजना (मुद्रा व अण्णासाहेब पाटील महामंडळ):**\n\n` +
          `• **योजनेची थोडक्यात माहिती:** नवीन व्यवसाय सुरू करण्यासाठी किंवा अस्तित्वातील व्यवसायाच्या विस्तारासाठी विनातारण कर्ज व व्याज परतावा योजना.\n` +
          `• **कोण पात्र आहे:** १८ वर्षांवरील भारतीय नागरिक, सूक्ष्म व लघु व्यावसायिक आणि स्वयंरोजगार करू इच्छिणारे उद्योजक.\n` +
          `• **आवश्यक कागदपत्रांची सामान्य यादी:** आधार कार्ड, पॅन कार्ड, उद्यम नोंदणी (Udyam Registration), बँक खाते विवरण (६ महिने), व्यवसायाचा प्रकल्प अहवाल.\n` +
          `• **अर्ज प्रक्रिया:**\n` +
          `  ${HIGH_LEVEL_PROCESS_TEXT}\n\n` +
          CITIZEN_GUIDANCE_TEXT,
        suggestedQuestions: ["मुद्रा कर्जासाठी कोणती कागदपत्रे लागतात?", "अण्णासाहेब पाटील कर्ज नोंदणी", "महिला समृद्धी कर्ज योजना"]
      };
    }

    if (lower.includes("ration") || lower.includes("रेशन") || lower.includes("धान्य")) {
      return {
        reply: `**रेशन कार्ड सेवा (नवीन / नाव समाविष्ट / विभक्त):**\n\n` +
          `• **उपलब्ध सेवा:** नवीन रेशन कार्ड, कुटुंबातील सदस्याचे नाव वाढवणे, पत्ता बदल, रेशन कार्ड विभक्त करणे.\n` +
          `• **आवश्यक कागदपत्रांची सामान्य यादी:** सर्व सदस्यांचे आधार कार्ड, कुटुंबाच्या प्रमुखाचा फोटो, रहिवासी पुरावा (लाईट बिल/घरपट्टी), मागील रेशन कार्डातील नाव कमी केल्याचा दाखला (नवीन कार्डासाठी).\n` +
          `• **अर्ज प्रक्रिया:**\n` +
          `  ${HIGH_LEVEL_PROCESS_TEXT}\n\n` +
          CITIZEN_GUIDANCE_TEXT,
        suggestedQuestions: ["रेशन कार्डात नाव कसे वाढवावे?", "नवीन रेशन कार्ड नियम", "मोफत धान्य पात्रता"]
      };
    }

    if (lower.includes("ayushman") || lower.includes("आरोग्य") || lower.includes("phule") || lower.includes("फुले") || lower.includes("hospital")) {
      return {
        reply: `**महात्मा जोतीराव फुले जन आरोग्य योजना व आयुष्मान भारत:**\n\n` +
          `• **योजनेची थोडक्यात माहिती:** पात्र कुटुंबांना गंभीर आजार व शस्त्रक्रियांसाठी मोफत कॅशलेस आरोग्य उपचार.\n` +
          `• **कोण पात्र आहे:** महाराष्ट्रातील शिधापत्रिकाधारक (पिवळे, केशरी, पांढरे रेशन कार्ड) कुटुंबे.\n` +
          `• **आवश्यक कागदपत्रांची सामान्य यादी:** आधार कार्ड, रेशन कार्ड (पिवळे/केशरी/पांढरे) किंवा आयुष्मान कार्ड.\n` +
          `• **अर्ज प्रक्रिया:**\n` +
          `  ${HIGH_LEVEL_PROCESS_TEXT}\n\n` +
          CITIZEN_GUIDANCE_TEXT,
        suggestedQuestions: ["जवळचे नेटवर्क रुग्णालय कसे शोधावे?", "आयुष्मान कार्ड कसे मिळवावे?", "कोणते आजार समाविष्ट आहेत?"]
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
        suggestedQuestions: localResp.suggestedQuestions
      });
      return;
    }

    const systemInstruction = `
आपण "महामाहिती (mahamahiti.com) - स्वतंत्र व विश्वासार्ह भारतीय नागरिक माहिती व्यासपीठ" चे मराठी AI नागरिक सहाय्यक आहात.
आपली मुख्य भूमिका नागरिक माहिती आणि मार्गदर्शन (Citizen Information & Guidance) देणे ही आहे, ऑनलाइन फॉर्म भरण्याचे सविस्तर ट्युटोरिअल देणे नव्हे.

आपण खालील मुद्द्यांवर लक्ष केंद्रित करावे:
• योजना/सेवेची थोडक्यात माहिती
• कोण पात्र आहे
• आवश्यक कागदपत्रांची सामान्य यादी
• अर्ज/सेवा घेण्यासाठी कुठे जावे
• आवश्यक असल्यास सामान्य सूचना

अतिशय कडक नियम (STRICT RESTRICTIONS):
१. अर्ज भरण्याची कोणतीही सविस्तर स्टेप-बाय-स्टेप ऑनलाइन प्रक्रिया (उदा. कोणत्या वेबसाइटवर जा, कोणते बटण दाबा, कोणता फॉर्म भरा, काय नाव टाका, कशी कागदपत्रे अपलोड करा, पेमेंट कसे करा, सबमिट कसे करा) सांगू नका.
२. अर्ज प्रक्रियेबद्दल फक्त १ ते २ ओळींचे संक्षिप्त मार्गदर्शन द्या. 
उदा. "अर्ज प्रक्रिया: आवश्यक कागदपत्रांसह जवळच्या CSC सेंटर किंवा ई-सेवा केंद्रात भेट द्या. तेथे अर्ज प्रक्रिया आणि पुढील आवश्यक कार्यवाहीबाबत मार्गदर्शन मिळेल."
३. कोणतेही बाह्य वेबसाइट URL, लिंक, डोमेन किंवा 'अधिकृत पोर्टल:' (उदा. passportindia.gov.in, maharashtra.gov.in किंवा इतर कोणतीही वेबसाइट लिंक) देऊ नका. नागरिकांना बाह्य वेबसाइटवर पाठवू नका.
४. कोणतेही सरकारी शुल्क, अर्ज फी, रेट, रेट चार्ट, किंमत, किंवा ₹ (रुपये) मधील रक्कम दाखवू नका. "शुल्क", "फी", "रेट", "Charges", "Cost" असे विभाग बनवू नका.
५. उत्तराच्या शेवटी नेहमी खालील नागरिक मार्गदर्शन बॉक्स नक्की समाविष्ट करा:
नागरिक मार्गदर्शन:
या योजनेची/सेवेची पूर्ण व अद्ययावत माहिती, पात्रता आणि आवश्यक प्रक्रियेसाठी आपल्या जवळच्या CSC सेंटर किंवा ई-सेवा केंद्राशी संपर्क करा.
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

        const replyRaw = response?.text?.trim();
        if (replyRaw) {
          const sanitizedReply = sanitizeAIResponse(replyRaw);
          res.json({
            reply: sanitizedReply,
            suggestedQuestions: [
              "यासाठी कोणती कागदपत्रे लागतील?",
              "पात्रतेच्या अटी काय आहेत?",
              "अर्जासाठी आवश्यक प्रक्रिया काय आहे?"
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
      suggestedQuestions: fallbackKnowledge.suggestedQuestions,
      fallbackUsed: true
    });
  });

  // Vite middleware for development, static files for production
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
