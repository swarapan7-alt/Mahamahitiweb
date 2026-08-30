import React, { useRef, useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Sparkles
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { LatestUpdate } from '../types';
import { UPDATES_DATA } from '../data/updates';

interface UpdatesTickerProps {
  onSelectUpdate?: (update: LatestUpdate) => void;
  onNavigateToUpdates?: () => void;
}

export const UpdatesTicker: React.FC<UpdatesTickerProps> = ({
  onSelectUpdate,
  onNavigateToUpdates
}) => {
  const { updates: adminUpdates } = useAdminAuth();
  const trackRef = useRef<HTMLDivElement>(null);
  const [animationDuration, setAnimationDuration] = useState<number>(85);

  const updatesList: LatestUpdate[] = (adminUpdates && adminUpdates.length > 0) 
    ? adminUpdates 
    : UPDATES_DATA;

  // Measure content width and compute strictly slow animation duration (25–30 px/second)
  useEffect(() => {
    const updateSpeed = () => {
      if (trackRef.current) {
        const fullScrollWidth = trackRef.current.scrollWidth;
        const halfWidth = fullScrollWidth / 2;
        // Target speed: ~28 pixels per second (strictly between 25-35 px/s)
        const targetSpeedPxPerSec = 28;
        const computedSeconds = Math.max(75, Math.round(halfWidth / targetSpeedPxPerSec));
        setAnimationDuration(computedSeconds);
      }
    };

    updateSpeed();
    window.addEventListener('resize', updateSpeed);
    
    // Also re-measure after web fonts load
    if (document.fonts) {
      document.fonts.ready.then(updateSpeed);
    }

    return () => window.removeEventListener('resize', updateSpeed);
  }, [updatesList]);

  if (!updatesList || updatesList.length === 0) {
    return null;
  }

  // Category keyword color helper (Farmer, Women, Education, Health, Documents)
  const getCategoryBadgeStyle = (category?: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('शेतकरी') || cat.includes('कृषी') || cat.includes('farmer') || cat.includes('agri')) {
      return {
        badge: 'bg-[#EAF7EF] text-[#16834B] border-[#B7E4C7]',
        label: 'शेतकरी'
      };
    }
    if (cat.includes('महिला') || cat.includes('women') || cat.includes('बहीण') || cat.includes('लाडकी')) {
      return {
        badge: 'bg-[#FFF0F5] text-[#C43D73] border-[#FECDD3]',
        label: 'महिला'
      };
    }
    if (cat.includes('शिक्षण') || cat.includes('विद्यार्थी') || cat.includes('edu') || cat.includes('student') || cat.includes('शिष्यवृत्ती')) {
      return {
        badge: 'bg-[#EEF1FF] text-[#2563A6] border-[#C7D2FE]',
        label: 'शिक्षण'
      };
    }
    if (cat.includes('आरोग्य') || cat.includes('health') || cat.includes('विमा') || cat.includes('उपचार')) {
      return {
        badge: 'bg-[#EAF8F6] text-[#148A83] border-[#99F6E4]',
        label: 'आरोग्य'
      };
    }
    if (cat.includes('कागदपत्र') || cat.includes('सेवा') || cat.includes('ज्येष्ठ') || cat.includes('senior') || cat.includes('doc')) {
      return {
        badge: 'bg-[#FFF5E5] text-[#D97706] border-[#FED7AA]',
        label: 'कागदपत्रे'
      };
    }
    return {
      badge: 'bg-[#F2EFFD] text-[#5B45B5] border-[#DDD6FE]',
      label: category || 'सरकारी योजना'
    };
  };

  return (
    <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-6">
      {/* Main Ticker Container with Light Background (#FFF7F7) & Subtle Red Border (#F2B8B8) */}
      <div className="bg-[#FFF7F7] backdrop-blur-md rounded-2xl border-2 border-[#F2B8B8] hover:border-[#D62828]/50 shadow-[0_4px_20px_rgba(214,40,40,0.06)] overflow-hidden flex flex-col sm:flex-row items-stretch sm:items-center transition-colors">
        
        {/* Fixed Left Badge: Strong Red (#D62828) with Crisp White Text (#FFFFFF) */}
        <div className="bg-[#D62828] text-white px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between sm:justify-center gap-2.5 shrink-0 z-10 shadow-xs select-none">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span 
              className="font-extrabold text-[16px] sm:text-[19px] tracking-tight font-heading whitespace-nowrap text-white"
              style={{ fontWeight: 800 }}
            >
              🔴 ताजे अपडेट्स
            </span>
          </div>

          <button
            onClick={onNavigateToUpdates}
            className="sm:hidden text-xs font-bold text-white/90 hover:text-white underline underline-offset-2 py-1 px-2.5 rounded-lg bg-black/15"
          >
            सर्व पहा
          </button>
        </div>

        {/* Scrolling Marquee Container (Genuinely Slow Continuous Loop at 25-30 px/sec) */}
        <div className="relative flex-1 overflow-hidden py-2.5 sm:py-3.5 px-3 sm:px-4 min-w-0">
          <div 
            ref={trackRef}
            className="flex items-center space-x-8 sm:space-x-12 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer"
            style={{ animationDuration: `${animationDuration}s` }}
          >
            {/* Render items twice to create seamless loop with zero jump */}
            {[...updatesList, ...updatesList].map((item, idx) => {
              const catStyle = getCategoryBadgeStyle(item.category);
              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => onSelectUpdate && onSelectUpdate(item)}
                  className="inline-flex items-center gap-3 text-[15px] sm:text-[18px] text-[#172033] hover:text-[#D62828] transition-colors group px-2 font-semibold leading-snug"
                >
                  {/* Category Badge with Specific Contrast Colors */}
                  <span className={`px-2.5 py-0.5 rounded-md text-xs sm:text-[14px] font-extrabold border shadow-2xs ${catStyle.badge}`}>
                    {item.category || catStyle.label}
                  </span>
                  
                  {/* Main Update Text in Strong Dark Navy (#172033) */}
                  <span className="text-[#172033] group-hover:text-[#D62828] group-hover:underline underline-offset-3 transition-colors font-semibold">
                    {item.title}
                  </span>

                  {/* Published Date Tag */}
                  <span className="text-[#6B7280] text-xs sm:text-[13px] font-medium">
                    ({item.publishedDate || '२०२६'})
                  </span>

                  {/* Separator */}
                  <span className="text-[#F2B8B8] ml-3 sm:ml-5 select-none font-bold">✦</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Action: View All */}
        <div className="hidden sm:flex items-center pr-4 pl-3 shrink-0 border-l border-[#F2B8B8] bg-white/40">
          <button
            onClick={onNavigateToUpdates}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#D62828] hover:text-[#991B1B] hover:underline underline-offset-2 py-1.5 px-3 rounded-xl hover:bg-white transition cursor-pointer"
          >
            <span>सर्व अपडेट्स</span>
            <ChevronRight className="w-4 h-4 text-[#D62828]" />
          </button>
        </div>

      </div>
    </div>
  );
};
