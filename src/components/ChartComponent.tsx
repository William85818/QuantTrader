import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface ChartComponentProps {
  data: { time: string; value: number }[];
}

export default function ChartComponent({ data }: ChartComponentProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

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
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
      },
      crosshair: {
        vertLine: {
          color: '#10b981',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: '#10b981',
          width: 1,
          style: 3,
        },
      },
    });

    const areaSeries = chart.addAreaSeries({
      lineColor: '#10b981',
      topColor: 'rgba(16, 185, 129, 0.4)',
      bottomColor: 'rgba(16, 185, 129, 0.0)',
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = areaSeries;

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      // Sort data by time to prevent LightweightCharts error
      const sortedData = [...data].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      
      // Ensure time format is string 'YYYY-MM-DD'
      const formattedData = sortedData.map(d => ({
        time: d.time.split('T')[0],
        value: d.value
      }));
      
      try {
        seriesRef.current.setData(formattedData);
        chartRef.current?.timeScale().fitContent();
      } catch(e) {
        console.error('Error setting chart data:', e);
      }
    } else if (seriesRef.current) {
      seriesRef.current.setData([]);
    }
  }, [data]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-full"
      style={{ minHeight: '200px' }}
    />
  );
}
