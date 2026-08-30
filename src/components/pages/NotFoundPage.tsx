import React from 'react';
import { HelpCircle, Home, Search, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FFF0F5] text-[#C94A74] flex items-center justify-center mx-auto mb-6">
        <HelpCircle className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold text-[#5B4BB7] uppercase tracking-wider block mb-2">त्रुटी ४०४ (404 Error)</span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201A30] mb-3 font-serif">
        पृष्ठ सापडले नाही
      </h1>
      <p className="text-sm text-[#6E6A82] leading-relaxed mb-8">
        तुम्ही शोधत असलेले पृष्ठ किंवा योजना उपलब्ध नाही किंवा त्याचा पत्ता बदलला असावा. कृपया मुख्य पृष्ठावर जाऊन पुन्हा शोधा.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onGoHome}
          className="px-5 py-2.5 bg-[#5B4BB7] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#4D3EA0] transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>मुख्य पृष्ठावर जा</span>
        </button>
        <a
          href="/faq"
          className="px-5 py-2.5 bg-white border border-[#EDEBF0] text-[#201A30] text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#F7F5FF] transition-colors"
        >
          FAQ मदत पहा
        </a>
      </div>
    </div>
  );
};
