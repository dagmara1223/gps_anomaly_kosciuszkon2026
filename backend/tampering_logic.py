import random
import asyncio
from session_state import sessions, SessionState

from event_bus import broadcast


def update_metrics(session_id: str, params: dict):
    """
    Updates per-user GNSS tampering parameters.
    """

    if session_id not in sessions:
        sessions[session_id] = SessionState()

    state = sessions[session_id]

    state.cn0_scale = params.get("cn0_scale", state.cn0_scale)
    state.noise_level = params.get("noise_level", state.noise_level)
    state.doppler_shift = params.get("doppler_shift", state.doppler_shift)
    state.pseudorange_bias = params.get("pseudorange_bias", state.pseudorange_bias)
    state.time_drift = params.get("time_drift", state.time_drift)
    state.attack_mode = params.get("attack_mode", state.attack_mode)

    return {
        "status": "ok",
        "session_id": session_id,
        "state": state.__dict__,
    }

def tamper_row(row: dict, state):
    """
    Applies GNSS corruption in real-time.
    """

    r = dict(row)

    # CN0 scaling + noise
    if "CN0" in r:
        r["CN0"] = r["CN0"] * state.cn0_scale + random.uniform(
            -state.noise_level, state.noise_level
        )

    # Doppler shift simulation
    if "DO" in r:
        r["DO"] = r["DO"] + state.doppler_shift

    # pseudorange bias
    if "PD" in r:
        r["PD"] = r["PD"] + state.pseudorange_bias

    # optional attack modes
    if state.attack_mode == 1:
        # noise attack
        for k in r:
            if isinstance(r[k], (int, float)):
                r[k] += random.uniform(-5, 5)

    elif state.attack_mode == 2:
        # spoof attack (drift)
        for k in r:
            if isinstance(r[k], (int, float)):
                r[k] *= 1.01

    return r