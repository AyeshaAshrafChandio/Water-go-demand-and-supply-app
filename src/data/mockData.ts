import { WaterType, User, SavedAddress, PlatformSettings, Order } from '../types';

// Default cities coordinates (Karachi center around Clifton/PECHS, Lahore, Islamabad)
export const CITY_COORDINATES = {
  Karachi: { lat: 24.8607, lng: 67.0011 },
  Lahore: { lat: 31.5204, lng: 74.3587 },
  Islamabad: { lat: 33.6844, lng: 73.0479 },
  Rawalpindi: { lat: 33.5986, lng: 73.0441 },
  Faisalabad: { lat: 31.4504, lng: 73.1350 },
  Multan: { lat: 30.1575, lng: 71.5249 },
  Peshawar: { lat: 34.0151, lng: 71.5249 },
};

export const INITIAL_WATER_TYPES: WaterType[] = [
  {
    id: 'wt-19l-bottle',
    nameEn: '19L Premium Mineral Bottle',
    nameUr: '19 لیٹر منرل واٹر بوتل',
    category: 'mineral',
    capacityTextEn: '19 Liters (5 Gallons)',
    capacityTextUr: '19 لیٹر (5 گیلن)',
    unit: 'Bottles',
    iconName: 'BottleWater',
    basePricePKR: 280,
    recommendedMinPKR: 220,
    recommendedMaxPKR: 400,
    descriptionEn: 'Purified RO UV mineral water in standard 19L blue bottle for home and office dispensers.',
    descriptionUr: 'گھر اور دفتر کے لیے صاف ستھرا منرل واٹر 19 لیٹر بوتل میں۔',
    popular: true
  },
  {
    id: 'wt-20l-can',
    nameEn: '20L Filtered Can / Jug',
    nameUr: '20 لیٹر فلٹر کین / جگ',
    category: 'gallon',
    capacityTextEn: '20 Liters',
    capacityTextUr: '20 لیٹر',
    unit: 'Cans',
    iconName: 'Milk',
    basePricePKR: 150,
    recommendedMinPKR: 120,
    recommendedMaxPKR: 250,
    descriptionEn: 'Daily filtered RO drinking water delivered in 20-liter standard handles.',
    descriptionUr: 'روزمرہ استعمال کا فلٹر شدہ صاف پانی۔',
    popular: true
  },
  {
    id: 'wt-1000l-bowzer',
    nameEn: '1,000L Mini Bowzer Tanker',
    nameUr: '1,000 لیٹر سمال واٹر باؤزر',
    category: 'tanker',
    capacityTextEn: '1,000 Liters (Mini Bowzer)',
    capacityTextUr: '1,000 لیٹر (مینی ٹینکر)',
    unit: 'Tankers',
    iconName: 'Truck',
    basePricePKR: 2200,
    recommendedMinPKR: 1800,
    recommendedMaxPKR: 3000,
    descriptionEn: 'Ideal for small houses, underground water tanks, or washing/utility backup.',
    descriptionUr: 'چھوٹے مکانات اور زیرِ زمین واٹر ٹینک کے لیے موزوں مینی واٹر باؤزر۔',
    popular: true
  },
  {
    id: 'wt-5000l-tanker',
    nameEn: '5,000L Medium Water Tanker',
    nameUr: '5,000 لیٹر واٹر ٹینکر',
    category: 'tanker',
    capacityTextEn: '5,000 Liters (Medium Bowzer)',
    capacityTextUr: '5,000 لیٹر (میڈیم ٹینکر)',
    unit: 'Tankers',
    iconName: 'Container',
    basePricePKR: 5200,
    recommendedMinPKR: 4500,
    recommendedMaxPKR: 7000,
    descriptionEn: 'Standard size water tanker with high-pressure suction pipe for overhead or underground storage.',
    descriptionUr: 'گھروں اور پلازوں کے لیے ہائی پریشر پائپ کے ساتھ 5 ہزار لیٹر واٹر ٹینکر۔',
    popular: true
  },
  {
    id: 'wt-10000l-tanker',
    nameEn: '10,000L Commercial Bowzer',
    nameUr: '10,000 لیٹر کمرشل واٹر ٹینکر',
    category: 'tanker',
    capacityTextEn: '10,000 Liters (Heavy Bowzer)',
    capacityTextUr: '10,000 لیٹر (بڑا کمرشل باؤزر)',
    unit: 'Tankers',
    iconName: 'Truck',
    basePricePKR: 9500,
    recommendedMinPKR: 8500,
    recommendedMaxPKR: 13000,
    descriptionEn: 'Heavy duty water delivery for apartments, marriage halls, schools, and commercial towers.',
    descriptionUr: 'اپارٹمنٹس، میرج ہالز اور کمرشل عمارتوں کے لیے بڑا کمرشل واٹر ٹینکر۔'
  },
  {
    id: 'wt-crate-1.5l',
    nameEn: 'Mineral Water Crate (1.5L x 6)',
    nameUr: 'منرل واٹر کریٹ (1.5 لیٹر x 6)',
    category: 'crate',
    capacityTextEn: '9 Liters Total (6 Bottles)',
    capacityTextUr: '9 لیٹر (6 بوتلیں)',
    unit: 'Crates',
    iconName: 'Boxes',
    basePricePKR: 550,
    recommendedMinPKR: 480,
    recommendedMaxPKR: 700,
    descriptionEn: 'Factory sealed 1.5-Liter mineral water bottles packed in shrink wrap crate.',
    descriptionUr: 'فیکٹری سیل شدہ 1.5 لیٹر منرل واٹر بوٹلز کا کریٹ۔'
  }
];

export const INITIAL_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-home',
    labelEn: 'Home (PECHS Block 6)',
    labelUr: 'گھر (پی ای سی ایچ ایس بلاک 6)',
    address: 'House 42-B, Street 14, PECHS Block 6, Karachi',
    lat: 24.8685,
    lng: 67.0652,
    isDefault: true
  },
  {
    id: 'addr-office',
    labelEn: 'Office (Clifton Block 4)',
    labelUr: 'دفتر (کلفٹن بلاک 4)',
    address: 'Suite 302, Executive Heights, Main Clifton Road, Karachi',
    lat: 24.8210,
    lng: 67.0315
  },
  {
    id: 'addr-parents',
    labelEn: "Parents' House (Gulshan-e-Iqbal)",
    labelUr: 'والدین کا گھر (گلشنِ اقبال)',
    address: 'A-110, Block 13-D, Gulshan-e-Iqbal, Karachi',
    lat: 24.9200,
    lng: 67.0900
  }
];

export const INITIAL_SUPPLIERS: User[] = [
  {
    id: 'sup-1',
    name: 'Tariq Water Services',
    phone: '+92 300 1234567',
    email: 'tariq.water@watergo.pk',
    role: 'supplier',
    verified: true,
    rating: 4.9,
    totalDeliveries: 342,
    vehicleType: '1000L Small Water Bowzer',
    vehicleNumber: 'KCH-8821',
    cnic: '42201-1234567-1',
    isOnline: true,
    location: {
      lat: 24.8630,
      lng: 67.0580,
      address: 'Shahrah-e-Faisal, Karachi',
      cityName: 'Karachi'
    }
  },
  {
    id: 'sup-2',
    name: 'Al-Madina Pure Water Tankers',
    phone: '+92 321 9876543',
    email: 'almadina@watergo.pk',
    role: 'supplier',
    verified: true,
    rating: 4.8,
    totalDeliveries: 512,
    vehicleType: '5000L Large Tanker',
    vehicleNumber: 'TKR-4099',
    cnic: '42301-9876543-3',
    isOnline: true,
    location: {
      lat: 24.8520,
      lng: 67.0720,
      address: 'Korangi Road, Karachi',
      cityName: 'Karachi'
    }
  },
  {
    id: 'sup-3',
    name: 'Zulqarnain Aqua Express',
    phone: '+92 333 4567890',
    email: 'zulqarnain@watergo.pk',
    role: 'supplier',
    verified: true,
    rating: 4.7,
    totalDeliveries: 189,
    vehicleType: '19L Bottle Carrier (Bike/Rikshaw)',
    vehicleNumber: 'KHI-7720',
    cnic: '42101-4567890-5',
    isOnline: true,
    location: {
      lat: 24.8720,
      lng: 67.0490,
      address: 'Nursery Flyover, PECHS, Karachi',
      cityName: 'Karachi'
    }
  },
  {
    id: 'sup-4',
    name: 'Crescent Commercial Water Supply',
    phone: '+92 312 2223344',
    email: 'crescent@watergo.pk',
    role: 'supplier',
    verified: false, // Verification pending
    rating: 4.5,
    totalDeliveries: 12,
    vehicleType: '10000L Commercial Water Tanker',
    vehicleNumber: 'LS-9011',
    cnic: '42201-7788990-9',
    isOnline: false,
    location: {
      lat: 24.8300,
      lng: 67.0200,
      address: 'Clifton Block 2, Karachi',
      cityName: 'Karachi'
    }
  }
];

export const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  commissionPercent: 5.0,
  baseDeliveryFeePKR: 100,
  searchRadiusKm: 12,
  autoApproveSuppliers: false,
  supportPhone: '+92 21 111 928 374',
  urgentFeePKR: 150
};

export const INITIAL_SAMPLE_ORDER: Order = {
  id: 'ORD-98214',
  customerId: 'cust-demo',
  customerName: 'Muhammad Hamza',
  customerPhone: '+92 301 5551234',
  deliveryAddress: 'House 42-B, Street 14, PECHS Block 6, Karachi',
  customerLocation: {
    lat: 24.8685,
    lng: 67.0652
  },
  waterTypeId: 'wt-1000l-bowzer',
  waterTypeNameEn: '1,000L Mini Bowzer Tanker',
  waterTypeNameUr: '1,000 لیٹر سمال واٹر باؤزر',
  waterTypeUnit: 'Tankers',
  quantity: 1,
  offeredPricePKR: 2200,
  status: 'has_offers',
  createdAt: new Date(Date.now() - 1200000).toISOString(),
  updatedAt: new Date(Date.now() - 600000).toISOString(),
  paymentMethod: 'cash',
  paymentStatus: 'unpaid',
  deliveryNotes: 'Please park tanker near underground tank valve on Street 14 side.',
  offers: [
    {
      id: 'off-1',
      supplierId: 'sup-1',
      supplierName: 'Tariq Water Services',
      supplierPhone: '+92 300 1234567',
      supplierRating: 4.9,
      supplierTotalDeliveries: 342,
      vehicleType: '1000L Small Water Bowzer',
      vehicleNumber: 'KCH-8821',
      distanceKm: 1.4,
      etaMinutes: 12,
      offerPricePKR: 2200,
      supplierLocation: { lat: 24.8630, lng: 67.0580 },
      status: 'pending',
      createdAt: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: 'off-2',
      supplierId: 'sup-2',
      supplierName: 'Al-Madina Pure Water Tankers',
      supplierPhone: '+92 321 9876543',
      supplierRating: 4.8,
      supplierTotalDeliveries: 512,
      vehicleType: '5000L Large Tanker',
      vehicleNumber: 'TKR-4099',
      distanceKm: 2.1,
      etaMinutes: 18,
      offerPricePKR: 2400, // Counter offer
      supplierLocation: { lat: 24.8520, lng: 67.0720 },
      status: 'countered',
      createdAt: new Date(Date.now() - 600000).toISOString()
    }
  ]
};
