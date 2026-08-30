import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  Hero 
} from './components/Hero';
import { 
  QuickActions 
} from './components/QuickActions';
import { 
  SchemeList 
} from './components/SchemeList';
import { 
  ServiceList 
} from './components/ServiceList';
import { 
  DocumentList 
} from './components/DocumentList';
import { 
  EligibilityChecker 
} from './components/EligibilityChecker';
import { 
  DocumentChecklistBuilder 
} from './components/DocumentChecklistBuilder';
import { 
  LoanSchemeList 
} from './components/LoanSchemeList';
import { 
  UpdatesList 
} from './components/UpdatesList';
import { 
  UpdatesTicker 
} from './components/UpdatesTicker';
import { 
  VisitorCounter 
} from './components/VisitorCounter';
import { 
  Footer 
} from './components/Footer';
import { 
  DetailModal 
} from './components/DetailModal';
import { 
  AIAssistantModal 
} from './components/AIAssistantModal';
import { 
  WhatsAppModal 
} from './components/WhatsAppModal';
import { 
  SearchModal 
} from './components/SearchModal';
import { 
  AboutPage, 
  ContactPage, 
  DisclaimerPage, 
  PrivacyPolicyPage, 
  TermsPage,
  EditorialPolicyPage,
  SourcePolicyPage,
  FAQPage,
  FavoritesPage
} from './components/StaticPages';
import { 
  AdSlotTop, 
  AdSlotContent, 
  AdSlotBottom 
} from './components/AdSlots';
import { 
  MobileNav 
} from './components/MobileNav';
import { AdminApp } from './components/admin/AdminApp';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { 
  ArrowUp,
  Sparkles,
  Share2
} from 'lucide-react';

function AppContent() {
  // Navigation & Active View State
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'home';
  });
  const [searchFilter, setSearchFilter] = useState<string>('');
  
  // Accessibility State
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Dialog & Modal States
  const [detailItem, setDetailItem] = useState<any>(null);
  const [detailType, setDetailType] = useState<'scheme' | 'document' | 'service' | 'loan' | null>(null);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);
  const [whatsAppItem, setWhatsAppItem] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Listen to hash changes for #admin or tab switches
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setActiveTab('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Track scroll position for "Back to top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If activeTab is admin, render the full admin portal
  if (activeTab === 'admin') {
    return (
      <AdminApp 
        onBackToPublicSite={() => {
          setActiveTab('home');
          if (window.location.hash === '#admin') {
            history.pushState("", document.title, window.location.pathname + window.location.search);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    );
  }

  // Marathi Text-to-Speech Engine
  const speakMarathi = (text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'mr-IN';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const mrVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('hi') || v.name.includes('India'));
    if (mrVoice) {
      utterance.voice = mrVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleOpenDetailModal = (item: any, type: 'scheme' | 'document' | 'service' | 'loan') => {
    setDetailItem(item);
    setDetailType(type);
  };

  const handleCloseDetailModal = () => {
    setDetailItem(null);
    setDetailType(null);
  };

  const handleOpenWhatsAppShare = (item?: any) => {
    setWhatsAppItem(item || null);
    setIsWhatsAppOpen(true);
  };

  const handleHeroSearch = (query: string) => {
    setSearchFilter(query);
    setActiveTab('schemes');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryId: string) => {
    setActiveTab('schemes');
    setSearchFilter(categoryId);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Font size class mapping
  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-[17px]';
    if (fontSize === 'xlarge') return 'text-[19px]';
    return 'text-base';
  };

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-clip flex flex-col font-sans transition-colors ${getFontSizeClass()} ${highContrast ? 'bg-white text-black high-contrast font-bold' : 'bg-[#F4F6FB] text-[#172033]'}`}>
      
      {/* 1. HEADER */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSearchFilter('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWhatsApp={() => handleOpenWhatsAppShare()}
        onOpenAI={() => setIsAIOpen(true)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        onSpeak={speakMarathi}
        onSelectCategoryFilter={handleSelectCategory}
      />

      {/* Top Non-Intrusive Ad Banner (if enabled) */}
      <AdSlotTop />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && (
          <>
            {/* 2. FULL-WIDTH IMAGE HERO */}
            <Hero
              onSearch={handleHeroSearch}
              onCheckEligibility={() => {
                const el = document.getElementById('eligibility-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('eligibility');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onViewDocuments={() => {
                const el = document.getElementById('documents-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('documents');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onSelectSuggestion={(sug) => {
                handleHeroSearch(sug);
              }}
            />

            {/* LATEST UPDATES RIGHT-TO-LEFT TICKER */}
            <UpdatesTicker
              onSelectUpdate={(item) => {
                handleOpenDetailModal(item, 'scheme');
              }}
              onNavigateToUpdates={() => {
                setActiveTab('updates');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 3. OVERLAPPING CATEGORY ICONS (5 large icons) */}
            <QuickActions onSelectCategory={handleSelectCategory} />

            {/* 4. "नवीन आणि महत्त्वाच्या योजना" (3 IMAGE-BASED FEATURED SCHEMES) */}
            <SchemeList
              onOpenDetails={(scheme) => handleOpenDetailModal(scheme, 'scheme')}
              searchFilter={searchFilter}
            />

            {/* 5. "शासकीय सेवा" (LIST-FIRST SERVICES) */}
            <ServiceList
              onOpenDetails={(srv) => handleOpenDetailModal(srv, 'service')}
            />

            {/* Content Ad Slot */}
            <AdSlotContent />

            {/* 6. "महत्त्वाची कागदपत्रे" (LIST-FIRST DOCUMENTS) */}
            <DocumentList
              onOpenDetails={(doc) => handleOpenDetailModal(doc, 'document')}
            />

            {/* 7. "माझ्यासाठी कोणत्या योजना?" (ELIGIBILITY CHECKER) */}
            <div id="eligibility-section">
              <EligibilityChecker
                onSelectScheme={(scheme) => handleOpenDetailModal(scheme, 'scheme')}
              />
            </div>

            {/* 8. CHECKLIST + WHATSAPP (DOCUMENT CHECKLIST BUILDER) */}
            <DocumentChecklistBuilder />

            {/* 9. "नवीन माहिती" (LATEST UPDATES) */}
            <UpdatesList />

            {/* 10. REAL-TIME PERSISTENT VISITOR COUNTER */}
            <VisitorCounter />
          </>
        )}

        {activeTab === 'schemes' && (
          <div className="pt-6">
            <SchemeList
              onOpenDetails={(scheme) => handleOpenDetailModal(scheme, 'scheme')}
              searchFilter={searchFilter}
            />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="pt-6">
            <DocumentList
              onOpenDetails={(doc) => handleOpenDetailModal(doc, 'document')}
              searchFilter={searchFilter}
            />
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="pt-6">
            <DocumentChecklistBuilder />
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="pt-6">
            <EligibilityChecker
              onSelectScheme={(scheme) => handleOpenDetailModal(scheme, 'scheme')}
            />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="pt-6">
            <ServiceList
              onOpenDetails={(srv) => handleOpenDetailModal(srv, 'service')}
              searchFilter={searchFilter}
            />
          </div>
        )}

        {activeTab === 'loans' && (
          <div className="pt-6">
            <LoanSchemeList
              onOpenDetails={(loan) => handleOpenDetailModal(loan, 'loan')}
              searchFilter={searchFilter}
            />
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="pt-6">
            <UpdatesList />
          </div>
        )}

        {/* Supporting Policy & Informational Pages */}
        {activeTab === 'about' && <AboutPage onNavigate={setActiveTab} />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'disclaimer' && <DisclaimerPage />}
        {activeTab === 'privacy' && <PrivacyPolicyPage />}
        {activeTab === 'terms' && <TermsPage />}
        {activeTab === 'editorial' && <EditorialPolicyPage />}
        {activeTab === 'sources' && <SourcePolicyPage />}
        {activeTab === 'faq' && <FAQPage onNavigate={setActiveTab} />}
        {activeTab === 'favorites' && (
          <FavoritesPage 
            onOpenScheme={(scheme) => handleOpenDetailModal(scheme, 'scheme')} 
            onNavigate={setActiveTab}
          />
        )}
      </main>

      {/* Bottom Ad Slot (if enabled) */}
      <AdSlotBottom />

      {/* Floating WhatsApp Action (Bottom Right) */}
      <button
        onClick={() => handleOpenWhatsAppShare()}
        className="hidden sm:flex fixed bottom-24 right-4 sm:right-6 md:right-8 z-40 items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-full shadow-[0_10px_28px_rgba(37,211,102,0.35)] cursor-pointer ring-4 ring-white transition-all hover:scale-105"
        aria-label="WhatsApp वर मदत मिळवा"
      >
        <Share2 className="w-4 h-4 text-white" />
        <span className="font-bold text-xs sm:text-sm">WhatsApp वर मदत</span>
      </button>

      {/* Floating AI Assistant Trigger Button (Bottom Right) */}
      <button
        onClick={() => setIsAIOpen(true)}
        className="hidden sm:flex fixed bottom-6 sm:bottom-8 right-4 sm:right-6 md:right-8 z-40 items-center gap-2.5 bg-[#5B45B8] hover:bg-[#4D39A2] text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-full shadow-[0_12px_32px_rgba(91,69,184,0.35)] cursor-pointer ring-4 ring-white transition-all hover:scale-105"
        aria-label="AI नागरिक सहाय्यक उघडा"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span className="font-bold text-xs sm:text-sm">AI सहाय्यक</span>
      </button>

      {/* Scroll to Top Float Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 sm:bottom-8 left-4 sm:left-6 md:left-8 z-30 p-3 sm:p-3.5 rounded-full bg-white text-[#25242A] hover:bg-[#FAF9F5] shadow-lg border border-[#EDEBF0] transition hover:scale-105 cursor-pointer"
          aria-label="वर जा (Scroll to top)"
        >
          <ArrowUp className="w-5 h-5 text-[#5B45B8]" />
        </button>
      )}

      {/* Fixed Bottom Navigation for Mobile */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSearchFilter('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenWhatsApp={() => handleOpenWhatsAppShare()}
      />

      {/* Detail Modal Dialog */}
      <DetailModal
        item={detailItem}
        type={detailType}
        onClose={handleCloseDetailModal}
        onOpenWhatsAppShare={handleOpenWhatsAppShare}
      />

      {/* AI Assistant Chat Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onSpeak={speakMarathi}
      />

      {/* WhatsApp Checklist & Share Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => {
          setIsWhatsAppOpen(false);
          setWhatsAppItem(null);
        }}
        initialItem={whatsAppItem}
      />

      {/* Global Intelligent Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={(item, type) => {
          handleOpenDetailModal(item, type);
        }}
      />

    </div>
  );
}

export function App() {
  return (
    <AdminAuthProvider>
      <AppContent />
    </AdminAuthProvider>
  );
}
