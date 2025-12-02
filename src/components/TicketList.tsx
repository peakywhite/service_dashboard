// src/components/TicketList.tsx
import { useEffect, useState } from 'react';
import pb from '../lib/pocketbase';
import type { ServiceTicket } from '../types';

export function TicketList() {
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTickets() {
      try {
        setLoading(true);
        setError(null);

        const result = await pb
          .collection('tickets')
          .getList(1, 20, { sort: '-created' });

        // PocketBase gibt result.items zurück
        setTickets(result.items as unknown as ServiceTicket[]);
      } catch (err) {
        console.error(err);
        setError('Tickets konnten nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  if (loading) return <p>Lade Tickets…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (tickets.length === 0) {
    return <p>Aktuell sind keine Tickets vorhanden.</p>;
  }

  return (
    <div className="ticket-list">
      <table>
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
              <td>{t.status}</td>
              <td>{t.priority}</td>
              <td>{t.customer}</td>
              <td>{t.location}</td>
              <td>{new Date(t.created).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
