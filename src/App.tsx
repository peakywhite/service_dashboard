import { useEffect, useState } from 'react';
import './App.css';
import pb from './lib/pocketbase';
import { TicketForm } from './TicketForm';
import { SimService } from './SimService';
import { VehicleInfo } from './VehicleInfo';

type TicketStatus = 'open' | 'in_progress' | 'closed' | string;
type TicketPriority = 'low' | 'medium' | 'high' | string;
type TicketTopic = 'SIM-Karte' | 'Hardware Austausch' | 'Sonstiges' | string;
type TabId = 'tickets' | 'sim' | 'vehicles';
type TicketSubTab = 'open' | 'in_progress' | 'closed';

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  priority?: TicketPriority;
  customer?: string;
  location?: string;
  created: string;
  notes?: string | null;
  closedAt?: string | null;
  topic?: TicketTopic | null;
}

/** Modal zum Bearbeiten eines Tickets */
interface TicketEditModalProps {
  ticket: Ticket;
  onClose: () => void;
  onSaved: () => void;
}

const ticketTopicOptions: TicketTopic[] = ['SIM-Karte', 'Hardware Austausch', 'Sonstiges'];

function TicketEditModal({ ticket, onClose, onSaved }: TicketEditModalProps) {
  const [title, setTitle] = useState(ticket.title);
  const [customer, setCustomer] = useState(ticket.customer ?? '');
  const [location, setLocation] = useState(ticket.location ?? '');
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority ?? 'medium');
  const [topic, setTopic] = useState<TicketTopic>(ticket.topic ?? 'Sonstiges');
  const [notes, setNotes] = useState(ticket.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim()) {
      setError('Bitte einen Titel angeben.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload: Record<string, unknown> = {
        title: title.trim(),
        customer: customer.trim() || null,
        location: location.trim() || null,
        status,
        priority,
        topic,
        notes: notes.trim() || null,
      };

      if (ticket.status !== 'closed' && status === 'closed') {
        payload.closedAt = new Date().toISOString();
      }

      await pb.collection('tickets').update(ticket.id, payload);
      await onSaved();
    } catch (err: any) {
      console.error('Fehler beim Speichern:', err);
      setError('Ticket konnte nicht gespeichert werden: ' + (err?.message || 'Unbekannter Fehler'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3 className="modal-title">Ticket bearbeiten</h3>
        <p className="modal-subtitle">
          Status ändern, Topic anpassen und Notizen ergänzen.
        </p>

        <div className="modal-grid">
          <div className="modal-field">
            <label>Titel *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. Störung Weiche 12"
            />
          </div>

          <div className="modal-field">
            <label>Kunde</label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="z. B. DB Regio"
            />
          </div>

          <div className="modal-field">
            <label>Standort</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="z. B. Stuttgart Hbf"
            />
          </div>

          <div className="modal-field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="open">Offen</option>
              <option value="in_progress">In Bearbeitung</option>
              <option value="closed">Abgeschlossen</option>
            </select>
          </div>

          <div className="modal-field">
            <label>Priorität</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Niedrig</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
            </select>
          </div>

          <div className="modal-field">
            <label>Topic</label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              {ticketTopicOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-field">
          <label>Notizen</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Zusätzliche Infos, Maßnahmen, Ansprechpartner, Ticket-Referenzen…"
          />
        </div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
            Abbrechen
          </button>
          <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Speichere…' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('tickets');
  const [ticketSubTab, setTicketSubTab] = useState<TicketSubTab>('open');
  const [showCreate, setShowCreate] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  async function loadTickets() {
    try {
      setLoading(true);
      const result = await pb
        .collection('tickets')
        .getList(1, 100, { sort: '-created' });

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

  const openTickets = tickets.filter((t) => t.status === 'open');
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress');
  const closedTickets = tickets.filter((t) => t.status === 'closed');

  const openCount = openTickets.length;
  const inProgressCount = inProgressTickets.length;
  const closedCount = closedTickets.length;

  const handleTicketCreated = async () => {
    await loadTickets();
    setShowCreate(false);
    setTicketSubTab('open');
  };

  const handleEditClick = (ticket: Ticket) => {
    setEditingTicket(ticket);
  };

  const handleEditSaved = async () => {
    await loadTickets();
    setEditingTicket(null);
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
        {/* Haupt-Tabs */}
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
            {/* KPI-Section */}
            <section className="section">
              <h2>Ticket-Übersicht</h2>
              <div className="kpi-grid">
                <div className="kpi-card kpi-accent">
                  <span className="kpi-label">Tickets gesamt</span>
                  <span className="kpi-value">{tickets.length}</span>
                  <span className="kpi-sub">letzte 100 Einträge</span>
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
                  <span className="kpi-label">Abgeschlossen</span>
                  <span className="kpi-value">{closedCount}</span>
                  <span className="kpi-sub">Historie</span>
                </div>
              </div>
            </section>

            {/* Unter-Tabs für Tickets */}
            <section className="section">
              <nav className="ticket-subnav">
                <button
                  className={`ticket-subtab ${ticketSubTab === 'open' ? 'active' : ''}`}
                  onClick={() => setTicketSubTab('open')}
                >
                  Offene Tickets
                </button>
                <button
                  className={`ticket-subtab ${ticketSubTab === 'in_progress' ? 'active' : ''}`}
                  onClick={() => setTicketSubTab('in_progress')}
                >
                  In Bearbeitung
                </button>
                <button
                  className={`ticket-subtab ${ticketSubTab === 'closed' ? 'active' : ''}`}
                  onClick={() => setTicketSubTab('closed')}
                >
                  Abgeschlossene Tickets
                </button>
              </nav>

              {/* Inhalt: Offene Tickets */}
              {ticketSubTab === 'open' && (
                <>
                  <div className="section-header">
                    <div>
                      <h2>Offene Tickets</h2>
                      <p className="section-subtitle">
                        Neue Meldungen und Störungen, die noch nicht aufgenommen wurden.
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

                  {!loading && !error && openTickets.length === 0 && (
                    <p>Aktuell sind keine offenen Tickets vorhanden.</p>
                  )}

                  {!loading && !error && openTickets.length > 0 && (
                    <div className="table-wrapper">
<table className="ticket-table">
  <thead>
    <tr>
      <th>Ticket</th>
      <th>Topic</th>
      <th>Priorität</th>
      <th>Kunde</th>
      <th>Standort</th>
      <th>Beschreibung</th>
      <th>Erstellt</th>
      <th>Aktionen</th>
    </tr>
  </thead>
  <tbody>
    {openTickets.map((t) => (
      <tr key={t.id}>
        <td>{t.title}</td>
        <td>{t.topic || '–'}</td>
        <td className={`prio-pill prio-${t.priority}`}>
          {t.priority}
        </td>
        <td>{t.customer}</td>
        <td>{t.location}</td>
        <td className="notes-cell">
          {t.notes ? t.notes : <span className="notes-empty">–</span>}
        </td>
        <td>{new Date(t.created).toLocaleString()}</td>
        <td>
          <button
            type="button"
            className="icon-button small"
            onClick={() => handleEditClick(t)}
            aria-label="Ticket bearbeiten"
          >
            <span className="icon-pencil" />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

                    </div>
                  )}
                </>
              )}

              {/* Inhalt: In Bearbeitung */}
              {ticketSubTab === 'in_progress' && (
                <>
                  <div className="section-header">
                    <div>
                      <h2>Tickets in Bearbeitung</h2>
                      <p className="section-subtitle">
                        Tickets, an denen aktuell gearbeitet wird – inkl. Nachführung per Notizen.
                      </p>
                    </div>
                  </div>

                  {loading && <p>Lade Tickets…</p>}
                  {error && <p style={{ color: 'salmon' }}>{error}</p>}

                  {!loading && !error && inProgressTickets.length === 0 && (
                    <p>Aktuell sind keine Tickets in Bearbeitung.</p>
                  )}

                  {!loading && !error && inProgressTickets.length > 0 && (
                    <div className="table-wrapper">
                      <table className="ticket-table">
                        <thead>
                          <tr>
                            <th>Ticket</th>
                            <th>Topic</th>
                            <th>Priorität</th>
                            <th>Kunde</th>
                            <th>Standort</th>
                            <th>Erstellt</th>
                            <th>Notizen</th>
                            <th>Aktionen</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inProgressTickets.map((t) => (
                            <tr key={t.id}>
                              <td>{t.title}</td>
                              <td>{t.topic || '–'}</td>
                              <td className={`prio-pill prio-${t.priority}`}>
                                {t.priority}
                              </td>
                              <td>{t.customer}</td>
                              <td>{t.location}</td>
                              <td>{new Date(t.created).toLocaleString()}</td>
                              <td className="notes-cell">
                                {t.notes ? t.notes : <span className="notes-empty">–</span>}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="icon-button small"
                                  onClick={() => handleEditClick(t)}
                                  aria-label="Ticket bearbeiten"
                                >
                                  <span className="icon-pencil" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* Inhalt: Abgeschlossene Tickets */}
              {ticketSubTab === 'closed' && (
                <>
                  <div className="section-header">
                    <div>
                      <h2>Abgeschlossene Tickets – Historie</h2>
                      <p className="section-subtitle">
                        Bereits abgeschlossene Fälle, inkl. nachträglicher Notizen.
                      </p>
                    </div>
                  </div>

                  {loading && <p>Lade Tickets…</p>}
                  {error && <p style={{ color: 'salmon' }}>{error}</p>}

                  {!loading && !error && closedTickets.length === 0 && (
                    <p>Es sind noch keine abgeschlossenen Tickets vorhanden.</p>
                  )}

                  {!loading && !error && closedTickets.length > 0 && (
                    <div className="table-wrapper scrollable-table">
                      <table className="ticket-table">
                        <thead>
                          <tr>
                            <th>Ticket</th>
                            <th>Topic</th>
                            <th>Kunde</th>
                            <th>Standort</th>
                            <th>Abgeschlossen am</th>
                            <th>Notizen</th>
                            <th>Aktionen</th>
                          </tr>
                        </thead>
                        <tbody>
                          {closedTickets.map((t) => (
                            <tr key={t.id}>
                              <td>{t.title}</td>
                              <td>{t.topic || '–'}</td>
                              <td>{t.customer}</td>
                              <td>{t.location}</td>
                              <td>
                                {t.closedAt
                                  ? new Date(t.closedAt).toLocaleString()
                                  : new Date(t.created).toLocaleString()}
                              </td>
                              <td className="notes-cell">
                                {t.notes ? t.notes : <span className="notes-empty">–</span>}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="icon-button small"
                                  onClick={() => handleEditClick(t)}
                                  aria-label="Ticket bearbeiten"
                                >
                                  <span className="icon-pencil" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}

        {/* TAB: SIM-Karten Service */}
        {activeTab === 'sim' && <SimService />}

        {/* TAB: Fahrzeug Informationen */}
        {activeTab === 'vehicles' && <VehicleInfo />}
      </main>

      {/* Edit-Modal */}
      {editingTicket && (
        <TicketEditModal
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onSaved={handleEditSaved}
        />
      )}
    </div>
  );
}

export default App;
