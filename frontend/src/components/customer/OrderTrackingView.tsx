import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  QrCode, 
  ShieldCheck, 
  AlertCircle, 
  Navigation, 
  ArrowLeft, 
  Star, 
  Sparkles,
  Store,
  ChevronRight,
  Pill,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderRequest } from '../../types';

interface OrderTrackingViewProps {
  orderId: string;
  onBack: () => void;
  onOpenFeedback: (order: OrderRequest) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orderId,
  onBack,
  onOpenFeedback
}) => {
  const { orders, pharmacies, setRole } = useApp();

  const order = orders.find(o => o.id === orderId) || orders[0];
  const pharmacy = pharmacies.find(p => p.id === order?.pharmacyId);

  // Simulated countdown timer for 45-minute SLA stock hold
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(41 * 60 + 20);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">No active order found.</p>
        <button onClick={onBack} className="mt-3 text-xs text-teal-700 font-semibold underline">
          Return to search
        </button>
      </div>
    );
  }

  // 4-stage timeline determination
  const stages = [
    { key: 'Broadcasted', label: 'Request Broadcasted', desc: 'Pharmacist alerted at dispensary terminal' },
    { key: 'Accepted', label: 'Pharmacist Accepted', desc: 'Prescription & generic substitution verified' },
    { key: 'Ready for Pickup', label: 'Stock Secured in Tray', desc: 'Medicine packed in counter tray for customer' },
    { key: 'Dispensed', label: 'Handover Completed', desc: 'Verified via OTP & dispensed at store counter' }
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'Broadcasted': return 0;
      case 'Accepted': return 1;
      case 'Stock Reserved': return 2;
      case 'Ready for Pickup': return 2;
      case 'Dispensed': return 3;
      default: return 0;
    }
  };

  const currentStageIndex = getStageIndex(order.status);

  return (
    <div className="space-y-5 max-w-2xl mx-auto animate-fade-in">
      
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-all hover:shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Search</span>
        </button>

        <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          #{order.id}
        </span>
      </div>

      {/* Role Switcher Proactive Callout to Test Fulfillment */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-950">
          <Store className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Seller Test Mode:</strong> Switch to the <strong>Pharmacy Portal</strong> role to accept, reserve, or enter the OTP to dispense this order live!
          </span>
        </div>
        <button
          onClick={() => setRole('pharmacy')}
          className="shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          Open Pharmacy
        </button>
      </div>

      {/* Live Pickup Pass Card */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f0fdfb 0%, #ffffff 60%, #f0f9ff 100%)', border: '2px solid rgba(13,148,136,0.4)', boxShadow: '0 8px 32px -8px rgba(13,148,136,0.2)' }}
      >
        
        {/* Status Badge & SLA Countdown */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100/60">
          <div className="flex items-center gap-2">
            <span
              className={`status-pill text-[11px] font-bold ${
                order.status === 'Dispensed'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : order.status === 'Ready for Pickup'
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              <span className={`status-dot ${
                order.status === 'Dispensed' ? 'bg-emerald-500' :
                order.status === 'Ready for Pickup' ? 'bg-teal-500 animate-ping' : 'bg-amber-500'
              }`} />
              {order.status.toUpperCase()}
            </span>
          </div>

          {order.status !== 'Dispensed' && (
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>Hold: {formatTimer(timeLeftSeconds)}</span>
            </div>
          )}
        </div>

        {/* Counter Tray & Pickup OTP Highlight Block */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Dispensary Counter Tray
            </span>
            <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {order.counterTrayNumber || 'Assigning Tray...'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Show this tray ID at counter for instant retrieval.
            </p>
          </div>

          <div className="sm:border-l sm:border-slate-200 sm:pl-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Secret Counter OTP Pass
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-2xl font-black text-teal-700 tracking-widest bg-white px-3 py-1 rounded-lg border border-teal-200 shadow-xs">
                {order.pickupOtp}
              </span>
              <div className="p-1.5 bg-white rounded-lg border border-slate-200" title="QR Token">
                <QrCode className="w-7 h-7 text-slate-800" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Pharmacist enters this OTP to confirm secure dispensation.
            </p>
          </div>
        </div>

        {/* Medicine & Price Summary */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-slate-900 text-sm">
              {order.selectedGenericName || order.requestedMedicineName}
            </p>
            <p className="font-mono text-teal-800 text-xs font-semibold">
              {order.activeSalt} • Qty: {order.quantity} pack
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Total Counter Payable</span>
            <p className="text-lg font-black text-slate-900">₹{order.estimatedPrice.toFixed(2)}</p>
            {order.savingsAmount > 0 && (
              <span className="text-[10px] text-emerald-700 font-bold block">
                Saved ₹{order.savingsAmount.toFixed(2)} via Generic
              </span>
            )}
          </div>
        </div>

        {/* Feedback Button if Order is Dispensed */}
        {order.status === 'Dispensed' && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" />
              Dispensed & Handed Over
            </span>

            <button
              onClick={() => onOpenFeedback(order)}
              disabled={order.customerFeedbackSubmitted}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
                order.customerFeedbackSubmitted 
                  ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                  : 'bg-teal-700 hover:bg-teal-800 text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{order.customerFeedbackSubmitted ? 'Feedback Submitted' : 'Rate Pharmacy & Accuracy'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 4-Stage Connected Lifecycle Timeline */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
          Real-Time Fulfillment Timeline
        </h3>

        <div className="relative pl-7 space-y-5">
          {/* Vertical connector line */}
          <div className="absolute left-[10px] top-4 bottom-4 w-0.5" style={{ background: 'linear-gradient(180deg, #0d9488 0%, #e2e8f0 100%)' }} />

          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.key} className="relative">
                {/* Status Dot */}
                <div
                  className={`absolute -left-7 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCompleted
                      ? 'text-white shadow-md'
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                  style={isCompleted ? { background: 'linear-gradient(135deg, #0d9488, #0891b2)', boxShadow: '0 2px 8px -2px rgba(13,148,136,0.5)' } : {}}
                >
                  {isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  ) : isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="text-[10px]">{idx + 1}</span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-display font-700 text-sm ${
                      isCurrent ? 'text-teal-800' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {stage.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      isCompleted ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {order.statusTimeline[idx]?.note || stage.desc}
                    </p>
                  </div>
                  {order.statusTimeline[idx] && (
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                      {order.statusTimeline[idx].timestamp}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pharmacy Location & Route Preview Card */}
      {pharmacy && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pickup Location & Dispensary
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{pharmacy.name}</h3>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                {pharmacy.address}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pharmacist: <strong className="text-slate-800">{pharmacy.mspcPharmacistName}</strong> ({pharmacy.operatingHours})
              </p>
            </div>

            <a
              href={`tel:${pharmacy.phone}`}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 transition-colors"
              title="Call Pharmacy"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Map & Walking Route Visualizer */}
          <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-teal-600" />
              <div>
                <span className="font-semibold text-slate-800">
                  {pharmacy.distanceKm} km away • ~{Math.round(pharmacy.distanceKm * 12)} mins walking
                </span>
                <p className="text-[10px] text-slate-500">Route via College Road Main Circle</p>
              </div>
            </div>

            <span className="text-teal-700 font-semibold text-[11px] bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-xs">
              Live Directions
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
