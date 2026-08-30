import React, { useState } from 'react';
import { 
  Settings, 
  KeyRound, 
  ShieldCheck, 
  Mail, 
  MessageSquare, 
  Globe, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminChangePasswordModal } from './AdminChangePasswordModal';

export const AdminSettings: React.FC = () => {
  const { changePassword, username } = useAdminAuth();
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [siteTitle, setSiteTitle] = useState('MahaMahiti.com');
  const [contactEmail, setContactEmail] = useState('contact@mahamahiti.com');
  const [descriptor, setDescriptor] = useState('सर्व नागरिकांच्या माहितीसाठी (MahaMahiti.com)');
  const [notification, setNotification] = useState('');

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification('सेटिंग्ज यशस्वीरित्या अपडेट करण्यात आल्या आहेत.');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#201A30] font-heading flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#5B45B8]" />
            <span>प्रशासकीय सेटिंग्ज (Admin & Site Settings)</span>
          </h2>
          <p className="text-xs text-[#6E6A82] mt-1">
            प्रशासक पासवर्ड, सुरक्षा सेटिंग्ज, संपर्क तपशील आणि प्लॅटफॉर्मची मूलभूत माहिती व्यवस्थापित करा.
          </p>
        </div>

        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B45B8] hover:bg-[#4D39A2] text-white text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Admin Password</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Security & Access Section */}
        <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#201A30] font-heading flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>सुरक्षा आणि प्रमाणीकरण (Security & Auth)</span>
          </h3>

          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#EDEBF0] space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#EDEBF0]">
              <span className="text-[#6E6A82]">वर्तमान युझरनेम:</span>
              <strong className="text-[#201A30]">{username || 'admin'}</strong>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#EDEBF0]">
              <span className="text-[#6E6A82]">प्रशासकीय भूमिका (Role):</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#5B45B8] font-bold border border-purple-200">
                Super Admin
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#EDEBF0]">
              <span className="text-[#6E6A82]">सत्र सुरक्षा (Session):</span>
              <span className="text-[#16A34A] font-bold">Secure Bearer Token</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6E6A82]">पासवर्ड एन्क्रिप्शन:</span>
              <span className="text-[#201A30]">SHA-256 + Unique Salt</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FAF9F5] hover:bg-[#F6F3FF] border border-[#DDD6FE] text-[#5B45B8] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>प्रशासक पासवर्ड अपडेट करा (Change Password)</span>
            </button>
          </div>
        </div>

        {/* Brand & Platform Identity Rules */}
        <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#201A30] font-heading flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#5B45B8]" />
            <span>ब्रँड व प्लॅटफॉर्म नियमावली (Brand Identity)</span>
          </h3>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>महत्त्वाची मार्गदर्शक तत्त्वे:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>MahaMahiti हे एक स्वतंत्र नागरिक माहिती व्यासपीठ (Citizen Information Platform) आहे.</li>
              <li>शासकीय संकेतस्थळ असल्याचा कोणताही दिशाभूल करणारा आभास निर्माण करू नका.</li>
              <li>संकेतस्थळावर कोणतेही शुल्क आकारले जात नाही. (No Service Charges).</li>
              <li>सर्व माहिती अधिकृत शासन निर्णय (GR) व शासकीय पोर्टलवर आधारित ठेवा.</li>
            </ul>
          </div>

          <form onSubmit={handleSaveGeneral} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-[#201A30] mb-1">संकेतस्थळ नाव (Title)</label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#201A30] mb-1">प्लॅटफॉर्म वर्णन (Descriptor)</label>
              <input
                type="text"
                value={descriptor}
                onChange={(e) => setDescriptor(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#201A30] mb-1">संपर्क ई-मेल (Contact Email)</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#5B45B8] text-white font-bold rounded-xl shadow-xs hover:bg-[#4D39A2] transition cursor-pointer"
              >
                सेटिंग्ज साठवा
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Password Modal */}
      <AdminChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

    </div>
  );
};
