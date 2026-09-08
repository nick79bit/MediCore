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
  ExternalLink,
  Pill,
  Clock,
  ChevronRight
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

export const MedicineSearchResults: React.FC<MedicineSearchResultsProps> = ({
  medicine,
  onBack,
  onOpenComparisonModal,
  onRequestAvailability,
  onViewPharmacies
}) => {
  const { findGenericMatches, customerProfile } = useApp();

  const genericMatches = findGenericMatches(medicine);

  // Check if patient has allergy contraindication for this medicine or its salts
  const hasPenicillinAllergy = customerProfile.knownAllergies.some(a => a.toLowerCase().includes('penicillin'));
  const isPenicillinBased = medicine.activeSalt.toLowerCase().includes('amoxicillin') || 
                            medicine.activeSalt.toLowerCase().includes('clavulanic') ||
                            medicine.activeSalt.toLowerCase().includes('penicillin');

  const showAllergyAlert = hasPenicillinAllergy && isPenicillinBased;

  return (
    <div className="space-y-6">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Search</span>
        </button>

        <span className="text-[11px] text-slate-500 font-mono">
          CDSCO Ref: {medicine.cdscoApprovalNumber}
        </span>
      </div>

      {/* Contraindication Alert if patient has allergy */}
      {showAllergyAlert && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-red-950 text-sm">Critical Patient Allergy Warning</p>
            <p className="mt-1 text-red-800 leading-relaxed">
              Your registered ABHA profile records a known hypersensitivity to <strong>Penicillin</strong>. 
              This medicine contains <strong>{medicine.activeSalt}</strong>, which belongs to the beta-lactam class. 
              Do not consume without consulting a registered medical practitioner.
            </p>
          </div>
        </div>
      )}

      {/* Queried Medicine Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                Queried Reference Medicine
              </span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                medicine.scheduleCategory.includes('H') 
                  ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {medicine.scheduleCategory} • Rx Required: {medicine.requiresPrescription ? 'Yes' : 'No'}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {medicine.brandName}
            </h1>
            <p className="text-sm font-semibold text-teal-800 font-mono mt-0.5">
              Active Salt: {medicine.activeSalt}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Manufacturer: <strong className="text-slate-700">{medicine.manufacturer}</strong> • {medicine.packaging}
            </p>
          </div>

          <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
            <span className="text-xs text-slate-400">Branded MRP</span>
            <p className="text-2xl font-bold text-slate-900">₹{medicine.mrp.toFixed(2)}</p>
            <p className="text-[11px] text-slate-500">₹{medicine.unitPrice.toFixed(2)} per unit</p>
          </div>
        </div>

        {/* Bioequivalence & Pharmacopeia Summary Strip */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-medium uppercase">Bioavailability</p>
            <p className="font-semibold text-slate-800 mt-0.5">{(medicine.bioavailabilityRatio * 100).toFixed(0)}% (Ref Std)</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-medium uppercase">Dissolution Rate</p>
            <p className="font-semibold text-slate-800 mt-0.5 truncate">{medicine.dissolutionRate}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
            <p className="text-[10px] text-slate-400 font-medium uppercase">Common Indications</p>
            <p className="font-semibold text-slate-800 mt-0.5 truncate">{medicine.commonUses.slice(0, 2).join(', ')}</p>
          </div>
        </div>
      </div>

      {/* AI Explainable Bioequivalent Alternatives Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                AI Matched Generic Bioequivalents ({genericMatches.length})
              </h2>
              <p className="text-xs text-slate-500">
                Therapeutically equivalent active molecules compliant with CDSCO & Jan Aushadhi standards
              </p>
            </div>
          </div>

          <button
            id="open-bioequiv-matrix-btn"
            onClick={() => onOpenComparisonModal()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors self-start sm:self-auto"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Full Bioequivalence Matrix</span>
          </button>
        </div>

        {/* Generic Alternative Cards List */}
        {genericMatches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 text-center">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No alternate generic matches in current cluster</p>
            <p className="text-xs text-slate-500 mt-1">
              You can still request availability for {medicine.brandName} at verified pharmacies.
            </p>
            <button
              onClick={() => onViewPharmacies(medicine)}
              className="mt-3 bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-teal-800 transition-colors"
            >
              Check Store Availability
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {genericMatches.map((match) => {
              const alt = match.medicine;
              return (
                <div
                  key={alt.id}
                  id={`generic-match-card-${alt.id}`}
                  className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 hover:border-teal-500 transition-all shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {match.isJanAushadhi ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ★ Govt Jan Aushadhi Bioequivalent
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                            ✓ CDSCO Certified Generic
                          </span>
                        )}

                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                          <TrendingDown className="w-3.5 h-3.5" />
                          Save {match.savingsPercentage}% (Save ₹{match.savingsAmount.toFixed(2)})
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {alt.brandName}
                      </h3>
                      <p className="text-xs font-mono text-slate-600 font-medium">
                        {alt.activeSalt} • {alt.strength}
                      </p>
                      <p className="text-xs text-slate-500">
                        Mfg: <span className="text-slate-800 font-medium">{alt.manufacturer}</span> • {alt.packaging}
                      </p>
                    </div>

                    {/* Price comparison block */}
                    <div className="sm:text-right bg-emerald-50/60 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-emerald-100">
                      <div className="flex sm:flex-col items-center sm:items-end justify-between">
                        <div>
                          <span className="text-xs text-slate-500 line-through mr-2 sm:mr-0">
                            MRP ₹{medicine.mrp.toFixed(2)}
                          </span>
                          <p className="text-xl font-extrabold text-emerald-700">
                            ₹{alt.mrp.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-[10px] text-emerald-800 font-medium">
                          ₹{alt.unitPrice.toFixed(2)} per unit
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Reasoning explanation box */}
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-800">
                          Explainable Bioequivalence Rationale:
                        </p>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">
                          {match.matchReason} Dissolution: <strong>{alt.dissolutionRate}</strong>. Relative Bioavailability: <strong>{(alt.bioavailabilityRatio * 100).toFixed(1)}%</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenComparisonModal(alt)}
                      className="text-xs text-slate-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Compare Side-by-Side</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewPharmacies(alt)}
                        className="bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5"
                      >
                        <Store className="w-3.5 h-3.5 text-teal-600" />
                        <span>Find Nearby Stores</span>
                      </button>

                      <button
                        id={`request-avail-btn-${alt.id}`}
                        onClick={() => onRequestAvailability(alt)}
                        className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm hover:shadow-md inline-flex items-center gap-1.5"
                      >
                        <span>Request & Reserve Stock</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
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
