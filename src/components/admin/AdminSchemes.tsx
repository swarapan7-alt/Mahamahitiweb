import React, { useState, useRef } from 'react';
import { 
  Award, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Save, 
  ExternalLink, 
  AlertCircle,
  FileText,
  Filter,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { SchemeItem } from '../../types';
import { compressImageFile } from '../../utils/schemeImageUtils';

export const AdminSchemes: React.FC = () => {
  const { schemes, saveScheme, deleteScheme, toggleSchemeStatus, images } = useAdminAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingScheme, setEditingScheme] = useState<SchemeItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewScheme, setPreviewScheme] = useState<SchemeItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [notification, setNotification] = useState('');

  const categories = ['महिला व बालविकास', 'शेतकरी कल्याण', 'शिक्षण व शिष्यवृत्ती', 'आरोग्य', 'सामाजिक न्याय', 'ज्येष्ठ नागरिक', 'उद्योग व व्यवसाय'];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const normalizeScheme = (raw: any): SchemeItem => {
    if (!raw) return raw;
    const reqDocs = Array.isArray(raw.requiredDocuments) && raw.requiredDocuments.length > 0
      ? [...raw.requiredDocuments]
      : (Array.isArray(raw.documentsRequired) && raw.documentsRequired.length > 0
        ? [...raw.documentsRequired]
        : ['']);

    const elig = Array.isArray(raw.eligibility) && raw.eligibility.length > 0
      ? [...raw.eligibility]
      : (Array.isArray(raw.criteria) && raw.criteria.length > 0
        ? [...raw.criteria]
        : ['']);

    const bene = Array.isArray(raw.benefits) && raw.benefits.length > 0
      ? [...raw.benefits]
      : [''];

    const appProc = Array.isArray(raw.applicationProcess) && raw.applicationProcess.length > 0
      ? [...raw.applicationProcess]
      : (Array.isArray(raw.process) && raw.process.length > 0
        ? [...raw.process]
        : ['']);

    return {
      ...raw,
      id: raw.id || `scheme-${Date.now()}`,
      title: raw.title || '',
      titleEnglish: raw.titleEnglish || '',
      slug: raw.slug || '',
      category: raw.category || 'महिला व बालविकास',
      department: raw.department || 'महाराष्ट्र शासन',
      description: raw.description || '',
      shortDescription: raw.shortDescription || '',
      eligibility: elig,
      benefits: bene,
      requiredDocuments: reqDocs,
      documentsRequired: reqDocs,
      applicationProcess: appProc,
      process: appProc,
      whereToApply: raw.whereToApply || raw.applicationWhere || 'आपले सरकार सेवा केंद्र किंवा अधिकृत ऑनलाइन पोर्टल',
      officialSource: raw.officialSource || raw.officialSourceName || 'महाराष्ट्र शासन अधिकृत शासन निर्णय (GR)',
      officialUrl: raw.officialUrl || 'https://maharashtra.gov.in',
      lastVerified: raw.lastVerified || raw.lastVerifiedAt || '२०२६',
      imageUrl: raw.imageUrl || raw.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      published: raw.published !== false,
      status: raw.status || (raw.published === false ? 'draft' : 'published')
    };
  };

  const handleStartCreate = () => {
    const newScheme: SchemeItem = normalizeScheme({
      id: `scheme-${Date.now()}`,
      title: '',
      titleEnglish: '',
      slug: '',
      category: 'महिला व बालविकास',
      department: 'महाराष्ट्र शासन',
      description: '',
      shortDescription: '',
      eligibility: [''],
      benefits: [''],
      requiredDocuments: [''],
      applicationProcess: [''],
      whereToApply: 'आपले सरकार सेवा केंद्र किंवा अधिकृत ऑनलाइन पोर्टल',
      officialSource: 'महाराष्ट्र शासन अधिकृत शासन निर्णय (GR)',
      officialUrl: 'https://maharashtra.gov.in',
      lastVerified: '२०२६',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      published: true,
      status: 'published'
    });
    setEditingScheme(newScheme);
    setIsCreating(true);
  };

  const handleSave = async (status: 'published' | 'draft') => {
    if (!editingScheme || !editingScheme.title.trim()) {
      alert('कृपया योजनेचे नाव प्रविष्ट करा.');
      return;
    }

    const elig = (editingScheme.eligibility || []).filter(x => x && x.trim().length > 0);
    const bene = (editingScheme.benefits || []).filter(x => x && x.trim().length > 0);
    const docs = (editingScheme.requiredDocuments || editingScheme.documentsRequired || []).filter(x => x && x.trim().length > 0);
    const proc = (editingScheme.applicationProcess || editingScheme.process || []).filter(x => x && x.trim().length > 0);

    const cleaned: SchemeItem = {
      ...editingScheme,
      published: status === 'published',
      status: status,
      slug: editingScheme.slug || editingScheme.title.toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-'),
      eligibility: elig.length > 0 ? elig : ['पात्र नागरिकांसाठी उपलब्ध'],
      benefits: bene.length > 0 ? bene : ['शासकीय नियमांनुसार आर्थिक/कल्याणकारी सहाय्य'],
      requiredDocuments: docs.length > 0 ? docs : ['आधार कार्ड', 'रहिवासी पुरावा'],
      documentsRequired: docs.length > 0 ? docs : ['आधार कार्ड', 'रहिवासी पुरावा'],
      applicationProcess: proc.length > 0 ? proc : ['अधिकृत पोर्टलवरून ऑनलाइन अर्ज करा'],
      process: proc.length > 0 ? proc : ['अधिकृत पोर्टलवरून ऑनलाइन अर्ज करा']
    };

    await saveScheme(cleaned);
    setEditingScheme(null);
    setIsCreating(false);
    showNotification(status === 'published' ? 'योजना यशस्वीरित्या प्रकाशित केली गेली!' : 'योजना मसुदा (Draft) म्हणून साठवली गेली.');
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`तुम्हाला खात्री आहे का की तुम्हाला "${name}" ही योजना हटवायची आहे?`)) {
      await deleteScheme(id);
      showNotification('योजना हटवण्यात आली.');
    }
  };

  const filteredSchemes = schemes.filter(scheme => {
    const matchSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (scheme.description && scheme.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && scheme.published !== false) ||
      (statusFilter === 'draft' && scheme.published === false);
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#201A30] font-heading flex items-center gap-2">
            <Award className="w-5 h-5 text-[#5B45B8]" />
            <span>शासकीय योजना व्यवस्थापन (Scheme Management)</span>
          </h2>
          <p className="text-xs text-[#6E6A82] mt-1">
            सरकारी योजना जोडा, संपादित करा, प्रकाशित/अप्रकाशित करा आणि अटी व कागदपत्रे अपडेट करा.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B45B8] hover:bg-[#4D39A2] text-white text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Scheme (नवीन योजना जोडा)</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#9B98A6] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="योजनेचे नाव किंवा वर्णन शोधा..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-xs outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none font-medium cursor-pointer"
          >
            <option value="all">सर्व वर्गवारी (All Categories)</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-[#EDEBF0] text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              statusFilter === 'all' ? 'bg-[#5B45B8] text-white shadow-xs' : 'text-[#6E6A82]'
            }`}
          >
            सर्व ({schemes.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              statusFilter === 'published' ? 'bg-[#5B45B8] text-white shadow-xs' : 'text-[#6E6A82]'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              statusFilter === 'draft' ? 'bg-[#5B45B8] text-white shadow-xs' : 'text-[#6E6A82]'
            }`}
          >
            Draft
          </button>
        </div>

      </div>

      {/* Schemes Table */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EDEBF0] text-[#6E6A82] bg-[#FAF9F5]">
                <th className="py-3 px-4 font-bold">योजनेचे नाव</th>
                <th className="py-3 px-4 font-bold">वर्गवारी</th>
                <th className="py-3 px-4 font-bold">अधिकृत स्त्रोत</th>
                <th className="py-3 px-4 font-bold">सत्यापन वर्ष</th>
                <th className="py-3 px-4 font-bold text-center">स्थिती (Status)</th>
                <th className="py-3 px-4 font-bold text-right">कृती (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBF0]">
              {filteredSchemes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6E6A82]">
                    कोणतीही योजना सापडली नाही.
                  </td>
                </tr>
              ) : (
                filteredSchemes.map((scheme) => {
                  const isPub = scheme.published !== false;
                  return (
                    <tr key={scheme.id} className="hover:bg-[#FAF9F5]/70 transition">
                      <td className="py-3.5 px-4 font-bold text-[#201A30] max-w-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={scheme.imageUrl || scheme.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-[#EDEBF0]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="truncate">
                            <span className="block truncate text-xs">{scheme.title}</span>
                            <span className="text-[10px] text-[#6E6A82] font-normal truncate block">
                              {(scheme.benefits && scheme.benefits[0]) || scheme.shortDescription || 'नागरिक कल्याण'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#F6F3FF] text-[#5B45B8] font-bold text-[11px] border border-[#DDD6FE]">
                          {scheme.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#464255] max-w-xs truncate">
                        <a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="hover:text-[#5B45B8] inline-flex items-center gap-1">
                          <span className="truncate">{scheme.officialSource || scheme.officialSourceName || 'अधिकृत पोर्टल'}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-[#6E6A82]">
                        {scheme.lastVerified || scheme.lastVerifiedAt || '२०२६'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleSchemeStatus(scheme.id, isPub ? 'draft' : 'published')}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                            isPub 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                          }`}
                          title="स्थिती बदलण्यासाठी क्लिक करा"
                        >
                          {isPub ? '✓ Published' : '○ Draft'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewScheme(normalizeScheme(scheme))}
                            className="p-1.5 rounded-lg text-[#6E6A82] hover:bg-[#F6F3FF] hover:text-[#5B45B8] transition cursor-pointer"
                            title="Preview (पहा)"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingScheme(normalizeScheme(scheme));
                              setIsCreating(false);
                            }}
                            className="p-1.5 rounded-lg text-[#6E6A82] hover:bg-[#F6F3FF] hover:text-[#5B45B8] transition cursor-pointer"
                            title="Edit (संपादित करा)"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(scheme.id, scheme.title)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                            title="Delete (हटवा)"
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

      {/* EDIT / CREATE MODAL */}
      {editingScheme && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEBF0]">
              <h3 className="font-bold text-base text-[#201A30] font-heading">
                {isCreating ? 'नवीन योजना जोडा (Add Scheme)' : 'योजना संपादित करा (Edit Scheme)'}
              </h3>
              <button
                onClick={() => setEditingScheme(null)}
                className="text-xs font-bold text-[#6E6A82] hover:text-black cursor-pointer"
              >
                ✕ बंद करा
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Scheme Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    योजनेचे नाव (Scheme Name) *
                  </label>
                  <input
                    type="text"
                    value={editingScheme.title}
                    onChange={(e) => setEditingScheme({ ...editingScheme, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-xs outline-none"
                    placeholder="उदा. मुख्यमंत्री माझी लाडकी बहीण योजना"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    वर्गवारी (Category) *
                  </label>
                  <select
                    value={editingScheme.category}
                    onChange={(e) => setEditingScheme({ ...editingScheme, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#201A30] mb-1">
                  योजनेचे सविस्तर वर्णन (Description) *
                </label>
                <textarea
                  rows={3}
                  value={editingScheme.description}
                  onChange={(e) => setEditingScheme({ ...editingScheme, description: e.target.value })}
                  className="w-full p-3 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-xs outline-none"
                  placeholder="योजनेचा मूळ उद्देश आणि स्वरूप..."
                />
              </div>

              {/* Eligibility Points */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#201A30]">
                    पात्रतेच्या अटी (Eligibility Criteria - प्रत्येक ओळीवर एक अट)
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingScheme({
                      ...editingScheme,
                      eligibility: [...editingScheme.eligibility, '']
                    })}
                    className="text-[11px] font-bold text-[#5B45B8] hover:underline cursor-pointer"
                  >
                    + अट जोडा
                  </button>
                </div>
                <div className="space-y-1.5">
                  {editingScheme.eligibility.map((el, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={el}
                        onChange={(e) => {
                          const updated = [...editingScheme.eligibility];
                          updated[idx] = e.target.value;
                          setEditingScheme({ ...editingScheme, eligibility: updated });
                        }}
                        placeholder={`अट ${idx + 1}`}
                        className="w-full px-3 py-1.5 bg-[#FAF9F5] border border-[#DDD6FE] rounded-lg text-xs outline-none"
                      />
                      {editingScheme.eligibility.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingScheme.eligibility.filter((_, i) => i !== idx);
                            setEditingScheme({ ...editingScheme, eligibility: updated });
                          }}
                          className="text-red-500 hover:text-red-700 px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#201A30]">
                    मिळणारे लाभ (Benefits)
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingScheme({
                      ...editingScheme,
                      benefits: [...editingScheme.benefits, '']
                    })}
                    className="text-[11px] font-bold text-[#5B45B8] hover:underline cursor-pointer"
                  >
                    + लाभ जोडा
                  </button>
                </div>
                <div className="space-y-1.5">
                  {editingScheme.benefits.map((bn, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={bn}
                        onChange={(e) => {
                          const updated = [...editingScheme.benefits];
                          updated[idx] = e.target.value;
                          setEditingScheme({ ...editingScheme, benefits: updated });
                        }}
                        placeholder={`लाभ ${idx + 1}`}
                        className="w-full px-3 py-1.5 bg-[#FAF9F5] border border-[#DDD6FE] rounded-lg text-xs outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#201A30]">
                    आवश्यक कागदपत्रे (Required Documents)
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingScheme({
                      ...editingScheme,
                      requiredDocuments: [...editingScheme.requiredDocuments, '']
                    })}
                    className="text-[11px] font-bold text-[#5B45B8] hover:underline cursor-pointer"
                  >
                    + कागदपत्र जोडा
                  </button>
                </div>
                <div className="space-y-1.5">
                  {editingScheme.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={doc}
                        onChange={(e) => {
                          const updated = [...editingScheme.requiredDocuments];
                          updated[idx] = e.target.value;
                          setEditingScheme({ ...editingScheme, requiredDocuments: updated });
                        }}
                        placeholder={`कागदपत्र ${idx + 1}`}
                        className="w-full px-3 py-1.5 bg-[#FAF9F5] border border-[#DDD6FE] rounded-lg text-xs outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Process & Where To Apply */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    अर्ज कुठे करावा (Where To Apply)
                  </label>
                  <input
                    type="text"
                    value={editingScheme.whereToApply}
                    onChange={(e) => setEditingScheme({ ...editingScheme, whereToApply: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                    placeholder="उदा. आपले सरकार पोर्टल / अंगणवाडी केंद्र"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    शेवटचे सत्यापन वर्ष (Last Verified)
                  </label>
                  <input
                    type="text"
                    value={editingScheme.lastVerified}
                    onChange={(e) => setEditingScheme({ ...editingScheme, lastVerified: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                    placeholder="२०२६"
                  />
                </div>
              </div>

              {/* Official Source & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    अधिकृत स्त्रोत (Official Source)
                  </label>
                  <input
                    type="text"
                    value={editingScheme.officialSource}
                    onChange={(e) => setEditingScheme({ ...editingScheme, officialSource: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                    placeholder="उदा. महिला व बाल विकास विभाग शासन निर्णय"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    अधिकृत वेबसाइट URL (Official Source URL)
                  </label>
                  <input
                    type="text"
                    value={editingScheme.officialUrl}
                    onChange={(e) => setEditingScheme({ ...editingScheme, officialUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                    placeholder="https://ladkibahin.maharashtra.gov.in"
                  />
                </div>
              </div>

              {/* Simple Image Selector */}
              <div className="bg-[#FAF9F5] border border-[#DDD6FE] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-[#201A30]">
                      योजनेचा फोटो (Scheme Image)
                    </label>
                    <span className="text-[11px] text-[#6E6A82]">
                      16:9 Landscape • शिफारस आकार: 1200 × 675 px
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-full sm:w-48 aspect-[16/9] rounded-xl overflow-hidden bg-black/10 border border-[#EDEBF0] shrink-0">
                    <img 
                      src={editingScheme.imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80'} 
                      alt="योजना फोटो"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <input 
                      type="file"
                      id="scheme-img-upload"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const compressed = await compressImageFile(file, 1200, 675, 0.90);
                          if (compressed) {
                            setEditingScheme({ ...editingScheme, imageUrl: compressed });
                          }
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="scheme-img-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F6F3FF] border-2 border-[#DDD6FE] hover:border-[#5B45B8] text-[#201A30] text-xs font-bold rounded-xl cursor-pointer shadow-2xs transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#5B45B8]" />
                      <span>फोटो बदला</span>
                    </label>
                    <p className="text-[11px] text-[#6E6A82]">
                      JPG, PNG किंवा WEBP फोटो निवडा.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#EDEBF0] flex flex-wrap items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingScheme(null)}
                className="px-4 py-2 text-xs font-bold text-[#6E6A82] hover:bg-[#FAF9F5] rounded-xl transition"
              >
                रद्द करा
              </button>

              <button
                type="button"
                onClick={() => handleSave('draft')}
                className="px-4 py-2 text-xs font-bold bg-[#FAF9F5] hover:bg-[#F6F3FF] border border-[#DDD6FE] text-[#5B45B8] rounded-xl transition"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleSave('published')}
                className="px-5 py-2 text-xs font-bold bg-[#5B45B8] hover:bg-[#4D39A2] text-white rounded-xl shadow-xs transition"
              >
                Publish करा
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewScheme && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEBF0]">
              <span className="text-xs font-bold text-[#5B45B8]">योजना माहिती प्रिव्ह्यू (Scheme Preview)</span>
              <button 
                type="button" 
                onClick={() => setPreviewScheme(null)} 
                className="text-xs font-bold text-[#6E6A82] hover:text-[#201A30] cursor-pointer"
              >
                ✕ बंद करा
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={previewScheme.imageUrl || previewScheme.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover border border-[#EDEBF0] shrink-0"
                />
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F6F3FF] text-[#5B45B8] text-xs font-bold border border-[#DDD6FE]">
                    {previewScheme.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#201A30]">{previewScheme.title}</h3>
                  <p className="text-[11px] text-[#6E6A82]">{previewScheme.department || 'महाराष्ट्र शासन'}</p>
                </div>
              </div>

              <p className="text-xs text-[#464255] leading-relaxed bg-[#FAF9F5] p-3 rounded-xl border border-[#EDEBF0]">
                {previewScheme.description || previewScheme.shortDescription || 'माहिती उपलब्ध नाही'}
              </p>
              
              {/* Eligibility */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1.5">
                <div className="font-bold text-[#166534]">पात्रतेच्या अटी:</div>
                <ul className="list-disc list-inside space-y-1 text-[#14532D]">
                  {(previewScheme.eligibility || []).length > 0 ? (
                    (previewScheme.eligibility || []).map((e, i) => <li key={i}>{e}</li>)
                  ) : (
                    <li>पात्र नागरिकांसाठी उपलब्ध</li>
                  )}
                </ul>
              </div>

              {/* Benefits */}
              <div className="p-3.5 bg-[#F6F3FF] border border-[#DDD6FE] rounded-xl text-xs space-y-1.5">
                <div className="font-bold text-[#5B45B8]">मिळणारे लाभ:</div>
                <ul className="list-disc list-inside space-y-1 text-[#4338CA]">
                  {(previewScheme.benefits || []).length > 0 ? (
                    (previewScheme.benefits || []).map((b, i) => <li key={i}>{b}</li>)
                  ) : (
                    <li>शासकीय नियमांनुसार आर्थिक/कल्याणकारी सहाय्य</li>
                  )}
                </ul>
              </div>

              {/* Documents */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1.5">
                <div className="font-bold text-[#92400E]">आवश्यक कागदपत्रे:</div>
                <ul className="list-disc list-inside space-y-1 text-[#78350F]">
                  {(previewScheme.requiredDocuments || previewScheme.documentsRequired || []).length > 0 ? (
                    (previewScheme.requiredDocuments || previewScheme.documentsRequired || []).map((d, i) => <li key={i}>{d}</li>)
                  ) : (
                    <li>आधार कार्ड, रहिवासी पुरावा</li>
                  )}
                </ul>
              </div>

              {/* Application Details */}
              <div className="text-xs text-[#6E6A82] space-y-1 pt-1">
                <div><strong className="text-[#201A30]">अर्ज कुठे करावा:</strong> {previewScheme.whereToApply || previewScheme.applicationWhere || 'आपले सरकार पोर्टल / सेवा केंद्र'}</div>
                <div><strong className="text-[#201A30]">अधिकृत स्त्रोत:</strong> {previewScheme.officialSource || previewScheme.officialSourceName || 'महाराष्ट्र शासन अधिकृत शासन निर्णय (GR)'}</div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#EDEBF0]">
              <button 
                type="button" 
                onClick={() => setPreviewScheme(null)} 
                className="px-5 py-2 bg-[#5B45B8] hover:bg-[#4D39A2] text-white text-xs font-bold rounded-xl cursor-pointer transition"
              >
                ठीक आहे (Close)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
