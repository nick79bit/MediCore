import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Mic, 
  Upload, 
  ShieldAlert, 
  Pill, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight,
  TrendingDown,
  FileText,
  AlertTriangle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Medicine } from '../../types';

interface CustomerHomeProps {
  onSelectMedicine: (medicine: Medicine) => void;
  onOpenOcrModal: () => void;
  onOpenVoiceModal: () => void;
}

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

  // Categories
  const categories = ['All', 'Fever & Pain', 'Antibiotics', 'Cardiac / BP', 'Diabetes', 'Gastric / GERD'];

  // Quick popular searches
  const popularSearches = [
    'Crocin 650',
    'Augmentin 625 Duo',
    'Telma 40',
    'Glycomet 500 SR',
    'Pan 40'
  ];

  // Active orders ready for pickup or in progress
  const activeOrder = (orders || []).find(o => o?.status === 'Ready for Pickup' || o?.status === 'Stock Reserved' || o?.status === 'Broadcasted');

  // Filter medicines by query and category
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
    <div className="space-y-6">
      
      {/* Allergy Warning Banner if applicable */}
      {customerProfile?.knownAllergies && customerProfile.knownAllergies.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-900 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-amber-950">Active Patient Safety Allergy Guard</p>
            <p className="text-amber-800 mt-0.5">
              ABHA profile has registered allergy for: <strong className="underline">{customerProfile.knownAllergies.join(', ')}</strong>. 
              The AI matching engine will automatically highlight contraindication alerts for beta-lactams and sulfa compounds.
            </p>
          </div>
        </div>
      )}

      {/* Active Order Banner if one exists */}
      {activeOrder && (
        <div 
          onClick={() => {
            setTrackingOrderId(activeOrder.id);
            setActiveTab('tracking');
          }}
          className="bg-teal-900 text-white rounded-2xl p-4 shadow-lg shadow-teal-950/20 cursor-pointer hover:bg-teal-950 transition-all border border-teal-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>ACTIVE ORDER IN PROGRESS • {activeOrder.id}</span>
            </div>
            <span className="text-xs bg-teal-800 px-2.5 py-1 rounded-full font-medium border border-teal-600">
              {activeOrder.status}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="font-bold text-base text-white">
                {activeOrder.selectedGenericName || activeOrder.requestedMedicineName}
              </p>
              <p className="text-xs text-teal-200 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {activeOrder.pharmacyName}
                {activeOrder.counterTrayNumber && (
                  <span className="font-mono bg-teal-800/80 px-1.5 py-0.5 rounded text-amber-300 ml-1">
                    {activeOrder.counterTrayNumber}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-1 text-teal-300 text-xs font-semibold">
              <span>View Live Pass</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Hero / Search Section */}
      <div className="bg-gradient-to-b from-teal-50/70 to-white p-5 sm:p-6 rounded-2xl border border-teal-100 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>MedNorm-Bio AI Clinical Salt Matcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Find Bioequivalent Generics & Compare Real Store Prices
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Search any brand name or chemical salt. Compare active formulations, dissolution standards, and secure immediate pickup at verified Nashik pharmacies.
          </p>
        </div>

        {/* Search Bar with OCR & Voice buttons */}
        <div className="mt-5 relative">
          <div className="relative flex items-center shadow-md shadow-teal-900/5 rounded-2xl border-2 border-teal-600/30 focus-within:border-teal-600 bg-white transition-all overflow-hidden">
            <div className="pl-4 text-teal-600">
              <Search className="w-5 h-5" />
            </div>
            
            <input
              id="customer-medicine-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, salt (e.g. Crocin 650, Augmentin, Paracetamol)..."
              className="w-full py-3.5 pl-3 pr-28 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Voice & OCR Action Buttons */}
            <div className="absolute right-2 flex items-center gap-1">
              <button
                id="voice-search-btn"
                onClick={onOpenVoiceModal}
                title="Voice Search (Simulated Speech Recognition)"
                className="p-2 rounded-xl text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                id="ocr-upload-btn"
                onClick={onOpenOcrModal}
                title="Upload Prescription (OCR Medicine Extractor)"
                className="flex items-center gap-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-teal-200 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Scan Rx</span>
              </button>
            </div>
          </div>

          {/* Quick popular pills */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="text-[11px] bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium px-2.5 py-1 rounded-lg transition-colors border border-slate-200/60"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Results / Medicines Catalogue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            {searchQuery ? `Matching Medicines (${filteredMedicines.length})` : 'Common Originator Brands & Active Salts'}
          </h2>
          <span className="text-xs text-slate-500">
            Click any medicine to view generic alternatives & price breakdown
          </span>
        </div>

        {filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No matching medicine found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try searching by molecule salt like &apos;Paracetamol&apos;, &apos;Amoxicillin&apos;, or use the prescription scanner.
            </p>
            <button
              onClick={onOpenOcrModal}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Doctor Prescription
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMedicines.map((med) => {
              const isOriginator = !med.isGeneric;
              return (
                <div
                  key={med.id}
                  id={`medicine-card-${med.id}`}
                  onClick={() => onSelectMedicine(med)}
                  className="bg-white rounded-xl p-4 border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group text-left relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isOriginator 
                            ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isOriginator ? 'Originator / Branded' : 'Generic Bioequivalent'}
                        </span>
                        <span className="text-[10px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          {med.scheduleCategory}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base mt-1.5 group-hover:text-teal-700 transition-colors">
                        {med.brandName}
                      </h3>
                      <p className="text-xs font-mono text-teal-800 font-medium mt-0.5">
                        {med.activeSalt}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400">MRP</span>
                      <p className="text-base font-bold text-slate-900">₹{med.mrp.toFixed(2)}</p>
                      <span className="text-[10px] text-slate-500">{med.packaging}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate max-w-[200px]">
                      Mfg: <span className="text-slate-700 font-medium">{med.manufacturer}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>View Generics & Prices</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pilot Cluster & Trust Signals Section */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Nashik Pilot Cluster Network
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Live Geo-fencing Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
            <p className="text-slate-400 text-[10px]">Active Hubs</p>
            <p className="font-bold text-slate-800 text-sm mt-0.5">4 Dispensaries</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">College & Gangapur Rd</p>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
            <p className="text-slate-400 text-[10px]">Avg Savings</p>
            <p className="font-bold text-teal-700 text-sm mt-0.5">62.4%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Per Chronic Refill</p>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
            <p className="text-slate-400 text-[10px]">Stock Accuracy</p>
            <p className="font-bold text-slate-800 text-sm mt-0.5">99.1%</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">POS Synced &lt;15m</p>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
            <p className="text-slate-400 text-[10px]">SLA Response</p>
            <p className="font-bold text-slate-800 text-sm mt-0.5">&lt; 8 Mins</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Counter Tray Reservation</p>
          </div>
        </div>
      </div>

    </div>
  );
};
