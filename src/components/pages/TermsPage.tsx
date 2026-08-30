import React from 'react';
import { FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';

export const TermsPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <nav className="flex items-center gap-2 text-xs text-[#6E6A82] mb-6 font-medium">
        <a href="/" className="hover:text-[#5B4BB7] transition-colors">होम</a>
        <span>/</span>
        <span className="text-[#201A30]">नियम व अटी (Terms of Use)</span>
      </nav>

      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEEAFE] text-[#5B4BB7] text-xs font-semibold rounded-full mb-4">
          <FileText className="w-3.5 h-3.5" />
          <span>वापर नियम व अटी</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201A30] tracking-tight mb-4 font-serif">
          नियम व अटी (Terms & Conditions)
        </h1>
        <p className="text-sm sm:text-base text-[#6E6A82] leading-relaxed">
          {SITE_CONFIG.name} व्यासपीठाचा वापर करून आपण खालील नियम व अटींना मान्यता देत आहात.
        </p>
      </div>

      <div className="space-y-6 text-[#201A30]">
        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3">१. माहितीचा योग्य व कायदेशीर वापर</h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            या व्यासपीठावरील माहिती केवळ शैक्षणिक, वैयक्तिक माहिती आणि नागरिक जनजागृतीसाठी आहे. या माहितीचा गैरवापर करणे किंवा कोणत्याही नागरिकांची दिशाभूल करण्यासाठी वापर करण्यास सक्त मनाई आहे.
          </p>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3">२. बौद्धिक संपदा व मजकूर हक्क</h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            ‘{SITE_CONFIG.name}’ व्यासपीठावरील मूळ मराठी मांडणी, मार्गदर्शक मजकूर, आणि डिझाइन ही बौद्धिक संपदा आहे. व्यावसायिक उद्देशाने संपूर्ण वेबसाइटचा डेटा कॉपी करून अनधिकृतपणे वापरण्यास बंदी आहे. वैयक्तिक किंवा सामाजिक मदतीसाठी WhatsApp किंवा सोशल मीडियावर शेअर करण्यास पूर्ण मुभा आहे.
          </p>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3">३. शासकीय निर्णयांची अंतिम वैधता</h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            महाराष्ट्र शासन किंवा भारत सरकारचे मूळ राजपत्रे (GR), नियमावली आणि अधिकृत संकेतस्थळांवरील माहिती हीच कायदेशीरदृष्ट्या अंतिम मानली जाईल.
          </p>
        </section>
      </div>
    </div>
  );
};
