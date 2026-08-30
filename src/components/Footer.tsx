import React from 'react';
import { 
  ShieldCheck, 
  Share2
} from 'lucide-react';
import { MahaMahitiLogo } from './MahaMahitiLogo';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenWhatsApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenWhatsApp }) => {
  return (
    <footer className="bg-[#EEF0FF] text-[#4B5567] pt-14 pb-28 sm:pb-14 border-t border-[#DCD8EC] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Independence & Trust Disclaimer Box */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border-2 border-[#DCD8EC] mb-12 shadow-[0_4px_20px_rgba(91,69,198,0.04)]">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2EFFD] text-[#5B45C6] flex items-center justify-center shrink-0 border border-[#DCD8EC] shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-[#172033] font-bold text-base sm:text-lg tracking-tight font-heading">
                  महत्त्वाची वैधानिक सूचना (Non-Government Independence Notice)
                </h4>
                <span className="text-xs px-3 py-0.5 rounded-full bg-[#F2EFFD] text-[#5B45C6] font-bold border border-[#DCD8EC]">
                  स्वतंत्र नागरिक व्यासपीठ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#4B5567] leading-relaxed font-medium">
                <strong className="text-[#172033] font-bold">MahaMahiti.com</strong> ही एक स्वतंत्र नागरिक माहिती तंत्रज्ञान वेबसाइट आहे. आम्ही कोणत्याही शासकीय कार्यालयाचे, मंत्रालयाचे अथवा एजंटचे प्रतिनिधित्व करत नाही. येथे उपलब्ध माहिती नागरिकांच्या सुलभ संदर्भासाठी अधिकृत शासन निर्णय (GR) व अधिकृत पोर्टलवरून संकलित केलेली आहे.
              </p>
              <div className="text-xs text-[#6B7280] pt-1">
                कोणत्याही अंतिम अर्जासाठी व नियमांच्या पुनर्पडताळणीसाठी संबंधित शासकीय पोर्टलचा वापर करावा.
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Column Sitemap */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12 text-xs sm:text-sm">
          
          {/* Brand Column (Spans 2 cols on lg) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {/* Meaningful 3D Master Emblem Logo */}
              <MahaMahitiLogo size="md" />
              <div className="flex flex-col justify-center">
                <div className="flex items-center">
                  <span className="text-xl font-extrabold tracking-tight font-sans leading-none">
                    <span className="text-[#0F172A]">Maha</span>
                    <span className="text-[#EA580C]">Mahiti</span>
                    <span className="text-[#0F172A]">.com</span>
                  </span>
                </div>
                <div className="w-full flex items-center justify-center mt-1">
                  <span className="text-[11px] font-extrabold text-[#000000] tracking-wider leading-tight text-center block w-full font-['Rozha_One',_'Yatra_One',_'Noto_Serif_Devanagari',_'Tiro_Devanagari_Marathi',_'Mukta',_serif]">
                    सर्व नागरिकांच्या माहितीसाठी
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5567] leading-relaxed max-w-sm font-medium">
              सरकारी योजना, आवश्यक कागदपत्रे आणि डिजिटल शासकीय सेवांची माहिती सोप्या भाषेत प्रत्येक नागरिकापर्यंत पोहोचवणारे आधुनिक व्यासपीठ.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp वर शेअर करा</span>
              </button>
            </div>
          </div>

          {/* Col 2: योजना */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#172033] text-sm sm:text-base font-heading">
              योजना
            </h4>
            <ul className="space-y-2 text-[#4B5567] font-medium">
              <li>
                <button onClick={() => onNavigate('schemes')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  लाडकी बहीण योजना
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('schemes')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  नमो शेतकरी योजना
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('schemes')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  पीक विमा योजना
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('schemes')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  आयुष्मान भारत
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: कागदपत्रे */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#172033] text-sm sm:text-base font-heading">
              कागदपत्रे
            </h4>
            <ul className="space-y-2 text-[#4B5567] font-medium">
              <li>
                <button onClick={() => onNavigate('documents')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  उत्पन्न प्रमाणपत्र
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('documents')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  जात प्रमाणपत्र
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('documents')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  अधिवास दाखला
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('documents')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  आधार व पॅन कार्ड
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: शासकीय सेवा */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#172033] text-sm sm:text-base font-heading">
              शासकीय सेवा
            </h4>
            <ul className="space-y-2 text-[#4B5567] font-medium">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  आपले सरकार पोर्टल
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  महाभूलेख (७/१२ उतारा)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  महाडीबीटी पोर्टल
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  डिजी लॉकर
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: धोरणे व माहिती */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#172033] text-sm sm:text-base font-heading">
              माहिती व नियम
            </h4>
            <ul className="space-y-2 text-[#4B5567] font-medium">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  आमच्याबद्दल (About)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('disclaimer')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  अस्वीकरण (Disclaimer)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  गोपनीयता धोरण (Privacy)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  नियम व अटी (Terms)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sources')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  माहिती स्रोत (Sources)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('editorial')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  संपादकीय धोरण (Editorial)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#5B45C6] transition text-left cursor-pointer">
                  संपर्क (Contact)
                </button>
              </li>
              <li className="pt-2 border-t border-[#DCD8EC]">
                <button onClick={() => onNavigate('admin')} className="text-[#5B45C6] hover:underline transition text-left cursor-pointer font-bold flex items-center gap-1">
                  <span>प्रशासकीय लॉगिन (Admin)</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Verification Line */}
        <div className="pt-6 border-t border-[#DCD8EC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[#6B7280] font-medium">
          <div>
            © २०२६ <strong>MahaMahiti.com</strong>. सर्व हक्क राखीव.
          </div>
          <div className="flex items-center gap-4 text-[#5B45C6] font-semibold">
            <span>महाराष्ट्रातील नागरिकांसाठी सोप्या भाषेत माहिती</span>
            <button 
              onClick={() => onNavigate('admin')}
              className="text-[#6B7280] hover:text-[#5B45C6] transition text-xs underline underline-offset-2 cursor-pointer font-semibold"
            >
              प्रशासकीय कक्ष
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
