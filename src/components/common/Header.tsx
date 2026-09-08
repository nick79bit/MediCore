import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Pill, 
  Store, 
  ShieldCheck, 
  Bell, 
  Smartphone, 
  Monitor, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Clock,
  Sparkles,
  Search,
  FileText
} from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    customerViewMode, 
    setCustomerViewMode,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsRead,
    setTrackingOrderId,
    setActiveTab,
    currentSellerPharmacy
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Clinical Safety & Regulatory Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            CDSCO / DPCO Bioequivalent Standard
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden md:inline">
            Pilot Node: <span className="text-white font-medium">Nashik Zone (Maharashtra)</span>
          </span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-slate-400 text-[11px] truncate max-w-md">
            Informational AI clinical matching only. Not a prescribing system. In emergency dial <strong>108</strong>.
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-emerald-300 flex items-center gap-1 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            48 Verified Pharmacies Live
          </span>
        </div>
      </div>

      {/* Main Navigation & Role Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & App Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('home'); }}>
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-700/20">
              <Pill className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">MediCore</span>
                <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-200">
                  GenericMed
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5">AI Bioequivalent & Pharmacy Network</p>
            </div>
          </div>

          {/* Connected Role Switcher (Crucial for Reviewing All 3 Connected Roles) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="role-btn-customer"
              onClick={() => setRole('customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'customer'
                  ? 'bg-white text-teal-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-600" />
              <span>Customer</span>
            </button>

            <button
              id="role-btn-pharmacy"
              onClick={() => setRole('pharmacy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'pharmacy'
                  ? 'bg-white text-teal-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pharmacy Portal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            <button
              id="role-btn-admin"
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'admin'
                  ? 'bg-white text-teal-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Console</span>
            </button>
          </div>

          {/* Right Controls: Customer View Mode + Notifications */}
          <div className="flex items-center gap-3">
            {role === 'customer' && (
              <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 text-xs text-slate-600">
                <button
                  onClick={() => setCustomerViewMode('mobile')}
                  title="Mobile App Viewport"
                  className={`p-1.5 rounded ${customerViewMode === 'mobile' ? 'bg-white text-teal-700 shadow-xs font-medium' : 'hover:text-slate-900'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCustomerViewMode('desktop')}
                  title="Expanded Desktop Viewport"
                  className={`p-1.5 rounded ${customerViewMode === 'desktop' ? 'bg-white text-teal-700 shadow-xs font-medium' : 'hover:text-slate-900'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="header-notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-teal-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-xs text-slate-900">Live Activity Alerts</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-teal-600 hover:text-teal-800 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id}
                        onClick={() => {
                          if (n.orderId) {
                            setTrackingOrderId(n.orderId);
                            setRole('customer');
                            setActiveTab('tracking');
                          }
                          setShowNotifications(false);
                        }}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                          !n.read ? 'bg-teal-50/50 border-teal-200' : 'bg-white border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                        {n.orderId && (
                          <span className="inline-block mt-1.5 text-[10px] font-mono text-teal-700 font-medium">
                            Click to track {n.orderId} →
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Context Badge for current role */}
            <div className="hidden lg:flex items-center pl-2 border-l border-slate-200 text-xs">
              {role === 'customer' && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                    RS
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-[11px] leading-tight">Rahul Sharma</p>
                    <p className="text-[10px] text-slate-500">ABHA: 91-8921-3819</p>
                  </div>
                </div>
              )}

              {role === 'pharmacy' && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    LP
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-[11px] leading-tight">{currentSellerPharmacy.name}</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Form 20/21 Verified • College Rd</p>
                  </div>
                </div>
              )}

              {role === 'admin' && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                    AK
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-[11px] leading-tight">Dr. A. Kulkarni</p>
                    <p className="text-[10px] text-indigo-600 font-medium">Chief Regulatory Admin • Nashik</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
