export type CategoryType = 
  | 'all'
  | 'women'
  | 'farmer'
  | 'agriculture'
  | 'student'
  | 'worker'
  | 'senior'
  | 'disabled'
  | 'business'
  | 'education'
  | 'health'
  | 'housing'
  | 'financial';

export interface Scheme {
  id: string;
  title: string;
  titleEnglish?: string;
  slug: string;
  category: CategoryType | string;
  categoryLabel?: string;
  targetAudience?: string;
  shortDescription?: string;
  description: string;
  benefits?: string[];
  eligibility?: string[];
  documentsRequired?: string[];
  requiredDocuments?: string[];
  applicationProcess?: string[];
  applicationWhere?: string;
  whereToApply?: string;
  isOnline?: boolean;
  officialUrl: string;
  officialSourceName?: string;
  officialSource?: string;
  officialPortal?: string;
  verified?: boolean;
  lastVerifiedAt?: string;
  lastVerified?: string;
  isDemoData?: boolean;
  faqs?: { question: string; answer: string }[];
  tags?: string[];
  image?: string;
  imageUrl?: string;
  imageAlt?: string;
  published?: boolean;
  status?: ContentStatus;
  department?: string;
}

export type SchemeItem = Scheme;

export interface DocumentInfo {
  id: string;
  title: string;
  titleEnglish?: string;
  slug: string;
  category: 'identity' | 'income_caste' | 'business' | 'vital' | 'other' | string;
  categoryLabel?: string;
  description: string;
  forWhom?: string;
  targetAudience?: string;
  documentsRequired?: string[];
  requiredDocuments?: string[];
  requiredSupportingDocs?: string[];
  eligibility?: string[];
  process?: string[];
  howToApply?: string[];
  applicationSteps?: string[];
  whereToApply?: string;
  applicationWhere?: string;
  estimatedTime?: string;
  issuingAuthority?: string;
  validityPeriod?: string;
  isOnline?: boolean;
  officialUrl?: string;
  portalUrl?: string;
  officialSourceName?: string;
  officialSource?: string;
  officialPortal?: string;
  verified?: boolean;
  lastVerifiedAt?: string;
  lastVerified?: string;
  isDemoData?: boolean;
  faqs?: { question: string; answer: string }[];
  image?: string;
  imageUrl?: string;
  imageAlt?: string;
  published?: boolean;
  status?: ContentStatus;
  department?: string;
}

export type DocumentItem = DocumentInfo;

export interface GovernmentService {
  id: string;
  title: string;
  titleEnglish?: string;
  slug: string;
  category: 'identity' | 'certificates' | 'citizen' | 'business' | 'agriculture' | 'health' | 'digital' | string;
  categoryLabel?: string;
  description: string;
  purpose?: string;
  forWhom?: string;
  targetAudience?: string;
  department?: string;
  features?: string[];
  requiredDocuments?: string[];
  howToAccess?: string[];
  documentsRequired?: string[];
  process?: string[];
  isOnline?: boolean;
  officialUrl?: string;
  portalUrl?: string;
  officialSourceName?: string;
  verified?: boolean;
  lastVerifiedAt?: string;
  lastVerified?: string;
  faqs?: { question: string; answer: string }[];
  image?: string;
  imageUrl?: string;
  imageAlt?: string;
  published?: boolean;
  status?: ContentStatus;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  status?: ContentStatus;
  published?: boolean;
}

export interface LoanScheme {
  id: string;
  title: string;
  slug: string;
  category: 'business' | 'women' | 'farmer' | 'self_employed' | 'education' | 'micro';
  categoryLabel: string;
  forWhom: string;
  loanDetails: string;
  maxAmount: string;
  benefits: string[];
  subsidyOrInterest: string;
  eligibility: string[];
  documentsRequired: string[];
  applicationProcess: string[];
  officialUrl: string;
  officialSourceName: string;
  verified: boolean;
  lastVerifiedAt: string;
  faqs: { question: string; answer: string }[];
  image?: string;
  imageAlt?: string;
}

export interface LatestUpdate {
  id: string;
  title: string;
  slug: string;
  category: 'योजना' | 'कागदपत्रे' | 'कर्ज' | 'शिष्यवृत्ती' | 'शासकीय सेवा' | 'महत्त्वाच्या सूचना';
  shortDescription: string;
  content: string;
  publishedDate: string;
  verified: boolean;
  officialSource: string;
  officialUrl: string;
}

export interface EligibilityProfile {
  age: number | '';
  gender: 'female' | 'male' | 'other' | '';
  district: string;
  annualIncome: number | '';
  occupation: string;
  isFarmer: boolean;
  isStudent: boolean;
  isSeniorCitizen: boolean;
  isDisabled: boolean;
  isEntrepreneur: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: { title: string; url: string }[];
  suggestedActions?: string[];
}

export type ContentStatus = 'draft' | 'published' | 'unpublished';

export interface ImageAsset {
  id: string;
  name: string;
  url: string;
  altText: string;
  fileSize?: string;
  usedIn: string; // e.g. "मुख्यपृष्ठ Hero", "योजना: लाडकी बहीण", "Unused"
  uploadedAt: string;
}

export interface HomepageConfig {
  heroImage: string;
  heroImageUrl?: string;
  heroImageAlt: string;
  heroHeading: string;
  heroSupportingText: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  featuredSchemeIds: string[];
  featuredLatestIds: string[];
  status: ContentStatus;
  lastUpdated: string;
}

export interface AdminSettings {
  websiteName: string;
  websiteDescription: string;
  domain: string;
  logoText: string;
  faviconUrl: string;
  whatsappContactNumber: string;
  whatsappShareNote: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    telegram?: string;
  };
  contactEmail: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
}

export interface AdminSession {
  username: string;
  token: string;
  role: 'admin';
  isFirstLogin?: boolean;
}
