import React, { useMemo } from 'react';
import { Api, type RouteResponse } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

const StationMarker = ({ s }: { s: any }) => (
  <div className="text-xs text-white">{s.code}</div>
);

const MapPlaceholder = ({ stations }: { stations: any[] }) => (
  <div className="bg-slate-900 rounded p-4 h-80 text-slate-300">
    <div className="mb-2 font-semibold">Google Maps placeholder</div>
    <div>Stations: {stations.map(s => s.code).join(' → ')}</div>
    <div className="mt-2 text-xs">Integrate @react-google-maps/api with your API key for the full map.</div>
  </div>
);

export default function RouteMap() {
  const { data, isLoading, error } = useQuery<RouteResponse>({
    queryKey: ['route', '12345'],
    queryFn: () => Api.route('12345')
  });

  const stations = data?.stations ?? [];
  const polyline = useMemo(() => stations.map((s) => ({ lat: s.lat, lng: s.lng })), [stations]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });
  const center = polyline[0] || { lat: 22.9734, lng: 78.6569 }; // India centroid fallback
  const mapContainerStyle = { width: '100%', height: '320px' } as const;

  if (isLoading) return <div className="text-white p-6">Loading route…</div>;
  if (error) return <div className="text-red-400 p-6">Failed to load route</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Route Visualization</h1>
      {isLoaded && polyline.length > 0 ? (
        <div className="rounded overflow-hidden border border-slate-800">
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={6} options={{
            disableDefaultUI: true,
            styles: [],
          }}>
            {stations.map((s, idx) => (
              <Marker key={s.code+idx} position={{ lat: s.lat, lng: s.lng }} label={s.code} />
            ))}
            <Polyline path={polyline} options={{ strokeColor: '#22c55e', strokeOpacity: 0.9, strokeWeight: 4 }} />
          </GoogleMap>
        </div>
      ) : (
        <MapPlaceholder stations={stations} />
      )}
      <div className="mt-4 text-sm text-slate-300">Polyline points: {polyline.length}</div>
    </div>
  );
}
