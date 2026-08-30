import React from 'react';
import { ShieldAlert, AlertTriangle, ExternalLink, Scale, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <nav className="flex items-center gap-2 text-xs text-[#6E6A82] mb-6 font-medium">
        <a href="/" className="hover:text-[#5B4BB7] transition-colors">होम</a>
        <span>/</span>
        <span className="text-[#201A30]">नागरिक अस्वीकरण (Disclaimer)</span>
      </nav>

      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF6ED] text-[#D97706] text-xs font-semibold rounded-full mb-4">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>कायदेशीर व नागरिक अस्वीकरण</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201A30] tracking-tight mb-4 font-serif">
          अस्वीकरण (Disclaimer)
        </h1>
        <p className="text-sm sm:text-base text-[#6E6A82] leading-relaxed">
          ‘{SITE_CONFIG.name}’ ({SITE_CONFIG.domain}) हे एक स्वतंत्र, खाजगी नागरिक शैक्षणिक व माहिती मार्गदर्शन माध्यम आहे. हे व्यासपीठ वापरण्यापूर्वी कृपया खालील कायदेशीर बाबी काळजीपूर्वक समजून घ्या.
        </p>
      </div>

      <div className="space-y-6 text-[#201A30]">
        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-[#78350F]">
            <AlertTriangle className="w-5 h-5 text-[#D97706]" />
            १. शासकीय संलग्नतेचा स्पष्ट अभाव (Non-Government Entity)
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            {SITE_CONFIG.officialDisclaimerFull}
          </p>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-[#201A30]">
            <Scale className="w-5 h-5 text-[#5B4BB7]" />
            २. माहितीचा हेतू व अचूकता (Informational Purpose Only)
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed mb-3">
            या संकेतस्थळावर प्रकाशित करण्यात आलेली सर्व माहिती (उदा. योजनांची पात्रता, कागदपत्रांची यादी, अर्ज पद्धती, अधिकृत नियमावली) ही केवळ सामान्य माहिती आणि जनजागृतीच्या उद्देशाने उपलब्ध करण्यात आलेली आहे.
          </p>
          <p className="text-sm text-[#464255] leading-relaxed">
            शासकीय नियमांमध्ये, शासन निर्णयांमध्ये (GR) किंवा धोरणांमध्ये वेळोवेळी होणाऱ्या बदलांमुळे येथील माहितीमध्ये बदल असू शकतो. म्हणून, कोणताही अंतिम अर्ज करण्यापूर्वी किंवा कागदपत्रे सादर करण्यापूर्वी संबंधित विभागाच्या अधिकृत सरकारी पोर्टलवर जाऊन माहितीची पुनर्पडताळणी करणे वापरकर्त्याचे कर्तव्य आहे.
          </p>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-[#201A30]">
            <ExternalLink className="w-5 h-5 text-[#367A59]" />
            ३. बाह्य सरकारी लिंक्स (External Official Links)
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            आमच्या संकेतस्थळावर भारत सरकार किंवा महाराष्ट्र शासनाच्या अधिकृत संकेतस्थळांच्या (.gov.in / .nic.in / .org.in) बाह्य लिंक्स देण्यात आलेल्या आहेत. या बाह्य संकेतस्थळांचे नियंत्रण आमच्याकडे नाही. तेथील सेवा, सर्व्हर डाऊनटाईम किंवा डेटा सुरक्षा धोरणांसाठी ‘{SITE_CONFIG.name}’ व्यासपीठ जबाबदार असणार नाही.
          </p>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-[#201A30]">
            <CheckCircle2 className="w-5 h-5 text-[#C94A74]" />
            ४. पूर्णपणे विनामूल्य नागरिक व्यासपीठ
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            ‘{SITE_CONFIG.name}’ हे व्यासपीठ नागरिकांसाठी १००% मोफत व स्वतंत्र आहे. आम्ही कोणतेही सरकारी फॉर्म भरून देणारे एजंट अथवा मध्यस्थ नाही. जर कोणी ‘{SITE_CONFIG.name}’ च्या नावाने पैसे मागत असेल तर अशा व्यक्तींना पैसे देऊ नयेत.
          </p>
        </section>
      </div>
    </div>
  );
};
