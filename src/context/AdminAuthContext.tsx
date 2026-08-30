import React, { createContext, useContext, useState, useEffect } from 'react';
import { SCHEMES_DATA } from '../data/schemes';
import { DOCUMENTS_DATA } from '../data/documents';
import { SERVICES_DATA } from '../data/services';
import { UPDATES_DATA } from '../data/updates';
import { FAQS_DATA } from '../data/faqs';
import { SITE_CONFIG } from '../data/siteConfig';
import { SchemeItem, DocumentItem, GovernmentService, LatestUpdate, FAQItem, HomepageConfig, ImageAsset, AdminSettings } from '../types';

export const HOMEPAGE_IMAGE_KEYS = {
  HERO: 'homepage_hero',
  WOMEN_CHILD: 'homepage_women_child',
  FARMER: 'homepage_farmer',
  EDUCATION: 'homepage_education',
  HEALTH: 'homepage_health',
  OTHER_SERVICES: 'homepage_other_services',
  CATEGORY_WOMEN: 'category_women',
  CATEGORY_FARMER: 'category_farmer',
  CATEGORY_EDUCATION: 'category_education',
  CATEGORY_HEALTH: 'category_health',
  CATEGORY_SENIOR: 'category_senior_citizen',
  CATEGORY_OTHER: 'category_other_services',
} as const;

export type HomepageImageKey = typeof HOMEPAGE_IMAGE_KEYS[keyof typeof HOMEPAGE_IMAGE_KEYS];

export interface AdminAuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  isFirstLogin: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  
  // Data
  schemes: SchemeItem[];
  documents: DocumentItem[];
  services: GovernmentService[];
  updates: LatestUpdate[];
  faqs: FAQItem[];
  images: ImageAsset[];
  homepageConfig: HomepageConfig;
  settings: AdminSettings;
  
  // Helper
  getImageByKey: (key: string, defaultUrl?: string) => string;

  // CRUD Methods
  saveScheme: (scheme: SchemeItem) => Promise<void>;
  deleteScheme: (id: string) => Promise<void>;
  toggleSchemeStatus: (id: string, status: 'published' | 'draft' | 'unpublished') => Promise<void>;
  
  saveDocument: (doc: DocumentItem) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  toggleDocumentStatus: (id: string, status: 'published' | 'draft' | 'unpublished') => Promise<void>;
  
  saveService: (service: GovernmentService) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string, status: 'published' | 'draft' | 'unpublished') => Promise<void>;
  
  saveUpdate: (update: LatestUpdate) => Promise<void>;
  deleteUpdate: (id: string) => Promise<void>;
  
  saveFaq: (faq: FAQItem) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  
  saveImage: (image: ImageAsset) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  
  saveHomepageConfig: (config: HomepageConfig) => Promise<void>;
  saveSettings: (settings: AdminSettings) => Promise<void>;
  
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  heroImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=85',
  heroImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=85',
  heroImageAlt: 'महाराष्ट्र शासन नागरिक कल्याण योजना व मार्गदर्शन',
  heroHeading: 'सरकारी योजना व कागदपत्रांची अचूक माहिती, आपल्या सोप्या भाषेत',
  heroSupportingText: 'महाराष्ट्रातील सर्व कल्याणकारी योजना, आवश्यक दाखले, डिजिटल सेवा आणि अर्जाची थेट अधिकृत माहिती मिळवा एकाच ठिकाणी.',
  primaryCtaText: 'योजना शोधा',
  primaryCtaLink: 'schemes',
  secondaryCtaText: 'कागदपत्रे तपासा',
  secondaryCtaLink: 'documents',
  featuredSchemeIds: ['ladki-bahin-yojana', 'namo-shetkari-mahasamman', 'mahadbt-post-matric-scholarship'],
  featuredLatestIds: ['up-1', 'up-2', 'up-3'],
  status: 'published',
  lastUpdated: new Date().toLocaleDateString('mr-IN')
};

const DEFAULT_IMAGES: ImageAsset[] = [
  {
    id: 'homepage_hero',
    name: 'मुख्यपृष्ठ Hero Banner',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=85',
    altText: 'महाराष्ट्र शासन नागरिक कल्याण योजना',
    usedIn: 'मुख्यपृष्ठ Hero Banner',
    fileSize: '1920 × 1080 px (16:9)',
    uploadedAt: '२०२६-०१-१०'
  },
  {
    id: 'homepage_women_child',
    name: 'महिला व बाल विकास योजना (लाडकी बहीण इ.)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    altText: 'मुख्यमंत्री माझी लाडकी बहीण योजना - महिला सक्षमीकरण',
    usedIn: 'महिला व बाल विकास योजना',
    fileSize: '1200 × 675 px (16:9)',
    uploadedAt: '२०२६-०१-१२'
  },
  {
    id: 'homepage_farmer',
    name: 'शेतकरी कल्याण योजना (नमो शेतकरी, पीक विमा इ.)',
    url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    altText: 'नमो शेतकरी महासन्मान निधी / सौर कृषी पंप योजना - शेतकरी कल्याण',
    usedIn: 'शेतकरी कल्याण योजना',
    fileSize: '1200 × 675 px (16:9)',
    uploadedAt: '२०२६-०१-१५'
  },
  {
    id: 'homepage_education',
    name: 'शिक्षण योजना (शिष्यवृत्ती, मोफत उच्च शिक्षण इ.)',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    altText: 'महाराष्ट्र मोफत उच्च शिक्षण व स्वाधार शिष्यवृत्ती योजना - विद्यार्थी',
    usedIn: 'शिक्षण योजना',
    fileSize: '1200 × 675 px (16:9)',
    uploadedAt: '२०२६-०१-१८'
  },
  {
    id: 'homepage_health',
    name: 'आरोग्य योजना (महात्मा फुले जन आरोग्य, आयुष्यमान भारत)',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    altText: 'महात्मा जोतीराव फुले जन आरोग्य योजना - आरोग्य सेवा',
    usedIn: 'आरोग्य योजना',
    fileSize: '1200 × 675 px (16:9)',
    uploadedAt: '२०२६-०१-२०'
  },
  {
    id: 'category_senior_citizen',
    name: 'ज्येष्ठ नागरिक योजना (श्रावणबाळ पेन्शन इ.)',
    url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=80',
    altText: 'ज्येष्ठ नागरिक कल्याण व पेन्शन योजना',
    usedIn: 'ज्येष्ठ नागरिक योजना',
    fileSize: '1200 × 675 px (16:9)',
    uploadedAt: '२०२६-०१-२२'
  },
  {
    id: 'homepage_other_services',
    name: 'इतर सेवा (आपले सरकार, डिजिटल दाखले व नागरिक सेवा)',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    altText: 'आपले सरकार व शासकीय दाखले सेवा मार्गदर्शक',
    usedIn: 'इतर सेवा व परिपत्रके',
    fileSize: '1200 × 675 px (16:9)',
    uploadedAt: '२०२६-०२-०१'
  }
];

const DEFAULT_SETTINGS: AdminSettings = {
  websiteName: SITE_CONFIG.name,
  websiteDescription: SITE_CONFIG.description,
  domain: SITE_CONFIG.domain,
  logoText: SITE_CONFIG.name,
  faviconUrl: '/favicon.ico',
  whatsappContactNumber: '',
  whatsappShareNote: 'सर्व योजना व कागदपत्रांची अधिकृत माहिती मिळवण्यासाठी महामाहिती पोर्टलला भेट द्या.',
  socialLinks: {},
  contactEmail: SITE_CONFIG.contactEmail,
  defaultSeoTitle: `${SITE_CONFIG.name} - सरकारी योजना, कागदपत्रे व शासकीय सेवा`,
  defaultSeoDescription: SITE_CONFIG.description
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mahamahiti_admin_token'));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('mahamahiti_admin_username'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Content state
  const [schemes, setSchemes] = useState<SchemeItem[]>(SCHEMES_DATA);
  const [documents, setDocuments] = useState<DocumentItem[]>(DOCUMENTS_DATA);
  const [services, setServices] = useState<GovernmentService[]>(SERVICES_DATA);
  const [updates, setUpdates] = useState<LatestUpdate[]>(UPDATES_DATA);
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQS_DATA);
  const [images, setImages] = useState<ImageAsset[]>(DEFAULT_IMAGES);
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(DEFAULT_HOMEPAGE_CONFIG);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);

  // Helper function to normalize images array and migrate legacy keys to permanent keys
  const normalizeImages = (rawImages: ImageAsset[]): ImageAsset[] => {
    if (!Array.isArray(rawImages)) return DEFAULT_IMAGES;

    const legacyMap: Record<string, string> = {
      'img-hero': 'homepage_hero',
      'img-scheme-women': 'homepage_women_child',
      'img-cat-women': 'category_women',
      'img-scheme-1': 'homepage_women_child',
      'img-scheme-farmer': 'homepage_farmer',
      'img-cat-farmer': 'category_farmer',
      'img-scheme-2': 'homepage_farmer',
      'img-scheme-education': 'homepage_education',
      'img-cat-student': 'category_education',
      'img-scheme-3': 'homepage_education',
      'img-scheme-health': 'homepage_health',
      'img-cat-health': 'category_health',
      'img-cat-senior': 'category_senior_citizen',
      'img-scheme-social': 'homepage_health',
      'img-doc-services': 'homepage_other_services',
      'img-latest-1': 'homepage_other_services',
    };

    const imageMap = new Map<string, ImageAsset>();
    
    // Seed defaults first
    for (const def of DEFAULT_IMAGES) {
      imageMap.set(def.id, { ...def });
    }

    // Overlay raw images
    for (const raw of rawImages) {
      if (!raw || !raw.id) continue;
      const targetId = legacyMap[raw.id] || raw.id;
      const existing = imageMap.get(targetId);
      if (existing) {
        imageMap.set(targetId, {
          ...existing,
          ...raw,
          id: targetId,
          url: raw.url || existing.url
        });
      } else {
        imageMap.set(targetId, {
          ...raw,
          id: targetId
        });
      }
    }

    return Array.from(imageMap.values());
  };

  // Safe Image Retriever by permanent unique key
  const getImageByKey = (key: string, defaultUrl?: string): string => {
    // 1. Direct match
    const direct = images.find(img => img.id === key);
    if (direct?.url) return direct.url;

    // 2. Symmetric key aliases check
    const keyAliases: Record<string, string[]> = {
      'homepage_hero': ['img-hero', 'heroImage'],
      'homepage_women_child': ['category_women', 'img-scheme-women', 'img-cat-women', 'img-scheme-1'],
      'category_women': ['homepage_women_child', 'img-scheme-women', 'img-cat-women', 'img-scheme-1'],
      'homepage_farmer': ['category_farmer', 'img-scheme-farmer', 'img-cat-farmer', 'img-scheme-2'],
      'category_farmer': ['homepage_farmer', 'img-scheme-farmer', 'img-cat-farmer', 'img-scheme-2'],
      'homepage_education': ['category_education', 'img-scheme-education', 'img-cat-student', 'img-scheme-3'],
      'category_education': ['homepage_education', 'img-scheme-education', 'img-cat-student', 'img-scheme-3'],
      'homepage_health': ['category_health', 'img-scheme-health', 'img-scheme-social'],
      'category_health': ['homepage_health', 'img-scheme-health', 'img-scheme-social'],
      'category_senior_citizen': ['img-cat-senior', 'homepage_other_services'],
      'homepage_other_services': ['category_other_services', 'img-doc-services', 'img-latest-1'],
      'category_other_services': ['homepage_other_services', 'img-doc-services', 'img-latest-1']
    };

    const aliases = keyAliases[key] || [];
    for (const alias of aliases) {
      const found = images.find(img => img.id === alias);
      if (found?.url) return found.url;
    }

    // 3. Check hero configuration fallback
    if (key === 'homepage_hero') {
      if (homepageConfig?.heroImage) return homepageConfig.heroImage;
      if (homepageConfig?.heroImageUrl) return homepageConfig.heroImageUrl;
      try {
        const stored = localStorage.getItem('mahamahiti_hero_image');
        if (stored) return stored;
      } catch {}
    }

    // 4. Default slots fallback
    const def = DEFAULT_IMAGES.find(img => img.id === key);
    if (def?.url) return def.url;

    return defaultUrl || '';
  };

  // Initial load for both public and admin sessions
  useEffect(() => {
    const initPublicAndAdminData = async () => {
      // 1. Check local storage for all customized content for instantaneous zero-delay load
      try {
        const storedHero = localStorage.getItem('mahamahiti_hero_image');
        if (storedHero) {
          setHomepageConfig(prev => ({ ...prev, heroImage: storedHero, heroImageUrl: storedHero }));
        }

        const storedImages = localStorage.getItem('mahamahiti_custom_images');
        if (storedImages) {
          const parsedImgs = JSON.parse(storedImages);
          if (Array.isArray(parsedImgs) && parsedImgs.length > 0) {
            setImages(normalizeImages(parsedImgs));
          }
        }

        const storedConfig = localStorage.getItem('mahamahiti_homepage_config');
        if (storedConfig) {
          const parsedConfig = JSON.parse(storedConfig);
          if (parsedConfig) {
            setHomepageConfig(parsedConfig);
          }
        }

        const storedSchemes = localStorage.getItem('mahamahiti_custom_schemes');
        if (storedSchemes) {
          const parsed = JSON.parse(storedSchemes);
          if (Array.isArray(parsed) && parsed.length > 0) setSchemes(parsed);
        }

        const storedServices = localStorage.getItem('mahamahiti_custom_services');
        if (storedServices) {
          const parsed = JSON.parse(storedServices);
          if (Array.isArray(parsed) && parsed.length > 0) setServices(parsed);
        }

        const storedDocs = localStorage.getItem('mahamahiti_custom_docs');
        if (storedDocs) {
          const parsed = JSON.parse(storedDocs);
          if (Array.isArray(parsed) && parsed.length > 0) setDocuments(parsed);
        }

        const storedUpdates = localStorage.getItem('mahamahiti_custom_updates');
        if (storedUpdates) {
          const parsed = JSON.parse(storedUpdates);
          if (Array.isArray(parsed) && parsed.length > 0) setUpdates(parsed);
        }
      } catch (e) {}

      // 2. Fetch public custom content from server
      try {
        const res = await fetch('/api/content/custom');
        if (res.ok) {
          const data = await res.json();
          if (data.customSchemes) {
            setSchemes(data.customSchemes);
            try { localStorage.setItem('mahamahiti_custom_schemes', JSON.stringify(data.customSchemes)); } catch {}
          }
          if (data.customDocuments) {
            setDocuments(data.customDocuments);
            try { localStorage.setItem('mahamahiti_custom_docs', JSON.stringify(data.customDocuments)); } catch {}
          }
          if (data.customServices) {
            setServices(data.customServices);
            try { localStorage.setItem('mahamahiti_custom_services', JSON.stringify(data.customServices)); } catch {}
          }
          if (data.customUpdates) {
            setUpdates(data.customUpdates);
            try { localStorage.setItem('mahamahiti_custom_updates', JSON.stringify(data.customUpdates)); } catch {}
          }
          if (data.customFaqs) setFaqs(data.customFaqs);
          if (data.customImages && Array.isArray(data.customImages) && data.customImages.length > 0) {
            const normalized = normalizeImages(data.customImages);
            setImages(normalized);
            try { localStorage.setItem('mahamahiti_custom_images', JSON.stringify(normalized)); } catch {}
          }
          if (data.homepageConfig) {
            setHomepageConfig(data.homepageConfig);
            try { localStorage.setItem('mahamahiti_homepage_config', JSON.stringify(data.homepageConfig)); } catch {}
            if (data.homepageConfig.heroImage || data.homepageConfig.heroImageUrl) {
              const hImg = data.homepageConfig.heroImage || data.homepageConfig.heroImageUrl;
              try { localStorage.setItem('mahamahiti_hero_image', hImg); } catch {}
            }
          }
          if (data.settings) setSettings(data.settings);
        }
      } catch (e) {}

      // 3. Fetch direct hero image
      try {
        const heroRes = await fetch('/api/hero-image');
        if (heroRes.ok) {
          const hData = await heroRes.json();
          if (hData.heroImage) {
            setHomepageConfig(prev => ({ ...prev, heroImage: hData.heroImage, heroImageUrl: hData.heroImage }));
            setImages(prev => prev.map(img => (img.id === 'homepage_hero' || img.id === 'img-hero') ? { ...img, url: hData.heroImage } : img));
            try { localStorage.setItem('mahamahiti_hero_image', hData.heroImage); } catch {}
          }
        }
      } catch (e) {}

      // 4. Verify admin token if present
      const storedToken = localStorage.getItem('mahamahiti_admin_token');
      if (storedToken) {
        try {
          const res = await fetch('/api/admin/verify', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            setIsAuthenticated(true);
            setToken(storedToken);
            setUsername(data.username || 'Admin');
            setIsFirstLogin(data.isFirstLogin || false);
            await fetchAdminStore(storedToken);
          } else {
            localStorage.removeItem('mahamahiti_admin_token');
            localStorage.removeItem('mahamahiti_admin_username');
            setIsAuthenticated(false);
            setToken(null);
          }
        } catch (e) {
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initPublicAndAdminData();
  }, []);

  const fetchAdminStore = async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/store', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.customSchemes) setSchemes(data.customSchemes);
        if (data.customDocuments) setDocuments(data.customDocuments);
        if (data.customServices) setServices(data.customServices);
        if (data.customUpdates) setUpdates(data.customUpdates);
        if (data.customFaqs) setFaqs(data.customFaqs);
        if (data.customImages) setImages(data.customImages);
        if (data.homepageConfig) setHomepageConfig(data.homepageConfig);
        if (data.settings) setSettings(data.settings);
      }
    } catch (err) {
      console.error("Failed to load admin store:", err);
    }
  };

  const login = async (user: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('mahamahiti_admin_token', data.token);
        localStorage.setItem('mahamahiti_admin_username', data.username);
        setToken(data.token);
        setUsername(data.username);
        setIsAuthenticated(true);
        setIsFirstLogin(data.isFirstLogin || false);
        await fetchAdminStore(data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'अवैध Username किंवा Password.' };
      }
    } catch (err: any) {
      return { success: false, error: 'सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {}
    }
    localStorage.removeItem('mahamahiti_admin_token');
    localStorage.removeItem('mahamahiti_admin_username');
    setToken(null);
    setUsername(null);
    setIsAuthenticated(false);
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: 'कृपया प्रथम लॉगिन करा.' };
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsFirstLogin(false);
        return { success: true };
      }
      return { success: false, error: data.error || 'पासवर्ड बदलण्यात अडचण आली.' };
    } catch (err: any) {
      return { success: false, error: 'सर्व्हर त्रुटी आली.' };
    }
  };

  // Helper to persist entire or partial store to server
  const persistChanges = async (partial: any) => {
    if (!token) return;
    try {
      await fetch('/api/admin/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(partial)
      });
    } catch (err) {
      console.error("Persist error:", err);
    }
  };

  // Scheme CRUD
  const saveScheme = async (scheme: SchemeItem) => {
    const exists = schemes.some(s => s.id === scheme.id);
    let updated: SchemeItem[];
    if (exists) {
      updated = schemes.map(s => s.id === scheme.id ? scheme : s);
    } else {
      updated = [scheme, ...schemes];
    }
    setSchemes(updated);
    try { localStorage.setItem('mahamahiti_custom_schemes', JSON.stringify(updated)); } catch {}
    await persistChanges({ customSchemes: updated });
  };

  const deleteScheme = async (id: string) => {
    const updated = schemes.filter(s => s.id !== id);
    setSchemes(updated);
    try { localStorage.setItem('mahamahiti_custom_schemes', JSON.stringify(updated)); } catch {}
    await persistChanges({ customSchemes: updated });
  };

  const toggleSchemeStatus = async (id: string, status: 'published' | 'draft' | 'unpublished') => {
    const updated = schemes.map(s => {
      if (s.id === id) {
        return {
          ...s,
          published: status === 'published',
          status: status
        };
      }
      return s;
    });
    setSchemes(updated);
    try { localStorage.setItem('mahamahiti_custom_schemes', JSON.stringify(updated)); } catch {}
    await persistChanges({ customSchemes: updated });
  };

  // Document CRUD
  const saveDocument = async (doc: DocumentItem) => {
    const exists = documents.some(d => d.id === doc.id);
    let updated: DocumentItem[];
    if (exists) {
      updated = documents.map(d => d.id === doc.id ? doc : d);
    } else {
      updated = [doc, ...documents];
    }
    setDocuments(updated);
    try { localStorage.setItem('mahamahiti_custom_docs', JSON.stringify(updated)); } catch {}
    await persistChanges({ customDocuments: updated });
  };

  const deleteDocument = async (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    try { localStorage.setItem('mahamahiti_custom_docs', JSON.stringify(updated)); } catch {}
    await persistChanges({ customDocuments: updated });
  };

  const toggleDocumentStatus = async (id: string, status: 'published' | 'draft' | 'unpublished') => {
    const updated = documents.map(d => {
      if (d.id === id) {
        return {
          ...d,
          published: status === 'published',
          status: status
        };
      }
      return d;
    });
    setDocuments(updated);
    try { localStorage.setItem('mahamahiti_custom_docs', JSON.stringify(updated)); } catch {}
    await persistChanges({ customDocuments: updated });
  };

  // Service CRUD
  const saveService = async (srv: GovernmentService) => {
    const exists = services.some(s => s.id === srv.id);
    let updated: GovernmentService[];
    if (exists) {
      updated = services.map(s => s.id === srv.id ? srv : s);
    } else {
      updated = [srv, ...services];
    }
    setServices(updated);
    try { localStorage.setItem('mahamahiti_custom_services', JSON.stringify(updated)); } catch {}
    await persistChanges({ customServices: updated });
  };

  const deleteService = async (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    try { localStorage.setItem('mahamahiti_custom_services', JSON.stringify(updated)); } catch {}
    await persistChanges({ customServices: updated });
  };

  const toggleServiceStatus = async (id: string, status: 'published' | 'draft' | 'unpublished') => {
    const updated = services.map(s => {
      if (s.id === id) {
        return {
          ...s,
          published: status === 'published',
          status: status
        };
      }
      return s;
    });
    setServices(updated);
    try { localStorage.setItem('mahamahiti_custom_services', JSON.stringify(updated)); } catch {}
    await persistChanges({ customServices: updated });
  };

  // Updates CRUD
  const saveUpdate = async (up: LatestUpdate) => {
    const exists = updates.some(u => u.id === up.id);
    let updated: LatestUpdate[];
    if (exists) {
      updated = updates.map(u => u.id === up.id ? up : u);
    } else {
      updated = [up, ...updates];
    }
    setUpdates(updated);
    try { localStorage.setItem('mahamahiti_custom_updates', JSON.stringify(updated)); } catch {}
    await persistChanges({ customUpdates: updated });
  };

  const deleteUpdate = async (id: string) => {
    const updated = updates.filter(u => u.id !== id);
    setUpdates(updated);
    try { localStorage.setItem('mahamahiti_custom_updates', JSON.stringify(updated)); } catch {}
    await persistChanges({ customUpdates: updated });
  };

  // FAQ CRUD
  const saveFaq = async (faq: FAQItem) => {
    const exists = faqs.some(f => f.id === faq.id);
    let updated: FAQItem[];
    if (exists) {
      updated = faqs.map(f => f.id === faq.id ? faq : f);
    } else {
      updated = [faq, ...faqs];
    }
    setFaqs(updated);
    await persistChanges({ customFaqs: updated });
  };

  const deleteFaq = async (id: string) => {
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    await persistChanges({ customFaqs: updated });
  };

  // Images CRUD
  const saveImage = async (image: ImageAsset) => {
    const exists = images.some(img => img.id === image.id);
    let updated: ImageAsset[];
    if (exists) {
      updated = images.map(img => img.id === image.id ? image : img);
    } else {
      updated = [image, ...images];
    }
    setImages(updated);
    try {
      localStorage.setItem('mahamahiti_custom_images', JSON.stringify(updated));
    } catch (e) {}

    // If hero banner is updated, also synchronize homepageConfig and direct endpoints
    if (image.id === 'homepage_hero' || image.id === 'img-hero' || image.usedIn?.includes('Hero') || image.name?.includes('Hero')) {
      const updatedConfig: HomepageConfig = {
        ...homepageConfig,
        heroImage: image.url,
        heroImageUrl: image.url
      };
      setHomepageConfig(updatedConfig);
      try {
        localStorage.setItem('mahamahiti_hero_image', image.url);
        localStorage.setItem('mahamahiti_homepage_config', JSON.stringify(updatedConfig));
      } catch (e) {}

      try {
        fetch('/api/hero-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ heroImage: image.url })
        }).catch(() => {});
      } catch (e) {}

      await persistChanges({ 
        customImages: updated,
        homepageConfig: updatedConfig
      });
      return;
    }

    await persistChanges({ customImages: updated });
  };

  const deleteImage = async (id: string) => {
    const updated = images.filter(img => img.id !== id);
    setImages(updated);
    try {
      localStorage.setItem('mahamahiti_custom_images', JSON.stringify(updated));
    } catch (e) {}
    await persistChanges({ customImages: updated });
  };

  // Homepage Config
  const saveHomepageConfig = async (config: HomepageConfig) => {
    setHomepageConfig(config);
    try {
      localStorage.setItem('mahamahiti_homepage_config', JSON.stringify(config));
    } catch (e) {}

    if (config.heroImage || config.heroImageUrl) {
      const heroUrl = config.heroImage || config.heroImageUrl;
      try {
        localStorage.setItem('mahamahiti_hero_image', heroUrl);
      } catch (e) {}

      setImages(prev => {
        const exists = prev.some(img => img.id === 'homepage_hero' || img.id === 'img-hero');
        let newImgs: ImageAsset[];
        if (exists) {
          newImgs = prev.map(img => (img.id === 'homepage_hero' || img.id === 'img-hero') ? { ...img, url: heroUrl } : img);
        } else {
          newImgs = [{
            id: 'homepage_hero',
            name: 'मुख्यपृष्ठ Hero Banner',
            url: heroUrl,
            altText: 'महाराष्ट्र शासन नागरिक कल्याण योजना',
            usedIn: 'मुख्यपृष्ठ Hero Banner',
            fileSize: '1920 × 1080 px (16:9)',
            uploadedAt: new Date().toISOString().split('T')[0]
          }, ...prev];
        }
        try {
          localStorage.setItem('mahamahiti_custom_images', JSON.stringify(newImgs));
        } catch (e) {}
        return newImgs;
      });

      try {
        fetch('/api/hero-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ heroImage: heroUrl })
        }).catch(() => {});
      } catch (e) {}
    }
    await persistChanges({ homepageConfig: config });
  };

  // Settings
  const saveSettings = async (newSettings: AdminSettings) => {
    setSettings(newSettings);
    await persistChanges({ settings: newSettings });
  };

  const refreshData = async () => {
    if (token) {
      await fetchAdminStore(token);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        token,
        username,
        isFirstLogin,
        login,
        logout,
        changePassword,
        schemes,
        documents,
        services,
        updates,
        faqs,
        images,
        homepageConfig,
        settings,
        getImageByKey,
        saveScheme,
        deleteScheme,
        toggleSchemeStatus,
        saveDocument,
        deleteDocument,
        toggleDocumentStatus,
        saveService,
        deleteService,
        toggleServiceStatus,
        saveUpdate,
        deleteUpdate,
        saveFaq,
        deleteFaq,
        saveImage,
        deleteImage,
        saveHomepageConfig,
        saveSettings,
        isLoading,
        refreshData
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth(): AdminAuthContextType {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return ctx;
}
