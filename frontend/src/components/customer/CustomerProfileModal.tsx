import React from 'react';
import { 
  ArrowLeft,
  QrCode,
  Edit2,
  Phone,
  Droplets,
  Scale,
  AlertTriangle,
  User,
  MapPin,
  HeartPulse,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  BadgeCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CustomerProfileModalProps {
  onClose: () => void;
  onSelectOrder?: (orderId: string) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  onClose,
  onSelectOrder
}) => {
  const { customerProfile } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      {/* Mobile-sized container mimicking the design */}
      <div className="bg-slate-50 rounded-[2.5rem] max-w-md w-full shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)] border border-white/50 overflow-hidden my-auto max-h-[90vh] flex flex-col relative pb-8">
        
        {/* Profile & Settings Header */}
        <div className="px-6 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-blue-200 text-slate-700 flex items-center justify-center hover:bg-blue-50 transition-colors bg-white/50"
              style={{ borderStyle: 'dashed' }} // Dashed border to match reference (or solid if preferred)
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-[1.1rem] font-bold text-slate-900 leading-tight">Profile &amp; Settings</h2>
              <p className="text-[11px] font-medium text-slate-600 mt-0.5">Ayushman Bharat ID • Clinical Profile</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
              <QrCode className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Scrollable Area */}
        <div className="px-5 overflow-y-auto space-y-4 scrollbar-none pb-10">
          
          {/* Main User Card */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] border border-slate-100">
            {/* Avatar & Details */}
            <div className="flex items-start gap-4 mb-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://i.pravatar.cc/150?u=sagar" alt="Sagar Deshmukh" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <BadgeCheck className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                </div>
              </div>
              
              <div className="pt-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">{customerProfile?.fullName || 'Sagar Deshmukh'}</h3>
                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Patient</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1.5">34 Yrs • Male • {customerProfile?.city || 'Nashik, Maharashtra'}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  +91 {customerProfile?.phone || '98231 44210'}
                </div>
              </div>
            </div>

            {/* ABHA ID Card inner */}
            <div className="bg-slate-50/80 rounded-2xl p-3 flex items-center justify-between border border-slate-100/80 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-teal-700 tracking-wider uppercase mb-0.5">ABHA Health ID</p>
                  <p className="text-sm font-bold text-slate-800 tracking-wide">{customerProfile?.abhaId || '91-4209-8831-2094'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] font-bold text-slate-700">Active</span>
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-medium text-slate-500 mb-0.5">Blood</span>
                <span className="text-lg font-bold text-teal-800">O+ve</span>
              </div>
              <div className="bg-blue-50/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-medium text-slate-500 mb-0.5">Weight</span>
                <span className="text-lg font-bold text-slate-800">72 kg</span>
              </div>
              <div className="bg-red-50/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-red-100/50">
                <div className="flex items-center gap-1 text-[10px] font-bold text-red-700 mb-0.5">
                  <AlertTriangle className="w-3 h-3" />
                  Allergy
                </div>
                <span className="text-[13px] font-bold text-red-800 leading-tight">Penicillin</span>
              </div>
            </div>
          </div>

          {/* Personal Details List */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] border border-slate-100">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-[1.1rem] font-bold text-slate-900 leading-tight mb-0.5">Personal Details</h3>
                <p className="text-[11px] font-medium text-slate-500">Identity, logistics and emergency contacts</p>
              </div>
              <button className="text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors">
                Edit
              </button>
            </div>

            <div className="space-y-4">
              {/* Basic Information */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-[1.25rem] bg-teal-100/80 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-bold text-slate-900">Basic Information</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">DOB: 14 Aug 1989 • Male</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
              </div>

              {/* Delivery Addresses */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[13px] font-bold text-slate-900">Delivery Addresses</h4>
                    <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">2 Saved</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate pr-2">Home: College Rd • Work: Canada Corner</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
              </div>

              {/* Emergency Contact */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-[1.25rem] bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[13px] font-bold text-slate-900">Emergency Contact</h4>
                    <span className="text-[9px] font-bold bg-teal-600 text-white px-1.5 py-0.5 rounded-md">Configured</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dr. R. K. Sharma (Family Physician)</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
              </div>

              {/* ABHA & Ayushman Card */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-[1.25rem] bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[13px] font-bold text-slate-900">ABHA &amp; Ayushman Card</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Linked with CoWIN &amp; ABDM Gateway</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
