import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tab, Expiry, Prediction, Alert, CHART_POINTS } from "./types";

interface TabPredictionsProps {
  predictions: Prediction[];
  selectedExpiry: Expiry;
  onExpiryChange: (e: Expiry) => void;
}

export function TabPredictions({ predictions, selectedExpiry, onExpiryChange }: TabPredictionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Активные прогнозы</h2>
        <div className="flex gap-2">
          {(["30s", "1m", "3m", "5m"] as Expiry[]).map((e) => (
            <button
              key={e}
              onClick={() => onExpiryChange(e)}
              className="px-3 py-1 rounded-lg text-xs transition-all"
              style={selectedExpiry === e ? {
                background: "rgba(0,245,255,0.1)",
                border: "1px solid rgba(0,245,255,0.5)",
                color: "var(--neon-cyan)",
                fontFamily: "IBM Plex Mono, monospace",
              } : {
                border: "1px solid hsl(var(--border))",
                color: "#666",
                fontFamily: "IBM Plex Mono, monospace",
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {predictions.slice(0, 6).map((p, i) => (
          <div
            key={p.id}
            className="bg-card border rounded-xl p-4 flex items-center gap-4 hover-scale transition-transform animate-slide-up"
            style={{
              borderColor: p.confidence >= 85 ? "rgba(0,245,255,0.4)" : "hsl(var(--border))",
              boxShadow: p.confidence >= 85 ? "0 0 20px rgba(0,245,255,0.15)" : "none",
              animationDelay: `${i * 60}ms`,
            }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
              background: p.direction === "UP" ? "rgba(48,209,88,0.1)" : "rgba(255,55,95,0.1)"
            }}>
              <Icon
                name={p.direction === "UP" ? "TrendingUp" : "TrendingDown"}
                size={18}
                style={{ color: p.direction === "UP" ? "var(--neon-green)" : "var(--neon-red)" }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{p.pair}</span>
                <Badge variant="outline" className="text-xs" style={{
                  borderColor: p.direction === "UP" ? "rgba(48,209,88,0.4)" : "rgba(255,55,95,0.4)",
                  color: p.direction === "UP" ? "var(--neon-green)" : "var(--neon-red)"
                }}>
                  {p.direction}
                </Badge>
                {p.confidence >= 85 && (
                  <Badge variant="outline" className="text-xs animate-pulse-slow" style={{ borderColor: "rgba(0,245,255,0.4)", color: "var(--neon-cyan)" }}>
                    🔥 Высокая
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress value={p.confidence} className="h-1.5" />
                </div>
                <span className="text-xs text-muted-foreground" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{p.confidence}%</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-xs font-bold mb-1" style={{
                color: p.result === "WIN" ? "var(--neon-green)" : p.result === "LOSS" ? "var(--neon-red)" : "var(--neon-orange)"
              }}>
                {p.result === "PENDING" ? "⏳" : p.result === "WIN" ? "✓ WIN" : "✗ LOSS"}
              </div>
              <div className="text-xs text-muted-foreground" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{p.expiry}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TabChartsProps {
  ticker: { price: number; change: number };
  chartData: number[];
}

export function TabCharts({ ticker, chartData }: TabChartsProps) {
  const svgPoints = chartData
    .map((v, i) => `${(i / (CHART_POINTS - 1)) * 100},${60 - (v / 100) * 60}`)
    .join(" ");
  const areaPoints = `0,60 ${svgPoints} 100,60`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ценовой график</h2>
        <span className="text-xs text-muted-foreground" style={{ fontFamily: "IBM Plex Mono, monospace" }}>EUR/USD • Live</span>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <div className="text-2xl font-bold" style={{ color: "var(--neon-cyan)", fontFamily: "IBM Plex Mono, monospace" }}>{ticker.price}</div>
            <div className="text-sm" style={{ color: ticker.change >= 0 ? "var(--neon-green)" : "var(--neon-red)", fontFamily: "IBM Plex Mono, monospace" }}>
              {ticker.change >= 0 ? "▲" : "▼"} {Math.abs(ticker.change).toFixed(4)}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--neon-green)" }} />
            <span className="text-xs text-muted-foreground">Реальное время</span>
          </div>
        </div>

        <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="w-full h-48">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#chartGrad)" />
          <polyline points={svgPoints} fill="none" stroke="#00f5ff" strokeWidth="0.8" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground mb-1">Волатильность</div>
          <div className="text-xl font-bold" style={{ color: "var(--neon-purple)", fontFamily: "IBM Plex Mono, monospace" }}>2.34%</div>
          <Progress value={23} className="h-1 mt-2" />
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground mb-1">Объём (24h)</div>
          <div className="text-xl font-bold" style={{ color: "var(--neon-orange)", fontFamily: "IBM Plex Mono, monospace" }}>$4.2M</div>
          <Progress value={67} className="h-1 mt-2" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-sm font-medium mb-3">Распределение сигналов</div>
        <div className="space-y-3">
          {[
            { label: "UP сигналы", value: 58, color: "var(--neon-green)" },
            { label: "DOWN сигналы", value: 42, color: "var(--neon-red)" },
            { label: "Нейтральные", value: 15, color: "#555" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-28">{item.label}</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${item.value}%`, background: item.color }} />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TabMetricsProps {
  accuracy: number;
  alerts: Alert[];
}

export function TabMetrics({ accuracy, alerts }: TabMetricsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Метрики модели</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Accuracy", value: `${accuracy}%`, sub: "за последние 24ч", neon: "var(--neon-cyan)" },
          { label: "Precision", value: "74.2%", sub: "точность сигналов", neon: "var(--neon-green)" },
          { label: "Recall", value: "68.9%", sub: "полнота", neon: "var(--neon-purple)" },
          { label: "F1 Score", value: "0.714", sub: "гармоническое среднее", neon: "var(--neon-orange)" },
          { label: "Sharpe Ratio", value: "1.84", sub: "риск/прибыль", neon: "var(--neon-cyan)" },
          { label: "Max Drawdown", value: "12.3%", sub: "макс. просадка", neon: "var(--neon-red)" },
        ].map((m) => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover-scale transition-transform animate-scale-in">
            <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
            <div className="text-2xl font-bold" style={{ color: m.neon, fontFamily: "IBM Plex Mono, monospace" }}>{m.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-sm font-medium mb-4">История точности (7 дней)</div>
        <div className="flex items-end gap-1 h-24">
          {[68, 72, 69, 75, 78, 74, accuracy].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t transition-all duration-500"
                style={{ height: `${v}%`, background: "rgba(0,245,255,0.2)", borderTop: "1px solid rgba(0,245,255,0.6)" }}
              />
              <span className="text-xs text-muted-foreground" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
            <span key={d} className="text-xs text-muted-foreground flex-1 text-center">{d}</span>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-sm font-medium mb-3">Журнал алертов</div>
        <div className="space-y-2">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{
                background: a.type === "critical" ? "rgba(255,55,95,0.05)" : "rgba(255,159,10,0.05)",
                border: a.type === "critical" ? "1px solid rgba(255,55,95,0.2)" : "1px solid rgba(255,159,10,0.2)",
              }}
            >
              <Icon
                name={a.type === "critical" ? "AlertOctagon" : "AlertTriangle"}
                size={14}
                style={{ color: a.type === "critical" ? "var(--neon-red)" : "var(--neon-orange)", marginTop: 2 }}
              />
              <div className="flex-1">
                <p className="text-xs">{a.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{a.time}</p>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Нет активных алертов</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface TabSettingsProps {
  modelActive: boolean;
  onModelActiveChange: (v: boolean) => void;
  autoTrade: boolean;
  onAutoTradeChange: (v: boolean) => void;
  soundAlerts: boolean;
  onSoundAlertsChange: (v: boolean) => void;
  alertThreshold: number[];
  onAlertThresholdChange: (v: number[]) => void;
  selectedExpiry: Expiry;
  onExpiryChange: (e: Expiry) => void;
}

export function TabSettings({
  modelActive, onModelActiveChange,
  autoTrade, onAutoTradeChange,
  soundAlerts, onSoundAlertsChange,
  alertThreshold, onAlertThresholdChange,
  selectedExpiry, onExpiryChange,
}: TabSettingsProps) {
  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-lg font-semibold">Настройки</h2>

      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Модель активна</div>
            <div className="text-xs text-muted-foreground">Генерация прогнозов в реальном времени</div>
          </div>
          <Switch checked={modelActive} onCheckedChange={onModelActiveChange} />
        </div>

        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Автоторговля</div>
            <div className="text-xs text-muted-foreground">Автоматически открывать сделки</div>
          </div>
          <Switch checked={autoTrade} onCheckedChange={onAutoTradeChange} />
        </div>

        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Звуковые алерты</div>
            <div className="text-xs text-muted-foreground">Уведомления при высокой уверенности</div>
          </div>
          <Switch checked={soundAlerts} onCheckedChange={onSoundAlertsChange} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium">Порог алерта</div>
            <div className="text-xs text-muted-foreground">Уверенность модели для уведомления</div>
          </div>
          <span className="font-bold text-lg" style={{ color: "var(--neon-cyan)", fontFamily: "IBM Plex Mono, monospace" }}>{alertThreshold[0]}%</span>
        </div>
        <Slider
          value={alertThreshold}
          onValueChange={onAlertThresholdChange}
          min={50}
          max={95}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">50%</span>
          <span className="text-xs text-muted-foreground">95%</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-sm font-medium mb-3">Время экспирации по умолчанию</div>
        <div className="grid grid-cols-4 gap-2">
          {(["30s", "1m", "3m", "5m"] as Expiry[]).map((e) => (
            <button
              key={e}
              onClick={() => onExpiryChange(e)}
              className="py-3 rounded-xl text-sm font-bold transition-all"
              style={selectedExpiry === e ? {
                background: "rgba(0,245,255,0.1)",
                border: "2px solid rgba(0,245,255,0.6)",
                color: "var(--neon-cyan)",
                fontFamily: "IBM Plex Mono, monospace",
                boxShadow: "0 0 20px rgba(0,245,255,0.3)",
              } : {
                border: "1px solid hsl(var(--border))",
                color: "#666",
                fontFamily: "IBM Plex Mono, monospace",
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl p-4" style={{ border: "1px solid rgba(191,90,242,0.3)", boxShadow: "0 0 20px rgba(191,90,242,0.15)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Brain" size={16} style={{ color: "var(--neon-purple)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--neon-purple)" }}>Параметры модели</span>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          {[
            { label: "Архитектура", val: "LSTM + Attention" },
            { label: "Обучающих данных", val: "2.4M свечей" },
            { label: "Последнее обновление", val: "21.02.2026" },
            { label: "Версия", val: "v2.1.0", highlight: true },
          ].map((row) => (
            <div key={row.label} className="flex justify-between">
              <span>{row.label}</span>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", color: row.highlight ? "var(--neon-purple)" : "inherit" }}>{row.val}</span>
            </div>
          ))}
        </div>
        <Button
          className="w-full mt-4 text-sm"
          style={{ background: "rgba(191,90,242,0.1)", border: "1px solid rgba(191,90,242,0.4)", color: "#c084fc" }}
        >
          <Icon name="RefreshCw" size={14} className="mr-2" />
          Переобучить модель
        </Button>
      </div>
    </div>
  );
}
