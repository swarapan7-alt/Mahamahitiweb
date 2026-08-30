import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'योजना दुरुस्ती / माहिती सुधारणा',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <nav className="flex items-center gap-2 text-xs text-[#6E6A82] mb-6 font-medium">
        <a href="/" className="hover:text-[#5B4BB7] transition-colors">होम</a>
        <span>/</span>
        <span className="text-[#201A30]">संपर्क</span>
      </nav>

      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201A30] tracking-tight mb-4 font-serif">
          आमच्याशी संपर्क साधा
        </h1>
        <p className="text-base text-[#6E6A82] leading-relaxed">
          {SITE_CONFIG.name} व्यासपीठावरील माहितीबाबत आपल्या काही सूचना, दुरुस्त्या किंवा प्रतिक्रिया असल्यास आपण आम्हाला खालील फॉर्मद्वारे किंवा ईमेलद्वारे कळवू शकता.
        </p>
      </div>

      {/* Warning Box */}
      <div className="bg-[#FFF6ED] border border-[#FDE68A] rounded-xl p-5 mb-8 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-[#D97706] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#78350F] leading-relaxed">
          <strong className="font-bold block mb-1">कृपया नोंद घ्या:</strong>
          आम्ही कोणतेही सरकारी अधिकारी किंवा कर्मचारी नाही. कृपया येथे आपले आधार कार्ड नंबर, बँक तपशील किंवा गोपनीय कागदपत्रे पाठवू नका. अर्ज मंजुरी किंवा हप्ता जमा न होण्याच्या तक्रारींसाठी संबंधित सरकारी कार्यालयाशी संपर्क साधावा.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white border border-[#EDEBF0] rounded-xl p-5 shadow-xs">
            <Mail className="w-6 h-6 text-[#5B4BB7] mb-3" />
            <h3 className="font-bold text-[#201A30] text-sm mb-1">ईमेल संपर्क</h3>
            <p className="text-xs text-[#6E6A82] mb-2">माहिती सुधारणा व संपादकीय सूचनांसाठी</p>
            <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-sm font-semibold text-[#5B4BB7] hover:underline">
              {SITE_CONFIG.contactEmail}
            </a>
          </div>

          <div className="bg-white border border-[#EDEBF0] rounded-xl p-5 shadow-xs">
            <HelpCircle className="w-6 h-6 text-[#367A59] mb-3" />
            <h3 className="font-bold text-[#201A30] text-sm mb-1">वारंवार विचारले जाणारे प्रश्न</h3>
            <p className="text-xs text-[#6E6A82] mb-3">आपल्या प्रश्नाचे उत्तर कदाचित आधीच उपलब्ध असेल.</p>
            <a href="/faq" className="inline-block px-3 py-1.5 bg-[#F0F8F4] text-[#367A59] text-xs font-semibold rounded-lg hover:bg-[#E1F3EA] transition-colors">
              FAQ पेज पहा →
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white border border-[#EDEBF0] rounded-2xl p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-[#F0F8F4] text-[#367A59] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#201A30] mb-2">आपला संदेश प्राप्त झाला आहे!</h3>
              <p className="text-sm text-[#6E6A82] max-w-md mx-auto mb-6">
                ‘{SITE_CONFIG.name}’ व्यासपीठाला भेट दिल्याबद्दल धन्यवाद. आमचे संपादकीय पथक आपल्या सूचनेची लवकरात लवकर पडताळणी करेल.
              </p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'योजना दुरुस्ती / माहिती सुधारणा', message: '' }); }}
                className="px-4 py-2 bg-[#5B4BB7] text-white text-xs font-semibold rounded-lg hover:bg-[#4D3EA0] transition-colors"
              >
                दुसरा संदेश पाठवा
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-[#201A30] mb-2">संदेश पाठवा</h2>

              <div>
                <label className="block text-xs font-semibold text-[#464255] mb-1">आपले नाव *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राहुल देशमुख"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl text-sm focus:outline-none focus:border-[#5B4BB7] text-[#201A30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464255] mb-1">ईमेल पत्ता (ऐच्छिक)</label>
                <input
                  type="email"
                  placeholder="उदा. rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl text-sm focus:outline-none focus:border-[#5B4BB7] text-[#201A30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464255] mb-1">विषय</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl text-sm focus:outline-none focus:border-[#5B4BB7] text-[#201A30]"
                >
                  <option>योजना दुरुस्ती / माहिती सुधारणा</option>
                  <option>नवीन योजनेची शिफारस</option>
                  <option>वेबसाइट त्रुटी (Bug Report)</option>
                  <option>सामान्य प्रतिक्रिया</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464255] mb-1">संदेश *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="आपला संदेश किंवा दुरुस्ती येथे तपशीलवार लिहा..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#EDEBF0] rounded-xl text-sm focus:outline-none focus:border-[#5B4BB7] text-[#201A30]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#5B4BB7] text-white text-sm font-semibold rounded-xl hover:bg-[#4D3EA0] transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>संदेश पाठवा</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
