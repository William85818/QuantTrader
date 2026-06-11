from abc import ABC, abstractmethod

class BaseStrategy(ABC):
    """
    策略基準類別
    所有具體的策略邏輯需繼承此類別。
    """
    def __init__(self, data):
        self.data = data  # 完整歷史資料 (DataFrame)
        self.signals = None

    @abstractmethod
    def generate_signals(self):
        """產生買賣訊號 (-1: 賣出, 0: 持平, 1: 買進)"""
        pass
