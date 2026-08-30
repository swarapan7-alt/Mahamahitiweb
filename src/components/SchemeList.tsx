import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Bookmark, 
  Calendar, 
  Info, 
  CheckCircle2, 
  ExternalLink, 
  ChevronRight, 
  HeartHandshake 
} from 'lucide-react';
import { SCHEMES_DATA, SCHEME_CATEGORIES } from '../data/mockData';
import { Scheme, CategoryType } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getSchemeImage, getNormalizedCategoryKey } from '../utils/schemeImageUtils';
import { SchemeCard } from './SchemeCard';

interface SchemeListProps {
  onOpenDetails: (scheme: Scheme) => void;
  searchFilter?: string;
}

export const SchemeList: React.FC<SchemeListProps> = ({ onOpenDetails, searchFilter = '' }) => {
  const { schemes: adminSchemes, getImageByKey } = useAdminAuth();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('aapli_mahiti_favorites') || '[]');
    } catch {
      return [];
    }
  });

  // Sync searchFilter prop to internal state
  React.useEffect(() => {
    if (!searchFilter) {
      setLocalSearch('');
      return;
    }
    const norm = getNormalizedCategoryKey(searchFilter);
    const filterLower = searchFilter.toLowerCase().trim();

    if (
      ['farmer', 'women', 'education', 'health', 'senior_citizen', 'worker'].includes(norm) ||
      ['farmer', 'agriculture', 'women', 'education', 'student', 'health', 'senior', 'senior_citizen', 'worker', 'disabled'].includes(filterLower)
    ) {
      if (norm === 'farmer' || filterLower === 'farmer' || filterLower === 'agriculture') setSelectedCategory('farmer');
      else if (norm === 'women' || filterLower === 'women') setSelectedCategory('women');
      else if (norm === 'education' || filterLower === 'education' || filterLower === 'student') setSelectedCategory('student');
      else if (norm === 'worker' || filterLower === 'worker') setSelectedCategory('worker');
      else if (norm === 'health' || filterLower === 'health') setSelectedCategory('health');
      else if (norm === 'senior_citizen' || filterLower === 'senior' || filterLower === 'senior_citizen') setSelectedCategory('senior');
      else if (filterLower === 'disabled') setSelectedCategory('disabled');
      setLocalSearch('');
    } else {
      setLocalSearch(searchFilter);
    }
  }, [searchFilter]);

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
      localStorage.setItem('aapli_mahiti_favorites', JSON.stringify(updated));
    } catch {}
  };

  // Merge custom schemes from admin with base data
  const allSchemes = useMemo(() => {
    if (adminSchemes && adminSchemes.length > 0) {
      // Filter out unpublished drafts if status is set
      return adminSchemes.filter(s => s.published !== false && s.status !== 'draft');
    }
    return SCHEMES_DATA;
  }, [adminSchemes]);

  const filteredSchemes = useMemo(() => {
    return allSchemes.filter((scheme) => {
      const schemeNorm = getNormalizedCategoryKey(scheme.category || scheme.categoryLabel);
      const selectedNorm = getNormalizedCategoryKey(selectedCategory);
      
      const matchesCategory = selectedCategory === 'all' || 
                              scheme.category === selectedCategory || 
                              schemeNorm === selectedNorm ||
                              (selectedCategory === 'farmer' && (scheme.category === 'agriculture' || schemeNorm === 'farmer')) ||
                              (selectedCategory === 'student' && (scheme.category === 'education' || schemeNorm === 'education')) ||
                              (selectedCategory === 'education' && (scheme.category === 'student' || schemeNorm === 'education')) ||
                              (selectedCategory === 'worker' && (scheme.category === 'worker' || schemeNorm === 'worker')) ||
                              (selectedCategory === 'senior' && (scheme.category === 'senior_citizen' || schemeNorm === 'senior_citizen'));

      const query = (localSearch || '').toLowerCase().trim();
      
      if (!query) return matchesCategory;

      const inTitle = scheme.title.toLowerCase().includes(query);
      const inDesc = (scheme.description || '').toLowerCase().includes(query);
      const inShortDesc = (scheme.shortDescription || '').toLowerCase().includes(query);
      const inAudience = (scheme.targetAudience || '').toLowerCase().includes(query);
      const inTags = (scheme.tags || []).some(t => t.toLowerCase().includes(query));

      return matchesCategory && (inTitle || inDesc || inShortDesc || inAudience || inTags);
    });
  }, [allSchemes, selectedCategory, localSearch]);

  // Helper for category badge and button styling
  const getCategoryStyles = (categoryStr?: string) => {
    const key = getNormalizedCategoryKey(categoryStr);
    switch (key) {
      case 'farmer':
        return {
          badge: 'bg-[#EAF7EF] text-[#12643A] border-[#BBF7D0]',
          btn: 'bg-[#16834B] hover:bg-[#12643A] text-white',
          hoverBorder: 'hover:border-[#16834B]',
          titleHover: 'group-hover:text-[#16834B]',
          glow: 'hover:shadow-[0_16px_36px_rgba(22,131,75,0.14)]'
        };
      case 'education':
        return {
          badge: 'bg-[#EEF1FF] text-[#30428D] border-[#C7D2FE]',
          btn: 'bg-[#4056B5] hover:bg-[#30428D] text-white',
          hoverBorder: 'hover:border-[#4056B5]',
          titleHover: 'group-hover:text-[#4056B5]',
          glow: 'hover:shadow-[0_16px_36px_rgba(64,86,181,0.14)]'
        };
      case 'women':
        return {
          badge: 'bg-[#FFF0F5] text-[#962B4E] border-[#FECDD3]',
          btn: 'bg-[#C23B68] hover:bg-[#962B4E] text-white',
          hoverBorder: 'hover:border-[#C23B68]',
          titleHover: 'group-hover:text-[#C23B68]',
          glow: 'hover:shadow-[0_16px_36px_rgba(194,59,104,0.14)]'
        };
      case 'worker':
        return {
          badge: 'bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]',
          btn: 'bg-[#EA580C] hover:bg-[#C2410C] text-white',
          hoverBorder: 'hover:border-[#EA580C]',
          titleHover: 'group-hover:text-[#EA580C]',
          glow: 'hover:shadow-[0_16px_36px_rgba(234,88,12,0.14)]'
        };
      case 'health':
        return {
          badge: 'bg-[#EAF8F6] text-[#106B65] border-[#99F6E4]',
          btn: 'bg-[#148A83] hover:bg-[#106B65] text-white',
          hoverBorder: 'hover:border-[#148A83]',
          titleHover: 'group-hover:text-[#148A83]',
          glow: 'hover:shadow-[0_16px_36px_rgba(20,138,131,0.14)]'
        };
      case 'senior_citizen':
        return {
          badge: 'bg-[#FFF5E5] text-[#955B0D] border-[#FED7AA]',
          btn: 'bg-[#C47A16] hover:bg-[#955B0D] text-white',
          hoverBorder: 'hover:border-[#C47A16]',
          titleHover: 'group-hover:text-[#C47A16]',
          glow: 'hover:shadow-[0_16px_36px_rgba(196,122,22,0.14)]'
        };
      default:
        return {
          badge: 'bg-[#F2EFFD] text-[#5B45B5] border-[#DCD8EC]',
          btn: 'bg-[#5B45B5] hover:bg-[#4C37B4] text-white',
          hoverBorder: 'hover:border-[#5B45B5]',
          titleHover: 'group-hover:text-[#5B45B5]',
          glow: 'hover:shadow-[0_16px_36px_rgba(91,69,181,0.14)]'
        };
    }
  };

  // Curated 3 Featured Scheme Items with 100% accurate category-to-image mapping:
  // 1. शेतकरी कल्याण योजना -> शेतकरी फोटो
  // 2. शिक्षण व शिष्यवृत्ती योजना -> शिक्षण फोटो
  // 3. महिला व बाल विकास योजना -> महिला सक्षमीकरण फोटो
  const topFeaturedSchemes = useMemo(() => {
    // 1. Find genuine farmer scheme
    const sFarmer = allSchemes.find(s => 
      s.id === 's-5' || s.id === 's-4' || s.id === 'namo-shetkari-mahasamman' || s.category === 'farmer' || s.category === 'agriculture'
    ) || allSchemes.find(s => s.category === 'farmer') || allSchemes[0];

    // 2. Find genuine education / student scheme
    const sEdu = allSchemes.find(s => 
      s.id === 's-8' || s.id === 'mahadbt-post-matric-scholarship' || s.category === 'education' || s.category === 'student'
    ) || allSchemes.find(s => s.category === 'student' || s.category === 'education') || allSchemes[1] || allSchemes[0];

    // 3. Find genuine women scheme
    const sWomen = allSchemes.find(s => 
      s.id === 's-1' || s.id === 'mukhyamantri-majhi-ladki-bahin-yojana' || s.id === 'ladki-bahin-yojana' || s.category === 'women'
    ) || allSchemes.find(s => s.category === 'women') || allSchemes[0];

    return [
      {
        ...sFarmer,
        featuredImg: getSchemeImage(sFarmer, getImageByKey),
        featuredImgAlt: sFarmer.imageAlt || sFarmer.title,
        style: getCategoryStyles(sFarmer.category || sFarmer.categoryLabel)
      },
      {
        ...sEdu,
        featuredImg: getSchemeImage(sEdu, getImageByKey),
        featuredImgAlt: sEdu.imageAlt || sEdu.title,
        style: getCategoryStyles(sEdu.category || sEdu.categoryLabel)
      },
      {
        ...sWomen,
        featuredImg: getSchemeImage(sWomen, getImageByKey),
        featuredImgAlt: sWomen.imageAlt || sWomen.title,
        style: getCategoryStyles(sWomen.category || sWomen.categoryLabel)
      }
    ];
  }, [allSchemes, getImageByKey]);

  return (
    <section id="schemes-section" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Heading: Centered, Large and Prominent */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F2EFFD] text-[#5B45B5] text-xs sm:text-sm font-bold border border-[#DCD8EC] shadow-xs">
          <Sparkles className="w-4 h-4 text-[#5B45B5]" />
          <span>कल्याणकारी शासकीय उपक्रम</span>
        </div>
        
        {/* Exact Section Title: 32-42px */}
        <h2 className="text-2xl sm:text-4xl lg:text-[38px] font-extrabold text-[#172033] tracking-tight font-heading leading-tight">
          नवीन आणि <span className="text-[#5B45B5]">महत्त्वाच्या योजना</span>
        </h2>
        
        <p className="text-base sm:text-lg text-[#46505F] max-w-xl mx-auto font-medium leading-relaxed">
          महाराष्ट्र व केंद्र शासनाच्या प्रमुख योजनांचे लाभ, निकष आणि अधिकृत अर्ज पद्धती.
        </p>

        {/* Local Search and Filter Bar */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-[#5B45B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="योजनांमध्ये शोधा (उदा. लाडकी बहीण, शेतकरी)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#E8E5F2] text-sm sm:text-base text-[#172033] placeholder-[#6B7280] focus:border-[#5B45B5] focus:ring-4 focus:ring-[#F2EFFD] outline-none transition shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* 3 LARGE 16:9 IMAGE-BASED SCHEME ITEMS (Zero Crop, Zero Zoom, Object-Contain) */}
      {!localSearch && selectedCategory === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {topFeaturedSchemes.map((scheme, idx) => (
            <div
              key={scheme.id || idx}
              onClick={() => onOpenDetails(scheme)}
              className={`group bg-white rounded-2xl sm:rounded-3xl border-2 border-[#E8E5F2] ${scheme.style.hoverBorder} overflow-hidden shadow-[0_8px_24px_rgba(23,32,51,0.05)] ${scheme.style.glow} transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1`}
            >
              {/* 16:9 Aspect Ratio Image Container with object-fit: contain (Zero crop, zero zoom) */}
              <div 
                className="relative w-full bg-[#FAF9FD] overflow-hidden flex items-center justify-center border-b border-[#E8E5F2]"
                style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto' }}
              >
                <img
                  src={scheme.featuredImg}
                  alt={scheme.featuredImgAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain block transition-transform duration-300 group-hover:scale-101"
                  style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto', objectFit: 'contain' }}
                />
                
                {/* Category Badge Floating on Top Left */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className={`text-xs sm:text-sm font-extrabold px-3.5 py-1 rounded-full shadow-xs border ${scheme.style.badge}`}>
                    {scheme.categoryLabel}
                  </span>
                </div>

                {/* Bookmark Action on Top Right */}
                <button
                  onClick={(e) => toggleBookmark(scheme.slug, e)}
                  className={`absolute top-3.5 right-3.5 z-10 p-2 rounded-xl backdrop-blur-md transition cursor-pointer ${
                    bookmarkedSlugs.includes(scheme.slug)
                      ? 'text-[#5B45B5] bg-white shadow-md'
                      : 'text-white bg-[#172033]/60 hover:bg-white hover:text-[#5B45B5]'
                  }`}
                  title="जतन करा"
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedSlugs.includes(scheme.slug) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Content Underneath */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#16834B] font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#16834B]" />
                    <span>सत्यापित शासन निर्णय (GR)</span>
                  </div>

                  <h3 className={`text-xl sm:text-[22px] font-extrabold text-[#172033] ${scheme.style.titleHover} transition-colors leading-snug font-heading`}>
                    {scheme.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#46505F] line-clamp-2 leading-relaxed">
                    {scheme.shortDescription}
                  </p>
                </div>

                {/* Button at Bottom: "अधिक माहिती" */}
                <div className="pt-4 border-t border-[#E8E5F2] flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-[#6B7280] font-medium">
                    {scheme.targetAudience}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetails(scheme);
                    }}
                    className={`px-4 sm:px-5 py-2.5 rounded-xl ${scheme.style.btn} text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md hover:scale-102`}
                  >
                    <span>अधिक माहिती</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Pills Filter for all other schemes */}
      <div className="w-full max-w-full flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
        {SCHEME_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'all' 
            ? allSchemes.length 
            : allSchemes.filter(s => s.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CategoryType)}
              className={`whitespace-nowrap px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#5B45B5] text-white shadow-xs'
                  : 'bg-white text-[#46505F] border-2 border-[#E8E5F2] hover:border-[#5B45B5] hover:text-[#5B45B5]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#F3F1FA] text-[#5B45B5]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Complete Schemes List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <SchemeCard 
            key={scheme.id}
            scheme={scheme}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>

    </section>
  );
};
