import { useState, useEffect, useRef } from "react";
import { Tab, Expiry, Prediction, Alert, generatePrediction, generateChartData } from "@/components/dashboard/types";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { TabPredictions, TabCharts, TabMetrics, TabSettings } from "@/components/dashboard/DashboardTabs";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "predictions", label: "Прогнозы", icon: "Zap" },
  { key: "charts", label: "Графики", icon: "TrendingUp" },
  { key: "metrics", label: "Метрики", icon: "BarChart2" },
  { key: "settings", label: "Настройки", icon: "Settings" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("predictions");
  const [predictions, setPredictions] = useState<Prediction[]>(() =>
    Array.from({ length: 6 }, (_, i) => generatePrediction(i + 1))
  );
  const [chartData, setChartData] = useState(generateChartData);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, message: "BTC/USD — уверенность 91%! Рекомендован сигнал UP", type: "high", time: "14:32:01" },
    { id: 2, message: "Точность модели упала ниже 70% — проверьте данные", type: "critical", time: "14:30:44" },
  ]);
  const [selectedExpiry, setSelectedExpiry] = useState<Expiry>("1m");
  const [alertThreshold, setAlertThreshold] = useState([80]);
  const [autoTrade, setAutoTrade] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [modelActive, setModelActive] = useState(true);
  const [ticker, setTicker] = useState({ price: 1.0852, change: +0.0023 });
  const [liveCount, setLiveCount] = useState(0);
  const nextId = useRef(10);

  useEffect(() => {
    if (!modelActive) return;
    const interval = setInterval(() => {
      setChartData((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(10, Math.min(90, last + (Math.random() - 0.48) * 4));
        return [...prev.slice(1), next];
      });
      setTicker((prev) => ({
        price: +(prev.price + (Math.random() - 0.5) * 0.001).toFixed(4),
        change: +(prev.change + (Math.random() - 0.5) * 0.0005).toFixed(4),
      }));
      setLiveCount((c) => c + 1);

      if (Math.random() > 0.7) {
        const p = generatePrediction(nextId.current++);
        setPredictions((prev) => [p, ...prev.slice(0, 9)]);
        if (p.confidence >= alertThreshold[0]) {
          setAlerts((prev) => [
            {
              id: Date.now(),
              message: `${p.pair} — уверенность ${p.confidence}%! Сигнал ${p.direction}`,
              type: p.confidence >= 90 ? "critical" : "high",
              time: new Date().toLocaleTimeString("ru-RU"),
            },
            ...prev.slice(0, 4),
          ]);
        }
      }
    }, 1800);
    return () => clearInterval(interval);
  }, [modelActive, alertThreshold]);

  const donePreds = predictions.filter((p) => p.result !== "PENDING");
  const accuracy = donePreds.length
    ? Math.round((donePreds.filter((p) => p.result === "WIN").length / donePreds.length) * 100)
    : 72;

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <DashboardHeader
        ticker={ticker}
        modelActive={modelActive}
        liveCount={liveCount}
        alerts={alerts}
        predictions={predictions}
        accuracy={accuracy}
        activeTab={activeTab}
        tabs={TABS}
        onTabChange={setActiveTab}
      />

      <div className="px-6 pb-8 animate-fade-in" key={activeTab}>
        {activeTab === "predictions" && (
          <TabPredictions
            predictions={predictions}
            selectedExpiry={selectedExpiry}
            onExpiryChange={setSelectedExpiry}
          />
        )}
        {activeTab === "charts" && (
          <TabCharts
            ticker={ticker}
            chartData={chartData}
          />
        )}
        {activeTab === "metrics" && (
          <TabMetrics
            accuracy={accuracy}
            alerts={alerts}
          />
        )}
        {activeTab === "settings" && (
          <TabSettings
            modelActive={modelActive}
            onModelActiveChange={setModelActive}
            autoTrade={autoTrade}
            onAutoTradeChange={setAutoTrade}
            soundAlerts={soundAlerts}
            onSoundAlertsChange={setSoundAlerts}
            alertThreshold={alertThreshold}
            onAlertThresholdChange={setAlertThreshold}
            selectedExpiry={selectedExpiry}
            onExpiryChange={setSelectedExpiry}
          />
        )}
      </div>
    </div>
  );
}
