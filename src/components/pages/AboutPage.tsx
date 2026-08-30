import React from 'react';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';
import { MahaMahitiLogo } from '../MahaMahitiLogo';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#6E6A82] mb-6 font-medium">
        <a href="/" className="hover:text-[#5B4BB7] transition-colors">होम</a>
        <span>/</span>
        <span className="text-[#201A30]">आमच्याबद्दल</span>
      </nav>

      {/* Hero Header with Master Logo */}
      <div className="bg-gradient-to-br from-[#F7F5FF] via-white to-[#F0F8F4] border border-[#EDEBF0] rounded-2xl p-6 sm:p-10 mb-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <MahaMahitiLogo size="xl" className="shrink-0" />
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEEAFE] text-[#5B4BB7] text-xs font-semibold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>स्वतंत्र नागरिक माहिती व्यासपीठ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201A30] tracking-tight mb-2 font-serif">
            {SITE_CONFIG.name} बद्दल
          </h1>
          <p className="text-sm sm:text-base text-[#6E6A82] leading-relaxed">
            {SITE_CONFIG.subtitle} – सर्वसामान्य नागरिकांना सरकारी योजना, आवश्यक कागदपत्रे, दाखले, शासकीय सेवा आणि कर्ज योजनांची अचूक माहिती सोप्या मराठी भाषेत समजावून सांगणारे स्वतंत्र माध्यम.
          </p>
        </div>
      </div>

      {/* Non-Gov Statement */}
      <div className="bg-[#FFF6ED] border border-[#FDE68A] rounded-xl p-5 mb-8 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-[#D97706] shrink-0 mt-0.5" />
        <div className="text-sm text-[#78350F] leading-relaxed">
          <strong className="font-bold block text-base mb-1">महत्त्वाची अधिकृत नोंद:</strong>
          {SITE_CONFIG.officialDisclaimerFull}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 text-[#201A30]">
        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#EEEAFE] text-[#5B4BB7] flex items-center justify-center text-sm font-bold">१</span>
            हे व्यासपीठ का सुरू केले?
          </h2>
          <p className="text-sm sm:text-base text-[#464255] leading-relaxed mb-4">
            केंद्र शासन आणि महाराष्ट्र शासनामार्फत शेतकरी, महिला, विद्यार्थी, कामगार, ज्येष्ठ नागरिक आणि नवउद्योजकांसाठी शेकडो कल्याणकारी योजना राबवल्या जातात. परंतु, अनेकदा माहितीचा अभाव आणि कागदपत्रांची स्पष्टता नसल्यामुळे ग्रामीण व सामान्य नागरिक या लाभांपासून वंचित राहतात.
          </p>
          <p className="text-sm sm:text-base text-[#464255] leading-relaxed">
            <strong>‘{SITE_CONFIG.name}’</strong> ({SITE_CONFIG.domain}) चा मुख्य उद्देश हाच आहे की कोणतीही क्लिष्ट सरकारी भाषा न वापरता, प्रत्येक नागरिकाला त्याच्या हक्काची योजना, लागणारी कागदपत्रे आणि आवश्यक मार्गदर्शनाची माहिती अत्यंत सोप्या व वाचनीय मराठीत उपलब्ध करून देणे.
          </p>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#F0F8F4] text-[#367A59] flex items-center justify-center text-sm font-bold">२</span>
            येथे तुम्हाला काय माहिती मिळते?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl">
              <h3 className="font-bold text-sm sm:text-base text-[#201A30] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4F9D76]" /> सरकारी योजना (Schemes)
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6A82]">
                लाडकी बहीण, नमो शेतकरी, महाडीबीटी शिष्यवृत्ती, घरकुल व मोफत आरोग्य योजनांची सविस्तर माहिती.
              </p>
            </div>
            <div className="p-4 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl">
              <h3 className="font-bold text-sm sm:text-base text-[#201A30] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4F9D76]" /> कागदपत्रे व दाखले (Documents)
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6A82]">
                आधार, पॅन, पासपोर्ट, उत्पन्न, जात व अधिवास दाखल्यांसाठी लागणारी कागदपत्रे व मार्गदर्शक माहिती.
              </p>
            </div>
            <div className="p-4 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl">
              <h3 className="font-bold text-sm sm:text-base text-[#201A30] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4F9D76]" /> शासकीय सेवा (Services)
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6A82]">
                आपले सरकार, महाभूलेख ७/१२, सारथी सेवा, डिजिलॉकर व ईपीएफओ सेवांची माहिती.
              </p>
            </div>
            <div className="p-4 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl">
              <h3 className="font-bold text-sm sm:text-base text-[#201A30] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4F9D76]" /> सरकारी कर्ज योजना (Loan Schemes)
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6A82]">
                मुद्रा कर्ज, अण्णासाहेब पाटील व्याज परतावा, पीएमईजीपी, पीएम स्वनिधी व बचत गट कर्ज माहिती.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#FFF0F5] text-[#C94A74] flex items-center justify-center text-sm font-bold">३</span>
            माहितीची पडताळणी व पारदर्शकता
          </h2>
          <p className="text-sm sm:text-base text-[#464255] leading-relaxed mb-4">
            आम्ही कोणत्याही सरकारी दाव्यांची किंवा रकमेची काल्पनिक माहिती देत नाही. प्रत्येक माहिती अधिकृत शासकीय राजपत्रे (GR), मंत्रालयीन पोर्टल आणि शासन निर्णयांच्या (GR) आधारे तपासली जाते.
          </p>
        </section>
      </div>
    </div>
  );
};
