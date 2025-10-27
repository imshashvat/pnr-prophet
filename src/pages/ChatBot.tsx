import React, { useState } from 'react';
import PredictionBar from '@/components/PredictionBar';
import { Api } from '@/lib/api';

export default function ChatBot() {
  const [question, setQuestion] = useState('Train 12345 SL tomorrow, WL 18 — will it confirm?');
  const [answer, setAnswer] = useState<string>('');
  const [prob, setProb] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    try {
      // naive parse for demo
      const wl = 18;
      const res = await Api.predict({
        train_no: '12345', wl_position: wl, day_of_week: 3, distance: 300, status: 'WL18', clazz: 'SL'
      });
      setProb(res.confirmation_chance);
      setAnswer(`Estimated confirmation chance is ${(res.confirmation_chance*100).toFixed(0)}%. Top factors: ${res.top_factors.join(', ')}.`);
    } catch (e: any) {
      setAnswer('I could not compute that right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">AI Travel Assistant</h1>
      <div className="bg-slate-900 p-4 rounded">
        <textarea className="w-full bg-slate-800 p-3 rounded border border-slate-700" rows={3} value={question} onChange={e=>setQuestion(e.target.value)} />
        <button onClick={handleAsk} disabled={loading} className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          {loading ? 'Thinking…' : 'Ask'}
        </button>
        {answer && (
          <div className="mt-4">
            <div className="text-slate-200 mb-2">{answer}</div>
            {prob !== null && <PredictionBar value={prob} />}
          </div>
        )}
      </div>
    </div>
  );
}
