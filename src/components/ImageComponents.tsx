import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export interface HeroSubject {
  id: string;
  label: string;
  englishLabel: string;
  url: string;
  caption: string;
  alt: string;
}

export const HERO_CITIZEN_SUBJECTS: HeroSubject[] = [
  {
    id: 'farmer',
    label: 'शेतकरी',
    englishLabel: 'Farmer',
    url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=85',
    caption: 'शेतकरी योजना व कृषी अनुदान माहिती',
    alt: 'महाराष्ट्र शेतकरी कल्याण'
  },
  {
    id: 'woman',
    label: 'महिला',
    englishLabel: 'Woman',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
    caption: 'महिला सक्षमीकरण व लाडकी बहीण योजना',
    alt: 'महिला सक्षमीकरण योजना'
  },
  {
    id: 'student',
    label: 'विद्यार्थी',
    englishLabel: 'Student',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85',
    caption: 'उच्च शिक्षण, शिष्यवृत्ती व कौशल्य विकास',
    alt: 'विद्यार्थी शिष्यवृत्ती योजना'
  },
  {
    id: 'senior',
    label: 'ज्येष्ठ नागरिक',
    englishLabel: 'Senior Citizen',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85',
    caption: 'ज्येष्ठ नागरिक पेन्शन व आरोग्य विमा योजना',
    alt: 'ज्येष्ठ नागरिक कल्याण'
  }
];

export const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=85';
export const SCHEME_FEATURED_IMAGE = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80';
export const ARTICLE_IMAGE_1 = 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80';

// Hero Photographic Composition strictly adhering to 16:9 Landscape and object-fit contain
interface HeroImageProps {
  customSrc?: string;
  alt?: string;
  className?: string;
}

export const HeroImage: React.FC<HeroImageProps> = ({ 
  customSrc, 
  alt = "महाराष्ट्र शासन नागरिक कल्याण योजना",
  className = ""
}) => {
  const { getImageByKey } = useAdminAuth();
  const heroImageSrc = customSrc || getImageByKey('homepage_hero', DEFAULT_HERO_IMAGE);

  return (
    <div className={`relative w-full ${className}`}>
      {/* 16:9 Landscape Aspect Ratio Container with object-fit: contain (Zero crop, zero zoom) */}
      <div 
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#E5E7EB] border border-[#E5E7EB] shadow-[0_8px_30px_rgba(17,24,39,0.06)] flex items-center justify-center"
        style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto' }}
      >
        <img 
          src={heroImageSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain block transition-transform duration-300 hover:scale-101"
          style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto', objectFit: 'contain' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_HERO_IMAGE;
          }}
        />

        {/* Subtle Bottom Information Tag */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white text-xs px-3.5 py-1.5 rounded-xl bg-[#111827]/80 backdrop-blur-md border border-white/20">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
            <span className="truncate">{alt}</span>
          </div>
          <span className="text-[11px] text-[#D1D5DB] font-bold shrink-0 hidden sm:inline">
            महामाहिती पोर्टल
          </span>
        </div>
      </div>

      {/* Floating Trust Badge: Verified Scheme Info */}
      <div className="absolute -top-3 -left-2 sm:-left-4 z-20 bg-white border border-[#E5E7EB] rounded-2xl px-3 py-1.5 shadow-[0_6px_20px_rgba(17,24,39,0.08)] flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#15803D] shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
        </div>
        <div>
          <div className="text-xs font-bold text-[#111827]">सत्यापित माहिती</div>
          <div className="text-[10px] text-[#15803D] font-semibold">अधिकृत शासन निर्णय</div>
        </div>
      </div>

      {/* Floating Trust Badge: 100% Free Service */}
      <div className="absolute -bottom-3 -right-2 sm:-right-4 z-20 bg-white border border-[#E5E7EB] rounded-2xl px-3 py-1.5 shadow-[0_6px_20px_rgba(17,24,39,0.08)] flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-[#EEF2F6] border border-[#D1D5DB] flex items-center justify-center text-[#4F39A2] shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#4F39A2]" />
        </div>
        <div>
          <div className="text-xs font-bold text-[#111827]">सर्व नागरिकांसाठी</div>
          <div className="text-[10px] text-[#374151]">मोफत व सोपी माहिती</div>
        </div>
      </div>
    </div>
  );
};

// Featured Scheme Image with 16:9 landscape aspect ratio and object-contain
interface FeaturedSchemeImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export const FeaturedSchemeImage: React.FC<FeaturedSchemeImageProps> = ({
  src = SCHEME_FEATURED_IMAGE,
  alt = "प्रमुख सरकारी योजना",
  className = ""
}) => {
  return (
    <div 
      className={`relative w-full rounded-2xl overflow-hidden bg-[#E5E7EB] border border-[#E5E7EB] flex items-center justify-center ${className}`}
      style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto' }}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain block transition-transform duration-300 hover:scale-102"
        style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto', objectFit: 'contain' }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = SCHEME_FEATURED_IMAGE;
        }}
      />
    </div>
  );
};

// Article / Update Image with 16:9 landscape aspect ratio and object-contain
interface UpdateImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export const UpdateImage: React.FC<UpdateImageProps> = ({
  src = ARTICLE_IMAGE_1,
  alt = "शासकीय परिपत्रक",
  className = ""
}) => {
  return (
    <div 
      className={`relative w-full rounded-2xl overflow-hidden bg-[#E5E7EB] border border-[#E5E7EB] flex items-center justify-center ${className}`}
      style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto' }}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain block"
        style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto', objectFit: 'contain' }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = ARTICLE_IMAGE_1;
        }}
      />
    </div>
  );
};
