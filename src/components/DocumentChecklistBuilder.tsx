import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  FileCheck2,
  Sparkles,
  Send
} from 'lucide-react';
import { CHECKLIST_PRESETS } from '../data/mockData';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export const DocumentChecklistBuilder: React.FC = () => {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('passport');
  const [title, setTitle] = useState<string>(CHECKLIST_PRESETS['passport'].name);
  const [items, setItems] = useState<ChecklistItem[]>(
    CHECKLIST_PRESETS['passport'].items.map((it, idx) => ({
      id: `item-${idx}`,
      text: it,
      checked: false
    }))
  );
  const [newItemText, setNewItemText] = useState('');
  const [copied, setCopied] = useState(false);
  const [customPhone, setCustomPhone] = useState('');

  const handleSelectPreset = (key: string) => {
    setSelectedPresetKey(key);
    const preset = CHECKLIST_PRESETS[key];
    if (preset) {
      setTitle(preset.name);
      setItems(
        preset.items.map((it, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          text: it,
          checked: false
        }))
      );
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(it => it.id === id ? { ...it, checked: !it.checked } : it));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      setItems([
        ...items,
        {
          id: `custom-${Date.now()}`,
          text: newItemText.trim(),
          checked: false
        }
      ]);
      setNewItemText('');
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(it => it.id !== id));
  };

  const checkedCount = items.filter(it => it.checked).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const generateWhatsAppMessage = () => {
    let msg = `*📋 MahaMahiti.com - आवश्यक कागदपत्रे चेकलिस्ट*\n\n`;
    msg += `*विषय:* ${title}\n\n`;
    msg += `*तयार कागदपत्रे (${checkedCount}/${totalCount}):*\n`;
    
    items.forEach((it, idx) => {
      msg += `${it.checked ? '✅' : '⬜'} ${idx + 1}. ${it.text}\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `ℹ️ *नागरिक मार्गदर्शन:*\n`;
    msg += `या कागदपत्रांची पूर्ण व अद्ययावत माहिती, पात्रता व आवश्यक मार्गदर्शनासाठी आपल्या जवळच्या CSC सेंटर किंवा ई-सेवा केंद्राला भेट द्या.\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `(माहिती स्रोत: MahaMahiti.com)`;

    return encodeURIComponent(msg);
  };

  const handleSendWhatsApp = () => {
    const encoded = generateWhatsAppMessage();
    const cleanPhone = customPhone.replace(/\D/g, '');
    const url = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    let raw = `📋 MahaMahiti.com - कागदपत्रे चेकलिस्ट\nविषय: ${title}\n\n`;
    items.forEach((it, idx) => {
      raw += `${it.checked ? '[✓]' : '[ ]'} ${idx + 1}. ${it.text}\n`;
    });
    raw += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    raw += `ℹ️ नागरिक मार्गदर्शन:\n`;
    raw += `या कागदपत्रांची पूर्ण व अद्ययावत माहिती, पात्रता व आवश्यक मार्गदर्शनासाठी आपल्या जवळच्या CSC सेंटर किंवा ई-सेवा केंद्राला भेट द्या.\n`;
    raw += `━━━━━━━━━━━━━━━━━━━━\n`;
    raw += `(माहिती स्रोत: MahaMahiti.com)`;
    
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="checklist-section" className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Container with Light Lavender Background */}
      <div className="bg-[#FAF9FD] rounded-[28px] sm:rounded-[36px] border-2 border-[#E8E5F2] shadow-[0_12px_40px_rgba(91,69,198,0.06)] p-6 sm:p-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Explanations & Presets */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2EFFD] text-[#5B45C6] text-xs sm:text-sm font-bold border border-[#DCD8EC] mb-3 shadow-xs">
                <FileCheck2 className="w-4 h-4 text-[#5B45C6]" />
                <span>डिजिटल चेकलिस्ट टूल</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight font-heading">
                कागदपत्रांची <span className="text-[#5B45C6]">Checklist</span> तयार करा
              </h2>
              <p className="text-sm sm:text-base text-[#4B5567] mt-2 leading-relaxed font-medium">
                सरकारी दाखले किंवा योजनेच्या अर्जासाठी आवश्यक असणारी कागदपत्रे तपासा, टिक करा आणि थेट आपल्या WhatsApp वर सुरक्षित जतन करा.
              </p>
            </div>

            {/* Template Presets Selector */}
            <div className="bg-white p-5 rounded-3xl border-2 border-[#E8E5F2] space-y-3 shadow-xs">
              <span className="text-xs font-bold text-[#172033] block uppercase tracking-wider">
                लोकप्रिय दाखले टेम्पलेट्स:
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CHECKLIST_PRESETS).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => handleSelectPreset(key)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer ${
                      selectedPresetKey === key
                        ? 'bg-[#5B45C6] text-white border-[#5B45C6] shadow-xs scale-102'
                        : 'bg-[#FAF9FD] text-[#4B5567] border-[#E8E5F2] hover:border-[#5B45C6] hover:text-[#5B45C6]'
                    }`}
                  >
                    {p.name.split('साठी')[0].replace(' आवश्यक कागदपत्रे', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Share Action Box */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#E8E5F2] space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#172033]">
                <Share2 className="w-4 h-4 text-[#25D366]" />
                <span>Checklist WhatsApp वर पाठवा:</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="१० अंकी मोबाईल नंबर (पर्यायी)"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#FAF9FD] border-2 border-[#E8E5F2] focus:border-[#5B45C6] outline-none font-medium text-[#172033]"
                />
                <button
                  onClick={handleSendWhatsApp}
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-xs hover:scale-102"
                >
                  <Send className="w-4 h-4" />
                  <span>पाठवा</span>
                </button>
              </div>
              <p className="text-xs text-[#6B7280]">
                नंबर न टाकता थेट WhatsApp वर शेअर करण्यासाठी थेट बटनावर क्लिक करा.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Checklist Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#E8E5F2] shadow-sm space-y-5">
            
            {/* Header & Progress Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E5F2]">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#172033] font-heading">
                  {title}
                </h3>
                <div className="text-xs sm:text-sm text-[#4B5567] mt-0.5 font-medium">
                  तयार कागदपत्रे: <strong className="text-[#5B45C6] font-bold">{checkedCount} / {totalCount}</strong> ({progressPercent}%)
                </div>
              </div>

              {/* Action Buttons: Copy & Print */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyText}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF9FD] hover:bg-[#F2EFFD] text-[#5B45C6] border border-[#DCD8EC] text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5"
                  title="यादी कॉपी करा"
                >
                  {copied ? <Check className="w-4 h-4 text-[#15966A]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'कॉपी झाले!' : 'कॉपी'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF9FD] hover:bg-[#F2EFFD] text-[#172033] border border-[#E8E5F2] text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5"
                  title="प्रिंट करा"
                >
                  <Printer className="w-4 h-4 text-[#4B5567]" />
                  <span className="hidden sm:inline">प्रिंट</span>
                </button>
              </div>
            </div>

            {/* Progress Meter */}
            <div className="w-full bg-[#FAF9FD] h-2.5 rounded-full overflow-hidden border border-[#E8E5F2]">
              <div 
                className="bg-gradient-to-r from-[#5B45C6] to-[#3157B7] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checkable Items List */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
                    item.checked
                      ? 'bg-[#F2EFFD] border-[#DCD8EC] text-[#172033]'
                      : 'bg-[#FAF9FD] border-[#E8E5F2] hover:border-[#5B45C6] text-[#172033]'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="pt-0.5 text-[#5B45C6]">
                      {item.checked ? (
                        <CheckSquare className="w-5 h-5 text-[#5B45C6]" />
                      ) : (
                        <Square className="w-5 h-5 text-[#9B98A6]" />
                      )}
                    </div>
                    <span className={`text-sm sm:text-base font-semibold ${item.checked ? 'line-through text-[#6B7280]' : 'text-[#172033]'}`}>
                      {item.text}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="text-[#9B98A6] hover:text-rose-600 p-1 transition cursor-pointer"
                    title="काढून टाका"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Item Field */}
            <form onSubmit={handleAddItem} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="स्वतःचे कागदपत्र जोडा..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-[#FAF9FD] border-2 border-[#E8E5F2] text-xs sm:text-sm font-medium text-[#172033] focus:border-[#5B45C6] outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#5B45C6] hover:bg-[#4530A8] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>जोडा</span>
              </button>
            </form>

            {/* Bottom Actions Bar */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8E5F2]">
              <div className="text-xs text-[#4B5567] font-medium">
                ✓ सर्व कागदपत्रांच्या मूळ प्रती व प्रत्येकी २ झेरॉक्स सोबत ठेवा.
              </div>

              <button
                onClick={handleSendWhatsApp}
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-xs hover:shadow-md cursor-pointer hover:scale-102"
              >
                <Share2 className="w-4 h-4" />
                <span>Checklist WhatsApp वर मिळवा</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
