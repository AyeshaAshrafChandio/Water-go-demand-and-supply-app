import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { getTranslation } from '../../locales/translations';
import { InteractiveMap } from '../Map/InteractiveMap';
import { 
  Truck, 
  Power, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Navigation, 
  Phone, 
  MessageSquare,
  Send,
  Upload,
  AlertCircle,
  Star,
  Check
} from 'lucide-react';

export const SupplierDashboard: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    suppliers, 
    toggleSupplierOnline, 
    submitSupplierOffer, 
    updateOrderStatus,
    startSimulatedDriverMovement,
    isSimulatingMovement,
    language 
  } = useApp();

  const currentSupplier = suppliers.find((s) => s.id === currentUser.id) || suppliers[0];

  const [counterPriceMap, setCounterPriceMap] = useState<Record<string, number>>({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Incoming nearby pending requests
  const pendingRequests = orders.filter(
    (o) => o.status === 'requested' || o.status === 'has_offers'
  );

  // Active accepted order for this driver
  const activeOrder = orders.find(
    (o) =>
      o.selectedSupplierId === currentSupplier.id &&
      o.status !== 'completed' &&
      o.status !== 'cancelled'
  );

  // Completed orders by driver
  const completedDeliveries = orders.filter(
    (o) => o.selectedSupplierId === currentSupplier.id && o.status === 'completed'
  );

  const totalEarningsPKR = completedDeliveries.reduce(
    (sum, o) => sum + (o.finalPricePKR || o.offeredPricePKR),
    0
  );

  const handleCounterOfferSubmit = (order: Order) => {
    const customPrice = counterPriceMap[order.id] || order.offeredPricePKR;
    submitSupplierOffer(order.id, customPrice, currentSupplier);
    alert(`Offer of Rs. ${customPrice} sent to customer!`);
  };

  return (
    <div className="max-w-md md:max-w-3xl mx-auto pb-20 px-4 pt-4 space-y-4">
      
      {/* Driver Header Card with Online/Offline Switch */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800/80 flex items-center justify-center text-cyan-400 font-extrabold text-xl">
              <Truck className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-extrabold text-slate-100 text-sm">
                  {currentSupplier.name}
                </h3>
                {currentSupplier.verified ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>

              <p className="text-xs text-slate-400 mt-0.5">
                {currentSupplier.vehicleType || '1000L Mini Bowzer'} • {currentSupplier.vehicleNumber}
              </p>
            </div>
          </div>

          {/* Online / Offline Toggle Switch */}
          <button
            onClick={() => toggleSupplierOnline(currentSupplier.id)}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-md ${
              currentSupplier.isOnline
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{currentSupplier.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>

        {/* Verification Status Banner */}
        {!currentSupplier.verified && (
          <div className="bg-amber-950/60 border border-amber-800/80 p-3 rounded-xl flex items-center justify-between text-xs text-amber-200">
            <span>{getTranslation(language, 'unverifiedNotice')}</span>
            <button
              onClick={() => setShowVerificationModal(true)}
              className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg text-[11px] shrink-0 ml-2"
            >
              Upload CNIC
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-center text-xs">
          <div className="bg-slate-800/60 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Today's Earnings</span>
            <span className="font-extrabold text-emerald-400 text-sm">
              Rs. {totalEarningsPKR}
            </span>
          </div>

          <div className="bg-slate-800/60 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Deliveries</span>
            <span className="font-extrabold text-cyan-300 text-sm">
              {completedDeliveries.length + currentSupplier.totalDeliveries}
            </span>
          </div>

          <div className="bg-slate-800/60 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Rating</span>
            <span className="font-extrabold text-amber-400 text-sm flex items-center justify-center">
              ⭐ {currentSupplier.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Active Order Navigation Screen for Driver */}
      {activeOrder && (
        <div className="bg-slate-900 border-2 border-cyan-500 rounded-2xl p-4 space-y-3 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <h3 className="font-extrabold text-slate-100 text-sm">
                Active Delivery in Progress
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
              #{activeOrder.id}
            </span>
          </div>

          {/* Navigation Map */}
          <InteractiveMap
            customerLocation={{
              lat: activeOrder.customerLocation.lat,
              lng: activeOrder.customerLocation.lng,
              address: activeOrder.deliveryAddress
            }}
            supplierLocation={
              activeOrder.supplierLocation || {
                lat: currentSupplier.location.lat,
                lng: currentSupplier.location.lng,
                name: currentSupplier.name
              }
            }
            showRoutePolyline={true}
            height="220px"
          />

          {/* Customer Details */}
          <div className="bg-slate-800/80 p-3 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-100">{activeOrder.customerName}</h4>
                <p className="text-slate-400 text-[11px] flex items-center mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1 shrink-0" />
                  {activeOrder.deliveryAddress}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Agreed Cash</span>
                <span className="text-base font-extrabold text-emerald-400">
                  Rs. {activeOrder.finalPricePKR || activeOrder.offeredPricePKR}
                </span>
              </div>
            </div>

            {activeOrder.deliveryNotes && (
              <p className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/60">
                📝 Note: {activeOrder.deliveryNotes}
              </p>
            )}

            {/* Quick Phone Call & WhatsApp */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${activeOrder.customerPhone}`}
                className="py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg flex items-center justify-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Call Customer</span>
              </a>

              <a
                href={`https://wa.me/${activeOrder.customerPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-bold rounded-lg flex items-center justify-center space-x-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Driver Workflow Step Controls */}
          <div className="space-y-2">
            {activeOrder.status === 'accepted' && (
              <button
                onClick={() => updateOrderStatus(activeOrder.id, 'on_way')}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span>{getTranslation(language, 'markOnWay')}</span>
              </button>
            )}

            {activeOrder.status === 'on_way' && (
              <button
                onClick={() => updateOrderStatus(activeOrder.id, 'arrived')}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>{getTranslation(language, 'markArrived')}</span>
              </button>
            )}

            {(activeOrder.status === 'arrived' || activeOrder.status === 'on_way') && (
              <button
                onClick={() => updateOrderStatus(activeOrder.id, 'completed')}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>{getTranslation(language, 'markDelivered')}</span>
              </button>
            )}

            {!isSimulatingMovement && activeOrder.status !== 'completed' && (
              <button
                onClick={() => startSimulatedDriverMovement(activeOrder.id)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl border border-slate-700"
              >
                ⚡ Auto-Simulate Driving to Customer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Nearby Delivery Requests Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{getTranslation(language, 'nearbyRequests')} ({pendingRequests.length})</span>
          </h3>

          {!currentSupplier.isOnline && (
            <span className="text-[10px] text-rose-400 font-semibold">
              Go Online to respond to bids
            </span>
          )}
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-xs text-slate-400">
            No nearby water requests right now. Stay online to get notified instantly.
          </div>
        ) : (
          pendingRequests.map((req) => (
            <div
              key={req.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                    #{req.id}
                  </span>
                  <h4 className="font-extrabold text-slate-100 text-sm mt-1">
                    {req.waterTypeNameEn} ({req.quantity}x)
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1 shrink-0" />
                    {req.deliveryAddress}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Offered Price</span>
                  <span className="text-lg font-extrabold text-emerald-400">
                    Rs. {req.offeredPricePKR}
                  </span>
                </div>
              </div>

              {/* Bidding Controls */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={counterPriceMap[req.id] || req.offeredPricePKR}
                    onChange={(e) =>
                      setCounterPriceMap({
                        ...counterPriceMap,
                        [req.id]: Number(e.target.value)
                      })
                    }
                    step={50}
                    className="w-28 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 text-center"
                    placeholder="Offer Price"
                  />

                  <button
                    onClick={() => handleCounterOfferSubmit(req)}
                    disabled={!currentSupplier.isOnline}
                    className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1 shadow-md disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Bid Offer</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Driver Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-sm text-slate-100">
              Supplier CNIC & Vehicle Verification
            </h3>
            <p className="text-xs text-slate-400">
              Upload CNIC and Water Tanker registration photos to unlock unlimited orders.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="CNIC Number (e.g. 42201-1234567-1)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-cyan-500">
                <Upload className="w-6 h-6 text-cyan-400 mx-auto" />
                <span className="text-[11px] text-slate-400 block mt-1">
                  Upload Front & Back CNIC
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowVerificationModal(false);
                alert('Verification details submitted! Admin will approve within 1 hour.');
              }}
              className="w-full py-2.5 bg-cyan-600 text-white font-bold text-xs rounded-xl"
            >
              Submit For Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
