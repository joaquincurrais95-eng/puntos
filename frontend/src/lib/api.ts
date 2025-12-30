export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export async function health() {
  const r = await fetch(`${API_BASE}/health`);
  if (!r.ok) throw new Error("Health failed");
  return r.json();
}

