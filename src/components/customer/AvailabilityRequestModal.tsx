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
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Request Stock & Reserve Counter Pickup</h2>
              <p className="text-[11px] text-slate-500">Fast 45-minute stock hold at verified dispensary</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
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
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span className="font-semibold text-slate-800">
                    Substitute with Bioequivalent Generic ({selectedGeneric.brandName})
                  </span>
                </label>

                {acceptGenericSub && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
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
          <div className="pt-2 border-t border-slate-200 space-y-1">
            <div className="flex justify-between text-slate-500 text-xs">
              <span>Estimated Order Total:</span>
              <span className="font-bold text-slate-900">₹{totalPrice.toFixed(2)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold text-xs">
                <span>Total Patient Savings:</span>
                <span>- ₹{totalSavings.toFixed(2)}</span>
              </div>
            )}
            <p className="text-[10px] text-slate-400">
              * Payment is made directly at pharmacy counter upon physical inspection.
            </p>
          </div>

          {/* Submit Button */}
          <button
            id="confirm-availability-request-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Broadcasting Request...</span>
            ) : (
              <>
                <span>Broadcast Request & Reserve Stock</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
