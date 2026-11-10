# 開發紀錄 (DEVLOG)

🌐 線上展示：<https://william85818.github.io/QuantTrader/>

依時間由新到舊記錄 QuantTrader 的主要開發歷程。

---

## 2026-11-10 — 文件更新
- README 首頁加入 GitHub Pages 線上網址與部署狀態徽章。
- 重寫 README 說明：補充前端四步驟工作流、Python 量化引擎、專案結構與安裝流程。
- 新增本開發紀錄 `DEVLOG.md`。

## 2026-06-11 — 規劃：擴充 Market Screener 篩選條件（待實作）
- 回饋：Market Screener 條件篩選不足。
- 規劃參考 TradingView，擴充 Python 端指標與前端分類式條件選單：
  - 均線：SMA / EMA（多週期）、均線交叉訊號
  - 動能：RSI、MACD、Stochastic
  - 波動：Bollinger Bands、ATR
  - 量能 / 趨勢：相對成交量、VWAP、52 週高低點
  - 基本面：市值、本益比、EPS、殖利率、產業類別
- 待決定：交叉訊號由 Python 端預先計算為布林值，或先專注於數值比較條件。

## 2026-06-11 — 四步驟工作流、K 線圖、風控設定、Python 篩選器 (`c19ab31`)
- 版面依「篩選 → 自選 / 走勢 → 回測 → 風控」四流程重新配置。
- 新增 K 線走勢圖：從 Watchlist / Screener 點選個股即載入近 150 日走勢，回測同步切換標的。
- 實作 Risk Controls 設定面板，可於頁面上即時調整風控參數。
- 新增 `scripts/run_screener.py`：地端以 `yfinance` 抓取真實行情，計算 SMA20/50、RSI14、MACD Histogram、成交量等，輸出 `public/screener_data.json`（Hybrid 架構：Python 地端計算、前端讀取）。

## 2026-06-11 — 進階交易介面 (`f536cec`)
- 移除 Module Explorer。
- 新增 Stock Screener、即時股價資訊、當日投資新聞、TradingView 風格 Watchlist、Pine-style Screener。
- 新增前端回測引擎，可繪製權益曲線。

## 2026-06-11 — GitHub Actions 部署修正 (`5e20544`, `6e1666e`)
- 修正 `Dependencies lock file is not found` 錯誤（調整 setup-node 快取設定）。
- 移除 `configure-pages` 步驟，並處理 Node.js 20 Actions 棄用警告。

## 2026-06-11 — GitHub Pages 最佳化 (`6f239d7`)
- 設定 Vite `base: '/QuantTrader/'`，建立 GitHub Pages 自動部署流程。

## 初始版本 — Python 量化交易 MVP
- 建立模組化架構：資料、策略、回測、風控、下單、監控。
- 台股日線波段回測，含手續費、證交稅、滑價，訊號 Shift 1 避免 Look-ahead Bias。
