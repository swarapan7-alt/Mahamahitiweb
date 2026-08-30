import React from 'react';

interface MahaMahitiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  customSize?: number;
}

export const MahaMahitiLogo: React.FC<MahaMahitiLogoProps> = ({
  className = '',
  size = 'md',
  customSize
}) => {
  // Responsive sizing classes
  let dimClass = 'w-12 h-12';
  if (size === 'sm') dimClass = 'w-9 h-9';
  if (size === 'md') dimClass = 'w-12 h-12 sm:w-14 sm:h-14';
  if (size === 'lg') dimClass = 'w-16 h-16 sm:w-20 sm:h-20';
  if (size === 'xl') dimClass = 'w-24 h-24 sm:w-28 sm:h-28';
  if (size === '2xl') dimClass = 'w-32 h-32 sm:w-40 sm:h-40';

  const style = customSize ? { width: `${customSize}px`, height: `${customSize}px` } : undefined;

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${dimClass} ${className}`}
      style={style}
    >
      {/* 
        NEW MEANINGFUL MAHARASHTRA CITIZEN INFORMATION EMBLEM
        - Emblem Shape: Rounded Square (Squircle) with 3D Gold & White Bevel
        - Base Canvas: Clean White / Light (#FFFFFF to #F8FAFC)
        - Visual Foundation: 
            1. Recognizable Maharashtra State Map (Saffron #FF6A00 -> #EA580C)
            2. Open Book / Knowledge Symbol at base (Saffron & India Green #059669)
            3. Clean "i" Information Pillar rising in the heart of Maharashtra
        - 100% Vector inlined for instant rendering and razor-sharp clarity at 40-60px
      */}
      <svg 
        viewBox="0 0 512 512" 
        className="w-full h-full block filter drop-shadow-[0_4px_12px_rgba(15,23,42,0.12)] transition-transform duration-200"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
      >
        <defs>
          {/* Subtle 3D Elevation Filters */}
          <filter id="logo-drop-shadow" x="-10%" y="-10%" width="120%" height="125%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.15" />
          </filter>

          <filter id="map-depth" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#7C2D12" floodOpacity="0.32" />
          </filter>

          <filter id="info-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
          </filter>

          {/* Premium Gold Bevel Border */}
          <linearGradient id="bevel-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="60%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Clean White Light Canvas Gradient */}
          <linearGradient id="canvas-light" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#EEF2F6" />
          </linearGradient>

          {/* Maharashtra Map Saffron Gradient */}
          <linearGradient id="map-saffron-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA133" />
            <stop offset="30%" stopColor="#FF6E00" />
            <stop offset="80%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>

          {/* Open Book Tricolor Gradients */}
          <linearGradient id="book-saffron" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF851A" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          <linearGradient id="book-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Top/Bottom Tricolor Arcs */}
          <linearGradient id="top-saffron-arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#FFA34D" />
          </linearGradient>

          <linearGradient id="bottom-green-arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Information "i" Symbol Gradient */}
          <linearGradient id="info-white-gold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFFBEB" />
          </linearGradient>
        </defs>

        <g transform="translate(16, 16)">
          {/* 1. Outer Rounded-Square (Squircle) Frame with Gold Bevel (480x480) */}
          <rect 
            x="6" 
            y="6" 
            width="468" 
            height="468" 
            rx="110" 
            ry="110" 
            fill="url(#bevel-gold)" 
            filter="url(#logo-drop-shadow)" 
          />

          {/* 2. Inner White Bevel Rim */}
          <rect 
            x="13" 
            y="13" 
            width="454" 
            height="454" 
            rx="103" 
            ry="103" 
            fill="#FFFFFF" 
          />

          {/* 3. Clean White Light Canvas Body */}
          <rect 
            x="20" 
            y="20" 
            width="440" 
            height="440" 
            rx="96" 
            ry="96" 
            fill="url(#canvas-light)" 
            stroke="#E2E8F0" 
            strokeWidth="2" 
          />

          {/* 4. Subtle Tricolor Top & Bottom Framing Accents */}
          {/* Top Saffron Ribbon Arc */}
          <path 
            d="M 120,40 C 180,28 300,28 360,40 C 340,50 140,50 120,40 Z" 
            fill="url(#top-saffron-arc)" 
          />
          {/* Bottom Green Ribbon Arc */}
          <path 
            d="M 120,440 C 180,452 300,452 360,440 C 340,430 140,430 120,440 Z" 
            fill="url(#bottom-green-arc)" 
          />

          {/* 5. OPEN BOOK / KNOWLEDGE FOUNDATION (Symbolizing Citizen Guidance & Schemes) */}
          <g transform="translate(240, 366)" filter="url(#map-depth)">
            {/* Left Page (Saffron Knowledge) */}
            <path 
              d="M -6,-4 C -45,-16 -115,-18 -165,-4 C -167,20 -165,38 -158,48 C -108,34 -45,36 -6,46 Z" 
              fill="url(#book-saffron)" 
              stroke="#C2410C" 
              strokeWidth="2.5" 
            />
            {/* Left Page Clean Accent Lines */}
            <path d="M -28,8 C -64,0 -112,0 -142,10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path d="M -28,24 C -64,16 -112,16 -142,26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

            {/* Right Page (Green Growth & Prosperity) */}
            <path 
              d="M 6,-4 C 45,-16 115,-18 165,-4 C 167,20 165,38 158,48 C 108,34 45,36 6,46 Z" 
              fill="url(#book-green)" 
              stroke="#047857" 
              strokeWidth="2.5" 
            />
            {/* Right Page Clean Accent Lines */}
            <path d="M 28,8 C 64,0 112,0 142,10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path d="M 28,24 C 64,16 112,16 142,26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

            {/* Center Book Spine */}
            <path d="M -6,-6 L 0,-12 L 6,-6 L 6,48 L 0,52 L -6,48 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
            <line x1="0" y1="-10" x2="0" y2="50" stroke="#FFFFFF" strokeWidth="3" />
          </g>

          {/* 6. MAHARASHTRA STATE MAP SILHOUETTE (Accurate, Recognizable, 3D Saffron Foundation) */}
          <g transform="translate(0, -12)" filter="url(#map-depth)">
            {/* 3D Underside Extrusion Shadow */}
            <path 
              d="M 180,140 
                 L 275,130 
                 L 355,145 
                 L 405,158 
                 L 400,225 
                 L 405,280 
                 L 355,330 
                 L 320,340 
                 L 255,360 
                 L 200,370 
                 L 170,365 
                 L 160,305 
                 L 135,250 
                 L 140,195 
                 L 165,168 
                 Z"
              fill="#7C2D12" 
              transform="translate(0, 7)" 
            />

            {/* Map Gold Bevel Trim */}
            <path 
              d="M 180,140 
                 L 275,130 
                 L 355,145 
                 L 405,158 
                 L 400,225 
                 L 405,280 
                 L 355,330 
                 L 320,340 
                 L 255,360 
                 L 200,370 
                 L 170,365 
                 L 160,305 
                 L 135,250 
                 L 140,195 
                 L 165,168 
                 Z"
              fill="none" 
              stroke="url(#bevel-gold)" 
              strokeWidth="9" 
              strokeLinejoin="round" 
            />

            {/* Main Vibrant Saffron Maharashtra Map Surface */}
            <path 
              d="M 180,140 
                 L 275,130 
                 L 355,145 
                 L 405,158 
                 L 400,225 
                 L 405,280 
                 L 355,330 
                 L 320,340 
                 L 255,360 
                 L 200,370 
                 L 170,365 
                 L 160,305 
                 L 135,250 
                 L 140,195 
                 L 165,168 
                 Z"
              fill="url(#map-saffron-grad)" 
              stroke="#FFFFFF" 
              strokeWidth="3" 
              strokeLinejoin="round" 
            />

            {/* Internal Topography & Light Highlights */}
            <path d="M 220,138 L 260,195 L 320,205 L 350,265 L 305,350" fill="none" stroke="#FFA756" strokeWidth="2.5" opacity="0.45" />
            <path d="M 145,215 L 230,235 L 240,335" fill="none" stroke="#C2410C" strokeWidth="2.5" opacity="0.3" />
          </g>

          {/* 7. CLEAN "i" INFORMATION BEACON (Center of Maharashtra) */}
          <g transform="translate(240, 222)" filter="url(#info-shadow)">
            {/* Information Dot with Gold Trim */}
            <circle cx="0" cy="-48" r="23" fill="#0F172A" />
            <circle cx="0" cy="-48" r="21" fill="url(#info-white-gold)" stroke="#F59E0B" strokeWidth="3" />
            <circle cx="0" cy="-48" r="9" fill="#EA580C" />
            <circle cx="0" cy="-48" r="3.5" fill="#FFFFFF" />

            {/* Information Pillar Body */}
            <path 
              d="M -18,-12 L 18,-12 L 18,-2 L 10,-2 L 10,48 L 18,48 L 18,58 L -18,58 L -18,48 L -10,48 L -10,-2 L -18,-2 Z" 
              fill="#0F172A" 
            />
            <path 
              d="M -16,-10 L 16,-10 L 16,-4 L 8,-4 L 8,46 L 16,46 L 16,56 L -16,56 L -16,46 L -8,46 L -8,-4 L -16,-4 Z" 
              fill="url(#info-white-gold)" 
              stroke="#F59E0B" 
              strokeWidth="2.5" 
            />
            <line x1="0" y1="-2" x2="0" y2="44" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* 8. Four Corner Civic Gold Pins */}
          <circle cx="64" cy="64" r="8" fill="url(#bevel-gold)" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="416" cy="64" r="8" fill="url(#bevel-gold)" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="64" cy="416" r="8" fill="url(#bevel-gold)" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="416" cy="416" r="8" fill="url(#bevel-gold)" stroke="#FFFFFF" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

export default MahaMahitiLogo;
