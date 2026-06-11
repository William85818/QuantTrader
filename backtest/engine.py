import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
from monitor.logger import logger
from monitor.alert import alert_manager
from risk.risk_manager import RiskManager
from broker.paper_broker import PaperBroker
from backtest.metrics import calculate_metrics

class BacktestEngine:
    """
    回測引擎核心
    """
    def __init__(self, data, strategy_instance, initial_capital=1000000):
        self.data = data
        self.strategy = strategy_instance
        self.initial_capital = initial_capital
        
        self.broker = PaperBroker(initial_capital)
        self.risk_manager = RiskManager(initial_capital)
        
        self.equity_curve = []
        self.trade_logs = []
        self.daily_metrics = []

    def run(self):
        logger.info("開始執行回測...")
        alert_manager.send_alert("回測引擎啟動")
        
        # 1. 產生訊號
        signals = self.strategy.generate_signals()
        
        # 帳戶初始狀態清單
        highest_assets = self.initial_capital
        
        # 2. 模擬逐日線執行 (Iterative Backtest)
        for i in range(len(self.data)):
            date = self.data.index[i]
            bar = self.data.iloc[i]
            signal = signals.iloc[i]['signal']
            
            # --- 計算當前資產市值 ---
            current_cash = self.broker.get_cash()
            positions = self.broker.get_positions()
            stock_value = sum([qty * bar['close'] for sym, qty in positions.items()])
            total_assets = current_cash + stock_value
            
            # 更新最高資產 (計算回撤用)
            highest_assets = max(highest_assets, total_assets)
            mdd_pct = (highest_assets - total_assets) / highest_assets
            
            # 紀錄每日淨值
            self.equity_curve.append({
                'date': date,
                'cash': current_cash,
                'stock_value': stock_value,
                'total_assets': total_assets,
                'mdd_pct': mdd_pct
            })

            # --- 下單邏輯 ---
            symbol = "TW_STOCK" # 範例代號
            
            if signal == 1 and symbol not in positions: # 買進訊號且未持倉
                # 簡單策略：全倉買進 (需符合風控)
                available_order_val = total_assets * self.risk_manager.max_position_pct
                order_val = min(available_order_val, current_cash * 0.95, self.risk_manager.max_order_value)
                quantity = int(order_val / (bar['open'] * 1.01)) // 1000 * 1000 
                
                if quantity > 0:
                    if self.risk_manager.check_order(symbol, quantity, bar['open'], current_cash, total_assets, 0, mdd_pct):
                        if self.broker.submit_order(symbol, 'BUY', quantity, bar['open']):
                            self.trade_logs.append({'date': date, 'side': 'BUY', 'price': bar['open'], 'qty': quantity, 'value': quantity * bar['open']})
            
            elif signal == -1 and symbol in positions: # 賣出訊號且有持倉
                quantity = positions[symbol]
                if self.broker.submit_order(symbol, 'SELL', quantity, bar['open']):
                    self.trade_logs.append({'date': date, 'side': 'SELL', 'price': bar['open'], 'qty': quantity, 'value': quantity * bar['open']})

        logger.info("回測完成。")
        return self.get_summary()

    def get_summary(self):
        df_equity = pd.DataFrame(self.equity_curve).set_index('date')
        
        # 計算回測績效指標
        metrics = calculate_metrics(df_equity, self.trade_logs)
        
        # 繪圖
        self.plot_results(df_equity)
        
        return metrics

    def plot_results(self, df_equity):
        if not os.path.exists('reports'):
            os.makedirs('reports')
            
        plt.figure(figsize=(12, 8))
        
        # 子圖 1: 淨值曲線
        plt.subplot(2, 1, 1)
        plt.plot(df_equity.index, df_equity['total_assets'], label='Total Assets', color='blue')
        plt.title('Equity Curve')
        plt.legend()
        plt.grid(True)
        
        # 子圖 2: 回撤
        plt.subplot(2, 1, 2)
        plt.fill_between(df_equity.index, 0, -df_equity['mdd_pct'], color='red', alpha=0.3)
        plt.title('Drawdown (%)')
        plt.grid(True)
        
        plt.tight_layout()
        plt.savefig('reports/equity_curve.png')
        logger.info("圖表已存至 reports/equity_curve.png")
