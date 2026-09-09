import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingDown, 
  Info, 
  Check, 
  Store, 
  Scale, 
  Pill,
  ChevronRight,
  Zap,
  Star,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Medicine } from '../../types';

interface MedicineSearchResultsProps {
  medicine: Medicine;
  onBack: () => void;
  onOpenComparisonModal: (genericMed?: Medicine) => void;
  onRequestAvailability: (genericMed?: Medicine) => void;
  onViewPharmacies: (selectedMed: Medicine) => void;
}

// Bioavailability confidence bar component
const ConfidenceBar: React.FC<{ value: number; label: string; color?: string }> = ({ 
  value, label, color = '#0d9488' 
}) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      <span className="text-[11px] font-bold text-slate-800">{(value * 100).toFixed(1)}%</span>
    </div>
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${value * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
      />
    </div>
  </div>
);

export const MedicineSearchResults: React.FC<MedicineSearchResultsProps> = ({
  medicine,
  onBack,
  onOpenComparisonModal,
  onRequestAvailability,
  onViewPharmacies
}) => {
  const { findGenericMatches, customerProfile } = useApp();
  const genericMatches = findGenericMatches(medicine);

  const hasPenicillinAllergy = customerProfile.knownAllergies.some(a => a.toLowerCase().includes('penicillin'));
  const isPenicillinBased = medicine.activeSalt.toLowerCase().includes('amoxicillin') || 
                            medicine.activeSalt.toLowerCase().includes('clavulanic') ||
                            medicine.activeSalt.toLowerCase().includes('penicillin');
  const showAllergyAlert = hasPenicillinAllergy && isPenicillinBased;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Back + CDSCO ref */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-all hover:shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Search
        </button>
        <span className="text-[10px] text-slate-400 font-mono bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
          CDSCO: {medicine.cdscoApprovalNumber}
        </span>
      </div>

      {/* Allergy Alert */}
      {showAllergyAlert && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border-2 border-red-300 bg-red-50 animate-slide-up">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-display font-700 text-red-900 text-sm">Critical Patient Allergy Warning</p>
            <p className="mt-1 text-red-700 leading-relaxed">
              Your ABHA profile records a known hypersensitivity to <strong>Penicillin</strong>.
              This medicine contains <strong>{medicine.activeSalt}</strong> (beta-lactam class).
              Do not consume without consulting a registered medical practitioner.
            </p>
          </div>
        </div>
      )}

      {/* Reference Medicine Card */}
      <div className="rounded-2xl p-5 border border-slate-200 bg-white relative overflow-hidden"
        style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-5 -mr-8 -mt-8"
          style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="badge badge-neutral text-[10px]">Reference Branded</span>
              <span className={`badge text-[10px] ${medicine.scheduleCategory.includes('H') ? 'badge-warning' : 'badge-success'}`}>
                {medicine.scheduleCategory}
              </span>
              {medicine.requiresPrescription && (
                <span className="badge badge-danger text-[10px]">Rx Required</span>
              )}
            </div>

            <h1 className="text-2xl font-display font-800 text-slate-900 tracking-tight">
              {medicine.brandName}
            </h1>
            <p className="text-sm font-mono text-teal-700 font-semibold mt-1">
              {medicine.activeSalt}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {medicine.manufacturer} • {medicine.packaging}
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Branded MRP</span>
            <p className="text-3xl font-display font-800 text-slate-900">₹{medicine.mrp.toFixed(2)}</p>
            <p className="text-xs text-slate-400">₹{medicine.unitPrice.toFixed(2)}/unit</p>
          </div>
        </div>

        {/* Bio metrics */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ConfidenceBar value={medicine.bioavailabilityRatio} label="Bioavailability" />
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Dissolution Rate</p>
            <p className="text-xs font-semibold text-slate-800">{medicine.dissolutionRate}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Indications</p>
            <p className="text-xs font-semibold text-slate-800 truncate">{medicine.commonUses.slice(0, 2).join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Generic Alternatives Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.15), rgba(8,145,178,0.1))', border: '1px solid rgba(13,148,136,0.2)' }}>
              <Sparkles className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <h2 className="text-base font-display font-700 text-slate-900">
                AI-Matched Generics
                <span className="ml-2 text-sm font-normal text-teal-600">({genericMatches.length} found)</span>
              </h2>
              <p className="text-[11px] text-slate-400">CDSCO-approved bioequivalent alternatives</p>
            </div>
          </div>

          <button
            id="open-bioequiv-matrix-btn"
            onClick={() => onOpenComparisonModal()}
            className="btn btn-secondary text-xs py-1.5 px-3 self-start sm:self-auto"
          >
            <Scale className="w-3.5 h-3.5" />
            Full Bioequivalence Matrix
          </button>
        </div>

        {genericMatches.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-white/70">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-display font-700 text-slate-700">No generic matches in current cluster</p>
            <p className="text-xs text-slate-400 mt-1">You can still request {medicine.brandName} at a verified pharmacy.</p>
            <button onClick={() => onViewPharmacies(medicine)} className="btn btn-primary text-xs px-4 py-2 mt-4">
              Check Store Availability
            </button>
          </div>
        ) : (
          <div className="space-y-4 stagger">
            {genericMatches.map((match) => {
              const alt = match.medicine;
              const confidenceColor = match.matchConfidence >= 0.97 ? '#059669' : match.matchConfidence >= 0.95 ? '#0d9488' : '#0891b2';

              return (
                <div
                  key={alt.id}
                  id={`generic-match-card-${alt.id}`}
                  className="rounded-2xl border-2 bg-white overflow-hidden transition-all duration-300 animate-fade-in group"
                  style={{
                    borderColor: 'rgba(226,232,240,0.8)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,148,136,0.4)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px -8px rgba(13,148,136,0.2)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(226,232,240,0.8)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
                  }}
                >
                  {/* Savings Banner */}
                  <div className="px-5 py-2.5 flex items-center justify-between"
                    style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(13,148,136,0.05))' }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      {match.isJanAushadhi ? (
                        <span className="badge badge-success text-[10px]">★ Jan Aushadhi</span>
                      ) : (
                        <span className="badge badge-brand text-[10px]">✓ CDSCO Generic</span>
                      )}
                      {match.cdscoCompliant && (
                        <span className="badge badge-brand text-[10px]">
                          <ShieldCheck className="w-2.5 h-2.5" /> CDSCO Compliant
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-display font-800 text-sm">
                      <TrendingDown className="w-4 h-4" />
                      Save {match.savingsPercentage}% · ₹{match.savingsAmount.toFixed(0)} less
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Medicine info + Price */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-display font-700 text-slate-900">{alt.brandName}</h3>
                        <p className="text-xs font-mono text-teal-700 font-semibold mt-0.5">{alt.activeSalt} • {alt.strength}</p>
                        <p className="text-xs text-slate-400 mt-1">{alt.manufacturer} • {alt.packaging}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-slate-600">{alt.rating} rating</span>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                        <p className="text-[10px] text-slate-400 line-through">Was ₹{medicine.mrp.toFixed(2)}</p>
                        <p className="text-2xl font-display font-800 text-emerald-700">₹{alt.mrp.toFixed(2)}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold">₹{alt.unitPrice.toFixed(2)}/unit</p>
                      </div>
                    </div>

                    {/* Bioequivalence confidence meters */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ConfidenceBar value={match.matchConfidence} label="AI Match Confidence" color={confidenceColor} />
                      <ConfidenceBar value={alt.bioavailabilityRatio} label="Relative Bioavailability" color="#0891b2" />
                    </div>

                    {/* AI Reasoning Box */}
                    <div className="mt-4 p-3.5 rounded-xl border"
                      style={{ background: 'linear-gradient(135deg, rgba(240,253,251,0.8), rgba(240,249,255,0.8))', borderColor: 'rgba(13,148,136,0.15)' }}>
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-bold text-slate-800 mb-0.5">AI Explainability Rationale</p>
                          <p className="text-slate-600 leading-relaxed">
                            {match.matchReason} Dissolution: <strong className="text-slate-800">{alt.dissolutionRate}</strong>.
                            Bioavailability: <strong className="text-slate-800">{(alt.bioavailabilityRatio * 100).toFixed(1)}%</strong>.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenComparisonModal(alt)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        Compare Side-by-Side
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewPharmacies(alt)}
                          className="btn btn-secondary text-xs py-1.5 px-3"
                        >
                          <Store className="w-3.5 h-3.5 text-teal-600" />
                          Nearby Stores
                        </button>
                        <button
                          id={`request-avail-btn-${alt.id}`}
                          onClick={() => onRequestAvailability(alt)}
                          className="btn btn-primary text-xs py-1.5 px-3.5"
                        >
                          Reserve Stock
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
