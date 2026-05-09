import numpy as np
import onnxruntime as ort


# ----------------------------
# LOAD ONNX MODEL ONCE
# ----------------------------
_session = ort.InferenceSession(
    "gnss_model.onnx",
    providers=["CPUExecutionProvider"]
)


# ----------------------------
# FEATURE ORDER (MUST MATCH TRAINING)
# ----------------------------
FEATURE_ORDER = [
    "cn0",
    "doppler_shift",
    "doppler_rate",
    "ec_bias",
    "lc_bias",
    "pc_bias",
    "pip_bias",
    "pqp_bias",
    "time_drift",
    "noise_level",
    "attack_mode",
    "prn",
    "tcd",
]


def preprocess(row: dict):
    x = np.array([[row.get(f, 0.0) for f in FEATURE_ORDER]], dtype=np.float32)
    return x


def predict(row: dict):
    x = preprocess(row)

    input_name = _session.get_inputs()[0].name
    output_name = _session.get_outputs()[0].name

    output = _session.run([output_name], {input_name: x})[0]

    prob = float(output[0][0])

    return {
        "tamper_probability": prob,
        "prediction": int(prob > 0.5)
    }