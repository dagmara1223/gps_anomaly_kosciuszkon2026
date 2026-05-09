from dataclasses import dataclass, field

@dataclass
class SessionState:
    cn0_scale: float = 1.0
    noise_level: float = 0.0
    doppler_shift: float = 0.0
    pseudorange_bias: float = 0.0
    time_drift: float = 0.0
    attack_mode: int = 0

    def __repr__(self):
        return (
            f"SessionState("
            f"cn0_scale={self.cn0_scale}, "
            f"noise_level={self.noise_level}, "
            f"doppler_shift={self.doppler_shift}, "
            f"pseudorange_bias={self.pseudorange_bias}, "
            f"time_drift={self.time_drift}, "
            f"attack_mode={self.attack_mode})"
        )


sessions = {}