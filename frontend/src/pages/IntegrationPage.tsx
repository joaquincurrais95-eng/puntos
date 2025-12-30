import { useAsync } from "../lib/hooks/useAsync";
import { getIntegration } from "../lib/data/integrations";

export default function IntegrationPage() {
  const { data, loading, error, reload } = useAsync(getIntegration, []);

  const apiKey = data?.api_key ?? "";

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copiado");
    } catch {
      alert("No se pudo copiar (permiso del navegador)");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Integración</h1>
        <button
          onClick={reload}
          className="rounded-lg border px-3 py-2 text-sm hover:bg-[var(--app-surface-2)]"
        >
          Reintentar
        </button>
      </div>

      {loading && (
        <div className="rounded-xl border p-4 text-sm app-muted">
          Cargando...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border p-4 text-sm">
          <div className="font-semibold">Error</div>
          <div className="app-text">{error}</div>
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-4">
          <div className="rounded-xl border p-4 space-y-2">
            <div className="text-sm app-muted">API Key</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 block rounded bg-[var(--app-surface)] p-2 overflow-x-auto">
                {data.api_key}
              </code>
              <button
                onClick={() => copy(data.api_key)}
                className="rounded-lg border px-3 py-2 text-sm hover:bg-[var(--app-surface-2)]"
              >
                Copiar
              </button>
            </div>
          </div>

          <div className="rounded-xl border p-4 space-y-2">
            <div className="text-sm app-muted">Ejemplo curl</div>
            <pre className="rounded bg-[var(--app-surface)] p-2 text-xs overflow-x-auto">{`curl -X POST http://localhost:8000/v1/events/transaction \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"external_customer_id":"CUST-1","external_transaction_id":"ORD-1001","amount":12500,"currency":"ARS","timestamp":"2025-12-17T12:00:00Z"}'`}</pre>
            <button
              onClick={() =>
                copy(`curl -X POST http://TU_BACKEND/v1/events/transaction \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"external_customer_id":"CUST-1","external_transaction_id":"ORD-1001","amount":12500,"currency":"ARS","timestamp":"2025-12-17T12:00:00Z"}'`)
              }
              className="rounded-lg border px-3 py-2 text-sm hover:bg-[var(--app-surface-2)]"
            >
              Copiar ejemplo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

