import type { FormEvent } from 'react';
import { useState } from 'react';
import pb from './lib/pocketbase';

interface TicketFormProps {
  onCreated?: () => void;
}

const statusOptions = [
  { value: 'open', label: 'Offen' },
  { value: 'in_progress', label: 'In Bearbeitung' },
  { value: 'closed', label: 'Geschlossen' },
];

const priorityOptions = [
  { value: 'low', label: 'Niedrig' },
  { value: 'medium', label: 'Mittel' },
  { value: 'high', label: 'Hoch' },
];

export function TicketForm({ onCreated }: TicketFormProps) {
  const [title, setTitle] = useState('');
  const [customer, setCustomer] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('open');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Bitte einen Titel angeben.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await pb.collection('tickets').create({
        title,
        status,
        priority,
        customer,
        location,
      });

      // Formular zurücksetzen
      setTitle('');
      setCustomer('');
      setLocation('');
      setStatus('open');
      setPriority('medium');

      // Liste aktualisieren
      onCreated?.();
     } catch (err: any) {
      console.error('Fehler beim Anlegen des Tickets:', err);

      // Versuche sinnvolle Fehlermeldung zu bauen
      let msg = 'Ticket konnte nicht angelegt werden.';
      if (err?.message) {
        msg = `Ticket konnte nicht angelegt werden: ${err.message}`;
      } else if (err?.data) {
        msg = `Ticket konnte nicht angelegt werden: ${JSON.stringify(err.data)}`;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }

  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <div className="ticket-form-row">
        <div className="ticket-form-field">
          <label>Titel *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z. B. Störung Weiche 12"
          />
        </div>

        <div className="ticket-form-field">
          <label>Kunde</label>
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="z. B. DB Regio"
          />
        </div>

        <div className="ticket-form-field">
          <label>Standort</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="z. B. Stuttgart Hbf"
          />
        </div>
      </div>

      <div className="ticket-form-row">
        <div className="ticket-form-field small">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="ticket-form-field small">
          <label>Priorität</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            {priorityOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="ticket-form-actions">
          {error && <span className="ticket-form-error">{error}</span>}
          <button type="submit" disabled={loading}>
            {loading ? 'Speichern…' : 'Ticket anlegen'}
          </button>
        </div>
      </div>
    </form>
  );
}
