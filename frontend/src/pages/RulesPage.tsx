import { useEffect, useState } from "react";
import { useAsync } from "../lib/hooks/useAsync";
import { getRule, saveRule } from "../lib/data/rules";
import type { RuleDTO } from "../mocks/rules";

export default function RulesPage() {
  const { data, loading, error, reload } = useAsync(getRule, []);
  const [form, setForm] = useState<RuleDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  function update<K extends keyof RuleDTO>(key: K, value: RuleDTO[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function onSave() {
    if (!form) return;

    // validaciones mínimas
    if (!Number.isFinite(form.amount_unit) || form.amount_unit <= 0) {
      alert("amount_unit debe ser mayor a 0");
      return;
    }
    if (!Number.isFinite(form.points_per_amount) || form.points_per_amount < 0) {
      alert("points_per_amount debe ser 0 o mayor");
      return;
    }

    try {
      setSaving(true);
      setSavedMsg(null);
      await saveRule(form);
      await reload();
      setSavedMsg("Guardado ✅");
      setTimeout(() => setSavedMsg(null), 1500);
    } catch (e: any) {
      alert(e?.message ?? "Error guardando regla");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Reglas</h1>

        <div className="flex items-center gap-2">
          {savedMsg && (
            <span className="text-sm app-muted">{savedMsg}</span>
          )}
          <button
            onClick={reload}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-[var(--app-surface-2)]"
          >
            Recargar
          </button>
        </div>
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

      {!loading && !error && form && (
        <div className="rounded-xl border p-4 space-y-4">
          <div>
            <div className="text-sm app-muted mb-1">Regla (MVP)</div>
            <div className="text-sm">
              Otorgar <b>{form.points_per_amount}</b> punto(s) cada{" "}
              <b>${form.amount_unit}</b> {form.currency}.
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1">
              <div className="text-sm app-muted">Puntos</div>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2"
                value={form.points_per_amount}
                onChange={(e) =>
                  update("points_per_amount", Number(e.target.value))
                }
                min={0}
              />
            </label>

            <label className="space-y-1">
              <div className="text-sm app-muted">Cada ($)</div>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2"
                value={form.amount_unit}
                onChange={(e) => update("amount_unit", Number(e.target.value))}
                min={1}
              />
            </label>

            <label className="space-y-1">
              <div className="text-sm app-muted">Moneda</div>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2"
                value={form.currency}
                onChange={(e) => update("currency", e.target.value)}
                disabled
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onSave}
              disabled={saving}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-[var(--app-surface-2)] disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>

          <div className="text-xs app-muted">
            Nota: por ahora se guarda en el navegador (localStorage) para el MVP.
          </div>
        </div>
      )}
    </div>
  );
}

