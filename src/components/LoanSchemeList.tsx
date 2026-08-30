import React, { useState } from 'react';
import { 
  Landmark, 
  IndianRupee, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  AlertCircle
} from 'lucide-react';
import { LOAN_SCHEMES_DATA } from '../data/mockData';
import { LoanScheme } from '../types';

interface LoanSchemeListProps {
  onOpenDetails: (loan: LoanScheme) => void;
  searchFilter?: string;
}

export const LoanSchemeList: React.FC<LoanSchemeListProps> = ({ onOpenDetails, searchFilter = '' }) => {
  const [localSearch, setLocalSearch] = useState<string>(searchFilter);

  const filteredLoans = LOAN_SCHEMES_DATA.filter((loan) => {
    const q = (localSearch || '').toLowerCase().trim();
    if (!q) return true;
    return (
      loan.title.toLowerCase().includes(q) ||
      loan.loanDetails.toLowerCase().includes(q) ||
      loan.forWhom.toLowerCase().includes(q) ||
      loan.categoryLabel.toLowerCase().includes(q)
    );
  });

  return (
    <section id="loans-section" className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] text-[#EA580C] text-xs sm:text-sm font-bold border border-[#FED7AA] mb-2.5 shadow-xs">
            <Landmark className="w-4 h-4 text-[#EA580C]" />
            <span>शासकीय कर्ज व अनुदान योजना</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight font-heading">
            सरकारी कर्ज योजना व <span className="text-[#EA580C]">व्याज परतावा</span>
          </h2>
          <p className="text-sm sm:text-base text-[#4B5567] mt-1.5 max-w-2xl font-medium leading-relaxed">
            नवउद्योजक, शेतकरी, महिला व छोट्या व्यावसायिकांसाठी शासकीय व्याज अनुदान व विनातारण कर्ज योजना.
          </p>
        </div>

        {/* Local Search Input */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="कर्ज योजना शोधा (उदा. मुद्रा, अण्णासाहेब)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border-2 border-[#E8E5F2] text-sm text-[#172033] placeholder-[#9CA3AF] focus:border-[#EA580C] outline-none transition shadow-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* Disclaimers Bar */}
      <div className="bg-[#FFF7ED] rounded-2xl sm:rounded-3xl p-5 border-2 border-[#FED7AA] mb-8 flex items-start gap-4 text-xs sm:text-sm text-[#4B5567] shadow-xs">
        <AlertCircle className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-[#172033] block mb-0.5 text-sm sm:text-base font-heading">पारदर्शक अधिकृत माहिती:</strong>
          <span className="font-medium leading-relaxed">
            सरकारी कर्ज योजनांचे अंतिम वितरण हे संबंधित अधिकृत राष्ट्रीयकृत किंवा जिल्हा बँकांच्या नियमांनुसार व कागदपत्र पडताळणीनुसार होते. कोणत्याही अनधिकृत एजंट किंवा मध्यस्थाला पैसे देऊ नका.
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoans.map((loan) => (
          <div
            key={loan.id}
            className="bg-[#FAF9FD] rounded-3xl border-2 border-[#E8E5F2] hover:border-[#EA580C]/60 shadow-[0_8px_30px_rgba(234,88,12,0.04)] hover:shadow-[0_16px_36px_rgba(234,88,12,0.1)] transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]">
                  {loan.categoryLabel}
                </span>
                <span className="text-xs text-[#15966A] flex items-center gap-1 font-bold bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#15966A]" />
                  सत्यापित योजना
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-[#172033] mb-2 group-hover:text-[#EA580C] transition-colors leading-snug font-heading">
                {loan.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#4B5567] mb-4 line-clamp-2 leading-relaxed font-medium">
                {loan.loanDetails}
              </p>

              {/* Amount Badge */}
              <div className="bg-white p-4 rounded-2xl border-2 border-[#E8E5F2] mb-3.5 text-xs sm:text-sm space-y-1.5 shadow-xs">
                <div className="text-[#172033] font-bold flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-[#EA580C]" />
                  <span>कर्ज मर्यादा: <span className="text-[#EA580C] font-extrabold">{loan.maxAmount}</span></span>
                </div>
                <div className="text-[#4B5567] text-xs font-medium">
                  <strong className="text-[#172033]">व्याज / अनुदान:</strong> {loan.subsidyOrInterest}
                </div>
              </div>

              {/* For whom */}
              <div className="text-xs text-[#4B5567] mb-5 bg-white p-3.5 rounded-2xl border border-[#E8E5F2] font-medium">
                <strong className="text-[#172033] block mb-0.5 text-xs font-bold">पात्र लाभार्थी:</strong>
                <span className="line-clamp-2">{loan.forWhom}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E5F2] flex items-center justify-between gap-2 mt-2">
              <button
                onClick={() => onOpenDetails(loan)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#5B45C6] to-[#3157B7] hover:from-[#4530A8] hover:to-[#244391] text-white font-bold text-xs sm:text-sm transition text-center cursor-pointer shadow-xs hover:shadow-md flex items-center justify-center gap-2 hover:scale-102"
              >
                <span>पात्रता व सविस्तर माहिती</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

