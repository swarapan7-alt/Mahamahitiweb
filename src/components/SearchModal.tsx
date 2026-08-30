import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  Layers, 
  Landmark, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { 
  SCHEMES_DATA, 
  DOCUMENTS_DATA, 
  GOVERNMENT_SERVICES_DATA, 
  LOAN_SCHEMES_DATA 
} from '../data/mockData';
import { useAdminAuth } from '../context/AdminAuthContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: any, type: 'scheme' | 'document' | 'service' | 'loan') => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectItem
}) => {
  const { schemes: adminSchemes, documents: adminDocs, services: adminServices } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const allSchemes = useMemo(() => (adminSchemes && adminSchemes.length > 0 ? adminSchemes : SCHEMES_DATA), [adminSchemes]);
  const allDocs = useMemo(() => (adminDocs && adminDocs.length > 0 ? adminDocs : DOCUMENTS_DATA), [adminDocs]);
  const allServices = useMemo(() => (adminServices && adminServices.length > 0 ? adminServices : GOVERNMENT_SERVICES_DATA), [adminServices]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const query = searchTerm.toLowerCase().trim();

  const matchingSchemes = allSchemes.filter(s => 
    !query || s.title.toLowerCase().includes(query) || (s.description || '').toLowerCase().includes(query) || (s.categoryLabel || '').toLowerCase().includes(query)
  ).slice(0, 4);

  const matchingDocs = allDocs.filter(d =>
    !query || d.title.toLowerCase().includes(query) || (d.description || '').toLowerCase().includes(query) || (d.categoryLabel || '').toLowerCase().includes(query)
  ).slice(0, 4);

  const matchingServices = allServices.filter(s =>
    !query || s.title.toLowerCase().includes(query) || (s.description || '').toLowerCase().includes(query)
  ).slice(0, 3);

  const matchingLoans = LOAN_SCHEMES_DATA.filter(l =>
    !query || l.title.toLowerCase().includes(query) || (l.loanDetails || '').toLowerCase().includes(query)
  ).slice(0, 3);

  const totalResults = matchingSchemes.length + matchingDocs.length + matchingServices.length + matchingLoans.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#FAF9FD] border-2 border-[#E8E5F2] rounded-[32px] shadow-[0_20px_60px_rgba(23,32,51,0.2)] overflow-hidden text-[#172033]">
        
        {/* Search Input Box */}
        <div className="p-4 sm:p-6 border-b-2 border-[#E8E5F2] flex items-center gap-3.5 bg-white">
          <Search className="w-5 h-5 text-[#5B45C6] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="योजना, कागदपत्र, सेवा किंवा कर्ज शोधा... (उदा. लाडकी बहीण, पासपोर्ट, उत्पन्न)"
            className="flex-1 bg-transparent text-[#172033] placeholder-[#9CA3AF] text-sm sm:text-base outline-none font-semibold"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#172033] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 px-3 rounded-xl bg-[#FAF9FD] hover:bg-[#F2EFFD] text-[#4B5567] text-xs font-bold cursor-pointer border border-[#E8E5F2]"
          >
            ESC
          </button>
        </div>

        {/* Quick Categories Bar */}
        <div className="px-5 py-3 bg-[#FAF9FD] border-b border-[#E8E5F2] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#6B7280] text-xs font-bold">लोकप्रिय:</span>
          {['लाडकी बहीण', 'पासपोर्ट', 'उत्पन्न दाखला', 'मुद्रा कर्ज', '७/१२ उतारा', 'पीएम किसान'].map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSearchTerm(s)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-[#F2EFFD] border border-[#E8E5F2] hover:border-[#5B45C6] text-[#4B5567] hover:text-[#5B45C6] text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Schemes Section */}
          {matchingSchemes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-[#5B45C6] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#5B45C6]" />
                <span>सरकारी योजना ({matchingSchemes.length})</span>
              </div>
              <div className="space-y-2">
                {matchingSchemes.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectItem(s, 'scheme');
                      onClose();
                    }}
                    className="p-4 rounded-2xl bg-white border-2 border-[#E8E5F2] hover:border-[#5B45C6] hover:bg-[#F2EFFD] transition cursor-pointer flex items-center justify-between group shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#172033] group-hover:text-[#5B45C6] transition font-heading">
                          {s.title}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F2EFFD] text-[#5B45C6] font-bold border border-[#DCD8EC]">
                          {s.categoryLabel}
                        </span>
                      </div>
                      <p className="text-xs text-[#4B5567] line-clamp-1 mt-1 font-medium">
                        {s.shortDescription}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#5B45C6] transition shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Section */}
          {matchingDocs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-[#15966A] uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#15966A]" />
                <span>कागदपत्रे व दाखले ({matchingDocs.length})</span>
              </div>
              <div className="space-y-2">
                {matchingDocs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onSelectItem(d, 'document');
                      onClose();
                    }}
                    className="p-4 rounded-2xl bg-white border-2 border-[#E8E5F2] hover:border-[#15966A] hover:bg-[#F0FDF4] transition cursor-pointer flex items-center justify-between group shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#172033] group-hover:text-[#15966A] transition font-heading">
                          {d.title}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#15966A] font-bold border border-[#BBF7D0]">
                          {d.categoryLabel}
                        </span>
                      </div>
                      <p className="text-xs text-[#4B5567] line-clamp-1 mt-1 font-medium">
                        {d.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#15966A] transition shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Government Services */}
          {matchingServices.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-[#3157B7] uppercase tracking-wider">
                <Layers className="w-4 h-4 text-[#3157B7]" />
                <span>शासकीय सेवा ({matchingServices.length})</span>
              </div>
              <div className="space-y-2">
                {matchingServices.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => {
                      onSelectItem(srv, 'service');
                      onClose();
                    }}
                    className="p-4 rounded-2xl bg-white border-2 border-[#E8E5F2] hover:border-[#3157B7] hover:bg-[#EFF6FF] transition cursor-pointer flex items-center justify-between group shadow-xs"
                  >
                    <div>
                      <span className="text-sm font-bold text-[#172033] group-hover:text-[#3157B7] block transition font-heading">
                        {srv.title}
                      </span>
                      <p className="text-xs text-[#4B5567] line-clamp-1 mt-1 font-medium">
                        {srv.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#3157B7] transition shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loan Schemes */}
          {matchingLoans.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                <Landmark className="w-4 h-4 text-[#EA580C]" />
                <span>कर्ज योजना ({matchingLoans.length})</span>
              </div>
              <div className="space-y-2">
                {matchingLoans.map((loan) => (
                  <div
                    key={loan.id}
                    onClick={() => {
                      onSelectItem(loan, 'loan');
                      onClose();
                    }}
                    className="p-4 rounded-2xl bg-white border-2 border-[#E8E5F2] hover:border-[#EA580C] hover:bg-[#FFF7ED] transition cursor-pointer flex items-center justify-between group shadow-xs"
                  >
                    <div>
                      <span className="text-sm font-bold text-[#172033] group-hover:text-[#EA580C] block transition font-heading">
                        {loan.title}
                      </span>
                      <p className="text-xs text-[#4B5567] line-clamp-1 mt-1 font-medium">
                        {loan.loanDetails}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#EA580C] transition shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="text-center py-8 text-[#6B7280] text-sm font-medium">
              "{searchTerm}" साठी काहीही सापडले नाही. कृपया दुसरा शब्द वापरा.
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-white border-t-2 border-[#E8E5F2] text-center text-xs text-[#6B7280] font-medium">
          सर्व माहिती अधिकृत सरकारी नियमांवर आधारित व पडताळणी केलेली आहे
        </div>

      </div>
    </div>
  );
};

