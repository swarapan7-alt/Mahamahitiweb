import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ImageAsset } from '../../types';
import { DEFAULT_CATEGORY_IMAGES } from '../../utils/schemeImageUtils';

interface HomepageImageSlot {
  id: string;
  title: string;
  subtitle: string;
  recommendedSize: string;
  aspectRatio: string;
  defaultUrl: string;
  homepageMapping: string;
  aliases: string[];
}

const HOMEPAGE_IMAGE_SLOTS: HomepageImageSlot[] = [
  {
    id: 'homepage_hero',
    title: 'मुख्य Hero Image',
    subtitle: 'Homepage Main Hero • 16:9 • Recommended: 1920 × 1080 px',
    recommendedSize: '1920 × 1080 px',
    aspectRatio: '16:9',
    defaultUrl: DEFAULT_CATEGORY_IMAGES.hero,
    homepageMapping: 'Homepage Hero Banner',
    aliases: ['img-hero', 'homepage_hero']
  },
  {
    id: 'category_women',
    title: 'महिलांसाठी योजना',
    subtitle: 'महिलांसाठी • 16:9 • Recommended: 1280 × 720 px',
    recommendedSize: '1280 × 720 px',
    aspectRatio: '16:9',
    defaultUrl: DEFAULT_CATEGORY_IMAGES.women,
    homepageMapping: 'Homepage Women Category Image',
    aliases: ['homepage_women_child', 'category_women']
  },
  {
    id: 'category_farmer',
    title: 'शेतकऱ्यांसाठी योजना',
    subtitle: 'शेतकऱ्यांसाठी • 16:9 • Recommended: 1280 × 720 px',
    recommendedSize: '1280 × 720 px',
    aspectRatio: '16:9',
    defaultUrl: DEFAULT_CATEGORY_IMAGES.farmer,
    homepageMapping: 'Homepage Farmer Category Image',
    aliases: ['homepage_farmer', 'category_farmer']
  },
  {
    id: 'category_education',
    title: 'विद्यार्थ्यांसाठी योजना',
    subtitle: 'विद्यार्थ्यांसाठी • 16:9 • Recommended: 1280 × 720 px',
    recommendedSize: '1280 × 720 px',
    aspectRatio: '16:9',
    defaultUrl: DEFAULT_CATEGORY_IMAGES.education,
    homepageMapping: 'Homepage Student Category Image',
    aliases: ['homepage_education', 'category_education']
  },
  {
    id: 'category_worker',
    title: 'कामगारांसाठी योजना',
    subtitle: 'कामगारांसाठी • 16:9 • Recommended: 1280 × 720 px',
    recommendedSize: '1280 × 720 px',
    aspectRatio: '16:9',
    defaultUrl: DEFAULT_CATEGORY_IMAGES.worker,
    homepageMapping: 'Homepage Worker Category Image',
    aliases: ['homepage_worker', 'category_worker']
  },
  {
    id: 'category_senior_citizen',
    title: 'ज्येष्ठ नागरिकांसाठी योजना',
    subtitle: 'ज्येष्ठ नागरिकांसाठी • 16:9 • Recommended: 1280 × 720 px',
    recommendedSize: '1280 × 720 px',
    aspectRatio: '16:9',
    defaultUrl: DEFAULT_CATEGORY_IMAGES.senior_citizen,
    homepageMapping: 'Homepage Senior Citizen Category Image',
    aliases: ['homepage_senior', 'category_senior_citizen']
  }
];

export const AdminImages: React.FC = () => {
  const { images, uploadImageSlot, homepageConfig, getImageByKey } = useAdminAuth();

  const [successToast, setSuccessToast] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [savingSlotId, setSavingSlotId] = useState<string | null>(null);

  // Stored pending selected image data per slot before saving
  const [pendingImages, setPendingImages] = useState<{
    [slotId: string]: string;
  }>({});

  const fileInputRefs = useRef<{ [slotId: string]: HTMLInputElement | null }>({});

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setErrorMessage('');
    setTimeout(() => setSuccessToast(''), 5000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 6000);
  };

  // Get currently displayed URL for each slot
  const getSlotImageUrl = (slot: HomepageImageSlot): string => {
    // 1. If user just selected a new image (pending save)
    if (pendingImages[slot.id]) {
      return pendingImages[slot.id];
    }
    // 2. Check context / persistent image lookup
    return getImageByKey(slot.id, slot.defaultUrl);
  };

  // Handle file selection and prepare client data
  const handleFileSelect = (slot: HomepageImageSlot, file: File) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('कृपया केवळ JPG, PNG किंवा WEBP स्वरूपातील फोटो निवडा.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      // Clean compression to ensure reliable storage without distortion or tint
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = slot.id === 'homepage_hero' ? 1920 : 1280;
        const maxH = slot.id === 'homepage_hero' ? 1080 : 720;
        
        let targetW = img.width;
        let targetH = img.height;

        if (targetW > maxW || targetH > maxH) {
          const ratio = Math.min(maxW / targetW, maxH / targetH);
          targetW = Math.round(targetW * ratio);
          targetH = Math.round(targetH * ratio);
        }

        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetW, targetH);
          const finalDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          setPendingImages(prev => ({
            ...prev,
            [slot.id]: finalDataUrl
          }));
        } else {
          setPendingImages(prev => ({
            ...prev,
            [slot.id]: dataUrl
          }));
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Save changes to persistent backend storage + adminStore + homepageConfig
  const handleSaveSlot = async (slot: HomepageImageSlot) => {
    const pendingData = pendingImages[slot.id];
    if (!pendingData) {
      showNotification('हा फोटो आधीच अद्ययावत व सेव्ह केलेला आहे.');
      return;
    }

    setSavingSlotId(slot.id);
    setErrorMessage('');

    try {
      const res = await uploadImageSlot(slot.id, pendingData, {
        name: slot.title,
        altText: slot.title,
        recommendedSize: slot.recommendedSize,
        usedIn: slot.homepageMapping
      });

      if (res.success && res.url) {
        // Clear pending state for this slot
        setPendingImages(prev => {
          const copy = { ...prev };
          delete copy[slot.id];
          return copy;
        });
        showNotification(`“${slot.title}” फोटो यशस्वीरित्या सेव्ह झाला व मुख्यपृष्ठावर त्वरित लागू झाला!`);
      } else {
        showError(res.error || 'इमेज सेव्ह करण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.');
      }
    } catch (err: any) {
      showError(err?.message || 'अपलोड अयशस्वी झाला.');
    } finally {
      setSavingSlotId(null);
    }
  };

  const heroSlot = HOMEPAGE_IMAGE_SLOTS[0];
  const categorySlots = HOMEPAGE_IMAGE_SLOTS.slice(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5B45C6] text-white flex items-center justify-center shadow-2xs">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033] font-heading">
              Simple Image Management
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] font-medium mt-0.5">
              Upload and manage the images used on the MahaMahiti.com homepage.
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Error Notification Toast */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. MAIN HERO IMAGE CARD                                   */}
      {/* ========================================================= */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#5B45C6]" />
          <h3 className="text-base font-extrabold text-[#172033] font-heading">
            १. मुख्य Hero Image
          </h3>
        </div>

        {(() => {
          const currentUrl = getSlotImageUrl(heroSlot);
          const hasPendingChange = !!pendingImages[heroSlot.id];

          return (
            <div className="bg-white border-2 border-[#DCD8EC] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs hover:border-[#5B45C6] transition-all space-y-4">
              
              {/* Card Header & Dimensions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E5F2]">
                <div>
                  <h4 className="text-lg font-extrabold text-[#172033] font-heading">
                    {heroSlot.title}
                  </h4>
                  <p className="text-xs text-[#5B45C6] font-bold mt-0.5">
                    {heroSlot.subtitle}
                  </p>
                </div>

                {hasPendingChange && (
                  <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                    बदल सेव्ह करणे बाकी आहे
                  </span>
                )}
              </div>

              {/* 16:9 Image Preview */}
              <div className="w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden bg-[#F0EEF8] border border-[#E8E5F2] relative shadow-2xs">
                <img
                  src={currentUrl}
                  alt={heroSlot.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* 16:9 Ratio Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg border border-white/20 shadow-xs">
                  {heroSlot.aspectRatio} Landscape
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <input
                  type="file"
                  ref={el => fileInputRefs.current[heroSlot.id] = el}
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(heroSlot, file);
                  }}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[heroSlot.id]?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF9FD] hover:bg-[#F2EFFD] border-2 border-[#DCD8EC] hover:border-[#5B45C6] text-[#172033] text-xs sm:text-sm font-bold transition cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-4 h-4 text-[#5B45C6]" />
                    <span>नवीन इमेज अपलोड करा</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[heroSlot.id]?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F2EFFD] border border-[#DCD8EC] text-[#5B45C6] text-xs sm:text-sm font-bold transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Upload & Replace</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveSlot(heroSlot)}
                  disabled={savingSlotId === heroSlot.id}
                  className={`inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer ${
                    hasPendingChange 
                      ? 'bg-[#16834B] hover:bg-[#12643A] text-white shadow-md animate-bounce-short' 
                      : 'bg-[#5B45C6] hover:bg-[#43319E] text-white'
                  } ${savingSlotId === heroSlot.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {savingSlotId === heroSlot.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>सेव्ह होत आहे...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })()}
      </div>

      {/* ========================================================= */}
      {/* 2. FIVE HOMEPAGE CATEGORY IMAGES                          */}
      {/* ========================================================= */}
      <div className="space-y-4 pt-4 border-t border-[#EDEBF0]">
        <div>
          <h3 className="text-base font-extrabold text-[#172033] font-heading">
            २. मुख्यपृष्ठ ५ वर्गवारी फोटो (16:9 Category Images)
          </h3>
          <p className="text-xs text-[#6B7280] font-medium mt-0.5">
            मुख्यपृष्ठावरील पाच प्रमुख वर्गवारी कार्ड्ससाठीचे अधिकृत फोटो व्यवस्थापित करा.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categorySlots.map((slot) => {
            const currentUrl = getSlotImageUrl(slot);
            const hasPendingChange = !!pendingImages[slot.id];

            return (
              <div 
                key={slot.id}
                className="bg-white border-2 border-[#E8E5F2] hover:border-[#5B45C6] rounded-2xl p-4 sm:p-5 shadow-2xs transition-all flex flex-col justify-between space-y-3.5"
              >
                {/* Header info */}
                <div className="space-y-1 pb-2 border-b border-[#E8E5F2]">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-extrabold text-[#172033] font-heading">
                      {slot.title}
                    </h4>
                    {hasPendingChange && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#4B5567] flex items-center justify-between">
                    <span className="font-semibold text-[#5B45C6]">प्रमाण: {slot.aspectRatio}</span>
                    <span>शिफारस: <strong>{slot.recommendedSize}</strong></span>
                  </div>
                </div>

                {/* 16:9 Image Preview Box */}
                <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#F3F1FA] border border-[#E8E5F2] relative shadow-2xs">
                  <img
                    src={currentUrl}
                    alt={slot.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
                    {slot.aspectRatio}
                  </div>
                </div>

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

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[slot.id]?.click()}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF9FD] hover:bg-[#F2EFFD] border border-[#DCD8EC] text-[#172033] text-xs font-bold transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#5B45C6]" />
                      <span>नवीन फोटो</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[slot.id]?.click()}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-[#F2EFFD] border border-[#DCD8EC] text-[#5B45C6] text-xs font-bold transition cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Replace</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveSlot(slot)}
                    disabled={savingSlotId === slot.id}
                    className={`w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer ${
                      hasPendingChange 
                        ? 'bg-[#16834B] hover:bg-[#12643A] text-white shadow-sm font-extrabold' 
                        : 'bg-[#5B45C6] hover:bg-[#43319E] text-white'
                    } ${savingSlotId === slot.id ? 'opacity-60 cursor-not-allowed' : ''}`}
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

    </div>
  );
};
