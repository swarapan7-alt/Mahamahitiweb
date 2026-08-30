import React, { useState } from 'react';
import { 
  BellRing, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LatestUpdate } from '../../types';

export const AdminLatest: React.FC = () => {
  const { updates, saveUpdate, deleteUpdate } = useAdminAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUpdate, setEditingUpdate] = useState<LatestUpdate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleStartCreate = () => {
    const newUpdate: LatestUpdate = {
      id: `up-${Date.now()}`,
      title: '',
      slug: '',
      category: 'योजना',
      shortDescription: '',
      content: '',
      publishedDate: '२०२६',
      verified: true,
      officialSource: 'महाराष्ट्र शासन अधिकृत पोर्टल',
      officialUrl: 'https://maharashtra.gov.in'
    };
    setEditingUpdate(newUpdate);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editingUpdate || !editingUpdate.title.trim()) {
      alert('कृपया शीर्षकाची नोंद करा.');
      return;
    }

    const cleaned: LatestUpdate = {
      ...editingUpdate,
      slug: editingUpdate.slug || editingUpdate.title.toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-')
    };

    await saveUpdate(cleaned);
    setEditingUpdate(null);
    setIsCreating(false);
    showNotification('नवीन माहिती यशस्वीरित्या साठवली गेली!');
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`"${title}" ही माहिती काढून टाकायची आहे का?`)) {
      await deleteUpdate(id);
      showNotification('माहिती काढून टाकली गेली.');
    }
  };

  const filteredUpdates = updates.filter(u => 
    u.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#201A30] font-heading flex items-center gap-2">
            <BellRing className="w-5 h-5 text-[#5B45B8]" />
            <span>नवीन माहिती व मार्गदर्शक (Latest Information Management)</span>
          </h2>
          <p className="text-xs text-[#6E6A82] mt-1">
            नागरिकांसाठी ताज्या घडामोडी, महत्त्वाचे सरकारी नियम, बदल आणि मार्गदर्शक सूचना व्यवस्थापित करा.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B45B8] hover:bg-[#4D39A2] text-white text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Update (नवीन माहिती जोडा)</span>
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
            placeholder="नवीन माहिती शोधा..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F5] focus:bg-white border border-[#DDD6FE] focus:border-[#5B45B8] rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-[#EDEBF0] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EDEBF0] text-[#6E6A82] bg-[#FAF9F5]">
                <th className="py-3 px-4 font-bold">माहितीचे शीर्षक</th>
                <th className="py-3 px-4 font-bold">वर्गवारी</th>
                <th className="py-3 px-4 font-bold">तारीख / कालावधी</th>
                <th className="py-3 px-4 font-bold text-right">कृती</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBF0]">
              {filteredUpdates.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF9F5]/70 transition">
                  <td className="py-3.5 px-4 font-bold text-[#201A30] max-w-md">
                    <div>
                      <span className="block">{item.title}</span>
                      <span className="text-[10px] text-[#6E6A82] font-normal line-clamp-1">
                        {item.shortDescription}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#F6F3FF] text-[#5B45B8] font-semibold text-[11px] border border-[#DDD6FE]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#6E6A82]">
                    {item.publishedDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingUpdate({ ...item });
                          setIsCreating(false);
                        }}
                        className="p-1.5 rounded-lg text-[#6E6A82] hover:bg-[#F6F3FF] hover:text-[#5B45B8] transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingUpdate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDEBF0]">
              <h3 className="font-bold text-base text-[#201A30]">
                {isCreating ? 'नवीन माहिती जोडा' : 'माहिती संपादित करा'}
              </h3>
              <button onClick={() => setEditingUpdate(null)} className="text-xs font-bold">✕ बंद करा</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#201A30] mb-1">शीर्षक (Title) *</label>
                <input
                  type="text"
                  value={editingUpdate.title}
                  onChange={(e) => setEditingUpdate({ ...editingUpdate, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">वर्गवारी (Category)</label>
                  <input
                    type="text"
                    value={editingUpdate.category}
                    onChange={(e) => setEditingUpdate({ ...editingUpdate, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">तारीख / महिना</label>
                  <input
                    type="text"
                    value={editingUpdate.publishedDate}
                    onChange={(e) => setEditingUpdate({ ...editingUpdate, publishedDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201A30] mb-1">संक्षिप्त वर्णन (Short Description)</label>
                <textarea
                  rows={2}
                  value={editingUpdate.shortDescription}
                  onChange={(e) => setEditingUpdate({ ...editingUpdate, shortDescription: e.target.value })}
                  className="w-full p-3 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201A30] mb-1">सविस्तर मजकूर (Full Content)</label>
                <textarea
                  rows={4}
                  value={editingUpdate.content}
                  onChange={(e) => setEditingUpdate({ ...editingUpdate, content: e.target.value })}
                  className="w-full p-3 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">अधिकृत स्त्रोत</label>
                  <input
                    type="text"
                    value={editingUpdate.officialSource}
                    onChange={(e) => setEditingUpdate({ ...editingUpdate, officialSource: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#201A30] mb-1">अधिकृत URL</label>
                  <input
                    type="text"
                    value={editingUpdate.officialUrl}
                    onChange={(e) => setEditingUpdate({ ...editingUpdate, officialUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#DDD6FE] rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#EDEBF0]">
              <button onClick={() => setEditingUpdate(null)} className="px-4 py-2 text-xs font-bold text-[#6E6A82]">
                रद्द करा
              </button>
              <button onClick={handleSave} className="px-5 py-2 bg-[#5B45B8] text-white text-xs font-bold rounded-xl shadow-xs">
                Save & Publish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
