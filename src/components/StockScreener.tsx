import { useState } from 'react';
import { useStore, ScreenerRule } from '../store';
import { Filter, Play, Plus, Trash2, SlidersHorizontal } from 'lucide-react';

export default function StockScreener() {
  const { screenerRules, addScreenerRule, removeScreenerRule } = useStore();
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<{symbol: string, score: number}[]>([]);
  
  const [newIndicator, setNewIndicator] = useState('SMA20');
  const [newOperator, setNewOperator] = useState('>');
  const [newValue, setNewValue] = useState('SMA50');

  const handleAddRule = () => {
    addScreenerRule({
      id: Date.now().toString(),
      indicator: newIndicator,
      operator: newOperator,
      value: newValue
    });
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate a scan delay
    setTimeout(() => {
      // Mock results since real full-market scanning requires backend aggregation
      const mockResults = ['NVDA', 'AMD', 'PLTR', 'SMCI', 'TSLA'].map(sym => ({
        symbol: sym,
        score: Math.floor(Math.random() * 100)
      })).sort((a, b) => b.score - a.score);
      
      setResults(mockResults);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="bento-card h-full flex flex-col bg-slate-900 border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Filter size={14} /> Stock Screener
        </h2>
        <button 
          onClick={handleScan}
          disabled={isScanning || screenerRules.length === 0}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
            isScanning || screenerRules.length === 0 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30 hover:border-transparent'
          }`}
        >
          {isScanning ? (
            <span className="w-3 h-3 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          ) : (
            <Play size={12} />
          )}
          {isScanning ? 'SCANNING...' : 'RUN SCAN'}
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
        {/* Rules List */}
        <div className="space-y-2">
          {screenerRules.map(rule => (
            <div key={rule.id} className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded p-2 text-xs">
              <span className="text-blue-400 font-mono font-semibold">{rule.indicator}</span>
              <span className="text-slate-500 font-bold">{rule.operator}</span>
              <span className="text-emerald-400 font-mono">{rule.value}</span>
              <button 
                onClick={() => removeScreenerRule(rule.id)}
                className="ml-auto text-slate-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Rule Form */}
        <div className="flex gap-2 items-center bg-slate-800/30 p-2 rounded-lg border border-slate-700/50">
          <select 
            value={newIndicator}
            onChange={(e) => setNewIndicator(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded text-[10px] p-1.5 outline-none focus:border-emerald-500 font-mono text-slate-300"
          >
            <option value="PRICE">PRICE</option>
            <option value="SMA20">SMA (20)</option>
            <option value="SMA50">SMA (50)</option>
            <option value="RSI14">RSI (14)</option>
            <option value="MACD">MACD</option>
            <option value="VOLUME">VOLUME</option>
          </select>
          <select 
            value={newOperator}
            onChange={(e) => setNewOperator(e.target.value)}
            className="w-12 bg-slate-900 border border-slate-700 rounded text-xs p-1.5 outline-none focus:border-emerald-500 text-center font-bold text-slate-400"
          >
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value="=">=</option>
            <option value="CROSS_UP">x↑</option>
            <option value="CROSS_DN">x↓</option>
          </select>
          <input 
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded text-[10px] p-1.5 outline-none focus:border-emerald-500 font-mono text-slate-300 uppercase"
            placeholder="Value or Ind..."
          />
          <button 
            onClick={handleAddRule}
            className="bg-slate-700 hover:bg-slate-600 text-white p-1.5 rounded transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Scan Results */}
        <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar">
          {results.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                <SlidersHorizontal size={10} /> Scan Results ({results.length} matches)
              </div>
              {results.map((res, i) => (
                <div key={i} className="flex justify-between items-center p-2 text-xs rounded hover:bg-slate-800/50 group border border-transparent hover:border-slate-800 transition-colors">
                  <span className="font-bold tracking-wide text-slate-200">{res.symbol}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${res.score}%` }}></div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 w-6 text-right">{res.score}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
