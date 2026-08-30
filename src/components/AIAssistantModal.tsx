import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Volume2, 
  Bot, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onSpeak
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
        text: data.reply || 'माहिती उपलब्ध नाही. कृपया अधिकृत वेबसाइट तपासा.',
        timestamp: new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedQuestions || [
          'कागदपत्रे चेकलिस्ट',
          'अर्ज कसा करायचा?',
          'अधिकृत वेबसाइट कोणती?'
        ]
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Fetch Error:", err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'माफ करा, संपर्क साधताना अडचण आली. आपण थेट आमच्या योजना किंवा कागदपत्रे यादीतून माहिती तपासू शकता.',
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
                Gemini AI तंत्रज्ञानावर आधारित
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
        <div className="bg-[#FFF7ED] px-4 py-2 border-b border-[#FFEDD5] text-xs text-[#EA580C] flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-[#EA580C] shrink-0" />
          <span>स्वतंत्र माहिती व्यासपीठ • अंतिम पडताळणीसाठी अधिकृत पोर्टल तपासा</span>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F4F6FB]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[88%]">
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-[#5B45C6] flex items-center justify-center text-white font-bold text-xs shrink-0 mb-1 shadow-xs">
                    AI
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#5B45C6] to-[#3157B7] text-white rounded-br-none shadow-md font-semibold'
                      : 'bg-white text-[#172033] border-2 border-[#E8E5F2] rounded-bl-none shadow-xs font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Audio Narrator Button for AI response */}
                  {msg.sender === 'ai' && (
                    <div className="mt-3 pt-2.5 border-t border-[#E8E5F2] flex items-center justify-between text-xs text-[#6B7280]">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => onSpeak(msg.text)}
                        className="inline-flex items-center gap-1 text-[#5B45C6] hover:text-[#4A38A8] font-bold transition cursor-pointer"
                        title="आवाज ऐका"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>मराठीत ऐका</span>
                      </button>
                    </div>
                  )}
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
          ))}

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

