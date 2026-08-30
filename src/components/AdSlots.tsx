import React from 'react';
import { SITE_CONFIG } from '../data/siteConfig';

interface AdSlotProps {
  className?: string;
  slotId?: string;
}

/**
 * AdSlotTop: Rendered at top of articles/pages.
 * Returns null if AdSense is disabled or not configured to avoid empty layout boxes.
 */
export const AdSlotTop: React.FC<AdSlotProps> = ({ className = '', slotId }) => {
  if (!SITE_CONFIG.adsense.enabled || !SITE_CONFIG.adsense.client) {
    return null;
  }

  const slot = slotId || SITE_CONFIG.adsense.topSlot;
  if (!slot) return null;

  return (
    <div className={`w-full max-w-5xl mx-auto my-4 text-center overflow-hidden min-h-[90px] bg-[#F7F5FF] border border-[#DDD6FE]/40 rounded-xl p-2 ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-[#6E6A82] block mb-1">जाहिरात (Ad)</span>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={SITE_CONFIG.adsense.client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

/**
 * AdSlotContent: Rendered in-between content sections.
 * Returns null if AdSense is disabled.
 */
export const AdSlotContent: React.FC<AdSlotProps> = ({ className = '', slotId }) => {
  if (!SITE_CONFIG.adsense.enabled || !SITE_CONFIG.adsense.client) {
    return null;
  }

  const slot = slotId || SITE_CONFIG.adsense.contentSlot;
  if (!slot) return null;

  return (
    <div className={`w-full my-6 text-center overflow-hidden min-h-[90px] bg-[#F7F5FF] border border-[#DDD6FE]/40 rounded-xl p-2 ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-[#6E6A82] block mb-1">जाहिरात (Ad)</span>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={SITE_CONFIG.adsense.client}
        data-ad-slot={slot}
        data-ad-format="fluid"
        data-ad-layout-key="-fb+5w+4e-db+86"
      />
    </div>
  );
};

/**
 * AdSlotBottom: Rendered before the footer.
 * Returns null if AdSense is disabled.
 */
export const AdSlotBottom: React.FC<AdSlotProps> = ({ className = '', slotId }) => {
  if (!SITE_CONFIG.adsense.enabled || !SITE_CONFIG.adsense.client) {
    return null;
  }

  const slot = slotId || SITE_CONFIG.adsense.bottomSlot;
  if (!slot) return null;

  return (
    <div className={`w-full max-w-5xl mx-auto mt-8 mb-4 text-center overflow-hidden min-h-[90px] bg-[#F7F5FF] border border-[#DDD6FE]/40 rounded-xl p-2 ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-[#6E6A82] block mb-1">जाहिरात (Ad)</span>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={SITE_CONFIG.adsense.client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
