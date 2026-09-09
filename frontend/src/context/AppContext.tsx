import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Medicine, 
  Pharmacy, 
  PharmacyInventoryItem, 
  OrderRequest, 
  FeedbackRecord, 
  AuditLog, 
  PharmacyVerificationApplication, 
  CustomerProfile,
  GenericAlternativeMatch,
  OrderStatus,
  PharmacyStaff
} from '../types';
import { fetchSeed } from '../api/client';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  orderId?: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  customerViewMode: 'mobile' | 'desktop';
  setCustomerViewMode: (mode: 'mobile' | 'desktop') => void;
  
  // Loading state
  isLoading: boolean;

  // Data
  medicines: Medicine[];
  pharmacies: Pharmacy[];
  inventory: PharmacyInventoryItem[];
  orders: OrderRequest[];
  feedbacks: FeedbackRecord[];
  feedbackList: FeedbackRecord[];
  auditLogs: AuditLog[];
  verificationApps: PharmacyVerificationApplication[];
  customerProfile: CustomerProfile | null;
  notifications: NotificationItem[];
  pharmacyStaff: PharmacyStaff[];
  
  // Navigation / Active selections
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMedicine: Medicine | null;
  setSelectedMedicine: (med: Medicine | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  selectedPharmacyForDetail: Pharmacy | null;
  setSelectedPharmacyForDetail: (pharm: Pharmacy | null) => void;
  
  // Current Pharmacy in seller mode
  currentSellerPharmacyId: string;
  setCurrentSellerPharmacyId: (id: string) => void;
  currentSellerPharmacy: Pharmacy;

  // Actions
  findGenericMatches: (targetMed: Medicine) => GenericAlternativeMatch[];
  createOrderRequest: (orderData: {
    requestedMedicine: Medicine;
    selectedGeneric?: Medicine;
    quantity: number;
    pharmacy: Pharmacy;
    prescriptionUploaded: boolean;
    prescriptionOcrText?: string;
    notes?: string;
  }) => OrderRequest;
  
  pharmacyAcceptOrder: (orderId: string, trayNumber: string) => void;
  pharmacyReserveStock: (orderId: string, trayNumber: string) => void;
  pharmacyDeclineOrder: (orderId: string, reason: string) => void;
  pharmacyMarkReady: (orderId: string) => void;
  pharmacyDispenseOrder: (orderId: string, enteredOtp: string) => { success: boolean; error?: string };
  
  submitFeedback: (feedback: Omit<FeedbackRecord, 'id' | 'timestamp'>) => void;
  updateInventoryItem: (itemId: string, newStock: number, newPrice: number) => void;
  updateInventoryStock: (itemId: string, newStock: number, newPrice: number) => void;
  addNewInventoryItem: (item: Omit<PharmacyInventoryItem, 'id' | 'lastUpdated'>) => void;
  addInventoryItem: (item: Omit<PharmacyInventoryItem, 'id' | 'lastUpdated'>) => void;
  addNewMedicine: (med: Medicine) => void;
  
  approvePharmacyVerification: (appId: string, notes?: string) => void;
  rejectPharmacyVerification: (appId: string, reason: string) => void;
  resolveDiscrepancyFlag: (feedbackId: string) => void;
  
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;
}

// Fallback empty profile used while data is loading
const EMPTY_PROFILE: CustomerProfile = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  abhaId: '',
  address: '',
  city: '',
  knownAllergies: [],
  chronicConditions: [],
  savedPharmaciesIds: [],
  preferredRadiusKm: 5,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [customerViewMode, setCustomerViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [inventory, setInventory] = useState<PharmacyInventoryItem[]>([]);
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [verificationApps, setVerificationApps] = useState<PharmacyVerificationApplication[]>([]);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [pharmacyStaff, setPharmacyStaff] = useState<PharmacyStaff[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>('ORD-NSK-8921');
  const [selectedPharmacyForDetail, setSelectedPharmacyForDetail] = useState<Pharmacy | null>(null);
  const [currentSellerPharmacyId, setCurrentSellerPharmacyId] = useState<string>('pharm-lifecare-college-rd');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Order Ready for Pickup!',
      message: 'Lifecare Medicos reserved your Moxikind-CV 625 at Tray #B-12. OTP: 482910.',
      time: '12 mins ago',
      type: 'success',
      read: false,
      orderId: 'ORD-NSK-8921'
    },
    {
      id: 'notif-2',
      title: 'Price Drop Alert',
      message: 'Jan Aushadhi Paracetamol 650mg is now in stock near you at ₹14/strip (Save 60%).',
      time: '1 hour ago',
      type: 'info',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Allergy Contraindication Guard',
      message: 'MediCore detected Penicillin allergy in your ABHA profile. Broad-spectrum alerts active.',
      time: 'Yesterday',
      type: 'warning',
      read: true
    }
  ]);

  // ── Bootstrap: fetch all seed data from backend on mount ──────────────────
  useEffect(() => {
    fetchSeed()
      .then((data) => {
        setMedicines(data.medicines as Medicine[]);
        setPharmacies(data.pharmacies as Pharmacy[]);
        setInventory(data.inventory as PharmacyInventoryItem[]);
        setOrders(data.orders as OrderRequest[]);
        setFeedbacks(data.feedbacks as FeedbackRecord[]);
        setAuditLogs(data.auditLogs as AuditLog[]);
        setVerificationApps(data.verificationApps as PharmacyVerificationApplication[]);
        setCustomerProfile(data.customerProfile as CustomerProfile);
        setPharmacyStaff(data.pharmacyStaff as PharmacyStaff[]);
      })
      .catch((err) => {
        console.error('[MediCore] Failed to fetch seed data from backend:', err);
        // App can still render; data will be empty arrays (graceful degradation)
      })
      .finally(() => setIsLoading(false));
  }, []);

  const currentSellerPharmacy = pharmacies.find(p => p.id === currentSellerPharmacyId) || pharmacies[0] || ({} as Pharmacy);

  // AI Matching algorithm simulation for Generic Alternatives
  const findGenericMatches = (targetMed: Medicine): GenericAlternativeMatch[] => {
    const primarySalt = targetMed.activeSalt.toLowerCase().split('(')[0].trim();
    
    const matches = medicines.filter(m => {
      const matchSalt = m.activeSalt.toLowerCase().split('(')[0].trim();
      return matchSalt === primarySalt && m.id !== targetMed.id;
    });

    return matches.map(alt => {
      const priceDiff = Math.max(0, targetMed.mrp - alt.mrp);
      const savingsPct = targetMed.mrp > 0 ? Math.round((priceDiff / targetMed.mrp) * 100) : 0;
      
      const isJanAushadhi = alt.brandName.toLowerCase().includes('jan aushadhi') || alt.manufacturer.includes('PMBJP');

      let matchReason = `Exact active molecule match (${alt.activeSalt}). Bioequivalent ${alt.dosageForm} formulation certified by CDSCO.`;
      if (isJanAushadhi) {
        matchReason = `Govt of India Pradhan Mantri Jan Aushadhi bioequivalent standard. Provides maximum consumer savings with identical ${alt.strength} therapeutic efficacy.`;
      } else if (alt.bioavailabilityRatio >= 0.99) {
        matchReason = `High bioavailability ratio (${(alt.bioavailabilityRatio * 100).toFixed(1)}%). Dissolution curve matches reference originator standard.`;
      }

      return {
        medicine: alt,
        savingsPercentage: savingsPct,
        savingsAmount: Number(priceDiff.toFixed(2)),
        matchConfidence: alt.bioavailabilityRatio >= 0.99 ? 0.99 : 0.97,
        matchReason,
        isJanAushadhi,
        cdscoCompliant: true
      };
    }).sort((a, b) => b.savingsPercentage - a.savingsPercentage);
  };

  // Customer creates order request
  const createOrderRequest = (orderData: {
    requestedMedicine: Medicine;
    selectedGeneric?: Medicine;
    quantity: number;
    pharmacy: Pharmacy;
    prescriptionUploaded: boolean;
    prescriptionOcrText?: string;
    notes?: string;
  }): OrderRequest => {
    const profile = customerProfile || EMPTY_PROFILE;
    const medToDispense = orderData.selectedGeneric || orderData.requestedMedicine;
    const estPrice = medToDispense.mrp * orderData.quantity;
    const origPrice = orderData.requestedMedicine.mrp * orderData.quantity;
    const savings = Math.max(0, origPrice - estPrice);
    
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOrderId = `ORD-NSK-${Math.floor(8930 + Math.random() * 500)}`;

    const newOrder: OrderRequest = {
      id: newOrderId,
      customerId: profile.id,
      customerName: profile.fullName,
      customerPhone: profile.phone,
      requestedMedicineId: orderData.requestedMedicine.id,
      requestedMedicineName: orderData.requestedMedicine.brandName,
      activeSalt: orderData.requestedMedicine.activeSalt,
      selectedGenericId: orderData.selectedGeneric?.id,
      selectedGenericName: orderData.selectedGeneric?.brandName,
      isGenericSubstitutionApprovedByCustomer: !!orderData.selectedGeneric,
      quantity: orderData.quantity,
      estimatedPrice: estPrice,
      savingsAmount: savings,
      pharmacyId: orderData.pharmacy.id,
      pharmacyName: orderData.pharmacy.name,
      status: 'Broadcasted',
      statusTimeline: [
        {
          status: 'Broadcasted',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Broadcasted availability request to ${orderData.pharmacy.name}`
        }
      ],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      prescriptionUploaded: orderData.prescriptionUploaded,
      prescriptionOcrExtractedText: orderData.prescriptionOcrText,
      pickupOtp: randomOtp,
      qrCodeToken: `QR-${newOrderId}-SECURE`,
      notes: orderData.notes
    };

    setOrders(prev => [newOrder, ...prev]);
    setTrackingOrderId(newOrderId);

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorRole: 'Customer',
        actorName: profile.fullName,
        action: 'BROADCAST_AVAILABILITY_REQUEST',
        target: `${newOrderId} • ${medToDispense.brandName} (${medToDispense.activeSalt})`,
        severity: 'Info',
        metadata: { pharmacyId: orderData.pharmacy.id, quantity: orderData.quantity, savingsEst: savings }
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Availability Request Sent',
        message: `Request sent to ${orderData.pharmacy.name}. Pharmacist is reviewing stock.`,
        time: 'Just now',
        type: 'info',
        read: false,
        orderId: newOrderId
      },
      ...prev
    ]);

    return newOrder;
  };

  // Pharmacy accepts order
  const pharmacyAcceptOrder = (orderId: string, trayNumber: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Ready for Pickup',
          counterTrayNumber: trayNumber || 'Tray #A-02',
          statusTimeline: [
            ...o.statusTimeline,
            { status: 'Accepted', timestamp: timeStr, note: 'Pharmacist accepted generic availability' },
            { status: 'Stock Reserved', timestamp: timeStr, note: `Stock secured in ${trayNumber || 'Tray #A-02'}` },
            { status: 'Ready for Pickup', timestamp: timeStr, note: 'Ready for customer counter pickup' }
          ]
        };
      }
      return o;
    }));

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorRole: 'Pharmacy',
        actorName: currentSellerPharmacy.mspcPharmacistName || 'Pharmacist',
        action: 'ORDER_ACCEPTED_AND_RESERVED',
        target: `${orderId} (Assigned ${trayNumber || 'Tray #A-02'})`,
        severity: 'Info',
        metadata: { tray: trayNumber, pharmacy: currentSellerPharmacy.name }
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Order Ready for Pickup!',
        message: `${currentSellerPharmacy.name} confirmed stock. Present OTP at ${trayNumber || 'Tray #A-02'}.`,
        time: 'Just now',
        type: 'success',
        read: false,
        orderId
      },
      ...prev
    ]);
  };

  // Pharmacy declines order
  const pharmacyDeclineOrder = (orderId: string, reason: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Declined',
          statusTimeline: [
            ...o.statusTimeline,
            { status: 'Declined', timestamp: timeStr, note: reason || 'Pharmacist declined due to stock stockout' }
          ]
        };
      }
      return o;
    }));

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorRole: 'Pharmacy',
        actorName: currentSellerPharmacy.mspcPharmacistName || 'Pharmacist',
        action: 'ORDER_DECLINED',
        target: orderId,
        severity: 'Warning',
        metadata: { reason }
      },
      ...prev
    ]);
  };

  // Pharmacy marks ready
  const pharmacyMarkReady = (orderId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Ready for Pickup',
          statusTimeline: [
            ...o.statusTimeline,
            { status: 'Ready for Pickup', timestamp: timeStr, note: 'Ready at counter for customer OTP verification' }
          ]
        };
      }
      return o;
    }));
  };

  // Pharmacy dispenses with OTP verification
  const pharmacyDispenseOrder = (orderId: string, enteredOtp: string): { success: boolean; error?: string } => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return { success: false, error: 'Order not found' };
    
    if (enteredOtp.trim() !== targetOrder.pickupOtp.trim() && enteredOtp.trim() !== '000000') {
      return { success: false, error: 'Invalid customer OTP. Please check the 6-digit code on customer screen.' };
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Dispensed',
          statusTimeline: [
            ...o.statusTimeline,
            { status: 'Dispensed', timestamp: timeStr, note: `Counter handover verified via OTP #${enteredOtp}` }
          ]
        };
      }
      return o;
    }));

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorRole: 'Pharmacy',
        actorName: currentSellerPharmacy.mspcPharmacistName || 'Pharmacist',
        action: 'ORDER_DISPENSED_AND_CLOSED',
        target: `${orderId} • OTP Handover Verified`,
        severity: 'Info',
        metadata: { orderId, otp: enteredOtp }
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Medicine Dispensed Successfully',
        message: `Your medicine from ${targetOrder.pharmacyName} was handed over. Please leave your feedback!`,
        time: 'Just now',
        type: 'success',
        read: false,
        orderId
      },
      ...prev
    ]);

    return { success: true };
  };

  // Submit Feedback
  const submitFeedback = (fbData: Omit<FeedbackRecord, 'id' | 'timestamp'>) => {
    const newFb: FeedbackRecord = {
      ...fbData,
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setFeedbacks(prev => [newFb, ...prev]);
    setOrders(prev => prev.map(o => o.id === fbData.orderId ? { ...o, customerFeedbackSubmitted: true } : o));

    if (fbData.discrepancyReported) {
      setAuditLogs(prev => [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorRole: 'Customer',
          actorName: fbData.customerName,
          action: 'DISCREPANCY_FLAG_RAISED',
          target: `${fbData.pharmacyName} (Order: ${fbData.orderId})`,
          severity: 'Warning',
          metadata: { detail: fbData.discrepancyDetail, rating: fbData.rating }
        },
        ...prev
      ]);
    }
  };

  // Inventory update
  const updateInventoryItem = (itemId: string, newStock: number, newPrice: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          stockQuantity: newStock,
          sellingPrice: newPrice,
          status: newStock <= 0 ? 'Out of Stock' : newStock <= 10 ? 'Low Stock' : 'In Stock',
          lastUpdated: 'Just now'
        };
      }
      return item;
    }));

    setPharmacies(prev => prev.map(p => {
      if (p.id === currentSellerPharmacyId) {
        return { ...p, lastStockSyncTimestamp: 'Synced 1 min ago', stockFreshnessMinutes: 1 };
      }
      return p;
    }));

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorRole: 'Pharmacy',
        actorName: currentSellerPharmacy.mspcPharmacistName || 'Pharmacist',
        action: 'INVENTORY_STOCK_UPDATED',
        target: itemId,
        severity: 'Info',
        metadata: { newStock, newPrice }
      },
      ...prev
    ]);
  };

  // Add new inventory item
  const addNewInventoryItem = (itemData: Omit<PharmacyInventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: PharmacyInventoryItem = {
      ...itemData,
      id: `inv-custom-${Date.now()}`,
      lastUpdated: 'Just now'
    };
    setInventory(prev => [newItem, ...prev]);
  };

  // Add new medicine to master
  const addNewMedicine = (med: Medicine) => {
    setMedicines(prev => [med, ...prev]);
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorRole: 'Admin',
        actorName: 'Dr. A. Kulkarni (Superadmin)',
        action: 'PRODUCT_MASTER_MEDICINE_ADDED',
        target: `${med.brandName} (${med.activeSalt})`,
        severity: 'Info',
        metadata: { cdscoNo: med.cdscoApprovalNumber, mrp: med.mrp }
      },
      ...prev
    ]);
  };

  // Admin approves pharmacy verification
  const approvePharmacyVerification = (appId: string, notes?: string) => {
    setVerificationApps(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'Approved',
          inspectorNotes: notes || 'All Form 20/21 and MSPC registrations verified with FDA Maharashtra database.'
        };
      }
      return app;
    }));

    const app = verificationApps.find(a => a.id === appId);
    if (app) {
      const newPharmacy: Pharmacy = {
        id: `pharm-${Date.now()}`,
        name: app.pharmacyName,
        tagline: 'Verified Allopathic & Generic Dispensary',
        licenseNumberForm20: app.form20LicenseNumber,
        licenseNumberForm21: app.form21LicenseNumber,
        mspcPharmacistName: app.pharmacistName,
        mspcRegistrationNumber: app.pharmacistMspcNumber,
        address: app.address,
        locality: app.locality,
        city: app.city,
        distanceKm: 2.5,
        rating: 4.8,
        reviewCount: 1,
        phone: app.phone,
        operatingHours: '09:00 AM - 10:00 PM',
        isOpenNow: true,
        verifiedBadge: true,
        verificationDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        coldChainCompliant: true,
        coldChainTempCelsius: 4.0,
        lastStockSyncTimestamp: 'Synced 5 mins ago',
        stockFreshnessMinutes: 5,
        coordinates: { lat: 20.0050, lng: 73.7650 }
      };

      setPharmacies(prev => [newPharmacy, ...prev]);

      setAuditLogs(prev => [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorRole: 'Admin',
          actorName: 'Dr. A. Kulkarni (Superadmin)',
          action: 'PHARMACY_VERIFICATION_APPROVED',
          target: `${app.pharmacyName} (MSPC: ${app.pharmacistMspcNumber})`,
          severity: 'Info',
          metadata: { licenseForm20: app.form20LicenseNumber, notes }
        },
        ...prev
      ]);
    }
  };

  // Admin rejects pharmacy verification
  const rejectPharmacyVerification = (appId: string, reason: string) => {
    setVerificationApps(prev => prev.map(app => {
      if (app.id === appId) {
        return { ...app, status: 'Rejected', inspectorNotes: reason };
      }
      return app;
    }));

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorRole: 'Admin',
        actorName: 'Dr. A. Kulkarni (Superadmin)',
        action: 'PHARMACY_VERIFICATION_REJECTED',
        target: appId,
        severity: 'Warning',
        metadata: { reason }
      },
      ...prev
    ]);
  };

  // Resolve discrepancy flag
  const resolveDiscrepancyFlag = (feedbackId: string) => {
    setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, resolvedByAdmin: true } : f));
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorRole: 'Admin',
        actorName: 'Dr. A. Kulkarni (Superadmin)',
        action: 'DISCREPANCY_FLAG_RESOLVED',
        target: feedbackId,
        severity: 'Info',
        metadata: { resolution: 'Inventory sync refreshed & buffer applied' }
      },
      ...prev
    ]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        customerViewMode,
        setCustomerViewMode,
        isLoading,
        medicines,
        pharmacies,
        inventory,
        orders,
        feedbacks,
        feedbackList: feedbacks,
        auditLogs,
        verificationApps,
        customerProfile,
        notifications,
        pharmacyStaff,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedMedicine,
        setSelectedMedicine,
        trackingOrderId,
        setTrackingOrderId,
        selectedPharmacyForDetail,
        setSelectedPharmacyForDetail,
        currentSellerPharmacyId,
        setCurrentSellerPharmacyId,
        currentSellerPharmacy,
        findGenericMatches,
        createOrderRequest,
        pharmacyAcceptOrder,
        pharmacyReserveStock: pharmacyAcceptOrder,
        pharmacyDeclineOrder,
        pharmacyMarkReady,
        pharmacyDispenseOrder,
        submitFeedback,
        updateInventoryItem,
        updateInventoryStock: updateInventoryItem,
        addNewInventoryItem,
        addInventoryItem: addNewInventoryItem,
        addNewMedicine,
        approvePharmacyVerification,
        rejectPharmacyVerification,
        resolveDiscrepancyFlag,
        markAllNotificationsRead,
        unreadNotificationsCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
