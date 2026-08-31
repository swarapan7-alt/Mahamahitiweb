import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Sprout, 
  GraduationCap, 
  HeartHandshake, 
  Users2, 
  HardHat, 
  FileCheck, 
  Layers, 
  Bookmark,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { SCHEMES_DATA } from '../data/mockData';
import { Scheme } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';
import { DEFAULT_CATEGORY_IMAGES } from '../utils/schemeImageUtils';
import { UpdatesTicker } from './UpdatesTicker';
import { VisitorCounter } from './VisitorCounter';

interface HomepageProps {
  onNavigate: (tab: string, categoryFilter?: string) => void;
  onOpenDetails: (item: any, type: 'scheme' | 'document' | 'service' | 'loan') => void;
  onSearch: (query: string) => void;
}

export const Homepage: React.FC<HomepageProps> = ({
  onNavigate,
  onOpenDetails,
  onSearch
}) => {
  const { schemes: adminSchemes, getImageByKey, homepageConfig } = useAdminAuth();
  const [searchInput, setSearchInput] = useState('');
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('mahamahiti_favorites') || localStorage.getItem('aapli_mahiti_favorites') || '[]');
    } catch {
      return [];
    }
  });

  const toggleBookmark = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (bookmarkedSlugs.includes(slug)) {
      updated = bookmarkedSlugs.filter(s => s !== slug);
    } else {
      updated = [...bookmarkedSlugs, slug];
    }
    setBookmarkedSlugs(updated);
    try {
      localStorage.setItem('mahamahiti_favorites', JSON.stringify(updated));
    } catch {}
  };

  // Get active schemes from admin context or base mock data
  const allSchemes: Scheme[] = useMemo(() => {
    if (adminSchemes && adminSchemes.length > 0) {
      return adminSchemes.filter(s => s.published !== false && s.status !== 'draft');
    }
    return SCHEMES_DATA;
  }, [adminSchemes]);

  // Curate exact 6 Popular Schemes (लोकप्रिय योजना)
  const popularSchemes: Scheme[] = useMemo(() => {
    // 1. लाडकी बहीण
    const s1 = allSchemes.find(s => s.id === 's-1' || s.slug.includes('ladki-bahin') || s.title.includes('लाडकी बहीण')) || allSchemes[0];
    // 2. पीएम किसान / नमो शेतकरी
    const s2 = allSchemes.find(s => s.id === 's-4' || s.slug.includes('pm-kisan') || s.title.includes('पीएम किसान')) || allSchemes[1] || allSchemes[0];
    // 3. महाडीबीटी पोस्ट मॅट्रिक शिष्यवृत्ती
    const s3 = allSchemes.find(s => s.id === 's-8' || s.slug.includes('post-matric') || s.title.includes('शिष्यवृत्ती')) || allSchemes[2] || allSchemes[0];
    // 4. श्रावणबाळ निवृत्तीवेतन
    const s4 = allSchemes.find(s => s.id === 's-11' || s.slug.includes('shravanbal') || s.title.includes('श्रावणबाळ')) || allSchemes[3] || allSchemes[0];
    // 5. कामगार कल्याणकारी योजना (BOCW)
    const s5 = allSchemes.find(s => s.id === 's-15' || s.slug.includes('bocw') || s.category === 'worker' || s.title.includes('बांधकाम कामगार')) || allSchemes[4] || allSchemes[0];
    // 6. सुकन्या समृद्धी किंवा जन आरोग्य
    const s6 = allSchemes.find(s => s.id === 's-3' || s.id === 's-20' || s.slug.includes('sukanya') || s.title.includes('सुकन्या') || s.category === 'health') || allSchemes[5] || allSchemes[0];

    const list = [s1, s2, s3, s4, s5, s6].filter(Boolean);
    const seen = new Set<string>();
    return list.filter(item => {
      const id = item.id || item.slug;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [allSchemes]);

  const quickSearchSuggestions = [
    "लाडकी बहीण",
    "शेतकरी योजना",
    "विद्यार्थी शिष्यवृत्ती",
    "७/१२ उतारा",
    "उत्पन्न दाखला",
    "श्रावणबाळ पेन्शन"
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  // Safe image resolvers with live Admin customization support & reliable fallbacks
  const heroImageSrc = getImageByKey(
    'homepage_hero',
    homepageConfig?.heroImage || homepageConfig?.heroImageUrl || DEFAULT_CATEGORY_IMAGES.hero
  );

  const womenImageSrc = getImageByKey(
    'women_scheme',
    getImageByKey('category_women', getImageByKey('homepage_women_child', DEFAULT_CATEGORY_IMAGES.women))
  );

  const farmerImageSrc = getImageByKey(
    'farmer_scheme',
    getImageByKey('category_farmer', getImageByKey('homepage_farmer', DEFAULT_CATEGORY_IMAGES.farmer))
  );

  const studentImageSrc = getImageByKey(
    'student_scheme',
    getImageByKey('category_education', getImageByKey('homepage_education', DEFAULT_CATEGORY_IMAGES.education))
  );

  const workerImageSrc = getImageByKey(
    'worker_scheme',
    getImageByKey('category_worker', getImageByKey('homepage_worker', DEFAULT_CATEGORY_IMAGES.worker))
  );

  const seniorImageSrc = getImageByKey(
    'senior_citizen_scheme',
    getImageByKey('category_senior_citizen', getImageByKey('homepage_senior', DEFAULT_CATEGORY_IMAGES.senior_citizen))
  );

  // 5 Main Visual Categories (16:9 Real images)
  const categoryCards = [
    {
      id: 'women',
      title: 'महिलांसाठी',
      subtitle: 'आर्थिक सहाय्य, लाडकी बहीण व स्वावलंबन योजना',
      image: womenImageSrc,
      fallbackImage: DEFAULT_CATEGORY_IMAGES.women,
      categoryKey: 'women',
      icon: HeartHandshake,
      badgeColor: 'bg-[#FFF0F5] text-[#962B4E] border-[#FECDD3]',
      accentColor: 'text-[#C23B68]',
      borderColor: 'border-[#FECDD3] hover:border-[#C23B68]'
    },
    {
      id: 'farmer',
      title: 'शेतकऱ्यांसाठी',
      subtitle: 'सन्मान निधी, पीक विमा, सिंचन व कृषी अवजारे',
      image: farmerImageSrc,
      fallbackImage: DEFAULT_CATEGORY_IMAGES.farmer,
      categoryKey: 'agriculture',
      icon: Sprout,
      badgeColor: 'bg-[#EAF7EF] text-[#12643A] border-[#BBF7D0]',
      accentColor: 'text-[#16834B]',
      borderColor: 'border-[#BBF7D0] hover:border-[#16834B]'
    },
    {
      id: 'student',
      title: 'विद्यार्थ्यांसाठी',
      subtitle: 'शिष्यवृत्ती, फी सवलत व वसतिगृह भत्ता योजना',
      image: studentImageSrc,
      fallbackImage: DEFAULT_CATEGORY_IMAGES.education,
      categoryKey: 'education',
      icon: GraduationCap,
      badgeColor: 'bg-[#EEF1FF] text-[#30428D] border-[#C7D2FE]',
      accentColor: 'text-[#4056B5]',
      borderColor: 'border-[#C7D2FE] hover:border-[#4056B5]'
    },
    {
      id: 'worker',
      title: 'कामगारांसाठी',
      subtitle: 'BOCW नोंदणी, सुरक्षा संच, आरोग्य व पेन्शन',
      image: workerImageSrc,
      fallbackImage: DEFAULT_CATEGORY_IMAGES.worker,
      categoryKey: 'worker',
      icon: HardHat,
      badgeColor: 'bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]',
      accentColor: 'text-[#EA580C]',
      borderColor: 'border-[#FED7AA] hover:border-[#EA580C]'
    },
    {
      id: 'senior',
      title: 'ज्येष्ठ नागरिकांसाठी',
      subtitle: 'श्रावणबाळ पेन्शन, वयोश्री व वैद्यकीय आधार',
      image: seniorImageSrc,
      fallbackImage: DEFAULT_CATEGORY_IMAGES.senior_citizen,
      categoryKey: 'senior',
      icon: Users2,
      badgeColor: 'bg-[#FFF5E5] text-[#955B0D] border-[#FED7AA]',
      accentColor: 'text-[#C47A16]',
      borderColor: 'border-[#FED7AA] hover:border-[#C47A16]'
    }
  ];

  const getSchemeCategoryColor = (category?: string) => {
    switch (category) {
      case 'farmer':
      case 'agriculture':
        return {
          badge: 'bg-[#EAF7EF] text-[#12643A] border-[#BBF7D0]',
          hoverBorder: 'hover:border-[#16834B]',
          accent: 'text-[#16834B]'
        };
      case 'student':
      case 'education':
        return {
          badge: 'bg-[#EEF1FF] text-[#30428D] border-[#C7D2FE]',
          hoverBorder: 'hover:border-[#4056B5]',
          accent: 'text-[#4056B5]'
        };
      case 'women':
        return {
          badge: 'bg-[#FFF0F5] text-[#962B4E] border-[#FECDD3]',
          hoverBorder: 'hover:border-[#C23B68]',
          accent: 'text-[#C23B68]'
        };
      case 'senior':
      case 'senior_citizen':
        return {
          badge: 'bg-[#FFF5E5] text-[#955B0D] border-[#FED7AA]',
          hoverBorder: 'hover:border-[#C47A16]',
          accent: 'text-[#C47A16]'
        };
      case 'worker':
        return {
          badge: 'bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]',
          hoverBorder: 'hover:border-[#EA580C]',
          accent: 'text-[#EA580C]'
        };
      default:
        return {
          badge: 'bg-[#F2EFFD] text-[#5B45C6] border-[#DCD8EC]',
          hoverBorder: 'hover:border-[#5B45C6]',
          accent: 'text-[#5B45C6]'
        };
    }
  };

  return (
    <div className="w-full space-y-8 sm:space-y-12">
      
      {/* ========================================================= */}
      {/* 1. HERO IMAGE SECTION (PROMINENT 16:9 ASPECT RATIO)       */}
      {/* ========================================================= */}
      <section className="w-full bg-[#FAF9FD] pt-3 sm:pt-5 pb-5 sm:pb-8 px-4 sm:px-6 lg:px-8 border-b border-[#E8E5F2]">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-5">

          {/* Prominent 16:9 Hero Image Container */}
          <div className="w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#DCD8EC] shadow-[0_8px_30px_rgba(91,69,198,0.06)] bg-[#F0EEF8] relative">
            <img
              src={heroImageSrc}
              alt="महाराष्ट्र शासन नागरिक कल्याण योजना व माहिती"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (e.currentTarget.src !== DEFAULT_CATEGORY_IMAGES.hero) {
                  e.currentTarget.src = DEFAULT_CATEGORY_IMAGES.hero;
                }
              }}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* ========================================================= */}
          {/* 2. COMPACT, PROMINENT SEARCH SECTION (IMMEDIATELY BELOW)  */}
          {/* ========================================================= */}
          <div className="bg-white border-2 border-[#DCD8EC] hover:border-[#5B45C6] focus-within:border-[#5B45C6] rounded-2xl p-3.5 sm:p-5 shadow-[0_6px_24px_rgba(91,69,198,0.05)] text-left transition-all max-w-5xl mx-auto space-y-3">
            
            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1 flex items-center bg-[#F8F7FD] border border-[#E8E5F2] focus-within:border-[#5B45C6] focus-within:bg-white rounded-xl h-[48px] sm:h-[52px] px-3.5 shadow-2xs focus-within:ring-4 focus-within:ring-[#F2EFFD] transition-all">
                <Search className="w-4 h-4 text-[#5B45C6] mr-2.5 shrink-0" />
                <input
                  id="homepage-search-input"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="उदा. लाडकी बहीण, शेतकरी योजना, विद्यार्थी शिष्यवृत्ती, ७/१२..."
                  className="w-full bg-transparent text-[#172033] placeholder:text-[#6B7280] text-xs sm:text-sm md:text-base outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="px-6 sm:px-8 h-[48px] sm:h-[52px] rounded-xl bg-gradient-to-r from-[#5B45C6] to-[#43319E] hover:from-[#4C37B4] hover:to-[#382688] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-xs hover:shadow-sm active:scale-98"
              >
                <span>शोधा</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1.5 border-t border-[#E8E5F2]">
              <span className="text-[11px] sm:text-xs text-[#6B7280] font-bold shrink-0">लोकप्रिय शोध:</span>
              {quickSearchSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchInput(item);
                    onSearch(item);
                  }}
                  className="text-[11px] sm:text-xs font-semibold text-[#4B5567] bg-[#FAF9FD] hover:bg-[#F2EFFD] hover:text-[#5B45C6] border border-[#E8E5F2] hover:border-[#DCD8EC] px-2.5 py-0.5 rounded-md transition cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. LATEST UPDATES RED TICKER (LEFT-TO-RIGHT MARQUEE)      */}
      {/* ========================================================= */}
      <UpdatesTicker
        onSelectUpdate={(item) => onOpenDetails(item, 'scheme')}
        onNavigateToUpdates={() => onNavigate('updates')}
      />

      {/* ========================================================= */}
      {/* 3. 5 PROMINENT 16:9 CATEGORY CARDS                        */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F2EFFD] text-[#5B45C6] text-xs font-bold border border-[#DCD8EC] mb-1">
              <Layers className="w-3.5 h-3.5 text-[#5B45C6]" />
              <span>प्रमुख नागरिक वर्ग</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#172033] font-heading tracking-tight">
              तुमच्यासाठी <span className="text-[#5B45C6]">माहिती</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5567] mt-0.5 font-medium">
              आपल्या आवश्यकतेनुसार योग्य वर्गवारी निवडून सर्व संबंधित योजना व सेवा पहा
            </p>
          </div>

          <button
            onClick={() => onNavigate('schemes', 'all')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5B45C6] hover:text-[#43319E] bg-[#F2EFFD] hover:bg-[#E8E5F2] px-3.5 py-1.5 rounded-xl border border-[#DCD8EC] transition self-start sm:self-auto cursor-pointer"
          >
            <span>सर्व विभाग पहा</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Prominent Visual Category Cards with 16:9 Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {categoryCards.map((card) => {
            const IconComp = card.icon;

            return (
              <div
                key={card.id}
                onClick={() => onNavigate('schemes', card.categoryKey)}
                className={`group bg-white rounded-xl sm:rounded-2xl border-2 ${card.borderColor} overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1`}
              >
                {/* 16:9 Aspect Ratio Image */}
                <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#F3F1FA]">
                  <img
                    src={card.image}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (e.currentTarget.src !== card.fallbackImage) {
                        e.currentTarget.src = card.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Category Pill on Image */}
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full border shadow-2xs ${card.badgeColor}`}>
                      <IconComp className="w-3 h-3" />
                      <span>{card.title}</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3 sm:p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#172033] font-heading group-hover:text-[#5B45C6] transition-colors leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#4B5567] line-clamp-2 leading-relaxed">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* "योजना पहा →" CTA Trigger */}
                  <div className={`pt-2 mt-1.5 border-t border-[#E8E5F2] flex items-center justify-between text-xs font-bold ${card.accentColor}`}>
                    <span>योजना पहा</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================= */}
      {/* 4. POPULAR SCHEMES ("लोकप्रिय योजना" - EXACTLY 6 CARDS)     */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F2EFFD] text-[#5B45C6] text-xs font-bold border border-[#DCD8EC] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#5B45C6]" />
              <span>सर्वाधिक विचारल्या जाणाऱ्या योजना</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#172033] font-heading tracking-tight">
              लोकप्रिय <span className="text-[#5B45C6]">योजना</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5567] mt-0.5 font-medium">
              प्रमुख शासकीय कल्याणकारी योजनांचे लाभ, पात्रता निकष आणि आवश्यक माहिती
            </p>
          </div>

          <button
            onClick={() => onNavigate('schemes')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5B45C6] hover:text-[#43319E] bg-[#F2EFFD] hover:bg-[#E8E5F2] px-3.5 py-1.5 rounded-xl border border-[#DCD8EC] transition self-start sm:self-auto cursor-pointer"
          >
            <span>सर्व योजना पहा</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact 6-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {popularSchemes.map((scheme) => {
            const style = getSchemeCategoryColor(scheme.category || scheme.categoryLabel);
            const isBookmarked = bookmarkedSlugs.includes(scheme.slug);

            return (
              <div
                key={scheme.id || scheme.slug}
                onClick={() => onOpenDetails(scheme, 'scheme')}
                className={`group bg-white rounded-xl sm:rounded-2xl border-2 border-[#E8E5F2] ${style.hoverBorder} p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5`}
              >
                <div className="space-y-2">
                  {/* Category Badge & Bookmark */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                      {scheme.categoryLabel || 'शासकीय योजना'}
                    </span>
                    <button
                      onClick={(e) => toggleBookmark(scheme.slug, e)}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        isBookmarked 
                          ? 'text-[#5B45C6] bg-[#F2EFFD]' 
                          : 'text-[#9CA3AF] hover:text-[#5B45C6] hover:bg-[#F2EFFD]'
                      }`}
                      title={isBookmarked ? 'जतन केलेले काढून टाका' : 'जतन करा'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-extrabold text-[#172033] group-hover:text-[#5B45C6] transition-colors leading-snug font-heading line-clamp-2">
                    {scheme.title}
                  </h3>

                  {/* Short Description (2 lines) */}
                  <p className="text-xs text-[#4B5567] line-clamp-2 leading-relaxed">
                    {scheme.shortDescription}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="pt-2.5 mt-2.5 border-t border-[#E8E5F2] flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16834B]" />
                    <span>सत्यापित माहिती</span>
                  </span>

                  <span className={`text-xs font-bold ${style.accent} group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1`}>
                    <span>अधिक माहिती</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Bottom CTA Button */}
        <div className="text-center mt-5">
          <button
            onClick={() => onNavigate('schemes')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white hover:bg-[#F2EFFD] text-[#5B45C6] border-2 border-[#DCD8EC] hover:border-[#5B45C6] font-bold text-xs sm:text-sm transition shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <span>सर्व योजना पहा</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 5. CITIZEN SERVICES ("इतर नागरिक सेवा")                   */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EEF1FF] text-[#4056B5] text-xs font-bold border border-[#C7D2FE] mb-1">
              <Layers className="w-3.5 h-3.5 text-[#4056B5]" />
              <span>शासकीय दाखले व ऑनलाइन सेवा</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#172033] font-heading tracking-tight">
              इतर <span className="text-[#4056B5]">नागरिक सेवा</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5567] mt-0.5 font-medium">
              सरकारी योजनांव्यतिरिक्त नागरिकांसाठी आवश्यक असणारे दाखले, ओळखपत्रे व ई-सेवा पोर्टल
            </p>
          </div>

          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#4056B5] hover:text-[#30428D] bg-[#EEF1FF] hover:bg-[#E0E7FF] px-3.5 py-1.5 rounded-xl border border-[#C7D2FE] transition self-start sm:self-auto cursor-pointer"
          >
            <span>सर्व नागरिक सेवा पहा</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Compact Service Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Service Block 1: कागदपत्रे */}
          <div 
            onClick={() => onNavigate('documents')}
            className="group bg-white rounded-xl sm:rounded-2xl border-2 border-[#E8E5F2] hover:border-[#4056B5] p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EEF1FF] text-[#4056B5] flex items-center justify-center border border-[#C7D2FE] group-hover:scale-105 transition-transform">
                <FileText className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#172033] group-hover:text-[#4056B5] font-heading transition-colors">
                  कागदपत्रे
                </h3>
                <p className="text-xs text-[#4B5567] mt-0.5 leading-relaxed">
                  आधार कार्ड, पॅन कार्ड, रेशन कार्ड, अधिवास व आवश्यक ओळखपत्रे
                </p>
              </div>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-[#E8E5F2] flex items-center justify-between text-xs font-bold text-[#4056B5]">
              <span>यादी पहा</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Service Block 2: प्रमाणपत्रे */}
          <div 
            onClick={() => onNavigate('documents')}
            className="group bg-white rounded-xl sm:rounded-2xl border-2 border-[#E8E5F2] hover:border-[#16834B] p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EAF7EF] text-[#16834B] flex items-center justify-center border border-[#BBF7D0] group-hover:scale-105 transition-transform">
                <FileCheck className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#172033] group-hover:text-[#16834B] font-heading transition-colors">
                  प्रमाणपत्रे
                </h3>
                <p className="text-xs text-[#4B5567] mt-0.5 leading-relaxed">
                  उत्पन्न दाखला, जात प्रमाणपत्र, नॉन-क्रीमी लेयर, वय व रहिवासी दाखले
                </p>
              </div>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-[#E8E5F2] flex items-center justify-between text-xs font-bold text-[#16834B]">
              <span>दाखले माहिती</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Service Block 3: विविध नागरिक सेवा */}
          <div 
            onClick={() => onNavigate('services')}
            className="group bg-white rounded-xl sm:rounded-2xl border-2 border-[#E8E5F2] hover:border-[#5B45C6] p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F2EFFD] text-[#5B45C6] flex items-center justify-center border border-[#DCD8EC] group-hover:scale-105 transition-transform">
                <Layers className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#172033] group-hover:text-[#5B45C6] font-heading transition-colors">
                  विविध नागरिक सेवा
                </h3>
                <p className="text-xs text-[#4B5567] mt-0.5 leading-relaxed">
                  आपले सरकार, महाभूलेख ७/१२ उतारा, महाडीबीटी व डिजिलॉकर सेवा
                </p>
              </div>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-[#E8E5F2] flex items-center justify-between text-xs font-bold text-[#5B45C6]">
              <span>पोर्टल्स पहा</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Service Block 4: CSC / ई-सेवा मार्गदर्शन */}
          <div 
            onClick={() => onNavigate('services')}
            className="group bg-white rounded-xl sm:rounded-2xl border-2 border-[#E8E5F2] hover:border-[#C47A16] p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFF5E5] text-[#C47A16] flex items-center justify-center border border-[#FED7AA] group-hover:scale-105 transition-transform">
                <Building2 className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#172033] group-hover:text-[#C47A16] font-heading transition-colors">
                  CSC / ई-सेवा मार्गदर्शन
                </h3>
                <p className="text-xs text-[#4B5567] mt-0.5 leading-relaxed">
                  स्थानिक अधिकृत केंद्र सेवा, अचूक अर्ज भरणा व पडताळणी मार्गदर्शन
                </p>
              </div>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-[#E8E5F2] flex items-center justify-between text-xs font-bold text-[#C47A16]">
              <span>मार्गदर्शन पहा</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Section Bottom CTA Button */}
        <div className="text-center mt-5">
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white hover:bg-[#EEF1FF] text-[#4056B5] border-2 border-[#C7D2FE] hover:border-[#4056B5] font-bold text-xs sm:text-sm transition shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <span>सर्व नागरिक सेवा पहा</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 6. GENUINE LIVE VISITOR COUNTER SECTION                   */}
      {/* ========================================================= */}
      <VisitorCounter />

      {/* ========================================================= */}
      {/* 7. CITIZEN GUIDANCE ("नागरिक मार्गदर्शन" - SHORT NOTICE)   */}
      {/* ========================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FAF9FD] via-white to-[#FAF9FD] rounded-2xl p-4 sm:p-6 border-2 border-[#DCD8EC] shadow-[0_4px_20px_rgba(91,69,198,0.04)] flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left">
          
          <div className="w-10 h-10 rounded-xl bg-[#F2EFFD] text-[#5B45C6] flex items-center justify-center shrink-0 border border-[#DCD8EC] shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="space-y-0.5 flex-1">
            <h3 className="text-sm sm:text-base font-extrabold text-[#172033] font-heading">
              नागरिक मार्गदर्शन व सहाय्य
            </h3>
            <p className="text-xs text-[#4B5567] font-medium leading-relaxed">
              योजना किंवा सेवा समजून घेण्यासाठी आणि आवश्यक कागदपत्रांच्या अचूक पूर्ततेसाठी आपल्या जवळच्या अधिकृत CSC केंद्र किंवा ई-सेवा केंद्राशी संपर्क साधा.
            </p>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#5B45C6] hover:bg-[#43319E] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            संपर्क माहिती
          </button>

        </div>
      </section>

    </div>
  );
};
