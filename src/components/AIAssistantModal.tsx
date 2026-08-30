import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  AlertCircle,
  Loader2,
  Building2,
  Info
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CITIZEN_GUIDANCE_HEADER = "नागरिक मार्गदर्शन:";
const CITIZEN_GUIDANCE_BODY = "या योजनेची/सेवेची पूर्ण व अद्ययावत माहिती, पात्रता आणि आवश्यक प्रक्रियेसाठी आपल्या जवळच्या CSC सेंटर किंवा ई-सेवा केंद्राशी संपर्क करा.";

// Frontend safety sanitizer for all AI responses (removes URLs, fee charts, and ₹ amounts)
function sanitizeAssistantText(text: string): { mainText: string; hasGuidance: boolean; guidanceText: string } {
  if (!text) return { mainText: '', hasGuidance: false, guidanceText: '' };

  let cleaned = text;

  // 1. Remove URLs, web links, domain references
  cleaned = cleaned.replace(/https?:\/\/[^\s)]+/gi, '');
  cleaned = cleaned.replace(/www\.[^\s)]+/gi, '');
  cleaned = cleaned.replace(/\b[a-zA-Z0-9.-]+\.(?:gov\.in|nic\.in|mahaonline\.gov\.in|maharashtra\.gov\.in|gov|in|com|org|net|co\.in)\b[^\s)]*/gi, '');
  cleaned = cleaned.replace(/\(\s*\)/g, '');

  // 2. Remove URL / Portal lead-in lines
  cleaned = cleaned.replace(/^[•\s*-]*(?:अधिकृत पोर्टल|अधिकृत वेबसाइट|अधिकृत संकेतस्थळ|Official Portal|Official Website|वेबसाइट|पोर्टल)\s*:[^\n]*$/gmi, '');
  cleaned = cleaned.replace(/^[•\s*-]*(?:अर्ज करण्यासाठी वेबसाइटला भेट द्या|पोर्टलवर जाऊन अर्ज करा)[^\n]*$/gmi, '');

  // 3. Remove Fee / Price / Charges / Rates / ₹ lines
  cleaned = cleaned.replace(/^[•\s*-]*(?:सरकारी शुल्क|अर्ज शुल्क|शुल्क|फी|लागणारे शुल्क|दर|रेट|रेट चार्ट|Charges|Fees|Fee|Price|Cost)\s*:[^\n]*$/gmi, '');
  cleaned = cleaned.replace(/^[•\s*-]*[^\n]*\b(?:शुल्क|फी|charges|fees)\b[^\n]*₹[^\n]*$/gmi, '');
  cleaned = cleaned.replace(/₹\s*[\d,०-९]+(?:\s*रुपये|\s*रु|\s*\/-\s*)?/g, '');
  cleaned = cleaned.replace(/[\d,०-९]+\s*रुपये(?:\s*सरकारी शुल्क|\s*फी|\s*शुल्क)?/g, '');

  // Clean empty bullet points or multi-line gaps
  cleaned = cleaned.replace(/^[•\s*-]+$/gm, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  // Check for citizen guidance section
  let mainText = cleaned;
  let hasGuidance = false;
  let guidanceText = CITIZEN_GUIDANCE_BODY;

  if (cleaned.includes(CITIZEN_GUIDANCE_HEADER)) {
    const parts = cleaned.split(CITIZEN_GUIDANCE_HEADER);
    mainText = parts[0].trim();
    hasGuidance = true;
    if (parts[1] && parts[1].trim()) {
      guidanceText = parts[1].trim();
    }
  } else if (
    cleaned.length > 80 && 
    (cleaned.includes('योजना') || cleaned.includes('कागदपत्रे') || cleaned.includes('अर्ज') || cleaned.includes('पात्रता') || cleaned.includes('दाखला') || cleaned.includes('पासपोर्ट'))
  ) {
    hasGuidance = true;
  }

  return { mainText, hasGuidance, guidanceText };
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'नमस्कार! मी आपला "महामाहिती" AI नागरिक सहाय्यक आहे. तुम्हाला कोणत्या सरकारी योजना, आवश्यक कागदपत्रे, दाखले किंवा शासकीय सेवांबद्दल माहिती हवी आहे?',
      timestamp: new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'माझ्यासाठी योजना शोधा',
        'पासपोर्टसाठी काय लागते?',
        'लाडकी बहीण योजनेची माहिती',
        'उत्पन्न दाखल्यासाठी कागदपत्रे',
        'सरकारी कर्ज योजना दाखवा'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() })
      });

      const data = await res.json();
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'माहिती उपलब्ध नाही. कृपया जवळच्या ई-सेवा केंद्राशी संपर्क करा.',
        timestamp: new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedQuestions || [
          'कागदपत्रे चेकलिस्ट',
          'पात्रतेच्या अटी काय आहेत?',
          'अर्जासाठी आवश्यक प्रक्रिया काय आहे?'
        ]
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Fetch Error:", err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'माफ करा, संपर्क साधताना तांत्रिक अडचण आली. आपण थेट आमच्या योजना किंवा कागदपत्रे यादीतून माहिती तपासू शकता किंवा जवळच्या सीएससी केंद्राशी संपर्क करू शकता.',
        timestamp: new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full sm:max-w-xl bg-[#FAF9FD] border-2 border-[#E8E5F2] sm:rounded-[32px] shadow-[0_24px_70px_rgba(23,32,51,0.2)] flex flex-col h-[90vh] sm:h-[650px] overflow-hidden text-[#172033]">
        
        {/* Header */}
        <div className="bg-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-[#E8E5F2]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#5B45C6] to-[#3157B7] flex items-center justify-center text-white shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-[#172033] font-heading">
                  AI नागरिक सहाय्यक
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-[#15966A] animate-pulse" />
              </div>
              <p className="text-xs text-[#4B5567] font-medium">
                सरकारी योजना व सेवा मार्गदर्शक
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FAF9FD] hover:bg-[#F2EFFD] text-[#4B5567] hover:text-[#172033] transition cursor-pointer border border-[#E8E5F2]"
            aria-label="बंद करा"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Bar */}
        <div className="bg-[#F6F5FC] px-4 py-2 border-b border-[#E8E5F2] text-xs text-[#5B45C6] flex items-center gap-2 font-semibold">
          <Info className="w-4 h-4 text-[#5B45C6] shrink-0" />
          <span>स्वतंत्र नागरिक माहिती व्यासपीठ • अचूक व सुलभ मार्गदर्शन</span>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F4F6FB]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const parsed = !isUser ? sanitizeAssistantText(msg.text) : { mainText: msg.text, hasGuidance: false, guidanceText: '' };

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[92%] sm:max-w-[88%]">
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-[#5B45C6] flex items-center justify-center text-white font-bold text-xs shrink-0 mb-1 shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-[#5B45C6] to-[#3157B7] text-white rounded-br-none shadow-md font-semibold'
                        : 'bg-white text-[#172033] border-2 border-[#E8E5F2] rounded-bl-none shadow-xs font-medium'
                    }`}
                  >
                    {/* Main text message */}
                    <p className="whitespace-pre-line text-[#172033] font-medium leading-relaxed">
                      {isUser ? msg.text : parsed.mainText}
                    </p>

                    {/* Clean Citizen Guidance Box (नागरिक मार्गदर्शन) */}
                    {!isUser && parsed.hasGuidance && (
                      <div className="mt-3.5 pt-3 border-t border-[#E8E5F2]">
                        <div className="p-3 bg-[#F7F5FE] border border-[#DDD6FE] rounded-xl text-xs text-[#3730A3] flex items-start gap-2.5">
                          <Building2 className="w-4 h-4 text-[#5B45C6] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#43319E] block">नागरिक मार्गदर्शन:</span>
                            <p className="text-[#3730A3] leading-relaxed font-medium">
                              {parsed.guidanceText}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="mt-2.5 text-[11px] text-[#8C899B] text-right font-sans">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>

                {/* Suggested Questions Pills */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-10">
                    {msg.suggestedActions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F2EFFD] text-[#5B45C6] border border-[#DCD8EC] hover:border-[#5B45C6] text-xs font-bold transition cursor-pointer shadow-2xs"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-[#4B5567] text-xs p-3 bg-white rounded-2xl border-2 border-[#E8E5F2] w-fit shadow-xs font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-[#5B45C6]" />
              <span>AI सहाय्यक माहिती शोधत आहे...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t-2 border-[#E8E5F2]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="तुमचा प्रश्न मराठी किंवा इंग्रजीत विचारा..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#FAF9FD] border-2 border-[#E8E5F2] text-sm text-[#172033] placeholder-[#9CA3AF] focus:border-[#5B45C6] outline-none transition font-medium"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-r from-[#5B45C6] to-[#3157B7] hover:opacity-95 text-white font-bold transition disabled:opacity-50 shadow-sm cursor-pointer hover:scale-102"
              aria-label="पाठवा"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
