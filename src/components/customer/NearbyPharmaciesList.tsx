import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Thermometer, 
  Sparkles, 
  ChevronRight,
  Navigation,
  Star,
  Zap,
  Package,
  CheckCircle2
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
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
              <Store className="w-3.5 h-3.5 text-teal-700" />
            </div>
            <span>Nearby Verified Pharmacies</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 ml-9">
            Stocking <strong className="text-teal-700">{medicine.brandName}</strong> • Live POS inventory
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <label
            className="flex items-center gap-2 cursor-pointer select-none bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-teal-50 hover:border-teal-200 transition-colors"
          >
            <input
              type="checkbox"
              checked={filterInStockOnly}
              onChange={(e) => setFilterInStockOnly(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 accent-teal-600"
            />
            <span className={`font-semibold transition-colors ${filterInStockOnly ? 'text-teal-800' : 'text-slate-700'}`}>In Stock Only</span>
          </label>

          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <Navigation className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Radius:</span>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
            >
              <option value={2}>2 km</option>
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pharmacies List */}
      <div className="space-y-3 stagger">
        {filteredPharmacies.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Store className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-800">No pharmacies within {maxDistance} km</p>
            <p className="text-xs text-slate-400 mt-1">Try expanding radius or removing the stock filter.</p>
            <button
              onClick={() => { setMaxDistance(5); setFilterInStockOnly(false); }}
              className="mt-4 text-xs text-teal-700 font-bold bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl border border-teal-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPharmacies.map((pharmacy, idx) => {
            const stockInfo = getPharmacyStockStatus(pharmacy.id);
            const isNearest = idx === 0;

            return (
              <div
                key={pharmacy.id}
                id={`pharmacy-card-${pharmacy.id}`}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 transition-all duration-300 shadow-sm hover:shadow-card-hover hover:-translate-y-1 overflow-hidden group animate-fade-in"
              >
                {/* Top accent bar for nearest pharmacy */}
                {isNearest && (
                  <div className="px-4 py-1.5 flex items-center gap-2 text-[10px] font-bold border-b border-teal-100"
                    style={{ background: 'linear-gradient(90deg, rgba(13,148,136,0.08), rgba(8,145,178,0.04))' }}>
                    <Zap className="w-3 h-3 text-teal-600" />
                    <span className="text-teal-700">NEAREST — Recommended for fastest pickup</span>
                    <span className="ml-auto text-teal-600 font-mono">{pharmacy.distanceKm} km away</span>
                  </div>
                )}

                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onViewPharmacyDetails(pharmacy)}
                          className="text-base font-bold text-slate-900 hover:text-teal-700 transition-colors text-left"
                        >
                          {pharmacy.name}
                        </button>

                        {pharmacy.verifiedBadge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Form 20/21
                          </span>
                        )}

                        <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          {pharmacy.rating} ({pharmacy.reviewCount})
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                        <span>{pharmacy.address}</span>
                      </p>

                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <Clock className="w-3 h-3 text-teal-500" />
                          {pharmacy.operatingHours}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">
                          Rph: <strong className="text-slate-700">{pharmacy.mspcPharmacistName}</strong>
                        </span>
                      </div>

                      {pharmacy.coldChainCompliant && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                          <Thermometer className="w-3 h-3" />
                          Cold-Chain ({pharmacy.coldChainTempCelsius}°C)
                        </span>
                      )}
                    </div>

                    {/* Stock & Price Tag */}
                    <div className="sm:text-right shrink-0 space-y-1.5">
                      {stockInfo.hasStock ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-right">
                          <div className="flex items-center gap-1.5 justify-end mb-0.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-bold text-emerald-800">In Stock</span>
                          </div>
                          <p className="text-lg font-black text-emerald-800">₹{stockInfo.sellingPrice.toFixed(2)}</p>
                          <p className="text-[10px] text-emerald-600">{stockInfo.stockQty} packs available</p>
                        </div>
                      ) : (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-right">
                          <span className="text-[11px] font-bold text-red-700">Out of Stock</span>
                          <p className="text-[10px] text-red-500 mt-0.5">May take longer</p>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-400 font-mono text-right">
                        Synced {pharmacy.lastStockSyncTimestamp}
                      </p>

                      {!stockInfo.exactMatch && stockInfo.genericName && (
                        <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200 block text-right">
                          <Sparkles className="w-2.5 h-2.5 inline mr-1 text-teal-500" />
                          Generic: {stockInfo.genericName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                      MSPC: {pharmacy.mspcRegistrationNumber}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewPharmacyDetails(pharmacy)}
                        className="text-xs text-slate-600 hover:text-teal-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all"
                      >
                        View Profile
                      </button>

                      <button
                        id={`reserve-stock-btn-${pharmacy.id}`}
                        onClick={() => onSelectPharmacyForOrder(pharmacy)}
                        className="btn btn-primary text-xs py-1.5 px-4"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Reserve</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
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
