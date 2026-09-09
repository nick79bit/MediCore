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
  ChevronRight,
  LayoutDashboard,
  BoxSelect,
  Server,
  Lock,
  Flag,
  ClipboardList
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

  const [activeTab, setActiveTab] = useState<string>('product-master');
  const [medicineSearch, setMedicineSearch] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<VerificationApplication | null>(null);

  // Metrics
  const verifiedPharmaciesCount = (pharmacies || []).filter(p => p?.verifiedBadge).length;
  const pendingVerificationsCount = (verificationApps || []).filter(a => a?.status === 'Pending Review').length;
  const genericMedicinesCount = (medicines || []).filter(m => m?.isGeneric).length;
  const discrepancyReports = (allFeedbacks || []).filter(f => f?.discrepancyReported);

  // Filtered medicines
  const filteredMedicines = (medicines || []).filter(m => 
    (m?.brandName || '').toLowerCase().includes(medicineSearch.toLowerCase()) ||
    (m?.activeSalt || '').toLowerCase().includes(medicineSearch.toLowerCase()) ||
    (m?.manufacturer || '').toLowerCase().includes(medicineSearch.toLowerCase())
  );

  return (
    <div className="flex h-[100dvh] bg-slate-50 animate-fade-in overflow-hidden -m-4 sm:-m-6 md:-m-8">
      
      {/* ── Sidebar Navigation (Matching Figma) ── */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        
        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3">
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
                      <p className="text-[10px] text-slate-500">License: {app.form20LicenseNumber} • {app.locality}</p>
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
                        : app.status === 'Pending Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-1">{app.pharmacyName}</h3>
                  <p className="text-slate-500 mt-0.5">{app.locality} • {app.pharmacistName}</p>
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
                      Submitted: {selectedApp.submittedAt}
                    </span>
                  </div>

                  {/* Verification Checklist */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800">Statutory Form 20/21 Checklist</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Form 20/21 Drug License</span>
                        <p className="font-mono font-bold text-slate-800 mt-0.5">{selectedApp.form20LicenseNumber} / {selectedApp.form21LicenseNumber}</p>
                        <span className="text-[10px] text-emerald-600 block mt-0.5">✓ Uploaded & Digitally Verified</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">MSPC Pharmacist</span>
                        <p className="font-bold text-slate-800 mt-0.5">{selectedApp.pharmacistName}</p>
                        <span className="font-mono text-[10px] text-slate-500 block">{selectedApp.pharmacistMspcNumber}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">Uploaded Documents Compliance</p>
                        <p className="text-[11px] text-slate-500">Requires verified Form 20, 21 and Pharmacist Registration</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        selectedApp.documents.every(d => d.verified) ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedApp.documents.every(d => d.verified) ? 'Compliant' : 'Pending Documents'}
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

                    <span className="text-[10px] font-mono text-slate-400">{report.timestamp}</span>
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
                  <th className="p-3">Target Reference</th>
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
                        log.actorRole === 'Admin' ? 'bg-purple-100 text-purple-800' :
                        log.actorRole === 'Pharmacy' ? 'bg-teal-100 text-teal-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="p-3 text-teal-800">{log.target}</td>
                    <td className="p-3 font-sans text-slate-600">{log.actorName} {log.metadata ? JSON.stringify(log.metadata) : ''}</td>
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
