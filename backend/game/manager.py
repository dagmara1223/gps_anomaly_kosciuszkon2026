from typing import Dict, Optional
from session_state import sessions, SessionState
from .models import GameSession
from .codes import generate_game_code


games: Dict[str, GameSession] = {}  


def create_game(owner_ws: str) -> GameSession:
    code = generate_game_code()

    # shared GNSS state session_id
    if code not in sessions:
        sessions[code] = SessionState()

    game = GameSession(
        code=code,
        owner_ws=owner_ws,
        session_id=code
    )

    games[code] = game
    return game


def join_game(code: str, ws_id: str) -> Optional[GameSession]:
    game = games.get(code)
    if not game:
        return None

    game.joiner_ws = ws_id
    return game


def get_game_by_ws(ws_id: str) -> Optional[GameSession]:
    for g in games.values():
        if g.owner_ws == ws_id or g.joiner_ws == ws_id:
            return g
    return None


def get_role(ws_id: str) -> Optional[str]:
    g = get_game_by_ws(ws_id)
    if not g:
        return None
    if g.owner_ws == ws_id:
        return "owner"
    if g.joiner_ws == ws_id:
        return "joiner"
    return None

def check_loss(state, game) -> bool:
    if state.cn0_scale * 100 < game.min_cn0:
        return True

    if state.noise_level > game.max_noise:
        return True

    if abs(state.doppler_shift) > game.max_doppler:
        return True

    if abs(state.pseudorange_bias) > game.max_bias:
        return True

    if abs(state.time_drift) > game.max_drift:
        return True

    return False