import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Thermometer, 
  Sparkles, 
  ChevronRight,
  Filter,
  Navigation
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Medicine, Pharmacy } from '../../types';

interface NearbyPharmaciesListProps {
  medicine: Medicine;
  onSelectPharmacyForOrder: (pharmacy: Pharmacy) => void;
  onViewPharmacyDetails: (pharmacy: Pharmacy) => void;
}

export const NearbyPharmaciesList: React.FC<NearbyPharmaciesListProps> = ({
  medicine,
  onSelectPharmacyForOrder,
  onViewPharmacyDetails
}) => {
  const { pharmacies, inventory } = useApp();
  const [filterInStockOnly, setFilterInStockOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(5);

  // Match inventory items for this medicine or its exact salt
  const getPharmacyStockStatus = (pharmacyId: string) => {
    const directItem = inventory.find(i => i.pharmacyId === pharmacyId && i.medicineId === medicine.id);
    if (directItem) {
      return {
        hasStock: directItem.stockQuantity > 0,
        stockQty: directItem.stockQuantity,
        sellingPrice: directItem.sellingPrice,
        status: directItem.status,
        lastUpdated: directItem.lastUpdated,
        exactMatch: true
      };
    }

    // Check if pharmacy has any generic with the same active salt
    const saltPrefix = medicine.activeSalt.split('(')[0].trim().toLowerCase();
    const genericItem = inventory.find(i => 
      i.pharmacyId === pharmacyId && 
      i.medicine.activeSalt.toLowerCase().includes(saltPrefix) &&
      i.stockQuantity > 0
    );

    if (genericItem) {
      return {
        hasStock: true,
        stockQty: genericItem.stockQuantity,
        sellingPrice: genericItem.sellingPrice,
        status: 'In Stock' as const,
        lastUpdated: genericItem.lastUpdated,
        exactMatch: false,
        genericName: genericItem.medicine.brandName
      };
    }

    return {
      hasStock: false,
      stockQty: 0,
      sellingPrice: medicine.mrp,
      status: 'Out of Stock' as const,
      lastUpdated: '1 hour ago',
      exactMatch: false
    };
  };

  const filteredPharmacies = (pharmacies || []).filter(p => {
    if ((p.distanceKm ?? 999) > maxDistance) return false;
    if (filterInStockOnly) {
      const stock = getPharmacyStockStatus(p.id);
      return stock.hasStock;
    }
    return true;
  }).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-teal-600" />
            <span>Nearby Verified Pharmacies Stocking {medicine.brandName}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time POS inventory freshness • Nashik Pilot Radius
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterInStockOnly}
              onChange={(e) => setFilterInStockOnly(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span className="font-medium text-slate-700">In Stock Only</span>
          </label>

          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span className="text-slate-500">Radius:</span>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-semibold focus:outline-hidden"
            >
              <option value={2}>2 km</option>
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pharmacies List */}
      <div className="space-y-3">
        {filteredPharmacies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <Store className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No pharmacies found within {maxDistance} km</p>
            <p className="text-xs text-slate-500 mt-1">Try expanding your search radius or unchecking In-Stock filter.</p>
            <button
              onClick={() => { setMaxDistance(5); setFilterInStockOnly(false); }}
              className="mt-3 text-xs text-teal-700 font-semibold bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPharmacies.map((pharmacy) => {
            const stockInfo = getPharmacyStockStatus(pharmacy.id);

            return (
              <div
                key={pharmacy.id}
                id={`pharmacy-card-${pharmacy.id}`}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-teal-500 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-slate-900 hover:text-teal-700 cursor-pointer" onClick={() => onViewPharmacyDetails(pharmacy)}>
                        {pharmacy.name}
                      </span>
                      
                      {pharmacy.verifiedBadge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified Form 20/21
                        </span>
                      )}

                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                        ★ {pharmacy.rating} ({pharmacy.reviewCount} reviews)
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{pharmacy.address}</span>
                      <span className="text-slate-400">•</span>
                      <strong className="text-slate-800">{pharmacy.distanceKm} km away</strong>
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 text-teal-800 font-medium">
                        <Clock className="w-3 h-3" />
                        {pharmacy.operatingHours}
                      </span>
                      <span>•</span>
                      <span>Pharmacist: <strong className="text-slate-700">{pharmacy.mspcPharmacistName}</strong></span>
                    </div>
                  </div>

                  {/* Stock & Price Tag */}
                  <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                    <div className="flex sm:flex-col items-center sm:items-end justify-between">
                      <div>
                        {stockInfo.hasStock ? (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                            ● In Stock ({stockInfo.stockQty} packs)
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 inline-block">
                            ✕ Out of Stock
                          </span>
                        )}
                        <p className="text-lg font-bold text-slate-900 mt-1">
                          ₹{stockInfo.sellingPrice.toFixed(2)}
                        </p>
                      </div>

                      {/* Freshness timestamp */}
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Inventory {pharmacy.lastStockSyncTimestamp}
                      </p>
                    </div>

                    {!stockInfo.exactMatch && stockInfo.genericName && (
                      <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 block mt-1">
                        Has Bioequivalent: {stockInfo.genericName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Trust Indicators & Action */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-[11px]">
                    {pharmacy.coldChainCompliant && (
                      <span className="flex items-center gap-1 text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        <Thermometer className="w-3 h-3 text-teal-600" />
                        Cold-Chain IoT Logged ({pharmacy.coldChainTempCelsius}°C)
                      </span>
                    )}
                    <span className="text-slate-500 font-mono text-[10px]">
                      MSPC: {pharmacy.mspcRegistrationNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewPharmacyDetails(pharmacy)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      Store Profile
                    </button>

                    <button
                      id={`reserve-stock-btn-${pharmacy.id}`}
                      onClick={() => onSelectPharmacyForOrder(pharmacy)}
                      className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1"
                    >
                      <span>Reserve Stock</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
