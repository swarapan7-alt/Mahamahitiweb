import React, { useState } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Home, 
  FileText, 
  Award, 
  Layers, 
  Image as ImageIcon, 
  BellRing, 
  HelpCircle, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck, 
  KeyRound,
  UserCheck
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminChangePasswordModal } from './AdminChangePasswordModal';

export type AdminTab = 
  | 'dashboard'
  | 'homepage'
  | 'schemes'
  | 'documents'
  | 'services'
  | 'images'
  | 'latest';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onViewPublicSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onViewPublicSite,
  children
}) => {
  const { username, logout, isFirstLogin } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'homepage', label: 'मुख्यपृष्ठ', icon: Home },
    { id: 'schemes', label: 'योजना', icon: Award },
    { id: 'documents', label: 'कागदपत्रे', icon: FileText },
    { id: 'services', label: 'शासकीय सेवा', icon: Layers },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'latest', label: 'नवीन माहिती', icon: BellRing },
  ];

  const handleNavClick = (tab: AdminTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#201A30] font-sans flex flex-col md:flex-row">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#EDEBF0] min-h-screen sticky top-0 h-screen z-30 shrink-0 select-none">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-[#EDEBF0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5B45B8] text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-[#201A30] font-heading tracking-tight leading-none">
                महा<span className="text-[#5B45B8]">माहिती</span>
              </div>
              <div className="text-[10px] font-bold text-[#5B45B8] tracking-wider uppercase mt-1">
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#5B45B8] text-white shadow-xs'
                    : 'text-[#464255] hover:bg-[#F6F3FF] hover:text-[#5B45B8]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6E6A82]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3.5 border-t border-[#EDEBF0] space-y-2 bg-[#FAF9F5]/60">
          
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#464255] hover:bg-white hover:text-[#5B45B8] border border-transparent hover:border-[#EDEBF0] transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-[#6E6A82]" />
              <span>Password बदला</span>
            </div>
            {isFirstLogin && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="कृपया सुरुवातीचा पासवर्ड बदला" />
            )}
          </button>

          <button
            onClick={onViewPublicSite}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#464255] hover:bg-white hover:text-[#5B45B8] border border-transparent hover:border-[#EDEBF0] transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#6E6A82]" />
              <span>वेबसाइट पहा</span>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE TOPBAR */}
      <header className="md:hidden bg-white border-b border-[#EDEBF0] px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-[#201A30] hover:bg-[#FAF9F5] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#5B45B8] text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-[#201A30] font-heading">
              महा<span className="text-[#5B45B8]">माहिती</span> Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewPublicSite}
            className="text-xs font-semibold text-[#5B45B8] px-2.5 py-1 rounded-lg bg-[#F6F3FF] border border-[#DDD6FE]"
          >
            वेबसाइट
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-600 p-1.5 hover:bg-red-50 rounded-lg"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex">
          <div className="w-64 bg-white h-full flex flex-col p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEBF0] mb-3">
              <span className="font-bold text-sm">प्रशासकीय मेनू</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-[#6E6A82]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                      isActive
                        ? 'bg-[#5B45B8] text-white'
                        : 'text-[#464255] hover:bg-[#F6F3FF]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="pt-3 border-t border-[#EDEBF0] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setPasswordModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#464255]"
              >
                <KeyRound className="w-4 h-4" />
                <span>Password बदला</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* 3. MAIN ADMIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="hidden md:flex bg-white border-b border-[#EDEBF0] px-8 py-3.5 items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-base font-bold text-[#201A30] font-heading">
              महामाहिती Admin Dashboard
            </h1>
            <p className="text-[11px] text-[#6E6A82]">
              नागरिक माहिती व्यवस्थापन व थेट प्रकाशन प्रणाली
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#EDEBF0] text-xs">
              <UserCheck className="w-3.5 h-3.5 text-[#5B45B8]" />
              <span className="font-bold text-[#201A30]">{username || 'Admin'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
            </div>

            <button
              onClick={() => setPasswordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F6F3FF] border border-[#DDD6FE] text-[#5B45B8] text-xs font-bold transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password बदला</span>
            </button>

            <button
              onClick={onViewPublicSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5B45B8] hover:bg-[#4D39A2] text-white text-xs font-bold shadow-2xs transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>वेबसाइट पहा</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Password Change Modal */}
      <AdminChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />

    </div>
  );
};
