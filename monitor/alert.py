from monitor.logger import logger

class AlertManager:
    """
    警報管理器
    負責向外部發送通知 (如 Telegram, Discord, Line, Email)。
    MVP 版本僅輸出至 Log。
    """
    def __init__(self):
        pass

    def send_alert(self, message, level="INFO"):
        """
        發送警報
        """
        msg = f"[ALERT] {message}"
        if level == "INFO":
            logger.info(msg)
        elif level == "WARNING":
            logger.warning(msg)
        elif level == "ERROR":
            logger.error(msg)

alert_manager = AlertManager()
