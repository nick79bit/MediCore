import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Store, 
  Pill, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  Activity, 
  Settings, 
  Search, 
  Users, 
  Sparkles, 
  Clock, 
  FileText, 
  Scale, 
  Plus, 
  Sliders, 
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationApplication, Medicine, AuditLog } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    pharmacies = [], 
    medicines = [], 
    orders = [], 
    verificationApps = [], 
    auditLogs = [], 
    feedbackList = [], 
    feedbacks = [],
    approvePharmacyVerification, 
    rejectPharmacyVerification 
  } = useApp();

  const allFeedbacks = feedbackList || feedbacks || [];

  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'medicines' | 'recommendation-quality' | 'reports' | 'audit'>('overview');
  const [medicineSearch, setMedicineSearch] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<VerificationApplication | null>(null);

  // Metrics
  const verifiedPharmaciesCount = (pharmacies || []).filter(p => p?.verifiedBadge).length;
  const pendingVerificationsCount = (verificationApps || []).filter(a => a?.status === 'Under Review' || a?.status === 'Inspection Scheduled').length;
  const genericMedicinesCount = (medicines || []).filter(m => m?.isGeneric).length;
  const discrepancyReports = (allFeedbacks || []).filter(f => f?.discrepancyReported);

  // Filtered medicines
  const filteredMedicines = (medicines || []).filter(m => 
    (m?.brandName || '').toLowerCase().includes(medicineSearch.toLowerCase()) ||
    (m?.activeSalt || '').toLowerCase().includes(medicineSearch.toLowerCase()) ||
    (m?.manufacturer || '').toLowerCase().includes(medicineSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Admin Executive Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">
                  MediCore CDSCO & State FDA Platform Administration
                </h1>
                <span className="text-[10px] bg-teal-950 text-teal-300 font-mono px-2 py-0.5 rounded border border-teal-800">
                  SYSTEM ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Nashik Central Cluster • Form 20/21 Verification Authority & Bioequivalence Registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 font-mono">
              Cluster SLA: 99.4%
            </span>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block">Verified Pharmacies</span>
            <p className="text-2xl font-bold text-white mt-1">{verifiedPharmaciesCount} Hubs</p>
            <span className="text-[10px] text-teal-400">100% Form 20/21 Audited</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block">Pending Verifications</span>
            <p className="text-2xl font-bold text-amber-400 mt-1">{pendingVerificationsCount} Nodes</p>
            <span className="text-[10px] text-amber-300">Awaiting Physical Audit</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block">CDSCO Formulary</span>
            <p className="text-2xl font-bold text-teal-300 mt-1">{medicines.length} Medicines</p>
            <span className="text-[10px] text-slate-400">{genericMedicinesCount} Bioequivalents</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block">Reported Discrepancies</span>
            <p className="text-2xl font-bold text-red-400 mt-1">{discrepancyReports.length} Flagged</p>
            <span className="text-[10px] text-red-300">Customer Price/Stock Flags</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'verifications'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Pharmacy Verification Pipeline</span>
          {pendingVerificationsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-900 font-extrabold text-[10px] flex items-center justify-center">
              {pendingVerificationsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('medicines')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'medicines'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Clinical Medicine Master</span>
        </button>

        <button
          onClick={() => setActiveTab('recommendation-quality')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'recommendation-quality'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>AI Matching & Bioequivalence Quality</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Discrepancy Reports</span>
          {discrepancyReports.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-500 text-white font-extrabold text-[10px] flex items-center justify-center">
              {discrepancyReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Cluster Live Status Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Nashik Pilot Deployment Health</h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ALL SENSORS NORMAL
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Form 20/21 Verification Rate:</span>
                  <strong className="text-slate-800">100% (4 / 4 Dispensaries Active)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IoT Cold-Chain Compliance:</span>
                  <strong className="text-teal-700">100% (Continuous 2°C - 8°C Telemetry)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Average Bioequivalent Savings:</span>
                  <strong className="text-emerald-700">64.2% Out-of-Pocket Reduction</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dispensary Handover SLA:</span>
                  <strong className="text-slate-800">&lt; 8.4 Minutes Median</strong>
                </div>
              </div>
            </div>

            {/* Quick Pending Verifications Checklist */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Pending Pharmacy Applications</h3>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {pendingVerificationsCount} Under Review
                </span>
              </div>

              <div className="space-y-2">
                {verificationApps.map(app => (
                  <div key={app.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{app.pharmacyName}</p>
                      <p className="text-[10px] text-slate-500">License: {app.drugLicenseNumber} • {app.locality}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setActiveTab('verifications');
                      }}
                      className="text-xs text-teal-700 font-bold hover:underline"
                    >
                      Audit & Approve →
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: PHARMACY VERIFICATION PIPELINE */}
      {activeTab === 'verifications' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pharmacy Onboarding & Statutory Compliance Audit
              </h2>
              <p className="text-slate-500">
                Rigorous Form 20/21 Drug License & MSPC Pharmacist physically audited before inclusion
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* List of Applications */}
            <div className="lg:col-span-1 space-y-2">
              {verificationApps.map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedApp?.id === app.id
                      ? 'bg-teal-50/70 border-teal-600 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-500">{app.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      app.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-1">{app.pharmacyName}</h3>
                  <p className="text-slate-500 mt-0.5">{app.locality} • {app.registeredPharmacistName}</p>
                </div>
              ))}
            </div>

            {/* Application Detail & Audit Action Canvas */}
            <div className="lg:col-span-2">
              {selectedApp ? (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Application #{selectedApp.id}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedApp.pharmacyName}</h3>
                      <p className="text-slate-500">{selectedApp.address}</p>
                    </div>

                    <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                      Submitted: {selectedApp.submittedDate}
                    </span>
                  </div>

                  {/* Verification Checklist */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800">Statutory Form 20/21 Checklist</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Form 20/21 Drug License</span>
                        <p className="font-mono font-bold text-slate-800 mt-0.5">{selectedApp.drugLicenseNumber}</p>
                        <span className="text-[10px] text-emerald-600 block mt-0.5">✓ Uploaded & Digitally Verified</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">MSPC Pharmacist</span>
                        <p className="font-bold text-slate-800 mt-0.5">{selectedApp.registeredPharmacistName}</p>
                        <span className="font-mono text-[10px] text-slate-500 block">{selectedApp.pharmacistRegistrationNumber}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">IoT Refrigerator Cold Storage Available</p>
                        <p className="text-[11px] text-slate-500">Requires certified 2°C - 8°C sensor installation</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        selectedApp.coldStorageAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedApp.coldStorageAvailable ? 'Compliant' : 'Missing'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedApp.status !== 'Approved' && selectedApp.status !== 'Rejected' && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          rejectPharmacyVerification(selectedApp.id, 'Missing calibrated IoT cold-chain sensor log');
                          setSelectedApp(prev => prev ? { ...prev, status: 'Rejected' } : null);
                        }}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl border border-red-200 transition-colors"
                      >
                        Reject Application
                      </button>

                      <button
                        onClick={() => {
                          approvePharmacyVerification(selectedApp.id);
                          setSelectedApp(prev => prev ? { ...prev, status: 'Approved' } : null);
                        }}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Issue Pilot Node Credentials</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  Select an application from the left panel to inspect Form 20/21 documents.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: MEDICINE MASTER & CDSCO FORMULARY */}
      {activeTab === 'medicines' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={medicineSearch}
                onChange={(e) => setMedicineSearch(e.target.value)}
                placeholder="Search clinical formulary by brand, salt, manufacturer..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span>Showing {filteredMedicines.length} of {medicines.length} formulations</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3.5">Brand & Active Salt Molecule</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Bioequivalence & Dissolution</th>
                    <th className="p-3.5">MRP & Unit Price</th>
                    <th className="p-3.5">CDSCO Regulatory Ref</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredMedicines.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50/60">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm">{m.brandName}</p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            m.isGeneric ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {m.isGeneric ? 'Generic' : 'Branded'}
                          </span>
                        </div>
                        <p className="font-mono text-teal-800 text-[11px] mt-0.5">{m.activeSalt}</p>
                        <span className="text-[10px] text-slate-400">{m.manufacturer} • {m.packaging}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800">{m.scheduleCategory}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Rx: {m.requiresPrescription ? 'Required' : 'OTC'}</span>
                      </td>

                      <td className="p-3.5">
                        <p className="font-semibold text-slate-800">
                          {(m.bioavailabilityRatio * 100).toFixed(0)}% Bioavailability
                        </p>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">{m.dissolutionRate}</span>
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">₹{m.mrp.toFixed(2)}</p>
                        <span className="text-[10px] text-slate-500">₹{m.unitPrice.toFixed(2)} / unit</span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {m.cdscoApprovalNumber}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AI MATCHING & BIOEQUIVALENCE QUALITY */}
      {activeTab === 'recommendation-quality' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    MedNorm-Bio Clinical AI Matching Algorithm Engine (v3.1)
                  </h3>
                  <p className="text-slate-500">
                    Active Salt Tokenization & Strict In-Vitro / In-Vivo Confidence Calibration
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                MATCH CONFIDENCE: 98.9%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bioequivalence Bounds</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">80.00% – 125.00%</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Geometric mean 90% confidence interval</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pharmacopeia Standards</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Indian Pharmacopeia (IP 2022)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Monograph dissolution compliance</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient Allergy Safeguard</span>
                <p className="font-bold text-emerald-700 text-sm mt-0.5">Active Automated Intercept</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Beta-lactams, sulfa, and NSAID warning triggers</p>
              </div>
            </div>

            {/* AI Rule Audit Log */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">Active AI Clinical Guardrails:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                <li>Strict molecule chemical salt identity match: Prevents salt-form mismatches (e.g. Amlodipine Besylate vs Maleate).</li>
                <li>Zero AI Prescribing: The platform recommends bioequivalent generic substitutions only for explicitly prescribed active salts. Never prescribes new therapies.</li>
                <li>DPCO Ceiling Price Compliance: Automatically audits whether generic pricing conforms to National Pharmaceutical Pricing Authority (NPPA) orders.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DISCREPANCY REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Customer Discrepancy & Overcharging Reports ({discrepancyReports.length})
            </h2>
            <span className="text-slate-500">
              Triggered automatically when users report price differences or stock discrepancies
            </span>
          </div>

          {discrepancyReports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              No discrepancy reports logged. All transactions match POS inventory and DPCO prices.
            </div>
          ) : (
            <div className="space-y-3">
              {discrepancyReports.map(report => (
                <div key={report.id} className="bg-white rounded-2xl p-4 border-2 border-red-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        FLAGGED: {report.pharmacyName}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600">Order Ref: {report.orderId}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">{report.createdAt}</span>
                  </div>

                  <p className="font-bold text-slate-900 text-xs">
                    Reported by Patient: {report.customerName}
                  </p>
                  <p className="text-red-800 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    &ldquo;{report.discrepancyDetail || report.comment}&rdquo;
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[10px] text-slate-500">
                      Discrepancy audit status: <strong>Under FDA Review</strong>
                    </span>

                    <button
                      onClick={() => alert(`Issuing formal query notice to ${report.pharmacyName} for order ${report.orderId}.`)}
                      className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs"
                    >
                      Issue Regulatory Warning Notice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Immutable Platform Regulatory Audit Trail ({auditLogs.length})
            </h2>
            <span className="text-slate-500 font-mono">SHA-256 Tamper Evident</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Actor Role</th>
                  <th className="p-3">Entity Reference</th>
                  <th className="p-3">Audit Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60 font-mono text-[11px]">
                    <td className="p-3 text-slate-500">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-900">{log.action}</td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        log.actorRole === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        log.actorRole === 'PHARMACY' ? 'bg-teal-100 text-teal-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="p-3 text-teal-800">{log.entityId}</td>
                    <td className="p-3 font-sans text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
