import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Users,
  MapPin,
  IndianRupee,
  Filter
} from 'lucide-react';
import { MAHARASHTRA_DISTRICTS, SCHEMES_DATA } from '../data/mockData';
import { Scheme } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';

interface EligibilityCheckerProps {
  onSelectScheme: (scheme: Scheme) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ onSelectScheme }) => {
  const { schemes: adminSchemes } = useAdminAuth();
  const [age, setAge] = useState<string>('28');
  const [gender, setGender] = useState<string>('female');
  const [district, setDistrict] = useState<string>('पुणे');
  const [income, setIncome] = useState<string>('200000'); // 2 Lakhs
  const [selectedTags, setSelectedTags] = useState<string[]>(['female']);
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [matchingSchemes, setMatchingSchemes] = useState<Scheme[]>([]);

  const allSchemes = useMemo(() => (adminSchemes && adminSchemes.length > 0 ? adminSchemes : SCHEMES_DATA), [adminSchemes]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setHasChecked(true);

    const numAge = parseInt(age, 10) || 0;
    const numIncome = parseInt(income, 10) || 0;

    const filtered = allSchemes.filter((scheme) => {
      // Ladki Bahin check
      if (scheme.id === 's-1' || scheme.id === 'scheme-ladki-bahin') {
        return gender === 'female' && numAge >= 21 && numAge <= 65 && numIncome <= 250000;
      }
      // Farmer schemes
      if (scheme.category === 'farmer' || scheme.category === 'agriculture') {
        return selectedTags.includes('farmer');
      }
      // Senior citizen scheme
      if (scheme.category === 'senior') {
        return numAge >= 60 || selectedTags.includes('senior') || selectedTags.includes('disabled');
      }
      // Worker / Vishwakarma scheme
      if (scheme.id === 's-5' || scheme.id === 'scheme-vishwakarma') {
        return selectedTags.includes('worker') || selectedTags.includes('entrepreneur');
      }
      // Health MJPJAY - universally applicable in MH
      if (scheme.category === 'health') {
        return true;
      }
      // Housing PMAY
      if (scheme.category === 'housing') {
        return numIncome <= 600000;
      }
      // Default match by audience tag
      if (selectedTags.some(t => (scheme.tags || []).includes(t))) {
        return true;
      }
      // General match
      return scheme.targetAudience?.includes(district) || false;
    });

    setMatchingSchemes(filtered.length > 0 ? filtered : allSchemes.slice(0, 3));
  };

  const handleReset = () => {
    setAge('');
    setGender('');
    setDistrict('');
    setIncome('');
    setSelectedTags([]);
    setHasChecked(false);
    setMatchingSchemes([]);
  };

  return (
    <section id="eligibility" className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="bg-[#FAF9FD] rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 border-2 border-[#E8E5F2] shadow-[0_8px_32px_rgba(91,69,198,0.06)]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2EFFD] text-[#5B45C6] text-xs sm:text-sm font-bold border border-[#DCD8EC]">
              <Sparkles className="w-4 h-4 text-[#5B45C6]" />
              <span>पात्रता तपासणी इंजिन</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight font-heading">
              तुमच्यासाठी लागू असणाऱ्या <span className="text-[#5B45C6]">योजना शोधा</span>
            </h2>
            <p className="text-[#4B5567] text-sm sm:text-base leading-relaxed font-medium">
              काही मूलभूत तपशील भरा आणि तुमच्या प्रोफाइलनुसार तात्काळ योग्य शासकीय योजना तपासा.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#4B5567] bg-white px-4 py-2.5 rounded-2xl border-2 border-[#E8E5F2] shadow-xs shrink-0 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#15966A]" />
            <span>डेटा पूर्णपणे सुरक्षित व खाजगी आहे</span>
          </div>
        </div>

        {/* Interactive Form */}
        <form onSubmit={handleCheck} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Age Input */}
            <div className="space-y-1.5 bg-white p-4 rounded-2xl border-2 border-[#E8E5F2] focus-within:border-[#5B45C6] focus-within:ring-4 focus-within:ring-[#F2EFFD] transition-all shadow-xs">
              <label className="text-xs font-bold text-[#4B5567] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#5B45C6]" />
                वय (Age in Years)
              </label>
              <input
                type="number"
                min="1"
                max="110"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="उदा. 28"
                className="w-full bg-transparent text-[#172033] text-base sm:text-lg font-bold outline-none placeholder:text-[#9B98A6]"
                required
              />
            </div>

            {/* Gender Select */}
            <div className="space-y-1.5 bg-white p-4 rounded-2xl border-2 border-[#E8E5F2] focus-within:border-[#5B45C6] focus-within:ring-4 focus-within:ring-[#F2EFFD] transition-all shadow-xs">
              <label className="text-xs font-bold text-[#4B5567]">
                लिंग (Gender)
              </label>
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  if (e.target.value === 'female' && !selectedTags.includes('female')) {
                    setSelectedTags([...selectedTags, 'female']);
                  }
                }}
                className="w-full bg-transparent text-[#172033] text-base sm:text-lg font-bold outline-none cursor-pointer"
                required
              >
                <option value="">निवडा...</option>
                <option value="female">महिला (Female)</option>
                <option value="male">पुरुष (Male)</option>
                <option value="other">इतर (Other)</option>
              </select>
            </div>

            {/* District Select */}
            <div className="space-y-1.5 bg-white p-4 rounded-2xl border-2 border-[#E8E5F2] focus-within:border-[#5B45C6] focus-within:ring-4 focus-within:ring-[#F2EFFD] transition-all shadow-xs">
              <label className="text-xs font-bold text-[#4B5567] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#5B45C6]" />
                जिल्हा (District)
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-transparent text-[#172033] text-base sm:text-lg font-bold outline-none cursor-pointer"
                required
              >
                <option value="">जिल्हा निवडा...</option>
                {MAHARASHTRA_DISTRICTS.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Annual Income */}
            <div className="space-y-1.5 bg-white p-4 rounded-2xl border-2 border-[#E8E5F2] focus-within:border-[#5B45C6] focus-within:ring-4 focus-within:ring-[#F2EFFD] transition-all shadow-xs">
              <label className="text-xs font-bold text-[#4B5567] flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-[#5B45C6]" />
                वार्षिक कौटुंबिक उत्पन्न
              </label>
              <select
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full bg-transparent text-[#172033] text-base sm:text-lg font-bold outline-none cursor-pointer"
                required
              >
                <option value="">उत्पन्न श्रेणी निवडा...</option>
                <option value="50000">₹१ लाखांपेक्षा कमी (BPL / पिवळे कार्ड)</option>
                <option value="200000">₹१ लाख ते ₹२.५ लाख (केशरी कार्ड)</option>
                <option value="500000">₹२.५ लाख ते ₹८ लाख</option>
                <option value="1000000">₹८ लाखांपेक्षा जास्त</option>
              </select>
            </div>

          </div>

          {/* Citizen Category & Occupation Tags */}
          <div className="space-y-3 pt-1">
            <label className="text-xs sm:text-sm font-bold text-[#4B5567] flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#5B45C6]" />
              <span>आपल्याशी संबंधित वर्ग निवडा (एकापेक्षा जास्त निवडू शकता):</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'female', label: 'महिला' },
                { id: 'farmer', label: 'शेतकरी' },
                { id: 'student', label: 'विद्यार्थी' },
                { id: 'worker', label: 'कामगार / कारागीर' },
                { id: 'senior', label: 'ज्येष्ठ नागरिक (६०+)' },
                { id: 'disabled', label: 'दिव्यांग' },
                { id: 'entrepreneur', label: 'नवउद्योजक / व्यावसायिक' },
              ].map((item) => {
                const isSelected = selectedTags.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleTag(item.id)}
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#5B45C6] text-white border-[#5B45C6] shadow-xs scale-102' 
                        : 'bg-white text-[#4B5567] border-[#E8E5F2] hover:border-[#5B45C6] hover:text-[#5B45C6]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#5B45C6] to-[#4530A8] hover:from-[#4530A8] hover:to-[#352088] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>पात्र योजना तपासा</span>
            </button>

            {hasChecked && (
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3.5 rounded-2xl bg-white hover:bg-[#F2EFFD] text-[#4B5567] hover:text-[#172033] text-xs sm:text-sm font-bold border-2 border-[#E8E5F2] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>पुन्हा भरा</span>
              </button>
            )}
          </div>
        </form>

        {/* Results Area */}
        {hasChecked && (
          <div className="mt-10 pt-8 border-t-2 border-[#E8E5F2]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#172033] font-heading">
                  तुमच्यासाठी संभाव्य योजना ({matchingSchemes.length})
                </h3>
              </div>

              {/* Crucial Disclaimer Notice */}
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-[#E58A24] text-xs sm:text-sm font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#E58A24]" />
                <span>संभाव्य पात्रता • अधिकृत शासन निर्णयानुसार अंतिम पडताळणी करा</span>
              </div>
            </div>

            {matchingSchemes.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border-2 border-[#E8E5F2]">
                <p className="text-[#172033] text-base mb-1 font-bold">
                  आपण भरलेल्या निकषांनुसार थेट योजना सापडल्या नाहीत.
                </p>
                <p className="text-sm text-[#4B5567] font-medium">
                  कृपया वर्ग बदला किंवा सर्व योजनांची संपूर्ण यादी तपासा.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {matchingSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="p-6 rounded-3xl bg-white border-2 border-[#E8E5F2] hover:border-[#5B45C6] transition-all flex flex-col justify-between group shadow-xs hover:shadow-[0_12px_28px_rgba(91,69,198,0.08)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-xs px-3 py-1 rounded-full bg-[#F2EFFD] text-[#5B45C6] border border-[#DCD8EC] font-bold">
                          {scheme.categoryLabel}
                        </span>
                        <span className="text-xs text-[#15966A] flex items-center gap-1 font-bold bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                          <CheckCircle className="w-3.5 h-3.5 text-[#15966A]" />
                          सत्यापित योजना
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-[#172033] mb-2 group-hover:text-[#5B45C6] transition-colors font-heading">
                        {scheme.title}
                      </h4>
                      <p className="text-sm text-[#4B5567] mb-4 line-clamp-2 leading-relaxed font-medium">
                        {scheme.shortDescription}
                      </p>

                      <div className="text-xs sm:text-sm text-[#4B5567] bg-[#FAF9FD] p-3.5 rounded-2xl border border-[#E8E5F2] mb-4 font-medium">
                        <strong className="text-[#172033] font-bold">पात्रता:</strong> {scheme.targetAudience}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectScheme(scheme)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#5B45C6] to-[#4530A8] hover:from-[#4530A8] hover:to-[#352088] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <span>सविस्तर माहिती व कागदपत्रे पाहा</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};

