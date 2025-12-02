// src/App.tsx
import { useEffect, useState } from 'react';
import './App.css';
import pb from './lib/pocketbase';
import { TicketForm } from './TicketForm';
import { SimService } from './SimService';
import { VehicleInfo } from './VehicleInfo';

type TicketStatus = 'open' | 'in_progress' | 'closed' | string;
type TicketPriority = 'low' | 'medium' | 'high' | string;
type TabId = 'tickets' | 'sim' | 'vehicles';

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  priority?: TicketPriority;
  customer?: string;
  location?: string;
  created: string;
}

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('tickets');
  const [showCreate, setShowCreate] = useState(false);

  async function loadTickets() {
    try {
      setLoading(true);
      const result = await pb
        .collection('tickets')
        .getList(1, 50, { sort: '-created' });

      setTickets(result.items as unknown as Ticket[]);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Tickets:', err);
      setError('Tickets konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const closedCount = tickets.filter((t) => t.status === 'closed').length;

  const handleTicketCreated = async () => {
    await loadTickets();
    setShowCreate(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>connect@rail – Service Control</h1>
          <p>Operationelles Dashboard für Tickets, SIM-Services und Fahrzeugdaten.</p>
        </div>
        <div className="header-right">
          <span className="user-pill">Service Leitstelle</span>
        </div>
      </header>

      <main className="app-main">
        {/* Tabs */}
        <nav className="tab-nav">
          <button
            className={`tab ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            <span className="tab-dot" />
            Tickets
          </button>
          <button
            className={`tab ${activeTab === 'sim' ? 'active' : ''}`}
            onClick={() => setActiveTab('sim')}
          >
            <span className="tab-dot" />
            SIM-Karten Service
          </button>
          <button
            className={`tab ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            <span className="tab-dot" />
            Fahrzeug Informationen
          </button>
        </nav>

        {/* TAB: Tickets */}
        {activeTab === 'tickets' && (
          <>
            <section className="section">
              <h2>Aktuelle Kennzahlen</h2>
              <div className="kpi-grid">
                <div className="kpi-card kpi-accent">
                  <span className="kpi-label">Tickets gesamt</span>
                  <span className="kpi-value">{tickets.length}</span>
                  <span className="kpi-sub">letzte 50 Einträge</span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">Offen</span>
                  <span className="kpi-value">{openCount}</span>
                  <span className="kpi-sub">sofort prüfen</span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">In Bearbeitung</span>
                  <span className="kpi-value">{inProgressCount}</span>
                  <span className="kpi-sub">Technik aktiv</span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">Geschlossen</span>
                  <span className="kpi-value">{closedCount}</span>
                  <span className="kpi-sub">heute abgeschlossen</span>
                </div>
              </div>
            </section>

            <section className="section">
              <div className="section-header">
                <div>
                  <h2>Service-Tickets</h2>
                  <p className="section-subtitle">
                    Aktive Störungen, Meldungen und Wartungsfälle im Netz.
                  </p>
                </div>
                <div className="section-actions">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => setShowCreate((v) => !v)}
                    aria-label="Neues Ticket anlegen"
                  >
                    <span className="icon-plus" />
                  </button>
                </div>
              </div>

              {showCreate && (
                <div className="section-subcard">
                  <TicketForm onCreated={handleTicketCreated} />
                </div>
              )}

              {loading && <p>Lade Tickets…</p>}
              {error && <p style={{ color: 'salmon' }}>{error}</p>}

              {!loading && !error && tickets.length === 0 && (
                <p>Aktuell sind keine Tickets vorhanden.</p>
              )}

              {!loading && !error && tickets.length > 0 && (
                <div className="table-wrapper">
                  <table className="ticket-table">
                    <thead>
                      <tr>
                        <th>Ticket</th>
                        <th>Status</th>
                        <th>Priorität</th>
                        <th>Kunde</th>
                        <th>Standort</th>
                        <th>Erstellt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t) => (
                        <tr key={t.id}>
                          <td>{t.title}</td>
                          <td className={`status-pill status-${t.status}`}>
                            {t.status}
                          </td>
                          <td className={`prio-pill prio-${t.priority}`}>
                            {t.priority}
                          </td>
                          <td>{t.customer}</td>
                          <td>{t.location}</td>
                          <td>{new Date(t.created).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {/* TAB: SIM-Karten Service */}
        {activeTab === 'sim' && <SimService />}

        {/* TAB: Fahrzeug Informationen */}
        {activeTab === 'vehicles' && <VehicleInfo />}
      </main>
    </div>
  );
}

export default App;
