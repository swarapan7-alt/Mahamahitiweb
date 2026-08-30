import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout, AdminTab } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminHomepage } from './AdminHomepage';
import { AdminSchemes } from './AdminSchemes';
import { AdminDocuments } from './AdminDocuments';
import { AdminServices } from './AdminServices';
import { AdminImages } from './AdminImages';
import { AdminLatest } from './AdminLatest';

interface AdminAppProps {
  onBackToPublicSite: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onBackToPublicSite }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#5B45B8]/20 border-t-[#5B45B8] rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#6E6A82]">प्रशासक पडताळणी सुरू आहे...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin 
        onLoginSuccess={() => setActiveAdminTab('dashboard')} 
        onBackToPublic={onBackToPublicSite}
      />
    );
  }

  return (
    <AdminLayout
      currentTab={activeAdminTab}
      onSelectTab={setActiveAdminTab}
      onViewPublicSite={onBackToPublicSite}
    >
      {activeAdminTab === 'dashboard' && <AdminDashboard onNavigate={setActiveAdminTab} />}
      {activeAdminTab === 'homepage' && <AdminHomepage onNavigate={setActiveAdminTab} />}
      {activeAdminTab === 'schemes' && <AdminSchemes />}
      {activeAdminTab === 'documents' && <AdminDocuments />}
      {activeAdminTab === 'services' && <AdminServices />}
      {activeAdminTab === 'images' && <AdminImages />}
      {activeAdminTab === 'latest' && <AdminLatest />}
    </AdminLayout>
  );
};
