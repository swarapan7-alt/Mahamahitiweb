import React, { useState, useEffect } from 'react';
import { 
  Award, 
  FileText, 
  Layers, 
  BellRing, 
  Image as ImageIcon, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Eye,
  TrendingUp,
  RefreshCw,
  Activity
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminTab } from './AdminLayout';

interface AdminDashboardProps {
  onNavigate: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { schemes, documents, services, updates, images, homepageConfig } = useAdminAuth();
  const [visitorStats, setVisitorStats] = useState<{ total: number; today: number; yesterday?: number; month: number; pageViews?: number }>({
    total: 0,
    today: 0,
    yesterday: 0,
    month: 0,
    pageViews: 0
  });
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch('/api/visitors/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setVisitorStats(data.stats);
        }
      }
    } catch (e) {
      console.warn('Stats fetch error:', e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const schemesCount = schemes.length;
  const documentsCount = documents.length;
  const servicesCount = services.length;
  const updatesCount = updates.length;
  const imagesCount = images.length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome / Status Card */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#F6F3FF] text-[#5B45B8] border border-[#DDD6FE]">
              प्रशासकीय नियंत्रण कक्ष
            </span>
            <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> सिस्टीम सक्रिय
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#201A30] font-heading tracking-tight">
            महामाहिती Admin Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6A82] max-w-2xl">
            नागरिकांसाठी सर्व शासकीय योजना, दाखले, सेवा आणि मुख्यपृष्ठ फोटो अत्यंत सोप्या पद्धतीने व्यवस्थापित करा.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('images')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5B45B8] hover:bg-[#4D39A2] text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>मुख्यपृष्ठ Hero फोटो बदला</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('schemes')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#DDD6FE] text-[#5B45B8] text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>नवीन योजना जोडा</span>
          </button>
        </div>
      </div>

      {/* Real Useful Counts Grid */}
      <div>
        <h3 className="text-sm font-bold text-[#6E6A82] uppercase tracking-wider mb-3">
          सध्याची उपलब्ध माहिती (Real CMS Counts)
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          {/* Schemes Card */}
          <div 
            onClick={() => onNavigate('schemes')}
            className="bg-white border border-[#EDEBF0] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#DDD6FE] hover:shadow-sm transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F6F3FF] text-[#5B45B8] flex items-center justify-center border border-[#DDD6FE] group-hover:scale-105 transition">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#201A30] font-heading">
              {schemesCount}
            </div>
            <div className="text-xs font-bold text-[#464255] mt-1">योजना (Schemes)</div>
          </div>

          {/* Documents Card */}
          <div 
            onClick={() => onNavigate('documents')}
            className="bg-white border border-[#EDEBF0] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#DDD6FE] hover:shadow-sm transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#201A30] font-heading">
              {documentsCount}
            </div>
            <div className="text-xs font-bold text-[#464255] mt-1">कागदपत्रे (Documents)</div>
          </div>

          {/* Services Card */}
          <div 
            onClick={() => onNavigate('services')}
            className="bg-white border border-[#EDEBF0] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#DDD6FE] hover:shadow-sm transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center border border-amber-200 group-hover:scale-105 transition">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#201A30] font-heading">
              {servicesCount}
            </div>
            <div className="text-xs font-bold text-[#464255] mt-1">शासकीय सेवा (Services)</div>
          </div>

          {/* Updates Card */}
          <div 
            onClick={() => onNavigate('latest')}
            className="bg-white border border-[#EDEBF0] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#DDD6FE] hover:shadow-sm transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#9333EA] flex items-center justify-center border border-purple-200 group-hover:scale-105 transition">
                <BellRing className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#201A30] font-heading">
              {updatesCount}
            </div>
            <div className="text-xs font-bold text-[#464255] mt-1">नवीन माहिती (Updates)</div>
          </div>

          {/* Images Card */}
          <div 
            onClick={() => onNavigate('images')}
            className="bg-white border border-[#EDEBF0] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#DDD6FE] hover:shadow-sm transition cursor-pointer group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-200 group-hover:scale-105 transition">
                <ImageIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#201A30] font-heading">
              {imagesCount}
            </div>
            <div className="text-xs font-bold text-[#464255] mt-1">Images (फोटो)</div>
          </div>

        </div>
      </div>

      {/* Real-time Visitor Statistics Section in Admin Panel */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EDEBF0]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#201A30] font-heading flex items-center gap-2">
              <Users className="w-5 h-5 text-[#5B45B8]" />
              <span>नागरिक उपस्थिती आकडेवारी (Visitor Counter Statistics)</span>
            </h3>
            <p className="text-xs text-[#6E6A82] mt-0.5">
              पोर्टलला भेट देणाऱ्या नागरिकांची थेट आणि साठवलेली संख्या
            </p>
          </div>
          <button
            type="button"
            onClick={fetchStats}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F5] hover:bg-[#F6F3FF] border border-[#DDD6FE] text-[#5B45B8] text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
            <span>रीफ्रेश करा</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="p-4 rounded-xl bg-[#F6F3FF] border border-[#DDD6FE]">
            <span className="text-xs font-bold text-[#5B45B8] flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> एकूण नागरिक भेटी
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#201A30] mt-1 font-heading">
              {visitorStats.total.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#6E6A82] mt-1">Total Visitors</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> आजच्या भेटी
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#201A30] mt-1 font-heading">
              {visitorStats.today.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#6E6A82] mt-1">Today's Visits</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-xs font-bold text-[#D97706] flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> कालच्या भेटी
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#201A30] mt-1 font-heading">
              {(visitorStats.yesterday || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#6E6A82] mt-1">Yesterday's Visits</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-xs font-bold text-[#2563EB] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> या महिन्यातील भेटी
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#201A30] mt-1 font-heading">
              {(visitorStats.month || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#6E6A82] mt-1">This Month</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 col-span-2 sm:col-span-1">
            <span className="text-xs font-bold text-[#9333EA] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Page Views
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#201A30] mt-1 font-heading">
              {(visitorStats.pageViews || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#6E6A82] mt-1">Total Pageviews</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Quick Hero Banner Replacement Box */}
        <div className="bg-white border border-[#EDEBF0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#F6F3FF] text-[#5B45B8] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#201A30] font-heading">
              Hero Banner फोटो व्यवस्थापन
            </h4>
            <p className="text-xs text-[#6E6A82] leading-relaxed">
              मुख्यपृष्ठावरील 16:9 आकाराचा मुख्य फोटो बदला. कोणताही तांत्रिक फॉर्म भरण्याची गरज नाही.
            </p>
          </div>
          <button
            onClick={() => onNavigate('images')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#5B45B8] hover:bg-[#4D39A2] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>फोटो बदला (Images विभागात जा)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Schemes Management Box */}
        <div className="bg-white border border-[#EDEBF0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#201A30] font-heading">
              शासकीय योजना व्यवस्थापन
            </h4>
            <p className="text-xs text-[#6E6A82] leading-relaxed">
              लाडकी बहीण, शेतकरी सन्मान, शिष्यवृत्ती इत्यादी योजनांची अचूक मराठी माहिती अद्ययावत करा.
            </p>
          </div>
          <button
            onClick={() => onNavigate('schemes')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>योजना व्यवस्थापित करा</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Documents & Services Box */}
        <div className="bg-white border border-[#EDEBF0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#201A30] font-heading">
              कागदपत्रे व दाखले
            </h4>
            <p className="text-xs text-[#6E6A82] leading-relaxed">
              उत्पन्न दाखला, जात प्रमाणपत्र, रेशन कार्डसाठी लागणाऱ्या कागदपत्रांची अचूक यादी बदला.
            </p>
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#201A30] hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>कागदपत्रे व्यवस्थापित करा</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
