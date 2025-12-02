// src/components/KPIs.tsx
import { useEffect, useState } from 'react';
import pb from '../lib/pocketbase';

interface Counters {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
}

export function KPIs() {
  const [counters, setCounters] = useState<Counters | null>(null);

  useEffect(() => {
    async function loadCounters() {
      // Achtung: sehr einfache Variante, bei vielen Tickets lieber
      // mit Filter/Statistik per API arbeiten
      const result = await pb
        .collection('tickets')
        .getFullList({ sort: '-created' });

      const total = result.length;
      const open = result.filter((t: any) => t.status === 'open').length;
      const inProgress = result.filter((t: any) => t.status === 'in_progress').length;
      const closed = result.filter((t: any) => t.status === 'closed').length;

      setCounters({ total, open, inProgress, closed });
    }

    loadCounters();
  }, []);

  if (!counters) return <p>Lade Kennzahlen…</p>;

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <span className="kpi-label">Tickets gesamt</span>
        <span className="kpi-value">{counters.total}</span>
      </div>
      <div className="kpi-card">
        <span className="kpi-label">Offen</span>
        <span className="kpi-value">{counters.open}</span>
      </div>
      <div className="kpi-card">
        <span className="kpi-label">In Bearbeitung</span>
        <span className="kpi-value">{counters.inProgress}</span>
      </div>
      <div className="kpi-card">
        <span className="kpi-label">Geschlossen</span>
        <span className="kpi-value">{counters.closed}</span>
      </div>
    </div>
  );
}
