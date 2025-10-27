import React from 'react';

const colors = [
  { max: 0.4, bg: 'bg-red-600' },
  { max: 0.8, bg: 'bg-yellow-500' },
  { max: 1.0, bg: 'bg-green-600' },
];

export default function PredictionBar({ value }: { value: number }) {
  const bounded = Math.max(0, Math.min(1, value));
  const pct = Math.round(bounded * 100);
  const color = colors.find(c => bounded <= c.max)?.bg || 'bg-green-600';
  return (
    <div>
      <div className="h-3 w-full bg-slate-800 rounded overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-slate-300 mt-1">Confidence: {pct}%</div>
    </div>
  );
}
