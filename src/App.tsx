import { useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  ShieldCheck, 
  Play, 
  Settings,
  AlertTriangle,
  History
} from "lucide-react";
import { useStore } from "./store";
import { getHistoricalBars } from "./api/alpacaService";
import { runMACrossoverBacktest, BacktestResult } from "./engine/backtester";

import Watchlist from "./components/Watchlist";
import StockScreener from "./components/StockScreener";
import NewsWidget from "./components/NewsWidget";
import SettingsModal from "./components/SettingsModal";
import ChartComponent from "./components/ChartComponent";

export default function App() {
  const { setSettingsOpen, alpacaKeys, watchlist } = useStore();
  const [isRunning, setIsRunning] = useState(false);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);

  const handleRunBacktest = async () => {
    setIsRunning(true);
    // Use the first symbol in watchlist or default to AAPL
    const symbol = watchlist.length > 0 ? watchlist[0] : 'AAPL';
    
    // Fetch 100 days of historical data
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 100);
    
    const bars = await getHistoricalBars(
      symbol, 
      '1Day', 
      start.toISOString(), 
      end.toISOString(), 
      alpacaKeys
    );

    const result = runMACrossoverBacktest(bars, 10, 30, 100000);
    setBacktestResult(result);
    setIsRunning(false);
  };

  const metrics = backtestResult?.metrics || {
    totalReturn: 0,
    maxDrawdown: 0,
    winRate: 0,
    totalTrades: 0
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 flex flex-col gap-4 font-sans selection:bg-emerald-500/30">
      <SettingsModal />
      
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between bg-slate-900/50 border border-slate-800 rounded-xl p-4 gap-4">
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center font-bold text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            QT
          </motion.div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              QuantTrader <span className="text-emerald-500 text-sm font-mono ml-2">PRO</span>
            </h1>
            <p className="text-xs text-slate-400">Live Data & Backtest Engine Active</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400">
              {alpacaKeys?.keyId ? 'API CONNECTED' : 'LOCAL MODE'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4">
        
        {/* Left Sidebar: Watchlist */}
        <section className="lg:col-span-3 lg:row-span-6">
          <Watchlist />
        </section>

        {/* Center Top: Equity Curve & Backtest Chart */}
        <section className="lg:col-span-6 lg:row-span-4 bento-card bg-slate-900 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <TrendingUp size={14} /> Equity Curve
              </h2>
              <p className="text-[10px] text-slate-500 mt-1">
                Strategy: MA_CROSSOVER (10, 30) | Asset: {watchlist.length > 0 ? watchlist[0] : 'AAPL'}
              </p>
            </div>
          </div>
          
          <div className="flex-1 min-h-[200px] border border-slate-800/50 rounded-lg overflow-hidden bg-[#0f172a]/50">
            {backtestResult ? (
              <ChartComponent data={backtestResult.equityCurve} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">
                Click "Run Backtest" to generate curve
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar Top: Screener */}
        <section className="lg:col-span-3 lg:row-span-3">
          <StockScreener />
        </section>

        {/* Right Sidebar Bottom: Market News */}
        <section className="lg:col-span-3 lg:row-span-3">
          <NewsWidget />
        </section>

        {/* Center Bottom Left: Backtest Metrics */}
        <section className="lg:col-span-3 lg:row-span-2 bento-card flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <History size={14} /> Backtest Metrics
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-end border-b border-slate-800 pb-1">
              <span className="text-xs text-slate-500">Total Return</span>
              <span className={`text-xl font-bold ${metrics.totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {metrics.totalReturn > 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-end border-b border-slate-800 pb-1">
              <span className="text-xs text-slate-500">Max Drawdown</span>
              <span className="text-lg font-semibold text-red-400">
                -{metrics.maxDrawdown.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-end border-b border-slate-800 pb-1">
              <span className="text-xs text-slate-500">Win Rate</span>
              <span className="text-lg font-semibold text-slate-200">
                {metrics.winRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-slate-500">Total Trades</span>
              <span className="text-lg font-semibold text-slate-200">
                {metrics.totalTrades}
              </span>
            </div>
          </div>
        </section>

        {/* Center Bottom Right: Risk Controls */}
        <section className="lg:col-span-3 lg:row-span-2 bento-card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <ShieldCheck size={14} /> Risk Controls
          </h2>
          <div className="space-y-2 font-mono text-[11px]">
            {[
              { label: 'MAX_POS_PCT', val: '20.0%', color: 'text-blue-400' },
              { label: 'DAILY_LOSS_LIMIT', val: '3.0%', color: 'text-blue-400' },
              { label: 'MAX_DD_LIMIT', val: '15.0%', color: 'text-blue-400' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between p-1.5 bg-slate-950/50 rounded border border-slate-800">
                <span className="text-slate-500">{item.label}</span>
                <span className={item.color}>{item.val}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 p-1.5 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] text-amber-300 italic">
            <AlertTriangle size={12} className="text-amber-500 shrink-0" />
            <span>Paper Trading only. Do not deploy to production.</span>
          </div>
        </section>

      </main>

      {/* Footer Controls */}
      <footer className="mt-2 flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-widest px-2 py-3 bg-slate-900/40 rounded-lg border border-slate-800/50">
        <div className="flex gap-6">
          <span className="hidden sm:inline">React + Vite + Alpaca</span>
          <span className={alpacaKeys?.keyId ? "text-emerald-400" : "text-amber-400"}>
            {alpacaKeys?.keyId ? "Live Data Ready" : "Mock Data Mode"}
          </span>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setSettingsOpen(true)}
             className="flex items-center gap-1.5 hover:text-white transition-colors"
           >
             <Settings size={12} /> API Settings
           </button>
           <button 
             onClick={handleRunBacktest}
             disabled={isRunning}
             className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded transition-colors disabled:opacity-50"
           >
             {isRunning ? (
               <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
             ) : (
               <Play size={12} />
             )}
             {isRunning ? 'Running...' : 'Run Backtest'}
           </button>
        </div>
      </footer>
    </div>
  );
}
