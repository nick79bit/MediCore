import React, { useState } from 'react';
import { 
  X, 
  Store, 
  Pill, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  TrendingDown, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Medicine, Pharmacy } from '../../types';

interface AvailabilityRequestModalProps {
  medicine: Medicine;
  selectedGeneric?: Medicine;
  preselectedPharmacy?: Pharmacy;
  onClose: () => void;
  onOrderCreated: (orderId: string) => void;
}

export const AvailabilityRequestModal: React.FC<AvailabilityRequestModalProps> = ({
  medicine,
  selectedGeneric,
  preselectedPharmacy,
  onClose,
  onOrderCreated
}) => {
  const { pharmacies, createOrderRequest, customerProfile } = useApp();

  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>(
    preselectedPharmacy?.id || pharmacies[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [acceptGenericSub, setAcceptGenericSub] = useState<boolean>(true);
  const [rxAttached, setRxAttached] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('Please dispense the verified generic bioequivalent.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeMedToDispense = (acceptGenericSub && selectedGeneric) ? selectedGeneric : medicine;
  const currentPharmacy = pharmacies.find(p => p.id === selectedPharmacyId) || pharmacies[0];

  const unitPrice = activeMedToDispense.mrp;
  const totalPrice = unitPrice * quantity;
  const originalTotalPrice = medicine.mrp * quantity;
  const totalSavings = Math.max(0, originalTotalPrice - totalPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrderRequest({
        requestedMedicine: medicine,
        selectedGeneric: acceptGenericSub ? selectedGeneric : undefined,
        quantity,
        pharmacy: currentPharmacy,
        prescriptionUploaded: rxAttached,
        prescriptionOcrText: rxAttached 
          ? `Rx: ${activeMedToDispense.brandName} (${activeMedToDispense.activeSalt}) x ${quantity} pack. Dr. S. K. Mehta (MBBS, MD).`
          : undefined,
        notes
      });

      setIsSubmitting(false);
      onOrderCreated(newOrder.id);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #f0fdfb 0%, #f8fafc 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)' }}>
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Request Stock &amp; Reserve Counter Pickup</h2>
              <p className="text-[11px] text-teal-700 font-medium flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                45-minute stock hold at verified dispensary
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Selected Medicine Summary */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Selected Formulation
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {activeMedToDispense.brandName}
                </h3>
                <p className="text-[11px] font-mono text-teal-800 font-semibold">
                  {activeMedToDispense.activeSalt}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Mfg: {activeMedToDispense.manufacturer} • {activeMedToDispense.packaging}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900">
                  ₹{activeMedToDispense.mrp.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block">per pack</span>
              </div>
            </div>

            {selectedGeneric && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptGenericSub}
                    onChange={(e) => setAcceptGenericSub(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 accent-teal-600"
                  />
                  <span className="font-semibold text-slate-800">
                    Substitute with <span className="text-teal-700">{selectedGeneric.brandName}</span>
                  </span>
                </label>

                {acceptGenericSub && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5 animate-pulse">
                    <TrendingDown className="w-2.5 h-2.5" />
                    Save {Math.round(((medicine.mrp - selectedGeneric.mrp) / medicine.mrp) * 100)}%
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Pharmacy Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Verified Dispensary
            </label>
            <select
              value={selectedPharmacyId}
              onChange={(e) => setSelectedPharmacyId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {pharmacies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.locality} ({p.distanceKm} km away)
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-600" />
              Pharmacist on duty: {currentPharmacy.mspcPharmacistName} (Form 20/21 Verified)
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="font-semibold text-slate-800">Quantity (Strips/Packs)</p>
              <p className="text-[10px] text-slate-500">Standard dosage pack</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
              >
                -
              </button>
              <span className="font-bold text-sm text-slate-900 w-4 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Prescription Attachment */}
          <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                <div>
                  <p className="font-semibold text-teal-950">Prescription Attached (Rx)</p>
                  <p className="text-[10px] text-teal-800">Dr. S. K. Mehta (Reg #MMC-48910)</p>
                </div>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rxAttached}
                  onChange={(e) => setRxAttached(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-[11px] font-medium text-teal-900">Include Rx</span>
              </label>
            </div>
          </div>

          {/* Notes for Pharmacist */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Notes for Dispensary Pharmacist (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please confirm expiry date, need generic formulation"
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Price & Savings Breakdown */}
          <div className="p-3.5 rounded-xl border"
            style={{ background: 'linear-gradient(135deg, rgba(240,253,251,0.8), rgba(240,249,255,0.6))', borderColor: 'rgba(13,148,136,0.15)' }}>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span className="font-medium">Estimated Order Total</span>
              <span className="font-bold text-slate-900 text-sm">₹{totalPrice.toFixed(2)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold text-xs items-center">
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Total Patient Savings
                </span>
                <span className="bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">- ₹{totalSavings.toFixed(2)}</span>
              </div>
            )}
            <p className="text-[10px] text-slate-400 mt-1.5">
              * Payment made directly at pharmacy counter upon physical inspection.
            </p>
          </div>

          {/* Submit Button */}
          <button
            id="confirm-availability-request-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 disabled:opacity-60 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            style={{ background: isSubmitting ? '#0d9488' : 'linear-gradient(135deg, #0d9488, #0f766e)', boxShadow: '0 4px 16px -4px rgba(13,148,136,0.45)' }}
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span>Broadcasting to Pharmacies...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Broadcast Request &amp; Reserve Stock</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
