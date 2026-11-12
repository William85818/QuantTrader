# Expand Market Screener Filters

To match TradingView's level of condition filtering, we need to significantly expand both the Python backend data generator and the frontend UI options. 

## Open Questions

> [!IMPORTANT]
> **Operator Complexity**
> Currently, the screener supports `>`, `<`, and `=`. TradingView also supports `Crosses Above` (黃金交叉) and `Crosses Below` (死亡交叉). To support crossovers in the frontend without sending huge arrays of historical data, the Python script can calculate and include boolean flags (e.g., `sma20_cross_sma50_up: true`). 
> **Question**: Do you want me to implement specific crossover filters (e.g., MA Cross, MACD Cross), or are you satisfied with adding more absolute/relative value comparisons (e.g., `PRICE > SMA200`, `RSI < 30`)?

## Proposed Changes

### 1. Python Data Pipeline (`scripts/run_screener.py`)
I will upgrade the script to calculate and output a much wider array of technical and fundamental data points using `yfinance`:

**Technical Indicators**:
- **Moving Averages**: SMA (20, 50, 200), EMA (20, 50, 200)
- **Oscillators**: RSI (14), MACD (Line, Signal, Histogram), Stochastic (K, D)
- **Volatility & Bounds**: Bollinger Bands (Upper, Lower), ATR (14)
- **Price Action**: 52-Week High, 52-Week Low, VWAP
- **Volume**: Daily Volume, Average Volume (20, 50), Relative Volume (RVOL)

**Fundamental Data**:
- Market Cap, P/E Ratio, EPS, Dividend Yield, Sector.

### 2. Mock Data Update (`public/screener_data.json`)
I will update the mock JSON file so that the frontend can immediately test these new parameters without you having to run the Python script first.

### 3. Frontend UI (`src/components/StockScreener.tsx`)
- **Categorized Dropdowns**: Upgrade the indicator dropdown using `<optgroup>` to group metrics into `Price`, `Moving Averages`, `Oscillators`, `Volume`, and `Fundamentals` so it's not a huge messy list.
- **Support for Strings/Enums**: Allow filtering by Sector (e.g., `Sector = Technology`).
- **Dynamic Input**: If a fundamental or specific indicator is chosen, the input field will guide the user better.

## Verification Plan
1. Check that the new categorized dropdown appears in the UI.
2. Add a rule like `RSI14 < 30` and `MarketCap > 1000000000`.
3. Verify that the UI successfully filters the updated JSON data.
