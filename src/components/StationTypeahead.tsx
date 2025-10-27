import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const STATIONS = [
  { code: 'NDLS', name: 'New Delhi' },
  { code: 'BCT', name: 'Mumbai Central' },
  { code: 'CNB', name: 'Kanpur Central' },
  { code: 'LKO', name: 'Lucknow' },
  { code: 'HWH', name: 'Howrah' },
  { code: 'MAS', name: 'Chennai Central' },
  { code: 'SBC', name: 'Bengaluru City' },
];

export function StationTypeahead({
  label,
  value,
  onChange,
  placeholder,
  id,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  id: string;
}) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    const s = (q || '').toUpperCase();
    return STATIONS.filter((x) => x.code.includes(s) || x.name.toUpperCase().includes(s)).slice(0, 6);
  }, [q]);

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => {
          onChange(e.target.value);
          setQ(e.target.value);
        }}
        aria-autocomplete="list"
        aria-controls={`${id}-list`}
      />
      {open && list.length > 0 && (
        <Card id={`${id}-list`} role="listbox" className="absolute z-10 mt-1 w-full max-h-56 overflow-auto p-1">
          {list.map((opt) => (
            <button
              key={opt.code}
              type="button"
              role="option"
              className="w-full text-left px-2 py-1.5 rounded hover:bg-muted"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(opt.code);
                setQ('');
                setOpen(false);
              }}
            >
              <span className="font-mono mr-2">{opt.code}</span>
              <span className="text-sm text-muted-foreground">{opt.name}</span>
            </button>
          ))}
        </Card>
      )}
      <p className="text-xs text-muted-foreground mt-1">Type station code or name (autocomplete)</p>
    </div>
  );
}
