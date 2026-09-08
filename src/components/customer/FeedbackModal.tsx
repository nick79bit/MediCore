import React, { useState } from 'react';
import { 
  X, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { OrderRequest } from '../../types';

interface FeedbackModalProps {
  order: OrderRequest;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ order, onClose }) => {
  const { submitFeedback, customerProfile } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [priceAccuracy, setPriceAccuracy] = useState<number>(5);
  const [stockAccuracy, setStockAccuracy] = useState<number>(5);
  const [pharmacistGuidance, setPharmacistGuidance] = useState<number>(5);

  const availableTags = [
    'Exact generic provided',
    'Price matched app',
    'Fast handover',
    'Courteous pharmacist',
    'Clear dosage explanation',
    'Cold chain maintained'
  ];

  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Exact generic provided',
    'Price matched app'
  ]);

  const [comment, setComment] = useState<string>(
    'Received the exact bioequivalent generic. The pharmacist verified the salt and explained the dosage schedule.'
  );

  const [reportDiscrepancy, setReportDiscrepancy] = useState<boolean>(false);
  const [discrepancyText, setDiscrepancyText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    submitFeedback({
      orderId: order.id,
      customerId: customerProfile.id,
      customerName: customerProfile.fullName,
      pharmacyId: order.pharmacyId,
      pharmacyName: order.pharmacyName,
      rating,
      priceAccuracyRating: priceAccuracy,
      stockAvailabilityRating: stockAccuracy,
      pharmacistGuidanceRating: pharmacistGuidance,
      tags: selectedTags,
      comment,
      discrepancyReported: reportDiscrepancy,
      discrepancyDetail: reportDiscrepancy ? discrepancyText : undefined
    });

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Rate Pharmacy & Generic Accuracy</h2>
            <p className="text-[11px] text-slate-500">
              Order {order.id} • {order.pharmacyName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Main Star Rating */}
          <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-700 block">Overall Experience</span>
            <div className="flex items-center justify-center gap-2 mt-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1 block">
              {rating === 5 ? 'Excellent & Trustworthy' : rating === 4 ? 'Good Service' : rating === 3 ? 'Average' : 'Poor'}
            </span>
          </div>

          {/* Sub-criteria Ratings */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">Price Accuracy</span>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setPriceAccuracy(s)}>
                    <Star className={`w-3.5 h-3.5 ${s <= priceAccuracy ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">Stock Match</span>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setStockAccuracy(s)}>
                    <Star className={`w-3.5 h-3.5 ${s <= stockAccuracy ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">Pharmacist Help</span>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setPharmacistGuidance(s)}>
                    <Star className={`w-3.5 h-3.5 ${s <= pharmacistGuidance ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tag Chips */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Select Feedback Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-700 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Comments or Consultation Notes
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Discrepancy Reporting Toggle */}
          <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={reportDiscrepancy}
                onChange={(e) => setReportDiscrepancy(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
              />
              <span className="font-bold text-red-900 text-xs flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                Report Stock or Pricing Discrepancy to Platform Admin
              </span>
            </label>

            {reportDiscrepancy && (
              <div className="pt-1">
                <p className="text-[10px] text-red-800 mb-1">
                  Explain the discrepancy (e.g. store charged more than app price, or refused generic formulation):
                </p>
                <input
                  type="text"
                  value={discrepancyText}
                  onChange={(e) => setDiscrepancyText(e.target.value)}
                  placeholder="e.g. Counter tried to push expensive branded alternative instead of Jan Aushadhi"
                  className="w-full bg-white border border-red-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Feedback</span>
          </button>
        </form>

      </div>
    </div>
  );
};
