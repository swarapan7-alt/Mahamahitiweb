import React, { useState } from 'react';
import { Building2, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToPublic }) => {
  const { login } = useAdminAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('कृपया Username टाका.');
      return;
    }
    if (!password) {
      setError('कृपया Password टाका.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(username.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'अवैध Username किंवा Password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between items-center px-4 py-8 sm:py-12 font-sans selection:bg-[#DDD6FE]">
      {/* Top Bar / Navigation */}
      <div className="w-full max-w-md flex items-center justify-between">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E6A82] hover:text-[#5B45B8] transition cursor-pointer"
        >
          <span>← मुख्य वेबसाइटवर जा</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#EDEBF0] text-[11px] font-semibold text-[#5B45B8] shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>सुरक्षित व्यवस्थापन</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md my-auto">
        <div className="bg-white border border-[#EDEBF0] rounded-2xl p-7 sm:p-9 shadow-sm">
          
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#5B45B8] text-white shadow-sm mb-3.5">
              <Building2 className="w-6 h-6" />
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#201A30] font-sans">
              <span className="text-[#201A30]">MahaMahiti.com</span>
              <span className="text-[#6E6A82] font-semibold text-base sm:text-lg"> / Admin Panel</span>
            </h1>
            
            <h2 className="text-sm font-semibold text-[#6E6A82] mt-2">
              Administrator Login
            </h2>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-[#201A30] mb-1.5" htmlFor="admin-username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9B98A6]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-sm text-[#201A30] outline-none transition placeholder:text-[#9B98A6]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#201A30]" htmlFor="admin-password">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9B98A6]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-sm text-[#201A30] outline-none transition placeholder:text-[#9B98A6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9B98A6] hover:text-[#5B45B8] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#5B45B8] hover:bg-[#4D39A2] text-white font-bold text-sm rounded-xl shadow-xs transition hover:shadow-sm cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>पडताळणी चालू आहे...</span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-[#9B98A6] mt-4">
        © २०२६ MahaMahiti.com • सर्व प्रशासकीय कृती सुरक्षित व नोंदवल्या जातात
      </div>
    </div>
  );
};
