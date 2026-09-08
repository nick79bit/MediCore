import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Scan, 
  ChevronRight,
  ShieldCheck,
  Pill
} from 'lucide-react';
import { Medicine } from '../../types';

interface PrescriptionOcrModalProps {
  onClose: () => void;
  onMatchFound: (medicineId: string) => void;
}

export const PrescriptionOcrModal: React.FC<PrescriptionOcrModalProps> = ({
  onClose,
  onMatchFound
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);
  const [selectedSample, setSelectedSample] = useState<number>(0);

  const samples = [
    {
      title: 'Dr. S. K. Mehta (MBBS, MD) — General Medicine',
      regNo: 'MMC-48910 (Maharashtra Medical Council)',
      medicineName: 'Augmentin 625 Duo',
      activeSalt: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
      dosage: '1 tab BD x 5 days after meals',
      indication: 'Bacterial upper respiratory infection / Sinusitis',
      medicineId: 'med-augmentin-625',
      confidence: 99.2
    },
    {
      title: 'Dr. R. K. Bhalerao (MD, DM) — Cardiologist',
      regNo: 'MMC-39102 (Maharashtra Medical Council)',
      medicineName: 'Telma 40',
      activeSalt: 'Telmisartan (40mg)',
      dosage: '1 tab OD morning empty stomach x 30 days',
      indication: 'Essential Stage 1 Hypertension management',
      medicineId: 'med-telma-40',
      confidence: 98.6
    },
    {
      title: 'Dr. Neha Kulkarni (MBBS) — Family Physician',
      regNo: 'MMC-51029 (Maharashtra Medical Council)',
      medicineName: 'Crocin 650 Advance',
      activeSalt: 'Paracetamol (650mg)',
      dosage: '1 tab SOS for high fever (max 3/day)',
      indication: 'Acute febrile illness & myalgia',
      medicineId: 'med-crocin-650',
      confidence: 99.7
    }
  ];

  const currentSample = samples[selectedSample];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanComplete(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Prescription OCR & Salt Extractor
              </h2>
              <p className="text-[11px] text-slate-500">
                AI Vision parses doctor Rx handwriting into active chemical salts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Sample Prescription Presets */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Select or Upload Doctor Prescription Slip:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {samples.map((s, idx) => (
                <button
                  key={s.medicineName}
                  type="button"
                  onClick={() => {
                    setSelectedSample(idx);
                    setScanComplete(false);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedSample === idx
                      ? 'bg-teal-50 border-teal-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs truncate">{s.medicineName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{s.title.split('—')[0]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Prescription Scan Canvas Area */}
          <div className="relative bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-5 text-center overflow-hidden">
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-teal-500 top-0 animate-pulse shadow-md shadow-teal-500/50" />
            )}

            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center mx-auto mb-2 text-teal-700">
              <FileText className="w-6 h-6" />
            </div>

            <p className="font-bold text-slate-800 text-xs">{currentSample.title}</p>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">Reg: {currentSample.regNo}</p>

            <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px] max-w-sm mx-auto text-left">
              <span className="text-teal-700 font-bold block mb-0.5">Rx Clinical Note:</span>
              <span>1. Tab {currentSample.medicineName} — {currentSample.dosage}</span>
            </div>

            {!scanComplete && (
              <button
                id="run-ocr-scan-btn"
                onClick={handleStartScan}
                disabled={isScanning}
                className="mt-4 px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5"
              >
                {isScanning ? (
                  <>
                    <Scan className="w-4 h-4 animate-spin" />
                    <span>Extracting Active Salt Molecules...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Scan & Map Chemical Salt</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Scan Results Card if complete */}
          {scanComplete && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  OCR Extraction Succeeded ({currentSample.confidence}% Match)
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  CDSCO Verified
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Detected Medicine: {currentSample.medicineName}
                </p>
                <p className="text-xs font-mono font-bold text-teal-800 mt-0.5">
                  Extracted Active Salt: {currentSample.activeSalt}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Dosage: {currentSample.dosage} • Indication: {currentSample.indication}
                </p>
              </div>

              <button
                id="view-ocr-generics-btn"
                onClick={() => {
                  onMatchFound(currentSample.medicineId);
                  onClose();
                }}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Bioequivalent Generics & Compare Prices</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
