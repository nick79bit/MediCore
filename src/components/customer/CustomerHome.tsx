import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Mic, 
  Upload, 
  Pill, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight,
  TrendingDown,
  AlertTriangle,
  X,
  Star,
  Zap,
  Activity,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Medicine } from '../../types';

interface CustomerHomeProps {
  onSelectMedicine: (medicine: Medicine) => void;
  onOpenOcrModal: () => void;
  onOpenVoiceModal: () => void;
}

const CATEGORIES = [
  { label: 'All', emoji: '💊' },
  { label: 'Fever & Pain', emoji: '🌡️' },
  { label: 'Antibiotics', emoji: '🦠' },
  { label: 'Cardiac / BP', emoji: '❤️' },
  { label: 'Diabetes', emoji: '🩸' },
  { label: 'Gastric / GERD', emoji: '🫁' },
];

const POPULAR_SEARCHES = ['Crocin 650', 'Augmentin 625 Duo', 'Telma 40', 'Glycomet 500 SR', 'Pan 40'];

const TRUST_STATS = [
  { value: '62.4%', label: 'Avg Savings', icon: TrendingDown, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { value: '4+', label: 'Verified Hubs', icon: MapPin, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
  { value: '99.1%', label: 'Stock Accuracy', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { value: '< 8m', label: 'SLA Response', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
];

export const CustomerHome: React.FC<CustomerHomeProps> = ({ 
  onSelectMedicine,
  onOpenOcrModal,
  onOpenVoiceModal
}) => {
  const { 
    medicines, 
    orders, 
    customerProfile, 
    setTrackingOrderId, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const activeOrder = (orders || []).find(o => 
    o?.status === 'Ready for Pickup' || o?.status === 'Stock Reserved' || o?.status === 'Broadcasted'
  );

  const filteredMedicines = (medicines || []).filter(m => {
    if (!m) return false;
    const q = (searchQuery || '').toLowerCase();
    const matchesQuery = 
      (m.brandName || '').toLowerCase().includes(q) ||
      (m.activeSalt || '').toLowerCase().includes(q) ||
      (m.commonUses || []).some(u => (u || '').toLowerCase().includes(q));

    if (selectedCategory === 'All') return matchesQuery;
    if (selectedCategory === 'Fever & Pain') return matchesQuery && ((m.activeSalt || '').includes('Paracetamol') || (m.commonUses || []).some(u => (u || '').includes('Fever')));
    if (selectedCategory === 'Antibiotics') return matchesQuery && ((m.activeSalt || '').includes('Amoxicillin') || (m.scheduleCategory || '').includes('H1'));
    if (selectedCategory === 'Cardiac / BP') return matchesQuery && ((m.activeSalt || '').includes('Telmisartan') || (m.commonUses || []).some(u => (u || '').includes('hypertension')));
    if (selectedCategory === 'Diabetes') return matchesQuery && ((m.activeSalt || '').includes('Metformin') || (m.commonUses || []).some(u => (u || '').includes('Diabetes')));
    if (selectedCategory === 'Gastric / GERD') return matchesQuery && ((m.activeSalt || '').includes('Pantoprazole') || (m.commonUses || []).some(u => (u || '').includes('GERD')));
    return matchesQuery;
  });

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Allergy Guard Banner */}
      {customerProfile?.knownAllergies && customerProfile.knownAllergies.length > 0 && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-2xl border border-amber-200 bg-amber-50/80 text-amber-900 animate-slide-up">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-amber-900">Active Allergy Safety Guard</p>
            <p className="text-amber-700 mt-0.5">
              ABHA registered allergy: <strong className="underline">{customerProfile.knownAllergies.join(', ')}</strong>. 
              AI engine will flag contraindications automatically.
            </p>
          </div>
        </div>
      )}

      {/* Active Order Banner */}
      {activeOrder && (
        <button
          onClick={() => { setTrackingOrderId(activeOrder.id); setActiveTab('tracking'); }}
          className="w-full text-left rounded-2xl p-4 relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 100%)',
            boxShadow: '0 8px 32px -8px rgba(13,148,136,0.5)',
          }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.4), transparent)' }} />

          <div className="relative flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-200">
              <span className="w-2 h-2 rounded-full bg-teal-300 animate-ping" />
              ACTIVE ORDER • {activeOrder.id}
            </div>
            <span className="text-[11px] bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/30 font-semibold">
              {activeOrder.status}
            </span>
          </div>

          <div className="relative flex items-end justify-between">
            <div>
              <p className="font-display font-700 text-white text-base">
                {activeOrder.selectedGenericName || activeOrder.requestedMedicineName}
              </p>
              <p className="text-xs text-teal-200 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {activeOrder.pharmacyName}
                {activeOrder.counterTrayNumber && (
                  <span className="font-mono bg-white/15 px-1.5 py-0.5 rounded text-amber-300 ml-1">
                    {activeOrder.counterTrayNumber}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1 text-teal-200 text-xs font-bold group-hover:translate-x-0.5 transition-transform">
              <span>View Live Pass</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      )}

      {/* Hero / Search Section */}
      <div
        className="rounded-2xl p-5 sm:p-6 border border-teal-100/60 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(240,253,251,0.9) 0%, rgba(248,250,252,1) 100%)',
          boxShadow: '0 2px 16px -4px rgba(13,148,136,0.1)',
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none -mr-10 -mt-10"
          style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />

        <div className="relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mb-3"
            style={{ background: 'rgba(13,148,136,0.1)', color: '#0f766e', border: '1px solid rgba(13,148,136,0.2)' }}>
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            MedNorm-Bio AI Clinical Salt Matcher
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-800 text-slate-900 tracking-tight leading-tight mb-2">
            Find Bioequivalent Generics<br className="hidden sm:block" />
            <span style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              &amp; Compare Real Prices
            </span>
          </h1>
          <p className="text-xs text-slate-500 mb-5 max-w-lg">
            Search any brand name or chemical salt. Compare dissolution standards and reserve stock at verified Nashik pharmacies instantly.
          </p>

          {/* Search Bar */}
          <div
            className="flex items-center rounded-2xl border-2 bg-white transition-all overflow-hidden mb-3"
            style={{ borderColor: 'rgba(13,148,136,0.3)', boxShadow: '0 4px 16px -4px rgba(13,148,136,0.12)' }}
            onFocus={() => {}}
          >
            <div className="pl-4 text-teal-500 shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="customer-medicine-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brand name, salt (e.g. Crocin 650, Paracetamol)..."
              className="w-full py-3.5 pl-3 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              style={{ fontFamily: 'var(--font-sans)', background: 'transparent' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1.5 text-slate-400 hover:text-slate-600 mr-1">
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-1 pr-2 shrink-0">
              <button
                id="voice-search-btn"
                onClick={onOpenVoiceModal}
                title="Voice Search"
                className="p-2 rounded-xl text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                id="ocr-upload-btn"
                onClick={onOpenOcrModal}
                title="Upload Prescription"
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors"
                style={{ background: 'rgba(13,148,136,0.07)', color: '#0f766e', borderColor: 'rgba(13,148,136,0.2)' }}
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Scan Rx</span>
              </button>
            </div>
          </div>

          {/* Popular search chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all hover:scale-105"
                style={{
                  background: searchQuery === term ? 'rgba(13,148,136,0.08)' : '#f8fafc',
                  color: searchQuery === term ? '#0f766e' : '#475569',
                  borderColor: searchQuery === term ? 'rgba(13,148,136,0.25)' : '#e2e8f0',
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setSelectedCategory(cat.label)}
            className="whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              background: selectedCategory === cat.label ? 'linear-gradient(135deg, #0d9488, #0891b2)' : '#ffffff',
              color: selectedCategory === cat.label ? '#ffffff' : '#475569',
              border: selectedCategory === cat.label ? '1px solid transparent' : '1px solid #e2e8f0',
              boxShadow: selectedCategory === cat.label ? '0 2px 8px -2px rgba(13,148,136,0.4)' : '0 1px 3px rgba(0,0,0,0.04)',
              transform: selectedCategory === cat.label ? 'scale(1.03)' : 'scale(1)',
            }}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-display font-700 text-slate-900 tracking-tight">
          {searchQuery
            ? <><span className="text-gradient">{filteredMedicines.length}</span> Matching Medicines</>
            : 'Originator Brands & Active Salts'
          }
        </h2>
        <span className="text-[11px] text-slate-400 hidden sm:block">
          Click any card to view generics &amp; price breakdown
        </span>
      </div>

      {/* Medicine Cards */}
      {filteredMedicines.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center bg-white/60">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <Pill className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-sm font-display font-700 text-slate-800">No matching medicine found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Try a molecule name like 'Paracetamol', 'Amoxicillin', or scan your prescription.
          </p>
          <button
            onClick={onOpenOcrModal}
            className="mt-4 btn btn-primary text-xs px-4 py-2"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Prescription
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger">
          {filteredMedicines.map((med) => {
            const isOriginator = !med.isGeneric;
            const savingsPct = isOriginator ? null : Math.round((1 - med.mrp / (med.mrp / (1 - 0.6))) * 100);
            return (
              <button
                key={med.id}
                id={`medicine-card-${med.id}`}
                onClick={() => onSelectMedicine(med)}
                className="card text-left p-4 group animate-fade-in cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`badge text-[10px] ${isOriginator ? 'badge-neutral' : 'badge-success'}`}>
                      {isOriginator ? 'Originator' : '✓ Bioequivalent'}
                    </span>
                    <span className="badge badge-neutral text-[10px]">{med.scheduleCategory}</span>
                    {!isOriginator && (
                      <span className="badge badge-brand text-[10px]">Jan Aushadhi</span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-400 leading-none">MRP</p>
                    <p className="text-base font-display font-800 text-slate-900">₹{med.mrp.toFixed(2)}</p>
                    {!isOriginator && (
                      <p className="text-[10px] text-emerald-600 font-bold">Save ~60%</p>
                    )}
                  </div>
                </div>

                <h3 className="font-display font-700 text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                  {med.brandName}
                </h3>
                <p className="text-[11px] font-mono text-teal-700 font-semibold mt-0.5 truncate">
                  {med.activeSalt}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="truncate max-w-[160px]">
                      {med.manufacturer}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {med.rating}
                    </span>
                  </div>
                  <span className="flex items-center gap-0.5 text-teal-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    View Generics
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Hover accent bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(90deg, #0d9488, #0891b2)' }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Nashik Pilot Stats Strip */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-xs font-display font-700 text-slate-800 tracking-wide uppercase">
              Nashik Pilot Cluster Network
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 stagger">
          {TRUST_STATS.map((s) => (
            <div key={s.label} className={`${s.bg} ${s.border} border rounded-xl p-2.5 text-center animate-fade-in`}>
              <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
              <p className={`text-sm font-display font-800 ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
