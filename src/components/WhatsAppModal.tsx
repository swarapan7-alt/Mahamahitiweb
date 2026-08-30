import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Check, 
  Copy,
  AlertCircle
} from 'lucide-react';
import { CHECKLIST_PRESETS } from '../data/mockData';
import { generateCleanShareText, copyTextToClipboard, openWhatsAppShare } from '../utils/shareUtils';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: any;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  initialItem
}) => {
  const [phone, setPhone] = useState('');
  const [selectedDocKey, setSelectedDocKey] = useState('ladki_bahin');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPreset = CHECKLIST_PRESETS[selectedDocKey] || CHECKLIST_PRESETS['ladki_bahin'];

  const buildMessage = (): string => {
    if (initialItem) {
      return generateCleanShareText(initialItem);
    }

    const lines: string[] = [];
    lines.push(`📋 *${currentPreset.name}*`);
    lines.push('');
    lines.push(`📁 *आवश्यक कागदपत्रे / माहिती सूची:*`);
    currentPreset.items.forEach((item) => {
      lines.push(`• ${item}`);
    });
    lines.push('');
    lines.push(`━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`ℹ️ *नागरिक मार्गदर्शन:*`);
    lines.push(`या योजनेची पूर्ण व अद्ययावत माहिती, पात्रता व आवश्यक मार्गदर्शनासाठी आपल्या जवळच्या CSC सेंटर किंवा ई-सेवा केंद्राला भेट द्या.`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`(माहिती स्रोत: MahaMahiti.com)`);

    return lines.join('\n');
  };

  const handleSend = () => {
    const rawMsg = buildMessage();
    openWhatsAppShare(rawMsg, phone);
    onClose();
  };

  const handleCopy = async () => {
    const rawMsg = buildMessage();
    const success = await copyTextToClipboard(rawMsg);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF9FD] border-2 border-[#E8E5F2] rounded-3xl sm:rounded-[32px] shadow-[0_24px_70px_rgba(23,32,51,0.2)] p-6 sm:p-8 text-[#172033]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#E8E5F2]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15966A] flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#172033] font-heading">
                WhatsApp वर माहिती पाठवा
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5567] font-medium">
                नागरिक माहिती व आवश्यक कागदपत्रांची यादी थेट WhatsApp वर शेअर करा.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#4B5567] hover:text-[#172033] bg-[#FAF9FD] hover:bg-[#F2EFFD] transition cursor-pointer border border-[#E8E5F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content selector if not initial item */}
        {!initialItem && (
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-bold text-[#172033] mb-1.5 font-heading">
              कागदपत्र किंवा योजना निवडा:
            </label>
            <select
              value={selectedDocKey}
              onChange={(e) => setSelectedDocKey(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#E8E5F2] text-sm text-[#172033] focus:border-[#5B45C6] outline-none font-medium"
            >
              {Object.entries(CHECKLIST_PRESETS).map(([key, item]) => (
                <option key={key} value={key} className="bg-white text-[#172033]">
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Phone number optional */}
        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-bold text-[#172033] mb-1.5 font-heading">
            WhatsApp मोबाईल नंबर (पर्यायी):
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-bold text-[#15966A]">
              +91
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="१० अंकी नंबर टाका किंवा रिकामा ठेवा"
              maxLength={10}
              className="w-full pl-14 pr-4 py-3 rounded-xl bg-white border-2 border-[#E8E5F2] text-sm text-[#172033] placeholder-[#9CA3AF] focus:border-[#15966A] outline-none font-medium"
            />
          </div>
          <p className="text-xs text-[#6B7280] mt-1 font-medium">
            (नंबर रिकामा ठेवल्यास WhatsApp वर थेट शेअर करण्याचे पर्याय मिळतील.)
          </p>
        </div>

        {/* Preview box */}
        <div className="mb-6">
          <span className="block text-xs sm:text-sm font-bold text-[#172033] mb-1.5 font-heading">
            संदेश पूर्वदृश्य (Clean Citizen Information Preview):
          </span>
          <div className="p-4 rounded-2xl bg-white border-2 border-[#E8E5F2] text-xs sm:text-sm text-[#172033] max-h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed font-mono">
            {buildMessage()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-3 rounded-xl bg-[#FAF9FD] hover:bg-[#F2EFFD] text-[#4B5567] hover:text-[#172033] font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer border border-[#E8E5F2]"
          >
            {copied ? <Check className="w-4 h-4 text-[#15966A]" /> : <Copy className="w-4 h-4 text-[#5B45C6]" />}
            <span>{copied ? 'माहिती कॉपी झाली!' : 'माहिती कॉपी करा'}</span>
          </button>

          <button
            onClick={handleSend}
            className="flex-1 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp वर शेअर करा</span>
          </button>
        </div>

      </div>
    </div>
  );
};
