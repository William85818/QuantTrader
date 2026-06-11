import numpy as np
import pandas as pd

def calculate_metrics(df_equity, trade_logs):
    """
    計算進階績效指標
    """
    if df_equity.empty:
        return {}

    # 報酬率
    daily_returns = df_equity['total_assets'].pct_change().dropna()
    total_return = (df_equity['total_assets'].iloc[-1] / df_equity['total_assets'].iloc[0]) - 1
    
    # 年化報酬率 (假設一年 252 個交易日)
    ann_return = (1 + total_return) ** (252 / len(df_equity)) - 1
    
    # 夏普比率 (假設無風險利率 0)
    sharpe = (daily_returns.mean() / daily_returns.std()) * np.sqrt(252) if daily_returns.std() != 0 else 0
    
    # 回撤
    mdd = df_equity['mdd_pct'].max()
    
    # 交易統計
    trades = pd.DataFrame(trade_logs)
    win_rate = 0
    profit_factor = 0
    
    if not trades.empty and len(trades) >= 2:
        # 簡單計算買賣對沖，這部分邏輯可以更複雜
        pass

    return {
        'Total Return (%)': round(total_return * 100, 2),
        'Annualized Return (%)': round(ann_return * 100, 2),
        'Max Drawdown (%)': round(mdd * 100, 2),
        'Sharpe Ratio': round(sharpe, 2),
        'Total Trades': len(trade_logs)
    }
