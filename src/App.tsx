import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Play, 
  Settings,
  History,
  Code
} from "lucide-react";
import { useStore } from "./store";
import { getHistoricalBars } from "./api/alpacaService";
import { runMACrossoverBacktest, BacktestResult } from "./engine/backtester";

import Watchlist from "./components/Watchlist";
import StockScreener from "./components/StockScreener";
import SettingsModal from "./components/SettingsModal";
import ChartComponent from "./components/ChartComponent";
import StockChart from "./components/StockChart";
import RiskControls from "./components/RiskControls";

export default function App() {
  const { setSettingsOpen, alpacaKeys, selectedSymbol } = useStore();
  const [isRunning, setIsRunning] = useState(false);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);

  const handleRunBacktest = async () => {
    if (!selectedSymbol) return;
    setIsRunning(true);
    
    // Fetch 100 days of historical data for the selected symbol
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 100);
    
    const bars = await getHistoricalBars(
      selectedSymbol, 
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
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 flex flex-col gap-4 font-sans selection:bg-emerald-500/30">
      <SettingsModal />
      
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between bg-slate-900/50 border border-slate-800 rounded-xl p-3 gap-4">
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
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Strategy Workflow Dashboard</p>
          </div>
        </div>
        
        {/* Step Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <span className="text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">1. SCREEN</span>
          <span>→</span>
          <span className="text-blue-400 border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded">2. WATCHLIST</span>
          <span>→</span>
          <span className="text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded">3. PINE STRATEGY</span>
          <span>→</span>
          <span className="text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded">4. SIGNALS</span>
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

      {/* Main Grid - 4 Step Workflow */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4">
        
        {/* Left Column (Steps 1 & 2) */}
        <section className="lg:col-span-3 lg:row-span-6 flex flex-col gap-4">
          <div className="flex-1 overflow-hidden">
            <StockScreener />
          </div>
          <div className="flex-1 overflow-hidden">
            <Watchlist />
          </div>
        </section>

        {/* Center Column (Step 3: Strategy & Chart) */}
        <section className="lg:col-span-6 lg:row-span-6 flex flex-col gap-4">
          {/* Top: Candlestick Chart */}
          <div className="flex-1 overflow-hidden">
            <StockChart />
          </div>

          {/* Bottom: Pine Screener / Backtesting Engine */}
          <div className="h-[280px] bento-card bg-slate-900 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Code size={14} /> Pine Strategy Backtest
                </h2>
                <p className="text-[10px] text-slate-500 mt-1">
                  Strategy: MA_CROSSOVER (10, 30) | Target: {selectedSymbol || 'None'}
                </p>
              </div>
              <button 
                onClick={handleRunBacktest}
                disabled={isRunning || !selectedSymbol}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded transition-colors disabled:opacity-50"
              >
                {isRunning ? (
                  <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                ) : (
                  <Play size={12} />
                )}
                {isRunning ? 'RUNNING...' : 'RUN BACKTEST'}
              </button>
            </div>
            
            <div className="flex-1 border border-slate-800/50 rounded-lg overflow-hidden bg-[#0f172a]/50">
              {backtestResult ? (
                <ChartComponent data={backtestResult.equityCurve} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 text-sm gap-2">
                  <TrendingUp size={24} className="opacity-50" />
                  <span>Select a symbol and click "Run Backtest" to generate curve</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column (Step 4: Signals & Risk) */}
        <section className="lg:col-span-3 lg:row-span-6 flex flex-col gap-4">
          
          <div className="flex-none h-[280px]">
            <RiskControls />
          </div>

          <div className="flex-1 bento-card flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <History size={14} /> Backtest Metrics
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-500">Total Return</span>
                <span className={`text-2xl font-bold ${metrics.totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metrics.totalReturn > 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-500">Max Drawdown</span>
                <span className="text-xl font-semibold text-red-400">
                  -{metrics.maxDrawdown.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-500">Win Rate</span>
                <span className="text-xl font-semibold text-slate-200">
                  {metrics.winRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500">Total Trades</span>
                <span className="text-xl font-semibold text-slate-200">
                  {metrics.totalTrades}
                </span>
              </div>
            </div>
            
            {/* Final Signal Output */}
            <div className="mt-4 p-3 bg-slate-950/50 rounded-lg border border-slate-800 text-center">
               <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Trading Signal</span>
               {backtestResult && backtestResult.metrics.totalReturn > 0 ? (
                 <span className="text-lg font-bold text-emerald-400">LONG {selectedSymbol}</span>
               ) : backtestResult && backtestResult.metrics.totalReturn < 0 ? (
                 <span className="text-lg font-bold text-red-400">SHORT / AVOID</span>
               ) : (
                 <span className="text-sm text-slate-600">WAITING FOR SIGNAL</span>
               )}
            </div>
          </div>
        </section>

      </main>

      {/* Footer Controls */}
      <footer className="mt-2 flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-widest px-2 py-3 bg-slate-900/40 rounded-lg border border-slate-800/50">
        <div className="flex gap-6">
          <span className="hidden sm:inline">React + Vite + Python Pipeline</span>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setSettingsOpen(true)}
             className="flex items-center gap-1.5 hover:text-white transition-colors"
           >
             <Settings size={12} /> API Settings
           </button>
        </div>
      </footer>
    </div>
  );
}
