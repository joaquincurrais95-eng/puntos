import { DATA_SOURCE } from "./index";
import { integrationMock, type IntegrationDTO } from "../../mocks/integrations";

export async function getIntegration(): Promise<IntegrationDTO> {
  if (DATA_SOURCE === "mock") return integrationMock;
  return integrationMock; // luego reemplazás por API real
}

