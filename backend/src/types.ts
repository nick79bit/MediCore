// Comprehensive TypeScript types for MediCore / GenericMed platform

export type UserRole = 'customer' | 'pharmacy' | 'admin';

export type ScheduleCategory = 'Schedule H' | 'Schedule H1' | 'Schedule X' | 'OTC' | 'General';

export type DosageForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Suspension' | 'Ointment' | 'Inhaler';

export interface ActiveSaltComponent {
  molecule: string; // e.g. "Paracetamol", "Amoxicillin", "Clavulanic Acid"
  strength: string; // e.g. "650 mg", "500 mg", "125 mg"
  therapeuticClass: string; // e.g. "Analgesic & Antipyretic", "Beta-lactam Antibiotic"
}

export interface Medicine {
  id: string;
  brandName: string;
  isGeneric: boolean;
  activeSalt: string; // Composite salt description e.g. "Paracetamol (650mg)"
  activeSaltComponents: ActiveSaltComponent[];
  dosageForm: DosageForm;
  strength: string;
  manufacturer: string;
  scheduleCategory: ScheduleCategory;
  mrp: number; // Maximum Retail Price in INR (e.g. ₹120.00)
  dpcoCeilingPrice?: number; // Drug Price Control Order ceiling price
  packaging: string; // e.g. "Strip of 15 tablets"
  unitPrice: number; // calculated or strip price
  originatorBrand?: string; // Reference brand if this is a generic
  cdscoApprovalNumber: string; // Central Drugs Standard Control Organisation approval
  bioequivalenceStatus: 'CDSCO Approved Bioequivalent' | 'Jan Aushadhi Standard' | 'WHO-GMP Certified' | 'Reference Standard (Originator)';
  bioavailabilityRatio: number; // e.g. 0.99 (99% relative bioavailability)
  dissolutionRate: string; // e.g. "98.4% at 30 mins (USP standard)"
  inactiveExcipients: string[]; // e.g. ["Microcrystalline cellulose", "Magnesium stearate", "Povidone"]
  commonUses: string[];
  contraindications: string[];
  requiresPrescription: boolean;
  image?: string;
  rating: number;
}

export interface GenericAlternativeMatch {
  medicine: Medicine;
  savingsPercentage: number;
  savingsAmount: number;
  matchConfidence: number; // e.g. 0.98
  matchReason: string; // Explainable AI reasoning
  isJanAushadhi: boolean;
  cdscoCompliant: boolean;
}

export interface Pharmacy {
  id: string;
  name: string;
  tagline: string;
  licenseNumberForm20: string; // Form 20 (Allopathic Retail)
  licenseNumberForm21: string; // Form 21 (Schedule C/C1)
  mspcPharmacistName: string; // Registered Pharmacist (MSPC)
  mspcRegistrationNumber: string;
  address: string;
  locality: string; // e.g., "College Road, Nashik"
  city: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  phone: string;
  operatingHours: string;
  isOpenNow: boolean;
  verifiedBadge: boolean;
  verificationDate: string;
  coldChainCompliant: boolean;
  coldChainTempCelsius: number; // e.g. 4.2°C
  lastStockSyncTimestamp: string; // ISO or relative, e.g. "5 mins ago"
  stockFreshnessMinutes: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface PharmacyInventoryItem {
  id: string;
  pharmacyId: string;
  medicineId: string;
  medicine: Medicine;
  stockQuantity: number; // number of packs/strips
  batchNumber: string;
  expiryDate: string; // YYYY-MM
  sellingPrice: number; // in INR
  discountPercent: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
  isGenericRecommended: boolean;
}

export type OrderStatus = 
  | 'Broadcasted' 
  | 'Accepted' 
  | 'Stock Reserved' 
  | 'Ready for Pickup' 
  | 'Dispensed' 
  | 'Declined' 
  | 'Cancelled';

export interface OrderRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  requestedMedicineId: string;
  requestedMedicineName: string;
  activeSalt: string;
  selectedGenericId?: string;
  selectedGenericName?: string;
  isGenericSubstitutionApprovedByCustomer: boolean;
  quantity: number;
  estimatedPrice: number;
  savingsAmount: number;
  pharmacyId: string;
  pharmacyName: string;
  status: OrderStatus;
  statusTimeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  expiresAt: string; // SLA holding duration (e.g. 45 mins)
  prescriptionUrl?: string;
  prescriptionUploaded: boolean;
  prescriptionOcrExtractedText?: string;
  counterTrayNumber?: string; // e.g. "Tray #B-12"
  pickupOtp: string; // e.g. "482910"
  qrCodeToken: string;
  notes?: string;
  customerFeedbackSubmitted?: boolean;
}

export interface FeedbackRecord {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  pharmacyId: string;
  pharmacyName: string;
  rating: number; // 1-5
  priceAccuracyRating: number; // 1-5
  stockAvailabilityRating: number; // 1-5
  pharmacistGuidanceRating: number; // 1-5
  tags: string[]; // e.g. ["Exact generic provided", "Price matched app", "Fast handover"]
  comment: string;
  discrepancyReported: boolean;
  discrepancyDetail?: string;
  timestamp: string;
  resolvedByAdmin?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorRole: 'Customer' | 'Pharmacy' | 'Admin' | 'AI System';
  actorName: string;
  action: string;
  target: string;
  severity: 'Info' | 'Warning' | 'Critical';
  metadata: Record<string, any>;
}

export interface PharmacyVerificationApplication {
  id: string;
  pharmacyName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  locality: string;
  city: string;
  form20LicenseNumber: string;
  form21LicenseNumber: string;
  licenseValidityDate: string;
  pharmacistName: string;
  pharmacistMspcNumber: string;
  submittedAt: string;
  status: 'Pending Review' | 'Approved' | 'Requires Clarification' | 'Rejected';
  documents: {
    name: string;
    type: string;
    verified: boolean;
  }[];
  inspectorNotes?: string;
}

export interface PharmacyStaff {
  id: string;
  pharmacyId: string;
  fullName: string;
  role: string;
  qualification: string;
  mspcNumber: string;
  phone: string;
  shiftTiming: string;
  isActiveOnShift: boolean;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  abhaId: string; // Ayushman Bharat Health Account ID (e.g. 91-8921-3819-1029)
  address: string;
  city: string;
  knownAllergies: string[]; // e.g. ["Penicillin", "Sulfa drugs"]
  chronicConditions: string[]; // e.g. ["Type 2 Diabetes", "Hypertension"]
  savedPharmaciesIds: string[];
  preferredRadiusKm: number;
}

export type InventoryItem = PharmacyInventoryItem;
export type VerificationApplication = PharmacyVerificationApplication;
