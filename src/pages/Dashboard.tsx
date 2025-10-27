import React from 'react';
import HistoryChart from '@/components/HistoryChart';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
      <p className="text-slate-300 mb-6">Tracked PNRs, alerts, and prediction history.</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded p-4">
          <h2 className="font-semibold mb-2">Historical Confirmation Trends</h2>
          <HistoryChart />
        </div>
        <div className="bg-slate-900 rounded p-4">
          <h2 className="font-semibold mb-2">Recent Alerts</h2>
          <ul className="text-sm text-slate-300 list-disc ml-4">
            <li>PNR 1234567890 moved from WL12 to WL8</li>
            <li>Train 12345 SL class has RAC available</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
