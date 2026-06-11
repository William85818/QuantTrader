import { motion } from "motion/react";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldCheck, 
  Terminal, 
  FolderTree, 
  Play, 
  Settings,
  AlertTriangle,
  History
} from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 flex flex-col gap-4 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between bg-slate-900/50 border border-slate-800 rounded-xl p-4 gap-4">
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center font-bold text-slate-950"
          >
            QT
          </motion.div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              QuantTrader MVP <span className="text-slate-500 text-sm font-mono ml-2">v1.0.0-alpha</span>
            </h1>
            <p className="text-xs text-slate-400">System Architecture: Modular Data & Backtest Pipeline</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-xs font-semibold text-red-400">TRADING: OFF</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400">RISK MGR: ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4">
        {/* Backtest Metrics */}
        <section className="md:col-span-4 md:row-span-3 bento-card flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <History size={14} /> Backtest Metrics
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs text-slate-500">Total Return</span>
              <span className="text-3xl font-bold text-emerald-400">+42.8%</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-slate-500">Max Drawdown</span>
              <span className="text-xl font-semibold text-red-400">-12.4%</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-slate-500">Sharpe Ratio</span>
              <span className="text-xl font-semibold">1.92</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-slate-500">Win Rate</span>
              <span className="text-xl font-semibold">58.2%</span>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-800 flex gap-2">
            <div className="flex-1 bg-slate-800/30 rounded p-2 text-center">
              <div className="text-[10px] text-slate-500 uppercase">Profit Factor</div>
              <div className="text-sm font-mono">2.15</div>
            </div>
            <div className="flex-1 bg-slate-800/30 rounded p-2 text-center">
              <div className="text-[10px] text-slate-500 uppercase">Avg Hold</div>
              <div className="text-sm font-mono">14.2d</div>
            </div>
          </div>
        </section>

        {/* Equity Curve */}
        <section className="md:col-span-8 md:row-span-4 bento-card bg-slate-900 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <TrendingUp size={14} /> Equity Curve
              </h2>
              <p className="text-[10px] text-slate-500">Strategy: MA_CROSSOVER (20, 60) | Asset: TAWIAN_EQUITY</p>
            </div>
            <div className="flex gap-2 text-[10px] text-slate-400 font-mono">
              <span>[1,000,000 TWD]</span>
              <span>—</span>
              <span className="text-emerald-400 text-xs font-bold">[1,428,000 TWD]</span>
            </div>
          </div>
          
          {/* Mock Chart Area */}
          <div className="flex-1 flex items-end gap-1.5 px-2 group">
            {[20, 25, 22, 35, 45, 40, 55, 65, 60, 75, 90, 85, 100].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="flex-1 bg-emerald-500/20 border-t-2 border-emerald-500/50 hover:bg-emerald-500/40 hover:border-emerald-400 transition-colors cursor-pointer"
              />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/30 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Total Trades</div>
              <div className="font-mono text-sm leading-tight mt-1">142</div>
            </div>
            <div className="bg-slate-800/30 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Avg Profit</div>
              <div className="font-mono text-sm text-emerald-400 leading-tight mt-1">+4.2%</div>
            </div>
            <div className="bg-slate-800/30 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Avg Loss</div>
              <div className="font-mono text-sm text-red-500 leading-tight mt-1">-2.1%</div>
            </div>
            <div className="bg-slate-800/30 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Commission</div>
              <div className="font-mono text-sm leading-tight mt-1">$8,420</div>
            </div>
          </div>
        </section>

        {/* Risk Controls */}
        <section className="md:col-span-4 md:row-span-3 bento-card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <ShieldCheck size={14} /> Risk Controls
          </h2>
          <div className="space-y-2.5 font-mono text-xs">
            {[
              { label: 'MAX_POS_PCT', val: '20.0%', color: 'text-blue-400' },
              { label: 'DAILY_LOSS_LIMIT', val: '3.0%', color: 'text-blue-400' },
              { label: 'MAX_DD_LIMIT', val: '15.0%', color: 'text-blue-400' },
              { label: 'ALLOW_TRADING', val: 'FALSE', color: 'text-red-400' },
              { label: 'SLIPPAGE_RATE', val: '0.05%', color: 'text-blue-400' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between p-2 bg-slate-950/50 rounded border border-slate-800 group hover:border-slate-700">
                <span className="text-slate-500">{item.label}</span>
                <span className={item.color}>{item.val}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] text-amber-300 italic">
            <AlertTriangle size={12} className="text-amber-500" />
            <span>Paper Trading only. Do not deploy to production.</span>
          </div>
        </section>

        {/* System Log */}
        <section className="md:col-span-5 md:row-span-2 bento-card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Terminal size={14} /> System Log
          </h2>
          <div className="font-mono text-[10px] space-y-1.5 overflow-hidden">
            <p className="text-slate-500">[2023-11-20 09:00] <span className="text-slate-300">INIT: Loading strategy...</span></p>
            <p className="text-slate-500">[2023-11-20 09:01] <span className="text-emerald-400 font-bold underline">SIGNAL: BUY 2330.TW (MA20 {">"} MA60)</span></p>
            <p className="text-slate-500">[2023-11-20 09:01] <span className="text-slate-300">RISK: Order allowed. Pos size: 15%</span></p>
            <p className="text-slate-500">[2023-11-20 09:01] <span className="text-blue-400 italic">BROKER: Simulating buy order at 580.0</span></p>
            <p className="text-slate-500">[2023-11-20 13:30] <span className="text-slate-300">MONITOR: Daily drawdown checks passed.</span></p>
          </div>
        </section>

        {/* Module Explorer */}
        <section className="md:col-span-3 md:row-span-2 bento-card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <FolderTree size={14} /> Module Explorer
          </h2>
          <div className="text-[11px] font-mono space-y-1">
            <div className="flex items-center gap-2 text-slate-500"><span>📂</span> <span>quant_trader/</span></div>
            <div className="flex items-center gap-2 pl-4 text-slate-400"><span>📁</span> <span>data/</span></div>
            <div className="flex items-center gap-2 pl-4 text-slate-400"><span>📁</span> <span>strategies/</span></div>
            <div className="flex items-center gap-2 pl-8 text-emerald-400 font-bold hover:underline cursor-pointer"><span>📄</span> <span>ma_cross.py</span></div>
            <div className="flex items-center gap-2 pl-4 text-slate-400"><span>📁</span> <span>backtest/</span></div>
            <div className="flex items-center gap-2 pl-4 text-slate-400"><span>📁</span> <span>risk/</span></div>
            <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-2 italic px-1">Compiled successfully: 12 modules</div>
          </div>
        </section>
      </main>

      {/* Footer Controls */}
      <footer className="mt-2 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-widest px-1">
        <div className="flex gap-4">
          <span>Server: localhost:3000</span>
          <span>Latency: 42ms</span>
          <span>Mode: BACKTEST_ITERATIVE</span>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-1 hover:text-slate-300 transition-colors">
             <Settings size={10} /> Config
           </button>
           <button className="flex items-center gap-1 text-emerald-500/80 hover:text-emerald-400 transition-colors">
             <Play size={10} /> Run Backtest
           </button>
        </div>
      </footer>
    </div>
  );
}
