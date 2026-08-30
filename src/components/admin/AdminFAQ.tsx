import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2 
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { FAQItem } from '../../types';

export const AdminFAQ: React.FC = () => {
  const { faqs, saveFaq, deleteFaq } = useAdminAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleStartCreate = () => {
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      category: 'सर्वसाधारण',
      question: '',
      answer: ''
    };
    setEditingFaq(newFaq);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editingFaq || !editingFaq.question.trim() || !editingFaq.answer.trim()) {
      alert('कृपया प्रश्न आणि उत्तर दोन्ही प्रविष्ट करा.');
      return;
    }

    await saveFaq(editingFaq);
    setEditingFaq(null);
    setIsCreating(false);
    showNotification('FAQ यशस्वीरित्या साठवला गेला!');
  };

  const handleDelete = async (id: string, q: string) => {
    if (confirm(`"${q}" हा प्रश्न काढून टाकायचा आहे का?`)) {
      await deleteFaq(id);
      showNotification('FAQ काढून टाकला गेला.');
    }
  };

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#201A30] font-heading flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#5B45B8]" />
            <span>नेहमी विचारले जाणारे प्रश्न (FAQ Management)</span>
          </h2>
          <p className="text-xs text-[#6E6A82] mt-1">
            नागरिकांच्या सामान्य प्रश्नांची उत्तरे आणि सरकारी नियमांचे सुलभ स्पष्टीकरण व्यवस्थापित करा.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B45B8] hover:bg-[#4D39A2] text-white text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ (नवीन प्रश्न जोडा)</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9B98A6] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="प्रश्न किंवा उत्तर शोधा..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl overflow-hidden shadow-xs">
        <div className="divide-y divide-[#EDEBF0]">
          {filteredFaqs.map((item) => (
            <div key={item.id} className="p-4 sm:p-5 hover:bg-[#FAF9F5]/70 transition flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#F6F3FF] text-[#5B45B8] font-bold border border-[#DDD6FE]">
                    {item.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#201A30]">
                    {item.question}
                  </h4>
                </div>
                <p className="text-xs text-[#464255] leading-relaxed pl-1">
                  {item.answer}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 pt-1">
                <button
                  onClick={() => {
                    setEditingFaq({ ...item });
                    setIsCreating(false);
                  }}
                  className="p-1.5 rounded-lg text-[#6E6A82] hover:bg-[#F6F3FF] hover:text-[#5B45B8] transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.question)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDEBF0]">
              <h3 className="font-bold text-base text-[#201A30]">
                {isCreating ? 'नवीन प्रश्न जोडा' : 'प्रश्न संपादित करा'}
              </h3>
              <button onClick={() => setEditingFaq(null)} className="text-xs font-bold">✕ बंद करा</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#201A30] mb-1">वर्गवारी (Category)</label>
                <input
                  type="text"
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  placeholder="उदा. योजना, कागदपत्रे, DBT"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201A30] mb-1">प्रश्न (Question) *</label>
                <textarea
                  rows={2}
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full p-3 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  placeholder="उदा. उत्पन्न दाखला किती दिवसांत मिळतो?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201A30] mb-1">सविस्तर उत्तर (Answer) *</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full p-3 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  placeholder="सोप्या मराठीत अचूक उत्तर..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#EDEBF0]">
              <button onClick={() => setEditingFaq(null)} className="px-4 py-2 text-xs font-bold text-[#6E6A82]">
                रद्द करा
              </button>
              <button onClick={handleSave} className="px-5 py-2 bg-[#5B45B8] text-white text-xs font-bold rounded-xl shadow-xs">
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
