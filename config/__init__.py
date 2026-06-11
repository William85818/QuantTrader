import yaml
import os

class Config:
    @staticmethod
    def load():
        path = os.path.join(os.path.dirname(__file__), 'config.yaml')
        with open(path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)

CONFIG = Config.load()
