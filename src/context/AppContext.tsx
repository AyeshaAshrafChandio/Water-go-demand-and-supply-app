import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { 
  User, 
  WaterType, 
  Order, 
  OrderOffer, 
  OrderStatus, 
  SavedAddress, 
  Complaint, 
  PlatformSettings, 
  Language, 
  UserRole,
  AppNotification
} from '../types';
import { 
  INITIAL_WATER_TYPES, 
  INITIAL_SUPPLIERS, 
  INITIAL_SAVED_ADDRESSES, 
  INITIAL_PLATFORM_SETTINGS, 
  INITIAL_SAMPLE_ORDER 
} from '../data/mockData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  waterTypes: WaterType[];
  setWaterTypes: React.Dispatch<React.SetStateAction<WaterType[]>>;
  orders: Order[];
  suppliers: User[];
  savedAddresses: SavedAddress[];
  platformSettings: PlatformSettings;
  setPlatformSettings: React.Dispatch<React.SetStateAction<PlatformSettings>>;
  complaints: Complaint[];
  notifications: AppNotification[];
  activeOrder: Order | null;
  
  // Actions
  createOrderRequest: (
    waterTypeId: string,
    quantity: number,
    offeredPricePKR: number,
    deliveryAddress: string,
    customerLocation: { lat: number; lng: number },
    deliveryNotes?: string,
    paymentMethod?: 'cash' | 'easypaisa' | 'jazzcash' | 'card'
  ) => Order;
  
  submitSupplierOffer: (
    orderId: string, 
    offerPricePKR: number, 
    supplier: User
  ) => void;
  
  acceptOffer: (orderId: string, offerId: string) => void;
  rejectOffer: (orderId: string, offerId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  
  // Supplier Actions
  toggleSupplierOnline: (supplierId: string) => void;
  updateSupplierLocation: (supplierId: string, lat: number, lng: number) => void;
  
  // Admin Actions
  approveSupplier: (supplierId: string) => void;
  rejectSupplier: (supplierId: string) => void;
  addWaterType: (wt: Omit<WaterType, 'id'>) => void;
  updateWaterType: (wt: WaterType) => void;
  deleteWaterType: (id: string) => void;
  resolveComplaint: (id: string) => void;
  
  // User Actions
  addSavedAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  deleteSavedAddress: (id: string) => void;
  submitRating: (orderId: string, rating: number, review: string) => void;
  submitComplaint: (orderId: string, reason: string, details: string) => void;
  
  // Live Simulation helper
  startSimulatedDriverMovement: (orderId: string) => void;
  stopSimulatedDriverMovement: () => void;
  isSimulatingMovement: boolean;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ORDERS = 'watergo_orders_v1';
const LOCAL_STORAGE_KEY_SUPPLIERS = 'watergo_suppliers_v1';
const BROADCAST_CHANNEL_NAME = 'watergo_sync_channel';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  
  // Default Customer profile
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'cust-demo',
    name: 'Muhammad Hamza',
    phone: '+92 301 5551234',
    email: 'hamza@example.pk',
    role: 'customer',
    verified: true,
    rating: 4.9,
    totalDeliveries: 18,
    location: {
      lat: 24.8685,
      lng: 67.0652,
      address: 'House 42-B, Street 14, PECHS Block 6, Karachi',
      cityName: 'Karachi'
    }
  });

  const [waterTypes, setWaterTypes] = useState<WaterType[]>(INITIAL_WATER_TYPES);
  const [suppliers, setSuppliers] = useState<User[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SUPPLIERS);
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
    return saved ? JSON.parse(saved) : [INITIAL_SAMPLE_ORDER];
  });

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(INITIAL_SAVED_ADDRESSES);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(INITIAL_PLATFORM_SETTINGS);
  
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 'CMP-101',
      orderId: 'ORD-98214',
      reportedBy: 'customer',
      reporterName: 'Muhammad Hamza',
      reporterPhone: '+92 301 5551234',
      againstName: 'Tariq Water Services',
      reason: 'Late Delivery',
      details: 'Driver took 10 extra minutes due to traffic.',
      status: 'open',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      userId: 'cust-demo',
      titleEn: 'Water Request Posted',
      titleUr: 'پانی کی درخواست بھیج دی گئی',
      bodyEn: 'Your 1,000L Mini Bowzer request was sent to 4 nearby suppliers.',
      bodyUr: 'آپ کی 1,000L باؤزر کی درخواست 4 قریبی سپلائرز کو بھیج دی گئی ہے۔',
      type: 'order',
      read: false,
      timestamp: new Date(Date.now() - 1200000).toISOString()
    }
  ]);

  const [isSimulatingMovement, setIsSimulatingMovement] = useState(false);
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize across browser tabs using BroadcastChannel
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_ORDERS') {
          setOrders(event.data.orders);
        } else if (event.data?.type === 'SYNC_SUPPLIERS') {
          setSuppliers(event.data.suppliers);
        }
      };

      return () => {
        channel.close();
      };
    }
  }, []);

  // Save to localStorage and notify other tabs
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'SYNC_ORDERS', orders });
    }
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SUPPLIERS, JSON.stringify(suppliers));
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'SYNC_SUPPLIERS', suppliers });
    }
  }, [suppliers]);

  // Derived active order for Customer or Supplier
  const activeOrder = orders.find(
    (o) =>
      o.status !== 'completed' &&
      o.status !== 'cancelled' &&
      (activeRole === 'customer'
        ? o.customerId === currentUser.id
        : o.selectedSupplierId === currentUser.id || o.status === 'requested' || o.status === 'has_offers')
  ) || null;

  // Add Notification Helper
  const addNotification = (notif: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Create Order Request (Customer)
  const createOrderRequest = (
    waterTypeId: string,
    quantity: number,
    offeredPricePKR: number,
    deliveryAddress: string,
    customerLocation: { lat: number; lng: number },
    deliveryNotes?: string,
    paymentMethod: 'cash' | 'easypaisa' | 'jazzcash' | 'card' = 'cash'
  ): Order => {
    const selectedWater = waterTypes.find((w) => w.id === waterTypeId) || waterTypes[0];

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      deliveryAddress,
      customerLocation,
      waterTypeId: selectedWater.id,
      waterTypeNameEn: selectedWater.nameEn,
      waterTypeNameUr: selectedWater.nameUr,
      waterTypeUnit: selectedWater.unit,
      quantity,
      offeredPricePKR,
      status: 'requested',
      offers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentMethod,
      paymentStatus: 'unpaid',
      deliveryNotes
    };

    setOrders((prev) => [newOrder, ...prev]);

    addNotification({
      userId: currentUser.id,
      titleEn: 'Request Broadcasted',
      titleUr: 'درخواست نشر کر دی گئی',
      bodyEn: `Your request for ${quantity} x ${selectedWater.nameEn} (${offeredPricePKR} PKR) is sent to nearby suppliers.`,
      bodyUr: `آپ کی درخواست (${offeredPricePKR} روپے) قریبی واٹر سپلائرز کو بھیج دی گئی ہے۔`,
      type: 'order',
      orderId: newOrder.id
    });

    // Auto-Simulate incoming supplier bid after 4 seconds for interactive testing
    setTimeout(() => {
      const activeSupplier = suppliers.find((s) => s.isOnline) || suppliers[0];
      if (activeSupplier) {
        submitSupplierOffer(newOrder.id, offeredPricePKR, activeSupplier);
      }
    }, 4000);

    // Auto-Simulate a 2nd counter-offer after 8 seconds
    setTimeout(() => {
      const secondSupplier = suppliers[1] || suppliers[0];
      if (secondSupplier) {
        submitSupplierOffer(newOrder.id, Math.round(offeredPricePKR * 1.1), secondSupplier);
      }
    }, 8000);

    return newOrder;
  };

  // Submit Offer / Counter-Offer (Supplier)
  const submitSupplierOffer = (
    orderId: string,
    offerPricePKR: number,
    supplier: User
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order;

        // Calculate distance from supplier to customer
        const latDiff = (supplier.location.lat - order.customerLocation.lat) * 111;
        const lngDiff = (supplier.location.lng - order.customerLocation.lng) * 111;
        const dist = Math.max(0.8, Math.sqrt(latDiff * latDiff + lngDiff * lngDiff));
        const etaMins = Math.round(dist * 6) + 5;

        const newOffer: OrderOffer = {
          id: `off-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          supplierId: supplier.id,
          supplierName: supplier.name,
          supplierPhone: supplier.phone,
          supplierRating: supplier.rating,
          supplierTotalDeliveries: supplier.totalDeliveries,
          vehicleType: supplier.vehicleType || 'Water Tanker',
          vehicleNumber: supplier.vehicleNumber || 'KHI-1234',
          distanceKm: parseFloat(dist.toFixed(1)),
          etaMinutes: etaMins,
          offerPricePKR,
          supplierLocation: {
            lat: supplier.location.lat,
            lng: supplier.location.lng
          },
          status: offerPricePKR === order.offeredPricePKR ? 'pending' : 'countered',
          createdAt: new Date().toISOString()
        };

        const existingIndex = order.offers.findIndex((o) => o.supplierId === supplier.id);
        let updatedOffers = [...order.offers];
        if (existingIndex >= 0) {
          updatedOffers[existingIndex] = newOffer;
        } else {
          updatedOffers.push(newOffer);
        }

        return {
          ...order,
          status: order.status === 'requested' ? 'has_offers' : order.status,
          offers: updatedOffers,
          updatedAt: new Date().toISOString()
        };
      })
    );

    addNotification({
      userId: currentUser.id,
      titleEn: 'New Supplier Bid!',
      titleUr: 'نیا بولی پیشکش!',
      bodyEn: `${supplier.name} offered ${offerPricePKR} PKR for your water delivery.`,
      bodyUr: `${supplier.name} نے پانی کی ڈیلیوری کے لیے ${offerPricePKR} روپے کی آفر کی ہے۔`,
      type: 'offer',
      orderId
    });
  };

  // Customer Accepts Offer
  const acceptOffer = (orderId: string, offerId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order;

        const chosenOffer = order.offers.find((o) => o.id === offerId);
        if (!chosenOffer) return order;

        return {
          ...order,
          status: 'accepted',
          selectedSupplierId: chosenOffer.supplierId,
          supplierName: chosenOffer.supplierName,
          supplierPhone: chosenOffer.supplierPhone,
          supplierRating: chosenOffer.supplierRating,
          supplierVehicle: chosenOffer.vehicleType,
          supplierVehicleNumber: chosenOffer.vehicleNumber,
          supplierLocation: {
            lat: chosenOffer.supplierLocation.lat,
            lng: chosenOffer.supplierLocation.lng
          },
          finalPricePKR: chosenOffer.offerPricePKR,
          updatedAt: new Date().toISOString()
        };
      })
    );

    addNotification({
      userId: currentUser.id,
      titleEn: 'Supplier Confirmed',
      titleUr: 'سپلائر کی تصدیق ہو گئی',
      bodyEn: 'Your order is accepted and supplier will start moving shortly.',
      bodyUr: 'آپ کا آرڈر قبول ہو گیا ہے اور سپلائر جلد روانہ ہوگا۔',
      type: 'status',
      orderId
    });
  };

  // Customer Rejects Offer
  const rejectOffer = (orderId: string, offerId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          offers: order.offers.filter((o) => o.id !== offerId),
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  // Update Order Status
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status,
          paymentStatus: status === 'completed' ? 'paid' : order.paymentStatus,
          updatedAt: new Date().toISOString()
        };
      })
    );

    addNotification({
      userId: currentUser.id,
      titleEn: `Order Status: ${status.replace('_', ' ').toUpperCase()}`,
      titleUr: `آرڈر کی صورتحال تبدیل ہو گئی`,
      bodyEn: `Order #${orderId} status changed to ${status}.`,
      bodyUr: `آرڈر #${orderId} کا سٹیٹس تبدیل ہو گیا ہے۔`,
      type: 'status',
      orderId
    });
  };

  // Cancel Order
  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
    stopSimulatedDriverMovement();
  };

  // Toggle Supplier Online
  const toggleSupplierOnline = (supplierId: string) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplierId ? { ...s, isOnline: !s.isOnline } : s))
    );
  };

  // Update Supplier Location
  const updateSupplierLocation = (supplierId: string, lat: number, lng: number) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplierId ? { ...s, location: { ...s.location, lat, lng } } : s))
    );

    setOrders((prev) =>
      prev.map((o) => {
        if (o.selectedSupplierId === supplierId && o.status !== 'completed') {
          return {
            ...o,
            supplierLocation: { lat, lng }
          };
        }
        return o;
      })
    );
  };

  // Admin Actions
  const approveSupplier = (supplierId: string) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplierId ? { ...s, verified: true } : s))
    );
  };

  const rejectSupplier = (supplierId: string) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplierId ? { ...s, verified: false } : s))
    );
  };

  const addWaterType = (wt: Omit<WaterType, 'id'>) => {
    const newWt: WaterType = { ...wt, id: `wt-${Date.now()}` };
    setWaterTypes((prev) => [...prev, newWt]);
  };

  const updateWaterType = (wt: WaterType) => {
    setWaterTypes((prev) => prev.map((w) => (w.id === wt.id ? wt : w)));
  };

  const deleteWaterType = (id: string) => {
    setWaterTypes((prev) => prev.filter((w) => w.id !== id));
  };

  const resolveComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'resolved' } : c))
    );
  };

  const addSavedAddress = (addr: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = { ...addr, id: `addr-${Date.now()}` };
    setSavedAddresses((prev) => [...prev, newAddr]);
  };

  const deleteSavedAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const submitRating = (orderId: string, rating: number, review: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, rating, review, status: 'completed' } : o))
    );
  };

  const submitComplaint = (orderId: string, reason: string, details: string) => {
    const newComplaint: Complaint = {
      id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
      orderId,
      reportedBy: activeRole === 'customer' ? 'customer' : 'supplier',
      reporterName: currentUser.name,
      reporterPhone: currentUser.phone,
      againstName: 'Supplier / Customer',
      reason,
      details,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Driver Movement Simulator (Animates vehicle on map step by step)
  const startSimulatedDriverMovement = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder || !targetOrder.supplierLocation) return;

    setIsSimulatingMovement(true);
    updateOrderStatus(orderId, 'on_way');

    let currentLat = targetOrder.supplierLocation.lat;
    let currentLng = targetOrder.supplierLocation.lng;
    const destLat = targetOrder.customerLocation.lat;
    const destLng = targetOrder.customerLocation.lng;

    const totalSteps = 15;
    let stepCount = 0;

    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
    }

    simulationTimerRef.current = setInterval(() => {
      stepCount++;
      const progress = stepCount / totalSteps;

      currentLat = currentLat + (destLat - currentLat) * 0.15;
      currentLng = currentLng + (destLng - currentLng) * 0.15;

      if (targetOrder.selectedSupplierId) {
        updateSupplierLocation(targetOrder.selectedSupplierId, currentLat, currentLng);
      }

      if (stepCount === Math.floor(totalSteps * 0.7)) {
        updateOrderStatus(orderId, 'arrived');
      }

      if (stepCount >= totalSteps) {
        if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
        setIsSimulatingMovement(false);
        updateOrderStatus(orderId, 'delivered');
      }
    }, 1500);
  };

  const stopSimulatedDriverMovement = () => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
    setIsSimulatingMovement(false);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activeRole,
        setActiveRole,
        currentUser,
        setCurrentUser,
        waterTypes,
        setWaterTypes,
        orders,
        suppliers,
        savedAddresses,
        platformSettings,
        setPlatformSettings,
        complaints,
        notifications,
        activeOrder,
        createOrderRequest,
        submitSupplierOffer,
        acceptOffer,
        rejectOffer,
        updateOrderStatus,
        cancelOrder,
        toggleSupplierOnline,
        updateSupplierLocation,
        approveSupplier,
        rejectSupplier,
        addWaterType,
        updateWaterType,
        deleteWaterType,
        resolveComplaint,
        addSavedAddress,
        deleteSavedAddress,
        submitRating,
        submitComplaint,
        startSimulatedDriverMovement,
        stopSimulatedDriverMovement,
        isSimulatingMovement,
        markNotificationAsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
