# QuantTrader PRO - 4-Step Strategy Workflow

Based on the TradingView strategy concept, we have completely redesigned the QuantTrader UI into a highly visual **4-Step Funnel**, while also introducing a local Python data pipeline for full-market scanning.

## 1. Local Python Screener Pipeline (New!)

To bypass the browser's limitations of scanning thousands of stocks at once, we've implemented a **Hybrid Architecture**:
- You now have a Python script at `scripts/run_screener.py`. 
- By running this script locally (e.g., `python scripts/run_screener.py`), it automatically uses `yfinance` (completely free, no API keys needed) to download recent stock data, calculate complex indicators (RSI, MACD, SMAs, Volume), and generate a `public/screener_data.json` file.
- We have pre-populated a mock JSON file so your GitHub Pages site will work immediately, but you can run this script daily to update your live site!

## The 4-Step UI Layout

### Step 1: Market Screener (Top Left)
The screener now reads from the JSON data file.
- **Expanded Indicators**: You can now filter by `PRICE`, `SMA20`, `SMA50`, `RSI14`, `MACDHIST`, and `VOLUME`.
- **Action**: When the results appear, you can click the **View** button. This will automatically select the stock and add it to your Watchlist.

### Step 2: Watchlist (Bottom Left)
This acts as your "shortlist" of candidate stocks.
- Continues to show live Alpaca price updates (if keys are configured).
- Clicking a stock from the Screener automatically pushes it here.

### Step 3: Pine Strategy & Candlestick Charts (Center)
The entire center section is now dedicated to deep analysis of your **Selected Symbol**.
- **Interactive Candlestick Chart**: We upgraded the chart! It now automatically fetches 150 days of historical data for the selected symbol and displays a beautiful red/green Candlestick chart.
- **Pine Strategy Backtest**: Right below the chart is the Strategy runner. Click **Run Backtest** to execute the MA_CROSSOVER logic specifically on the selected stock, replacing the old generic run.

### Step 4: Signals & Risk Controls (Right)
- **Editable Risk Controls**: The top right now features interactive sliders! You can instantly adjust `MAX_POS_PCT`, `DAILY_LOSS_LIMIT`, and `MAX_DD_LIMIT`. Clicking **SAVE** locks these into your local storage.
- **Trading Signal Output**: Below the Backtest Metrics, we added a clear text signal block. Depending on the backtest performance, it will output a definitive **LONG [Symbol]** (Green) or **SHORT / AVOID** (Red) signal based on the results.

## Next Steps
I will push these changes to GitHub now. Once the Actions complete, your GitHub Pages will reflect the new 4-step workflow!
