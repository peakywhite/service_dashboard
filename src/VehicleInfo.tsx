// src/VehicleInfo.tsx
import { useEffect, useState } from 'react';

type VehicleStatus = 'aktiv' | 'wartung' | 'offline';

interface Vehicle {
  id: string;
  name: string;
  operator: string;
  line: string;
  status: VehicleStatus;
  lastSeen: string;
  softwareVersion: string;
  softwareUpToDate: boolean;
  nextMaintenance: string;
  location: string;

  // optionale Felder aus vehicleData / telekomClient
  fleet?: string;
  country?: string;
  lastSoftwareRollout?: string;
  nextSoftwareRollout?: string;
  maintenanceDepot?: string;
  buildYear?: number;
  seats?: number;
  wifiInstalled?: boolean;
  simStatus?: 'ok' | 'warn' | 'critical';
  modules?: { name: string; firmware: string }[];
  notes?: string;
}

export function VehicleInfo() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [operatorFilter, setOperatorFilter] = useState<'ALL' | string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | VehicleStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Wichtig: richtiger Port (Backend)
        const res = await fetch('http://localhost:4000/api/vehicles');

        if (!res.ok) {
          throw new Error(
            `Fehler beim Laden der Fahrzeuge: ${res.status} ${res.statusText}`
          );
        }

        const data: Vehicle[] = await res.json();
        setVehicles(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? 'Unbekannter Fehler beim Laden der Fahrzeugdaten');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const total = vehicles.length;
  const active = vehicles.filter(v => v.status === 'aktiv').length;
  const inMaintenance = vehicles.filter(v => v.status === 'wartung').length;
  const upToDateShare =
    total > 0
      ? Math.round((vehicles.filter(v => v.softwareUpToDate).length / total) * 100)
      : 0;

  const operators = Array.from(new Set(vehicles.map(v => v.operator))).sort();

  const filteredVehicles = vehicles.filter(v => {
    if (operatorFilter !== 'ALL' && v.operator !== operatorFilter) return false;
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.id.toLowerCase().includes(term) ||
      v.name.toLowerCase().includes(term) ||
      v.line.toLowerCase().includes(term) ||
      v.location.toLowerCase().includes(term) ||
      (v.notes ?? '').toLowerCase().includes(term)
    );
  });

  return (
    <section className="section">
      {/* Kopf + Kurzbeschreibung */}
      <div className="section-header">
        <div>
          <h2>Fahrzeug Informationen</h2>
          <p className="section-subtitle">
            Übersicht über Fahrzeugstammdaten, Softwarestände und geplante Wartungsfenster
            in deinem connect@rail-Netzwerk.
          </p>
        </div>
        <div className="sim-kpi-badge">
          <span>{total}</span> Züge im Monitoring
        </div>
      </div>

      {/* Loading / Fehler */}
      {loading && (
        <div className="section-subcard" style={{ marginBottom: '0.9rem' }}>
          <span className="section-subtitle">Lade Fahrzeugdaten…</span>
        </div>
      )}

      {error && !loading && (
        <div className="section-subcard" style={{ marginBottom: '0.9rem' }}>
          <span className="ticket-form-error">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* KPI-Grid */}
          <div className="kpi-grid" style={{ marginBottom: '1rem' }}>
            <div className="kpi-card kpi-accent">
              <div className="kpi-label">Züge insgesamt</div>
              <div className="kpi-value">{total}</div>
              <div className="kpi-sub">Über alle Betreiber & Linien</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Aktiv im Netz</div>
              <div className="kpi-value">{active}</div>
              <div className="kpi-sub">mit aktueller Verbindung</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">In Wartung</div>
              <div className="kpi-value">{inMaintenance}</div>
              <div className="kpi-sub">geplante / laufende Arbeiten</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Software aktuell</div>
              <div className="kpi-value">{upToDateShare}%</div>
              <div className="mini-bar" style={{ marginTop: '0.35rem' }}>
                <span style={{ width: `${upToDateShare}%` }} />
              </div>
              <div className="kpi-sub">Züge mit aktuellem Firmwarestand</div>
            </div>
          </div>

          {/* Beschreibung */}
          <div className="section-subcard" style={{ marginBottom: '0.9rem' }}>
            <ul className="bullet-list">
              <li>Zug / Fahrzeug-ID, Betreiber, Linie & aktueller Standort</li>
              <li>Softwarestände der installierten connect@rail-Module (aggregiert)</li>
              <li>Nächste Wartungsfenster & geplante Software-Rollouts</li>
            </ul>
          </div>

          {/* Toolbar + Tabelle */}
          <div className="section-subcard">
            <div className="table-toolbar">
              <div className="toolbar-group">
                <div className="toolbar-label">
                  <span>Betreiber</span>
                  <select
                    value={operatorFilter}
                    onChange={e =>
                      setOperatorFilter(
                        e.target.value === 'ALL' ? 'ALL' : e.target.value
                      )
                    }
                  >
                    <option value="ALL">Alle Betreiber</option>
                    {operators.map(op => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="toolbar-label">
                  <span>Status</span>
                  <select
                    value={statusFilter}
                    onChange={e =>
                      setStatusFilter(
                        e.target.value === 'ALL'
                          ? 'ALL'
                          : (e.target.value as VehicleStatus)
                      )
                    }
                  >
                    <option value="ALL">Alle Status</option>
                    <option value="aktiv">Aktiv</option>
                    <option value="wartung">In Wartung</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <input
                className="toolbar-search"
                placeholder="Suche nach Fahrzeug-ID, Linie, Ort oder Notiz…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="table-wrapper scrollable-table">
              <table className="ticket-table vehicle-table">
                <thead>
                  <tr>
                    <th>Fahrzeug</th>
                    <th>Betreiber / Linie</th>
                    <th>Status</th>
                    <th>Software</th>
                    <th>Nächste Wartung</th>
                    <th>Standort</th>
                    <th>Letzte Meldung</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: 'center',
                          fontSize: '0.8rem',
                          padding: '0.8rem'
                        }}
                      >
                        Kein Fahrzeug für die aktuelle Filterung gefunden.
                      </td>
                    </tr>
                  )}

                  {filteredVehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                      <td>
                        <div className="vehicle-main">
                          <div className="vehicle-id">{vehicle.id}</div>
                          <div className="vehicle-name">{vehicle.name}</div>
                        </div>
                      </td>
                      <td>
                        <div className="vehicle-operator">{vehicle.operator}</div>
                        <div className="vehicle-line">{vehicle.line}</div>
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            vehicle.status === 'aktiv'
                              ? 'status-vehicle-active'
                              : vehicle.status === 'wartung'
                              ? 'status-vehicle-maintenance'
                              : 'status-vehicle-offline'
                          }`}
                        >
                          {vehicle.status === 'aktiv' && 'Aktiv'}
                          {vehicle.status === 'wartung' && 'In Wartung'}
                          {vehicle.status === 'offline' && 'Offline'}
                        </span>
                      </td>
                      <td>
                        <div className="vehicle-software">
                          <span className="code-badge">
                            {vehicle.softwareVersion}
                          </span>
                          <span
                            className={
                              vehicle.softwareUpToDate
                                ? 'software-label-ok'
                                : 'software-label-outdated'
                            }
                          >
                            {vehicle.softwareUpToDate ? 'aktuell' : 'Update geplant'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="vehicle-maintenance">
                          {vehicle.nextMaintenance}
                        </span>
                      </td>
                      <td>
                        <span className="vehicle-location">
                          {vehicle.location}
                        </span>
                      </td>
                      <td>
                        <span className="vehicle-last-seen">
                          {vehicle.lastSeen}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '0.45rem' }}>
              <span className="section-subtitle">
                Daten werden alle 60&nbsp;Sekunden über connect@rail aktualisiert.
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
