export type Tab = "predictions" | "charts" | "metrics" | "settings";
export type Direction = "UP" | "DOWN";
export type Expiry = "30s" | "1m" | "3m" | "5m";

export interface Prediction {
  id: number;
  pair: string;
  direction: Direction;
  confidence: number;
  expiry: Expiry;
  time: string;
  result?: "WIN" | "LOSS" | "PENDING";
}

export interface Alert {
  id: number;
  message: string;
  type: "high" | "critical" | "info";
  time: string;
}

export const CHART_POINTS = 40;

export function generatePrediction(id: number): Prediction {
  const pairs = ["EUR/USD", "GBP/USD", "BTC/USD", "ETH/USD", "USD/JPY"];
  const expiries: Expiry[] = ["30s", "1m", "3m", "5m"];
  const confidence = Math.floor(Math.random() * 40 + 55);
  return {
    id,
    pair: pairs[Math.floor(Math.random() * pairs.length)],
    direction: Math.random() > 0.5 ? "UP" : "DOWN",
    confidence,
    expiry: expiries[Math.floor(Math.random() * expiries.length)],
    time: new Date().toLocaleTimeString("ru-RU"),
    result: confidence > 85 ? "PENDING" : Math.random() > 0.4 ? "WIN" : "LOSS",
  };
}

export function generateChartData(): number[] {
  const data: number[] = [];
  let val = 50;
  for (let i = 0; i < CHART_POINTS; i++) {
    val += (Math.random() - 0.48) * 5;
    val = Math.max(10, Math.min(90, val));
    data.push(val);
  }
  return data;
}
