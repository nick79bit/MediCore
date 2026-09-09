import React, { useState } from 'react';
import { 
  ArrowRight,
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  CheckCircle2,
  Phone,
  Radio,
  Navigation,
  BadgeCheck,
  Package,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Medicine, Pharmacy } from '../../types';

interface NearbyPharmaciesListProps {
  medicine?: Medicine; // Optional now, since we're matching the multi-medicine mockup
  onSelectPharmacyForOrder: (pharmacy: Pharmacy) => void;
  onViewPharmacyDetails?: (pharmacy: Pharmacy) => void;
}

export const NearbyPharmaciesList: React.FC<NearbyPharmaciesListProps> = ({
  onSelectPharmacyForOrder,
}) => {
  const { pharmacies } = useApp();
  
  // Use Lifecare as the primary matched pharmacy to match the mockup
  const bestMatchPharmacy = pharmacies.find(p => p.id === 'pharm-lifecare-college-rd') || pharmacies[0];

  return (
    <div className="space-y-4 pb-28 animate-fade-in">
      {/* Top SOS Banner */}
      <div className="bg-red-50/80 border border-red-100 rounded-xl p-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-red-700 font-bold text-[11px]">
          <Activity className="w-4 h-4 text-red-500 animate-pulse" />
          24/7 Urgent Pharmacy SOS Dispatch
        </div>
        <button className="bg-red-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-sm">
          Call Now
        </button>
      </div>

      {/* Broadcast Active Card */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100/50 flex items-center justify-center shrink-0">
              <div className="w-5 h-5 rounded-full bg-teal-600/20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-teal-900 leading-tight">Prescription Broadcast Active</h3>
              <p className="text-[11px] text-slate-600 mt-0.5 font-medium">14 medical stores scanned • 3 responding live</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Radio className="w-4 h-4 text-teal-600 animate-pulse" />
            <span className="text-[9px] font-bold text-teal-700 bg-teal-100/50 px-1.5 py-0.5 rounded">50s update</span>
          </div>
        </div>
        
        {/* Savings Pill */}
        <div className="bg-emerald-100/60 border border-emerald-200/60 rounded-lg p-2 flex items-center gap-1.5">
          <BadgeCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[11px] font-bold text-emerald-800">
            Save up to ₹274 (61%) via Bioequivalent ...3/3 Matched
          </span>
        </div>
      </div>

      {/* Map Section */}
      <div className="relative h-40 bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        {/* Simulated map background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: 'url("https://api.maptiler.com/maps/streets-v2/static/73.7650,20.0050,13/800x400.png?key=get_your_own_OpIi9ZULNHzrESv6T2vL")' }}
        />
        
        {/* Map Overlays */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-slate-200">
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-[10px] font-bold text-slate-800">Nashik (Your Spot)</span>
        </div>

        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm">
          <span className="text-[10px] font-bold text-white tracking-wide">3 Stores in 1.5 km</span>
        </div>

        {/* Pharmacy Pins */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-slate-200">
          <div className="w-2 h-2 rounded-full bg-teal-600" />
          <span className="text-[10px] font-bold text-slate-800">Lifecare (0.5 km)</span>
        </div>

        <div className="absolute bottom-8 left-[45%] bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-slate-200">
          <div className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-[10px] font-bold text-slate-800">Shree Ganesh (0.8 km)</span>
        </div>

        <div className="absolute bottom-3 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-slate-200">
          <div className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-[10px] font-bold text-slate-800">Nashik City (1.4 km)</span>
        </div>
      </div>

      {/* Best Match Card */}
      <div className="bg-white rounded-[1.5rem] border border-teal-100 shadow-[0_8px_24px_-8px_rgba(13,148,136,0.15)] overflow-hidden">
        {/* Header */}
        <div className="bg-teal-700 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white">
            <BadgeCheck className="w-4 h-4 text-teal-200" />
            <span className="text-[11px] font-bold tracking-wider">BEST MATCH • NEAREST &amp; 100% IN-STOCK</span>
          </div>
          <span className="text-[11px] font-bold text-teal-100 bg-teal-800/50 px-2 py-0.5 rounded-full">
            0.5 km • 3 min
          </span>
        </div>

        {/* Pharmacy Details */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Lifecare Medicos &amp; Chemist</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Canada Corner, Nashik • Form 20/21 Verified</p>
              
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                  <Star className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
                  4.9
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1 text-[11px] font-bold text-teal-700">
                  <Clock className="w-3 h-3 text-teal-600" />
                  Held for 60 mins
                </span>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center shrink-0 w-16">
              <ShieldCheck className="w-5 h-5 text-teal-600 mb-1" />
              <span className="text-[9px] font-bold text-slate-500 tracking-wider">MSPC</span>
              <span className="text-[9px] font-bold text-slate-700">#48911</span>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        <div className="px-4 py-2.5 bg-emerald-50/50 border-b border-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-[11px] font-bold text-emerald-800">All 3 Prescribed Medicines In Stock &amp; Reserved</span>
        </div>

        {/* Medicine List */}
        <div className="p-4 space-y-4">
          
          {/* Medicine 1 */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[13px] font-bold text-slate-900">Moxikind-CV 625</span>
                <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">Generic</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Sub: Augmentin 625 • 14 strips available</p>
            </div>
            <div className="text-right">
              <span className="text-[13px] font-bold text-slate-900 block">₹110.00</span>
              <span className="text-[10px] text-slate-400 line-through">₹204.00</span>
            </div>
          </div>

          {/* Medicine 2 */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[13px] font-bold text-slate-900">Pansec 40</span>
                <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">Generic</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Sub: Pan 40 • 22 strips available</p>
            </div>
            <div className="text-right">
              <span className="text-[13px] font-bold text-slate-900 block">₹58.00</span>
              <span className="text-[10px] text-slate-400 line-through">₹155.00</span>
            </div>
          </div>

          {/* Medicine 3 */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[13px] font-bold text-slate-900">Paracetamol 650 IP</span>
                <span className="text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded">IP Grade</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Standard batch • 40 strips available</p>
            </div>
            <div className="text-right">
              <span className="text-[13px] font-bold text-slate-900 block">₹18.50</span>
              <span className="text-[10px] text-slate-400 line-through">₹71.00</span>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-20 left-4 right-4 z-40 animate-slide-up">
        <div className="bg-[#1e293b] rounded-[1.25rem] p-3 pl-5 shadow-2xl border border-slate-700 flex items-center justify-between backdrop-blur-md bg-opacity-95 text-white">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Selected Match
            </span>
            <span className="text-[13px] font-bold leading-tight block">
              Lifecare Medicos <span className="font-normal text-slate-300">(0.5 km)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
              ₹186.50 • 3/3 Reserved
            </span>
          </div>
          
          <button 
            onClick={() => onSelectPharmacyForOrder(bestMatchPharmacy)}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl transition-colors shadow-lg flex items-center gap-1.5"
          >
            Reserve Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
