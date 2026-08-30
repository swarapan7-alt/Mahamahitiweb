import React from 'react';
import { 
  Home, 
  FileSearch, 
  Files, 
  FileCheck2, 
  MessageSquareText
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAI: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAI
}) => {
  const items = [
    { id: 'home', label: 'मुख्यपृष्ठ', icon: Home },
    { id: 'schemes', label: 'योजना', icon: FileSearch },
    { id: 'documents', label: 'कागदपत्रे', icon: Files },
    { id: 'checklist', label: 'चेकलिस्ट', icon: FileCheck2 },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9FD]/95 backdrop-blur-md border-t-2 border-[#E8E5F2] px-3 py-2 text-[#4B5567] shadow-[0_-4px_25px_rgba(23,32,51,0.08)] flex items-center justify-around">
      {items.map((it) => {
        const Icon = it.icon;
        const isActive = activeTab === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setActiveTab(it.id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition cursor-pointer ${
              isActive 
                ? 'text-[#5B45C6] font-bold scale-105' 
                : 'text-[#4B5567] hover:text-[#172033]'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-xs font-semibold tracking-tight">{it.label}</span>
          </button>
        );
      })}

      {/* Floating AI Button in mobile nav */}
      <button
        onClick={onOpenAI}
        className="flex flex-col items-center gap-0.5 py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-[#5B45C6] to-[#3157B7] hover:opacity-95 text-white font-bold transition shadow-xs cursor-pointer"
      >
        <MessageSquareText className="w-4 h-4 text-white" />
        <span className="text-[11px] font-bold">AI सहाय्यक</span>
      </button>
    </div>
  );
};

