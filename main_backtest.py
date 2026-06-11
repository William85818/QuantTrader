import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from strategies.ma_cross import MACrossStrategy
from backtest.engine import BacktestEngine
from monitor.logger import logger
from config import CONFIG
import json
import os

def prepare_sample_data():
    """
    產生模擬價格資料用於測試
    """
    logger.info("準備測試用價格資料...")
    dates = pd.date_range(start='2020-01-01', end='2023-12-31', freq='B')
    
    # 產生隨機走勢 (隨機漫步)
    np.random.seed(42)
    returns = np.random.normal(loc=0.0005, scale=0.015, size=len(dates))
    price = 100 * (1 + returns).cumsum()
    
    df = pd.DataFrame({
        'open': price * (1 + np.random.normal(0, 0.002, len(dates))),
        'high': price * (1 + abs(np.random.normal(0, 0.005, len(dates)))),
        'low': price * (1 - abs(np.random.normal(0, 0.005, len(dates)))),
        'close': price,
        'volume': np.random.randint(1000, 10000, size=len(dates)) * 1000
    }, index=dates)
    
    if not os.path.exists('data/raw'):
        os.makedirs('data/raw')
    
    df.to_csv('data/raw/price.csv')
    logger.info("測試資料已存至 data/raw/price.csv")
    return df

def main():
    logger.info("===== 量化交易系統 MVP 啟動 =====")
    
    # 1. 載入資料
    csv_path = 'data/raw/price.csv'
    if not os.path.exists(csv_path):
        data = prepare_sample_data()
    else:
        data = pd.read_csv(csv_path, index_col=0, parse_dates=True)
        logger.info(f"成功載入資料: {csv_path}, 共 {len(data)} 筆筆紀錄")

    # 2. 初始化策略
    strategy = MACrossStrategy(data)
    
    # 3. 初始化回測引擎並執行
    engine = BacktestEngine(data, strategy, initial_capital=CONFIG['initial_capital'])
    results = engine.run()
    
    # 4. 輸出統計結果
    print("\n" + "="*30)
    print("      回測績效報告")
    print("="*30)
    for key, val in results.items():
        print(f"{key}: {val}")
    print("="*30)
    
    # 存檔 JSON 報表
    with open('reports/summary.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=4)
    
    logger.info("回測任務順利完成。")

if __name__ == "__main__":
    main()
