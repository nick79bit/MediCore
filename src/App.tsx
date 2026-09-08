import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { CustomerHome } from './components/customer/CustomerHome';
import { MedicineSearchResults } from './components/customer/MedicineSearchResults';
import { GenericComparisonModal } from './components/customer/GenericComparisonModal';
import { NearbyPharmaciesList } from './components/customer/NearbyPharmaciesList';
import { AvailabilityRequestModal } from './components/customer/AvailabilityRequestModal';
import { OrderTrackingView } from './components/customer/OrderTrackingView';
import { FeedbackModal } from './components/customer/FeedbackModal';
import { CustomerProfileModal } from './components/customer/CustomerProfileModal';
import { PrescriptionOcrModal } from './components/customer/PrescriptionOcrModal';
import { VoiceSearchModal } from './components/customer/VoiceSearchModal';
import { PharmacyDetailModal } from './components/customer/PharmacyDetailModal';
import { PharmacyDashboard } from './components/pharmacy/PharmacyDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BottomEssentialBar } from './components/common/BottomEssentialBar';
import { Medicine, Pharmacy, OrderRequest } from './types';

const AppContent: React.FC = () => {
  const { 
    role, 
    activeTab, 
    setActiveTab, 
    trackingOrderId, 
    setTrackingOrderId, 
    medicines, 
    setSearchQuery,
    findGenericMatches
  } = useApp();

  // Selected medicine for results view
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Modals state
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);
  const [comparisonAltMed, setComparisonAltMed] = useState<Medicine | undefined>(undefined);

  const [showAvailabilityModal, setShowAvailabilityModal] = useState<boolean>(false);
  const [availabilityGenericMed, setAvailabilityGenericMed] = useState<Medicine | undefined>(undefined);
  const [targetPharmacy, setTargetPharmacy] = useState<Pharmacy | undefined>(undefined);

  const [showPharmacyDetailModal, setShowPharmacyDetailModal] = useState<boolean>(false);
  const [selectedPharmacyForDetail, setSelectedPharmacyForDetail] = useState<Pharmacy | null>(null);

  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showOcrModal, setShowOcrModal] = useState<boolean>(false);
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);

  const [feedbackOrder, setFeedbackOrder] = useState<OrderRequest | null>(null);

  // Handlers for Customer workflow
  const handleSelectMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setActiveTab('search');
  };

  const handleOpenComparison = (altMed?: Medicine) => {
    setComparisonAltMed(altMed);
    setShowComparisonModal(true);
  };

  const handleOpenAvailability = (altMed?: Medicine, pharmacy?: Pharmacy) => {
    setAvailabilityGenericMed(altMed);
    setTargetPharmacy(pharmacy);
    setShowAvailabilityModal(true);
  };

  const handleOrderCreated = (orderId: string) => {
    setShowAvailabilityModal(false);
    setTrackingOrderId(orderId);
    setActiveTab('tracking');
  };

  const handleOcrMatchFound = (medicineId: string) => {
    const med = medicines.find(m => m.id === medicineId);
    if (med) {
      setSelectedMedicine(med);
      setSearchQuery(med.brandName);
      setActiveTab('search');
    }
  };

  const handleVoiceTranscript = (query: string) => {
    setSearchQuery(query);
    const med = medicines.find(m => 
      m.brandName.toLowerCase().includes(query.toLowerCase()) || 
      m.activeSalt.toLowerCase().includes(query.toLowerCase())
    );
    if (med) {
      setSelectedMedicine(med);
    }
    setActiveTab('search');
  };

  const handleViewPharmacyDetail = (pharmacy: Pharmacy) => {
    setSelectedPharmacyForDetail(pharmacy);
    setShowPharmacyDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col antialiased selection:bg-teal-100 selection:text-teal-900">
      
      {/* Universal Header with Role Switcher & Notifications */}
      <Header onOpenProfile={() => setShowProfileModal(true)} />

      {/* Main Content Area with bottom padding for essential bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 sm:pb-28">
        
        {/* ROLE 1: CUSTOMER VIEW */}
        {role === 'customer' && (
          <div>
            {/* If user is viewing active order tracking */}
            {activeTab === 'tracking' && trackingOrderId ? (
              <OrderTrackingView
                orderId={trackingOrderId}
                onBack={() => setActiveTab('home')}
                onOpenFeedback={(order) => setFeedbackOrder(order)}
              />
            ) : selectedMedicine && activeTab === 'search' ? (
              /* Selected Medicine View (AI Clinical Match & Generics) */
              <div className="space-y-6">
                <MedicineSearchResults
                  medicine={selectedMedicine}
                  onBack={() => {
                    setSelectedMedicine(null);
                    setActiveTab('home');
                  }}
                  onOpenComparisonModal={handleOpenComparison}
                  onRequestAvailability={(alt) => handleOpenAvailability(alt)}
                  onViewPharmacies={(med) => {
                    // Scroll down to nearby pharmacies section or switch
                    setSelectedMedicine(med);
                  }}
                />

                {/* Nearby verified pharmacies stocking this medicine */}
                <div className="pt-2">
                  <NearbyPharmaciesList
                    medicine={selectedMedicine}
                    onSelectPharmacyForOrder={(pharmacy) => handleOpenAvailability(selectedMedicine, pharmacy)}
                    onViewPharmacyDetails={handleViewPharmacyDetail}
                  />
                </div>
              </div>
            ) : (
              /* Customer Home / Search View */
              <CustomerHome
                onSelectMedicine={handleSelectMedicine}
                onOpenOcrModal={() => setShowOcrModal(true)}
                onOpenVoiceModal={() => setShowVoiceModal(true)}
              />
            )}
          </div>
        )}

        {/* ROLE 2: PHARMACY / SELLER PORTAL */}
        {role === 'pharmacy' && (
          <PharmacyDashboard />
        )}

        {/* ROLE 3: ADMIN & REGULATORY PLATFORM */}
        {role === 'admin' && (
          <AdminDashboard />
        )}

      </main>

      {/* Global Modals */}

      {/* 1. Side by Side Bioequivalence Matrix Modal */}
      {showComparisonModal && selectedMedicine && (
        <GenericComparisonModal
          referenceMedicine={selectedMedicine}
          comparisonMedicine={comparisonAltMed}
          availableGenerics={findGenericMatches(selectedMedicine).map(m => m.medicine)}
          onClose={() => setShowComparisonModal(false)}
          onSelectForOrder={(med) => handleOpenAvailability(med)}
        />
      )}

      {/* 2. Availability & Stock Reservation Modal */}
      {showAvailabilityModal && selectedMedicine && (
        <AvailabilityRequestModal
          medicine={selectedMedicine}
          selectedGeneric={availabilityGenericMed}
          preselectedPharmacy={targetPharmacy}
          onClose={() => setShowAvailabilityModal(false)}
          onOrderCreated={handleOrderCreated}
        />
      )}

      {/* 3. Pharmacy Details & Licensure Modal */}
      {showPharmacyDetailModal && selectedPharmacyForDetail && (
        <PharmacyDetailModal
          pharmacy={selectedPharmacyForDetail}
          onClose={() => setShowPharmacyDetailModal(false)}
          onSelectMedicineForOrder={(med) => {
            setSelectedMedicine(med);
            handleOpenAvailability(med, selectedPharmacyForDetail);
          }}
        />
      )}

      {/* 4. Customer ABHA Profile Modal */}
      {showProfileModal && (
        <CustomerProfileModal
          onClose={() => setShowProfileModal(false)}
          onSelectOrder={(orderId) => {
            setTrackingOrderId(orderId);
            setActiveTab('tracking');
          }}
        />
      )}

      {/* 5. Prescription OCR Scanner Modal */}
      {showOcrModal && (
        <PrescriptionOcrModal
          onClose={() => setShowOcrModal(false)}
          onMatchFound={handleOcrMatchFound}
        />
      )}

      {/* 6. Voice Search Modal */}
      {showVoiceModal && (
        <VoiceSearchModal
          onClose={() => setShowVoiceModal(false)}
          onTranscript={handleVoiceTranscript}
        />
      )}

      {/* 7. Feedback & Discrepancy Reporting Modal */}
      {feedbackOrder && (
        <FeedbackModal
          order={feedbackOrder}
          onClose={() => setFeedbackOrder(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8 mb-16 sm:mb-14">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            MediCore GenericMed • Nashik Pilot Cluster • CDSCO Bioequivalence & Drug Price Control Order (DPCO) Compliant
          </span>
          <span className="text-[11px] text-slate-400">
            For emergencies, dial 108. Consult a qualified medical practitioner for dosage guidelines.
          </span>
        </div>
      </footer>

      {/* Docked Essential Things Bar at Bottom */}
      <BottomEssentialBar
        onSelectHome={() => {
          setSelectedMedicine(null);
          setActiveTab('home');
        }}
        onOpenOcr={() => setShowOcrModal(true)}
        onOpenVoice={() => setShowVoiceModal(true)}
        onOpenTracking={() => {
          setActiveTab('tracking');
        }}
        onOpenProfile={() => setShowProfileModal(true)}
        onSelectPharmacy={(pharmacy) => handleViewPharmacyDetail(pharmacy)}
        onViewPharmaciesList={() => {
          if (!selectedMedicine && medicines.length > 0) {
            setSelectedMedicine(medicines[0]);
          }
          setActiveTab('search');
        }}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
