import React, { useState } from 'react';
import { 
  Search, 
  Share2, 
  Sparkles, 
  Menu, 
  X,
  Home,
  FileSearch,
  Sprout,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Users2,
  Layers,
  Files
} from 'lucide-react';
import { MahaMahitiLogo } from './MahaMahitiLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenWhatsApp: () => void;
  onOpenAI: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  onSpeak: (text: string) => void;
  onSelectCategoryFilter?: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenWhatsApp,
  onOpenAI,
  onSelectCategoryFilter
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact 9 distinct navigation items with unique theme colors
  const navItems = [
    { 
      id: 'home', 
      label: 'मुख्यपृष्ठ', 
      type: 'tab' as const,
      icon: Home,
      color: 'text-[#5B45B5]',
      activeBg: 'bg-[#F2EFFD] text-[#5B45B5] border-[#DCD8EC]',
      activeBar: 'bg-[#5B45B5]',
      hoverBg: 'hover:bg-[#F2EFFD] hover:text-[#5B45B5]'
    },
    { 
      id: 'schemes', 
      label: 'योजना', 
      type: 'tab' as const,
      icon: FileSearch,
      color: 'text-[#4056B5]',
      activeBg: 'bg-[#EEF1FF] text-[#4056B5] border-[#C7D2FE]',
      activeBar: 'bg-[#4056B5]',
      hoverBg: 'hover:bg-[#EEF1FF] hover:text-[#4056B5]'
    },
    { 
      id: 'agriculture', 
      label: 'शेतकरी', 
      type: 'category' as const,
      icon: Sprout,
      color: 'text-[#16834B]',
      activeBg: 'bg-[#EAF7EF] text-[#12643A] border-[#BBF7D0]',
      activeBar: 'bg-[#16834B]',
      hoverBg: 'hover:bg-[#EAF7EF] hover:text-[#16834B]'
    },
    { 
      id: 'education', 
      label: 'शिक्षण', 
      type: 'category' as const,
      icon: GraduationCap,
      color: 'text-[#4056B5]',
      activeBg: 'bg-[#EEF1FF] text-[#30428D] border-[#C7D2FE]',
      activeBar: 'bg-[#4056B5]',
      hoverBg: 'hover:bg-[#EEF1FF] hover:text-[#4056B5]'
    },
    { 
      id: 'women', 
      label: 'महिला', 
      type: 'category' as const,
      icon: HeartHandshake,
      color: 'text-[#C23B68]',
      activeBg: 'bg-[#FFF0F5] text-[#962B4E] border-[#FECDD3]',
      activeBar: 'bg-[#C23B68]',
      hoverBg: 'hover:bg-[#FFF0F5] hover:text-[#C23B68]'
    },
    { 
      id: 'health', 
      label: 'आरोग्य', 
      type: 'category' as const,
      icon: HeartPulse,
      color: 'text-[#148A83]',
      activeBg: 'bg-[#EAF8F6] text-[#106B65] border-[#99F6E4]',
      activeBar: 'bg-[#148A83]',
      hoverBg: 'hover:bg-[#EAF8F6] hover:text-[#148A83]'
    },
    { 
      id: 'senior', 
      label: 'ज्येष्ठ नागरिक', 
      type: 'category' as const,
      icon: Users2,
      color: 'text-[#C47A16]',
      activeBg: 'bg-[#FFF5E5] text-[#955B0D] border-[#FED7AA]',
      activeBar: 'bg-[#C47A16]',
      hoverBg: 'hover:bg-[#FFF5E5] hover:text-[#C47A16]'
    },
    { 
      id: 'services', 
      label: 'इतर सेवा', 
      type: 'tab' as const,
      icon: Layers,
      color: 'text-[#5B45B5]',
      activeBg: 'bg-[#F2EFFD] text-[#5B45B5] border-[#DCD8EC]',
      activeBar: 'bg-[#5B45B5]',
      hoverBg: 'hover:bg-[#F2EFFD] hover:text-[#5B45B5]'
    },
    { 
      id: 'documents', 
      label: 'कागदपत्रे', 
      type: 'tab' as const,
      icon: Files,
      color: 'text-[#4056B5]',
      activeBg: 'bg-[#EEF1FF] text-[#4056B5] border-[#C7D2FE]',
      activeBar: 'bg-[#4056B5]',
      hoverBg: 'hover:bg-[#EEF1FF] hover:text-[#4056B5]'
    },
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    if (item.type === 'category') {
      setActiveTab('schemes');
      if (onSelectCategoryFilter) {
        onSelectCategoryFilter(item.id);
      }
    } else {
      if (item.id === 'schemes' && onSelectCategoryFilter) {
        onSelectCategoryFilter('all');
      }
      setActiveTab(item.id);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9FD]/95 backdrop-blur-md border-b border-[#E8E5F2] shadow-[0_2px_16px_rgba(91,69,198,0.04)] transition-all">
      {/* ========================================================= */}
      {/* TOP ROW: Brand Header & Action Controls                    */}
      {/* ========================================================= */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-16 sm:h-[74px] flex items-center justify-between gap-3 box-border">
        
        {/* 1. LEFT: Brand Logo & Tagline */}
        <div 
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0 min-w-0"
        >
          {/* Square Maharashtra Information 3D Logo */}
          <MahaMahitiLogo size="md" className="group-hover:scale-105 transition-transform shrink-0" />
          
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl md:text-[25px] font-extrabold tracking-tight font-sans leading-none select-none truncate">
                <span className="text-[#0F172A]">Maha</span>
                <span className="text-[#EA580C]">Mahiti</span>
                <span className="text-[#0F172A]">.com</span>
              </span>
            </div>
            <div className="w-full flex items-center mt-0.5 sm:mt-1">
              <span 
                className="text-[10px] sm:text-[11.5px] md:text-[12px] font-extrabold text-[#000000] tracking-wider leading-tight select-none truncate block font-['Rozha_One',_'Yatra_One',_'Noto_Serif_Devanagari',_'Tiro_Devanagari_Marathi',_'Mukta',_serif]"
              >
                सर्व नागरिकांच्या माहितीसाठी
              </span>
            </div>
          </div>
        </div>

        {/* 2. RIGHT: Action Controls (WhatsApp, Search, AI सहाय्यक, Mobile Menu Toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Search Button ("शोधा") */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-[#F2EFFD] border border-[#E8E5F2] hover:border-[#DCD8EC] text-[#4B5567] hover:text-[#172033] text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
            title="योजना, कागदपत्र किंवा सेवा शोधा..."
          >
            <Search className="w-4 h-4 text-[#5B45C6] shrink-0" />
            <span className="inline">शोधा</span>
            <kbd className="hidden md:inline-flex items-center text-[10px] font-mono bg-[#F3F1FA] px-1.5 py-0.5 rounded text-[#6B7280] border border-[#E8E5F2]">
              ⌘K
            </kbd>
          </button>

          {/* WhatsApp Action Button */}
          <button
            type="button"
            onClick={onOpenWhatsApp}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#15966A]/10 hover:bg-[#15966A]/20 text-[#127c57] border border-[#15966A]/30 text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
            title="WhatsApp वर मदत मिळवा"
          >
            <Share2 className="w-4 h-4 text-[#15966A] shrink-0" />
            <span className="inline">WhatsApp</span>
          </button>

          {/* AI Assistant Button ("AI सहाय्यक") */}
          <button
            type="button"
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#5B45C6] to-[#43319E] hover:from-[#4C37B4] hover:to-[#382688] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition cursor-pointer shrink-0 whitespace-nowrap"
            title="AI नागरिक सहाय्यक"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <span className="whitespace-nowrap">AI सहाय्यक</span>
          </button>

          {/* Mobile / Tablet Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white text-[#172033] border border-[#E8E5F2] hover:bg-[#F2EFFD] transition cursor-pointer shrink-0 ml-0.5"
            aria-label="मेनू उघडा"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#5B45C6]" /> : <Menu className="w-5 h-5 text-[#5B45C6]" />}
          </button>

        </div>

      </div>

      {/* ========================================================= */}
      {/* DESKTOP NAVIGATION BAR (Dedicated Full-Width Row)         */}
      {/* ========================================================= */}
      <div className="hidden lg:block border-t border-[#E8E5F2]/80 bg-[#FAF9FD]/70">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between gap-1 py-1.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isTabActive = item.type === 'tab' && activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-xl text-[13.5px] xl:text-[14px] 2xl:text-[15px] font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isTabActive 
                      ? `${item.activeBg} font-bold shadow-2xs border` 
                      : `text-[#374151] ${item.hoverBg}`
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {isTabActive && (
                    <span className={`absolute bottom-0 left-2 right-2 h-[2.5px] ${item.activeBar} rounded-full`} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE / TABLET DRAWER MENU                                */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9FD] border-t border-[#E8E5F2] px-4 py-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-3 border-b border-[#E8E5F2]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isTabActive = item.type === 'tab' && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-2 ${
                    isTabActive 
                      ? `${item.activeBg} font-bold border shadow-xs` 
                      : `text-[#172033] hover:bg-white font-medium`
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onOpenAI();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#5B45C6] to-[#43319E] text-white font-bold text-xs sm:text-sm shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>AI नागरिक सहाय्यकाशी बोला</span>
            </button>
            
            <button
              type="button"
              onClick={() => {
                onOpenWhatsApp();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#15966A]/10 text-[#127c57] border border-[#15966A]/30 font-bold text-xs sm:text-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#15966A] shrink-0" />
              <span>WhatsApp वर मदत मिळवा</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
