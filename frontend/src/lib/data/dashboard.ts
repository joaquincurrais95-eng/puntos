import { DATA_SOURCE } from "./index";
import { dashboardMock } from "../../mocks/dashboard";
import { health } from "../api"; // si ya existe

export type DashboardDTO = {
  total_points: number;
  events_last_24h: number;
  active_rule: string;
};

export async function getDashboard(): Promise<DashboardDTO> {
  if (DATA_SOURCE === "mock") return dashboardMock;

  // por ahora, como API real todavía no existe:
  // hacemos un "placeholder" usando /health para probar camino API
  await health();
  return dashboardMock; // temporal: luego se reemplaza por fetch real /dashboard
}

