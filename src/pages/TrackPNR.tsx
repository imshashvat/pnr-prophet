import React, { useState } from 'react';

const TrackPNR: React.FC = () => {
  const [pnr, setPnr] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus(null);
    // TODO: Replace with real API call
    setTimeout(() => {
      setStatus({
        pnr,
        currentStatus: 'WL 10',
        history: [
          { status: 'WL 15', time: '2025-10-25 10:00' },
          { status: 'WL 12', time: '2025-10-25 18:00' },
          { status: 'WL 10', time: '2025-10-26 09:00' },
        ],
        coach: 'S2',
        berth: '45',
        eta: '2h 30m',
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-slate-900 rounded-lg shadow-lg mt-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Track Your PNR</h1>
      <form onSubmit={handleTrack} className="flex flex-col gap-4">
        <input
          type="text"
          value={pnr}
          onChange={e => setPnr(e.target.value)}
          placeholder="Enter 10-digit PNR"
          className="p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={10}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          disabled={loading}
        >
          {loading ? 'Tracking...' : 'Track PNR'}
        </button>
      </form>
      {error && <div className="text-red-400 mt-2">{error}</div>}
      {status && (
        <div className="mt-6 bg-slate-800 p-4 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Current Status:</span>
            <span className="text-lg font-bold text-yellow-400">{status.currentStatus}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Coach/Berth:</span> {status.coach}/{status.berth}
          </div>
          <div className="mb-2">
            <span className="font-semibold">ETA:</span> {status.eta}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Status History:</span>
            <ul className="ml-4 mt-1 list-disc text-sm">
              {status.history.map((h: any, i: number) => (
                <li key={i}>{h.status} at {h.time}</li>
              ))}
            </ul>
          </div>
          <button className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">Enable Notifications</button>
        </div>
      )}
    </div>
  );
};

export default TrackPNR;
