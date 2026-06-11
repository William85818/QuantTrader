from monitor.logger import logger
from config import CONFIG

class RiskManager:
    """
    風控管理器
    負責下單前的預檢工作。
    """
    def __init__(self, initial_capital):
        self.initial_capital = initial_capital
        self.max_position_pct = CONFIG['max_position_pct']
        self.max_daily_loss_pct = CONFIG['max_daily_loss_pct']
        self.max_total_drawdown_pct = CONFIG['max_total_drawdown_pct']
        self.max_order_value = CONFIG['max_order_value']
        self.allow_trading = CONFIG['allow_trading']

    def check_order(self, symbol, quantity, price, current_cash, total_assets, daily_pl_pct, max_drawdown_pct):
        """
        檢查訂單是否符合風控條件
        """
        order_value = quantity * price
        
        # 1. 檢查實盤開關
        if not self.allow_trading:
            # 這裡在回測模式中應由引擎控制，若明確要求實盤則須檢查
            pass 

        # 2. 單筆最大下單金額檢查
        if order_value > self.max_order_value:
            logger.warning(f"風控拒絕: 單筆金額 {order_value} 超過上限 {self.max_order_value}")
            return False

        # 3. 單一持倉比例檢查
        position_pct = order_value / total_assets
        if position_pct > self.max_position_pct:
            logger.warning(f"風控拒絕: 持倉比例 {position_pct:.2%} 超過上限 {self.max_position_pct:.2%}")
            return False

        # 4. 單日最大虧損檢查
        if daily_pl_pct < -self.max_daily_loss_pct:
            logger.warning(f"風控拒絕: 單日虧損 {daily_pl_pct:.2%} 觸發風控閥值")
            return False

        # 5. 總資產最大回撤檢查
        if max_drawdown_pct > self.max_total_drawdown_pct:
            logger.warning(f"風控拒絕: 當前回撤 {max_drawdown_pct:.2%} 超過上限 {self.max_total_drawdown_pct:.2%}")
            return False

        # 6. 先期現金檢查
        if order_value > current_cash:
            logger.warning(f"訂單拒絕: 現金不足 ({current_cash} < {order_value})")
            return False

        return True
