import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, Trash2, ArrowRight, BookOpen, FileText, CheckCircle2 } from 'lucide-react';
import { SCHEMES_DATA } from '../../data/schemes';
import { DOCUMENTS_DATA } from '../../data/documents';
import { LOAN_SCHEMES_DATA } from '../../data/loanSchemes';
import { SERVICES_DATA } from '../../data/services';

interface FavoritesPageProps {
  onOpenScheme?: (scheme: any) => void;
  onOpenDetail?: (type: 'scheme' | 'document' | 'service' | 'loan' | 'update', item: any) => void;
  onNavigate?: (tab: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onOpenScheme, onOpenDetail, onNavigate }) => {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<{ type: string; slug: string; title: string; timestamp: number }[]>([]);

  const handleOpenItem = (type: 'scheme' | 'document' | 'service' | 'loan' | 'update', item: any) => {
    if (onOpenDetail) {
      onOpenDetail(type, item);
    } else if (onOpenScheme) {
      onOpenScheme(item);
    }
  };

  useEffect(() => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem('mahamahiti_favorites') || localStorage.getItem('aapli_mahiti_favorites') || '[]');
      setFavoriteSlugs(savedFavs);

      const savedRecent = JSON.parse(localStorage.getItem('mahamahiti_recent') || localStorage.getItem('aapli_mahiti_recent') || '[]');
      setRecentlyViewed(savedRecent);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const removeFavorite = (slug: string) => {
    const updated = favoriteSlugs.filter(s => s !== slug);
    setFavoriteSlugs(updated);
    localStorage.setItem('mahamahiti_favorites', JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('mahamahiti_recent');
    localStorage.removeItem('aapli_mahiti_recent');
  };

  // Find favorite objects
  const favoriteSchemes = SCHEMES_DATA.filter(s => favoriteSlugs.includes(s.slug));
  const favoriteDocs = DOCUMENTS_DATA.filter(d => favoriteSlugs.includes(d.slug));
  const favoriteLoans = LOAN_SCHEMES_DATA.filter(l => favoriteSlugs.includes(l.slug));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <nav className="flex items-center gap-2 text-xs text-[#6E6A82] mb-6 font-medium">
        <a href="/" className="hover:text-[#5B4BB7] transition-colors">होम</a>
        <span>/</span>
        <span className="text-[#201A30]">जतन केलेले व अलीकडे पाहिलेले</span>
      </nav>

      {/* Header */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#EEEAFE] text-[#5B4BB7] flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#201A30] font-serif">
              जतन केलेल्या योजना व कागदपत्रे
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6A82]">
              तुमच्या सोयीसाठी तुमच्याच ब्राउझरमध्ये सुरक्षित साठवलेली वैयक्तिक यादी.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Bookmarks (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-[#201A30] flex items-center justify-between">
            <span>बुकमार्क केलेल्या नोंदी ({favoriteSlugs.length})</span>
          </h2>

          {favoriteSlugs.length === 0 ? (
            <div className="bg-white border border-[#EDEBF0] rounded-2xl p-8 text-center">
              <Bookmark className="w-8 h-8 text-[#DDD6FE] mx-auto mb-3" />
              <p className="text-sm font-medium text-[#201A30] mb-1">कोणतीही योजना किंवा कागदपत्र जतन केलेले नाही</p>
              <p className="text-xs text-[#6E6A82] mb-4">कोणत्याही माहिती कार्डवरील बुकमार्क आयकॉनवर क्लिक करून तुम्ही येथे सेव्ह करू शकता.</p>
              <button 
                onClick={() => onNavigate ? onNavigate('schemes') : null}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B4BB7] text-white text-xs font-semibold rounded-xl hover:bg-[#4D3EA0] transition-colors cursor-pointer"
              >
                योजना एक्सप्लोर करा →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteSchemes.map((s) => (
                <div key={s.id} className="bg-white border border-[#EDEBF0] hover:border-[#DDD6FE] rounded-xl p-4 transition-all flex items-center justify-between gap-4 shadow-xs">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#EEEAFE] text-[#5B4BB7] font-semibold">सरकारी योजना</span>
                    <h3 className="font-bold text-sm text-[#201A30] mt-1 hover:text-[#5B4BB7] cursor-pointer" onClick={() => handleOpenItem('scheme', s)}>
                      {s.title}
                    </h3>
                    <p className="text-xs text-[#6E6A82] line-clamp-1 mt-0.5">{s.shortDescription}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenItem('scheme', s)}
                      className="px-3 py-1.5 bg-[#F7F5FF] text-[#5B4BB7] text-xs font-semibold rounded-lg hover:bg-[#EEEAFE] transition-colors"
                    >
                      पहा
                    </button>
                    <button
                      onClick={() => removeFavorite(s.slug)}
                      className="p-1.5 text-[#6E6A82] hover:text-[#DC2626] transition-colors"
                      title="काढून टाका"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {favoriteDocs.map((d) => (
                <div key={d.id} className="bg-white border border-[#EDEBF0] hover:border-[#DDD6FE] rounded-xl p-4 transition-all flex items-center justify-between gap-4 shadow-xs">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#F0F8F4] text-[#367A59] font-semibold">कागदपत्र / दाखला</span>
                    <h3 className="font-bold text-sm text-[#201A30] mt-1 hover:text-[#5B4BB7] cursor-pointer" onClick={() => handleOpenItem('document', d)}>
                      {d.title}
                    </h3>
                    <p className="text-xs text-[#6E6A82] line-clamp-1 mt-0.5">{d.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenItem('document', d)}
                      className="px-3 py-1.5 bg-[#F7F5FF] text-[#5B4BB7] text-xs font-semibold rounded-lg hover:bg-[#EEEAFE] transition-colors"
                    >
                      पहा
                    </button>
                    <button
                      onClick={() => removeFavorite(d.slug)}
                      className="p-1.5 text-[#6E6A82] hover:text-[#DC2626] transition-colors"
                      title="काढून टाका"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {favoriteLoans.map((l) => (
                <div key={l.id} className="bg-white border border-[#EDEBF0] hover:border-[#DDD6FE] rounded-xl p-4 transition-all flex items-center justify-between gap-4 shadow-xs">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFF0F5] text-[#C94A74] font-semibold">कर्ज योजना</span>
                    <h3 className="font-bold text-sm text-[#201A30] mt-1 hover:text-[#5B4BB7] cursor-pointer" onClick={() => handleOpenItem('loan', l)}>
                      {l.title}
                    </h3>
                    <p className="text-xs text-[#6E6A82] line-clamp-1 mt-0.5">{l.loanDetails}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenItem('loan', l)}
                      className="px-3 py-1.5 bg-[#F7F5FF] text-[#5B4BB7] text-xs font-semibold rounded-lg hover:bg-[#EEEAFE] transition-colors"
                    >
                      पहा
                    </button>
                    <button
                      onClick={() => removeFavorite(l.slug)}
                      className="p-1.5 text-[#6E6A82] hover:text-[#DC2626] transition-colors"
                      title="काढून टाका"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Viewed Sidebar (1 col) */}
        <div>
          <div className="bg-white border border-[#EDEBF0] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#201A30] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5B4BB7]" /> अलीकडे पाहिलेले
              </h3>
              {recentlyViewed.length > 0 && (
                <button
                  onClick={clearRecent}
                  className="text-[11px] text-[#6E6A82] hover:text-[#DC2626] transition-colors"
                >
                  रिकामे करा
                </button>
              )}
            </div>

            {recentlyViewed.length === 0 ? (
              <p className="text-xs text-[#6E6A82] py-4 text-center">कोणताही नुकताच पाहिलेला इतिहास उपलब्ध नाही.</p>
            ) : (
              <div className="space-y-2">
                {recentlyViewed.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg hover:bg-[#F7F5FF] cursor-pointer transition-colors border border-transparent hover:border-[#DDD6FE]/40"
                    onClick={() => {
                      // find item in appropriate collection
                      const s = SCHEMES_DATA.find(x => x.slug === item.slug);
                      if (s) return handleOpenItem('scheme', s);
                      const d = DOCUMENTS_DATA.find(x => x.slug === item.slug);
                      if (d) return handleOpenItem('document', d);
                      const l = LOAN_SCHEMES_DATA.find(x => x.slug === item.slug);
                      if (l) return handleOpenItem('loan', l);
                      const srv = SERVICES_DATA.find(x => x.slug === item.slug);
                      if (srv) return handleOpenItem('service', srv);
                    }}
                  >
                    <span className="text-[9px] uppercase font-mono text-[#6E6A82] block">{item.type}</span>
                    <span className="text-xs font-semibold text-[#201A30] line-clamp-1">{item.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
