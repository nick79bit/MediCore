import React from 'react';
import { 
  X, 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Thermometer, 
  Star, 
  Pill, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Pharmacy, Medicine } from '../../types';

interface PharmacyDetailModalProps {
  pharmacy: Pharmacy;
  onClose: () => void;
  onSelectMedicineForOrder?: (med: Medicine) => void;
}

export const PharmacyDetailModal: React.FC<PharmacyDetailModalProps> = ({
  pharmacy,
  onClose,
  onSelectMedicineForOrder
}) => {
  const { inventory = [], feedbackList = [], feedbacks = [] } = useApp();

  const reviews = feedbackList || feedbacks || [];
  const pharmacyInventory = (inventory || []).filter(i => i?.pharmacyId === pharmacy?.id);
  const pharmacyReviews = (reviews || []).filter(f => f?.pharmacyId === pharmacy?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{pharmacy.name}</h2>
                {pharmacy.verifiedBadge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{pharmacy.address} • {pharmacy.locality}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Key Vitals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium uppercase">License Form 20/21</span>
              <p className="font-mono font-bold text-slate-800 text-xs mt-0.5">{pharmacy.drugLicenseNumber}</p>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Valid till 2028</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium uppercase">MSPC Pharmacist</span>
              <p className="font-bold text-slate-800 text-xs mt-0.5 truncate">{pharmacy.mspcPharmacistName}</p>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{pharmacy.mspcRegistrationNumber}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium uppercase">Cold-Chain Status</span>
              <p className="font-bold text-teal-800 text-xs mt-0.5 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-teal-600" />
                {pharmacy.coldChainTempCelsius}°C (Verified)
              </p>
              <span className="text-[10px] text-emerald-600 block mt-0.5">IoT 2°C - 8°C Monitored</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium uppercase">Customer Rating</span>
              <p className="font-bold text-slate-800 text-xs mt-0.5 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {pharmacy.rating} / 5.0
              </p>
              <span className="text-[10px] text-slate-500 block mt-0.5">{pharmacy.reviewCount} verified orders</span>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Clock className="w-4 h-4 text-teal-600" />
                {pharmacy.operatingHours}
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Phone className="w-4 h-4 text-teal-600" />
                {pharmacy.phone}
              </span>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              POS Synced: {pharmacy.lastStockSyncTimestamp}
            </span>
          </div>

          {/* Real-time Inventory in Stock */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Current Stock on Counter ({pharmacyInventory.length} items)</span>
              <span className="text-[10px] font-normal text-slate-500">POS live integrated</span>
            </h3>

            <div className="space-y-2">
              {pharmacyInventory.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between hover:border-teal-500 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.medicine.brandName}</span>
                      <span className="text-[10px] font-mono text-slate-500">{item.medicine.activeSalt}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Batch #{item.batchNumber} • Exp: {item.expiryDate}
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.stockQuantity > 5 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.stockQuantity} in stock
                      </span>
                      <p className="font-bold text-slate-900 text-xs mt-0.5">₹{item.sellingPrice.toFixed(2)}</p>
                    </div>

                    {onSelectMedicineForOrder && (
                      <button
                        onClick={() => {
                          onSelectMedicineForOrder(item.medicine);
                          onClose();
                        }}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-2.5 py-1.5 rounded-lg text-[11px]"
                      >
                        Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Customer Feedback */}
          {pharmacyReviews.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Recent Customer Reviews ({pharmacyReviews.length})
              </h3>
              <div className="space-y-2">
                {pharmacyReviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <span className="font-bold text-slate-800">{rev.customerName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{rev.createdAt}</span>
                    </div>

                    <p className="text-slate-600 mt-1">{rev.comment}</p>

                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {rev.tags.map(t => (
                        <span key={t} className="text-[10px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
