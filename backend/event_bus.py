import asyncio

connections = set()

def register(ws):
    connections.add(ws)

def unregister(ws):
    connections.discard(ws)


async def broadcast(data: dict):
    dead = []

    for ws in connections:
        try:
            await ws.send_json(data)
        except:
            dead.append(ws)

    for d in dead:
        connections.discard(d)