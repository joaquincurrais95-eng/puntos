import { useAsync } from "../lib/hooks/useAsync";
import { getEvents } from "../lib/data/events";

export default function EventsPage() {
  const { data: rows, loading, error, reload } = useAsync(getEvents, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Eventos</h1>
        <button onClick={reload} className="rounded-lg border px-3 py-2 text-sm hover:bg-[var(--app-surface-2)]">
          Reintentar
        </button>
      </div>

      {loading && (
        <div className="rounded-xl border p-4 text-sm app-muted">Cargando...</div>
      )}

      {!loading && error && (
        <div className="rounded-xl border p-4 text-sm">
          <div className="font-semibold">Error</div>
          <div className="app-text">{error}</div>
        </div>
      )}

      {!loading && !error && rows && (
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--app-surface)] app-muted">
              <tr>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Transacción</th>
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-right">Monto</th>
                <th className="p-3 text-right">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.created_at}</td>
                  <td className="p-3">{e.external_transaction_id}</td>
                  <td className="p-3">{e.external_customer_id}</td>
                  <td className="p-3 text-right">{e.amount}</td>
                  <td className="p-3 text-right">{e.points}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="p-3 app-muted" colSpan={5}>
                    No hay eventos todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

