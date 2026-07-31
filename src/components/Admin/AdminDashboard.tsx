import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WaterType, Order } from '../../types';
import { getTranslation } from '../../locales/translations';
import { InteractiveMap } from '../Map/InteractiveMap';
import { 
  ShieldCheck, 
  Users, 
  Truck, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Map, 
  AlertTriangle, 
  Settings, 
  Search,
  Droplet,
  Percent,
  Layers
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    orders, 
    suppliers, 
    waterTypes, 
    platformSettings, 
    setPlatformSettings, 
    approveSupplier, 
    rejectSupplier, 
    addWaterType, 
    deleteWaterType, 
    complaints, 
    resolveComplaint, 
    language 
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'verifications' | 'orders' | 'catalog' | 'settings' | 'complaints'>('overview');

  // Stats calculation
  const totalGrossVolumePKR = orders.reduce(
    (sum, o) => sum + (o.finalPricePKR || o.offeredPricePKR),
    0
  );

  const platformCommissionEarnedPKR = Math.round(
    (totalGrossVolumePKR * platformSettings.commissionPercent) / 100
  );

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length;

  const unverifiedSuppliers = suppliers.filter((s) => !s.verified);

  // New Water Type Modal Form State
  const [showAddWaterModal, setShowAddWaterModal] = useState(false);
  const [newWaterNameEn, setNewWaterNameEn] = useState('');
  const [newWaterNameUr, setNewWaterNameUr] = useState('');
  const [newWaterBasePrice, setNewWaterBasePrice] = useState(500);
  const [newWaterCapacity, setNewWaterCapacity] = useState('1000 Liters');

  const handleCreateWaterType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaterNameEn) return;

    addWaterType({
      nameEn: newWaterNameEn,
      nameUr: newWaterNameUr || newWaterNameEn,
      category: 'tanker',
      capacityTextEn: newWaterCapacity,
      capacityTextUr: newWaterCapacity,
      unit: 'Tankers',
      iconName: 'Truck',
      basePricePKR: newWaterBasePrice,
      recommendedMinPKR: Math.round(newWaterBasePrice * 0.8),
      recommendedMaxPKR: Math.round(newWaterBasePrice * 1.3),
      descriptionEn: 'Custom water delivery option.',
      descriptionUr: 'خصوصی واٹر ترسیل کا اختیار۔'
    });

    setShowAddWaterModal(false);
    setNewWaterNameEn('');
    setNewWaterNameUr('');
  };

  return (
    <div className="max-w-md md:max-w-5xl mx-auto pb-20 px-4 pt-4 space-y-5">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 p-4 rounded-2xl flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">
              {getTranslation(language, 'adminDashboard')}
            </h2>
            <p className="text-xs text-indigo-300">
              Live Monitoring & Management Center
            </p>
          </div>
        </div>

        <span className="text-xs font-mono bg-indigo-950 text-indigo-300 px-3 py-1 rounded-xl border border-indigo-800">
          Admin Portal
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Market Volume</span>
          <span className="text-lg font-extrabold text-emerald-400 block">
            Rs. {totalGrossVolumePKR}
          </span>
          <span className="text-[10px] text-slate-500">Gross Orders Value</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Commission (5%)</span>
          <span className="text-lg font-extrabold text-cyan-300 block">
            Rs. {platformCommissionEarnedPKR}
          </span>
          <span className="text-[10px] text-slate-500">Platform Revenue</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Active Deliveries</span>
          <span className="text-lg font-extrabold text-amber-400 block">
            {activeOrdersCount}
          </span>
          <span className="text-[10px] text-slate-500">In Progress</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Verification Queue</span>
          <span className="text-lg font-extrabold text-rose-400 block">
            {unverifiedSuppliers.length}
          </span>
          <span className="text-[10px] text-slate-500">Suppliers Pending</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-3 py-2 rounded-xl shrink-0 transition-all ${
            adminTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Live City Map
        </button>

        <button
          onClick={() => setAdminTab('verifications')}
          className={`relative px-3 py-2 rounded-xl shrink-0 transition-all ${
            adminTab === 'verifications' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Verifications
          {unverifiedSuppliers.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
              {unverifiedSuppliers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`px-3 py-2 rounded-xl shrink-0 transition-all ${
            adminTab === 'orders' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Orders ({orders.length})
        </button>

        <button
          onClick={() => setAdminTab('catalog')}
          className={`px-3 py-2 rounded-xl shrink-0 transition-all ${
            adminTab === 'catalog' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Water Pricing
        </button>

        <button
          onClick={() => setAdminTab('complaints')}
          className={`px-3 py-2 rounded-xl shrink-0 transition-all ${
            adminTab === 'complaints' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Disputes ({complaints.length})
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`px-3 py-2 rounded-xl shrink-0 transition-all ${
            adminTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab 1: Live City Map Overview */}
      {adminTab === 'overview' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-1.5">
              <Map className="w-4 h-4 text-cyan-400" />
              <span>{getTranslation(language, 'liveMapOverview')}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {suppliers.filter((s) => s.isOnline).length} Active Suppliers Online
            </span>
          </div>

          <InteractiveMap
            allDeliveries={orders.map((o) => ({
              id: o.id,
              customerLocation: o.customerLocation,
              supplierLocation: o.supplierLocation,
              status: o.status
            }))}
            height="340px"
          />
        </div>
      )}

      {/* Tab 2: Verifications Queue */}
      {adminTab === 'verifications' && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-200">
            Pending Supplier Documents ({unverifiedSuppliers.length})
          </h3>

          {unverifiedSuppliers.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-xs text-slate-400">
              All suppliers are fully verified.
            </div>
          ) : (
            unverifiedSuppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-100 text-sm">{sup.name}</h4>
                  <p className="text-slate-400">Phone: {sup.phone}</p>
                  <p className="text-slate-400">
                    Vehicle: {sup.vehicleType} ({sup.vehicleNumber || 'KHI-7720'})
                  </p>
                  <p className="text-cyan-400 font-mono">CNIC: {sup.cnic || '42201-7788990-9'}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => approveSupplier(sup.id)}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => rejectSupplier(sup.id)}
                    className="px-3 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold rounded-xl flex items-center space-x-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Orders List */}
      {adminTab === 'orders' && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-200">All Marketplace Orders</h3>

          <div className="space-y-2">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300">#{ord.id}</span>
                  <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Customer</span>
                    <span className="font-semibold">{ord.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Supplier</span>
                    <span className="font-semibold">{ord.supplierName || 'Awaiting Bid'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-400">
                  <span>
                    {ord.waterTypeNameEn} ({ord.quantity}x)
                  </span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    Rs. {ord.finalPricePKR || ord.offeredPricePKR}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Water Catalog & Pricing Management */}
      {adminTab === 'catalog' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200">
              {getTranslation(language, 'waterCatalog')}
            </h3>
            <button
              onClick={() => setShowAddWaterModal(true)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Water Type</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {waterTypes.map((wt) => (
              <div
                key={wt.id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs relative"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{wt.nameEn}</h4>
                    <p className="text-cyan-400 font-medium">{wt.capacityTextEn}</p>
                  </div>
                  <button
                    onClick={() => deleteWaterType(wt.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Base Price:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    Rs. {wt.basePricePKR}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Disputes & Reports */}
      {adminTab === 'complaints' && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-200">
            Customer & Supplier Reports ({complaints.length})
          </h3>

          {complaints.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-xs text-slate-400">
              No disputes recorded.
            </div>
          ) : (
            complaints.map((cmp) => (
              <div
                key={cmp.id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-rose-400">#{cmp.id} - {cmp.reason}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${cmp.status === 'resolved' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                    {cmp.status}
                  </span>
                </div>

                <p className="text-slate-300">{cmp.details}</p>
                <p className="text-slate-500 text-[10px]">Reported by: {cmp.reporterName} ({cmp.reporterPhone})</p>

                {cmp.status !== 'resolved' && (
                  <button
                    onClick={() => resolveComplaint(cmp.id)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 6: Platform Settings */}
      {adminTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-1.5">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>Platform Financial & Radius Settings</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Platform Commission Fee (%)
              </label>
              <input
                type="number"
                value={platformSettings.commissionPercent}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    commissionPercent: Number(e.target.value)
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Base Delivery Fee (PKR)
              </label>
              <input
                type="number"
                value={platformSettings.baseDeliveryFeePKR}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    baseDeliveryFeePKR: Number(e.target.value)
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Support Helpline Number
              </label>
              <input
                type="text"
                value={platformSettings.supportPhone}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    supportPhone: e.target.value
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Water Type Modal */}
      {showAddWaterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreateWaterType} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl max-w-sm w-full space-y-3 shadow-2xl">
            <h3 className="font-extrabold text-sm text-slate-100">Add New Water Category</h3>
            
            <input
              type="text"
              value={newWaterNameEn}
              onChange={(e) => setNewWaterNameEn(e.target.value)}
              placeholder="Name (English) e.g., 2000L Bowzer"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              required
            />

            <input
              type="text"
              value={newWaterNameUr}
              onChange={(e) => setNewWaterNameUr(e.target.value)}
              placeholder="Name (Urdu) e.g., 2000L واٹر ٹینکر"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />

            <input
              type="number"
              value={newWaterBasePrice}
              onChange={(e) => setNewWaterBasePrice(Number(e.target.value))}
              placeholder="Base Price (PKR)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              required
            />

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddWaterModal(false)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-cyan-600 text-white font-bold text-xs rounded-xl"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
