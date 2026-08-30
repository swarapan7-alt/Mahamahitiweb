import { CategoryType } from '../types';

export interface CategoryInfo {
  id: CategoryType;
  label: string;
  shortDesc: string;
  iconName: string;
  colorClass: string;
}

export const SCHEME_CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    label: 'सर्व योजना',
    shortDesc: 'महाराष्ट्र शासन व केंद्र सरकारच्या सर्व योजनांची एकत्रित माहिती',
    iconName: 'Sparkles',
    colorClass: 'text-[#5B4BB7] bg-[#EEEAFE] border-[#DDD6FE]'
  },
  {
    id: 'women',
    label: 'महिलांसाठी योजना',
    shortDesc: 'लाडकी बहीण, लेक लाडकी, सुकन्या समृद्धी, जननी सुरक्षा व महिला सबलीकरण योजना',
    iconName: 'HeartHandshake',
    colorClass: 'text-[#C94A74] bg-[#FFF0F5] border-[#FBD6E2]'
  },
  {
    id: 'farmer',
    label: 'शेतकरी योजना',
    shortDesc: 'पीएम किसान, नमो शेतकरी, पीक विमा, ठिबक सिंचन, विहीर अनुदान व शेती अवजारे',
    iconName: 'Wheat',
    colorClass: 'text-[#367A59] bg-[#F0F8F4] border-[#D2EBDD]'
  },
  {
    id: 'student',
    label: 'विद्यार्थ्यांसाठी योजना',
    shortDesc: 'महाडीबीटी शिष्यवृत्ती, स्वाधार योजना, मोफत उच्च शिक्षण व परीक्षा सहाय्य',
    iconName: 'GraduationCap',
    colorClass: 'text-[#5B4BB7] bg-[#EEEAFE] border-[#DDD6FE]'
  },
  {
    id: 'senior',
    label: 'ज्येष्ठ नागरिक योजना',
    shortDesc: 'श्रावणबाळ पेन्शन, इंदिरा गांधी वृद्धापकाळ, वयोश्री व मोफत एसटी प्रवास सवलत',
    iconName: 'Users',
    colorClass: 'text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]'
  },
  {
    id: 'disabled',
    label: 'दिव्यांगांसाठी योजना',
    shortDesc: 'संजय गांधी निराधार, युडीआयडी कार्ड, दिव्यांगांसाठी व्यवसाय अनुदान व पेन्शन',
    iconName: 'Accessibility',
    colorClass: 'text-[#0D9488] bg-[#F0FDFA] border-[#CCFBF1]'
  },
  {
    id: 'worker',
    label: 'कामगारांसाठी योजना',
    shortDesc: 'इमारत व इतर बांधकाम कामगार (BOCW) कल्याणकारी मंडळ योजना, अवजारे संच व मदत',
    iconName: 'HardHat',
    colorClass: 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]'
  },
  {
    id: 'business',
    label: 'उद्योजकांसाठी योजना',
    shortDesc: 'अण्णासाहेब पाटील महामंडळ, पीएमईजीपी, मुद्रा, स्टार्टअप व व्यवसाय अनुदान योजना',
    iconName: 'Briefcase',
    colorClass: 'text-[#2563EB] bg-[#EFF6FF] border-[#DBEAFE]'
  },
  {
    id: 'education',
    label: 'शिक्षण योजना',
    shortDesc: 'मोफत गणवेश, शालेय पोषण आहार, आरटीई २५% मोफत प्रवेश व वसतिगृह सुविधा',
    iconName: 'BookOpen',
    colorClass: 'text-[#4F46E5] bg-[#EEF2FF] border-[#E0E7FF]'
  },
  {
    id: 'health',
    label: 'आरोग्य योजना',
    shortDesc: 'महात्मा ज्योतिराव फुले जन आरोग्य योजना (MJPJAY), आयुष्मान भारत व मोफत औषधोपचार',
    iconName: 'Activity',
    colorClass: 'text-[#DC2626] bg-[#FEF2F2] border-[#FEE2E2]'
  },
  {
    id: 'housing',
    label: 'घरकुल योजना',
    shortDesc: 'प्रधानमंत्री आवास योजना (PMAY), रमाई घरकुल, शबरी आवास व मोदी आवास योजना',
    iconName: 'Home',
    colorClass: 'text-[#0891B2] bg-[#ECFEFF] border-[#CFFAFE]'
  },
  {
    id: 'financial',
    label: 'आर्थिक सहाय्य योजना',
    shortDesc: 'संजय गांधी निराधार योजना, विधवा पेन्शन, राष्ट्रीय कुटुंब लाभ व आणीबाणी मदत',
    iconName: 'Coins',
    colorClass: 'text-[#7C3AED] bg-[#F5F3FF] border-[#EDE9FE]'
  }
];

export const DOCUMENT_CATEGORIES = [
  { id: 'all', label: 'सर्व कागदपत्रे व दाखले' },
  { id: 'identity', label: 'ओळखपत्रे (Identity Proof)' },
  { id: 'income_caste', label: 'उत्पन्न व जात दाखले' },
  { id: 'vital', label: 'जन्म, मृत्यू व नागरी नोंदी' },
  { id: 'business', label: 'उद्योग, व्यवसाय व शेती नोंदी' },
  { id: 'other', label: 'इतर कायदेशीर प्रमाणपत्रे' }
];

export const SERVICE_CATEGORIES = [
  { id: 'all', label: 'सर्व सेवा' },
  { id: 'citizen', label: 'नागरिक सेवा' },
  { id: 'certificates', label: 'प्रमाणपत्रे व महसूल' },
  { id: 'business', label: 'व्यवसाय व उद्योग' },
  { id: 'agriculture', label: 'कृषी व शेतकरी सेवा' },
  { id: 'digital', label: 'डिजिटल लॉकर व ओळख' },
  { id: 'health', label: 'आरोग्य व कल्याण' }
];

export const LOAN_CATEGORIES = [
  { id: 'all', label: 'सर्व कर्ज योजना' },
  { id: 'business', label: 'व्यवसाय व उद्योग' },
  { id: 'women', label: 'महिला बचत गट व व्यवसाय' },
  { id: 'farmer', label: 'शेतकरी पीक व अवजारे कर्ज' },
  { id: 'self_employed', label: 'स्वयंरोजगार व कारागीर' },
  { id: 'education', label: 'उच्च शिक्षण कर्ज' },
  { id: 'micro', label: 'सूक्ष्म व्यवसाय व फेरीवाले' }
];

export const UPDATE_CATEGORIES = [
  { id: 'all', label: 'सर्व अपडेट्स' },
  { id: 'योजना', label: 'योजना माहिती' },
  { id: 'कागदपत्रे', label: 'कागदपत्रे मार्गदर्शन' },
  { id: 'शासकीय सेवा', label: 'शासकीय सेवा' },
  { id: 'कर्ज', label: 'कर्ज योजना' },
  { id: 'शिष्यवृत्ती', label: 'शिष्यवृत्ती व शिक्षण' },
  { id: 'महत्त्वाच्या सूचना', label: 'नागरिक मार्गदर्शक' }
];
