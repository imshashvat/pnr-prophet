import { useMemo, useState, Suspense } from 'react';
import { Api, PredictResponse, TrendsResponse, ReliabilityResponse, RouteResponse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { StationTypeahead } from '@/components/StationTypeahead';
import PrivacyNotice from '@/components/PrivacyNotice';
import { QuotaHelp } from '@/components/QuotaHelp';
import PredictionBar from '@/components/PredictionBar';
import { Skeleton } from '@/components/ui/skeleton';

const bands = { green: 0.8, amber: 0.5 };

const schema = z.object({
  train_no: z.string().min(3, 'Train number is required'),
  source: z.string().min(2, 'From station is required'),
  destination: z.string().min(2, 'To station is required'),
  date: z.string().min(4, 'Date is required'),
  clazz: z.string().min(1, 'Class is required'),
  quota_type: z.enum(['GNWL', 'RLWL', 'PQWL', 'TQWL']),
  wl_position: z.coerce.number().int().positive('WL must be a positive integer'),
}).refine((d) => !!d.quota_type && !!d.clazz, {
  message: 'Quota is required when class is selected',
  path: ['quota_type'],
});

type FormData = z.infer<typeof schema>;

const FESTIVALS = new Set(['2025-10-31', '2025-11-01', '2025-11-02', '2025-11-03']);

function useFestival(date?: string) {
  return useMemo(() => (date ? FESTIVALS.has(date) : false), [date]);
}

export default function PredictRHF() {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { clazz: '3A', quota_type: 'GNWL', wl_position: 10 } as any,
  });
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [trends, setTrends] = useState<TrendsResponse | null>(null);
  const [rel, setRel] = useState<ReliabilityResponse | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'result' | 'route' | 'trends'>('result');

  const date = watch('date');
  const quota = watch('quota_type');
  const trainNo = watch('train_no');
  const clazz = watch('clazz');
  const isFestival = useFestival(date);

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const payload = {
        train_no: data.train_no,
        source: data.source,
        destination: data.destination,
        date: data.date,
        clazz: data.clazz,
        quota_type: data.quota_type,
        wl_position: data.wl_position,
      };
      const res = await Api.predict(payload);
      setResult(res);
      const [t, r] = await Promise.all([
        Api.trends({ train_no: data.train_no, clazz: data.clazz }),
        Api.reliability(),
      ]);
      setTrends(t);
      setRel(r);
      try { setRoute(await Api.route(data.train_no)); } catch {}
      toast.success('Prediction ready');
    } catch (e: any) {
      toast.error('Prediction failed', { description: String(e) });
    } finally {
      setLoading(false);
    }
  }

  const prob = result?.confirmation_chance ?? 0;
  const band = prob >= bands.green ? 'green' : prob >= bands.amber ? 'amber' : 'red';

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Route- and quota-aware Waitlist Predictor</h1>
      <Card className="p-4 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="train_no">Train No</Label>
            <Input id="train_no" aria-invalid={!!errors.train_no} {...register('train_no')} placeholder="e.g., 12345" />
            {errors.train_no && <div className="text-xs text-red-500 mt-1" role="alert">{errors.train_no.message}</div>}
          </div>
          <div>
            <StationTypeahead id="source" label="From" value={watch('source') || ''} onChange={(v)=> setValue('source', v)} placeholder="e.g., NDLS" />
            {errors.source && <div className="text-xs text-red-500 mt-1" role="alert">{errors.source.message}</div>}
          </div>
          <div>
            <StationTypeahead id="destination" label="To" value={watch('destination') || ''} onChange={(v)=> setValue('destination', v)} placeholder="e.g., BCT" />
            {errors.destination && <div className="text-xs text-red-500 mt-1" role="alert">{errors.destination.message}</div>}
          </div>
          <div>
            <Label htmlFor="date">Journey Date</Label>
            <Input id="date" type="date" aria-invalid={!!errors.date} {...register('date')} />
            {isFestival && <div className="text-xs text-amber-600 mt-1">Festival period detected — demand spikes expected.</div>}
            {errors.date && <div className="text-xs text-red-500 mt-1" role="alert">{errors.date.message}</div>}
          </div>
          <div>
            <Label htmlFor="clazz">Class</Label>
            <Input id="clazz" {...register('clazz')} placeholder="e.g., 3A" />
            {errors.clazz && <div className="text-xs text-red-500 mt-1" role="alert">{errors.clazz.message}</div>}
          </div>
          <div>
            <Label htmlFor="quota_type">Quota <QuotaHelp /></Label>
            <Input id="quota_type" {...register('quota_type')} placeholder="GNWL/RLWL/PQWL/TQWL" />
            {quota === 'RLWL' && <div className="text-xs text-amber-600 mt-1">RLWL often clears differently than GNWL depending on your boarding segment.</div>}
            {errors.quota_type && <div className="text-xs text-red-500 mt-1" role="alert">{errors.quota_type.message}</div>}
          </div>
          <div>
            <Label htmlFor="wl_position">WL Position</Label>
            <Input id="wl_position" type="number" aria-invalid={!!errors.wl_position} {...register('wl_position', { valueAsNumber: true })} />
            {errors.wl_position && <div className="text-xs text-red-500 mt-1" role="alert">{errors.wl_position.message}</div>}
          </div>
          <div className="md:col-span-3">
            <Button type="submit" disabled={loading}>{loading ? 'Predicting…' : 'Predict'}</Button>
          </div>
        </form>
      </Card>

      {loading && (
        <div className="grid md:grid-cols-3 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      )}

      {result && (
        <Tabs value={activeTab} onValueChange={(v)=> setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="result">Result</TabsTrigger>
            <TabsTrigger value="route">Route</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="result">
            <Card className="p-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Calibrated probability</div>
                <div className={`font-bold ${band === 'green' ? 'text-green-600' : band === 'amber' ? 'text-yellow-600' : 'text-red-600'}`} aria-live="polite">{Math.round(prob * 100)}%</div>
              </div>
              <div aria-label="Confirmation probability" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(prob*100)}>
                <PredictionBar value={prob} />
              </div>
              {isFestival && <div className="mt-2 inline-block text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Festival period detected</div>}
              <div className="text-sm text-muted-foreground mt-2">How this is computed: train, quota, lead-time, route busy index, weekdays, and festival flags.</div>
              <div className="grid md:grid-cols-3 gap-3 mt-4">
                <Card className="p-3"><div className="text-xs text-muted-foreground">Train</div><div className="font-semibold">{trainNo}</div></Card>
                <Card className="p-3"><div className="text-xs text-muted-foreground">Class/Quota</div><div className="font-semibold">{clazz}/{quota}</div></Card>
                <Card className="p-3"><div className="text-xs text-muted-foreground">Days to departure</div><div className="font-semibold">{result?.features?.days_to_departure ?? '-'}</div></Card>
              </div>

              {prob < 0.4 && (
                <div className="mt-4">
                  <div className="font-semibold mb-2">Alternatives</div>
                  <div className="text-sm text-muted-foreground mb-2">Try nearby dates or different classes with better chances.</div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <Card className="p-3">Consider traveling a day earlier.</Card>
                    <Card className="p-3">Check GNWL if currently RLWL.</Card>
                    <Card className="p-3">Try 3A instead of SL if available.</Card>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="route">
            <Card className="p-4 mt-4">
              <Suspense fallback={<Skeleton className="h-72" />}>
                <RouteMapEmbed trainNo={trainNo} route={route} />
              </Suspense>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="p-4 mt-4">
              <Suspense fallback={<Skeleton className="h-72" />}>
                <TrendsCharts trends={trends} reliability={rel} />
              </Suspense>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <PrivacyNotice />
    </div>
  );
}

function RouteMapEmbed({ trainNo, route }: { trainNo?: string; route: RouteResponse | null }) {
  const { GoogleMap, Marker, Polyline, useJsApiLoader } = require('@react-google-maps/api');
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: key });
  if (!trainNo) return <div className="text-sm text-muted-foreground">Enter inputs and predict to view route.</div>;
  if (!isLoaded) return <Skeleton className="h-72" />;
  const stations = route?.stations || [];
  const center = stations.length ? { lat: stations[0].lat, lng: stations[0].lng } : { lat: 22.5, lng: 78.9 };
  return (
    <div className="h-72 w-full">
      <GoogleMap center={center} zoom={5} mapContainerStyle={{ width: '100%', height: '100%' }}>
        {stations.map((s: any) => (
          <Marker key={s.code} position={{ lat: s.lat, lng: s.lng }} label={s.code} />
        ))}
        {stations.length > 1 && (
          <Polyline path={stations.map((s: any) => ({ lat: s.lat, lng: s.lng }))} options={{ strokeColor: '#2563eb', strokeWeight: 3 }} />
        )}
      </GoogleMap>
    </div>
  );
}

function TrendsCharts({ trends, reliability }: { trends: TrendsResponse | null; reliability: ReliabilityResponse | null }) {
  const { Line } = require('react-chartjs-2');
  const { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } = require('chart.js');
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

  if (!trends || !reliability) return <div className="text-sm text-muted-foreground">Run a prediction to view trends.</div>;
  const monthly = {
    labels: trends.monthly.map((m: any) => m.month),
    datasets: [{ label: 'Avg prob by month', data: trends.monthly.map((m: any) => m.avg_prob), borderColor: '#16a34a' }],
  };
  const wlCurve = {
    labels: trends.wl_vs_prob.map((w: any) => String(w.wl)),
    datasets: [{ label: 'Probability vs WL', data: trends.wl_vs_prob.map((w: any) => w.prob), borderColor: '#2563eb' }],
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="text-sm mb-2">Seasonality</div>
        <Line data={monthly} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
      <div>
        <div className="text-sm mb-2">WL vs probability</div>
        <Line data={wlCurve} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
}
