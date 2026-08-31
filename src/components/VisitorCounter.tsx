import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Eye,
  Activity
} from 'lucide-react';
import { trackPageView, getVisitorStats, VisitorStats } from '../utils/analytics';

export const VisitorCounter: React.FC = () => {
  const [stats, setStats] = useState<VisitorStats>({
    total: 0,
    today: 0,
    month: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAndTrack = async () => {
      try {
        const hasTrackedInSession = sessionStorage.getItem('mahamahiti_visit_tracked');
        let newStats: VisitorStats | null = null;

        if (!hasTrackedInSession) {
          newStats = await trackPageView();
          sessionStorage.setItem('mahamahiti_visit_tracked', 'true');
        } else {
          newStats = await getVisitorStats();
        }

        if (newStats && isMounted) {
          setStats(newStats);
        }
      } catch (err) {
        console.warn('Visitor counter fetch note:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAndTrack();

    return () => {
      isMounted = false;
    };
  }, []);

  // Format number with Indian numbering system (e.g. 1,25,480)
  const formatCount = (num: number) => {
    return (num || 0).toLocaleString('en-IN');
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-[#E8E5F2] shadow-[0_8px_28px_rgba(23,32,51,0.04)]">
        
        {/* Title and Trust indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8E5F2]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2EFFD] text-[#5B45B5] text-xs font-bold border border-[#DDD6FE]">
              <Activity className="w-3.5 h-3.5" />
              <span>थेट आकडेवारी (Live Citizen Visits)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#172033] font-heading tracking-tight">
              पोर्टल वाचक व नागरिक उपस्थिती (Visitor Counter)
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#16834B] font-bold bg-[#EAF7EF] px-3.5 py-1.5 rounded-xl border border-[#BBF7D0]">
            <ShieldCheck className="w-4 h-4 text-[#16834B]" />
            <span>विश्वासू व पारदर्शक नोंद</span>
          </div>
        </div>

        {/* 3 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: Total Visitors */}
          <div className="bg-[#FAF9FD] rounded-2xl p-5 border border-[#E8E5F2] hover:border-[#5B45B5]/50 transition-all group shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-bold text-[#46505F]">एकूण नागरिक भेटी (Total Visits)</span>
              <div className="w-9 h-9 rounded-xl bg-[#F2EFFD] text-[#5B45B5] flex items-center justify-center border border-[#DDD6FE] group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight font-heading">
              {loading ? '...' : formatCount(stats.total)}
            </div>
            <div className="text-[11px] font-semibold text-[#5B45B5] mt-1.5">
              ✦ संपूर्ण महाराष्ट्रातून नागरिक सहभाग
            </div>
          </div>

          {/* Card 2: Today's Visitors */}
          <div className="bg-[#EAF7EF] rounded-2xl p-5 border border-[#BBF7D0] hover:border-[#16834B]/50 transition-all group shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-bold text-[#12643A]">आजच्या भेटी (Today)</span>
              <div className="w-9 h-9 rounded-xl bg-white text-[#16834B] flex items-center justify-center border border-[#BBF7D0] group-hover:scale-105 transition-transform">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight font-heading">
              {loading ? '...' : formatCount(stats.today)}
            </div>
            <div className="text-[11px] font-semibold text-[#16834B] mt-1.5">
              ✦ आज सरकारी योजना शोधणारे नागरिक
            </div>
          </div>

          {/* Card 3: This Month's Visitors */}
          <div className="bg-[#EEF1FF] rounded-2xl p-5 border border-[#C7D2FE] hover:border-[#4056B5]/50 transition-all group shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-bold text-[#30428D]">या महिन्यातील भेटी (This Month)</span>
              <div className="w-9 h-9 rounded-xl bg-white text-[#4056B5] flex items-center justify-center border border-[#C7D2FE] group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight font-heading">
              {loading ? '...' : formatCount(stats.month)}
            </div>
            <div className="text-[11px] font-semibold text-[#4056B5] mt-1.5">
              ✦ चालू महिन्यातील एकूण माहिती वाचक
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
