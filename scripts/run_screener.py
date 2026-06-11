import json
import os
from datetime import datetime, timedelta

try:
    import yfinance as yf
    import pandas as pd
    import numpy as np
except ImportError:
    print("Please install required packages: pip install yfinance pandas numpy")
    exit(1)

# A subset of popular tech stocks to scan
# In a real scenario, this could be the entire S&P 500
SYMBOLS = [
    "AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA", "TSM", 
    "AVGO", "ASML", "AMD", "QCOM", "TXN", "INTC", "AMAT", "PLTR", "SMCI"
]

def calculate_rsi(data, periods=14):
    close_delta = data['Close'].diff()
    up = close_delta.clip(lower=0)
    down = -1 * close_delta.clip(upper=0)
    ma_up = up.ewm(com=periods - 1, adjust=True, min_periods=periods).mean()
    ma_down = down.ewm(com=periods - 1, adjust=True, min_periods=periods).mean()
    rsi = ma_up / ma_down
    rsi = 100 - (100 / (1 + rsi))
    return rsi

def main():
    print(f"[{datetime.now()}] Starting Market Screener Data Generation...")
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=200) # Fetch enough data for 50/200 SMAs
    
    results = []
    
    for symbol in SYMBOLS:
        try:
            print(f"Fetching data for {symbol}...")
            ticker = yf.Ticker(symbol)
            df = ticker.history(start=start_date.strftime('%Y-%m-%d'), end=end_date.strftime('%Y-%m-%d'))
            
            if df.empty or len(df) < 50:
                print(f"Not enough data for {symbol}, skipping.")
                continue
                
            # Calculate Indicators
            current_price = float(df['Close'].iloc[-1])
            prev_price = float(df['Close'].iloc[-2])
            change_pct = ((current_price - prev_price) / prev_price) * 100
            
            sma20 = float(df['Close'].rolling(window=20).mean().iloc[-1])
            sma50 = float(df['Close'].rolling(window=50).mean().iloc[-1])
            
            df['RSI_14'] = calculate_rsi(df)
            rsi14 = float(df['RSI_14'].iloc[-1])
            
            # MACD (12, 26, 9)
            exp1 = df['Close'].ewm(span=12, adjust=False).mean()
            exp2 = df['Close'].ewm(span=26, adjust=False).mean()
            macd = exp1 - exp2
            signal = macd.ewm(span=9, adjust=False).mean()
            macd_hist = float((macd - signal).iloc[-1])
            
            # Volume
            avg_vol_20 = float(df['Volume'].rolling(window=20).mean().iloc[-1])
            current_vol = float(df['Volume'].iloc[-1])
            
            # Store Result
            results.append({
                "symbol": symbol,
                "price": round(current_price, 2),
                "changePct": round(change_pct, 2),
                "sma20": round(sma20, 2),
                "sma50": round(sma50, 2),
                "rsi14": round(rsi14, 2),
                "macdHist": round(macd_hist, 2),
                "volume": int(current_vol),
                "avgVol20": int(avg_vol_20),
                "updatedAt": end_date.strftime('%Y-%m-%d %H:%M:%S')
            })
            
        except Exception as e:
            print(f"Error processing {symbol}: {e}")
            
    # Output JSON file
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "screener_data.json")
    
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2)
        
    print(f"\nSuccessfully generated {len(results)} records to {output_path}")

if __name__ == "__main__":
    main()
