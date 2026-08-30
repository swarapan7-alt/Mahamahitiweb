import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  FileCheck2, 
  Globe2, 
  Sparkles, 
  Info 
} from 'lucide-react';
import { GOVERNMENT_SERVICES_DATA } from '../data/mockData';
import { GovernmentService } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';

interface ServiceListProps {
  onOpenDetails: (service: GovernmentService) => void;
  searchFilter?: string;
}

export const ServiceList: React.FC<ServiceListProps> = ({ onOpenDetails, searchFilter = '' }) => {
  const { services: adminServices } = useAdminAuth();
  const [localSearch, setLocalSearch] = useState<string>(searchFilter);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'सर्व ऑनलाइन सेवा' },
    { id: 'identity', label: 'ओळख व नागरिक सेवा' },
    { id: 'certificates', label: 'दाखले व प्रमाणपत्रे' },
    { id: 'citizen', label: 'सार्वजनिक सेवा' },
    { id: 'agriculture', label: 'शेतकरी व जमीन महसूल' },
    { id: 'business', label: 'व्यवसाय व उद्योग' },
    { id: 'health', label: 'आरोग्य व कल्याण' },
    { id: 'digital', label: 'डिजिटल लॉकर व लॉजिस्टिक्स' }
  ];

  const allServices = useMemo(() => {
    if (adminServices && adminServices.length > 0) {
      return adminServices;
    }
    return GOVERNMENT_SERVICES_DATA;
  }, [adminServices]);

  const filteredServices = useMemo(() => {
    return allServices.filter((srv) => {
      const matchesCat = selectedCategory === 'all' || srv.category === selectedCategory;
      const q = (localSearch || '').toLowerCase().trim();
      if (!q) return matchesCat;
      return (
        matchesCat && (
          srv.title.toLowerCase().includes(q) ||
          (srv.description || '').toLowerCase().includes(q) ||
          (srv.categoryLabel || '').toLowerCase().includes(q) ||
          (srv.purpose || '').toLowerCase().includes(q) ||
          (srv.forWhom || '').toLowerCase().includes(q)
        )
      );
    });
  }, [allServices, localSearch, selectedCategory]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <section id="services-section" className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2EFFD] text-[#5B45C6] text-xs sm:text-sm font-bold border border-[#DCD8EC] mb-2.5 shadow-xs">
            <Layers className="w-4 h-4 text-[#5B45C6]" />
            <span>ऑनलाइन सरकारी सेवा व महा-पोर्टल्स</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight font-heading">
            शासकीय ऑनलाइन <span className="text-[#5B45C6]">सेवांची सूची</span>
          </h2>
          <p className="text-base text-[#4B5567] mt-1.5 max-w-2xl font-medium leading-relaxed">
            नागरिकांसाठी आवश्यक असणाऱ्या सर्व अधिकृत ऑनलाइन पोर्टल्स, दाखले प्रक्रिया आणि थेट लिंक्स एकाच संरचित यादीत.
          </p>
        </div>

        {/* Local Search Bar */}
        <div className="w-full md:w-84">
          <div className="relative">
            <Search className="w-4 h-4 text-[#5B45C6] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="सेवा शोधा (उदा. आपले सरकार, ७/१२, ई-पिक)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#E8E5F2] text-sm sm:text-base text-[#172033] placeholder-[#6B7280] focus:border-[#5B45C6] focus:ring-4 focus:ring-[#F2EFFD] outline-none transition shadow-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="w-full max-w-full flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const count = cat.id === 'all' 
            ? GOVERNMENT_SERVICES_DATA.length 
            : GOVERNMENT_SERVICES_DATA.filter(s => s.category === cat.id).length;
          
          if (cat.id !== 'all' && count === 0) return null;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#5B45C6] to-[#43319E] text-white shadow-xs'
                  : 'bg-white text-[#4B5567] border-2 border-[#E8E5F2] hover:border-[#5B45C6] hover:text-[#5B45C6]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#F3F1FA] text-[#5B45C6]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result Count Banner */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-[#6B7280] mb-4 px-1 font-medium">
        <span>उपलब्ध सेवा: <strong className="text-[#172033] font-bold">{filteredServices.length}</strong></span>
        <span>सत्यापित शासकीय पोर्टल माहिती</span>
      </div>

      {/* Editorial List-First Layout */}
      {filteredServices.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF9FD] rounded-3xl border-2 border-[#E8E5F2] shadow-xs">
          <Info className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
          <h3 className="text-xl font-bold text-[#172033] mb-1 font-heading">कोणतीही ऑनलाइन सेवा सापडली नाही</h3>
          <p className="text-sm sm:text-base text-[#4B5567] mb-4">
            कृपया शोध शब्द तपासा किंवा सर्व सेवांची यादी पाहा.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setLocalSearch('');
            }}
            className="px-6 py-2.5 rounded-xl bg-[#5B45C6] hover:bg-[#4C37B4] text-white text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs"
          >
            सर्व सेवा दाखवा
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredServices.map((srv, index) => {
            const isExpanded = expandedId === srv.id;
            const numberFormatted = String(index + 1).padStart(2, '0');

            return (
              <div
                key={srv.id}
                className={`bg-[#FAF9FD] rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-[0_4px_16px_rgba(91,69,198,0.04)] hover:shadow-[0_12px_28px_rgba(91,69,198,0.09)] ${
                  isExpanded ? 'border-[#5B45C6] ring-4 ring-[#F2EFFD]' : 'border-[#E8E5F2] hover:border-[#5B45C6]/50'
                }`}
              >
                {/* Main List Row */}
                <div 
                  onClick={() => onOpenDetails(srv)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none group"
                >
                  {/* Left Column: Editorial Number & Titles */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-[#F2EFFD] text-[#5B45C6] flex items-center justify-center font-extrabold text-base sm:text-lg shrink-0 border border-[#DCD8EC] mt-0.5 group-hover:scale-105 transition-transform shadow-xs">
                      {numberFormatted}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#F5F3FF] text-[#5B45C6] border border-[#DDD6FE]">
                          {srv.categoryLabel}
                        </span>
                        <span className="text-xs text-[#15966A] flex items-center gap-1 font-bold bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#15966A]" />
                          सत्यापित अधिकृत पोर्टल
                        </span>
                        <span className="text-xs text-[#6B7280] font-medium hidden sm:inline-block">
                          • {srv.officialSourceName}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-[#172033] group-hover:text-[#5B45C6] transition-colors leading-snug font-heading">
                        {srv.title}
                      </h3>

                      <p className="text-sm sm:text-base text-[#4B5567] line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>

                      {/* Purpose Tag */}
                      <div className="text-xs sm:text-sm text-[#5B45C6] font-bold flex items-center gap-1.5 pt-0.5">
                        <Sparkles className="w-4 h-4 shrink-0 text-[#E58A24]" />
                        <span className="line-clamp-1">उद्देश: {srv.purpose}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Meta & Direct Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E8E5F2]">
                    <button
                      onClick={() => onOpenDetails(srv)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5B45C6] to-[#43319E] hover:from-[#4C37B4] hover:to-[#382688] text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs hover:shadow-md cursor-pointer hover:scale-102"
                    >
                      <span>सविस्तर माहिती</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* In-line Expandable Step-by-Step Preview */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-3 bg-white border-t border-[#E8E5F2] space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                      {/* Documents snippet */}
                      <div className="bg-[#FAF9FD] p-4 rounded-2xl border border-[#E8E5F2]">
                        <strong className="text-[#172033] block mb-2 flex items-center gap-1.5 font-bold">
                          <FileCheck2 className="w-4 h-4 text-[#5B45C6]" />
                          लागणारी प्रमुख कागदपत्रे:
                        </strong>
                        <ul className="space-y-1.5 text-[#4B5567]">
                          {srv.documentsRequired.map((doc, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-1.5">
                              <span className="text-[#5B45C6] font-bold">•</span>
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Process Steps snippet */}
                      <div className="bg-[#FAF9FD] p-4 rounded-2xl border border-[#E8E5F2]">
                        <strong className="text-[#172033] block mb-2 flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-[#15966A]" />
                          अर्ज प्रक्रिया टप्पे:
                        </strong>
                        <ol className="space-y-1.5 list-decimal list-inside text-[#4B5567]">
                          {srv.process.map((step, sIdx) => (
                            <li key={sIdx} className="line-clamp-2">
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                      <span className="text-[#4B5567] font-medium">कोणासाठी: {srv.forWhom}</span>
                      <button
                        onClick={() => onOpenDetails(srv)}
                        className="text-[#5B45C6] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>संपूर्ण तपशील व मार्गदर्शक पाहा</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
