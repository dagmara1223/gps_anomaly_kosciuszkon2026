from dataclasses import dataclass, field

@dataclass
class SessionState:
    cn0_scale: float = 1.0
    noise_level: float = 0.0
    doppler_shift: float = 0.0
    pseudorange_bias: float = 0.0
    time_drift: float = 0.0
    attack_mode: int = 0


sessions = {}