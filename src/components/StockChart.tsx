import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { getHistoricalBars, BarData } from '../api/alpacaService';
import { useStore } from '../store';
import { Maximize2, RefreshCw } from 'lucide-react';

export default function StockChart() {
  const { selectedSymbol, alpacaKeys } = useStore();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chartRef.current?.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.5)' },
        horzLines: { color: 'rgba(30, 41, 59, 0.5)' },
      },
      crosshair: {
        mode: 0, // Normal crosshair
        vertLine: {
          width: 1,
          color: '#475569',
          style: 3,
        },
        horzLine: {
          width: 1,
          color: '#475569',
          style: 3,
        },
      },
      timeScale: {
        borderColor: 'rgba(30, 41, 59, 0.5)',
      },
      rightPriceScale: {
        borderColor: 'rgba(30, 41, 59, 0.5)',
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!selectedSymbol) return;

    let active = true;
    const fetchAndRender = async () => {
      setLoading(true);
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 150); // Fetch last 150 days

      const bars = await getHistoricalBars(
        selectedSymbol,
        '1Day',
        start.toISOString(),
        end.toISOString(),
        alpacaKeys
      );

      if (active && seriesRef.current) {
        const formattedData = [...bars]
          .sort((a, b) => new Date(a.t).getTime() - new Date(b.t).getTime())
          .map(b => ({
            time: b.t.split('T')[0],
            open: b.o,
            high: b.h,
            low: b.l,
            close: b.c
          }));

        try {
          seriesRef.current.setData(formattedData);
          chartRef.current?.timeScale().fitContent();
        } catch(e) {
          console.error("Error setting candlestick data:", e);
        }
        setLoading(false);
      }
    };

    fetchAndRender();

    return () => { active = false; };
  }, [selectedSymbol, alpacaKeys]);

  return (
    <div className="bento-card h-full flex flex-col bg-slate-900 border-slate-800 p-0 overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-slate-800 bg-slate-900/80 z-10">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          {selectedSymbol ? (
            <>
              <span className="text-emerald-400 font-bold">{selectedSymbol}</span> 
              <span className="text-slate-500 font-mono text-[10px]">1D</span>
            </>
          ) : (
            <span className="text-slate-500">Select a symbol to view chart</span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {loading && <RefreshCw size={12} className="text-slate-500 animate-spin" />}
          <button className="text-slate-500 hover:text-slate-300 transition-colors">
            <Maximize2 size={12} />
          </button>
        </div>
      </div>
      <div 
        ref={chartContainerRef} 
        className="flex-1 w-full"
        style={{ minHeight: '300px' }}
      >
        {!selectedSymbol && (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">
            Waiting for selection...
          </div>
        )}
      </div>
    </div>
  );
}
