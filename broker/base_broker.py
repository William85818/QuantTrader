from abc import ABC, abstractmethod

class BaseBroker(ABC):
    """
    經紀商介面
    所有券商 API 對接或模擬器都需繼承此類別。
    """
    @abstractmethod
    def submit_order(self, symbol, side, quantity, price):
        pass

    @abstractmethod
    def get_positions(self):
        pass

    @abstractmethod
    def get_cash(self):
        pass
