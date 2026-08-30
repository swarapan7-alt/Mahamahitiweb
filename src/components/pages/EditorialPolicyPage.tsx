import React from 'react';
import { BookOpen, CheckCircle2, RefreshCw, Award, SearchCheck } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';

export const EditorialPolicyPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <nav className="flex items-center gap-2 text-xs text-[#6E6A82] mb-6 font-medium">
        <a href="/" className="hover:text-[#5B4BB7] transition-colors">होम</a>
        <span>/</span>
        <span className="text-[#201A30]">संपादकीय धोरण (Editorial Policy)</span>
      </nav>

      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F8F4] text-[#367A59] text-xs font-semibold rounded-full mb-4">
          <Award className="w-3.5 h-3.5" />
          <span>संपादकीय तत्त्वे व मानक</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201A30] tracking-tight mb-4 font-serif">
          संपादकीय धोरण (Editorial Policy)
        </h1>
        <p className="text-sm sm:text-base text-[#6E6A82] leading-relaxed">
          {SITE_CONFIG.name} व्यासपीठावर प्रकाशित होणारा प्रत्येक शब्द, पात्रता निकष आणि प्रक्रिया नागरिकांना अचूक व गैरसमजमुक्त माहिती देण्याच्या हेतूने तयार केला जातो.
        </p>
      </div>

      <div className="space-y-6 text-[#201A30]">
        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#367A59]" />
            १. अचूकतेचे निकष (Fact-Checking Standard)
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            आम्ही सोशल मीडियावरील अफवा, दिशाभूल करणाऱ्या बातम्या किंवा अपुऱ्या माहितीच्या आधारे कोणताही लेख प्रकाशित करत नाही. प्रत्येक योजनेचा शासन निर्णय (GR), संबंधित मंत्रालयाचे अधिकृत संकेतस्थळ आणि हेल्पलाइन क्रमांकाची पडताळणी केल्यावरच माहिती समाविष्ट केली जाते.
          </p>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
            <SearchCheck className="w-5 h-5 text-[#5B4BB7]" />
            २. सोपी व प्रामाणिक मराठी भाषा
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            शासकीय भाषेतील कठीण शब्द न वापरता ग्रामीण व सर्वसामान्य नागरिकाला सहज समजेल अशा शुद्ध, सन्मानजनक आणि सुस्पष्ट मराठी भाषेत माहिती मांडणे हे आमचे प्रथम कर्तव्य आहे.
          </p>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#C94A74]" />
            ३. माहितीचे अद्ययावतीकरण व दुरुस्ती प्रक्रिया
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            शासकीय नियमात बदल झाल्यास किंवा नागरिकांकडून दुरुस्तीची सूचना प्राप्त झाल्यास आमचे पथक २४ ते ४८ तासांच्या आत अधिकृत स्रोताशी ताडून पाहून माहिती अद्ययावत (Update) करते.
          </p>
        </section>
      </div>
    </div>
  );
};
