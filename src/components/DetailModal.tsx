import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  Share2, 
  AlertCircle,
  Copy,
  Check,
  CheckSquare,
  Square,
  Sparkles,
  FileCheck2,
  Gift,
  Target,
  Info
} from 'lucide-react';
import { Scheme, DocumentInfo, GovernmentService, LoanScheme } from '../types';
import { SCHEMES_DATA } from '../data/schemes';
import { DOCUMENTS_DATA } from '../data/documents';
import { SERVICES_DATA } from '../data/services';
import { LOAN_SCHEMES_DATA } from '../data/loanSchemes';
import { UPDATES_DATA } from '../data/updates';
import { generateCleanShareText, copyTextToClipboard, openWhatsAppShare } from '../utils/shareUtils';

interface DetailModalProps {
  item: Scheme | DocumentInfo | GovernmentService | LoanScheme | any | null;
  type: 'scheme' | 'document' | 'service' | 'loan' | 'update' | null;
  onClose: () => void;
  onOpenWhatsAppShare?: (item: any) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  type,
  onClose,
  onOpenWhatsAppShare
}) => {
  const [copied, setCopied] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<{ [key: string]: boolean }>({});

  // 1. Resolve canonical reference item from authoritative data files if needed
  const resolvedCanonical = useMemo(() => {
    if (!item) return null;
    const itemId = item.id;
    const itemSlug = 'slug' in item ? item.slug : undefined;
    const itemTitle = item.title;

    if (type === 'scheme') {
      const match = SCHEMES_DATA.find(s => (itemId && s.id === itemId) || (itemSlug && s.slug === itemSlug) || (itemTitle && s.title === itemTitle));
      if (match) return match;
    } else if (type === 'document') {
      const match = DOCUMENTS_DATA.find(d => (itemId && d.id === itemId) || (itemSlug && d.slug === itemSlug) || (itemTitle && d.title === itemTitle));
      if (match) return match;
    } else if (type === 'service') {
      const match = SERVICES_DATA.find(srv => (itemId && srv.id === itemId) || (itemSlug && srv.slug === itemSlug) || (itemTitle && srv.title === itemTitle));
      if (match) return match;
    } else if (type === 'loan') {
      const match = LOAN_SCHEMES_DATA.find(l => (itemId && l.id === itemId) || (itemSlug && l.slug === itemSlug) || (itemTitle && l.title === itemTitle));
      if (match) return match;
    } else if (type === 'update') {
      const match = UPDATES_DATA.find(u => (itemId && u.id === itemId) || (itemTitle && u.title === itemTitle));
      if (match) return match;
    }

    // Global cross-dataset fallback resolution
    return (
      SCHEMES_DATA.find(s => (itemId && s.id === itemId) || (itemSlug && s.slug === itemSlug) || (itemTitle && s.title === itemTitle)) ||
      DOCUMENTS_DATA.find(d => (itemId && d.id === itemId) || (itemSlug && d.slug === itemSlug) || (itemTitle && d.title === itemTitle)) ||
      SERVICES_DATA.find(srv => (itemId && srv.id === itemId) || (itemSlug && srv.slug === itemSlug) || (itemTitle && srv.title === itemTitle)) ||
      LOAN_SCHEMES_DATA.find(l => (itemId && l.id === itemId) || (itemSlug && l.slug === itemSlug) || (itemTitle && l.title === itemTitle)) ||
      UPDATES_DATA.find(u => (itemId && u.id === itemId) || (itemTitle && u.title === itemTitle)) ||
      null
    );
  }, [item, type]);

  if (!item) return null;

  // 2. Comprehensive, prioritized extraction of the main detailed description
  const rawDescription = 
    (typeof item.description === 'string' && item.description.trim() ? item.description.trim() : '') ||
    (typeof (item as any).details === 'string' && (item as any).details.trim() ? (item as any).details.trim() : '') ||
    (typeof (item as any).content === 'string' && (item as any).content.trim() ? (item as any).content.trim() : '') ||
    (typeof (item as any).loanDetails === 'string' && (item as any).loanDetails.trim() ? (item as any).loanDetails.trim() : '') ||
    (typeof item.shortDescription === 'string' && item.shortDescription.trim() ? item.shortDescription.trim() : '') ||
    (typeof (item as any).about === 'string' && (item as any).about.trim() ? (item as any).about.trim() : '') ||
    (typeof (item as any).overview === 'string' && (item as any).overview.trim() ? (item as any).overview.trim() : '') ||
    (typeof (item as any).information === 'string' && (item as any).information.trim() ? (item as any).information.trim() : '') ||
    (typeof (item as any).summary === 'string' && (item as any).summary.trim() ? (item as any).summary.trim() : '') ||
    (typeof (item as any).schemeDescription === 'string' && (item as any).schemeDescription.trim() ? (item as any).schemeDescription.trim() : '') ||
    (typeof (item as any).documentDescription === 'string' && (item as any).documentDescription.trim() ? (item as any).documentDescription.trim() : '') ||
    (resolvedCanonical && typeof (resolvedCanonical as any).description === 'string' && (resolvedCanonical as any).description.trim() ? (resolvedCanonical as any).description.trim() : '') ||
    (resolvedCanonical && typeof (resolvedCanonical as any).shortDescription === 'string' && (resolvedCanonical as any).shortDescription.trim() ? (resolvedCanonical as any).shortDescription.trim() : '') ||
    (resolvedCanonical && typeof (resolvedCanonical as any).loanDetails === 'string' && (resolvedCanonical as any).loanDetails.trim() ? (resolvedCanonical as any).loanDetails.trim() : '') ||
    (resolvedCanonical && typeof (resolvedCanonical as any).content === 'string' && (resolvedCanonical as any).content.trim() ? (resolvedCanonical as any).content.trim() : '') ||
    (resolvedCanonical && typeof (resolvedCanonical as any).details === 'string' && (resolvedCanonical as any).details.trim() ? (resolvedCanonical as any).details.trim() : '');

  const mainDescription = rawDescription || 'या विषयाची माहिती लवकरच उपलब्ध होईल.';

  // 3. Extract purpose if explicitly available
  const explicitPurpose = 
    (typeof (item as any).purpose === 'string' && (item as any).purpose.trim() ? (item as any).purpose.trim() : '') ||
    (resolvedCanonical && typeof (resolvedCanonical as any).purpose === 'string' && (resolvedCanonical as any).purpose.trim() ? (resolvedCanonical as any).purpose.trim() : '') ||
    null;

  // 4. Section Title Heading based on type
  const sectionHeading = 
    type === 'document' ? 'कागदपत्राबद्दल थोडक्यात' :
    type === 'service' ? 'शासकीय सेवेबद्दल थोडक्यात' :
    type === 'loan' ? 'कर्ज योजनेबद्दल थोडक्यात' :
    type === 'update' ? 'अद्ययावत माहिती व तपशील' :
    'योजनेबद्दल थोडक्यात';

  // 5. Category label & Title
  const itemTitle = item.title || (resolvedCanonical && resolvedCanonical.title) || 'शासकीय माहिती';
  const categoryLabel = 
    item.categoryLabel || 
    (resolvedCanonical && (resolvedCanonical as any).categoryLabel) || 
    (type === 'document' ? 'कागदपत्र / दाखला' : type === 'service' ? 'शासकीय सेवा' : type === 'loan' ? 'कर्ज योजना' : 'नागरिक माहिती');

  // 6. Benefits List
  const benefitsList: string[] = 
    (Array.isArray((item as any).benefits) && (item as any).benefits.length > 0 ? (item as any).benefits : null) ||
    (Array.isArray((item as any).keyBenefits) && (item as any).keyBenefits.length > 0 ? (item as any).keyBenefits : null) ||
    (Array.isArray((item as any).features) && (item as any).features.length > 0 ? (item as any).features : null) ||
    (resolvedCanonical && Array.isArray((resolvedCanonical as any).benefits) && (resolvedCanonical as any).benefits.length > 0 ? (resolvedCanonical as any).benefits : []) ||
    [];

  // 7. Eligibility List
  const eligibilityList: string[] = 
    (Array.isArray((item as any).eligibility) && (item as any).eligibility.length > 0 ? (item as any).eligibility : null) ||
    (Array.isArray((item as any).criteria) && (item as any).criteria.length > 0 ? (item as any).criteria : null) ||
    (Array.isArray((item as any).eligibilityCriteria) && (item as any).eligibilityCriteria.length > 0 ? (item as any).eligibilityCriteria : null) ||
    (resolvedCanonical && Array.isArray((resolvedCanonical as any).eligibility) && (resolvedCanonical as any).eligibility.length > 0 ? (resolvedCanonical as any).eligibility : []) ||
    [];

  // 8. Target Audience
  const targetAudience: string = 
    ((item as any).targetAudience ? (item as any).targetAudience : '') ||
    ((item as any).forWhom ? (item as any).forWhom : '') ||
    ((item as any).beneficiary ? (item as any).beneficiary : '') ||
    (resolvedCanonical && (resolvedCanonical as any).targetAudience ? (resolvedCanonical as any).targetAudience : '') ||
    (resolvedCanonical && (resolvedCanonical as any).forWhom ? (resolvedCanonical as any).forWhom : '') ||
    '';

  // 9. Required Documents Checklist
  const requiredDocs: string[] = 
    (Array.isArray((item as any).documentsRequired) && (item as any).documentsRequired.length > 0 ? (item as any).documentsRequired : null) ||
    (Array.isArray((item as any).requiredDocuments) && (item as any).requiredDocuments.length > 0 ? (item as any).requiredDocuments : null) ||
    (Array.isArray((item as any).requiredSupportingDocs) && (item as any).requiredSupportingDocs.length > 0 ? (item as any).requiredSupportingDocs : null) ||
    (resolvedCanonical && Array.isArray((resolvedCanonical as any).documentsRequired) && (resolvedCanonical as any).documentsRequired.length > 0 ? (resolvedCanonical as any).documentsRequired : []) ||
    (resolvedCanonical && Array.isArray((resolvedCanonical as any).requiredDocuments) && (resolvedCanonical as any).requiredDocuments.length > 0 ? (resolvedCanonical as any).requiredDocuments : []) ||
    [];

  // 10. FAQs List
  const faqsList = 
    (Array.isArray(item.faqs) && item.faqs.length > 0 ? item.faqs : null) ||
    (resolvedCanonical && Array.isArray((resolvedCanonical as any).faqs) && (resolvedCanonical as any).faqs.length > 0 ? (resolvedCanonical as any).faqs : []) ||
    [];

  // 11. Loan specifics
  const loanMaxAmount = (item as any).maxAmount || (resolvedCanonical && (resolvedCanonical as any).maxAmount) || null;
  const loanSubsidyOrInterest = (item as any).subsidyOrInterest || (resolvedCanonical && (resolvedCanonical as any).subsidyOrInterest) || null;

  // 12. Official Source & Verification Year
  const officialSource = (item as any).officialSourceName || (item as any).officialSource || (resolvedCanonical && (resolvedCanonical as any).officialSourceName) || 'महाराष्ट्र शासन / भारत सरकार';
  const verifiedAt = (item as any).lastVerifiedAt || (item as any).lastVerified || (resolvedCanonical && (resolvedCanonical as any).lastVerifiedAt) || '२०२६';

  // Hydrated full item for Copy and WhatsApp sharing
  const fullHydratedItem = {
    ...resolvedCanonical,
    ...item,
    title: itemTitle,
    categoryLabel,
    description: mainDescription,
    shortDescription: item.shortDescription || (resolvedCanonical && (resolvedCanonical as any).shortDescription) || mainDescription,
    benefits: benefitsList,
    eligibility: eligibilityList,
    targetAudience,
    documentsRequired: requiredDocs,
    purpose: explicitPurpose,
    maxAmount: loanMaxAmount,
    subsidyOrInterest: loanSubsidyOrInterest,
    officialSourceName: officialSource,
    lastVerifiedAt: verifiedAt,
  };

  const toggleDoc = (docName: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docName]: !prev[docName]
    }));
  };

  const handleCopy = async () => {
    const text = generateCleanShareText(fullHydratedItem);
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    if (onOpenWhatsAppShare) {
      onOpenWhatsAppShare(fullHydratedItem);
    } else {
      const text = generateCleanShareText(fullHydratedItem);
      openWhatsAppShare(text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl bg-[#FAF9FD] border-2 border-[#E8E5F2] rounded-3xl sm:rounded-[32px] shadow-[0_24px_70px_rgba(23,32,51,0.2)] overflow-hidden my-6 flex flex-col max-h-[92vh] text-[#172033]">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md p-5 sm:p-6 flex items-start justify-between gap-4 border-b-2 border-[#E8E5F2]">
          <div className="space-y-1.5 flex-1 pr-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-[#F2EFFD] text-[#5B45C6] border border-[#DCD8EC] font-bold">
                {categoryLabel}
              </span>
              <span className="text-xs text-[#15966A] flex items-center gap-1 font-bold bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#BBF7D0]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#15966A]" />
                सत्यापित शासकीय माहिती
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight font-heading leading-snug">
              {itemTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#FAF9FD] hover:bg-[#F2EFFD] text-[#4B5567] hover:text-[#172033] transition shrink-0 cursor-pointer border border-[#E8E5F2]"
            aria-label="बंद करा"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 text-[#4B5567]">

          {/* 1. Brief Overview / Main Description */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#172033] mb-2.5 flex items-center gap-2 font-heading">
              <Info className="w-5 h-5 text-[#5B45C6]" />
              {sectionHeading}
            </h3>
            <div className="bg-white p-5 rounded-2xl border-2 border-[#E8E5F2] text-sm sm:text-base text-[#172033] leading-relaxed font-medium">
              <p>{mainDescription}</p>

              {/* Explicit Purpose if available */}
              {explicitPurpose && (
                <div className="mt-3 pt-3 border-t border-[#E8E5F2] text-[#5B45C6] flex items-start gap-2 text-xs sm:text-sm">
                  <Target className="w-4 h-4 shrink-0 mt-0.5" />
                  <span><strong>उद्देश:</strong> {explicitPurpose}</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Key Benefits */}
          {(benefitsList.length > 0 || loanMaxAmount) && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#172033] mb-2.5 flex items-center gap-2 font-heading">
                <Gift className="w-5 h-5 text-[#15966A]" />
                मिळणारे प्रमुख लाभ
              </h3>
              <div className="bg-white p-5 rounded-2xl border-2 border-[#E8E5F2] text-sm sm:text-base font-medium space-y-3">
                {loanMaxAmount && (
                  <div className="p-3.5 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] text-[#12643A] text-xs sm:text-sm mb-2">
                    <span className="font-bold">कर्ज मर्यादा व सवलत:</span> {loanMaxAmount}
                    {loanSubsidyOrInterest && ` (${loanSubsidyOrInterest})`}
                  </div>
                )}

                {benefitsList.length > 0 && (
                  <ul className="space-y-2.5">
                    {benefitsList.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[#172033]">
                        <CheckCircle2 className="w-5 h-5 text-[#15966A] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* 3. Eligibility & Target Audience */}
          {(eligibilityList.length > 0 || targetAudience) && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#172033] mb-2.5 flex items-center gap-2 font-heading">
                <Sparkles className="w-5 h-5 text-[#3157B7]" />
                पात्रता व अटी (कोणासाठी आहे?)
              </h3>
              <div className="bg-white p-5 rounded-2xl border-2 border-[#E8E5F2] text-sm sm:text-base font-medium space-y-3">
                {targetAudience && (
                  <div className="p-3 bg-[#EFF6FF] rounded-xl border border-[#BFDBFE] text-[#1E40AF] text-xs sm:text-sm font-semibold">
                    पात्र लाभार्थी गट: {targetAudience}
                  </div>
                )}

                {eligibilityList.length > 0 && (
                  <ul className="space-y-2.5 pt-1">
                    {eligibilityList.map((e, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[#4B5567]">
                        <span className="w-2 h-2 rounded-full bg-[#3157B7] mt-2 shrink-0" />
                        <span className="leading-relaxed text-[#172033]">{e}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* 4. Required Documents Checklist */}
          {requiredDocs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-base sm:text-lg font-bold text-[#172033] flex items-center gap-2 font-heading">
                  <FileCheck2 className="w-5 h-5 text-[#5B45C6]" />
                  आवश्यक कागदपत्रे / माहिती
                </h3>
                <span className="text-xs text-[#6B7280] font-medium">
                  (उपलब्ध कागदपत्रांवर टिक करा)
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-[#E8E5F2] space-y-2.5">
                {requiredDocs.map((doc, idx) => {
                  const isChecked = !!checkedDocs[doc];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleDoc(doc)}
                      className={`p-3.5 rounded-xl border-2 text-xs sm:text-sm cursor-pointer select-none transition flex items-center gap-3 font-medium ${
                        isChecked 
                          ? 'bg-[#F2EFFD] border-[#DCD8EC] text-[#172033]' 
                          : 'bg-[#FAF9FD] border-[#E8E5F2] text-[#172033] hover:border-[#5B45C6]'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#5B45C6] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                      )}
                      <span className={isChecked ? 'line-through text-[#6B7280]' : 'text-[#172033]'}>
                        {doc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. FAQs */}
          {faqsList.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#172033] mb-2.5 flex items-center gap-2 font-heading">
                <HelpCircle className="w-5 h-5 text-[#EA580C]" />
                वारंवार विचारले जाणारे प्रश्न (FAQ)
              </h3>
              <div className="space-y-2.5">
                {faqsList.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border-2 border-[#E8E5F2]">
                    <h4 className="text-xs sm:text-sm font-bold text-[#172033] mb-1 font-heading">
                      प्रश्न: {faq.question}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4B5567] leading-relaxed font-medium">
                      उत्तर: {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. MANDATORY STANDARD CITIZEN GUIDANCE NOTICE (HIGHLIGHTED BOX) */}
          <div className="bg-[#FFF7ED] rounded-2xl sm:rounded-3xl p-5 border-2 border-[#FED7AA] flex items-start gap-3.5 shadow-xs">
            <AlertCircle className="w-6 h-6 text-[#EA580C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-extrabold text-[#9A3412] block text-sm sm:text-base font-heading">
                नागरिक मार्गदर्शन सूचना:
              </strong>
              <p className="text-xs sm:text-sm font-bold text-[#7C2D12] leading-relaxed">
                या योजनेची पूर्ण व अद्ययावत माहिती, पात्रता व आवश्यक मार्गदर्शनासाठी आपल्या जवळच्या CSC सेंटर किंवा ई-सेवा केंद्राला भेट द्या.
              </p>
            </div>
          </div>

          {/* 7. Verified Source Information (No direct portal links) */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8E5F2] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7280] font-medium">
            <div>
              <span>अधिकृत संदर्भ:</span> <strong className="text-[#172033]">{officialSource}</strong>
            </div>
            <div>
              <span>सत्यापन वर्ष:</span> <strong className="text-[#172033]">{verifiedAt}</strong>
            </div>
          </div>

        </div>

        {/* Modal Footer Action Buttons */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-t-2 border-[#E8E5F2] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-xl bg-[#FAF9FD] hover:bg-[#F2EFFD] border-2 border-[#E8E5F2] hover:border-[#5B45C6] text-xs sm:text-sm font-bold text-[#172033] transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-[#15966A]" /> : <Copy className="w-4 h-4 text-[#5B45C6]" />}
            <span>{copied ? 'माहिती कॉपी झाली!' : 'माहिती कॉपी करा'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleWhatsApp}
              className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-xs hover:shadow-md cursor-pointer hover:scale-102"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp वर शेअर करा</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#FAF9FD] hover:bg-[#F2EFFD] text-[#4B5567] hover:text-[#172033] font-bold text-xs sm:text-sm transition cursor-pointer border border-[#E8E5F2]"
            >
              बंद करा
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

