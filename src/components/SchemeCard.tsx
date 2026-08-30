import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { Scheme } from '../types';

interface SchemeCardProps {
  scheme: Scheme;
  onOpenDetails: (scheme: Scheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onOpenDetails }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('mahamahiti_favorites') || localStorage.getItem('aapli_mahiti_favorites') || '[]');
      setIsBookmarked(favs.includes(scheme.slug));
    } catch (e) {}
  }, [scheme.slug]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('mahamahiti_favorites') || localStorage.getItem('aapli_mahiti_favorites') || '[]');
      let updated: string[];
      if (favs.includes(scheme.slug)) {
        updated = favs.filter(s => s !== scheme.slug);
        setIsBookmarked(false);
      } else {
        updated = [...favs, scheme.slug];
        setIsBookmarked(true);
      }
      localStorage.setItem('mahamahiti_favorites', JSON.stringify(updated));
    } catch (e) {}
  };

  const getCategoryStyles = (cat?: string) => {
    switch (cat) {
      case 'agriculture':
      case 'farmer':
      case 'शेतकरी':
        return {
          badge: 'bg-[#EAF7EF] text-[#12643A] border-[#BBF7D0]',
          borderHover: 'hover:border-[#16834B]',
          titleHover: 'group-hover:text-[#16834B]',
          btn: 'bg-[#16834B] hover:bg-[#12643A] text-white',
          accent: 'text-[#16834B]',
          tagBg: 'bg-[#EAF7EF] text-[#12643A] border-[#BBF7D0]'
        };
      case 'education':
      case 'student':
      case 'शिक्षण':
        return {
          badge: 'bg-[#EEF1FF] text-[#30428D] border-[#C7D2FE]',
          borderHover: 'hover:border-[#4056B5]',
          titleHover: 'group-hover:text-[#4056B5]',
          btn: 'bg-[#4056B5] hover:bg-[#30428D] text-white',
          accent: 'text-[#4056B5]',
          tagBg: 'bg-[#EEF1FF] text-[#30428D] border-[#C7D2FE]'
        };
      case 'women':
      case 'महिला':
        return {
          badge: 'bg-[#FFF0F5] text-[#962B4E] border-[#FECDD3]',
          borderHover: 'hover:border-[#C23B68]',
          titleHover: 'group-hover:text-[#C23B68]',
          btn: 'bg-[#C23B68] hover:bg-[#962B4E] text-white',
          accent: 'text-[#C23B68]',
          tagBg: 'bg-[#FFF0F5] text-[#962B4E] border-[#FECDD3]'
        };
      case 'health':
      case 'आरोग्य':
        return {
          badge: 'bg-[#EAF8F6] text-[#106B65] border-[#99F6E4]',
          borderHover: 'hover:border-[#148A83]',
          titleHover: 'group-hover:text-[#148A83]',
          btn: 'bg-[#148A83] hover:bg-[#106B65] text-white',
          accent: 'text-[#148A83]',
          tagBg: 'bg-[#EAF8F6] text-[#106B65] border-[#99F6E4]'
        };
      case 'worker':
      case 'कामगार':
      case 'कामगारांसाठी योजना':
        return {
          badge: 'bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]',
          borderHover: 'hover:border-[#EA580C]',
          titleHover: 'group-hover:text-[#EA580C]',
          btn: 'bg-[#EA580C] hover:bg-[#C2410C] text-white',
          accent: 'text-[#EA580C]',
          tagBg: 'bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]'
        };
      case 'senior':
      case 'senior_citizen':
      case 'ज्येष्ठ नागरिक':
        return {
          badge: 'bg-[#FFF5E5] text-[#955B0D] border-[#FED7AA]',
          borderHover: 'hover:border-[#C47A16]',
          titleHover: 'group-hover:text-[#C47A16]',
          btn: 'bg-[#C47A16] hover:bg-[#955B0D] text-white',
          accent: 'text-[#C47A16]',
          tagBg: 'bg-[#FFF5E5] text-[#955B0D] border-[#FED7AA]'
        };
      default:
        return {
          badge: 'bg-[#F2EFFD] text-[#5B45B5] border-[#DCD8EC]',
          borderHover: 'hover:border-[#5B45B5]',
          titleHover: 'group-hover:text-[#5B45B5]',
          btn: 'bg-[#5B45B5] hover:bg-[#4C37B4] text-white',
          accent: 'text-[#5B45B5]',
          tagBg: 'bg-[#F2EFFD] text-[#5B45B5] border-[#DCD8EC]'
        };
    }
  };

  const style = getCategoryStyles(scheme.category || scheme.categoryLabel);

  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl border-2 border-[#E8E5F2] ${style.borderHover} shadow-[0_4px_20px_rgba(23,32,51,0.04)] hover:shadow-[0_12px_32px_rgba(23,32,51,0.08)] transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between group`}>
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className={`text-xs sm:text-sm font-extrabold px-3.5 py-1 rounded-full border shadow-2xs ${style.badge}`}>
            {scheme.categoryLabel}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-[#16834B] bg-[#EAF7EF] px-2.5 py-0.5 rounded-full border border-[#BBF7D0] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16834B]" />
              <span>सत्यापित GR</span>
            </div>
            <button
              onClick={toggleBookmark}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isBookmarked 
                  ? 'text-[#5B45B5] bg-[#F2EFFD]' 
                  : 'text-[#6B7280] hover:text-[#5B45B5] hover:bg-[#F2EFFD]'
              }`}
              title={isBookmarked ? 'जतन केलेले काढून टाका' : 'जतन करा (Bookmark)'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scheme Title: 20-24px readable dark navy title */}
        <h3 
          onClick={() => onOpenDetails(scheme)}
          className={`text-lg sm:text-[22px] font-extrabold text-[#172033] mb-2.5 ${style.titleHover} transition-colors leading-snug cursor-pointer font-heading`}
        >
          {scheme.title}
        </h3>

        {/* Benefit Summary Badge */}
        {scheme.benefitSummary && (
          <div className={`mb-3 inline-block ${style.tagBg} text-xs sm:text-sm font-bold px-3 py-1 rounded-lg border`}>
            लाभ: {scheme.benefitSummary}
          </div>
        )}

        {/* Short description */}
        <p className="text-sm sm:text-base text-[#46505F] mb-4 line-clamp-2 leading-relaxed font-normal">
          {scheme.shortDescription}
        </p>

        {/* Target Audience Box */}
        <div className="bg-[#FAF9FD] p-3.5 rounded-xl border border-[#E8E5F2] mb-3 text-xs sm:text-sm text-[#46505F]">
          <span className="font-bold text-[#172033] block mb-1">
            पात्रता निकष:
          </span>
          <span className="line-clamp-2">{scheme.targetAudience}</span>
        </div>
      </div>

      {/* Bottom Footer Action */}
      <div className="pt-4 border-t border-[#E8E5F2] flex items-center justify-between gap-3 mt-1">
        <div className="text-xs text-[#6B7280] flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#5B45B5]" />
          <span>{scheme.lastVerifiedAt}</span>
        </div>

        <button
          onClick={() => onOpenDetails(scheme)}
          className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl ${style.btn} font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs hover:shadow-md hover:scale-102`}
        >
          <span>अधिक माहिती</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


