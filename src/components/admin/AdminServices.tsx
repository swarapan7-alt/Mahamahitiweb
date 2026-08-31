import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  ExternalLink,
  Upload
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { GovernmentService } from '../../types';

export const AdminServices: React.FC = () => {
  const { services, saveService, deleteService, toggleServiceStatus } = useAdminAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingService, setEditingService] = useState<GovernmentService | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState('');

  const categories = ['डिजिटल सेवा', 'महसूल व जमीन', 'कृषी व शेतकरी', 'विद्यार्थी व शिक्षण', 'आरोग्य'];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const normalizeService = (raw: any): GovernmentService => {
    if (!raw) return raw;
    const feats = Array.isArray(raw.features) && raw.features.length > 0
      ? [...raw.features]
      : (Array.isArray(raw.keyBenefits) && raw.keyBenefits.length > 0
        ? [...raw.keyBenefits]
        : ['']);

    const docs = Array.isArray(raw.requiredDocuments) && raw.requiredDocuments.length > 0
      ? [...raw.requiredDocuments]
      : (Array.isArray(raw.documentsRequired) && raw.documentsRequired.length > 0
        ? [...raw.documentsRequired]
        : ['']);

    const access = Array.isArray(raw.howToAccess) && raw.howToAccess.length > 0
      ? [...raw.howToAccess]
      : (Array.isArray(raw.steps) && raw.steps.length > 0
        ? [...raw.steps]
        : ['']);

    return {
      ...raw,
      id: raw.id || `service-${Date.now()}`,
      title: raw.title || '',
      titleEnglish: raw.titleEnglish || '',
      slug: raw.slug || '',
      category: raw.category || 'डिजिटल सेवा',
      department: raw.department || 'महाराष्ट्र शासन / भारत सरकार',
      description: raw.description || '',
      targetAudience: raw.targetAudience || 'महाराष्ट्रातील सर्व पात्र नागरिक',
      features: feats,
      requiredDocuments: docs,
      howToAccess: access,
      portalUrl: raw.portalUrl || raw.officialUrl || 'https://aaplesarkar.mahaonline.gov.in',
      officialUrl: raw.officialUrl || raw.portalUrl || 'https://aaplesarkar.mahaonline.gov.in',
      lastVerified: raw.lastVerified || '२०२६',
      imageUrl: raw.imageUrl || raw.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      published: raw.published !== false,
      status: raw.status || (raw.published === false ? 'draft' : 'published')
    };
  };

  const handleStartCreate = () => {
    const newService: GovernmentService = normalizeService({
      id: `service-${Date.now()}`,
      title: '',
      titleEnglish: '',
      slug: '',
      category: 'डिजिटल सेवा',
      department: 'महाराष्ट्र शासन / भारत सरकार',
      description: '',
      targetAudience: 'महाराष्ट्रातील सर्व पात्र नागरिक',
      features: [''],
      requiredDocuments: [''],
      howToAccess: [''],
      portalUrl: 'https://aaplesarkar.mahaonline.gov.in',
      officialUrl: 'https://aaplesarkar.mahaonline.gov.in',
      lastVerified: '२०२६',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      published: true,
      status: 'published'
    });
    setEditingService(newService);
    setIsCreating(true);
  };

  const handleSave = async (status: 'published' | 'draft') => {
    if (!editingService || !editingService.title.trim()) {
      alert('कृपया सेवेचे नाव प्रविष्ट करा.');
      return;
    }

    const feats = (editingService.features || []).filter(x => x && x.trim().length > 0);
    const docs = (editingService.requiredDocuments || []).filter(x => x && x.trim().length > 0);
    const access = (editingService.howToAccess || []).filter(x => x && x.trim().length > 0);

    const cleaned: GovernmentService = {
      ...editingService,
      published: status === 'published',
      status: status,
      slug: editingService.slug || editingService.title.toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-'),
      features: feats.length > 0 ? feats : ['ऑनलाइन शासकीय सुविधा'],
      requiredDocuments: docs.length > 0 ? docs : ['आधार कार्ड'],
      howToAccess: access.length > 0 ? access : ['अधिकृत पोर्टलवरून ऑनलाइन वापर करा']
    };

    await saveService(cleaned);
    setEditingService(null);
    setIsCreating(false);
    showNotification(status === 'published' ? 'शासकीय सेवा प्रकाशित झाली!' : 'सेवा मसुदा (Draft) म्हणून साठवली.');
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`तुम्हाला खात्री आहे का की "${name}" ही सेवा हटवायची आहे?`)) {
      await deleteService(id);
      showNotification('सेवा हटवली गेली.');
    }
  };

  const filteredServices = services.filter(srv => {
    return srv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (srv.description && srv.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#201A30] font-heading flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#5B45B8]" />
            <span>शासकीय सेवा व्यवस्थापन (Government Services Management)</span>
          </h2>
          <p className="text-xs text-[#6E6A82] mt-1">
            शासकीय पोर्टल्स, ७/१२ उतारा, महाडीबीटी, आधार सेवा आणि डिजिटल सुविधांची माहिती व्यवस्थापित करा.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B45B8] hover:bg-[#4D39A2] text-white text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service (नवीन सेवा जोडा)</span>
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
            placeholder="शासकीय सेवेचे किंवा पोर्टलचे नाव शोधा (उदा. आपले सरकार, महाभूलेख)..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EDEBF0] text-[#6E6A82] bg-[#FAF9F5]">
                <th className="py-3 px-4 font-bold">सेवेचे नाव</th>
                <th className="py-3 px-4 font-bold">विभाग</th>
                <th className="py-3 px-4 font-bold">अधिकृत पोर्टल लिंक</th>
                <th className="py-3 px-4 font-bold text-center">स्थिती (Status)</th>
                <th className="py-3 px-4 font-bold text-right">कृती (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBF0]">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6E6A82]">
                    कोणतीही शासकीय सेवा सापडली नाही.
                  </td>
                </tr>
              ) : (
                filteredServices.map((srv) => {
                  const isPub = srv.published !== false;
                  return (
                    <tr key={srv.id} className="hover:bg-[#FAF9F5]/70 transition">
                      <td className="py-3.5 px-4 font-bold text-[#201A30]">
                        <div>
                          <span className="block">{srv.title}</span>
                          <span className="text-[10px] text-[#6E6A82] font-normal block">
                            {srv.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#464255]">
                        {srv.department}
                      </td>
                      <td className="py-3.5 px-4 text-[#5B45B8]">
                        <a href={srv.portalUrl} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">
                          <span className="truncate max-w-xs">{srv.portalUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleServiceStatus(srv.id, isPub ? 'draft' : 'published')}
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
                            type="button"
                            onClick={() => {
                              setEditingService(normalizeService(srv));
                              setIsCreating(false);
                            }}
                            className="p-1.5 rounded-lg text-[#6E6A82] hover:bg-[#F6F3FF] hover:text-[#5B45B8] transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(srv.id, srv.title)}
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
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEBF0]">
              <h3 className="font-bold text-base text-[#201A30]">
                {isCreating ? 'नवीन शासकीय सेवा जोडा' : 'शासकीय सेवा संपादित करा'}
              </h3>
              <button onClick={() => setEditingService(null)} className="text-xs font-bold text-[#6E6A82]">✕ बंद करा</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    सेवेचे नाव (Service Name) *
                  </label>
                  <input
                    type="text"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                    placeholder="उदा. आपले सरकार डिजिटल सेवा पोर्टल"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    वर्गवारी (Category)
                  </label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201A30] mb-1">
                  सेवेचे वर्णन (Description)
                </label>
                <textarea
                  rows={2}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full p-3 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  placeholder="सेवेचे स्वरूप आणि नागरिकांना मिळणारा फायदा..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    कोणासाठी उपलब्ध (Who Can Apply)
                  </label>
                  <input
                    type="text"
                    value={editingService.targetAudience}
                    onChange={(e) => setEditingService({ ...editingService, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                    placeholder="उदा. महाराष्ट्रातील सर्व रहिवासी व शेतकरी"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">
                    सत्यापन वर्ष (Last Verified)
                  </label>
                  <input
                    type="text"
                    value={editingService.lastVerified}
                    onChange={(e) => setEditingService({ ...editingService, lastVerified: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#201A30]">
                    वापराची पायरी किंवा प्रक्रिया (How to Access Steps)
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingService({
                      ...editingService,
                      howToAccess: [...editingService.howToAccess, '']
                    })}
                    className="text-[11px] font-bold text-[#5B45B8] hover:underline"
                  >
                    + पायरी जोडा
                  </button>
                </div>
                <div className="space-y-1.5">
                  {editingService.howToAccess.map((step, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const updated = [...editingService.howToAccess];
                          updated[idx] = e.target.value;
                          setEditingService({ ...editingService, howToAccess: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-[#FAF9F5] border border-[#DDD6FE] rounded-lg text-xs outline-none"
                        placeholder={`पायरी ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201A30] mb-1">
                  अधिकृत पोर्टल URL (Official Portal URL)
                </label>
                <input
                  type="text"
                  value={editingService.portalUrl}
                  onChange={(e) => setEditingService({ ...editingService, portalUrl: e.target.value, officialUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  placeholder="https://aaplesarkar.mahaonline.gov.in"
                />
              </div>

              {/* Simple Image Selector */}
              <div className="bg-[#FAF9F5] border border-[#DDD6FE] rounded-2xl p-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#201A30]">
                    सेवेचा फोटो (Service Image)
                  </label>
                  <span className="text-[11px] text-[#6E6A82]">
                    16:9 Landscape • शिफारस आकार: 1200 × 675 px
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-full sm:w-48 aspect-[16/9] rounded-xl overflow-hidden bg-black/10 border border-[#EDEBF0] shrink-0">
                    <img 
                      src={editingService.imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'} 
                      alt="सेवा फोटो"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <input 
                      type="file"
                      id="service-img-upload"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setEditingService({ ...editingService, imageUrl: ev.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="service-img-upload"
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

            <div className="pt-4 border-t border-[#EDEBF0] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingService(null)}
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
