import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Clock, 
  ShieldCheck, 
  Search, 
  Info, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  FileCheck2, 
  ListTodo 
} from 'lucide-react';
import { DOCUMENTS_DATA } from '../data/mockData';
import { DocumentInfo } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';

interface DocumentListProps {
  onOpenDetails: (doc: DocumentInfo) => void;
  onOpenChecklistForDoc?: (doc: DocumentInfo) => void;
  searchFilter?: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({ 
  onOpenDetails, 
  onOpenChecklistForDoc,
  searchFilter = '' 
}) => {
  const { documents: adminDocs } = useAdminAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>(searchFilter);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'सर्व कागदपत्रे' },
    { id: 'identity', label: 'ओळखपत्रे व रहिवासी' },
    { id: 'income_caste', label: 'उत्पन्न व जात दाखले' },
    { id: 'business', label: 'व्यवसाय व उद्योग' },
    { id: 'vital', label: 'नागरिक व ज्येष्ठ दाखले' },
  ];

  const allDocs = useMemo(() => {
    if (adminDocs && adminDocs.length > 0) {
      return adminDocs;
    }
    return DOCUMENTS_DATA;
  }, [adminDocs]);

  const filteredDocs = useMemo(() => {
    return allDocs.filter((doc) => {
      const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
      const q = (localSearch || '').toLowerCase().trim();
      if (!q) return matchesCat;

      return matchesCat && (
        doc.title.toLowerCase().includes(q) ||
        (doc.description || '').toLowerCase().includes(q) ||
        (doc.categoryLabel || '').toLowerCase().includes(q) ||
        (doc.forWhom || '').toLowerCase().includes(q) ||
        (doc.documentsRequired || []).some(d => d.toLowerCase().includes(q))
      );
    });
  }, [allDocs, localSearch, selectedCategory]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <section id="documents-section" className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] text-[#3157B7] text-xs sm:text-sm font-bold border border-[#BFDBFE] mb-2.5 shadow-xs">
            <FileText className="w-4 h-4 text-[#3157B7]" />
            <span>कागदपत्रे व दाखले मार्गदर्शक</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight font-heading">
            सरकारी कागदपत्रे व <span className="text-[#3157B7]">प्रमाणपत्रांची सूची</span>
          </h2>
          <p className="text-base text-[#4B5567] mt-1.5 max-w-2xl font-medium leading-relaxed">
            कोणत्या कागदपत्रासाठी काय लागते? अर्ज प्रक्रिया व लागणारा कालावधी काय आहे? सर्व माहिती सोप्या भाषेत एकाच ठिकाणी.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-84">
          <div className="relative">
            <Search className="w-4 h-4 text-[#3157B7] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="कागदपत्र शोधा (उदा. आधार, जात दाखला)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#E8E5F2] text-sm sm:text-base text-[#172033] placeholder-[#6B7280] focus:border-[#3157B7] focus:ring-4 focus:ring-[#EFF6FF] outline-none transition shadow-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* Category Pills with counts */}
      <div className="w-full max-w-full flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const count = cat.id === 'all'
            ? DOCUMENTS_DATA.length
            : DOCUMENTS_DATA.filter(d => d.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#3157B7] to-[#1E3A8A] text-white shadow-xs'
                  : 'bg-white text-[#4B5567] border-2 border-[#E8E5F2] hover:border-[#3157B7] hover:text-[#3157B7]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#EFF6FF] text-[#3157B7]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result Count Banner */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-[#6B7280] mb-4 px-1 font-medium">
        <span>उपलब्ध कागदपत्रे व दाखले: <strong className="text-[#172033] font-bold">{filteredDocs.length}</strong></span>
        <span>सत्यापित शासकीय मार्गदर्शक</span>
      </div>

      {/* Document List (List-First Design) */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF9FD] rounded-3xl border-2 border-[#E8E5F2] shadow-xs">
          <Info className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
          <h3 className="text-xl font-bold text-[#172033] mb-1 font-heading">कोणतेही कागदपत्र सापडले नाही</h3>
          <p className="text-sm sm:text-base text-[#4B5567] mb-4">
            कृपया शोध शब्द तपासा किंवा सर्व कागदपत्रांची यादी पाहा.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setLocalSearch('');
            }}
            className="px-6 py-2.5 rounded-xl bg-[#3157B7] hover:bg-[#254494] text-white text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs"
          >
            सर्व कागदपत्रे दाखवा
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDocs.map((doc) => {
            const isExpanded = expandedId === doc.id;

            return (
              <div
                key={doc.id}
                className={`bg-[#FAF9FD] rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-[0_4px_16px_rgba(49,87,183,0.04)] hover:shadow-[0_12px_28px_rgba(49,87,183,0.09)] ${
                  isExpanded ? 'border-[#3157B7] ring-4 ring-[#EFF6FF]' : 'border-[#E8E5F2] hover:border-[#3157B7]/50'
                }`}
              >
                {/* Main List Row */}
                <div 
                  onClick={() => onOpenDetails(doc)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none group"
                >
                  {/* Left Info Column */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#3157B7] flex items-center justify-center font-bold text-sm shrink-0 border border-[#BFDBFE] mt-0.5 group-hover:scale-105 transition-transform shadow-xs">
                      <FileText className="w-6 h-6 text-[#3157B7]" />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#EFF6FF] text-[#3157B7] border border-[#BFDBFE]">
                          {doc.categoryLabel}
                        </span>
                        <span className="text-xs text-[#15966A] flex items-center gap-1 font-bold bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#15966A]" />
                          सत्यापित
                        </span>
                        <span className="text-xs text-[#4B5567] flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-[#E8E5F2] font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#3157B7]" />
                          {doc.estimatedTime}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-[#172033] group-hover:text-[#3157B7] transition-colors leading-snug font-heading">
                        {doc.title}
                      </h3>

                      <p className="text-sm sm:text-base text-[#4B5567] line-clamp-2 leading-relaxed">
                        {doc.description}
                      </p>

                      {/* Required Docs Preview Chips */}
                      <div className="text-xs sm:text-sm text-[#4B5567] flex flex-wrap items-center gap-1.5 pt-0.5 font-medium">
                        <span className="font-bold text-[#172033]">लागणारे पुरावे:</span>
                        <span className="text-[#4B5567] line-clamp-1">
                          {doc.documentsRequired.slice(0, 3).join(' • ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Column */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E8E5F2]">
                    <button
                      onClick={(e) => toggleExpand(doc.id, e)}
                      className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#EFF6FF] text-[#3157B7] text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer border border-[#BFDBFE] shadow-2xs"
                      title="कागदपत्रे व प्रक्रिया पूर्वावलोकन"
                    >
                      <span>तपशील</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {onOpenChecklistForDoc && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenChecklistForDoc(doc);
                        }}
                        className="p-2.5 rounded-xl bg-white hover:bg-[#EFF6FF] text-[#3157B7] border border-[#BFDBFE] hover:border-[#3157B7] transition cursor-pointer shadow-2xs"
                        title="चेकलिस्ट उघडा"
                      >
                        <ListTodo className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onOpenDetails(doc)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3157B7] to-[#1E3A8A] hover:from-[#254494] hover:to-[#172554] text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs hover:shadow-md cursor-pointer hover:scale-102"
                    >
                      <span>सविस्तर माहिती</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Expandable Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-3 bg-white border-t border-[#E8E5F2] space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                      {/* Documents snippet */}
                      <div className="bg-[#FAF9FD] p-4 rounded-2xl border border-[#E8E5F2]">
                        <strong className="text-[#172033] block mb-2 flex items-center gap-1.5 font-bold">
                          <FileCheck2 className="w-4 h-4 text-[#3157B7]" />
                          आवश्यक कागदपत्रांची यादी:
                        </strong>
                        <ul className="space-y-1.5 text-[#4B5567]">
                          {doc.documentsRequired.map((reqDoc, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <span className="text-[#3157B7] font-bold">•</span>
                              <span>{reqDoc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Process Steps snippet */}
                      <div className="bg-[#FAF9FD] p-4 rounded-2xl border border-[#E8E5F2]">
                        <strong className="text-[#172033] block mb-2 flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-[#15966A]" />
                          अर्ज व मिळण्याची पद्धत:
                        </strong>
                        <ol className="space-y-1.5 list-decimal list-inside text-[#4B5567]">
                          {doc.process.map((step, sIdx) => (
                            <li key={sIdx} className="leading-relaxed">
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                      <span className="text-[#4B5567] font-medium">पात्रता: {doc.eligibility.join(', ')}</span>
                      <button
                        onClick={() => onOpenDetails(doc)}
                        className="text-[#3157B7] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>संपूर्ण माहिती व अधिकृत लिंक पाहा</span>
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
