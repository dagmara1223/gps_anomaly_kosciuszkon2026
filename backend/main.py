from fastapi import FastAPI
from pydantic import BaseModel

from tampering_logic import update_metrics
from ws import router as ws_router

app = FastAPI(title="GNSS Sandbox Backend")

app.include_router(ws_router)


# -----------------------------
# Metrics model
# -----------------------------
class MetricsRequest(BaseModel):
    cn0_scale: float = 1.0
    noise_level: float = 0.0
    doppler_shift: float = 0.0
    pseudorange_bias: float = 0.0
    time_drift: float = 0.0


# -----------------------------
# Metrics endpoint
# -----------------------------
@app.post("/change_metrics")
async def change_metrics(req: MetricsRequest):
    result = update_metrics(req.dict())

    return {
        "status": "ok",
        "applied_metrics": req.dict(),
        "model_output": result.get("model_output"),
    }