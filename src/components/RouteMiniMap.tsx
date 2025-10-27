import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useMemo, useState } from 'react';
import { Api, RouteResponse } from '@/lib/api';

export default function RouteMiniMap({ trainNo }: { trainNo: string }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey || '' });
  const [route, setRoute] = useState<RouteResponse | null>(null);

  useEffect(() => {
    if (trainNo) Api.route(trainNo).then(setRoute).catch(() => setRoute(null));
  }, [trainNo]);

  const center = useMemo(() => {
    const st = route?.stations ?? [];
    return st.length ? { lat: st[0].lat, lng: st[0].lng } : { lat: 22.9734, lng: 78.6569 };
  }, [route]);

  if (!apiKey) return <div className="text-sm text-muted-foreground">Set VITE_GOOGLE_MAPS_API_KEY to view the route map.</div>;
  if (!isLoaded) return <div className="text-sm">Loading map…</div>;

  const path = (route?.stations || []).map(s => ({ lat: s.lat, lng: s.lng }));

  return (
    <div className="h-72 w-full">
      <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={center} zoom={5}>
        {route?.stations?.map((s, i) => (
          <Marker key={s.code + i} position={{ lat: s.lat, lng: s.lng }} label={s.code} />
        ))}
        {path.length > 1 && (
          <Polyline path={path} options={{ strokeColor: '#1d4ed8', strokeWeight: 4 }} />
        )}
      </GoogleMap>
    </div>
  );
}
