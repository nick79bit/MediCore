import React, { useState } from 'react';
import { 
  X, 
  Pill, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Medicine } from '../../types';

interface AddMedicineModalProps {
  pharmacyId: string;
  onClose: () => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  pharmacyId,
  onClose
}) => {
  const { addInventoryItem, medicines } = useApp();

  const [brandName, setBrandName] = useState('');
  const [activeSalt, setActiveSalt] = useState('');
  const [strength, setStrength] = useState('');
  const [dosageForm, setDosageForm] = useState('Tablet');
  const [manufacturer, setManufacturer] = useState('');
  const [mrp, setMrp] = useState<number>(50);
  const [sellingPrice, setSellingPrice] = useState<number>(45);
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [batchNumber, setBatchNumber] = useState('BT-2025-09');
  const [expiryDate, setExpiryDate] = useState('2027-08');
  const [isGeneric, setIsGeneric] = useState<boolean>(true);
  const [scheduleCategory, setScheduleCategory] = useState<'OTC' | 'Schedule H' | 'Schedule H1'>('Schedule H');
  const [dissolutionRate, setDissolutionRate] = useState('>85% within 30 min (IP Monograph)');
  const [bioavailabilityRatio, setBioavailabilityRatio] = useState<number>(0.98);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!brandName || !activeSalt || !manufacturer) return;

    const newMed: Medicine = {
      id: `med-custom-${Date.now()}`,
      brandName,
      activeSalt,
      strength: strength || '500mg',
      dosageForm,
      packaging: `Strip of 10 ${dosageForm.toLowerCase()}s`,
      manufacturer,
      isGeneric,
      activeSaltComponents: [
        {
          molecule: activeSalt.split('(')[0].trim(),
          strength: strength || '500mg',
          therapeuticClass: 'General therapeutic agent'
        }
      ],
      contraindications: ['Known hypersensitivity to active salt'],
      rating: 4.8,
      mrp: Number(mrp),
      unitPrice: Number(mrp) / 10,
      requiresPrescription: scheduleCategory !== 'OTC',
      scheduleCategory,
      bioavailabilityRatio: Number(bioavailabilityRatio),
      dissolutionRate,
      inactiveExcipients: ['Microcrystalline Cellulose', 'Magnesium Stearate', 'Povidone'],
      cdscoApprovalNumber: `CDSCO/APPR/2025/${Math.floor(1000 + Math.random() * 9000)}`,
      bioequivalenceStatus: 'CDSCO Approved Bioequivalent',
      commonUses: ['General therapeutic use']
    };

    addInventoryItem(pharmacyId, newMed, Number(stockQuantity), Number(sellingPrice), batchNumber, expiryDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add Medicine to POS Inventory</h2>
              <p className="text-[11px] text-slate-500">Form 20/21 Compliance & CDSCO Standards</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Paracip 650"
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Manufacturer *</label>
              <input
                type="text"
                required
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="e.g. Cipla Ltd"
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Active Chemical Salt Composition *
            </label>
            <input
              type="text"
              required
              value={activeSalt}
              onChange={(e) => setActiveSalt(e.target.value)}
              placeholder="e.g. Paracetamol (650mg) or Amoxicillin (500mg) + Clavulanic Acid (125mg)"
              className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 font-mono focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              The AI matching engine indexes this salt string to recommend bioequivalent alternatives.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Strength</label>
              <input
                type="text"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="650mg"
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dosage Form</label>
              <select
                value={dosageForm}
                onChange={(e) => setDosageForm(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Schedule</label>
              <select
                value={scheduleCategory}
                onChange={(e) => setScheduleCategory(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
              >
                <option value="OTC">OTC</option>
                <option value="Schedule H">Schedule H</option>
                <option value="Schedule H1">Schedule H1</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Maximum Retail Price (₹)</label>
              <input
                type="number"
                step="0.1"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Selling / Store Price (₹)</label>
              <input
                type="number"
                step="0.1"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Stock Qty (Packs)</label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Batch Number</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="2027-08"
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isGeneric}
                onChange={(e) => setIsGeneric(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span className="font-bold text-slate-800 text-xs">
                Classify as CDSCO Bioequivalent Generic Alternative
              </span>
            </label>
            <p className="text-[10px] text-slate-500 mt-1">
              Marking as generic makes this medicine eligible for AI recommendation when customers search for high-cost originator brands.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Medicine to Inventory</span>
          </button>
        </form>

      </div>
    </div>
  );
};
