import React from 'react';
import dynamic from 'next/dynamic';
import { Country } from '../types/Country';
import 'leaflet/dist/leaflet.css';

// Load map components on client side as leaflet components were trying to render without a browser, causing fatal error.
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });

interface CountryMapProps {
  country: Country;
}

const CountryMap: React.FC<CountryMapProps> = ({ country }) => {
  const position = country.latlng || [51.505, -0.09];

  return (
    
    <MapContainer
      center={position as [number, number]}
      zoom={5}
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

    </MapContainer>
  );
};

export default CountryMap;