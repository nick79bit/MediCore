import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  TrendingDown,
  Pill,
  ChevronRight,
  Activity,
  Users,
  Clock,
  Star,
  CheckCircle2,
  Zap,
  Lock,
  ArrowRight,
  Heart
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onEnter: (role: UserRole) => void;
}

const STATS = [
  { value: '62.4%', label: 'Avg. Savings', sub: 'Per chronic refill', icon: TrendingDown, color: 'text-emerald-600' },
  { value: '4+',    label: 'Verified Hubs', sub: 'Nashik Pilot Cluster', icon: MapPin, color: 'text-brand' },
  { value: '99.1%', label: 'Stock Accuracy', sub: 'POS synced <15 min', icon: Activity, color: 'text-blue-500' },
  { value: '< 8m',  label: 'SLA Response', sub: 'Counter tray reservation', icon: Clock, color: 'text-amber-500' },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Salt Matching',
    description: 'MedNorm-Bio AI clinically maps brand medicines to CDSCO-approved bioequivalent generics by active salt and dissolution standards.',
    color: 'from-teal-500/10 to-cyan-500/10',
    iconColor: 'text-teal-600',
    badge: 'Powered by Gemini',
  },
  {
    icon: TrendingDown,
    title: 'Real Price Comparison',
    description: 'Compare DPCO ceiling prices, Jan Aushadhi rates, and local pharmacy stock prices side-by-side with transparent savings breakdowns.',
    color: 'from-emerald-500/10 to-teal-500/10',
    iconColor: 'text-emerald-600',
    badge: 'DPCO Compliant',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Pharmacies',
    description: 'Every pharmacy is Form 20/21 licensed, MSPC pharmacist-staffed, and cold-chain compliant. Live POS stock sync every 15 minutes.',
    color: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-600',
    badge: 'CDSCO Verified',
  },
  {
    icon: Zap,
    title: 'Instant Reservation',
    description: 'Reserve stock at your nearest pharmacy in under 8 minutes. Secure QR pickup pass + OTP confirmation sent directly to you.',
    color: 'from-amber-500/10 to-orange-500/10',
    iconColor: 'text-amber-600',
    badge: '< 8 Min SLA',
  },
];

const ROLES = [
  {
    role: 'customer' as UserRole,
    label: 'Find Generic Medicines',
    sub: 'For patients & caregivers',
    icon: Heart,
    gradient: 'from-teal-600 to-cyan-600',
    glow: 'rgba(13,148,136,0.35)',
    features: ['AI bioequivalent matching', 'Prescription OCR scanner', 'Voice search', 'Live order tracking'],
  },
  {
    role: 'pharmacy' as UserRole,
    label: 'Pharmacy Portal',
    sub: 'For registered dispensaries',
    icon: Pill,
    gradient: 'from-blue-600 to-indigo-600',
    glow: 'rgba(59,130,246,0.35)',
    features: ['Manage inventory & stock', 'Accept & fulfill orders', 'Staff management', 'Sales analytics'],
  },
  {
    role: 'admin' as UserRole,
    label: 'Admin & Regulatory',
    sub: 'For platform governance',
    icon: ShieldCheck,
    gradient: 'from-violet-600 to-purple-600',
    glow: 'rgba(124,58,237,0.35)',
    features: ['Verify pharmacy licenses', 'Audit logs & compliance', 'Discrepancy resolution', 'Platform analytics'],
  },
];

const TRUST_MARKS = [
  { label: 'CDSCO Bioequivalence Compliant' },
  { label: 'Drug Price Control Order (DPCO)' },
  { label: 'Jan Aushadhi Standards' },
  { label: 'ABHA Health Account Integration' },
  { label: 'MSPC Pharmacist Verified' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [visible, setVisible] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-40 glass border-b border-white/40"
        style={{ borderBottom: '1px solid rgba(226,232,240,0.6)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shadow-sm animate-float" style={{ animationDelay: '0ms' }}>
              <Pill className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-800 text-sm text-slate-900 tracking-tight">MediCore</span>
              <span className="text-xs text-slate-400 ml-1 hidden sm:inline">GenericMed</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Nashik Pilot Live
            </span>
            <button
              onClick={() => onEnter('customer')}
              className="btn btn-primary text-xs px-4 py-2"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden flex-1 flex flex-col items-center justify-center px-4 py-20 sm:py-28 text-center hero-grid"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% -5%, rgba(13,148,136,0.14) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(8,145,178,0.08) 0%, transparent 60%), linear-gradient(180deg, #f0fdfb 0%, #f8fafc 60%, #f1f5f9 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-16 right-16 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none animate-float"
          style={{ background: 'radial-gradient(circle, #2dd4bf, transparent)' }}
        />
        <div
          className="absolute bottom-20 left-8 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none animate-float"
          style={{ background: 'radial-gradient(circle, #0891b2, transparent)', animationDelay: '1.5s' }}
        />

        <div
          className={`relative z-10 max-w-3xl transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200/60 text-teal-800 text-xs font-bold mb-6 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>MedNorm-Bio AI Clinical Salt Matcher</span>
            <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">NEW</span>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-800 text-slate-900 leading-[1.08] tracking-tight mb-6"
          >
            Save Up to{' '}
            <span className="text-shimmer">62%</span>{' '}
            on Medicines<br className="hidden sm:block" />
            with CDSCO Generics
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
            AI-powered bioequivalent generic medicine matching, transparent DPCO price comparison, and instant stock reservation at verified Nashik pharmacies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onEnter('customer')}
              className="btn btn-primary text-sm px-6 py-3 gap-2 shadow-lg hover:-translate-y-1 transition-transform"
              style={{ boxShadow: '0 8px 28px -6px rgba(13,148,136,0.55)' }}
            >
              <Sparkles className="w-4 h-4" />
              Find Generic Alternatives
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEnter('pharmacy')}
              className="btn btn-secondary text-sm px-6 py-3 hover:shadow-md transition-all"
            >
              Pharmacy Login
            </button>
          </div>

          {/* Trust strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {TRUST_MARKS.map((m) => (
              <span key={m.label} className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="bg-white border-y border-slate-100 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 stagger">
            {STATS.map((s) => (
              <div key={s.label} className="text-center group animate-fade-in">
                <div className={`w-10 h-10 rounded-2xl mx-auto mb-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md`}
                  style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(8,145,178,0.08))' }}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <p className={`text-2xl sm:text-3xl font-display font-800 ${s.color}`}>{s.value}</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{s.label}</p>
                <p className="text-[11px] text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-16 sm:py-20 px-4 bg-slate-50/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Why MediCore</p>
            <h2 className="text-2xl sm:text-3xl font-display font-700 text-slate-900 tracking-tight">
              Healthcare built for{' '}
              <span className="text-gradient">real affordability</span>
            </h2>
            <p className="text-sm text-slate-500 mt-3 max-w-lg mx-auto">
              From AI clinical matching to verified dispensary networks — every step is designed to get you safe, affordable medicines faster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card p-6 animate-fade-in group cursor-default border-l-4 transition-all duration-300"
                style={{ borderLeftColor: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.borderLeftColor = '#0d9488')}
                onMouseLeave={e => (e.currentTarget.style.borderLeftColor = 'transparent')}
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-700 text-slate-900 text-base">{f.title}</h3>
                  <span className="badge badge-brand text-[10px] shrink-0">{f.badge}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Selection / Entry ── */}
      <section className="py-16 sm:py-20 px-4" id="get-started">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Choose Your Role</p>
            <h2 className="text-2xl sm:text-3xl font-display font-700 text-slate-900 tracking-tight">
              Enter the Platform
            </h2>
            <p className="text-sm text-slate-500 mt-2">Select how you'd like to use MediCore today.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {ROLES.map((r) => (
              <button
                key={r.role}
                id={`role-entry-${r.role}`}
                onClick={() => onEnter(r.role)}
                onMouseEnter={() => setHoveredRole(r.role)}
                onMouseLeave={() => setHoveredRole(null)}
                className="relative group text-left rounded-2xl p-6 border-2 transition-all duration-300 overflow-hidden bg-white"
                style={{
                  borderColor: hoveredRole === r.role ? 'transparent' : '#e2e8f0',
                  boxShadow: hoveredRole === r.role
                    ? `0 12px 48px -8px ${r.glow}, 0 4px 12px rgba(0,0,0,0.08)`
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: hoveredRole === r.role ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
                }}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${r.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 rounded-2xl pointer-events-none`}
                />
                {/* Shimmer top border on hover */}
                <div
                  className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${r.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl pointer-events-none`}
                />

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <r.icon className="w-5.5 h-5.5 text-white" />
                </div>

                <h3 className="font-display font-700 text-slate-900 text-base mb-0.5">{r.label}</h3>
                <p className="text-xs text-slate-400 font-medium mb-4">{r.sub}</p>

                <ul className="space-y-1.5 mb-5">
                  {r.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className={`flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r ${r.gradient} bg-clip-text text-transparent`}>
                  <span>Enter as {r.label.split(' ')[0]}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-600 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-brand flex items-center justify-center">
              <Pill className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-slate-600">MediCore GenericMed</span>
            <span>• Nashik Pilot Cluster</span>
          </div>
          <div className="flex items-center gap-4">
            <span>CDSCO &amp; DPCO Compliant</span>
            <span>•</span>
            <span>For emergencies, dial 108</span>
            <span>•</span>
            <span>© 2026 MediCore</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
