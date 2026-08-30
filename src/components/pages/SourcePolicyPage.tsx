import React from 'react';
import { ShieldCheck, ExternalLink, Globe, FileCheck, Layers } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';

export const SourcePolicyPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <nav className="flex items-center gap-2 text-xs text-[#6E6A82] mb-6 font-medium">
        <a href="/" className="hover:text-[#5B4BB7] transition-colors">होम</a>
        <span>/</span>
        <span className="text-[#201A30]">माहिती स्रोत व पडताळणी धोरण</span>
      </nav>

      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F5FF] text-[#5B4BB7] text-xs font-semibold rounded-full mb-4">
          <Globe className="w-3.5 h-3.5" />
          <span>अधिकृत सरकारी स्रोत मार्गदर्शक</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201A30] tracking-tight mb-4 font-serif">
          माहिती स्रोत व पडताळणी धोरण
        </h1>
        <p className="text-sm sm:text-base text-[#6E6A82] leading-relaxed">
          {SITE_CONFIG.name} व्यासपीठावरील प्रत्येक माहिती केवळ मान्यताप्राप्त अधिकृत शासकीय स्रोतांवरूनच संकलित केली जाते.
        </p>
      </div>

      <div className="space-y-6 text-[#201A30]">
        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#367A59]" />
            १. प्राथमिक अधिकृत स्रोत (Primary Government Sources)
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed mb-4">
            माहिती संकलनासाठी केवळ खालील डोमेन आणि स्रोतांचा वापर केला जातो:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl text-xs font-medium text-[#201A30]">
              🏛️ <strong>maharashtra.gov.in</strong> – महाराष्ट्र शासन अधिकृत राजपत्र व शासन निर्णय
            </div>
            <div className="p-3 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl text-xs font-medium text-[#201A30]">
              📜 <strong>aaplesarkar.mahaonline.gov.in</strong> – आपले सरकार महसूल व नागरिक सेवा
            </div>
            <div className="p-3 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl text-xs font-medium text-[#201A30]">
              🌾 <strong>krishi.maharashtra.gov.in</strong> – कृषी विभाग, महाराष्ट्र शासन
            </div>
            <div className="p-3 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl text-xs font-medium text-[#201A30]">
              🇮🇳 <strong>india.gov.in / mygov.in</strong> – भारत सरकार केंद्रीय योजना दालन
            </div>
            <div className="p-3 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl text-xs font-medium text-[#201A30]">
              🎓 <strong>mahadbt.maharashtra.gov.in</strong> – महाडीबीटी शिष्यवृत्ती व शेतकरी योजना
            </div>
            <div className="p-3 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl text-xs font-medium text-[#201A30]">
              💼 <strong>mudra.org.in / udyamimitra.in</strong> – केंद्रीय MSME व कर्ज पोर्टल
            </div>
          </div>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#5B4BB7]" />
            २. अनिवार्य अधिकृत लिंक बंधन
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            प्रत्येक योजना, कागदपत्र किंवा कर्ज माहिती कार्डवर संबंधित सरकारी पोर्टलचे नाव आणि त्याची थेट URL स्पष्टपणे नमूद करणे अनिवार्य आहे, जेणेकरून वाचकाला कोणतीही शंका न राहता थेट मूळ सरकारी संकेतस्थळावर जाऊन अर्ज करता येईल.
          </p>
        </section>
      </div>
    </div>
  );
};
