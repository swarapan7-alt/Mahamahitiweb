import React, { useRef, useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Sparkles,
  Flame
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
  const [animationDuration, setAnimationDuration] = useState<number>(65);

  const updatesList: LatestUpdate[] = (adminUpdates && adminUpdates.length > 0) 
    ? adminUpdates.filter(u => (u as any).published !== false)
    : UPDATES_DATA;

  // Measure content width and compute a smooth, readable speed (approx 30 px/sec)
  useEffect(() => {
    const updateSpeed = () => {
      if (trackRef.current) {
        const fullScrollWidth = trackRef.current.scrollWidth;
        const halfWidth = fullScrollWidth / 2;
        // Target comfortable reading speed: ~30 pixels per second
        const targetSpeedPxPerSec = 30;
        const computedSeconds = Math.max(45, Math.round(halfWidth / targetSpeedPxPerSec));
        setAnimationDuration(computedSeconds);
      }
    };

    updateSpeed();
    window.addEventListener('resize', updateSpeed);
    
    if (document.fonts) {
      document.fonts.ready.then(updateSpeed);
    }

    return () => window.removeEventListener('resize', updateSpeed);
  }, [updatesList]);

  if (!updatesList || updatesList.length === 0) {
    return null;
  }

  // Category badge styling helper
  const getCategoryBadgeStyle = (category?: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('शेतकरी') || cat.includes('कृषी') || cat.includes('farmer')) {
      return {
        badge: 'bg-[#EAF7EF] text-[#16834B] border-[#BBF7D0]',
        label: 'शेतकरी'
      };
    }
    if (cat.includes('महिला') || cat.includes('women') || cat.includes('बहीण')) {
      return {
        badge: 'bg-[#FFF0F5] text-[#C23B68] border-[#FECDD3]',
        label: 'महिला'
      };
    }
    if (cat.includes('शिक्षण') || cat.includes('विद्यार्थी') || cat.includes('शिष्यवृत्ती')) {
      return {
        badge: 'bg-[#EEF1FF] text-[#4056B5] border-[#C7D2FE]',
        label: 'शिक्षण'
      };
    }
    if (cat.includes('कामगार') || cat.includes('worker') || cat.includes('bocw')) {
      return {
        badge: 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]',
        label: 'कामगार'
      };
    }
    if (cat.includes('आरोग्य') || cat.includes('health') || cat.includes('विमा')) {
      return {
        badge: 'bg-[#EAF8F6] text-[#148A83] border-[#99F6E4]',
        label: 'आरोग्य'
      };
    }
    return {
      badge: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
      label: category || 'योजना'
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Red-Themed Ticker Bar */}
      <div className="bg-[#FFF5F5] rounded-xl sm:rounded-2xl border-2 border-[#FECACA] hover:border-[#EF4444] shadow-[0_4px_16px_rgba(220,38,38,0.06)] overflow-hidden flex flex-col sm:flex-row items-stretch sm:items-center transition-all">
        
        {/* Left Fixed Red Header Badge */}
        <div className="bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white px-3.5 sm:px-5 py-2 sm:py-3 flex items-center justify-between sm:justify-center gap-2 shrink-0 z-10 select-none shadow-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <div className="flex items-center gap-1.5 font-heading font-extrabold text-sm sm:text-base tracking-tight text-white">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>नवीनतम अपडेट</span>
            </div>
          </div>

          <button
            onClick={onNavigateToUpdates}
            className="sm:hidden text-[11px] font-bold text-white/95 hover:text-white underline underline-offset-2 py-0.5 px-2 rounded-md bg-black/20"
          >
            सर्व पहा
          </button>
        </div>

        {/* Right-to-Left Scrolling Marquee Track */}
        <div className="relative flex-1 overflow-hidden py-2 sm:py-2.5 px-3 sm:px-4 min-w-0">
          <div 
            ref={trackRef}
            className="flex items-center space-x-8 sm:space-x-12 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer"
            style={{ animationDuration: `${animationDuration}s` }}
          >
            {/* Duplicated list to create a seamless infinite loop */}
            {[...updatesList, ...updatesList].map((item, idx) => {
              const catStyle = getCategoryBadgeStyle(item.category);
              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => onSelectUpdate && onSelectUpdate(item)}
                  className="inline-flex items-center gap-2.5 text-xs sm:text-sm md:text-[15px] text-[#172033] hover:text-[#DC2626] transition-colors group px-1 font-medium select-none"
                >
                  {/* Category Pill */}
                  <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold border shadow-2xs ${catStyle.badge}`}>
                    {item.category || catStyle.label}
                  </span>
                  
                  {/* Update Title */}
                  <span className="text-[#172033] group-hover:text-[#DC2626] font-semibold group-hover:underline underline-offset-2 transition-colors">
                    {item.title}
                  </span>

                  {/* Published Date Tag */}
                  {item.publishedDate && (
                    <span className="text-[#6B7280] text-[11px] sm:text-xs font-normal">
                      • {item.publishedDate}
                    </span>
                  )}

                  {/* Red Dot Separator */}
                  <span className="text-[#EF4444] font-bold ml-2 sm:ml-4 select-none">◆</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right "सर्व अपडेट्स" Action for Desktop */}
        <div className="hidden sm:flex items-center pr-4 pl-3 shrink-0 border-l border-[#FECACA] bg-white/50">
          <button
            onClick={onNavigateToUpdates}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#DC2626] hover:text-[#991B1B] hover:underline underline-offset-2 py-1 px-2.5 rounded-lg hover:bg-white transition cursor-pointer"
          >
            <span>सर्व अपडेट्स</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#DC2626]" />
          </button>
        </div>

      </div>
    </div>
  );
};
