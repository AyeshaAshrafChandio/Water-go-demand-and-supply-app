import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Order, OrderStatus } from '../../../types';
import { getTranslation } from '../../../locales/translations';
import { 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Truck, 
  Star, 
  Clock, 
  Navigation,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import { InteractiveMap } from '../../Map/InteractiveMap';
import confetti from 'canvas-confetti';

interface LiveOrderTrackerProps {
  order: Order;
}

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({ order }) => {
  const { 
    updateOrderStatus, 
    submitRating, 
    submitComplaint,
    language,
    startSimulatedDriverMovement,
    isSimulatingMovement
  } = useApp();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintReason, setComplaintReason] = useState('Delayed water delivery');

  const steps: { key: OrderStatus; labelEn: string; labelUr: string }[] = [
    { key: 'requested', labelEn: 'Request Sent', labelUr: 'درخواست بھیج دی' },
    { key: 'has_offers', labelEn: 'Bids Received', labelUr: 'آفرز مل گئیں' },
    { key: 'accepted', labelEn: 'Supplier Chosen', labelUr: 'سپلائر چن لیا' },
    { key: 'on_way', labelEn: 'On the Way', labelUr: 'راستے میں ہے' },
    { key: 'arrived', labelEn: 'Arrived', labelUr: 'پہنچ گیا' },
    { key: 'delivered', labelEn: 'Delivered', labelUr: 'پانی پہنچ گیا' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'requested': return 0;
      case 'has_offers': return 1;
      case 'accepted': return 2;
      case 'on_way': return 3;
      case 'arrived': return 4;
      case 'delivered':
      case 'completed': return 5;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(order.status);

  const handleConfirmReceipt = () => {
    updateOrderStatus(order.id, 'completed');
    setShowRatingModal(true);
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      // safe fallback
    }
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRating(order.id, selectedStars, reviewText);
    setShowRatingModal(false);
  };

  const handleCall = () => {
    window.location.href = `tel:${order.supplierPhone || '+923001234567'}`;
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi ${order.supplierName}, checking status of WaterGo Order #${order.id}`);
    window.open(`https://wa.me/${(order.supplierPhone || '').replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      
      {/* Live Map Tracking View */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <h3 className="font-bold text-sm text-slate-100">
              {getTranslation(language, 'liveTracking')}
            </h3>
          </div>

          <div className="text-xs text-cyan-300 font-medium bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            Order #{order.id}
          </div>
        </div>

        <InteractiveMap
          customerLocation={{
            lat: order.customerLocation.lat,
            lng: order.customerLocation.lng,
            address: order.deliveryAddress
          }}
          supplierLocation={
            order.supplierLocation
              ? {
                  lat: order.supplierLocation.lat,
                  lng: order.supplierLocation.lng,
                  name: order.supplierName
                }
              : undefined
          }
          showRoutePolyline={true}
          height="280px"
        />
      </div>

      {/* Step Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <span>Delivery Progress</span>
          <span className="text-cyan-400 uppercase tracking-wider text-[11px]">
            {order.status.replace('_', ' ')}
          </span>
        </div>

        <div className="relative flex items-center justify-between pt-2">
          {/* Timeline background bar */}
          <div className="absolute left-0 right-0 top-5 h-1 bg-slate-800 z-0"></div>
          <div
            className="absolute left-0 top-5 h-1 bg-cyan-500 z-0 transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCompleted
                      ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-950'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 font-medium text-center hidden sm:block max-w-12 truncate">
                  {language === 'ur' ? step.labelUr : step.labelEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assigned Supplier Card */}
      {order.supplierName && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center font-extrabold text-cyan-300">
                <Truck className="w-6 h-6 text-cyan-400" />
              </div>

              <div>
                <div className="flex items-center space-x-1">
                  <h4 className="font-extrabold text-slate-100 text-sm">
                    {order.supplierName}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">
                  {order.supplierVehicle} ({order.supplierVehicleNumber || 'KHI-8821'})
                </p>
                <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-bold mt-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{order.supplierRating || 4.9} rating</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Agreed Price</span>
              <span className="text-lg font-extrabold text-emerald-400">
                Rs. {order.finalPricePKR || order.offeredPricePKR}
              </span>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCall}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 border border-slate-700 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>{getTranslation(language, 'callSupplier')}</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 border border-emerald-800/80 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>{getTranslation(language, 'whatsappSupplier')}</span>
            </button>
          </div>

          {/* Simulator drive button for interactive testing */}
          {!isSimulatingMovement && order.status !== 'completed' && order.status !== 'delivered' && (
            <button
              onClick={() => startSimulatedDriverMovement(order.id)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl border border-dashed border-cyan-800/80 flex items-center justify-center space-x-1.5"
            >
              <Navigation className="w-3 h-3 animate-spin" />
              <span>Simulate Supplier Movement to Location</span>
            </button>
          )}

          {/* Confirm Delivery Button */}
          {(order.status === 'arrived' || order.status === 'delivered') && (
            <button
              onClick={handleConfirmReceipt}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-950 flex items-center justify-center space-x-2 transition-all animate-bounce"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>{getTranslation(language, 'confirmReceipt')}</span>
            </button>
          )}
        </div>
      )}

      {/* Complaint Link */}
      <div className="text-center pt-1">
        <button
          onClick={() => setShowComplaintForm(!showComplaintForm)}
          className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center justify-center space-x-1 mx-auto"
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Report Issue with this order</span>
        </button>
      </div>

      {/* Complaint Modal */}
      {showComplaintForm && (
        <div className="bg-slate-900 border border-rose-900/50 p-4 rounded-2xl space-y-3">
          <h4 className="font-bold text-xs text-rose-300">File a Dispute / Report</h4>
          <select
            value={complaintReason}
            onChange={(e) => setComplaintReason(e.target.value)}
            className="w-full bg-slate-800 text-xs text-slate-200 p-2.5 rounded-xl border border-slate-700"
          >
            <option value="Late Delivery">Water Tanker Delayed</option>
            <option value="Quality Issue">Water Quality / Taste Issue</option>
            <option value="Price Dispute">Price Overcharge Dispute</option>
          </select>
          <button
            onClick={() => {
              submitComplaint(order.id, complaintReason, 'Customer reported issue on tracking screen.');
              setShowComplaintForm(false);
              alert('Complaint recorded. Admin team will review within 15 minutes.');
            }}
            className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
          >
            Submit Report
          </button>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-800/80 p-5 rounded-2xl max-w-sm w-full space-y-4 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
              <HeartHandshake className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-100">
                {getTranslation(language, 'rateSupplier')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {getTranslation(language, 'leaveReview')}
              </p>
            </div>

            {/* Star Selector */}
            <div className="flex items-center justify-center space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedStars(star)}
                  className="p-1 transition-all hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= selectedStars
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="e.g. Prompt delivery, polite driver, clean water tanker!"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 h-20"
            />

            <button
              onClick={handleRatingSubmit}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-md"
            >
              {getTranslation(language, 'submitRating')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
