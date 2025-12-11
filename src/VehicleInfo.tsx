// src/VehicleInfo.tsx
import { useEffect, useState } from 'react';

type VehicleStatus = 'aktiv' | 'wartung' | 'offline';
type VcuStatus = 'online' | 'offline' | 'wartung';

interface VcuInfo {
  id?: string;
  number: string;
  position?: string;
  status?: VcuStatus;
}

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

  // Erweiterte Felder aus vehicleData.js
  shortNumber?: number; // Zugnummer / Fahrzeugbezeichnung (201, 651, 101, ...)
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
  sims?: string[];

  // VCU-Infos
  vcuNumber?: string; // primäre VCU-Nummer (erste)
  vcuCount?: number;  // Anzahl verbauter VCUs
  vcus?: VcuInfo[];   // Liste aller VCUs
}

export function VehicleInfo() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [operatorFilter, setOperatorFilter] = useState<'ALL' | string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | VehicleStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);

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

    // Suche nach VCU-Nummern
    const matchesVcuNumber =
      (v.vcuNumber && v.vcuNumber.toLowerCase().includes(term)) ||
      (v.vcus?.some(vcu => vcu.number.toLowerCase().includes(term)) ?? false);

    // Suche nach Zugnummer / Fahrzeugnummer (shortNumber)
    const matchesShortNumber =
      v.shortNumber !== undefined &&
      String(v.shortNumber).toLowerCase().includes(term);

    return (
      v.id.toLowerCase().includes(term) ||
      matchesShortNumber ||
      v.name.toLowerCase().includes(term) ||
      v.line.toLowerCase().includes(term) ||
      v.location.toLowerCase().includes(term) ||
      (v.notes ?? '').toLowerCase().includes(term) ||
      matchesVcuNumber
    );
  });

  const closeModal = () => setSelectedVehicle(null);

  const renderVcuBadges = (vehicle: Vehicle) => {
    if (vehicle.vcus && vehicle.vcus.length > 0) {
      return vehicle.vcus.map((vcu, idx) => {
        const statusClass = vcu.status
          ? `vcu-status-${vcu.status}`
          : 'vcu-status-unknown';

        return (
          <span
            key={vcu.id ?? `${vehicle.id}-vcu-${idx}`}
            className={`code-badge vcu-badge ${statusClass}`}
            title={
              vcu.status
                ? `VCU ${vcu.number} ist ${vcu.status}${
                    vcu.position ? ` (${vcu.position})` : ''
                  }`
                : vcu.position
                ? `VCU ${vcu.number} (${vcu.position})`
                : `VCU ${vcu.number}`
            }
          >
            {vcu.number}
          </span>
        );
      });
    }

    if (vehicle.vcuNumber) {
      return (
        <span
          className="code-badge vcu-badge vcu-status-unknown"
          title={`VCU ${vehicle.vcuNumber} (Status unbekannt)`}
        >
          {vehicle.vcuNumber}
        </span>
      );
    }

    return (
      <span className="section-subtitle">
        Keine VCU hinterlegt
      </span>
    );
  };

  return (
    <>
      <section className="section">
        {/* Kopf */}
        <div className="section-header">
          <div>
            <h2>Fahrzeug Informationen</h2>
            <p className="section-subtitle">
              Übersicht über Fahrzeugstammdaten, VCU-Konfigurationen und Wartungsfenster
              in deinem connect@rail-Netzwerk.
            </p>
          </div>
        <div className="sim-kpi-badge">
            <span>{total}</span> Fahrzeuge im Monitoring
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
                <div className="kpi-label">Fahrzeuge insgesamt</div>
                <div className="kpi-value">{total}</div>
                <div className="kpi-sub">
                  Graz Linien, DB Regio BaWü &amp; Agilis
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Aktiv im Netz</div>
                <div className="kpi-value">{active}</div>
                <div className="kpi-sub">im Fahrgastbetrieb</div>
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
                <div className="kpi-sub">Fahrzeuge mit aktuellem Firmwarestand</div>
              </div>
            </div>

            {/* Beschreibung */}
            <div className="section-subcard" style={{ marginBottom: '0.9rem' }}>
              <ul className="bullet-list">
                <li>Fahrzeug-ID / Nummer, Betreiber, Linie &amp; aktueller Standort</li>
                <li>VCU-Konfiguration (1–3 VCUs, je mit eindeutiger Nummer &amp; Status)</li>
                <li>Software- &amp; Wartungsinformationen in der Detailansicht</li>
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
                  placeholder="Suche nach Fahrzeug-ID, Zugnummer (z. B. 201), Linie, Ort, VCU-Nummer oder Notiz…"
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
                      <th>VCU-Nummern</th>
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
                            padding: '0.8rem',
                          }}
                        >
                          Kein Fahrzeug für die aktuelle Filterung gefunden.
                        </td>
                      </tr>
                    )}

                    {filteredVehicles.map(vehicle => (
                      <tr
                        key={vehicle.id}
                        onClick={() => setSelectedVehicle(vehicle)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <div className="vehicle-main">
                            <div className="vehicle-id">{vehicle.id}</div>
                            <div className="vehicle-name">
                              {vehicle.name}
                              {vehicle.shortNumber && (
                                <span style={{ opacity: 0.7 }}>
                                  {' '}
                                  (Nr. {vehicle.shortNumber})
                                </span>
                              )}
                            </div>
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
                          <div className="vehicle-vcus">
                            {renderVcuBadges(vehicle)}
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
                  Klick auf ein Fahrzeug öffnet die Detailansicht mit vollständiger
                  VCU- &amp; Software-Konfiguration.
                </span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Detail-Modal */}
      {selectedVehicle && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal-card"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="modal-title">
              {selectedVehicle.name}{' '}
              <span style={{ opacity: 0.7 }}>({selectedVehicle.id})</span>
            </h3>
            <p className="modal-subtitle">
              Detailansicht für Fahrzeug, VCUs, Module und Wartungsinformationen.
            </p>

            <div className="modal-grid">
              {/* Stammdaten */}
              <div>
                <div className="modal-field">
                  <label>Betreiber</label>
                  <span>{selectedVehicle.operator}</span>
                </div>
                <div className="modal-field">
                  <label>Linie</label>
                  <span>{selectedVehicle.line}</span>
                </div>
                <div className="modal-field">
                  <label>Fahrzeugnummer</label>
                  <span>
                    {selectedVehicle.shortNumber ?? '–'}
                  </span>
                </div>
                <div className="modal-field">
                  <label>Flotte / Typ</label>
                  <span>{selectedVehicle.fleet ?? '–'}</span>
                </div>
                <div className="modal-field">
                  <label>Land</label>
                  <span>{selectedVehicle.country ?? '–'}</span>
                </div>
                <div className="modal-field">
                  <label>Baujahr</label>
                  <span>{selectedVehicle.buildYear ?? '–'}</span>
                </div>
                <div className="modal-field">
                  <label>Sitzplätze</label>
                  <span>{selectedVehicle.seats ?? '–'}</span>
                </div>
                <div className="modal-field">
                  <label>WLAN an Bord</label>
                  <span>
                    {selectedVehicle.wifiInstalled === true
                      ? 'Ja'
                      : selectedVehicle.wifiInstalled === false
                      ? 'Nein'
                      : '–'}
                  </span>
                </div>
              </div>

              {/* VCU + Technik */}
              <div>
                <div className="modal-field">
                  <label>VCU-Anzahl</label>
                  <span>
                    {selectedVehicle.vcuCount ??
                      selectedVehicle.vcus?.length ??
                      0}
                  </span>
                </div>
                <div className="modal-field">
                  <label>VCU-Nummern</label>
                  <span>
                    {selectedVehicle.vcus && selectedVehicle.vcus.length > 0 ? (
                      selectedVehicle.vcus.map((vcu, idx) => (
                        <div
                          key={vcu.id ?? `${selectedVehicle.id}-vcu-detail-${idx}`}
                          style={{ marginBottom: '0.15rem' }}
                        >
                          <span>{vcu.number}</span>
                          {vcu.position && (
                            <span style={{ opacity: 0.8 }}>
                              {' '}
                              – {vcu.position}
                            </span>
                          )}
                          {vcu.status && (
                            <span style={{ opacity: 0.8 }}>
                              {' '}
                              ({vcu.status})
                            </span>
                          )}
                        </div>
                      ))
                    ) : selectedVehicle.vcuNumber ? (
                      selectedVehicle.vcuNumber
                    ) : (
                      '–'
                    )}
                  </span>
                </div>
                <div className="modal-field">
                  <label>Softwarestand</label>
                  <span>
                    {selectedVehicle.softwareVersion}{' '}
                    {selectedVehicle.softwareUpToDate
                      ? '(aktuell)'
                      : '(Update geplant)'}
                  </span>
                </div>
                <div className="modal-field">
                  <label>Nächste Wartung</label>
                  <span>{selectedVehicle.nextMaintenance}</span>
                </div>
                <div className="modal-field">
                  <label>Wartungswerk</label>
                  <span>{selectedVehicle.maintenanceDepot ?? '–'}</span>
                </div>
                <div className="modal-field">
                  <label>SIMs (Anzahl)</label>
                  <span>{selectedVehicle.sims?.length ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="modal-field">
              <label>Installierte connect@rail-Module</label>
              <span>
                {selectedVehicle.modules && selectedVehicle.modules.length > 0 ? (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.1rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    {selectedVehicle.modules.map((m, idx) => (
                      <li key={idx}>
                        {m.name} – <code>{m.firmware}</code>
                      </li>
                    ))}
                  </ul>
                ) : (
                  '–'
                )}
              </span>
            </div>

            <div className="modal-field">
              <label>Notizen</label>
              <span>
                {selectedVehicle.notes ?? 'Keine zusätzlichen Notizen hinterlegt.'}
              </span>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeModal}>
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
