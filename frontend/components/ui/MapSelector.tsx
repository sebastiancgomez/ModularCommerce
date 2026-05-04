'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const libraries: ("places")[] = ["places"];
const mapContainerStyle = { width: '100%', height: '250px', borderRadius: '8px', marginTop: '10px' };
const defaultCenter = { lat: 3.4516, lng: -76.5320 }; // Cali

interface MapSelectorProps {
  onLocationChange: (address: string, mapUrl: string) => void;
  initialAddress?: string;
  initialUrl?: string;
}

export default function MapSelector({ onLocationChange, initialAddress, initialUrl }: MapSelectorProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    libraries
  });

  const [position, setPosition] = useState(defaultCenter);
  const [addressText, setAddressText] = useState(initialAddress || '');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // --- LA CLAVE ESTÁ AQUÍ ---
  // Inicializamos en undefined para que la primera carga SIEMPRE entre al IF de abajo
  const [prevUrl, setPrevUrl] = useState<string | undefined>(undefined);
  const [prevAddr, setPrevAddr] = useState<string | undefined>(undefined);

  // 1. Sincronización de DATOS (Render)
  if (initialUrl !== prevUrl || initialAddress !== prevAddr) {
    if (initialAddress !== prevAddr) {
      setAddressText(initialAddress || '');
    }
    
    // Ahora, en la primera carga, initialUrl (con datos) !== undefined (prevUrl)
    if (initialUrl) {
      try {
        const urlObj = new URL(initialUrl);
        const query = urlObj.searchParams.get("query");
        if (query) {
          const [lat, lng] = query.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            setPosition({ lat, lng });
          }
        }
      } catch (e) { console.error("URL Parse Error:", e); }
    }
    
    setPrevUrl(initialUrl);
    setPrevAddr(initialAddress);
  }

  // 2. Sincronización del MAPA (Effect)
  useEffect(() => {
    if (isLoaded && mapRef.current) {
      mapRef.current.panTo(position);
    }
  }, [position, isLoaded]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.panTo(position);
  }, [position]);

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const newPos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        const newAddress = place.formatted_address || '';
        setPosition(newPos);
        setAddressText(newAddress);
        onLocationChange(newAddress, `https://www.google.com/maps/search/?api=1&query=${newPos.lat},${newPos.lng}`);
      }
    }
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setPosition(newPos);
      const url = `https://www.google.com/maps/search/?api=1&query=${newPos.lat},${newPos.lng}`;
      
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newPos }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const addr = results[0].formatted_address;
          setAddressText(addr); 
          onLocationChange(addr, url);
        }
      });
    }
  };

  if (!isLoaded) return <div className="text-muted">Cargando mapa...</div>;

  return (
    <div className="flex flex-col gap-2">
      <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
        <input 
          type="text" 
          className="input w-full" 
          value={addressText}
          onChange={(e) => setAddressText(e.target.value)}
          placeholder="Busca tu dirección..."
        />
      </Autocomplete>

      <GoogleMap
        key={prevUrl || 'initial'} 
        mapContainerStyle={mapContainerStyle}
        zoom={17}
        center={position}
        onLoad={onMapLoad}
        options={{ streetViewControl: false, mapTypeControl: false }}
      >
        <Marker position={position} draggable={true} onDragEnd={handleMarkerDragEnd} />
      </GoogleMap>
    </div>
  );
}