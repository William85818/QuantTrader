import { useState } from 'react';
import { useStore } from '../store';
import { X, Save, Key, ShieldAlert } from 'lucide-react';

export default function SettingsModal() {
  const { isSettingsOpen, setSettingsOpen, alpacaKeys, setAlpacaKeys } = useStore();
  const [keyId, setKeyId] = useState(alpacaKeys?.keyId || '');
  const [secretKey, setSecretKey] = useState(alpacaKeys?.secretKey || '');
  const [isPaper, setIsPaper] = useState(alpacaKeys?.isPaper ?? true);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    setAlpacaKeys({ keyId, secretKey, isPaper });
    setSettingsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Key size={18} className="text-emerald-400" /> API Settings
          </h2>
          <button onClick={() => setSettingsOpen(false)} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex gap-3 text-sm text-amber-200">
            <ShieldAlert size={20} className="shrink-0 text-amber-400" />
            <p>Your API keys are stored securely in your browser's local storage and are never sent to our servers.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Alpaca API Key ID
            </label>
            <input 
              type="text" 
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              placeholder="PK..."
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Alpaca Secret Key
            </label>
            <input 
              type="password" 
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-slate-200"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="paper-trading"
              checked={isPaper}
              onChange={(e) => setIsPaper(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
            />
            <label htmlFor="paper-trading" className="text-sm text-slate-300">
              Use Paper Trading Account
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-end gap-3">
          <button 
            onClick={() => setSettingsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded flex items-center gap-2 transition-colors"
          >
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
