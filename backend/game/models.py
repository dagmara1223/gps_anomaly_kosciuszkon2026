from dataclasses import dataclass
from typing import Optional


@dataclass
class GameSession:
    code: str
    owner_ws: str
    joiner_ws: Optional[str] = None

    min_cn0: float = 25.0
    max_noise: float = 1.5
    max_doppler: float = 10.0
    max_bias: float = 50.0
    max_drift: float = 5.0

    @property
    def ready(self) -> bool:
        return self.owner_ws is not None and self.joiner_ws is not None