import asyncio
import random

#broadcast = get_broadcast()

def update_metrics(params: dict):
    """
    This is where:
    - GNSS data modification happens
    - ML model inference runs
    - results are broadcast to websocket
    """

    model_output = run_fake_model(params)

    asyncio.create_task(
        broadcast({
            "type": "update",
            "model_output": model_output,
            "params": params,
            "signals": generate_fake_signals(params),
        })
    )

    return {"model_output": model_output}


def run_fake_model(params):
    """
    Replace with real ML model later.
    """
    score = random.random()

    # example influence from knobs
    score += params["noise_level"] * 0.1
    score += abs(params["pseudorange_bias"]) * 0.01

    return min(max(score, 0), 1)


def generate_fake_signals(params):
    """
    Replace with real GNSS transformation pipeline.
    """

    base = [100, 101, 102, 103]

    return {
        "CN0": [x * params["cn0_scale"] + random.uniform(-1, 1) for x in base],
        "DO": [x + params["doppler_shift"] for x in base],
    }