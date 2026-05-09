from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import pandas as pd
import os

router = APIRouter()

DATA_DIR = "../data"
CHUNK_SIZE = 5000


# -----------------------------
# PER USER STREAM
# -----------------------------
async def user_stream(websocket: WebSocket, sat: int, interval: float):

    file_path = os.path.join(DATA_DIR, f"sat_{sat}.csv")

    print(f"USER STREAM STARTED: {file_path}")

    try:
        for chunk in pd.read_csv(file_path, chunksize=CHUNK_SIZE):

            for _, row in chunk.iterrows():

                # stop if disconnected
                if websocket.client_state.name != "CONNECTED":
                    print("USER DISCONNECTED")
                    return

                await websocket.send_json(row.to_dict())
                await asyncio.sleep(interval)

    except Exception as e:
        print("STREAM ERROR:", e)


# -----------------------------
# WEBSOCKET ENDPOINT
# -----------------------------
@router.websocket("/ws/stream")
async def stream_socket(websocket: WebSocket):

    await websocket.accept()

    # read query param: ws://.../ws/stream?sat=6
    sat = websocket.query_params.get("sat", "6")
    sat = int(sat)

    task = asyncio.create_task(user_stream(websocket, sat, interval=1.0))

    try:
        while True:
            await asyncio.sleep(1)

    except WebSocketDisconnect:
        task.cancel()
        print("CLIENT DISCONNECTED")