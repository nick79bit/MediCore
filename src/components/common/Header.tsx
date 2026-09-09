import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Pill, 
  Store, 
  ShieldCheck, 
  Bell, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  Clock,
  X,
  AlertCircle,
  Info
} from 'lucide-react';
import { UserRole } from '../../types';

const ROLE_CONFIGS = [
  { role: 'customer' as UserRole,  label: 'Customer',      icon: Smartphone, gradColors: '#0d9488,#22d3ee' },
  { role: 'pharmacy' as UserRole,  label: 'Pharmacy',      icon: Store,       gradColors: '#059669,#14b8a6' },
  { role: 'admin'    as UserRole,  label: 'Admin Console', icon: ShieldCheck, gradColors: '#4f46e5,#7c3aed' },
];

const NOTIFICATION_ICON: Record<string, React.ElementType> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  alert: AlertCircle,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  info: 'text-blue-500',
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  alert: 'text-red-500',
};

interface HeaderProps {
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile }) => {
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

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setActiveTab('home');
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Regulatory Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            CDSCO / DPCO Compliant
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-slate-400">
            Pilot: <span className="text-white font-medium">Nashik Zone, Maharashtra</span>
          </span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="hidden md:inline text-slate-500 text-[11px]">
            AI matching only — not a prescribing system. Emergency: <strong className="text-white">108</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          48 Verified Pharmacies Live
        </div>
      </div>

      {/* Main Header Bar */}
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(226,232,240,0.7)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4" style={{ height: '60px' }}>

            {/* Logo */}
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)' }}
              >
                <Pill className="w-4 h-4 text-white -rotate-45" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-baseline gap-1.5">
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }} className="text-slate-900 text-base tracking-tight">MediCore</span>
                  <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded-full">GenericMed</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-none">AI Bioequivalent &amp; Pharmacy Network</p>
              </div>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 gap-0.5">
              {ROLE_CONFIGS.map(({ role: r, label, icon: Icon, gradColors }) => (
                <button
                  key={r}
                  id={`role-btn-${r}`}
                  onClick={() => handleRoleSwitch(r)}
                  className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    role === r
                      ? 'text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  style={role === r ? {
                    backgroundImage: `linear-gradient(135deg, ${gradColors})`,
                    boxShadow: '0 2px 8px -2px rgba(0,0,0,0.25)',
                  } : {}}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                  {r === 'pharmacy' && role !== 'pharmacy' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 shrink-0">

              {/* View Mode Toggle (Customer only) */}
              {role === 'customer' && (
                <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 gap-0.5">
                  <button
                    onClick={() => setCustomerViewMode('mobile')}
                    title="Mobile viewport"
                    className={`p-1.5 rounded-md transition-all ${customerViewMode === 'mobile' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCustomerViewMode('desktop')}
                    title="Desktop viewport"
                    className={`p-1.5 rounded-md transition-all ${customerViewMode === 'desktop' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Notification Bell */}
              <div className="relative">
                <button
                  id="header-notification-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span
                      className="absolute top-1 right-1 w-4 h-4 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse-glow"
                      style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)' }}
                    >
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl z-50 overflow-hidden animate-fade-in-scale"
                    style={{
                      boxShadow: '0 20px 60px -12px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(226,232,240,0.8)',
                      background: '#fff',
                    }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold text-sm text-slate-900">Notifications</span>
                        {unreadNotificationsCount > 0 && (
                          <span className="badge badge-brand text-[10px]">{unreadNotificationsCount} new</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadNotificationsCount > 0 && (
                          <button onClick={markAllNotificationsRead} className="text-[11px] text-teal-600 hover:text-teal-800 font-semibold">
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto scrollbar-none">
                      {notifications.map((n) => {
                        const NIcon = NOTIFICATION_ICON[n.type] || Info;
                        return (
                          <button
                            key={n.id}
                            onClick={() => {
                              if (n.orderId) {
                                setTrackingOrderId(n.orderId);
                                setRole('customer');
                                setActiveTab('tracking');
                              }
                              setShowNotifications(false);
                            }}
                            className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${!n.read ? 'bg-teal-50/40' : ''}`}
                          >
                            <div className={`mt-0.5 shrink-0 ${NOTIFICATION_COLORS[n.type]}`}>
                              <NIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-2">
                                <p className="text-xs font-semibold text-slate-900 truncate">{n.title}</p>
                                <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" />{n.time}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                              {!n.read && <span className="inline-block mt-1 w-1.5 h-1.5 rounded-full bg-teal-500" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <button
                onClick={onOpenProfile}
                className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 ml-1 group"
              >
                {role === 'customer' && (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-800 flex items-center justify-center font-bold text-xs border border-teal-200 group-hover:border-teal-400 transition-colors">
                      RS
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-[11px] font-semibold text-slate-800">Rahul Sharma</p>
                      <p className="text-[10px] text-slate-400">ABHA: 91-8921-3819</p>
                    </div>
                  </>
                )}
                {role === 'pharmacy' && (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200">
                      LP
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-[11px] font-semibold text-slate-800">{currentSellerPharmacy?.name}</p>
                      <p className="text-[10px] text-emerald-600 font-medium">Form 20/21 Verified</p>
                    </div>
                  </>
                )}
                {role === 'admin' && (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-800 flex items-center justify-center font-bold text-xs border border-indigo-200">
                      AK
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-[11px] font-semibold text-slate-800">Dr. A. Kulkarni</p>
                      <p className="text-[10px] text-indigo-500 font-medium">Chief Regulatory Admin</p>
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
