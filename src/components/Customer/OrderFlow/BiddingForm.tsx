import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { WaterType } from '../../../types';
import { getTranslation } from '../../../locales/translations';
import { 
  Plus, 
  Minus, 
  MapPin, 
  Banknote, 
  Send, 
  Navigation, 
  CreditCard, 
  FileText,
  Bookmark
} from 'lucide-react';
import { InteractiveMap } from '../../Map/InteractiveMap';

interface BiddingFormProps {
  selectedWaterType: WaterType;
  onRequestCreated: () => void;
}

export const BiddingForm: React.FC<BiddingFormProps> = ({ selectedWaterType, onRequestCreated }) => {
  const { 
    currentUser, 
    savedAddresses, 
    createOrderRequest, 
    language,
    suppliers
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [offeredPrice, setOfferedPrice] = useState<number>(
    selectedWaterType.basePricePKR
  );
  
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser.location.address
  );
  const [customerCoords, setCustomerCoords] = useState({
    lat: currentUser.location.lat,
    lng: currentUser.location.lng
  });

  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'easypaisa' | 'jazzcash' | 'card'>('cash');
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update offered price when quantity or water type changes
  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    setOfferedPrice(selectedWaterType.basePricePKR * newQty);
  };

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCustomerCoords({ lat, lng });
          setDeliveryAddress(`GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)}), Karachi`);
        },
        () => {
          alert('GPS permission not available. Defaulting to PECHS Block 6, Karachi.');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offeredPrice < 50) {
      alert('Offer price must be at least 50 PKR.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      createOrderRequest(
        selectedWaterType.id,
        quantity,
        offeredPrice,
        deliveryAddress,
        customerCoords,
        deliveryNotes,
        paymentMethod
      );
      setIsSubmitting(false);
      onRequestCreated();
    }, 600);
  };

  const nearbyOnlineCount = suppliers.filter((s) => s.isOnline).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-slate-100 shadow-xl">
      
      {/* Delivery Address Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>{getTranslation(language, 'selectLocation')}</span>
          </label>

          <button
            type="button"
            onClick={handleDetectGPS}
            className="text-[11px] text-cyan-400 font-semibold hover:underline flex items-center space-x-1"
          >
            <Navigation className="w-3 h-3" />
            <span>{getTranslation(language, 'detectLocation')}</span>
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            placeholder="Enter address..."
          />
          <button
            type="button"
            onClick={() => setShowMapSelector(!showMapSelector)}
            className="absolute right-2 top-2 bg-slate-700 hover:bg-slate-600 text-cyan-300 text-[10px] font-bold px-2.5 py-1 rounded-lg"
          >
            {showMapSelector ? 'Close Map' : 'Pick on Map'}
          </button>
        </div>

        {/* Saved Addresses Quick Selector */}
        {savedAddresses.length > 0 && (
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] text-slate-400 flex items-center shrink-0">
              <Bookmark className="w-3 h-3 mr-1 text-slate-500" />
              Saved:
            </span>
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => {
                  setDeliveryAddress(addr.address);
                  setCustomerCoords({ lat: addr.lat, lng: addr.lng });
                }}
                className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2.5 py-1 rounded-lg border border-slate-700"
              >
                {language === 'ur' ? addr.labelUr : addr.labelEn}
              </button>
            ))}
          </div>
        )}

        {/* Expandable Location Picker Map */}
        {showMapSelector && (
          <div className="mt-2 space-y-1">
            <InteractiveMap
              center={customerCoords}
              customerLocation={{ ...customerCoords, address: deliveryAddress }}
              interactiveSelect={true}
              onLocationSelect={(lat, lng) => {
                setCustomerCoords({ lat, lng });
                setDeliveryAddress(`Pin Location (${lat.toFixed(4)}, ${lng.toFixed(4)}), Karachi`);
              }}
              height="220px"
            />
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700">
        <div>
          <span className="text-xs font-bold text-slate-200 block">
            {getTranslation(language, 'selectQuantity')}
          </span>
          <span className="text-[11px] text-slate-400">
            Unit: {selectedWaterType.unit}
          </span>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center disabled:opacity-40"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-extrabold text-cyan-300 min-w-5 text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bidding Price Offer Input */}
      <div className="space-y-2 bg-slate-800/80 p-3.5 rounded-xl border border-cyan-800/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-cyan-300 flex items-center space-x-1">
            <Banknote className="w-4 h-4 text-emerald-400" />
            <span>{getTranslation(language, 'yourOfferedPrice')}</span>
          </label>
          <span className="text-[10px] text-slate-400">
            {getTranslation(language, 'suggestedPriceRange')}{' '}
            <strong className="text-slate-200">
              Rs. {selectedWaterType.recommendedMinPKR * quantity} - {selectedWaterType.recommendedMaxPKR * quantity}
            </strong>
          </span>
        </div>

        <div className="relative flex items-center">
          <span className="absolute left-3 text-slate-400 text-sm font-bold">
            Rs.
          </span>
          <input
            type="number"
            value={offeredPrice}
            onChange={(e) => setOfferedPrice(Number(e.target.value))}
            step={50}
            min={50}
            required
            className="w-full bg-slate-900 border border-cyan-500/80 rounded-xl pl-10 pr-4 py-2.5 text-lg font-extrabold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Quick Adjustment Bidding Buttons */}
        <div className="flex items-center space-x-2 pt-1">
          <button
            type="button"
            onClick={() => setOfferedPrice(Math.max(50, offeredPrice - 50))}
            className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 text-xs font-semibold"
          >
            - Rs. 50
          </button>
          <button
            type="button"
            onClick={() => setOfferedPrice(selectedWaterType.basePricePKR * quantity)}
            className="flex-1 py-1 bg-cyan-950 text-cyan-300 rounded-lg border border-cyan-700/80 text-xs font-bold"
          >
            Fair Price
          </button>
          <button
            type="button"
            onClick={() => setOfferedPrice(offeredPrice + 50)}
            className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 text-xs font-semibold"
          >
            + Rs. 50
          </button>
        </div>
      </div>

      {/* Special Instructions */}
      <div>
        <label className="text-xs font-bold text-slate-300 flex items-center space-x-1 mb-1">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>{getTranslation(language, 'deliveryNotes')}</span>
        </label>
        <input
          type="text"
          value={deliveryNotes}
          onChange={(e) => setDeliveryNotes(e.target.value)}
          placeholder="e.g. Call before arrival, 2nd floor, underground tank"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Payment Method Option */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-slate-400 flex items-center">
          <CreditCard className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Payment Mode:
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
              paymentMethod === 'cash'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Cash on Delivery
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('easypaisa')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
              paymentMethod === 'easypaisa'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Easypaisa / JazzCash
          </button>
        </div>
      </div>

      {/* Broadcast Request Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-900/40 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>
          {isSubmitting
            ? getTranslation(language, 'requestingWater')
            : `${getTranslation(language, 'broadcastRequest')} (Rs. ${offeredPrice})`}
        </span>
      </button>

      <p className="text-[10px] text-center text-cyan-400 font-medium">
        ⚡ Broadcasting to {nearbyOnlineCount} active suppliers nearby
      </p>
    </form>
  );
};
