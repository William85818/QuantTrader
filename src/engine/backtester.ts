import { BarData } from '../api/alpacaService';

export interface BacktestResult {
  equityCurve: { time: string; value: number }[];
  metrics: {
    totalReturn: number;
    maxDrawdown: number;
    winRate: number;
    totalTrades: number;
  };
}

// Helper to calculate Simple Moving Average
function calculateSMA(data: number[], period: number): number[] {
  const sma = new Array(data.length).fill(0);
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j];
    }
    sma[i] = sum / period;
  }
  return sma;
}

export function runMACrossoverBacktest(
  bars: BarData[],
  shortPeriod: number = 20,
  longPeriod: number = 50,
  initialCapital: number = 100000
): BacktestResult {
  if (bars.length < longPeriod) {
    return {
      equityCurve: [],
      metrics: { totalReturn: 0, maxDrawdown: 0, winRate: 0, totalTrades: 0 }
    };
  }

  const closes = bars.map(b => b.c);
  const shortSMA = calculateSMA(closes, shortPeriod);
  const longSMA = calculateSMA(closes, longPeriod);

  let capital = initialCapital;
  let position = 0;
  let entryPrice = 0;
  let maxEquity = initialCapital;
  let maxDrawdown = 0;
  let winningTrades = 0;
  let totalTrades = 0;

  const equityCurve: { time: string; value: number }[] = [];

  for (let i = longPeriod; i < bars.length; i++) {
    const currentPrice = bars[i].c;
    
    // Check for buy signal (Short crosses above Long)
    if (position === 0 && shortSMA[i-1] <= longSMA[i-1] && shortSMA[i] > longSMA[i]) {
      // Buy
      position = capital / currentPrice;
      capital = 0;
      entryPrice = currentPrice;
    }
    // Check for sell signal (Short crosses below Long)
    else if (position > 0 && shortSMA[i-1] >= longSMA[i-1] && shortSMA[i] < longSMA[i]) {
      // Sell
      capital = position * currentPrice;
      position = 0;
      totalTrades++;
      if (currentPrice > entryPrice) {
        winningTrades++;
      }
    }

    const currentEquity = capital + (position * currentPrice);
    
    // Update Drawdown
    if (currentEquity > maxEquity) {
      maxEquity = currentEquity;
    } else {
      const dd = (maxEquity - currentEquity) / maxEquity;
      if (dd > maxDrawdown) {
        maxDrawdown = dd;
      }
    }

    // TradingView lightweight-charts requires YYYY-MM-DD string format
    const formattedDate = new Date(bars[i].t).toISOString().split('T')[0];
    equityCurve.push({ time: formattedDate, value: currentEquity });
  }

  // Force close position at the end
  if (position > 0) {
    const currentPrice = bars[bars.length - 1].c;
    capital = position * currentPrice;
    totalTrades++;
    if (currentPrice > entryPrice) {
      winningTrades++;
    }
  }

  const totalReturn = ((capital - initialCapital) / initialCapital) * 100;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  return {
    equityCurve,
    metrics: {
      totalReturn,
      maxDrawdown: maxDrawdown * 100,
      winRate,
      totalTrades
    }
  };
}
