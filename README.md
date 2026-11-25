# Kilat Kitchen — Dapur Kilat

[![make.fun](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/c/best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/Ritwan007/best-cooking-game-20261125-0137/rank.svg)](https://make.fun/c/best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/Ritwan007/best-cooking-game-20261125-0137/reward.svg)](https://make.fun/c/best-cooking-game-20261125-0137)

A fast, original 2D canvas cooking game for the
[make.fun best cooking game competition](https://make.fun/c/best-cooking-game-20261125-0137):
run a tiny kitchen through a 2½-minute shift. Tickets land on the order
board with a patience timer; grab ingredients from the bins, chop them on the
board, grill patties before they burn, build each dish on a plate at the
assembly counter, and ring the bell at the serve window before the ticket
walks out. Fast serves earn tips, streaks build combos, and the rush only
grows — more tickets, less patience.

## Play

- **Move:** WASD / arrow keys, or click anywhere to walk there (click a
  station to walk to it and use it).
- **Interact:** E or Space — grab, chop (×3), grill, plate, serve.
- **Keys:** M mutes, R restarts after a shift ends.
- **Menu:** Kilat Burger, Cheese Melt, Garden Stack, Onion Smash, Crisp Salad.

## Run it

Static files, no build step, no network requests:

```sh
node serve.ts
# open http://localhost:8080
```

Screenshots are staged renders of the real game (`?shot=cover|rush|serve|results`).

## Layout

- `game/index.html` — the page, one canvas.
- `game/src/config.js` — constants, kitchen layout, menu.
- `game/src/game.js` — state machine, shift clock, scoring.
- `game/src/orders.js` — the order board: spawn, patience, matching.
- `game/src/stations.js` — what E does at each station; grill timing.
- `game/src/chef.js` — movement and carrying.
- `game/src/render.js` — all canvas drawing.
- `game/src/audio.js` — synthesised WebAudio sounds, no files.
- `game/src/input.js` — keyboard and mouse.
- `game/src/shots.js` — staged screenshot scenes.
- `game/src/main.js` — bootstrap and loop.
- `main.ts` — the make.fun hand-in program (Node 22, standard library only).

License: MIT.
