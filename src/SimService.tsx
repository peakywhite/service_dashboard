// src/SimService.tsx
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';

interface SimCard {
  id: string;
  iccid: string;
  eid: string;
  msisdn: string;
  imeisv: string;
  simStatus: string;
  activeDataConnection: boolean;
  dataUsageKb: number;
  abuseStatus: string;
  limitProfile: string;
  tariff: string;
  orderNumber: string;
  zfNumber: string;
  device: string;
  serialNumber: string;
  project: string;
  customer: string;
}

const API_BASE = 'http://localhost:4000';

export function SimService() {
  const [sims, setSims] = useState<SimCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'suspended'>('all');
  const [customerFilter, setCustomerFilter] = useState<'all' | string>('all');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/sim-cards`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data: SimCard[] = await res.json();
        setSims(data);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(
          'SIM-Daten konnten nicht geladen werden (Mock): ' +
            (err?.message || 'Unbekannter Fehler'),
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const uniqueCustomers = Array.from(new Set(sims.map((s) => s.customer))).filter(Boolean);

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handleStatusChange(e: ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value as any);
  }

  function handleCustomerChange(e: ChangeEvent<HTMLSelectElement>) {
    setCustomerFilter(e.target.value);
  }

  const normalizedSearch = search.trim().toLowerCase();

  const filteredSims = sims.filter((sim) => {
    if (statusFilter !== 'all' && sim.simStatus !== statusFilter) {
      return false;
    }

    if (customerFilter !== 'all' && sim.customer !== customerFilter) {
      return false;
    }

    if (!normalizedSearch) return true;

    const haystack = [
      sim.iccid,
      sim.eid,
      sim.msisdn,
      sim.imeisv,
      sim.zfNumber,
      sim.device,
      sim.serialNumber,
      sim.project,
      sim.customer,
      sim.tariff,
      sim.orderNumber,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });

  const onlineCount = sims.filter((s) => s.simStatus === 'online').length;

  if (loading) {
    return (
      <section className="section">
        <h2>SIM-Karten Service</h2>
        <p>Lade SIM-Daten…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <h2>SIM-Karten Service</h2>
        <p style={{ color: 'salmon' }}>{error}</p>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2>SIM-Karten Service</h2>
          <p className="section-subtitle">
            Übersicht aller M2M-SIMs mit Status, Verbrauch und Projektzuordnung.
          </p>
        </div>
        <div className="section-actions">
          <div className="sim-kpi-badge">
            Online:&nbsp;<span>{onlineCount}</span> / {sims.length}
          </div>
        </div>
      </div>

      {/* Toolbar: Suche + Filter */}
      <div className="table-toolbar">
        <div className="toolbar-group">
          <input
            type="text"
            className="toolbar-search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Suche nach ICCID, MSISDN, Projekt, Kunde, Gerät…"
          />
        </div>
        <div className="toolbar-group">
          <label className="toolbar-label">
            Status
            <select value={statusFilter} onChange={handleStatusChange}>
              <option value="all">Alle</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="suspended">Suspendiert</option>
            </select>
          </label>
          <label className="toolbar-label">
            Kunde
            <select value={customerFilter} onChange={handleCustomerChange}>
              <option value="all">Alle</option>
              {uniqueCustomers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Tabelle */}
      <div className="table-wrapper scrollable-table">
        <table className="ticket-table sim-table">
          <thead>
            <tr>
              <th>ICCID</th>
              <th>EID</th>
              <th>MSISDN</th>
              <th>IMEISV</th>
              <th>SIM-Status</th>
              <th>Aktive Datenverbindung</th>
              <th>Datenverbrauch (KB)</th>
              <th>Missbrauchsstatus</th>
              <th>Limitprofil</th>
              <th>Tarif</th>
              <th>Bestellnummer</th>
              <th>ZF Nummer</th>
              <th>Gerät</th>
              <th>Seriennummer</th>
              <th>Projekt</th>
              <th>Kunde</th>
            </tr>
          </thead>
          <tbody>
            {filteredSims.map((sim) => (
              <tr key={sim.id}>
                <td>{sim.iccid}</td>
                <td>{sim.eid}</td>
                <td>{sim.msisdn}</td>
                <td>{sim.imeisv}</td>
                <td>
                  <span className={`status-pill status-${sim.simStatus}`}>
                    {sim.simStatus}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      sim.activeDataConnection
                        ? 'status-pill status-online'
                        : 'status-pill status-offline'
                    }
                  >
                    {sim.activeDataConnection ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </td>
                <td>{sim.dataUsageKb.toLocaleString('de-DE')}</td>
                <td>{sim.abuseStatus}</td>
                <td>{sim.limitProfile}</td>
                <td>{sim.tariff}</td>
                <td>{sim.orderNumber}</td>
                <td>{sim.zfNumber}</td>
                <td>{sim.device}</td>
                <td>{sim.serialNumber}</td>
                <td>{sim.project}</td>
                <td>{sim.customer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSims.length === 0 && (
        <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#9ca3af' }}>
          Keine SIM-Karten entsprechen den aktuellen Filtern.
        </p>
      )}
    </section>
  );
}
