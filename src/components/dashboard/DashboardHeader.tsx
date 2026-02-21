import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Tab, Alert, Prediction } from "./types";

interface DashboardHeaderProps {
  ticker: { price: number; change: number };
  modelActive: boolean;
  liveCount: number;
  alerts: Alert[];
  predictions: Prediction[];
  accuracy: number;
  activeTab: Tab;
  tabs: { key: Tab; label: string; icon: string }[];
  onTabChange: (tab: Tab) => void;
}

export default function DashboardHeader({
  ticker,
  modelActive,
  liveCount,
  alerts,
  predictions,
  accuracy,
  activeTab,
  tabs,
  onTabChange,
}: DashboardHeaderProps) {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-background/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.4)", boxShadow: "0 0 20px rgba(0,245,255,0.3)" }}>
            <Icon name="Brain" size={16} style={{ color: "var(--neon-cyan)" }} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">PocketAI</h1>
            <p className="text-xs text-muted-foreground">ML прогнозирование</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center hidden sm:block">
            <div className="text-lg font-bold" style={{ color: "var(--neon-cyan)", fontFamily: "IBM Plex Mono, monospace" }}>{ticker.price}</div>
            <div className="text-xs" style={{ color: ticker.change >= 0 ? "var(--neon-green)" : "var(--neon-red)", fontFamily: "IBM Plex Mono, monospace" }}>
              {ticker.change >= 0 ? "+" : ""}{ticker.change}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${modelActive ? "animate-pulse" : ""}`} style={{ background: modelActive ? "var(--neon-green)" : "#666" }} />
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {modelActive ? "Модель активна" : "Пауза"}
            </span>
          </div>

          <Badge variant="outline" className="text-xs hidden sm:flex" style={{ borderColor: "rgba(0,245,255,0.4)", color: "var(--neon-cyan)", fontFamily: "IBM Plex Mono, monospace" }}>
            {liveCount} обновлений
          </Badge>
        </div>
      </header>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div className="px-6 py-2 flex items-center gap-3 text-sm animate-fade-in" style={{
          background: alerts[0].type === "critical" ? "rgba(255,55,95,0.08)" : "rgba(255,159,10,0.08)",
          borderBottom: alerts[0].type === "critical" ? "1px solid rgba(255,55,95,0.3)" : "1px solid rgba(255,159,10,0.3)"
        }}>
          <Icon name="AlertTriangle" size={14} style={{ color: alerts[0].type === "critical" ? "var(--neon-red)" : "var(--neon-orange)" }} />
          <span style={{ color: alerts[0].type === "critical" ? "var(--neon-red)" : "var(--neon-orange)" }}>{alerts[0].message}</span>
          <span className="text-muted-foreground ml-auto text-xs" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{alerts[0].time}</span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-4">
        {[
          { label: "Точность", value: `${accuracy}%`, icon: "Target", neon: "var(--neon-cyan)", glow: "rgba(0,245,255,0.3)" },
          { label: "Сигналов сегодня", value: predictions.length.toString(), icon: "Zap", neon: "var(--neon-purple)", glow: "rgba(191,90,242,0.3)" },
          { label: "Win Rate", value: `${accuracy}%`, icon: "Trophy", neon: "var(--neon-green)", glow: "rgba(48,209,88,0.3)" },
          { label: "Алертов", value: alerts.length.toString(), icon: "Bell", neon: "var(--neon-orange)", glow: "" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4 hover-scale transition-transform"
            style={stat.glow ? { boxShadow: `0 0 20px ${stat.glow}` } : {}}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <Icon name={stat.icon} fallback="CircleAlert" size={14} style={{ color: stat.neon }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: stat.neon, fontFamily: "IBM Plex Mono, monospace" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-1 rounded-xl p-1 w-fit" style={{ background: "rgba(255,255,255,0.04)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={activeTab === tab.key ? {
                background: "hsl(var(--card))",
                border: "1px solid rgba(0,245,255,0.4)",
                color: "var(--neon-cyan)",
              } : { color: "#666" }}
            >
              <Icon name={tab.icon} fallback="CircleAlert" size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
