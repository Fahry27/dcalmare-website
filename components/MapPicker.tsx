"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapPickerProps {
  onLocationSelect: (address: string) => void;
}

function LocationMarker({ position, setPosition, onLocationSelect }: any) {
  const [loading, setLoading] = useState(false);

  const map = useMapEvents({
    click(e) {
      handleLocationChange(e.latlng);
    },
  });

  async function handleLocationChange(latlng: L.LatLng) {
    setPosition(latlng);
    map.flyTo(latlng, map.getZoom());
    setLoading(true);

    try {
      // Reverse geocoding using Nominatim (OpenStreetMap)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "id-ID",
          },
        }
      );
      if (!res.ok) throw new Error("Gagal mengambil data alamat");
      const data = await res.json();
      onLocationSelect(data.display_name || "Alamat tidak ditemukan");
    } catch (err) {
      console.error(err);
      onLocationSelect("Gagal mengambil alamat otomatis. Geser pin ke tempat lain.");
    } finally {
      setLoading(false);
    }
  }

  return position === null ? null : (
    <Marker 
      position={position} 
      icon={icon} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          handleLocationChange(pos);
        }
      }}
    />
  );
}

function MapUpdater({ center }: { center: L.LatLng | null }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15);
    }
  }, [center, map]);
  return null;
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Default to Jakarta
  const defaultCenter = { lat: -6.2088, lng: 106.8456 };

  // Try to get user's current location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
          setPosition(latlng);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setPosition(new L.LatLng(defaultCenter.lat, defaultCenter.lng));
        }
      );
    } else {
      setPosition(new L.LatLng(defaultCenter.lat, defaultCenter.lng));
    }
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`, {
        headers: { "Accept-Language": "id-ID" }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const latlng = new L.LatLng(data[0].lat, data[0].lon);
        setPosition(latlng);
        onLocationSelect(data[0].display_name);
      } else {
        alert("Alamat tidak ditemukan. Coba kata kunci lain.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mencari alamat.");
    } finally {
      setIsSearching(false);
    }
  }

  if (!position) {
    return <div className="h-[400px] w-full bg-offwhite animate-pulse border border-burgundy/15 flex items-center justify-center text-sm text-muted">Memuat peta...</div>;
  }

  return (
    <div className="relative h-[400px] w-full border border-burgundy/15 z-0 flex flex-col">
      <form onSubmit={handleSearch} className="absolute top-2 left-2 right-2 z-[400] flex gap-2">
        <input 
          type="text" 
          placeholder="Cari jalan, kecamatan, atau kota..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-h-10 px-3 py-2 text-sm border border-burgundy/20 bg-white/95 shadow-sm outline-none focus:border-burgundy rounded-sm"
        />
        <button 
          type="submit" 
          disabled={isSearching}
          className="min-h-10 px-4 bg-burgundy text-white text-sm font-semibold rounded-sm shadow-sm hover:bg-burgundy-dark transition-colors disabled:opacity-70"
        >
          {isSearching ? "Mencari..." : "Cari"}
        </button>
      </form>
      
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={true} 
        zoomControl={false}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <ZoomControl position="bottomleft" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
        <MapUpdater center={position} />
      </MapContainer>
      <div className="absolute bottom-2 right-2 z-[400] pointer-events-none bg-white/90 px-3 py-1.5 text-xs text-ink font-medium rounded shadow-sm border border-burgundy/10">
        Geser pin untuk akurasi
      </div>
    </div>
  );
}
