from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import pandas as pd
import os

from session_state import sessions, SessionState
from tampering_logic import tamper_row

router = APIRouter()

DATA_DIR = "../data"
CHUNK_SIZE = 5000


# -----------------------------
# PER USER STREAM
# -----------------------------
async def user_stream(websocket: WebSocket, sat: int, interval: float):

    file_path = os.path.join(DATA_DIR, f"sat_{sat}.csv")

    print(f"USER STREAM STARTED: {file_path}")

    session_id = id(websocket)
    state = SessionState()
    sessions[session_id] = state

    try:
        for chunk in pd.read_csv(file_path, chunksize=CHUNK_SIZE, engine="python"):

            for _, row in chunk.iterrows():

                # stop if disconnected
                if websocket.client_state.name != "CONNECTED":
                    print("USER DISCONNECTED")
                    return

                try:
                    raw = row.to_dict()

                    # 🔥 APPLY TAMPERING HERE
                    tampered = tamper_row(raw, state)

                    await websocket.send_json(tampered)
                    await asyncio.sleep(interval)

                except Exception as e:
                    print("SEND ERROR:", e)
                    return

    except Exception as e:
        print("STREAM ERROR:", e)

    finally:
        sessions.pop(session_id, None)
        print("SESSION CLEANED")


# -----------------------------
# WEBSOCKET ENDPOINT
# -----------------------------
@router.websocket("/ws/stream")
async def stream_socket(websocket: WebSocket):

    await websocket.accept()

    sat = websocket.query_params.get("sat", "6")
    sat = int(sat)

    task = asyncio.create_task(user_stream(websocket, sat, interval=1.0))

    try:
        while True:
            await asyncio.sleep(1)

    except WebSocketDisconnect:
        task.cancel()
        print("CLIENT DISCONNECTED")