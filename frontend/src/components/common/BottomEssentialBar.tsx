import React, { useState } from 'react';
import { 
  Home, 
  Camera, 
  Mic, 
  PackageCheck, 
  Store, 
  Ambulance, 
  ShieldCheck, 
  PhoneCall, 
  Layers, 
  PlusCircle, 
  Users, 
  LayoutDashboard, 
  AlertTriangle, 
  FileText, 
  Pill,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmergencyHelplinesModal } from './EmergencyHelplinesModal';
import { Pharmacy } from '../../types';

interface BottomEssentialBarProps {
  onSelectHome: () => void;
  onOpenOcr: () => void;
  onOpenVoice: () => void;
  onOpenTracking: () => void;
  onOpenProfile: () => void;
  onOpenAddMedicine?: () => void;
  onSelectPharmacy?: (pharmacy: Pharmacy) => void;
  onViewPharmaciesList?: () => void;
}

export const BottomEssentialBar: React.FC<BottomEssentialBarProps> = ({
  onSelectHome,
  onOpenOcr,
  onOpenVoice,
  onOpenTracking,
  onOpenProfile,
  onOpenAddMedicine,
  onSelectPharmacy,
  onViewPharmaciesList
}) => {
  const { 
    role, 
    activeTab, 
    setActiveTab, 
    orders = [], 
    trackingOrderId, 
    setTrackingOrderId,
    verificationApps = [],
    feedbackList = [],
    feedbacks = [],
    pharmacies = [],
    inventory = [],
    pharmacyStaff = []
  } = useApp();

  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);

  // Customer active order check
  const activeOrder = (orders || []).find(o => 
    o?.status === 'Ready for Pickup' || 
    o?.status === 'Stock Reserved' || 
    o?.status === 'Broadcasted'
  );

  // Pharmacy metrics
  const pendingOrdersCount = (orders || []).filter(o => 
    o?.status === 'Broadcasted' || 
    o?.status === 'Accepted'
  ).length;

  const lowStockCount = (inventory || []).filter(i => 
    (i?.stockQuantity ?? 0) <= 5
  ).length;

  // Admin metrics
  const pendingVerificationsCount = (verificationApps || []).filter(a => 
    a?.status === 'Pending Review' || 
    a?.status === 'Requires Clarification'
  ).length;

  const allFeedbacks = feedbackList || feedbacks || [];
  const discrepancyCount = (allFeedbacks || []).filter(f => f?.discrepancyReported).length;

  return (
    <>
      {/* Docked Essential Navigation & Quick Action Bar */}
      <nav 
        id="bottom-essential-bar"
        aria-label="Essential Actions Toolbar"
        className={`fixed z-40 print:hidden ${role === 'customer' ? 'bottom-4 left-4 right-4 pointer-events-none' : 'bottom-0 left-0 right-0'}`}
        style={role !== 'customer' ? {
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: '1px solid rgba(226,232,240,0.8)',
          boxShadow: '0 -4px 24px rgba(15,23,42,0.08)',
        } : {}}
      >
        <div className={`max-w-5xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2 pointer-events-auto ${role === 'customer' ? 'w-full max-w-sm' : ''}`}>
          
          {/* 1. CUSTOMER ESSENTIAL BAR */}
          {role === 'customer' && (
            <div className="bg-[#1e293b] rounded-[2rem] p-2 shadow-2xl border border-slate-700/60 backdrop-blur-md flex items-center justify-between w-full animate-slide-up relative">
                
                {/* Home */}
                <button
                  id="bottom-nav-home"
                  onClick={onSelectHome}
                  className="flex-1 flex flex-col items-center justify-center p-2 rounded-full relative group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    activeTab === 'home' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 group-hover:bg-slate-800'
                  }`}>
                    <Home className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-bold mt-1 tracking-wider ${
                    activeTab === 'home' ? 'text-teal-400' : 'text-slate-500'
                  }`}>Home</span>
                </button>

                {/* Scan Rx */}
                <button
                  id="bottom-nav-scan-rx"
                  onClick={onOpenOcr}
                  className="flex-1 flex flex-col items-center justify-center p-2 rounded-full group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-slate-800 transition-all">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 mt-1 tracking-wider">Scan Rx</span>
                </button>

                {/* Voice AI */}
                <button
                  id="bottom-nav-voice"
                  onClick={onOpenVoice}
                  className="flex-1 flex flex-col items-center justify-center p-2 rounded-full group"
                >
                  <div className="w-12 h-12 -mt-6 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(20,184,166,0.4)] hover:scale-105 transition-transform border-[3px] border-[#1e293b]">
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1.5 tracking-wider">Voice</span>
                </button>

                {/* Tracking */}
                <button
                  id="bottom-nav-tracking"
                  onClick={() => {
                    if (activeOrder) setTrackingOrderId(activeOrder.id);
                    onOpenTracking();
                  }}
                  className="flex-1 flex flex-col items-center justify-center p-2 rounded-full relative group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    activeTab === 'tracking' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 group-hover:bg-slate-800'
                  }`}>
                    <div className="relative">
                      <Store className="w-5 h-5" />
                      {activeOrder && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#1e293b]" />
                      )}
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold mt-1 tracking-wider ${
                    activeTab === 'tracking' ? 'text-teal-400' : 'text-slate-500'
                  }`}>Tracking</span>
                </button>

                {/* Call SOS */}
                <button
                  id="bottom-nav-emergency"
                  onClick={() => setShowEmergencyModal(true)}
                  className="flex-1 flex flex-col items-center justify-center p-2 rounded-full group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 group-hover:bg-red-500/10 transition-all border border-transparent group-hover:border-red-500/20">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-bold text-red-400/80 mt-1 tracking-wider">Call SOS</span>
                </button>

              </div>
          )}

          {/* 2. PHARMACY SELLER PORTAL ESSENTIAL BAR */}
          {role === 'pharmacy' && (
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              
              {/* Order Requests Queue */}
              <button
                id="bottom-nav-pharmacy-orders"
                onClick={() => setActiveTab('requests')}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold transition-all min-h-[44px] relative ${
                  activeTab === 'requests'
                    ? 'text-teal-800 bg-teal-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="relative">
                  <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  {pendingOrdersCount > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-teal-600 text-white text-[9px] font-black rounded-full min-w-[14px] text-center shadow-xs">
                      {pendingOrdersCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">Requests</span>
              </button>

              {/* Stock Inventory */}
              <button
                id="bottom-nav-pharmacy-inventory"
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold transition-all min-h-[44px] relative ${
                  activeTab === 'inventory'
                    ? 'text-teal-800 bg-teal-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="relative">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                  {lowStockCount > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-amber-500 text-white text-[9px] font-black rounded-full min-w-[14px] text-center shadow-xs">
                      {lowStockCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">Inventory</span>
              </button>

              {/* Add Medicine SKU */}
              {onOpenAddMedicine && (
                <button
                  id="bottom-nav-pharmacy-add"
                  onClick={onOpenAddMedicine}
                  className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold text-teal-800 hover:bg-teal-50 transition-all min-h-[44px]"
                >
                  <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                  <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">+ Add Med</span>
                </button>
              )}

              {/* Rule 65 Compliance & Cold Chain */}
              <button
                id="bottom-nav-pharmacy-compliance"
                onClick={() => setActiveTab('compliance')}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  activeTab === 'compliance'
                    ? 'text-teal-800 bg-teal-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">Rule 65 / Cold</span>
              </button>

              {/* Staff Roster */}
              <button
                id="bottom-nav-pharmacy-staff"
                onClick={() => setActiveTab('staff')}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  activeTab === 'staff'
                    ? 'text-teal-800 bg-teal-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">
                  Staff ({pharmacyStaff.length})
                </span>
              </button>

              {/* Emergency Helplines Shortcut */}
              <button
                id="bottom-nav-pharmacy-emergency"
                onClick={() => setShowEmergencyModal(true)}
                className="flex items-center justify-center py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 transition-all min-h-[44px]"
                title="Emergency Helplines"
              >
                <Ambulance className="w-4 h-4 text-rose-600" />
                <span className="text-[11px] font-bold ml-1.5 hidden sm:inline">108 SOS</span>
              </button>

            </div>
          )}

          {/* 3. ADMIN PORTAL ESSENTIAL BAR */}
          {role === 'admin' && (
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              
              {/* Overview */}
              <button
                id="bottom-nav-admin-overview"
                onClick={() => setActiveTab('overview')}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  activeTab === 'overview'
                    ? 'text-teal-800 bg-teal-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">Dashboard</span>
              </button>

              {/* Pharmacy Verifications */}
              <button
                id="bottom-nav-admin-verifications"
                onClick={() => setActiveTab('verifications')}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold transition-all min-h-[44px] relative ${
                  activeTab === 'verifications'
                    ? 'text-teal-800 bg-teal-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  {pendingVerificationsCount > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-amber-500 text-white text-[9px] font-black rounded-full min-w-[14px] text-center shadow-xs">
                      {pendingVerificationsCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">Verifications</span>
              </button>

              {/* Medicine Master */}
              <button
                id="bottom-nav-admin-medicines"
                onClick={() => setActiveTab('medicines')}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  activeTab === 'medicines'
                    ? 'text-teal-800 bg-teal-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Pill className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">Master Data</span>
              </button>

              {/* Discrepancy Reports */}
              <button
                id="bottom-nav-admin-reports"
                onClick={() => setActiveTab('reports')}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold transition-all min-h-[44px] relative ${
                  activeTab === 'reports'
                    ? 'text-teal-800 bg-teal-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="relative">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                  {discrepancyCount > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded-full min-w-[14px] text-center shadow-xs">
                      {discrepancyCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">Discrepancies</span>
              </button>

              {/* Audit Logs */}
              <button
                id="bottom-nav-admin-audit"
                onClick={() => setActiveTab('audit')}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  activeTab === 'audit'
                    ? 'text-teal-800 bg-teal-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">Audit Trail</span>
              </button>

              {/* Emergency Helplines Shortcut */}
              <button
                id="bottom-nav-admin-emergency"
                onClick={() => setShowEmergencyModal(true)}
                className="flex items-center justify-center py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 transition-all min-h-[44px]"
                title="Emergency Helplines"
              >
                <Ambulance className="w-4 h-4 text-rose-600" />
                <span className="text-[11px] font-bold ml-1.5 hidden sm:inline">108 SOS</span>
              </button>

            </div>
          )}

        </div>
      </nav>

      {/* Emergency & Essential Helplines Modal */}
      {showEmergencyModal && (
        <EmergencyHelplinesModal
          pharmacies={pharmacies}
          onClose={() => setShowEmergencyModal(false)}
          onSelectPharmacy={onSelectPharmacy}
        />
      )}
    </>
  );
};
