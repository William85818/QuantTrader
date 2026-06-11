import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AlpacaKeys {
  keyId: string;
  secretKey: string;
  isPaper: boolean;
}

export interface ScreenerRule {
  id: string;
  indicator: string; // e.g. 'SMA20', 'RSI', 'PRICE'
  operator: string;  // e.g. '>', '<', 'CROSS_ABOVE'
  value: string;     // e.g. 'SMA50', '30', '50.0'
}

export interface RiskControls {
  maxPosPct: number;
  dailyLossLimit: number;
  maxDrawdownLimit: number;
}

interface AppState {
  alpacaKeys: AlpacaKeys | null;
  setAlpacaKeys: (keys: AlpacaKeys) => void;
  
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  
  screenerRules: ScreenerRule[];
  addScreenerRule: (rule: ScreenerRule) => void;
  removeScreenerRule: (id: string) => void;
  
  isSettingsOpen: boolean;
  setSettingsOpen: (isOpen: boolean) => void;

  selectedSymbol: string | null;
  setSelectedSymbol: (symbol: string | null) => void;

  riskControls: RiskControls;
  setRiskControls: (controls: RiskControls) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      alpacaKeys: null,
      setAlpacaKeys: (keys) => set({ alpacaKeys: keys }),
      
      watchlist: ['AAPL', 'MSFT', 'TSLA', 'NVDA', 'SPY'],
      addToWatchlist: (symbol) => 
        set((state) => ({
          watchlist: state.watchlist.includes(symbol) 
            ? state.watchlist 
            : [...state.watchlist, symbol]
        })),
      removeFromWatchlist: (symbol) =>
        set((state) => ({
          watchlist: state.watchlist.filter(s => s !== symbol)
        })),
        
      screenerRules: [
        { id: '1', indicator: 'PRICE', operator: '>', value: 'SMA20' }
      ],
      addScreenerRule: (rule) =>
        set((state) => ({ screenerRules: [...state.screenerRules, rule] })),
      removeScreenerRule: (id) =>
        set((state) => ({ screenerRules: state.screenerRules.filter(r => r.id !== id) })),
        
      isSettingsOpen: false,
      setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),

      selectedSymbol: null,
      setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

      riskControls: {
        maxPosPct: 20.0,
        dailyLossLimit: 3.0,
        maxDrawdownLimit: 15.0,
      },
      setRiskControls: (controls) => set({ riskControls: controls }),
    }),
    {
      name: 'quant-trader-storage',
    }
  )
);
