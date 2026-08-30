import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, Search, Sparkles } from 'lucide-react';
import { FAQS_DATA } from '../../data/faqs';
import { AdSlotTop, AdSlotBottom } from '../AdSlots';

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('सर्व');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'faq-1': true, 'faq-2': true, 'faq-3': true });

  const categories = useMemo(() => {
    const cats = Array.from(new Set(FAQS_DATA.map(f => f.category)));
    return ['सर्व', ...cats];
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter(faq => {
      const matchCat = selectedCategory === 'सर्व' || faq.category === selectedCategory;
      const matchQuery = !searchQuery || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFAQ = (id: string) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <nav className="flex items-center gap-2 text-xs text-[#6E6A82] mb-6 font-medium">
        <a href="/" className="hover:text-[#5B4BB7] transition-colors">होम</a>
        <span>/</span>
        <span className="text-[#201A30]">वारंवार विचारले जाणारे प्रश्न (FAQ)</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#F7F5FF] via-white to-[#FCFBF8] border border-[#EDEBF0] rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEEAFE] text-[#5B4BB7] text-xs font-semibold rounded-full mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>नागरिक शंका निरसन</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201A30] tracking-tight mb-4 font-serif">
          वारंवार विचारले जाणारे प्रश्न
        </h1>
        <p className="text-sm sm:text-base text-[#6E6A82] leading-relaxed mb-6">
          शासकीय योजना, कागदपत्रे, दाखले, पात्रता तपासणी आणि या व्यासपीठाच्या वापराबाबत नागरिकांच्या मनातील सर्व महत्त्वाच्या प्रश्नांची अचूक उत्तरे.
        </p>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6E6A82] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="प्रश्नांमध्ये शोधा (उदा. लाडकी बहीण, ७/१२, मुद्रा कर्ज, उत्पन्न दाखला...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#DDD6FE] rounded-xl text-sm focus:outline-none focus:border-[#5B4BB7] text-[#201A30] shadow-xs"
          />
        </div>
      </div>

      <AdSlotTop />

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#5B4BB7] text-white shadow-xs'
                : 'bg-white text-[#6E6A82] border border-[#EDEBF0] hover:bg-[#F7F5FF] hover:text-[#201A30]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#EDEBF0] p-6">
            <p className="text-sm text-[#6E6A82]">या शोध परिणामात कोणताही प्रश्न आढळला नाही.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div
                key={faq.id}
                className={`bg-white border rounded-xl transition-all duration-200 overflow-hidden ${
                  isOpen ? 'border-[#DDD6FE] shadow-xs' : 'border-[#EDEBF0] hover:border-[#DDD6FE]/60'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#201A30]"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[#F7F5FF] text-[#5B4BB7] font-medium border border-[#DDD6FE]/40 hidden sm:inline-block">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6E6A82] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#5B4BB7]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#464255] leading-relaxed border-t border-[#F0EEF4]">
                    <p className="pt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <AdSlotBottom />
    </div>
  );
};
