import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Order } from '../../../types';
import { getTranslation } from '../../../locales/translations';
import { 
  Check, 
  X, 
  Star, 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Loader2,
  TrendingUp
} from 'lucide-react';

interface LiveBidsListProps {
  order: Order;
}

export const LiveBidsList: React.FC<LiveBidsListProps> = ({ order }) => {
  const { acceptOffer, rejectOffer, language } = useApp();
  const [counterInputOfferId, setCounterInputOfferId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(order.offeredPricePKR);

  if (!order || order.offers.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-cyan-950 text-cyan-400 mx-auto flex items-center justify-center animate-bounce">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h4 className="font-bold text-slate-100 text-sm">
          {getTranslation(language, 'waitingForOffers')}
        </h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Nearby water suppliers have received your order ({order.offeredPricePKR} PKR). Bids will appear here in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>
            {getTranslation(language, 'offersCount')} ({order.offers.length})
          </span>
        </h3>
        <span className="text-[11px] text-cyan-400 font-medium">
          {getTranslation(language, 'compareSuppliers')}
        </span>
      </div>

      <div className="space-y-3">
        {order.offers.map((offer) => {
          const isHigherThanCustomer = offer.offerPricePKR > order.offeredPricePKR;

          return (
            <div
              key={offer.id}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 space-y-3 shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                
                {/* Supplier Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-300">
                    <Truck className="w-5 h-5 text-cyan-400" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-sm text-slate-100">
                        {offer.supplierName}
                      </h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                        {offer.supplierRating}
                      </span>
                      <span>•</span>
                      <span>{offer.supplierTotalDeliveries} deliveries</span>
                    </div>
                  </div>
                </div>

                {/* Offer Price Tag */}
                <div className="text-right">
                  <div className="text-lg font-extrabold text-emerald-400">
                    Rs. {offer.offerPricePKR}
                  </div>
                  {isHigherThanCustomer && (
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/80 px-1.5 py-0.5 rounded font-medium">
                      Counter Offer
                    </span>
                  )}
                </div>
              </div>

              {/* Distance, ETA, Vehicle Details */}
              <div className="grid grid-cols-3 gap-2 bg-slate-800/60 p-2.5 rounded-xl text-[11px] text-slate-300 border border-slate-800">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{offer.distanceKm} {getTranslation(language, 'km')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>{offer.etaMinutes} {getTranslation(language, 'mins')}</span>
                </div>
                <div className="truncate text-right text-slate-400">
                  {offer.vehicleType}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => acceptOffer(order.id, offer.id)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1 shadow-md shadow-emerald-950 transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{getTranslation(language, 'acceptOffer')}</span>
                </button>

                <button
                  onClick={() => rejectOffer(order.id, offer.id)}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
