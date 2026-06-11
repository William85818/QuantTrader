import { useStore } from '../store';
import { ShieldCheck, AlertTriangle, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RiskControls() {
  const { riskControls, setRiskControls } = useStore();
  
  // Local state for editing before saving
  const [localControls, setLocalControls] = useState(riskControls);
  const [isChanged, setIsChanged] = useState(false);

  // Sync local state if global state changes externally
  useEffect(() => {
    setLocalControls(riskControls);
    setIsChanged(false);
  }, [riskControls]);

  const handleChange = (key: keyof typeof riskControls, value: number) => {
    setLocalControls(prev => ({ ...prev, [key]: value }));
    setIsChanged(true);
  };

  const handleSave = () => {
    setRiskControls(localControls);
    setIsChanged(false);
  };

  return (
    <div className="bento-card flex flex-col h-full bg-slate-900 border-slate-800">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck size={14} /> Risk Controls
        </h2>
        {isChanged && (
          <button 
            onClick={handleSave}
            className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900 px-2 py-1 rounded text-[10px] font-bold transition-colors border border-emerald-500/50"
          >
            <Save size={10} /> SAVE
          </button>
        )}
      </div>

      <div className="space-y-3 font-mono text-[11px] flex-1">
        
        <div className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded border border-slate-800 focus-within:border-slate-600 transition-colors">
          <label className="text-slate-500 flex justify-between">
            <span>MAX_POS_PCT</span>
            <span className="text-blue-400">{localControls.maxPosPct}%</span>
          </label>
          <input 
            type="range" 
            min="1" max="100" step="1"
            value={localControls.maxPosPct}
            onChange={(e) => handleChange('maxPosPct', parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded border border-slate-800 focus-within:border-slate-600 transition-colors">
          <label className="text-slate-500 flex justify-between">
            <span>DAILY_LOSS_LIMIT</span>
            <span className="text-red-400">{localControls.dailyLossLimit}%</span>
          </label>
          <input 
            type="range" 
            min="0.5" max="10" step="0.5"
            value={localControls.dailyLossLimit}
            onChange={(e) => handleChange('dailyLossLimit', parseFloat(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>

        <div className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded border border-slate-800 focus-within:border-slate-600 transition-colors">
          <label className="text-slate-500 flex justify-between">
            <span>MAX_DD_LIMIT</span>
            <span className="text-orange-400">{localControls.maxDrawdownLimit}%</span>
          </label>
          <input 
            type="range" 
            min="5" max="50" step="1"
            value={localControls.maxDrawdownLimit}
            onChange={(e) => handleChange('maxDrawdownLimit', parseFloat(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

      </div>

      <div className="mt-3 flex items-start gap-2 p-1.5 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] text-amber-300 italic">
        <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
        <span>These parameters are actively enforced during paper trading and live backtests.</span>
      </div>
    </div>
  );
}
