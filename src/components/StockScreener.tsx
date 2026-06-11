import { useState } from 'react';
import { useStore, ScreenerRule } from '../store';
import { Filter, Play, Plus, Trash2, SlidersHorizontal, Eye } from 'lucide-react';

export default function StockScreener() {
  const { screenerRules, addScreenerRule, removeScreenerRule, setSelectedSymbol, addToWatchlist } = useStore();
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [scannedAt, setScannedAt] = useState<string | null>(null);
  
  const [newIndicator, setNewIndicator] = useState('PRICE');
  const [newOperator, setNewOperator] = useState('>');
  const [newValue, setNewValue] = useState('SMA20');

  const handleAddRule = () => {
    addScreenerRule({
      id: Date.now().toString(),
      indicator: newIndicator,
      operator: newOperator,
      value: newValue
    });
  };

  const evaluateRule = (stock: any, rule: ScreenerRule) => {
    const leftValue = stock[rule.indicator.toLowerCase()] ?? stock[rule.indicator];
    if (leftValue === undefined) return false;

    // Check if right side is a number or another indicator
    let rightValue = Number(rule.value);
    if (isNaN(rightValue)) {
      // It's another indicator string (e.g. SMA50)
      rightValue = stock[rule.value.toLowerCase()] ?? stock[rule.value];
      if (rightValue === undefined) return false;
    }

    switch (rule.operator) {
      case '>': return leftValue > rightValue;
      case '<': return leftValue < rightValue;
      case '=': return leftValue === rightValue;
      default: return false; // Cross up/down requires historical data array, skipped for simplicity
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    try {
      // Fetch the generated data from our python script
      const res = await fetch('/QuantTrader/screener_data.json').catch(() => fetch('/screener_data.json'));
      const data = await res.json();
      
      const filtered = data.filter((stock: any) => {
        // Must pass all rules
        return screenerRules.every(rule => evaluateRule(stock, rule));
      });

      setResults(filtered);
      if (data.length > 0) {
        setScannedAt(data[0].updatedAt);
      }
    } catch (e) {
      console.error("Failed to fetch screener data", e);
    }
    setIsScanning(false);
  };

  const handleSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    addToWatchlist(symbol);
  };

  return (
    <div className="bento-card h-full flex flex-col bg-slate-900 border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Filter size={14} /> Market Screener
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
            <option value="MACDHIST">MACD Hist</option>
            <option value="VOLUME">VOLUME</option>
          </select>
          <select 
            value={newOperator}
            onChange={(e) => setNewOperator(e.target.value)}
            className="w-10 bg-slate-900 border border-slate-700 rounded text-xs p-1.5 outline-none focus:border-emerald-500 text-center font-bold text-slate-400"
          >
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value="=">=</option>
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
        <div className="mt-2 flex-1 overflow-y-auto custom-scrollbar">
          {results.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 flex justify-between items-center">
                <span className="flex items-center gap-1"><SlidersHorizontal size={10} /> {results.length} matches found</span>
                {scannedAt && <span>Data: {scannedAt}</span>}
              </div>
              {results.map((res, i) => (
                <div key={i} className="flex justify-between items-center p-2 text-xs rounded hover:bg-slate-800/50 group border border-slate-800/50 hover:border-slate-700 transition-colors bg-slate-950/30">
                  <div className="flex flex-col">
                    <span className="font-bold tracking-wide text-emerald-400">{res.symbol}</span>
                    <span className="text-[9px] text-slate-500 font-mono">${res.price} ({res.changePct}%)</span>
                  </div>
                  <button 
                    onClick={() => handleSelect(res.symbol)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300 transition-colors"
                  >
                    <Eye size={10} /> View
                  </button>
                </div>
              ))}
            </div>
          )}
          {results.length === 0 && !isScanning && scannedAt && (
             <div className="text-xs text-slate-500 text-center mt-4">No stocks matched your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
}
