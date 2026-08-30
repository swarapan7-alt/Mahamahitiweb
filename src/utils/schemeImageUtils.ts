import { Scheme } from '../types';

export const DEFAULT_CATEGORY_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&h=900&q=85',
  women: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&h=675&q=80',
  farmer: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&h=675&q=80',
  education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&h=675&q=80',
  worker: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&h=675&q=80',
  health: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&h=675&q=80',
  senior_citizen: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&h=675&q=80',
  other_services: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&h=675&q=80'
} as const;

export type CategoryImageKey = keyof typeof DEFAULT_CATEGORY_IMAGES;

/**
 * Normalizes any category string (Marathi or English) into one of the 7 canonical category keys:
 * 'women' | 'farmer' | 'education' | 'worker' | 'health' | 'senior_citizen' | 'other_services'
 */
export function getNormalizedCategoryKey(category?: string): CategoryImageKey {
  if (!category) return 'other_services';
  const c = category.toLowerCase().trim();

  // 1. Women / महिला
  if (
    c.includes('women') ||
    c.includes('महिला') ||
    c.includes('मुलगी') ||
    c.includes('ladki') ||
    c.includes('बहीण') ||
    c.includes('बालविकास') ||
    c.includes('स्त्री')
  ) {
    return 'women';
  }

  // 2. Farmer / शेतकरी
  if (
    c.includes('farmer') ||
    c.includes('agriculture') ||
    c.includes('शेतकरी') ||
    c.includes('कृषी') ||
    c.includes('पीक') ||
    c.includes('सिंचन') ||
    c.includes('ट्रॅक्टर')
  ) {
    return 'farmer';
  }

  // 3. Education / Student / शिक्षण
  if (
    c.includes('student') ||
    c.includes('education') ||
    c.includes('शिक्षण') ||
    c.includes('शिष्यवृत्ती') ||
    c.includes('विद्यार्थी') ||
    c.includes('शाळा') ||
    c.includes('महाविद्यालय') ||
    c.includes('वसतिगृह') ||
    c.includes('scholarship')
  ) {
    return 'education';
  }

  // 4. Worker / कामगार
  if (
    c.includes('worker') ||
    c.includes('कामगार') ||
    c.includes('बांधकाम') ||
    c.includes('मजूर') ||
    c.includes('bocw') ||
    c.includes('श्रम') ||
    c.includes('कारखाना')
  ) {
    return 'worker';
  }

  // 5. Health / आरोग्य
  if (
    c.includes('health') ||
    c.includes('आरोग्य') ||
    c.includes('वैद्यकीय') ||
    c.includes('रुग्ण') ||
    c.includes('उपचार') ||
    c.includes('दवाखाना') ||
    c.includes('विमा')
  ) {
    return 'health';
  }

  // 6. Senior Citizen / ज्येष्ठ नागरिक
  if (
    c.includes('senior') ||
    c.includes('ज्येष्ठ') ||
    c.includes('वृद्ध') ||
    c.includes('पेन्शन') ||
    c.includes('वयोवृद्ध') ||
    c.includes('निराधार')
  ) {
    return 'senior_citizen';
  }

  // 7. Other services / इतर
  return 'other_services';
}

/**
 * Returns the exact permanent image URL for any scheme record:
 * 1. scheme.imageUrl (if set and valid)
 * 2. Admin uploaded category image from getImageByKey (if available)
 * 3. Default high-resolution curated 16:9 category image
 */
export function getSchemeImage(
  scheme: Partial<Scheme>,
  getImageByKey?: (key: string, defaultUrl?: string) => string
): string {
  // If the scheme has its own explicitly assigned unique imageUrl, use it
  if (scheme.imageUrl && scheme.imageUrl.trim().length > 0) {
    return scheme.imageUrl;
  }
  if (scheme.image && scheme.image.trim().length > 0) {
    return scheme.image;
  }

  // Derive canonical category key
  const catKey = getNormalizedCategoryKey(scheme.category || scheme.categoryLabel);
  const defaultUrl = DEFAULT_CATEGORY_IMAGES[catKey];

  if (getImageByKey) {
    switch (catKey) {
      case 'women':
        return getImageByKey('category_women', getImageByKey('homepage_women_child', defaultUrl));
      case 'farmer':
        return getImageByKey('category_farmer', getImageByKey('homepage_farmer', defaultUrl));
      case 'education':
        return getImageByKey('category_education', getImageByKey('homepage_education', defaultUrl));
      case 'worker':
        return getImageByKey('category_worker', getImageByKey('homepage_worker', defaultUrl));
      case 'health':
        return getImageByKey('category_health', getImageByKey('homepage_health', defaultUrl));
      case 'senior_citizen':
        return getImageByKey('category_senior_citizen', defaultUrl);
      case 'other_services':
      default:
        return getImageByKey('category_other_services', getImageByKey('homepage_other_services', defaultUrl));
    }
  }

  return defaultUrl;
}

/**
 * Compresses and resizes a user-selected image file on the client before converting to base64.
 * This guarantees ultra-crisp display while preventing massive multi-megabyte payloads.
 */
export function compressImageFile(
  file: File,
  maxWidth = 1600,
  maxHeight = 900,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve('');
        return;
      }
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use standard image/jpeg with good compression
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

