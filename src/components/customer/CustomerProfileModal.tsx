import React from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Store, 
  Pill, 
  QrCode, 
  Heart,
  ChevronRight,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CustomerProfileModalProps {
  onClose: () => void;
  onSelectOrder: (orderId: string) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  onClose,
  onSelectOrder
}) => {
  const { customerProfile, orders = [], pharmacies = [] } = useApp();

  const customerOrders = (orders || []).filter(o => o?.customerId === customerProfile?.id);
  const savedPharmacies = (pharmacies || []).filter(p => (customerProfile?.savedPharmaciesIds || []).includes(p?.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
              RS
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{customerProfile.fullName}</h2>
              <p className="text-[11px] text-slate-500">{customerProfile.city} • {customerProfile.phone}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* ABHA / ABDM Digital Health Pass */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 rounded-2xl shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ayushman Bharat Digital Health ID (ABDM)</span>
              </div>
              <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 font-mono border border-emerald-800">
                ACTIVE VERIFIED
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-teal-300 uppercase">ABHA Address</p>
                <p className="text-base font-mono font-bold tracking-wide text-white">
                  {customerProfile.abhaId}
                </p>
                <p className="text-xs text-slate-300 mt-1">{customerProfile.fullName}</p>
              </div>

              <div className="bg-white p-1.5 rounded-lg shrink-0">
                <QrCode className="w-10 h-10 text-slate-900" />
              </div>
            </div>
          </div>

          {/* Active Drug Allergies & Contraindication Badges */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Registered Drug Allergy Contraindications</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed mb-2">
              The AI matching engine cross-checks all active salt molecules against these registered allergens to prevent adverse drug reactions (ADRs).
            </p>
            <div className="flex flex-wrap gap-1.5">
              {customerProfile.knownAllergies.map(allergy => (
                <span key={allergy} className="text-xs font-semibold bg-white border border-amber-300 text-amber-950 px-2.5 py-1 rounded-lg">
                  ⚠ {allergy}
                </span>
              ))}
            </div>
          </div>

          {/* Chronic Health Vitals */}
          <div>
            <span className="font-bold text-slate-800 text-xs block mb-1.5">
              Chronic Care Conditions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {customerProfile.chronicConditions.map(condition => (
                <span key={condition} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                  {condition}
                </span>
              ))}
            </div>
          </div>

          {/* Saved Verified Pharmacies */}
          <div>
            <span className="font-bold text-slate-800 text-xs block mb-2">
              Saved Preferred Pharmacies ({savedPharmacies.length})
            </span>
            <div className="space-y-2">
              {savedPharmacies.map(p => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-500">{p.locality} • {p.distanceKm} km away</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Form 20/21
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Request History */}
          <div>
            <span className="font-bold text-slate-800 text-xs block mb-2">
              Availability & Pickup Requests ({customerOrders.length})
            </span>
            <div className="space-y-2">
              {customerOrders.map(o => (
                <div 
                  key={o.id}
                  onClick={() => {
                    onSelectOrder(o.id);
                    onClose();
                  }}
                  className="p-3 bg-white rounded-xl border border-slate-200 hover:border-teal-500 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-teal-800">{o.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.status === 'Dispensed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-1">
                      {o.selectedGenericName || o.requestedMedicineName}
                    </p>
                    <p className="text-[10px] text-slate-500">{o.pharmacyName} • ₹{o.estimatedPrice.toFixed(2)}</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
