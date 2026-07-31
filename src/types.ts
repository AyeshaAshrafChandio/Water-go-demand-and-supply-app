export type UserRole = 'customer' | 'supplier' | 'admin';

export type Language = 'en' | 'ur';

export type VehicleType = 
  | '19L Bottle Carrier (Bike/Rikshaw)'
  | '20L Can Pickup Truck'
  | '1000L Small Water Bowzer'
  | '5000L Large Tanker'
  | '10000L Commercial Water Tanker';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  verified: boolean;
  rating: number;
  totalDeliveries: number;
  vehicleType?: VehicleType;
  vehicleNumber?: string;
  cnic?: string;
  profilePic?: string;
  isOnline?: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
    cityName: string;
  };
  cnicFrontUrl?: string;
  cnicBackUrl?: string;
  tankerPicUrl?: string;
}

export type WaterCategory = 'gallon' | 'tanker' | 'mineral' | 'crate';

export interface WaterType {
  id: string;
  nameEn: string;
  nameUr: string;
  category: WaterCategory;
  capacityTextEn: string;
  capacityTextUr: string;
  unit: string;
  iconName: string;
  basePricePKR: number;
  recommendedMinPKR: number;
  recommendedMaxPKR: number;
  descriptionEn: string;
  descriptionUr: string;
  popular?: boolean;
}

export interface OrderOffer {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
  supplierRating: number;
  supplierTotalDeliveries: number;
  vehicleType: string;
  vehicleNumber: string;
  distanceKm: number;
  etaMinutes: number;
  offerPricePKR: number;
  supplierLocation: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: string;
}

export type OrderStatus = 
  | 'requested'    // Customer posted bid
  | 'has_offers'   // Suppliers responded
  | 'accepted'     // Customer chose a supplier
  | 'on_way'       // Supplier is driving to delivery location
  | 'arrived'      // Supplier arrived at destination
  | 'delivered'    // Water delivered, awaiting payment/confirmation
  | 'completed'    // Payment completed, rated
  | 'cancelled';   // Cancelled by customer or supplier

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  customerLocation: {
    lat: number;
    lng: number;
  };
  waterTypeId: string;
  waterTypeNameEn: string;
  waterTypeNameUr: string;
  waterTypeUnit: string;
  quantity: number;
  offeredPricePKR: number; // InDrive initial offer by customer
  finalPricePKR?: number;  // Agreed price after counter-offer
  status: OrderStatus;
  selectedSupplierId?: string;
  supplierName?: string;
  supplierPhone?: string;
  supplierRating?: number;
  supplierVehicle?: string;
  supplierVehicleNumber?: string;
  supplierLocation?: {
    lat: number;
    lng: number;
    heading?: number;
  };
  offers: OrderOffer[];
  createdAt: string;
  updatedAt: string;
  paymentMethod: 'cash' | 'easypaisa' | 'jazzcash' | 'card';
  paymentStatus: 'unpaid' | 'paid';
  deliveryNotes?: string;
  rating?: number;
  review?: string;
}

export interface SavedAddress {
  id: string;
  labelEn: string;
  labelUr: string;
  address: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export interface Complaint {
  id: string;
  orderId: string;
  reportedBy: 'customer' | 'supplier';
  reporterName: string;
  reporterPhone: string;
  againstName: string;
  reason: string;
  details: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
}

export interface PlatformSettings {
  commissionPercent: number; // e.g. 5.0%
  baseDeliveryFeePKR: number; // e.g. 100 PKR
  searchRadiusKm: number; // e.g. 15 km
  autoApproveSuppliers: boolean;
  supportPhone: string;
  urgentFeePKR: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  titleEn: string;
  titleUr: string;
  bodyEn: string;
  bodyUr: string;
  type: 'order' | 'offer' | 'status' | 'verification' | 'system';
  orderId?: string;
  read: boolean;
  timestamp: string;
}
