/**
 * Clean Share & Copy Utility for MahaMahiti.com (Citizen Information Platform)
 * Ensures zero application portal links, zero application step-by-step instructions,
 * and standard CSC/e-Seva Center citizen guidance.
 */

export const generateCleanShareText = (item: any): string => {
  if (!item) return '';

  const lines: string[] = [];

  // 1. Title & Header
  lines.push(`📋 *${item.title || 'शासकीय माहिती'}*`);
  if (item.categoryLabel) {
    lines.push(`📌 वर्गवारी: ${item.categoryLabel}`);
  }
  lines.push('');

  // 2. Overview / Detailed Information
  const descriptionText = 
    (typeof item.description === 'string' && item.description.trim() ? item.description.trim() : '') ||
    (typeof item.shortDescription === 'string' && item.shortDescription.trim() ? item.shortDescription.trim() : '') ||
    (typeof item.loanDetails === 'string' && item.loanDetails.trim() ? item.loanDetails.trim() : '') ||
    (typeof item.details === 'string' && item.details.trim() ? item.details.trim() : '') ||
    (typeof item.content === 'string' && item.content.trim() ? item.content.trim() : '') ||
    (typeof item.about === 'string' && item.about.trim() ? item.about.trim() : '');

  if (descriptionText) {
    lines.push(`📖 *माहिती:* ${descriptionText}`);
    lines.push('');
  }

  // 3. Purpose (if explicit)
  if (item.purpose && typeof item.purpose === 'string' && item.purpose.trim()) {
    lines.push(`🎯 *उद्देश:* ${item.purpose.trim()}`);
    lines.push('');
  }

  // 4. Key Benefits
  const benefits = item.benefits || item.keyBenefits || item.features || [];
  if (Array.isArray(benefits) && benefits.length > 0) {
    lines.push(`🎁 *मुख्य लाभ:*`);
    benefits.forEach((b: string) => {
      lines.push(`• ${b}`);
    });
    lines.push('');
  } else if (item.maxAmount) {
    lines.push(`🎁 *कर्ज मर्यादा व लाभ:* ${item.maxAmount}`);
    if (item.subsidyOrInterest) {
      lines.push(`• व्याज सवलत / अनुदान: ${item.subsidyOrInterest}`);
    }
    lines.push('');
  }

  // 5. Eligibility / Target Audience
  const eligibility = item.eligibility || item.criteria || item.eligibilityCriteria || [];
  if (Array.isArray(eligibility) && eligibility.length > 0) {
    lines.push(`✅ *पात्रता व निकष:*`);
    eligibility.forEach((e: string) => {
      lines.push(`• ${e}`);
    });
    lines.push('');
  } else if (item.targetAudience || item.forWhom) {
    lines.push(`✅ *पात्र लाभार्थी:* ${item.targetAudience || item.forWhom}`);
    lines.push('');
  }

  // 6. Required Documents / Information
  const docs = item.documentsRequired || item.requiredDocuments || item.requiredSupportingDocs || [];
  if (Array.isArray(docs) && docs.length > 0) {
    lines.push(`📁 *आवश्यक कागदपत्रे / माहिती:*`);
    docs.forEach((d: string) => {
      lines.push(`• ${d}`);
    });
    lines.push('');
  }

  // 7. Standard CSC / e-Seva Center Citizen Guidance
  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`ℹ️ *नागरिक मार्गदर्शन:*`);
  lines.push(`या योजनेची पूर्ण व अद्ययावत माहिती, पात्रता व आवश्यक मार्गदर्शनासाठी आपल्या जवळच्या CSC सेंटर किंवा ई-सेवा केंद्राला भेट द्या.`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`(माहिती स्रोत: MahaMahiti.com)`);

  return lines.join('\n');
};

export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export const openWhatsAppShare = (text: string, phone?: string) => {
  const encoded = encodeURIComponent(text);
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  const url = cleanPhone
    ? `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encoded}`
    : `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(url, '_blank');
};
