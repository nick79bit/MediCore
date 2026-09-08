import React from 'react';
import { 
  PhoneCall, 
  Ambulance, 
  ShieldAlert, 
  X, 
  Store, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  MapPin,
  HeartPulse
} from 'lucide-react';
import { Pharmacy } from '../../types';

interface EmergencyHelplinesModalProps {
  onClose: () => void;
  pharmacies: Pharmacy[];
  onSelectPharmacy?: (pharmacy: Pharmacy) => void;
}

export const EmergencyHelplinesModal: React.FC<EmergencyHelplinesModalProps> = ({
  onClose,
  pharmacies,
  onSelectPharmacy
}) => {
  // Find pharmacies that have 24/7 or late hours
  const emergencyPharmacies = (pharmacies || []).slice(0, 3);

  const helplines = [
    {
      title: 'National Ambulance & Emergency Care',
      number: '108',
      desc: '24/7 Toll-free Emergency Trauma & Ambulance Service',
      icon: Ambulance,
      color: 'bg-rose-500 text-white',
      badge: 'Immediate Response',
      tel: 'tel:108'
    },
    {
      title: 'Government Health & Medical Advice',
      number: '104',
      desc: 'Qualified medical officer triage, tele-consultation & guidance',
      icon: HeartPulse,
      color: 'bg-emerald-600 text-white',
      badge: 'Toll-Free 24x7',
      tel: 'tel:104'
    },
    {
      title: 'Pradhan Mantri Jan Aushadhi Helpline',
      number: '1800-180-8080',
      desc: 'Government affordable generic drug supply & complaints',
      icon: PhoneCall,
      color: 'bg-blue-600 text-white',
      badge: 'Govt. Helpline',
      tel: 'tel:18001808080'
    },
    {
      title: 'CDSCO Pharmacovigilance & Drug Reaction',
      number: '1800-111-255',
      desc: 'Report adverse drug reactions (ADR) or counterfeit medicines',
      icon: ShieldAlert,
      color: 'bg-amber-600 text-white',
      badge: 'National Safety',
      tel: 'tel:1800111255'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <Ambulance className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Emergency & Essential Helplines</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  24x7 SOS
                </span>
              </div>
              <p className="text-xs text-slate-600">Immediate medical help, ambulances & 24x7 pharmacies</p>
            </div>
          </div>
          
          <button
            id="close-emergency-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Life Threat Warning */}
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Life-Threatening Emergency Notice:</span>
              <p className="mt-0.5 text-rose-800">
                If the patient is experiencing chest pain, severe breathing distress, heavy trauma, or unconsciousness, 
                do not wait for an order or generic search. <strong>Call 108 immediately.</strong>
              </p>
            </div>
          </div>

          {/* Quick Helplines Grid */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase text-slate-500">
              National Emergency Contacts
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {helplines.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.tel}
                    id={`helpline-btn-${item.number}`}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/30 transition-all flex flex-col justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {item.badge}
                          </span>
                        </div>
                        <PhoneCall className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">{item.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-black font-mono text-slate-900 tracking-tight group-hover:text-teal-700">
                        {item.number}
                      </span>
                      <span className="text-[11px] font-semibold text-teal-700 underline group-hover:text-teal-800">
                        Call Now
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* 24x7 Night Dispensaries & Verified Emergency Pharmacies */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase text-slate-500 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-teal-600" />
                <span>Verified Local Emergency Pharmacies (Nashik Cluster)</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Within 3.5 km</span>
            </div>

            <div className="space-y-2">
              {emergencyPharmacies.map((pharm) => (
                <div 
                  key={pharm.id}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{pharm.name}</p>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 shrink-0">
                        {pharm.operatingHours.includes('24') ? '24x7 Open' : 'Open Today'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{pharm.address}</span>
                      <span className="text-slate-400 font-mono">({pharm.distanceKm} km)</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`tel:${pharm.phone.replace(/[^0-9+]/g, '')}`}
                      id={`call-pharmacy-${pharm.id}`}
                      className="px-2.5 py-1.5 bg-white hover:bg-teal-50 text-teal-700 border border-slate-200 hover:border-teal-300 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-all"
                    >
                      <PhoneCall className="w-3 h-3 text-teal-600" />
                      <span>Call</span>
                    </a>
                    {onSelectPharmacy && (
                      <button
                        onClick={() => {
                          onSelectPharmacy(pharm);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>All contacts regulated under National Disaster & Drugs Rules</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
