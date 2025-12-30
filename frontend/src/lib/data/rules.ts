import { DATA_SOURCE } from "./index";
import { ruleMock, type RuleDTO } from "../../mocks/rules";

const LS_KEY = "mvp_rule_v1";

export async function getRule(): Promise<RuleDTO> {
  if (DATA_SOURCE === "mock") {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return ruleMock;
    try {
      return JSON.parse(raw) as RuleDTO;
    } catch {
      return ruleMock;
    }
  }
  return ruleMock; // luego API real
}

export async function saveRule(rule: RuleDTO): Promise<void> {
  if (DATA_SOURCE === "mock") {
    localStorage.setItem(LS_KEY, JSON.stringify(rule));
    return;
  }
  // luego: POST/PUT a API real
}

