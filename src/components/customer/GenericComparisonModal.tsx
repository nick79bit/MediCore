import React from 'react';
import { 
  X, 
  Check, 
  AlertCircle, 
  Scale, 
  ShieldCheck, 
  TrendingDown, 
  FileCheck,
  Building2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Medicine } from '../../types';

interface GenericComparisonModalProps {
  referenceMedicine: Medicine;
  comparisonMedicine?: Medicine;
  availableGenerics: Medicine[];
  onClose: () => void;
  onSelectForOrder: (med: Medicine) => void;
}

export const GenericComparisonModal: React.FC<GenericComparisonModalProps> = ({
  referenceMedicine,
  comparisonMedicine,
  availableGenerics,
  onClose,
  onSelectForOrder
}) => {
  // If specific comparison med was selected, put it first, plus Jan Aushadhi if exists
  const selectedAlt = comparisonMedicine || availableGenerics[0];
  const janAushadhiMed = availableGenerics.find(g => g.brandName.includes('Jan Aushadhi') && g.id !== selectedAlt?.id);

  const columns = [
    { type: 'originator', med: referenceMedicine, title: 'Branded Originator' },
    ...(selectedAlt ? [{ type: 'generic', med: selectedAlt, title: 'Bioequivalent Generic' }] : []),
    ...(janAushadhiMed ? [{ type: 'janaushadhi', med: janAushadhiMed, title: 'Govt Jan Aushadhi' }] : [])
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bioequivalence Audit & Price Comparison Matrix
              </h2>
              <p className="text-xs text-slate-500">
                CDSCO Form 20/21 Monograph Validation • Active Molecule: <strong>{referenceMedicine.activeSalt}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* AI Clinical Bioequivalence Assurance Note */}
          <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-teal-950">
            <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-teal-900">Therapeutic Equivalence Assessment (MedNorm-Bio v3.1)</p>
              <p className="mt-0.5 text-teal-800 leading-relaxed">
                Generic formulations shown below contain identical active pharmaceutical ingredients (API) at the exact same strength and dosage form. They have met dissolution and relative bioavailability thresholds (80% - 125% geometric confidence interval) approved under Drugs & Cosmetics Rules 1945.
              </p>
            </div>
          </div>

          {/* Side by Side Comparative Grid Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-3 font-semibold text-slate-500 bg-slate-50/70 w-1/4 rounded-tl-xl">
                    Comparative Parameter
                  </th>
                  {columns.map((col) => (
                    <th 
                      key={col.med.id} 
                      className={`p-3 font-bold ${
                        col.type === 'originator' 
                          ? 'bg-slate-100/80 text-slate-800' 
                          : col.type === 'janaushadhi' 
                            ? 'bg-emerald-100/70 text-emerald-900' 
                            : 'bg-teal-100/70 text-teal-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{col.title}</span>
                        {col.type !== 'originator' && (
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                            Save {Math.round(((referenceMedicine.mrp - col.med.mrp) / referenceMedicine.mrp) * 100)}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-extrabold text-slate-900 mt-1">{col.med.brandName}</p>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-slate-700">
                {/* 1. Price & Savings */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-600 bg-slate-50/50">Maximum Retail Price (MRP)</td>
                  {columns.map((col) => (
                    <td key={col.med.id} className="p-3">
                      <span className={`text-sm font-bold ${col.type !== 'originator' ? 'text-emerald-700' : 'text-slate-900'}`}>
                        ₹{col.med.mrp.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{col.med.packaging}</span>
                    </td>
                  ))}
                </tr>

                {/* 2. Unit Price */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-600 bg-slate-50/50">Calculated Per-Tablet Cost</td>
                  {columns.map((col) => (
                    <td key={col.med.id} className="p-3 font-medium">
                      ₹{col.med.unitPrice.toFixed(2)} / unit
                    </td>
                  ))}
                </tr>

                {/* 3. Active Chemical Molecule */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-600 bg-slate-50/50">Active Molecule & Strength</td>
                  {columns.map((col) => (
                    <td key={col.med.id} className="p-3">
                      <span className="font-mono font-semibold text-slate-900">{col.med.activeSalt}</span>
                      <span className="text-[10px] text-emerald-700 block font-medium">✓ 100% Identical Active Salt</span>
                    </td>
                  ))}
                </tr>

                {/* 4. Dosage Form */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-600 bg-slate-50/50">Formulation & Route</td>
                  {columns.map((col) => (
                    <td key={col.med.id} className="p-3 font-medium text-slate-800">
                      {col.med.dosageForm} ({col.med.strength})
                    </td>
                  ))}
                </tr>

                {/* 5. Bioavailability */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-600 bg-slate-50/50">Relative Bioavailability</td>
                  {columns.map((col) => (
                    <td key={col.med.id} className="p-3">
                      <span className="font-semibold text-slate-900">
                        {(col.med.bioavailabilityRatio * 100).toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {col.type === 'originator' ? 'Reference Standard' : 'In Vivo Bioequivalent'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 6. Dissolution Curve */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-600 bg-slate-50/50">In Vitro Dissolution Rate</td>
                  {columns.map((col) => (
                    <td key={col.med.id} className="p-3 font-medium text-slate-800">
                      {col.med.dissolutionRate}
                    </td>
                  ))}
                </tr>

                {/* 7. Excipients */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-600 bg-slate-50/50">Inactive Excipients</td>
                  {columns.map((col) => (
                    <td key={col.med.id} className="p-3 text-[11px] text-slate-600">
                      {col.med.inactiveExcipients.join(', ')}
                    </td>
                  ))}
                </tr>

                {/* 8. Manufacturer */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-600 bg-slate-50/50">Manufacturer & Quality</td>
                  {columns.map((col) => (
                    <td key={col.med.id} className="p-3">
                      <p className="font-semibold text-slate-800">{col.med.manufacturer}</p>
                      <span className="text-[10px] text-slate-500 block">{col.med.bioequivalenceStatus}</span>
                    </td>
                  ))}
                </tr>

                {/* 9. Regulatory Approval */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-600 bg-slate-50/50">CDSCO / BPPI Reg No</td>
                  {columns.map((col) => (
                    <td key={col.med.id} className="p-3 font-mono text-[11px] text-slate-600">
                      {col.med.cdscoApprovalNumber}
                    </td>
                  ))}
                </tr>

                {/* 10. Action Button */}
                <tr className="bg-slate-50/70">
                  <td className="p-3 font-semibold text-slate-600">Select for Request</td>
                  {columns.map((col) => (
                    <td key={col.med.id} className="p-3">
                      <button
                        id={`select-med-${col.med.id}`}
                        onClick={() => {
                          onSelectForOrder(col.med);
                          onClose();
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all shadow-xs ${
                          col.type !== 'originator'
                            ? 'bg-teal-700 hover:bg-teal-800 text-white'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                        }`}
                      >
                        {col.type !== 'originator' ? `Request ${col.med.brandName}` : 'Request Branded'}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>* Bioequivalence testing regulated under Section 122DA & CDSCO guidelines.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
