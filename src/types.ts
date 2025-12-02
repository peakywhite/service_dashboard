// src/types.ts
export type TicketStatus = 'open' | 'in_progress' | 'closed' | string;
export type TicketPriority = 'low' | 'medium' | 'high' | string;

export interface ServiceTicket {
  id: string;
  title: string;
  status: TicketStatus;
  priority?: TicketPriority;
  customer?: string;
  location?: string;
  created: string;
}
