import React, { useState, useRef } from 'react';
import { 
  Home, 
  Save, 
  Upload, 
  CheckCircle2, 
  Sparkles,
  Crop,
  AlertTriangle,
  RefreshCw,
  Eye,
  ExternalLink,
  Layers,
  Award,
  BellRing,
  Image as ImageIcon
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminTab } from './AdminLayout';
import { compressImageFile } from '../../utils/schemeImageUtils';

interface AdminHomepageProps {
  onNavigate?: (tab: AdminTab) => void;
}

interface ImageCardDef {
  id: string;
  section: string;
  name: string;
  ratioLabel: string;
  recommendedSize: string;
  targetRatio: number;
  defaultUrl: string;
}

const HOMEPAGE_IMAGE_SECTIONS: ImageCardDef[] = [
  // 1. Hero Banner
  {
    id: 'homepage_hero',
    section: 'Hero Banner',
    name: 'मुख्यपृष्ठ Hero',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=85'
  },
  // 2. Featured Scheme Images
  {
    id: 'homepage_women_child',
    section: 'Featured Scheme Images',
    name: 'लाडकी बहीण / महिला व बाल विकास योजना फोटो',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'homepage_farmer',
    section: 'Featured Scheme Images',
    name: 'शेतकरी कल्याण / कृषी योजना फोटो',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'homepage_education',
    section: 'Featured Scheme Images',
    name: 'शिक्षण व शिष्यवृत्ती योजना फोटो',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'homepage_health',
    section: 'Featured Scheme Images',
    name: 'आरोग्य योजना (महात्मा फुले जन आरोग्य) फोटो',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
  },
  // 3. Latest Information Images
  {
    id: 'homepage_other_services',
    section: 'Latest Information Images',
    name: 'इतर नागरिक सेवा व महत्त्वाची माहिती फोटो',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80'
  }
];

export const AdminHomepage: React.FC<AdminHomepageProps> = ({ onNavigate }) => {
  const { homepageConfig, saveHomepageConfig, images, saveImage, uploadImageSlot } = useAdminAuth();
  
  const [successToast, setSuccessToast] = useState('');
  const [savingSlotId, setSavingSlotId] = useState<string | null>(null);
  
  const [pendingImages, setPendingImages] = useState<{
    [slotId: string]: {
      url: string;
      width: number;
      height: number;
      ratioMatches: boolean;
    }
  }>({});

  const fileInputRefs = useRef<{ [slotId: string]: HTMLInputElement | null }>({});

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const getSlotUrl = (slot: ImageCardDef): string => {
    if (pendingImages[slot.id]) {
      return pendingImages[slot.id].url;
    }
    if (slot.id === 'img-hero') {
      const heroUrl = homepageConfig?.heroImage || homepageConfig?.heroImageUrl;
      if (heroUrl) return heroUrl;
    }
    const found = images.find(img => img.id === slot.id);
    return found ? found.url : slot.defaultUrl;
  };

  const handleFileChange = async (slot: ImageCardDef, file: File) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('कृपया JPG, PNG किंवा WEBP स्वरूपातील फोटो निवडा.');
      return;
    }

    const maxW = slot.id === 'homepage_hero' || slot.id === 'img-hero' ? 1920 : 1200;
    const maxH = slot.id === 'homepage_hero' || slot.id === 'img-hero' ? 1080 : 675;

    const compressedResult = await compressImageFile(file, maxW, maxH, 0.90);
    if (!compressedResult) return;

    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const actualRatio = width / height;
      const targetRatio = slot.targetRatio;
      const ratioMatches = Math.abs(actualRatio - targetRatio) / targetRatio <= 0.08;

      setPendingImages(prev => ({
        ...prev,
        [slot.id]: {
          url: compressedResult,
          width,
          height,
          ratioMatches
        }
      }));
    };
    img.src = compressedResult;
  };

  const handleAutoFit = (slot: ImageCardDef) => {
    const pending = pendingImages[slot.id];
    if (!pending) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let targetW = 1920;
      let targetH = 1080;
      if (slot.targetRatio === 1) {
        targetW = 1080;
        targetH = 1080;
      } else if (slot.id !== 'img-hero') {
        targetW = 1200;
        targetH = 675;
      }

      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const imgRatio = img.width / img.height;
      const targetR = targetW / targetH;

      let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;
      if (imgRatio > targetR) {
        srcW = img.height * targetR;
        srcX = (img.width - srcW) / 2;
      } else {
        srcH = img.width / targetR;
        srcY = (img.height - srcH) / 2;
      }

      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetW, targetH);
      const croppedUrl = canvas.toDataURL('image/jpeg', 0.92);

      setPendingImages(prev => ({
        ...prev,
        [slot.id]: {
          url: croppedUrl,
          width: targetW,
          height: targetH,
          ratioMatches: true
        }
      }));
    };
    img.src = pending.url;
  };

  const handleSaveSlot = async (slot: ImageCardDef) => {
    setSavingSlotId(slot.id);
    const pending = pendingImages[slot.id];

    if (pending?.url) {
      const canonicalSlotId = slot.id === 'img-hero' ? 'homepage_hero' : slot.id;
      const res = await uploadImageSlot(canonicalSlotId, pending.url, {
        name: slot.name,
        altText: slot.name,
        recommendedSize: slot.recommendedSize,
        usedIn: `मुख्यपृष्ठ ${slot.section}`
      });

      if (res.success) {
        setPendingImages(prev => {
          const copy = { ...prev };
          delete copy[slot.id];
          return copy;
        });
        showNotification(`"${slot.name}" कायमस्वरूपी सेव्ह झाला!`);
      } else {
        alert(res.error || 'इमेज सेव्ह करण्यात अडचण आली.');
      }
    } else {
      const finalUrl = getSlotUrl(slot);
      await saveImage({
        id: slot.id,
        name: slot.name,
        url: finalUrl,
        altText: slot.name,
        usedIn: `मुख्यपृष्ठ ${slot.section}`,
        fileSize: 'Uploaded Image',
        uploadedAt: new Date().toISOString().split('T')[0]
      });
      showNotification(`"${slot.name}" सेव्ह करण्यात आला!`);
    }

    setSavingSlotId(null);
  };

  const sections = [
    'Hero Banner',
    'Category Images',
    'Featured Scheme Images',
    'Latest Information Images'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl sm:rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5B45B8] text-white flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-[#201A30] font-heading">
              मुख्यपृष्ठ व्यवस्थापन (Homepage Management)
            </h2>
          </div>
          <p className="text-xs text-[#6E6A82] mt-1.5">
            मुख्यपृष्ठावरील Hero Banner, वर्गवारी (Categories), वैशिष्ट्यीकृत योजना आणि नवीन माहितीचे फोटो थेट बदला.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#DDD6FE] text-[#5B45B8] text-xs font-bold transition shadow-2xs"
        >
          <Eye className="w-4 h-4" />
          <span>वेबसाइटचे मुख्यपृष्ठ पहा</span>
        </a>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Sections rendering */}
      {sections.map((secName) => {
        const sectionSlots = HOMEPAGE_IMAGE_SECTIONS.filter(s => s.section === secName);
        return (
          <div key={secName} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#EDEBF0] pb-2">
              <h3 className="text-base font-bold text-[#201A30] font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5B45B8]" />
                <span>{secName}</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sectionSlots.map((slot) => {
                const currentUrl = getSlotUrl(slot);
                const pending = pendingImages[slot.id];
                const hasPending = !!pending;
                const isHero = slot.id === 'img-hero';

                return (
                  <div
                    key={slot.id}
                    className={`bg-white border rounded-2xl sm:rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                      isHero ? 'md:col-span-2 border-[#DDD6FE] ring-2 ring-[#5B45B8]/10' : 'border-[#EDEBF0]'
                    }`}
                  >
                    {/* Slot Name & Dimensions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-[#EDEBF0]">
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-[#201A30]">
                          {slot.name}
                        </h4>
                        <div className="text-xs text-[#6E6A82] flex items-center gap-2 mt-0.5">
                          <span className="font-bold text-[#5B45B8]">{slot.ratioLabel}</span>
                          <span>•</span>
                          <span>शिफारस: <strong>{slot.recommendedSize}</strong></span>
                        </div>
                      </div>

                      {hasPending && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          सेव्ह करणे बाकी
                        </span>
                      )}
                    </div>

                    {/* Preview Box */}
                    <div className="space-y-2">
                      <div 
                        className="w-full relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#E5E7EB] border border-[#E5E7EB] flex items-center justify-center"
                        style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto' }}
                      >
                        <img
                          src={currentUrl}
                          alt={slot.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain block"
                          style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto', objectFit: 'contain' }}
                        />
                      </div>

                      {/* Dimension notice */}
                      {pending && (
                        <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#EDEBF0] text-xs flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>निवडलेला फोटो: {pending.width} × {pending.height} px</span>
                          </div>

                          {!pending.ratioMatches && (
                            <button
                              type="button"
                              onClick={() => handleAutoFit(slot)}
                              className="px-2 py-1 rounded-lg bg-white border border-[#DDD6FE] text-[#5B45B8] hover:bg-[#F6F3FF] text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <Crop className="w-3 h-3" />
                              <span>Auto-Fit {slot.ratioLabel}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <input
                        type="file"
                        ref={el => fileInputRefs.current[slot.id] = el}
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileChange(slot, file);
                        }}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[slot.id]?.click()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#FAF9F5] border-2 border-[#DDD6FE] hover:border-[#5B45B8] text-[#201A30] text-xs font-bold transition cursor-pointer shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#5B45B8]" />
                        <span>फोटो बदला</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveSlot(slot)}
                        disabled={savingSlotId === slot.id}
                        className={`inline-flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          hasPending 
                            ? 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-xs' 
                            : 'bg-[#5B45B8] hover:bg-[#4D39A2] text-white'
                        }`}
                      >
                        {savingSlotId === slot.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>सेव्ह होत आहे...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

    </div>
  );
};
