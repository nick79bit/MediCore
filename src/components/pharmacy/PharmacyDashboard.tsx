import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Search, 
  ShieldCheck, 
  Thermometer, 
  Users, 
  TrendingUp, 
  QrCode, 
  Pill, 
  FileText, 
  KeyRound,
  Check,
  AlertTriangle,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderRequest, InventoryItem, PharmacyStaff } from '../../types';
import { AddMedicineModal } from './AddMedicineModal';

export const PharmacyDashboard: React.FC = () => {
  const { 
    pharmacies = [], 
    orders = [], 
    inventory = [], 
    pharmacyStaff = [], 
    pharmacyAcceptOrder, 
    pharmacyReserveStock, 
    pharmacyDispenseOrder, 
    updateInventoryStock,
    setRole
  } = useApp();

  // For the demo/prototype, simulate the logged-in pharmacy as Lifecare Medicos
  const currentPharmacy = pharmacies[0] || {
    id: 'pharm-lifecare',
    name: 'Lifecare Medicos & Wellness',
    address: 'Shop 4, College Road, Near Circle, Nashik, Maharashtra 422005',
    verifiedBadge: true,
    mspcPharmacistName: 'Rohini Patil',
    mspcRegistrationNumber: 'MSPC-REG-104921',
    drugLicenseNumber: 'MH-NSK-20-891029 / 21-891030',
    operatingHours: '8:00 AM – 10:30 PM',
    coldChainCompliant: true,
    coldChainTempCelsius: 4.2
  };

  const [activeTab, setActiveTab] = useState<'requests' | 'inventory' | 'compliance' | 'analytics' | 'staff'>('requests');
  const [showAddMedModal, setShowAddMedModal] = useState<boolean>(false);
  const [inventorySearch, setInventorySearch] = useState<string>('');

  // OTP verification dialog state for handover
  const [verifyingOrder, setVerifyingOrder] = useState<OrderRequest | null>(null);
  const [inputOtp, setInputOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  // Filter orders related to this pharmacy
  const pharmacyOrders = (orders || []).filter(o => o?.pharmacyId === currentPharmacy.id || (o?.pharmacyId || '').includes('lifecare'));
  const currentInventory = (inventory || []).filter(i => i?.pharmacyId === currentPharmacy.id);
  const currentStaff = (pharmacyStaff || []).filter(s => s?.pharmacyId === currentPharmacy.id);

  // Filtered inventory list
  const filteredInventory = currentInventory.filter(item => 
    (item?.medicine?.brandName || '').toLowerCase().includes(inventorySearch.toLowerCase()) ||
    (item?.medicine?.activeSalt || '').toLowerCase().includes(inventorySearch.toLowerCase()) ||
    (item?.batchNumber || '').toLowerCase().includes(inventorySearch.toLowerCase())
  );

  // Metrics
  const pendingRequestsCount = pharmacyOrders.filter(o => o?.status === 'Broadcasted' || o?.status === 'Accepted').length;
  const readyPickupCount = pharmacyOrders.filter(o => o?.status === 'Ready for Pickup').length;
  const totalDispensedCount = pharmacyOrders.filter(o => o?.status === 'Dispensed').length;
  const lowStockCount = currentInventory.filter(i => (i?.stockQuantity ?? 0) <= 5).length;

  // Handle OTP dispense verification
  const handleVerifyAndDispense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingOrder) return;

    if (inputOtp.trim() !== verifyingOrder.pickupOtp.trim()) {
      setOtpError('Invalid OTP. Please ask customer to show their secret Counter Pass in app.');
      return;
    }

    pharmacyDispenseOrder(verifyingOrder.id, inputOtp.trim());
    setVerifyingOrder(null);
    setInputOtp('');
    setOtpError('');
  };

  return (
    <div className="space-y-6">
      
      {/* Pharmacy Operational Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Store className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {currentPharmacy.name}
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Form 20/21 Verified Node
                </span>
                <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  POS Live: Synced 3m ago
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-1">
                Pharmacist in-charge: <strong className="text-slate-800">{currentPharmacy.mspcPharmacistName}</strong> ({currentPharmacy.mspcRegistrationNumber})
              </p>
            </div>
          </div>

          {/* Quick Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddMedModal(true)}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medicine to Stock</span>
            </button>
          </div>
        </div>

        {/* Operational KPI Counters */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500">
              <span>Incoming Requests</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{pendingRequestsCount}</p>
            <span className="text-[10px] text-amber-700 font-semibold">SLA Target &lt;8 Mins</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500">
              <span>Counter Trays Ready</span>
              <Package className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <p className="text-2xl font-bold text-teal-800 mt-1">{readyPickupCount}</p>
            <span className="text-[10px] text-slate-500">Awaiting Customer OTP</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500">
              <span>Dispensed Today</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{totalDispensedCount}</p>
            <span className="text-[10px] text-emerald-800">100% Salt Verified</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500">
              <span>Cold Storage IoT</span>
              <Thermometer className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{currentPharmacy.coldChainTempCelsius}°C</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Safe (2°C - 8°C)</span>
          </div>
        </div>
      </div>

      {/* Pharmacy Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Customer Requests & Fulfillment</span>
          {pendingRequestsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-400 text-amber-950 font-extrabold text-[10px] flex items-center justify-center">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>POS Inventory & Form 20/21</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
            {currentInventory.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'compliance'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verification & Cold-Chain</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Generic Substitution Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'staff'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Staff & Pharmacists</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER REQUESTS & FULFILLMENT */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Live Order Requests Stream ({pharmacyOrders.length})
            </h2>
            <span className="text-xs text-slate-500">
              Real-time synchronization with Customer App
            </span>
          </div>

          {pharmacyOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">No active customer requests</p>
              <p className="text-xs text-slate-500 mt-1">
                When patients search for medicines and request counter pickup, they appear here live.
              </p>
              <button
                onClick={() => setRole('customer')}
                className="mt-3 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200"
              >
                Switch to Customer Role to Request Medicine
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {pharmacyOrders.map((order) => {
                const isBroadcasted = order.status === 'Broadcasted';
                const isAccepted = order.status === 'Accepted';
                const isReady = order.status === 'Ready for Pickup';
                const isDispensed = order.status === 'Dispensed';

                return (
                  <div
                    key={order.id}
                    id={`pharmacy-order-row-${order.id}`}
                    className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 hover:border-teal-500 transition-all shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {order.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isDispensed
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isReady
                                ? 'bg-teal-100 text-teal-800 border border-teal-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            ● {order.status.toUpperCase()}
                          </span>

                          {order.selectedGenericName && (
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              Generic Substitution Accepted
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-1.5">
                          {order.selectedGenericName || order.requestedMedicineName}
                        </h3>
                        <p className="text-xs font-mono text-slate-600 font-medium">
                          Active Salt: {order.activeSalt} • Qty: {order.quantity} pack
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Patient: <strong className="text-slate-800">{order.customerName}</strong> ({order.customerPhone})
                        </p>
                      </div>

                      <div className="sm:text-right bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                        <span className="text-xs text-slate-400">Total Counter Payable</span>
                        <p className="text-xl font-bold text-slate-900">₹{order.estimatedPrice.toFixed(2)}</p>
                        {order.counterTrayNumber && (
                          <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded block mt-0.5">
                            Assigned: {order.counterTrayNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Prescription & Patient Note Strip */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-slate-700">Prescription Status: </span>
                        {order.prescriptionUploaded ? (
                          <span className="text-teal-800 font-semibold inline-flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-teal-600" />
                            {order.prescriptionOcrText || 'Valid Doctor Rx Attached'}
                          </span>
                        ) : (
                          <span className="text-slate-500">OTC / Counter Verification</span>
                        )}
                        {order.notes && (
                          <p className="text-slate-500 text-[11px] mt-0.5 italic">
                            Patient note: &ldquo;{order.notes}&rdquo;
                          </p>
                        )}
                      </div>

                      <span className="text-[11px] font-mono text-slate-400">
                        Received: {order.createdAt}
                      </span>
                    </div>

                    {/* Action Buttons for Lifecycle Stage */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-slate-500">
                        {isReady && (
                          <span className="text-teal-800 font-semibold flex items-center gap-1">
                            <Package className="w-3.5 h-3.5" />
                            Holding at {order.counterTrayNumber}. Request customer for OTP ({order.pickupOtp}) to dispense.
                          </span>
                        )}
                        {isDispensed && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Dispensed & Handed over to patient.
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Stage 1: Accept Order */}
                        {isBroadcasted && (
                          <button
                            id={`accept-order-btn-${order.id}`}
                            onClick={() => pharmacyAcceptOrder(order.id)}
                            className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-all"
                          >
                            Accept & Verify Prescription
                          </button>
                        )}

                        {/* Stage 2: Reserve Stock in Tray */}
                        {(isAccepted || isBroadcasted) && (
                          <button
                            id={`reserve-tray-btn-${order.id}`}
                            onClick={() => pharmacyReserveStock(order.id, 'Tray #B-12')}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Reserve in Counter Tray #B-12</span>
                          </button>
                        )}

                        {/* Stage 3: Dispense with Customer OTP */}
                        {isReady && (
                          <button
                            id={`verify-otp-btn-${order.id}`}
                            onClick={() => {
                              setVerifyingOrder(order);
                              setInputOtp('');
                              setOtpError('');
                            }}
                            className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                          >
                            <KeyRound className="w-4 h-4" />
                            <span>Enter Customer OTP to Dispense</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POS INVENTORY & FORM 20/21 */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search stock by brand, molecule salt, batch..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              onClick={() => setShowAddMedModal(true)}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Medicine Batch</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3.5">Medicine & Active Salt</th>
                    <th className="p-3.5">Classification</th>
                    <th className="p-3.5">Batch / Exp</th>
                    <th className="p-3.5">MRP / Store Price</th>
                    <th className="p-3.5">Stock Level</th>
                    <th className="p-3.5 text-right">Quick Adjust</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 text-sm">{item.medicine.brandName}</p>
                        <p className="font-mono text-teal-800 text-[11px] mt-0.5">{item.medicine.activeSalt}</p>
                        <span className="text-[10px] text-slate-400">{item.medicine.manufacturer}</span>
                      </td>

                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.medicine.isGeneric 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {item.medicine.isGeneric ? 'Bioequivalent Generic' : 'Originator Brand'}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          {item.medicine.scheduleCategory}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-mono font-semibold text-slate-800">{item.batchNumber}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Exp: {item.expiryDate}</span>
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">₹{item.sellingPrice.toFixed(2)}</p>
                        <span className="text-[10px] text-slate-400 line-through">MRP ₹{item.medicine.mrp.toFixed(2)}</span>
                      </td>

                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.stockQuantity > 5 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.stockQuantity} packs ({item.status})
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                          <button
                            onClick={() => updateInventoryStock(item.id, Math.max(0, item.stockQuantity - 1))}
                            className="w-6 h-6 rounded bg-white font-bold text-slate-700 hover:bg-slate-200 flex items-center justify-center shadow-xs"
                            title="Decrease Stock"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold w-6 text-center">{item.stockQuantity}</span>
                          <button
                            onClick={() => updateInventoryStock(item.id, item.stockQuantity + 5)}
                            className="w-6 h-6 rounded bg-white font-bold text-slate-700 hover:bg-slate-200 flex items-center justify-center shadow-xs"
                            title="Add 5 Packs"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VERIFICATION & COMPLIANCE */}
      {activeTab === 'compliance' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Regulatory Drug License Status (Form 20 & 21)</h3>
                <p className="text-slate-500">Regulated under Maharashtra Food & Drug Administration (FDA)</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                ACTIVE AUDITED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">License Form 20 (Allopathic)</span>
                <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">MH-NSK-20-891029</p>
                <span className="text-[10px] text-emerald-600 font-medium">Valid through 31 Dec 2028</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">License Form 21 (Specified Schedules)</span>
                <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">MH-NSK-21-891030</p>
                <span className="text-[10px] text-emerald-600 font-medium">Schedule C/C1 & H/H1 Authorized</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Registered Pharmacist (MSPC)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{currentPharmacy.mspcPharmacistName}</p>
                <span className="text-[10px] font-mono text-slate-500">{currentPharmacy.mspcRegistrationNumber}</span>
              </div>
            </div>
          </div>

          {/* IoT Cold Chain Telemetry Monitor */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">IoT Refrigerator Cold-Chain Telemetry</h3>
                  <p className="text-slate-500">Live 2°C – 8°C sensor feed for insulin, vaccines & thermolabile drugs</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Current: {currentPharmacy.coldChainTempCelsius}°C
              </span>
            </div>

            <div className="p-4 bg-teal-950 text-white rounded-xl font-mono text-xs space-y-2">
              <div className="flex justify-between text-teal-300">
                <span>SENSOR: SENSIRION-SHT35-NSK01</span>
                <span>STATUS: STABLE NOMINAL</span>
              </div>
              <div className="h-10 flex items-end gap-1.5 pt-2">
                {[4.1, 4.2, 4.3, 4.2, 4.1, 4.2, 4.2, 4.3, 4.2, 4.2, 4.2].map((val, idx) => (
                  <div key={idx} className="flex-1 bg-teal-500/80 rounded-xs hover:bg-teal-300 transition-colors" style={{ height: `${(val / 8) * 100}%` }} title={`${val}°C`} />
                ))}
              </div>
              <p className="text-[10px] text-teal-400">Zero excursions detected in past 90 days. Compliant with GSP standards.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS & GENERIC ADOPTION */}
      {activeTab === 'analytics' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 block">Generic Substitution Adoption</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">73.8%</p>
              <p className="text-[10px] text-slate-500 mt-1">Patients accepted bioequivalent alternative</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 block">Cumulative Patient Savings</span>
              <p className="text-2xl font-black text-teal-800 mt-1">₹58,410</p>
              <p className="text-[10px] text-slate-500 mt-1">Direct out-of-pocket healthcare expense reduced</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 block">Avg Counter Handover Time</span>
              <p className="text-2xl font-black text-slate-900 mt-1">4.6 Mins</p>
              <p className="text-[10px] text-slate-500 mt-1">From order arrival to OTP confirmation</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STAFF MANAGEMENT */}
      {activeTab === 'staff' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Dispensary Registered Staff & Qualified Pharmacists ({currentStaff.length})
            </h2>
            <span className="text-xs text-slate-500">
              Mandatory MSPC supervision under Rule 65 Drugs Rules
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentStaff.map((staff) => (
              <div key={staff.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                      {staff.role}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1.5">{staff.fullName}</h3>
                    <p className="text-xs text-slate-600 font-medium">{staff.qualification}</p>
                    <p className="text-xs font-mono text-teal-800 mt-0.5">MSPC: {staff.mspcNumber}</p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    staff.isActiveOnShift 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {staff.isActiveOnShift ? '● Active on Counter' : 'Off Shift'}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Shift: <strong>{staff.shiftTiming}</strong></span>
                  <span>{staff.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddMedModal && (
        <AddMedicineModal
          pharmacyId={currentPharmacy.id}
          onClose={() => setShowAddMedModal(false)}
        />
      )}

      {/* Customer OTP Verification Dialog */}
      {verifyingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Confirm Counter Handover</h3>
              </div>
              <button onClick={() => setVerifyingOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <p className="font-bold text-slate-900">
                {verifyingOrder.selectedGenericName || verifyingOrder.requestedMedicineName}
              </p>
              <p className="text-slate-500 mt-0.5">
                Tray: <strong className="text-teal-800">{verifyingOrder.counterTrayNumber}</strong> • Collect ₹{verifyingOrder.estimatedPrice.toFixed(2)}
              </p>
            </div>

            <form onSubmit={handleVerifyAndDispense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ask customer for 6-Digit Counter OTP:
                </label>
                <input
                  id="pharmacist-otp-input"
                  type="text"
                  maxLength={6}
                  required
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  placeholder="e.g. 482910"
                  className="w-full text-center font-mono text-2xl tracking-widest font-black py-2.5 bg-slate-50 border-2 border-teal-600 rounded-xl text-slate-900 focus:outline-hidden"
                />
                {otpError && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">{otpError}</p>
                )}
              </div>

              <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg">
                💡 Hint for testing: Customer&apos;s live OTP is <strong className="font-mono text-teal-800 font-bold">{verifyingOrder.pickupOtp}</strong>.
              </div>

              <button
                id="submit-otp-dispense-btn"
                type="submit"
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify OTP & Mark Dispensed</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
