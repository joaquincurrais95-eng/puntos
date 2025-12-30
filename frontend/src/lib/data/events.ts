import { DATA_SOURCE } from "./index";
import { eventsMock } from "../../mocks/events";
import { apiGet } from "./apiClient";

export type EventRowDTO = {
  id: number;
  external_transaction_id: string;
  external_customer_id: string;
  amount: number;
  // MVP: aún no calculamos puntos en backend.
  // Mantengo el campo para no romper la UI.
  points: number;
  created_at: string;
  currency?: string;
  timestamp?: string;
};

type EventsApiRow = {
  id: number;
  tenant_id: string;
  external_customer_id: string;
  external_transaction_id: string;
  amount: number;
  currency: string;
  timestamp: string;
  created_at?: string;
};

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export async function getEvents(): Promise<EventRowDTO[]> {
  if (DATA_SOURCE === "mock") return eventsMock;

  const rows = (await apiGet("/v1/events?limit=50&offset=0")) as EventsApiRow[];

  return rows.map((r) => ({
    id: r.id,
    external_transaction_id: r.external_transaction_id,
    external_customer_id: r.external_customer_id,
    amount: r.amount,
    points: 0,
    currency: r.currency,
    timestamp: r.timestamp,
    created_at: formatDate(r.created_at ?? r.timestamp),
  }));
}

