import React from 'react';
import { Lock, EyeOff, ShieldCheck, Database, HardDrive } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <nav className="flex items-center gap-2 text-xs text-[#6E6A82] mb-6 font-medium">
        <a href="/" className="hover:text-[#5B4BB7] transition-colors">होम</a>
        <span>/</span>
        <span className="text-[#201A30]">गोपनीयता धोरण (Privacy Policy)</span>
      </nav>

      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F8F4] text-[#367A59] text-xs font-semibold rounded-full mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>डेटा संरक्षण व गोपनीयता</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201A30] tracking-tight mb-4 font-serif">
          गोपनीयता धोरण (Privacy Policy)
        </h1>
        <p className="text-sm sm:text-base text-[#6E6A82] leading-relaxed">
          {SITE_CONFIG.name} आपल्या गोपनीयतेचा पूर्ण आदर करते. हे व्यासपीठ वापरताना नागरिकांचा कोणताही संवेदनशील डेटा गोळा केला जात नाही.
        </p>
      </div>

      <div className="space-y-6 text-[#201A30]">
        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-[#5B4BB7]" />
            १. आम्ही कोणती वैयक्तिक माहिती गोळा करत नाही?
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed mb-3">
            आमच्या व्यासपीठावर वापरकर्त्याला कोणतेही अनिवार्य अकाऊंट उघडावे लागत नाही. आम्ही खालीलपैकी कोणतीही वैयक्तिक माहिती गोळा किंवा साठवून ठेवत नाही:
          </p>
          <ul className="list-disc list-inside text-sm text-[#464255] space-y-1.5 ml-2">
            <li>आधार कार्ड क्रमांक किंवा बायोमेट्रिक माहिती.</li>
            <li>बँक खाते क्रमांक, यूपीआय पिन किंवा ओटीपी (OTP).</li>
            <li>पासवर्ड किंवा आर्थिक गोपनीय माहिती.</li>
          </ul>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#367A59]" />
            २. स्थानिक डेटा साठवण (Local Storage Usage)
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            तुम्ही जतन केलेल्या योजना (Favorites/Bookmarks) किंवा अलीकडे पाहिलेल्या योजना (Recently Viewed Items) यांसारखी सोय केवळ तुमच्या स्वतःच्या संगणक किंवा मोबाईल ब्राउझरच्या लोकल स्टोरेजमध्ये (LocalStorage) साठवली जाते. हा डेटा आमच्या कोणत्याही बाह्य सर्व्हरवर पाठवला जात नाही.
          </p>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#C94A74]" />
            ३. कुकीज व विश्लेषण (Cookies & Analytics)
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            वेबसाइटचा वेग, तांत्रिक कार्यक्षमता आणि वापरकर्त्याचा अनुभव सुधारण्यासाठी आम्ही सामान्य निनावी (Anonymous) ट्रॅफिक विश्लेषण वापरू शकतो, ज्यामध्ये कोणत्याही व्यक्तीची वैयक्तिक ओळख साठवली जात नाही.
          </p>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#D97706]" />
            ४. तृतीय-पक्ष जाहिरात धोरण (Google AdSense)
          </h2>
          <p className="text-sm text-[#464255] leading-relaxed">
            भविष्यात हे व्यासपीठ मोफत चालवण्यासाठी Google AdSense द्वारे जाहिराती दाखवल्या जाऊ शकतात. Google कुकीजचा वापर करून वापरकर्त्यांच्या आवडीनुसार गैर-वैयक्तिक जाहिराती दाखवू शकते. वापरकर्ते हवे असल्यास Google Ad Settings मधून वैयक्तिकृत जाहिराती बंद करू शकतात.
          </p>
        </section>
      </div>
    </div>
  );
};
