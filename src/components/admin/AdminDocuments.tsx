import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { DocumentItem } from '../../types';

export const AdminDocuments: React.FC = () => {
  const { documents, saveDocument, deleteDocument, toggleDocumentStatus } = useAdminAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState('');

  const categories = ['महसूल विभाग', 'ओळख व नागरिकत्व', 'सामाजिक न्याय', 'वाहतूक व वाहन', 'कृषी व जमीन'];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleStartCreate = () => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: '',
      titleEnglish: '',
      slug: '',
      category: 'महसूल विभाग',
      issuingAuthority: 'तहसीलदार कार्यालय / महसूल विभाग',
      description: '',
      requiredSupportingDocs: [''],
      applicationSteps: [''],
      whereToApply: 'आपले सरकार सेवा केंद्र किंवा aaplesarkar.mahaonline.gov.in',
      officialPortal: 'आपले सरकार पोर्टल',
      officialUrl: 'https://aaplesarkar.mahaonline.gov.in',
      validityPeriod: '१ वर्ष किंवा ३ वर्षे',
      lastVerified: '२०२६',
      published: true,
      status: 'published'
    };
    setEditingDoc(newDoc);
    setIsCreating(true);
  };

  const handleSave = async (status: 'published' | 'draft') => {
    if (!editingDoc || !editingDoc.title.trim()) {
      alert('कृपया प्रमाणपत्राचे / कागदपत्राचे नाव प्रविष्ट करा.');
      return;
    }

    const cleaned: DocumentItem = {
      ...editingDoc,
      published: status === 'published',
      status: status,
      slug: editingDoc.slug || editingDoc.title.toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-'),
      requiredSupportingDocs: editingDoc.requiredSupportingDocs.filter(x => x && x.trim().length > 0),
      applicationSteps: editingDoc.applicationSteps.filter(x => x && x.trim().length > 0)
    };

    await saveDocument(cleaned);
    setEditingDoc(null);
    setIsCreating(false);
    showNotification(status === 'published' ? 'कागदपत्र माहिती प्रकाशित झाली!' : 'कागदपत्र माहिती मसुदा (Draft) म्हणून साठवली.');
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`तुम्हाला खात्री आहे का की "${name}" हटवायचे आहे?`)) {
      await deleteDocument(id);
      showNotification('कागदपत्र हटवले गेले.');
    }
  };

  const filteredDocs = documents.filter(doc => {
    return doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#201A30] font-heading flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#5B45B8]" />
            <span>कागदपत्रे व दाखले व्यवस्थापन (Document Management)</span>
          </h2>
          <p className="text-xs text-[#6E6A82] mt-1">
            विविध सरकारी दाखले, प्रमाणपत्रे, आवश्यक कागदपत्रांची यादी आणि अर्ज प्रक्रियेचे व्यवस्थापन करा.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B45B8] hover:bg-[#4D39A2] text-white text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Document (नवीन कागदपत्र जोडा)</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9B98A6] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="दाखल्याचे किंवा प्रमाणपत्राचे नाव शोधा (उदा. उत्पन्न दाखला, जात प्रमाणपत्र)..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EDEBF0] text-[#6E6A82] bg-[#FAF9F5]">
                <th className="py-3 px-4 font-bold">कागदपत्र / दाखल्याचे नाव</th>
                <th className="py-3 px-4 font-bold">विभाग / प्राधिकरण</th>
                <th className="py-3 px-4 font-bold">वैधता कालावधी</th>
                <th className="py-3 px-4 font-bold text-center">स्थिती (Status)</th>
                <th className="py-3 px-4 font-bold text-right">कृती (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBF0]">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6E6A82]">
                    कोणतेही कागदपत्र सापडले नाही.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const isPub = doc.published !== false;
                  return (
                    <tr key={doc.id} className="hover:bg-[#FAF9F5]/70 transition">
                      <td className="py-3.5 px-4 font-bold text-[#201A30]">
                        <div>
                          <span className="block">{doc.title}</span>
                          <span className="text-[10px] text-[#6E6A82] font-normal block">
                            {doc.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#464255]">
                        {doc.issuingAuthority}
                      </td>
                      <td className="py-3.5 px-4 text-[#6E6A82]">
                        {doc.validityPeriod || 'कायमस्वरूपी'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleDocumentStatus(doc.id, isPub ? 'draft' : 'published')}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                            isPub 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-amber-50 hover:text-amber-700' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          {isPub ? '✓ Published' : '○ Draft'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingDoc({ ...doc });
                              setIsCreating(false);
                            }}
                            className="p-1.5 rounded-lg text-[#6E6A82] hover:bg-[#F6F3FF] hover:text-[#5B45B8] transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id, doc.title)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEBF0]">
              <h3 className="font-bold text-base text-[#201A30]">
                {isCreating ? 'नवीन कागदपत्र जोडा' : 'कागदपत्र माहिती संपादित करा'}
              </h3>
              <button onClick={() => setEditingDoc(null)} className="text-xs font-bold text-[#6E6A82]">✕ बंद करा</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    कागदपत्र / दाखल्याचे नाव (Document Name) *
                  </label>
                  <input
                    type="text"
                    value={editingDoc.title}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                    placeholder="उदा. उत्पन्न प्रमाणपत्र (Income Certificate)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    वर्गवारी (Category)
                  </label>
                  <select
                    value={editingDoc.category}
                    onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201A30] mb-1">
                  वर्णन (Description)
                </label>
                <textarea
                  rows={2}
                  value={editingDoc.description}
                  onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                  className="w-full p-3 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  placeholder="दाखल्याचा उपयोग आणि महत्त्व..."
                />
              </div>

              {/* Required Supporting Documents */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#201A30]">
                    आवश्यक पुरावे / जोडायची कागदपत्रे (Required Supporting Documents)
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingDoc({
                      ...editingDoc,
                      requiredSupportingDocs: [...editingDoc.requiredSupportingDocs, '']
                    })}
                    className="text-[11px] font-bold text-[#5B45B8] hover:underline"
                  >
                    + कागदपत्र जोडा
                  </button>
                </div>
                <div className="space-y-1.5">
                  {editingDoc.requiredSupportingDocs.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...editingDoc.requiredSupportingDocs];
                          updated[idx] = e.target.value;
                          setEditingDoc({ ...editingDoc, requiredSupportingDocs: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-[#FAF9F5] border border-[#DDD6FE] rounded-lg text-xs outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Where to apply & Authority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    अर्ज कुठे करावा (Where To Apply)
                  </label>
                  <input
                    type="text"
                    value={editingDoc.whereToApply}
                    onChange={(e) => setEditingDoc({ ...editingDoc, whereToApply: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    वैधता कालावधी (Validity Period)
                  </label>
                  <input
                    type="text"
                    value={editingDoc.validityPeriod}
                    onChange={(e) => setEditingDoc({ ...editingDoc, validityPeriod: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              {/* Official Source & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    अधिकृत पोर्टल (Official Portal)
                  </label>
                  <input
                    type="text"
                    value={editingDoc.officialPortal}
                    onChange={(e) => setEditingDoc({ ...editingDoc, officialPortal: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    अधिकृत पोर्टल URL
                  </label>
                  <input
                    type="text"
                    value={editingDoc.officialUrl}
                    onChange={(e) => setEditingDoc({ ...editingDoc, officialUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-[#EDEBF0] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingDoc(null)}
                className="px-4 py-2 text-xs font-bold text-[#6E6A82]"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={() => handleSave('draft')}
                className="px-4 py-2 text-xs font-bold bg-[#FAF9F5] border border-[#DDD6FE] text-[#5B45B8] rounded-xl"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave('published')}
                className="px-5 py-2 text-xs font-bold bg-[#5B45B8] text-white rounded-xl shadow-xs"
              >
                Publish करा
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
