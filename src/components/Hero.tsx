import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  FileCheck,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface HeroProps {
  onSearch: (query: string) => void;
  onCheckEligibility: () => void;
  onViewDocuments: () => void;
  onSelectSuggestion: (query: string) => void;
  heroImage?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onCheckEligibility,
  onViewDocuments,
  onSelectSuggestion,
  heroImage,
  heroImageUrl,
  heroImageAlt = "MahaMahiti.com"
}) => {
  const { getImageByKey, homepageConfig } = useAdminAuth();
  const [searchInput, setSearchInput] = useState('');

  const activeHeroImage = heroImage || heroImageUrl || homepageConfig?.heroImage || homepageConfig?.heroImageUrl || getImageByKey('homepage_hero', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=85');

  const quickSuggestions = [
    "लाडकी बहीण योजना",
    "शेतकरी सन्मान निधी",
    "आधार कार्ड",
    "उत्पन्न दाखला",
    "जात प्रमाणपत्र",
    "मुद्रा कर्ज"
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput.trim());
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#EEF0FF] via-[#F4F3F9] to-[#F3F1FA] pt-6 sm:pt-10 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E8E5F2]">
      
      {/* Background Subtle Gradient Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#5B45C6]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#159A9A]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-6 sm:space-y-8">
        
        {/* ========================================================= */}
        {/* 1. SINGLE COMPLETE 16:9 HERO BANNER (NO CROPPING / NO ZOOM) */}
        {/* ========================================================= */}
        <div 
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#E8E5F2] shadow-[0_12px_36px_rgba(91,69,198,0.08)] border-2 border-[#DCD8EC] flex items-center justify-center"
          style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto' }}
        >
          <img 
            src={activeHeroImage}
            alt={heroImageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain block"
            style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=85';
            }}
          />
        </div>

        {/* ========================================================= */}
        {/* 2. CITIZEN SEARCH & ACTION BAR (CLEAN, SPACIOUS, RESPONSIVE) */}
        {/* ========================================================= */}
        <div className="bg-[#FAF9FD] border border-[#E8E5F2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_8px_24px_rgba(91,69,198,0.04)] space-y-4">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input Form */}
            <form 
              onSubmit={handleFormSubmit} 
              className="relative flex-1 flex items-center bg-white border-2 border-[#E8E5F2] hover:border-[#5B45C6] focus-within:border-[#5B45C6] rounded-xl sm:rounded-2xl h-[54px] sm:h-[62px] px-3 shadow-xs focus-within:ring-4 focus-within:ring-[#F2EFFD] transition-all"
            >
              <div className="pl-1 pr-2 text-[#5B45C6]">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="योजना, कागदपत्र किंवा सेवा शोधा... (उदा. लाडकी बहीण, ७/१२, रेशन कार्ड)"
                className="w-full bg-transparent text-[#172033] placeholder:text-[#6B7280] text-sm sm:text-base outline-none font-sans font-medium"
              />

              <button
                type="submit"
                className="px-5 sm:px-8 h-[40px] sm:h-[48px] rounded-lg sm:rounded-xl bg-gradient-to-r from-[#5B45C6] to-[#43319E] hover:from-[#4C37B4] hover:to-[#382688] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs hover:shadow-md"
              >
                <span>शोधा</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onCheckEligibility}
                className="flex-1 md:flex-none px-4 sm:px-5 py-3 rounded-xl sm:rounded-2xl bg-[#F2EFFD] hover:bg-[#E0D9FA] text-[#5B45C6] border border-[#DCD8EC] text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-102"
              >
                <Sparkles className="w-4 h-4 text-[#5B45C6]" />
                <span>पात्रता तपासा</span>
              </button>

              <button
                type="button"
                onClick={onViewDocuments}
                className="flex-1 md:flex-none px-4 sm:px-5 py-3 rounded-xl sm:rounded-2xl bg-white hover:bg-[#F0FDF4] text-[#15966A] border border-[#BBF7D0] text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-102"
              >
                <FileCheck className="w-4 h-4 text-[#15966A]" />
                <span>कागदपत्रे यादी</span>
              </button>
            </div>

          </div>

          {/* Quick Search Suggestion Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E5F2]">
            <span className="text-xs sm:text-sm text-[#172033] font-bold">शोध सूचना:</span>
            {quickSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchInput(item);
                  onSelectSuggestion(item);
                }}
                className="text-xs sm:text-sm font-semibold text-[#4B5567] bg-white hover:bg-[#F2EFFD] hover:text-[#5B45C6] border border-[#E8E5F2] hover:border-[#DCD8EC] px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
};

