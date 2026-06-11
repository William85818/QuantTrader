import pandas as pd
import numpy as np
from strategies.base_strategy import BaseStrategy
from config import CONFIG

class MACrossStrategy(BaseStrategy):
    """
    均線交叉策略 (Moving Average Crossover)
    """
    def __init__(self, data):
        super().__init__(data)
        self.short_win = CONFIG['short_window']
        self.long_win = CONFIG['long_window']

    def generate_signals(self):
        df = self.data.copy()
        
        # 1. 計算均線
        df['ma_short'] = df['close'].rolling(window=self.short_win).mean()
        df['ma_long'] = df['close'].rolling(window=self.long_win).mean()
        
        # 2. 判斷黃金交叉與死亡交叉
        # 訊號：1 表示短期均線 > 長期均線，-1 表示短期均線 < 長期均線
        df['raw_signal'] = 0
        df.loc[df['ma_short'] > df['ma_long'], 'raw_signal'] = 1
        df.loc[df['ma_short'] < df['ma_long'], 'raw_signal'] = -1
        
        # 3. 為了避免 Look-ahead Bias，今天的訊號決定「隔天」的動作
        # 所以我們將訊號向後位移一格 (Shift 1)
        # 代表第 T 天看到交叉，第 T+1 天才進行交易
        df['signal'] = df['raw_signal'].shift(1).fillna(0)
        
        self.signals = df[['signal']]
        return self.signals
