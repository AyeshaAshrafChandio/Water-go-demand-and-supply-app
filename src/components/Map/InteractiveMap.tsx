import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapLocation {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
}

interface SupplierMapPin extends MapLocation {
  id: string;
  vehicleType?: string;
  isOnline?: boolean;
}

interface DeliveryMapPin {
  id: string;
  customerLocation: MapLocation;
  supplierLocation?: MapLocation;
  status: string;
}

interface InteractiveMapProps {
  center?: MapLocation;
  zoom?: number;
  customerLocation?: MapLocation;
  supplierLocation?: MapLocation;
  nearbySuppliers?: SupplierMapPin[];
  allDeliveries?: DeliveryMapPin[];
  interactiveSelect?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  showRoutePolyline?: boolean;
  height?: string;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center = { lat: 24.8607, lng: 67.0011 },
  zoom = 14,
  customerLocation,
  supplierLocation,
  nearbySuppliers = [],
  allDeliveries = [],
  interactiveSelect = false,
  onLocationSelect,
  showRoutePolyline = true,
  height = '360px',
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false
      });

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile Layer: CartoDB Positron for modern, high-contrast look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Location Selection click event
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (interactiveSelect && onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    };

    if (interactiveSelect) {
      map.on('click', handleMapClick);
    } else {
      map.off('click', handleMapClick);
    }

    return () => {
      map.off('click', handleMapClick);
    };
  }, [interactiveSelect, onLocationSelect]);

  // Render Pins & Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const bounds: L.LatLngExpression[] = [];

    // Helper: Create Custom Div Icons
    const createCustomerIcon = () =>
      L.divIcon({
        className: 'custom-customer-icon',
        html: `
          <div class="relative flex items-center justify-center w-10 h-10 bg-cyan-600 text-white rounded-full shadow-lg border-2 border-white marker-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

    const createSupplierIcon = (vehicle = 'Tanker') =>
      L.divIcon({
        className: 'custom-supplier-icon',
        html: `
          <div class="relative flex items-center justify-center w-11 h-11 bg-slate-900 text-cyan-400 rounded-full shadow-2xl border-2 border-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

    const createNearbySupplierIcon = () =>
      L.divIcon({
        className: 'custom-nearby-icon',
        html: `
          <div class="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white rounded-full shadow-md border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

    // 1. Customer Location Marker
    if (customerLocation) {
      const custMarker = L.marker([customerLocation.lat, customerLocation.lng], {
        icon: createCustomerIcon()
      }).addTo(map);

      custMarker.bindPopup(`
        <div class="text-xs font-sans">
          <div class="font-bold text-slate-800 text-sm">📍 Delivery Location</div>
          <div class="text-slate-600 mt-1">${customerLocation.address || 'Selected Spot'}</div>
        </div>
      `);

      markersRef.current.push(custMarker);
      bounds.push([customerLocation.lat, customerLocation.lng]);
    }

    // 2. Supplier Location Marker
    if (supplierLocation) {
      const supMarker = L.marker([supplierLocation.lat, supplierLocation.lng], {
        icon: createSupplierIcon()
      }).addTo(map);

      supMarker.bindPopup(`
        <div class="text-xs font-sans">
          <div class="font-bold text-cyan-700 text-sm">🚛 ${supplierLocation.name || 'Water Tanker'}</div>
          <div class="text-slate-600 mt-1">Live Location Sharing Active</div>
        </div>
      `);

      markersRef.current.push(supMarker);
      bounds.push([supplierLocation.lat, supplierLocation.lng]);
    }

    // 3. Draw Route Polyline if both exist
    if (customerLocation && supplierLocation && showRoutePolyline) {
      const lineCoords: [number, number][] = [
        [supplierLocation.lat, supplierLocation.lng],
        [customerLocation.lat, customerLocation.lng]
      ];

      const polyline = L.polyline(lineCoords, {
        color: '#0284c7', // Cyan-600
        weight: 5,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);

      polylineRef.current = polyline;
    }

    // 4. Nearby Online Suppliers
    nearbySuppliers.forEach((sup) => {
      const nMarker = L.marker([sup.lat, sup.lng], {
        icon: createNearbySupplierIcon()
      }).addTo(map);

      nMarker.bindPopup(`
        <div class="text-xs font-sans">
          <div class="font-bold text-slate-800">${sup.name || 'Nearby Water Service'}</div>
          <div class="text-emerald-600 font-medium">Online & Available</div>
        </div>
      `);

      markersRef.current.push(nMarker);
    });

    // 5. Admin Live Deliveries Overview Pins
    allDeliveries.forEach((d) => {
      const custPin = L.marker([d.customerLocation.lat, d.customerLocation.lng], {
        icon: createCustomerIcon()
      }).addTo(map);
      markersRef.current.push(custPin);

      if (d.supplierLocation) {
        const supPin = L.marker([d.supplierLocation.lat, d.supplierLocation.lng], {
          icon: createSupplierIcon()
        }).addTo(map);
        markersRef.current.push(supPin);
      }
    });

    // Auto-fit bounds if markers exist
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], zoom);
    }
  }, [customerLocation, supplierLocation, nearbySuppliers, allDeliveries, showRoutePolyline]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${className}`}>
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />
      {interactiveSelect && (
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full z-10 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Tap on map to select delivery point</span>
        </div>
      )}
    </div>
  );
};
