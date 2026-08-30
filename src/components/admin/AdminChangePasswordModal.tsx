import React, { useState } from 'react';
import { X, Lock, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { changePassword } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('कृपया चालू पासवर्ड टाका.');
      return;
    }
    if (newPassword.length < 6) {
      setError('नवीन पासवर्ड किमान ६ अक्षरांचा असावा.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('नवीन पासवर्ड आणि कन्फर्म पासवर्ड जुळत नाहीत.');
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess('पासवर्ड यशस्वीरित्या बदलण्यात आला आहे!');
      setTimeout(() => {
        onClose();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
      }, 1800);
    } else {
      setError(result.error || 'पासवर्ड बदलताना अडचण आली.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#EDEBF0] rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EDEBF0] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F6F3FF] text-[#5B45B8] flex items-center justify-center border border-[#DDD6FE]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#201A30]">Password बदला</h3>
              <p className="text-xs text-[#6E6A82]">प्रशासक खात्याचा पासवर्ड सुरक्षितपणे अपडेट करा</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6E6A82] hover:bg-[#F6F3FF] hover:text-[#201A30] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#201A30] mb-1.5">
              चालू पासवर्ड (Current Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9B98A6] absolute left-3.5 top-3" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-sm outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#201A30] mb-1.5">
              नवीन पासवर्ड (New Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9B98A6] absolute left-3.5 top-3" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="किमान ६ अक्षरे"
                className="w-full pl-10 pr-3.5 py-2 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-sm outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#201A30] mb-1.5">
              नवीन पासवर्ड कन्फर्म करा (Confirm Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9B98A6] absolute left-3.5 top-3" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="पुन्हा तोच पासवर्ड टाका"
                className="w-full pl-10 pr-3.5 py-2 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-sm outline-none transition"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#6E6A82] hover:bg-[#FAF9F5] rounded-xl transition cursor-pointer"
            >
              रद्द करा
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#5B45B8] hover:bg-[#4D39A2] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60"
            >
              {loading ? 'अपडेट होत आहे...' : 'पासवर्ड साठवा'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
