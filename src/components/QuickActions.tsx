import React from 'react';
import { 
  Sprout, 
  GraduationCap, 
  HeartHandshake, 
  HeartPulse, 
  Users2, 
  ArrowUpRight
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface QuickActionsProps {
  onSelectCategory: (categoryId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectCategory }) => {
  const { images } = useAdminAuth();

  // Find optional category custom images from admin slots
  const farmerCustomImg = images?.find(img => img.id === 'img-cat-farmer')?.url;
  const studentCustomImg = images?.find(img => img.id === 'img-cat-student')?.url;
  const womenCustomImg = images?.find(img => img.id === 'img-cat-women')?.url;
  const seniorCustomImg = images?.find(img => img.id === 'img-cat-senior')?.url;

  // Exact 5 core categories with specific hex codes & soft backgrounds
  const categories = [
    {
      id: 'agriculture',
      label: 'शेतकरी',
      englishLabel: 'Farmers',
      icon: Sprout,
      customImg: farmerCustomImg,
      cardBg: 'bg-[#EAF7EF]',
      cardBorder: 'border-[#BBF7D0]',
      hoverBorder: 'hover:border-[#16834B]',
      iconBg: 'bg-white',
      iconColor: 'text-[#16834B]',
      titleColor: 'text-[#12643A]',
      glowColor: 'hover:shadow-[0_16px_36px_rgba(22,131,75,0.16)]',
      badgeText: 'कृषी व सिंचन योजना',
      accentColor: 'text-[#16834B]'
    },
    {
      id: 'education',
      label: 'शिक्षण',
      englishLabel: 'Education',
      icon: GraduationCap,
      customImg: studentCustomImg,
      cardBg: 'bg-[#EEF1FF]',
      cardBorder: 'border-[#C7D2FE]',
      hoverBorder: 'hover:border-[#4056B5]',
      iconBg: 'bg-white',
      iconColor: 'text-[#4056B5]',
      titleColor: 'text-[#30428D]',
      glowColor: 'hover:shadow-[0_16px_36px_rgba(64,86,181,0.16)]',
      badgeText: 'शिष्यवृत्ती व करिअर',
      accentColor: 'text-[#4056B5]'
    },
    {
      id: 'women',
      label: 'महिला',
      englishLabel: 'Women',
      icon: HeartHandshake,
      customImg: womenCustomImg,
      cardBg: 'bg-[#FFF0F5]',
      cardBorder: 'border-[#FECDD3]',
      hoverBorder: 'hover:border-[#C23B68]',
      iconBg: 'bg-white',
      iconColor: 'text-[#C23B68]',
      titleColor: 'text-[#962B4E]',
      glowColor: 'hover:shadow-[0_16px_36px_rgba(194,59,104,0.16)]',
      badgeText: 'सक्षमीकरण व आर्थिक मदत',
      accentColor: 'text-[#C23B68]'
    },
    {
      id: 'health',
      label: 'आरोग्य',
      englishLabel: 'Health',
      icon: HeartPulse,
      customImg: null,
      cardBg: 'bg-[#EAF8F6]',
      cardBorder: 'border-[#99F6E4]',
      hoverBorder: 'hover:border-[#148A83]',
      iconBg: 'bg-white',
      iconColor: 'text-[#148A83]',
      titleColor: 'text-[#106B65]',
      glowColor: 'hover:shadow-[0_16px_36px_rgba(20,138,131,0.16)]',
      badgeText: 'उपचार व आरोग्य विमा',
      accentColor: 'text-[#148A83]'
    },
    {
      id: 'senior',
      label: 'ज्येष्ठ नागरिक',
      englishLabel: 'Senior Citizens',
      icon: Users2,
      customImg: seniorCustomImg,
      cardBg: 'bg-[#FFF5E5]',
      cardBorder: 'border-[#FED7AA]',
      hoverBorder: 'hover:border-[#C47A16]',
      iconBg: 'bg-white',
      iconColor: 'text-[#C47A16]',
      titleColor: 'text-[#955B0D]',
      glowColor: 'hover:shadow-[0_16px_36px_rgba(196,122,22,0.16)]',
      badgeText: 'पेन्शन व सामाजिक सुरक्षा',
      accentColor: 'text-[#C47A16]'
    }
  ];

  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* 5 Distinctly Colored Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group text-center p-5 sm:p-6 rounded-2xl sm:rounded-3xl ${cat.cardBg} border-2 ${cat.cardBorder} ${cat.hoverBorder} transition-all duration-300 shadow-sm ${cat.glowColor} hover:-translate-y-1.5 cursor-pointer flex flex-col items-center justify-between min-h-[175px] sm:min-h-[200px] select-none`}
            >
              {/* Category Icon / Custom Image in Matching Theme */}
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${cat.iconBg} border border-black/5 flex items-center justify-center ${cat.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-xs mb-3 overflow-hidden`}>
                {cat.customImg ? (
                  <img
                    src={cat.customImg}
                    alt={cat.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                )}
              </div>

              {/* Labels (20-24px bold Marathi title, 13-15px subtitle) */}
              <div className="w-full space-y-1.5">
                <h3 className={`text-xl sm:text-[22px] font-extrabold ${cat.titleColor} leading-tight font-heading`}>
                  {cat.label}
                </h3>
                <p className={`text-xs sm:text-[14px] font-bold ${cat.accentColor}`}>
                  {cat.badgeText}
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className={`mt-2 ${cat.accentColor} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all`}>
                <ArrowUpRight className="w-4 h-4 opacity-80 group-hover:opacity-100 stroke-[2.5]" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};


