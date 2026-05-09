from fastapi import FastAPI, Body
from pydantic import BaseModel

from tampering_logic import update_metrics
from ws import router as ws_router
from session_state import sessions, SessionState
from game.manager import create_game, join_game, get_game_by_ws
from game.manager import games

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
    state.noise_level = max(0.0, min(req.noise_level, 2.0))
    state.doppler_shift = req.doppler_shift
    state.pseudorange_bias = req.pseudorange_bias
    state.time_drift = req.time_drift
    state.attack_mode = req.attack_mode

    print("UPDATE KEY:", websocket_id, id(state))
    print(state)

    return {"status": "updated"}

@app.post("/game/create")
async def create_game_endpoint(websocket_id: str):
    game = create_game(websocket_id)
    return {
        "code": game.code,
        "session_id": game.session_id
    }

@app.post("/game/join")
async def join_game_endpoint(code: str = Body(...), websocket_id: str = Body(...)):
    game = join_game(code, websocket_id)

    if not game:
        return {"status": "error", "message": "invalid code"}

    return {
        "status": "joined",
        "code": game.code,
        "session_id": game.session_id
    }