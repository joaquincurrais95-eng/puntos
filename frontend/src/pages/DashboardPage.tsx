import { useAsync } from "../lib/hooks/useAsync";
import { getDashboard } from "../lib/data/dashboard";
import { Card } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";

export default function DashboardPage() {
  const { data, loading, error, reload } = useAsync(getDashboard, []);

  return (
  <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="text-sm app-muted">Métricas principales y actividad</div>
        </div>

        <button
          onClick={reload}
          className="rounded-2xl border px-4 py-2 text-sm app-border bg-[var(--app-surface)] hover:bg-[var(--app-surface-2)]"
        >
          Reintentar
        </button>
      </div>

      {loading && <Card className="text-sm app-muted">Cargando…</Card>}
      {error && <Card className="text-sm">Error: {String(error)}</Card>}

      {data && (
        <>
          {/* Grid de stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Puntos de circulación" value={`${data.total_points}`} helper="Últimos 30 días" />
            <StatCard label="Eventos (24h)" value={`${data.events_last_24h}`} helper="Ingesta / webhooks" />
            <StatCard label="Regla activa" value={`${data.active_rule}`} helper="Configuración vigente" />
          </div>

          {/* Actividad */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Última actividad</div>
                <div className="text-sm app-muted">Eventos recientes</div>
              </div>
              <span className="rounded-full bg-[var(--app-surface-2)] px-3 py-1 text-xs app-muted">
                Demo
              </span>
            </div>

            <div className="mt-4 divide-y app-border">
              {[
                { label: "Compra acreditada", meta: "cliente #123 — +120 pts" },
                { label: "Canje realizado", meta: "order #991 — -300 pts" },
                { label: "Regla actualizada", meta: "10% cashback en productos X" },
              ].map((r, i) => (
                <div key={i} className="py-3">
                  <div className="font-medium">{r.label}</div>
                  <div className="text-sm app-muted">{r.meta}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
