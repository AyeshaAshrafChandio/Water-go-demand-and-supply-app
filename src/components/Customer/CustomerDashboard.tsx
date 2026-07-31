import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WaterType, Order } from '../../types';
import { getTranslation } from '../../locales/translations';
import { WaterSelector } from './OrderFlow/WaterSelector';
import { BiddingForm } from './OrderFlow/BiddingForm';
import { LiveBidsList } from './OrderFlow/LiveBidsList';
import { LiveOrderTracker } from './OrderFlow/LiveOrderTracker';
import { 
  Droplets, 
  MapPin, 
  Clock, 
  Bookmark, 
  Plus, 
  CheckCircle2, 
  Navigation,
  Trash2,
  ListOrdered
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { 
    waterTypes, 
    orders, 
    activeOrder, 
    savedAddresses, 
    addSavedAddress, 
    deleteSavedAddress, 
    language,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'new' | 'live' | 'history' | 'places'>('new');
  const [selectedWaterType, setSelectedWaterType] = useState<WaterType>(waterTypes[0]);

  const completedOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  const [newPlaceLabel, setNewPlaceLabel] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceLabel || !newPlaceAddress) return;
    addSavedAddress({
      labelEn: newPlaceLabel,
      labelUr: newPlaceLabel,
      address: newPlaceAddress,
      lat: 24.8685 + (Math.random() - 0.5) * 0.05,
      lng: 67.0652 + (Math.random() - 0.5) * 0.05
    });
    setNewPlaceLabel('');
    setNewPlaceAddress('');
  };

  return (
    <div className="max-w-md md:max-w-3xl mx-auto pb-24 px-4 pt-4 space-y-4">
      
      {/* Active Delivery Status Header Banner if order exists */}
      {activeOrder && activeTab !== 'live' && (
        <div 
          onClick={() => setActiveTab('live')}
          className="bg-gradient-to-r from-cyan-900 via-sky-900 to-slate-900 border border-cyan-500/60 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer shadow-lg hover:border-cyan-400 transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-extrabold animate-pulse">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <h4 className="font-bold text-xs text-cyan-200">
                  Active Order #{activeOrder.id}
                </h4>
              </div>
              <p className="text-xs text-slate-200 font-medium mt-0.5">
                {activeOrder.waterTypeNameEn} ({activeOrder.quantity}x)
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-extrabold text-emerald-400 block">
              Rs. {activeOrder.finalPricePKR || activeOrder.offeredPricePKR}
            </span>
            <span className="text-[10px] text-cyan-400 hover:underline">
              View Live Tracker →
            </span>
          </div>
        </div>
      )}

      {/* Main Tab Content Views */}
      {activeTab === 'new' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <WaterSelector
            selectedTypeId={selectedWaterType.id}
            onSelect={(wt) => setSelectedWaterType(wt)}
          />

          <BiddingForm
            selectedWaterType={selectedWaterType}
            onRequestCreated={() => setActiveTab('live')}
          />
        </div>
      )}

      {activeTab === 'live' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {!activeOrder ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                <Navigation className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-200 text-sm">No Active Delivery</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Select water type and place a request to start live GPS tracking.
              </p>
              <button
                onClick={() => setActiveTab('new')}
                className="py-2.5 px-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl"
              >
                Order Water Now
              </button>
            </div>
          ) : activeOrder.status === 'requested' || activeOrder.status === 'has_offers' ? (
            <div className="space-y-4">
              <div className="bg-cyan-950/60 border border-cyan-800/80 p-3.5 rounded-2xl text-xs text-cyan-200 flex items-center justify-between">
                <div>
                  <span className="font-bold block">Current Request: #{activeOrder.id}</span>
                  <span className="text-slate-300">
                    {activeOrder.quantity}x {activeOrder.waterTypeNameEn} • Offered: Rs. {activeOrder.offeredPricePKR}
                  </span>
                </div>
              </div>
              <LiveBidsList order={activeOrder} />
            </div>
          ) : (
            <LiveOrderTracker order={activeOrder} />
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{getTranslation(language, 'orderHistory')}</span>
          </h3>

          {completedOrders.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-xs text-slate-400">
              No previous orders found.
            </div>
          ) : (
            completedOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm">
                    {ord.waterTypeNameEn} ({ord.quantity}x)
                  </span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    Rs. {ord.finalPricePKR || ord.offeredPricePKR}
                  </span>
                </div>

                <div className="text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{ord.deliveryAddress}</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Supplier: {ord.supplierName || 'Tariq Water'}</span>
                  <span className="text-slate-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'places' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-1.5">
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <span>{getTranslation(language, 'savedAddresses')}</span>
          </h3>

          <div className="space-y-2">
            {savedAddresses.map((place) => (
              <div
                key={place.id}
                className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-100">
                    {language === 'ur' ? place.labelUr : place.labelEn}
                  </h4>
                  <p className="text-slate-400">{place.address}</p>
                </div>

                <button
                  onClick={() => deleteSavedAddress(place.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Saved Address Form */}
          <form onSubmit={handleAddPlace} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
            <h4 className="font-bold text-xs text-cyan-300">Add New Saved Location</h4>
            <input
              type="text"
              value={newPlaceLabel}
              onChange={(e) => setNewPlaceLabel(e.target.value)}
              placeholder="Label (e.g. Grandma's House)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              required
            />
            <input
              type="text"
              value={newPlaceAddress}
              onChange={(e) => setNewPlaceAddress(e.target.value)}
              placeholder="Full Address"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              required
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Save Place</span>
            </button>
          </form>
        </div>
      )}

      {/* Customer Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 py-2 px-4">
        <div className="max-w-md mx-auto flex items-center justify-around">
          
          <button
            onClick={() => setActiveTab('new')}
            className={`flex flex-col items-center space-y-1 text-[11px] font-semibold transition-all ${
              activeTab === 'new' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Droplets className="w-5 h-5" />
            <span>Order</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`relative flex flex-col items-center space-y-1 text-[11px] font-semibold transition-all ${
              activeTab === 'live' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span>Live Map</span>
            {activeOrder && (
              <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center space-y-1 text-[11px] font-semibold transition-all ${
              activeTab === 'history' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <ListOrdered className="w-5 h-5" />
            <span>History</span>
          </button>

          <button
            onClick={() => setActiveTab('places')}
            className={`flex flex-col items-center space-y-1 text-[11px] font-semibold transition-all ${
              activeTab === 'places' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span>Places</span>
          </button>
        </div>
      </div>
    </div>
  );
};
