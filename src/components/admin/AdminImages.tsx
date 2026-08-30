import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Crop,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ImageAsset } from '../../types';
import { compressImageFile } from '../../utils/schemeImageUtils';

interface ImageSlotDef {
  id: string;
  purpose: string;
  categoryName: string;
  ratioLabel: string;
  recommendedSize: string;
  targetRatio: number; // e.g. 16/9 = 1.777, 1/1 = 1.0
  defaultUrl: string;
}

const DEFAULT_SLOTS: ImageSlotDef[] = [
  {
    id: 'homepage_hero',
    purpose: 'मुख्यपृष्ठ Hero',
    categoryName: 'मुख्यपृष्ठ (Homepage)',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=85'
  },
  {
    id: 'homepage_women_child',
    purpose: 'लाडकी बहीण / महिला व बाल विकास योजना',
    categoryName: 'योजना (Schemes)',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'homepage_farmer',
    purpose: 'शेतकरी कल्याण / कृषी योजना',
    categoryName: 'योजना (Schemes)',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'homepage_education',
    purpose: 'शिक्षण व शिष्यवृत्ती योजना',
    categoryName: 'योजना (Schemes)',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'homepage_health',
    purpose: 'आरोग्य योजना (महात्मा फुले जन आरोग्य)',
    categoryName: 'योजना (Schemes)',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'category_senior_citizen',
    purpose: 'ज्येष्ठ नागरिक योजना (श्रावणबाळ पेन्शन इ.)',
    categoryName: 'योजना (Schemes)',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'homepage_other_services',
    purpose: 'इतर नागरिक सेवा व महत्त्वाची माहिती',
    categoryName: 'कागदपत्रे व सेवा (Docs & Services)',
    ratioLabel: '16:9 Landscape',
    recommendedSize: '1200 × 675 px',
    targetRatio: 16 / 9,
    defaultUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80'
  }
];

export const AdminImages: React.FC = () => {
  const { images, saveImage, homepageConfig, saveHomepageConfig } = useAdminAuth();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [successToast, setSuccessToast] = useState<string>('');
  const [savingSlotId, setSavingSlotId] = useState<string | null>(null);

  // Stored pending changes per slot
  const [pendingImages, setPendingImages] = useState<{
    [slotId: string]: {
      url: string;
      width: number;
      height: number;
      ratioMatches: boolean;
      ratioDiff: number;
    }
  }>({});

  const fileInputRefs = useRef<{ [slotId: string]: HTMLInputElement | null }>({});

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Get current active URL for a slot
  const getCurrentUrl = (slot: ImageSlotDef): string => {
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

  // Handle File Selection with automatic client-side compression
  const handleFileSelect = async (slot: ImageSlotDef, file: File) => {
    if (!file) return;

    // Check format
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('कृपया केवळ JPG, PNG किंवा WEBP स्वरूपातील फोटो निवडा.');
      return;
    }

    const maxW = slot.id === 'homepage_hero' || slot.id === 'img-hero' ? 1920 : 1200;
    const maxH = slot.id === 'homepage_hero' || slot.id === 'img-hero' ? 1080 : 675;
    
    // Compress and scale down to clean dimensions
    const compressedResult = await compressImageFile(file, maxW, maxH, 0.90);
    if (!compressedResult) return;

    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const actualRatio = width / height;
      const targetRatio = slot.targetRatio;
      const ratioDiff = Math.abs(actualRatio - targetRatio) / targetRatio;
      const ratioMatches = ratioDiff <= 0.08; // within 8% tolerance

      setPendingImages(prev => ({
        ...prev,
        [slot.id]: {
          url: compressedResult,
          width,
          height,
          ratioMatches,
          ratioDiff
        }
      }));
    };
    img.src = compressedResult;
  };

  // Auto-Crop to target aspect ratio helper
  const handleAutoFitRatio = (slot: ImageSlotDef) => {
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

      // Draw image centered and cropped to fill target
      const imgRatio = img.width / img.height;
      const targetR = targetW / targetH;

      let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;
      if (imgRatio > targetR) {
        // Source is wider -> crop sides
        srcW = img.height * targetR;
        srcX = (img.width - srcW) / 2;
      } else {
        // Source is taller -> crop top/bottom
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
          ratioMatches: true,
          ratioDiff: 0
        }
      }));
    };
    img.src = pending.url;
  };

  // Save Image Slot
  const handleSaveSlot = async (slot: ImageSlotDef) => {
    setSavingSlotId(slot.id);
    const finalUrl = getCurrentUrl(slot);

    const asset: ImageAsset = {
      id: slot.id,
      name: slot.purpose,
      url: finalUrl,
      altText: slot.purpose,
      usedIn: slot.purpose,
      fileSize: 'अद्ययावत फोटो',
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    // Save image to admin context
    await saveImage(asset);

    // Also sync paired category/homepage aliases
    const aliasMap: Record<string, string> = {
      'homepage_hero': 'img-hero',
      'img-hero': 'homepage_hero',
      'homepage_women_child': 'category_women',
      'category_women': 'homepage_women_child',
      'homepage_farmer': 'category_farmer',
      'category_farmer': 'homepage_farmer',
      'homepage_education': 'category_education',
      'category_education': 'homepage_education',
      'homepage_health': 'category_health',
      'category_health': 'homepage_health',
      'homepage_other_services': 'category_other_services',
      'category_other_services': 'homepage_other_services'
    };

    const pairedId = aliasMap[slot.id];
    if (pairedId) {
      await saveImage({
        ...asset,
        id: pairedId
      });
    }

    // If hero image, also save directly to homepageConfig & local storage
    if (slot.id === 'homepage_hero' || slot.id === 'img-hero') {
      const updatedConfig = {
        ...homepageConfig,
        heroImage: finalUrl,
        heroImageUrl: finalUrl,
        lastUpdated: new Date().toLocaleDateString('mr-IN')
      };
      await saveHomepageConfig(updatedConfig);
      try {
        localStorage.setItem('mahamahiti_hero_image', finalUrl);
      } catch (e) {}
    }

    // Clear pending state for this slot
    setPendingImages(prev => {
      const copy = { ...prev };
      delete copy[slot.id];
      return copy;
    });

    setSavingSlotId(null);
    showNotification(`"${slot.purpose}" फोटो यशस्वीरित्या सेव्ह झाला!`);
  };

  const filteredSlots = activeCategory === 'all' 
    ? DEFAULT_SLOTS 
    : DEFAULT_SLOTS.filter(s => s.categoryName.includes(activeCategory));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Card */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl sm:rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5B45B8] text-white flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-[#201A30] font-heading">
              फोटो व्यवस्थापन (Simple Image Management)
            </h2>
          </div>
          <p className="text-xs text-[#6E6A82] mt-1.5 max-w-2xl">
            कोणताही तांत्रिक फॉर्म नाही. फक्त <strong>फोटो निवडा → सेव्ह करा</strong>. मुख्यपृष्ठ Hero Banner आणि सर्व फोटो त्वरित बदलले जातील.
          </p>
        </div>

        {/* Quick Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeCategory === 'all' 
                ? 'bg-[#5B45B8] text-white shadow-2xs' 
                : 'bg-white text-[#464255] border border-[#EDEBF0] hover:bg-[#FAF9F5]'
            }`}
          >
            सर्व फोटो ({DEFAULT_SLOTS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('मुख्यपृष्ठ')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeCategory === 'मुख्यपृष्ठ' 
                ? 'bg-[#5B45B8] text-white shadow-2xs' 
                : 'bg-white text-[#464255] border border-[#EDEBF0] hover:bg-[#FAF9F5]'
            }`}
          >
            मुख्यपृष्ठ Hero
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('योजना')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeCategory === 'योजना' 
                ? 'bg-[#5B45B8] text-white shadow-2xs' 
                : 'bg-white text-[#464255] border border-[#EDEBF0] hover:bg-[#FAF9F5]'
            }`}
          >
            योजना फोटो
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Grid of Clean Image Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSlots.map((slot) => {
          const currentUrl = getCurrentUrl(slot);
          const pending = pendingImages[slot.id];
          const hasPendingChange = !!pending;
          const isHero = slot.id === 'img-hero';

          return (
            <div 
              key={slot.id}
              className={`bg-white border rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition ${
                isHero 
                  ? 'md:col-span-2 border-[#DDD6FE] ring-2 ring-[#5B45B8]/10' 
                  : 'border-[#EDEBF0] hover:border-[#DDD6FE]'
              }`}
            >
              {/* Slot Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EDEBF0]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#201A30] font-heading">
                      {slot.purpose}
                    </h3>
                    {isHero && (
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-[#F6F3FF] text-[#5B45B8] border border-[#DDD6FE]">
                        मुख्य बॅनर
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#6E6A82] flex flex-wrap items-center gap-2 mt-1">
                    <span className="font-semibold text-[#5B45B8]">{slot.ratioLabel}</span>
                    <span>•</span>
                    <span>शिफारस आकार: <strong>{slot.recommendedSize}</strong></span>
                  </div>
                </div>

                {hasPendingChange && (
                  <span className="self-start sm:self-auto text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                    बदल सेव्ह करणे बाकी आहे
                  </span>
                )}
              </div>

              {/* IMAGE PREVIEW BOX */}
              <div className="space-y-2">
                <div 
                  className="w-full relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#E5E7EB] border border-[#E5E7EB] flex items-center justify-center"
                  style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto' }}
                >
                  <img 
                    src={currentUrl} 
                    alt={slot.purpose}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain block"
                    style={{ aspectRatio: '16 / 9', width: '100%', height: 'auto', objectFit: 'contain' }}
                  />

                  {/* Ratio badge inside preview */}
                  <div className="absolute top-2.5 left-2.5 bg-[#111827]/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20">
                    {slot.ratioLabel}
                  </div>
                </div>

                {/* Automatic Ratio & Dimension Indicator */}
                {pending && (
                  <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#EDEBF0] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {pending.ratioMatches ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>आकार योग्य आहे ({pending.width} × {pending.height} px)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>गुणोत्तर किंचित वेगळे आहे ({pending.width} × {pending.height} px)</span>
                        </div>
                      )}
                    </div>

                    {/* Quick 1-Click Auto Fit */}
                    {!pending.ratioMatches && (
                      <button
                        type="button"
                        onClick={() => handleAutoFitRatio(slot)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#DDD6FE] text-[#5B45B8] hover:bg-[#F6F3FF] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>स्वयंचलित {slot.ratioLabel} मध्ये फिट करा</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS (फोटो बदला + Save) */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                
                {/* Hidden File Input */}
                <input 
                  type="file"
                  ref={el => fileInputRefs.current[slot.id] = el}
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(slot, file);
                  }}
                  className="hidden"
                />

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[slot.id]?.click()}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border-2 border-[#DDD6FE] hover:border-[#5B45B8] text-[#201A30] text-xs sm:text-sm font-bold transition cursor-pointer shadow-2xs"
                >
                  <Upload className="w-4 h-4 text-[#5B45B8]" />
                  <span>फोटो बदला</span>
                </button>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={() => handleSaveSlot(slot)}
                  disabled={savingSlotId === slot.id}
                  className={`inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer ${
                    hasPendingChange 
                      ? 'bg-[#16A34A] hover:bg-[#15803D] text-white animate-bounce-short' 
                      : 'bg-[#5B45B8] hover:bg-[#4D39A2] text-white'
                  } ${savingSlotId === slot.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {savingSlotId === slot.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>सेव्ह होत आहे...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save करा</span>
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
};
