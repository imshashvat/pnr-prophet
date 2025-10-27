import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const sample = [
  { date: 'W1', rate: 0.45 },
  { date: 'W2', rate: 0.52 },
  { date: 'W3', rate: 0.63 },
  { date: 'W4', rate: 0.58 },
  { date: 'W5', rate: 0.7 },
];

export default function HistoryChart() {
  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <LineChart data={sample}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} stroke="#94a3b8" />
          <Tooltip formatter={(v: any) => `${Math.round(v * 100)}%`} />
          <Line type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
