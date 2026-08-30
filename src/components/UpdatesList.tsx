import React, { useMemo } from 'react';
import { 
  Calendar, 
  ShieldCheck, 
  ExternalLink, 
  Radio, 
  ArrowRight, 
  Sparkles, 
  FileText 
} from 'lucide-react';
import { LATEST_UPDATES_DATA } from '../data/mockData';
import { LatestUpdate } from '../types';
import { UpdateImage } from './ImageComponents';
import { useAdminAuth } from '../context/AdminAuthContext';

interface UpdatesListProps {
  onOpenUpdateModal?: (update: LatestUpdate) => void;
}

export const UpdatesList: React.FC<UpdatesListProps> = ({ onOpenUpdateModal }) => {
  const { updates: adminUpdates, getImageByKey } = useAdminAuth();

  const allUpdates = useMemo(() => {
    if (adminUpdates && adminUpdates.length > 0) {
      return adminUpdates;
    }
    return LATEST_UPDATES_DATA;
  }, [adminUpdates]);

  const featuredUpdate = allUpdates[0];
  const remainingUpdates = allUpdates.slice(1);

  // Bind to admin image slot for other citizen services / latest updates
  const featuredImageSrc = useMemo(() => {
    if (featuredUpdate?.image && !featuredUpdate.image.startsWith('http') === false) return featuredUpdate.image;
    return getImageByKey('homepage_other_services', 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80');
  }, [featuredUpdate, getImageByKey]);

  return (
    <section id="updates-section" className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] text-[#3157B7] text-xs sm:text-sm font-bold border border-[#BFDBFE] mb-2.5 shadow-xs">
          <Radio className="w-4 h-4 text-[#3157B7]" />
          <span>शासकीय परिपत्रके व लाइव्ह अपडेट्स</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight font-heading">
          नवीन शासकीय माहिती व <span className="text-[#3157B7]">महत्त्वाचे अपडेट्स</span>
        </h2>
        <p className="text-sm sm:text-base text-[#4B5567] mt-1.5 max-w-2xl font-medium leading-relaxed">
          सरकारी योजना, मुदतवाढ, ई-केवायसी आणि महत्त्वाच्या सूचनांचे अधिकृत आणि त्वरित सत्यापित अपडेट्स.
        </p>
      </div>

      <div className="space-y-8">
        {/* ONE Large Featured Editorial Article with Image */}
        {featuredUpdate && (
          <div className="bg-[#FAF9FD] rounded-3xl sm:rounded-[32px] border-2 border-[#E8E5F2] hover:border-[#3157B7]/60 p-6 sm:p-9 shadow-[0_8px_32px_rgba(49,87,183,0.06)] hover:shadow-[0_16px_36px_rgba(49,87,183,0.1)] transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* Left Image (Strict 16:9 Aspect Ratio with contain) */}
              <div className="lg:col-span-5">
                <UpdateImage 
                  src={featuredImageSrc}
                  alt={featuredUpdate.title}
                />
              </div>

              {/* Right Content */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EFF6FF] text-[#3157B7] border border-[#BFDBFE]">
                      {featuredUpdate.category}
                    </span>
                    <span className="text-xs text-[#15966A] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#15966A]" />
                      सत्यापित GR
                    </span>
                  </div>

                  <span className="text-xs sm:text-sm text-[#6B7280] flex items-center gap-1 font-medium">
                    <Calendar className="w-4 h-4 text-[#3157B7]" />
                    {featuredUpdate.publishedDate}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#172033] leading-snug font-heading">
                  {featuredUpdate.title}
                </h3>

                <p className="text-sm sm:text-base text-[#4B5567] leading-relaxed font-medium">
                  {featuredUpdate.shortDescription}
                </p>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E5F2] text-xs sm:text-sm text-[#4B5567] leading-relaxed font-medium">
                  {featuredUpdate.content}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs sm:text-sm text-[#6B7280]">
                    स्रोत: <strong className="text-[#172033] font-bold">{featuredUpdate.officialSource}</strong>
                  </div>

                  <a
                    href={featuredUpdate.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3157B7] to-[#1E3A8A] hover:from-[#254494] hover:to-[#172554] text-white font-bold text-xs sm:text-sm transition shadow-xs hover:shadow-md hover:scale-102 cursor-pointer"
                  >
                    <span>अधिकृत शासन निर्णय पहा</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Vertical Editorial List for Other Updates */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs sm:text-sm font-bold text-[#6B7280] uppercase tracking-wider px-1">
            इतर परिपत्रके व सूचना ({remainingUpdates.length})
          </h4>

          {remainingUpdates.map((update) => (
            <div
              key={update.id}
              className="bg-[#FAF9FD] rounded-2xl sm:rounded-3xl border-2 border-[#E8E5F2] hover:border-[#3157B7]/50 p-5 sm:p-6 transition-all duration-200 shadow-xs hover:shadow-[0_8px_24px_rgba(49,87,183,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#EFF6FF] text-[#3157B7] border border-[#BFDBFE]">
                    {update.category}
                  </span>
                  <span className="text-xs sm:text-sm text-[#6B7280] flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#3157B7]" />
                    {update.publishedDate}
                  </span>
                  {update.verified && (
                    <span className="text-xs text-[#15966A] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#15966A]" />
                      सत्यापित
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#172033] group-hover:text-[#3157B7] transition-colors leading-snug font-heading">
                  {update.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4B5567] leading-relaxed line-clamp-1 font-medium">
                  {update.shortDescription}
                </p>

                <div className="text-xs text-[#6B7280] pt-0.5">
                  अधिकृत स्रोत: {update.officialSource}
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#E8E5F2]">
                <a
                  href={update.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-white group-hover:bg-[#3157B7] text-[#172033] group-hover:text-white border-2 border-[#E8E5F2] group-hover:border-[#3157B7] font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>तपासा</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
