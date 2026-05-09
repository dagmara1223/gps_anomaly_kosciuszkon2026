from fastapi import FastAPI
from pydantic import BaseModel

from tampering_logic import update_metrics
from ws import router as ws_router
from session_state import sessions, SessionState



app = FastAPI(title="GNSS Sandbox Backend")

app.include_router(ws_router)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Metrics model

class MetricsRequest(BaseModel):
    cn0_scale: float = 1.0
    noise_level: float = 0.0
    doppler_shift: float = 0.0
    pseudorange_bias: float = 0.0
    time_drift: float = 0.0
    attack_mode: int = 0



# Metrics endpoint

@app.post("/change_metrics")
async def change_metrics(req: MetricsRequest, websocket_id: str):
    """
    websocket_id = frontend session id
    """

    if websocket_id not in sessions:
        sessions[websocket_id] = SessionState()

    state = sessions[websocket_id]

    state.cn0_scale = req.cn0_scale
    state.noise_level = max(0.0, min(params.get("noise_level", 0.0), 2.0))
    state.doppler_shift = req.doppler_shift
    state.pseudorange_bias = req.pseudorange_bias
    state.time_drift = req.time_drift
    state.attack_mode = req.attack_mode

    print("UPDATE KEY:", websocket_id, id(state))
    print(state)

    return {"status": "updated"}