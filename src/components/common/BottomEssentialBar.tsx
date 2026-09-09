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
        className="fixed bottom-0 left-0 right-0 z-40 print:hidden"
        style={{
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: '1px solid rgba(226,232,240,0.8)',
          boxShadow: '0 -4px 24px rgba(15,23,42,0.08)',
        }}
      >
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2">
          
          {/* 1. CUSTOMER ESSENTIAL BAR */}
          {role === 'customer' && (
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              
              {/* Home / Find Medicines */}
              <button
                id="bottom-nav-home"
                onClick={onSelectHome}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold transition-all min-h-[44px] relative ${
                  activeTab === 'home'
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
                style={activeTab === 'home' ? { background: 'linear-gradient(135deg, #0d9488, #0891b2)', boxShadow: '0 2px 12px -4px rgba(13,148,136,0.5)' } : {}}
              >
                <Home className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'home' ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-[10px] sm:text-xs mt-0.5 whitespace-nowrap">Home</span>
              </button>

              {/* Scan Rx (Prescription OCR) - High Priority Quick Tool */}
              <button
                id="bottom-nav-scan-rx"
                onClick={onOpenOcr}
                className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50/70 transition-all min-h-[44px] group"
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 group-hover:bg-teal-600 group-hover:text-white text-teal-800 flex items-center justify-center transition-colors shadow-2xs">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap font-medium text-slate-700 group-hover:text-teal-800">Scan Rx</span>
              </button>

              {/* Voice AI Search */}
              <button
                id="bottom-nav-voice"
                onClick={onOpenVoice}
                className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-800 hover:bg-indigo-50/70 transition-all min-h-[44px] group"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white text-indigo-700 flex items-center justify-center transition-colors shadow-2xs">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap font-medium text-slate-700 group-hover:text-indigo-800">Voice AI</span>
              </button>

              {/* Track Order / Active Rx Status */}
              <button
                id="bottom-nav-tracking"
                onClick={() => {
                  if (activeOrder) {
                    setTrackingOrderId(activeOrder.id);
                  }
                  onOpenTracking();
                }}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold transition-all min-h-[44px] relative ${
                  activeTab === 'tracking'
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
                style={activeTab === 'tracking' ? { background: 'linear-gradient(135deg, #0d9488, #0891b2)', boxShadow: '0 2px 12px -4px rgba(13,148,136,0.5)' } : {}}
              >
                <div className="relative">
                  <PackageCheck className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'tracking' ? 'text-teal-600' : 'text-slate-500'}`} />
                  {activeOrder && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[11px] sm:text-xs whitespace-nowrap">
                    {activeOrder?.status === 'Ready for Pickup' ? 'Ready Rx' : 'Tracking'}
                  </span>
                </div>
              </button>

              {/* Nearby Verified Pharmacies Locator */}
              <button
                id="bottom-nav-pharmacies"
                onClick={() => {
                  if (onViewPharmaciesList) {
                    onViewPharmaciesList();
                  } else {
                    onSelectHome();
                  }
                }}
                className="hidden sm:flex flex-1 flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all min-h-[44px]"
              >
                <Store className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">Chemists</span>
              </button>

              {/* Patient Safety & ABHA Profile */}
              <button
                id="bottom-nav-profile"
                onClick={onOpenProfile}
                className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">Safety / ABHA</span>
              </button>

              {/* Emergency SOS & Helplines (108) - Life critical quick tool */}
              <button
                id="bottom-nav-emergency"
                onClick={() => setShowEmergencyModal(true)}
                className="flex-1 max-w-[130px] flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 shadow-xs transition-all min-h-[44px] group"
              >
                <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  <Ambulance className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-black text-rose-800 leading-tight whitespace-nowrap">SOS 108</div>
                  <div className="text-[9px] text-rose-600 font-medium whitespace-nowrap hidden sm:block">Helplines</div>
                </div>
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
