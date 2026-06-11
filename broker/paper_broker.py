from broker.base_broker import BaseBroker
from monitor.logger import logger
from config import CONFIG

class PaperBroker(BaseBroker):
    """
    模擬經紀商 (Paper Trading / Backtest Engine Use)
    """
    def __init__(self, initial_cash):
        self.cash = initial_cash
        self.positions = {}  # {symbol: quantity}
        
        # 成本參數
        self.fee_rate = CONFIG['fee_rate']
        self.fee_discount = CONFIG['fee_discount']
        self.tax_rate = CONFIG['tax_rate']
        self.slippage_rate = CONFIG['slippage_rate']

    def calculate_cost(self, side, value):
        """計算交易成本"""
        # 手續費 (買賣皆收)
        fee = value * self.fee_rate * self.fee_discount
        # 證交稅 (賣出才收)
        tax = value * self.tax_rate if side == 'SELL' else 0
        # 滑價成本 (買進買貴，賣出賣便宜)
        slippage = value * self.slippage_rate
        return fee, tax, slippage

    def submit_order(self, symbol, side, quantity, price):
        """執行模擬成交"""
        if side == 'BUY':
            exec_price = price * (1 + self.slippage_rate)
            raw_value = quantity * exec_price
            fee, tax, slippage = self.calculate_cost('BUY', raw_value)
            total_cost = raw_value + fee + slippage
            
            if self.cash >= total_cost:
                self.cash -= total_cost
                self.positions[symbol] = self.positions.get(symbol, 0) + quantity
                logger.info(f"[EXEC] BUY {symbol}, Qty: {quantity}, Price: {exec_price:.2f}, Cost: {fee+slippage:.2f}")
                return True
            else:
                logger.warning(f"PaperBroker Error: Insufficient cash for BUY {symbol}")
                return False
                
        elif side == 'SELL':
            if self.positions.get(symbol, 0) >= quantity:
                exec_price = price * (1 - self.slippage_rate)
                raw_value = quantity * exec_price
                fee, tax, slippage = self.calculate_cost('SELL', raw_value)
                total_income = raw_value - fee - tax - slippage
                
                self.cash += total_income
                self.positions[symbol] -= quantity
                if self.positions[symbol] == 0:
                    del self.positions[symbol]
                
                logger.info(f"[EXEC] SELL {symbol}, Qty: {quantity}, Price: {exec_price:.2f}, Income: {total_income:.2f}")
                return True
            else:
                logger.warning(f"PaperBroker Error: Insufficient position for SELL {symbol}")
                return False
        return False

    def get_positions(self):
        return self.positions

    def get_cash(self):
        return self.cash
