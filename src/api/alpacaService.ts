import { AlpacaKeys } from '../store';

const getBaseUrl = (keys: AlpacaKeys) => 
  keys.isPaper ? 'https://paper-api.alpaca.markets' : 'https://api.alpaca.markets';

const getDataUrl = () => 'https://data.alpaca.markets';

const getHeaders = (keys: AlpacaKeys) => ({
  'APCA-API-KEY-ID': keys.keyId,
  'APCA-API-SECRET-KEY': keys.secretKey,
  'Accept': 'application/json'
});

export interface BarData {
  t: string; // timestamp
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
}

export interface QuoteData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface NewsArticle {
  id: number;
  headline: string;
  summary: string;
  url: string;
  created_at: string;
  source: string;
}

export async function getHistoricalBars(
  symbol: string, 
  timeframe: string, 
  start: string, 
  end: string, 
  keys: AlpacaKeys | null
): Promise<BarData[]> {
  if (!keys || !keys.keyId) return getMockBars();

  try {
    const url = new URL(`${getDataUrl()}/v2/stocks/${symbol}/bars`);
    url.searchParams.append('timeframe', timeframe);
    url.searchParams.append('start', start);
    url.searchParams.append('end', end);
    
    const response = await fetch(url.toString(), { headers: getHeaders(keys) });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    return data.bars || [];
  } catch (error) {
    console.error('Error fetching bars:', error);
    return getMockBars();
  }
}

export async function getLatestQuotes(symbols: string[], keys: AlpacaKeys | null): Promise<QuoteData[]> {
  if (!keys || !keys.keyId || symbols.length === 0) return getMockQuotes(symbols);

  try {
    const url = new URL(`${getDataUrl()}/v2/stocks/snapshots`);
    url.searchParams.append('symbols', symbols.join(','));
    
    const response = await fetch(url.toString(), { headers: getHeaders(keys) });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    return Object.entries(data).map(([symbol, snap]: [string, any]) => {
      const prevClose = snap.prevDailyBar?.c || snap.latestTrade?.p;
      const currentPrice = snap.latestTrade?.p || prevClose;
      const change = currentPrice - prevClose;
      const changePercent = (change / prevClose) * 100;
      
      return {
        symbol,
        price: currentPrice,
        change,
        changePercent
      };
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return getMockQuotes(symbols);
  }
}

export async function getNews(symbols: string[], keys: AlpacaKeys | null): Promise<NewsArticle[]> {
  if (!keys || !keys.keyId) return getMockNews();

  try {
    const url = new URL(`${getDataUrl()}/v1beta1/news`);
    if (symbols.length > 0) {
      url.searchParams.append('symbols', symbols.join(','));
    }
    url.searchParams.append('limit', '5');
    
    const response = await fetch(url.toString(), { headers: getHeaders(keys) });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    return data.news || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return getMockNews();
  }
}

// Fallback Mock Data if no API key is provided
function getMockBars(): BarData[] {
  const bars: BarData[] = [];
  let price = 150;
  const now = new Date();
  for (let i = 100; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    price = price + (Math.random() - 0.45) * 5;
    bars.push({
      t: date.toISOString(),
      o: price - Math.random() * 2,
      h: price + Math.random() * 3,
      l: price - Math.random() * 3,
      c: price,
      v: Math.floor(Math.random() * 1000000)
    });
  }
  return bars;
}

function getMockQuotes(symbols: string[]): QuoteData[] {
  return symbols.map(sym => ({
    symbol: sym,
    price: 150 + Math.random() * 100,
    change: (Math.random() - 0.5) * 10,
    changePercent: (Math.random() - 0.5) * 5
  }));
}

function getMockNews(): NewsArticle[] {
  return [
    {
      id: 1,
      headline: "Tech Stocks Rally on AI Optimism",
      summary: "Major tech companies see significant gains as AI adoption accelerates across enterprise sectors.",
      url: "#",
      created_at: new Date().toISOString(),
      source: "MarketWatch"
    },
    {
      id: 2,
      headline: "Fed Signals Potential Rate Cut in Q3",
      summary: "Central bank officials indicate inflation is cooling faster than expected.",
      url: "#",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      source: "Bloomberg"
    }
  ];
}
