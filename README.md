# QuantTrader PRO - 量化交易系統

[![Deploy](https://github.com/William85818/QuantTrader/actions/workflows/deploy.yml/badge.svg)](https://github.com/William85818/QuantTrader/actions)

🌐 **線上展示（Live Demo）：<https://william85818.github.io/QuantTrader/>**

📦 原始碼：<https://github.com/William85818/QuantTrader> ｜ 📝 開發紀錄：[DEVLOG.md](./DEVLOG.md)

QuantTrader 是一套結合 **React 前端儀表板** 與 **Python 量化引擎** 的模組化量化交易系統。
前端部署於 GitHub Pages，提供參考 TradingView 的「四步驟策略工作流」；
Python 端負責資料抓取、指標計算與日線回測，可在地端執行後將結果輸出給前端使用（Hybrid 架構）。

---

## 功能總覽

### 前端儀表板（四步驟工作流）
| 步驟 | 模組 | 說明 |
|------|------|------|
| 1 | **Market Screener** | 依價格、漲跌幅、SMA、RSI、MACD、成交量等條件篩選個股（資料來自 `public/screener_data.json`） |
| 2 | **Watchlist & Chart** | 類 TradingView 自選清單，點擊個股即顯示近 150 日 K 線走勢圖（lightweight-charts） |
| 3 | **Backtest** | 前端即時回測，繪製權益曲線與績效指標，可切換所選個股 |
| 4 | **Risk Controls** | 可直接在頁面上調整單一持倉上限、最大回撤、單日虧損等風控參數 |

另提供 **即時股價資訊**、**當日投資新聞** 與 **Pine-style Screener** 條件腳本功能。

### Python 量化引擎
- **模組化架構**：分離資料、策略、回測、風控、下單與監控（`backtest/`、`strategies/`、`risk/`、`broker/`、`monitor/`）。
- **避免 Look-ahead Bias**：策略訊號嚴格位移 (Shift 1)，訊號由昨日決定，今日開盤執行。
- **健全風控**：支援單一持倉上限、最大回撤控制、單日虧損限制。
- **擬真回測**：考慮手續費、證交稅與滑價。
- **地端篩選器**：`scripts/run_screener.py` 透過 `yfinance` 抓取真實行情並計算指標，輸出 JSON 給前端。

---

## 專案結構
```
QuantTrader/
├── src/                  # React 前端 (App.tsx, components/, engine/, api/, store.ts)
├── public/               # 靜態資源與 screener_data.json
├── scripts/              # run_screener.py：地端篩選資料產生器
├── backtest/ strategies/ risk/ broker/ monitor/ config/   # Python 量化模組
├── main_backtest.py      # Python 回測進入點
└── .github/workflows/    # GitHub Pages 自動部署
```

---

## 安裝與執行

### 前端（Node.js ≥ 20）
```bash
npm install
npm run dev        # 本機開發：http://localhost:3000/QuantTrader/
npm run build      # 產生 dist/ 靜態檔
```
推送至 `main` 分支後，GitHub Actions 會自動建置並部署到 GitHub Pages。

### Python（≥ 3.10）
```bash
pip install -r requirements.txt
pip install yfinance pandas numpy

# 1. 更新前端篩選器資料（輸出至 public/screener_data.json）
python scripts/run_screener.py

# 2. 執行日線回測
python main_backtest.py
```
回測結果：
- 控制台顯示基本績效。
- `reports/` 產生 `equity_curve.png` 與 `summary.json`。
- `logs/` 可查看詳細交易過程。

> 更新 `screener_data.json` 後 commit & push，線上頁面即會使用最新資料。

---

## 未來擴充
- Market Screener 擴充更多技術 / 基本面條件（均線交叉、布林通道、ATR、本益比、市值、產業別等）。
- 對接真實券商 API（如永豐 Shioaji、群益 API、Alpaca）。
- 支援 SQL 資料庫存取。
- 加入更多技術指標與 AI 模型策略。

## 免責聲明
本程式僅供量化交易開發與研究用途，不構成任何投資建議。投資有風險，回測效能不代表未來獲利保證。請務必在使用於實盤交易前經過詳盡測試與風險控管。
