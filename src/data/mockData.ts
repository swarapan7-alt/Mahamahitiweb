import { SCHEMES_DATA } from './schemes';
import { DOCUMENTS_DATA } from './documents';
import { SERVICES_DATA } from './services';
import { LOAN_SCHEMES_DATA } from './loanSchemes';
import { UPDATES_DATA } from './updates';
import { FAQS_DATA } from './faqs';
import { SCHEME_CATEGORIES, DOCUMENT_CATEGORIES, SERVICE_CATEGORIES, LOAN_CATEGORIES, UPDATE_CATEGORIES } from './categories';
import { SITE_CONFIG } from './siteConfig';

export const schemesData = SCHEMES_DATA;
export const documentsData = DOCUMENTS_DATA;
export const governmentServicesData = SERVICES_DATA;
export const loanSchemesData = LOAN_SCHEMES_DATA;
export const latestUpdatesData = UPDATES_DATA;
export const faqsData = FAQS_DATA;

export const GOVERNMENT_SERVICES_DATA = SERVICES_DATA;
export const LATEST_UPDATES_DATA = UPDATES_DATA;

export const CHECKLIST_PRESETS: Record<string, { name: string; items: string[] }> = {
  passport: {
    name: 'नवीन पासपोर्टसाठी आवश्यक कागदपत्रे',
    items: [
      'आधार कार्ड (नाव, जन्मतारीख व पत्ता पूर्ण असलेला)',
      'पॅन कार्ड',
      'जन्म दाखला किंवा शाळा सोडल्याचा दाखला (LC)',
      '१० वी किंवा त्यापुढील उत्तीर्ण गुणपत्रिका / सनद (Non-ECR साठी)',
      'विद्यमान बँक पासबुक (फोटो व शिक्का असलेले)',
      'विद्युत बिल किंवा गॅस कनेक्शन पासबुक (पत्त्याचा पुरावा)'
    ]
  },
  ladki_bahin: {
    name: 'लाडकी बहीण योजनेसाठी आवश्यक कागदपत्रे',
    items: [
      'आधार कार्ड (मोबाईल लिंक असलेले)',
      'महाराष्ट्र अधिवास दाखला (Domicile) किंवा जन्म दाखला / १५ वर्षे रेशन कार्ड पुरावा',
      'वार्षिक उत्पन्न दाखला (₹२.५ लाखांपर्यंत) किंवा पिवळे/केशरी रेशन कार्ड',
      'बँक पासबुक (आधार सीडेड व DBT सक्रिय असलेले बँक खाते)',
      'हमीपत्र (नियम व अटी मान्यतेचे स्वयंघोषणापत्र)',
      'पासपोर्ट आकाराचा रंगीत फोटो'
    ]
  },
  income_cert: {
    name: 'उत्पन्न दाखल्यासाठी आवश्यक कागदपत्रे',
    items: [
      'अर्जदाराचे आधार कार्ड व रेशन कार्ड',
      'तलाठी / पटवारी उत्पन्न अहवाल (ग्रामीण भागासाठी) किंवा नगरपरिषद अहवाल',
      'मागील वर्षाची पगार स्लिप किंवा फॉर्म १६ (नोकरदारांसाठी)',
      'शेती असल्यास ७/१२ व ८-अ उतारा',
      'स्वयंघोषणापत्र (Self-Declaration Form)'
    ]
  },
  caste_cert: {
    name: 'जात प्रमाणपत्रासाठी आवश्यक कागदपत्रे',
    items: [
      'अर्जदाराचे आधार कार्ड व शाळा सोडल्याचा दाखला (LC)',
      'वडिलांचा किंवा आजोबांचा शाळा सोडल्याचा दाखला (जात नमूद असलेला)',
      'वडिलांचे जात प्रमाणपत्र किंवा महसूल पुरावा',
      '१९६७ पूर्वीचा पुरावा (SC/ST साठी १९५० पूर्वीचा पुरावा)',
      'अधिवास दाखला व स्वयंघोषणापत्र'
    ]
  },
  mudra_loan: {
    name: 'मुद्रा कर्ज योजनेसाठी आवश्यक कागदपत्रे',
    items: [
      'अर्जदाराचे आधार कार्ड व पॅन कार्ड',
      'निवासाचा पुरावा (लाईट बिल / रेशन कार्ड)',
      'उद्यम नोंदणी (Udyam Registration) प्रमाणपत्र',
      'व्यवसायाचा प्रकल्प अहवाल (Project Report) व खर्चाचे अंदाजपत्रक',
      'मागील ६ महिन्यांचे बँक खात्याचे स्टेटमेंट',
      'पासपोर्ट आकाराचे २ फोटो'
    ]
  },
  ration_card: {
    name: 'नवीन रेशन कार्डसाठी आवश्यक कागदपत्रे',
    items: [
      'कुटुंबप्रमुखाचे व सर्व सदस्यांचे आधार कार्ड',
      'निवासाचा पुरावा (लाईट बिल किंवा घरपट्टी पावती)',
      'मागील रेशन कार्डातून नाव कमी केल्याचा दाखला (Surrender / Deletion Certificate)',
      'तहसीलदार / तलाठी यांचा उत्पन्न दाखला',
      'कुटुंबप्रमुखाचा पासपोर्ट आकाराचा फोटो'
    ]
  }
};

export const MAHARASHTRA_DISTRICTS = [
  'सर्व जिल्हे',
  'अहमदनगर (अहिल्यानगर)',
  'अकोला',
  'अमरावती',
  'छत्रपती संभाजीनगर (औरंगाबाद)',
  'बीड',
  'भंडारा',
  'बुलढाणा',
  'चंद्रपूर',
  'धुळे',
  'गडचिरोली',
  'गोंदिया',
  'हिंगोली',
  'जळगाव',
  'जालना',
  'कोल्हापूर',
  'लातूर',
  'मुंबई शहर',
  'मुंबई उपनगर',
  'नागपूर',
  'नांदेड',
  'नंदुरबार',
  'नाशिक',
  'धाराशिव (उस्मानाबाद)',
  'पालघर',
  'परभणी',
  'पुणे',
  'रायगड',
  'रत्नागिरी',
  'सांगली',
  'सातारा',
  'सिंधुदुर्ग',
  'सोलापूर',
  'ठाणे',
  'वर्धा',
  'वाशिम',
  'यवतमाळ'
];

export {
  SCHEMES_DATA,
  DOCUMENTS_DATA,
  SERVICES_DATA,
  LOAN_SCHEMES_DATA,
  UPDATES_DATA,
  FAQS_DATA,
  SCHEME_CATEGORIES,
  DOCUMENT_CATEGORIES,
  SERVICE_CATEGORIES,
  LOAN_CATEGORIES,
  UPDATE_CATEGORIES,
  SITE_CONFIG
};
