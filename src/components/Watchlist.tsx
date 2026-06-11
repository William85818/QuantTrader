import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { getLatestQuotes, QuoteData } from '../api/alpacaService';
import { List, X, Plus, TrendingUp, TrendingDown } from 'lucide-react';

export default function Watchlist() {
  const { watchlist, removeFromWatchlist, addToWatchlist, alpacaKeys } = useStore();
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchQuotes = async () => {
      if (watchlist.length === 0) return;
      setLoading(true);
      const data = await getLatestQuotes(watchlist, alpacaKeys);
      if (active) {
        setQuotes(data);
        setLoading(false);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60000); // refresh every minute

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [watchlist, alpacaKeys]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol && !watchlist.includes(newSymbol.toUpperCase())) {
      addToWatchlist(newSymbol.toUpperCase());
      setNewSymbol('');
    }
  };

  return (
    <div className="bento-card flex flex-col h-full bg-slate-900 border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <List size={14} /> Watchlist
        </h2>
        {loading && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Data"></span>}
      </div>

      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input 
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          placeholder="Add Symbol..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-xs focus:border-emerald-500 outline-none uppercase"
        />
        <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded transition-colors">
          <Plus size={14} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {watchlist.map(symbol => {
          const quote = quotes.find(q => q.symbol === symbol);
          const isPositive = quote && quote.change >= 0;
          
          return (
            <div key={symbol} className="flex justify-between items-center p-2 rounded hover:bg-slate-800/50 group border border-transparent hover:border-slate-800 transition-colors">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => removeFromWatchlist(symbol)}
                  className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                <span className="font-bold text-sm tracking-wide">{symbol}</span>
              </div>
              
              {quote ? (
                <div className="text-right">
                  <div className="text-sm font-mono">{quote.price.toFixed(2)}</div>
                  <div className={`text-[10px] flex items-center justify-end gap-1 font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {Math.abs(quote.changePercent).toFixed(2)}%
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-600 font-mono">Loading...</div>
              )}
            </div>
          );
        })}
        {watchlist.length === 0 && (
          <div className="text-xs text-slate-500 text-center mt-4">Watchlist is empty</div>
        )}
      </div>
    </div>
  );
}
