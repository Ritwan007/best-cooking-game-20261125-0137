// Kilat Kitchen's state machine: title → play → over. Owns the shift clock,
// the score, the grill and board state, popups and particles, and turns
// station events into sounds. Rendering lives in render.js.
import { DISHES, GRILL_COOK_SECONDS, SHIFT_SECONDS, STATIONS } from './config.js';
import { createOrderBoard, maxOrdersFor, spawnIntervalFor } from './orders.js';
import { createChef } from './chef.js';
import { interact, stationAt, stationCentre, tickGrill } from './stations.js';
import { makeRng } from './rng.js';

export function createGame(sounds) {
  const rng = makeRng(20261125);
  const orders = createOrderBoard(rng);
  const chefApi = createChef();
  const chef = chefApi.chef;

  const game = {
    screen: 'title',
    shiftSeconds: SHIFT_SECONDS,
    timeLeft: SHIFT_SECONDS,
    elapsed: 0,
    score: 0,
    coins: 0,
    served: 0,
    missed: 0,
    combo: 0,
    bestCombo: 0,
    chef,
    board: { item: null },
    grill: [{ item: null }, { item: null }],
    assembly: { plate: null },
    orders,
    popups: [],
    particles: [],
    activeStation: null,
    spawnTimer: 4,
    muted: false,
    lastTickSecond: -1,
  };

  function addPopup(text, color, x, y) {
    game.popups.push({ text, color, x, y, life: 1.4, maxLife: 1.4 });
    if (game.popups.length > 8) game.popups.shift();
  }

  function burst(x, y, color, count, speed) {
    for (let i = 0; i < count; i += 1) {
      const angle = rng() * Math.PI * 2;
      const v = speed * (0.4 + rng() * 0.8);
      game.particles.push({
        x, y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v - 30,
        life: 0.7, maxLife: 0.7,
        size: 2 + rng() * 3,
        color,
      });
    }
    if (game.particles.length > 120) game.particles.splice(0, game.particles.length - 120);
  }

  function playSound(name) {
    if (name === 'chop') sounds.chop();
    else if (name === 'pickup') sounds.pickup();
    else if (name === 'place') sounds.place();
    else if (name === 'sizzle') sounds.sizzle();
    else if (name === 'ding') sounds.ding();
    else if (name === 'coin') sounds.coin();
    else if (name === 'buzz') sounds.buzz();
    else if (name === 'tick') sounds.tick();
    else if (name === 'click') sounds.click();
  }

  function applyEvents(events) {
    for (const event of events) {
      if (event.type === 'sound') playSound(event.name);
      else if (event.type === 'popup') addPopup(event.text, event.color, event.x, event.y);
      else if (event.type === 'crumbs') burst(event.x, event.y, '#8a6a45', 8, 90);
      else if (event.type === 'grill-ready') {
        const slot = event.slot;
        const station = STATIONS.find((s) => s.id === 'grill');
        addPopup('Patty ready!', '#4c9a3f', station.x + station.w / 2, station.y - 14);
        playSound('ding');
      } else if (event.type === 'grill-burnt') {
        const station = STATIONS.find((s) => s.id === 'grill');
        addPopup('Burnt! Trash it.', '#d84a35', station.x + station.w / 2, station.y - 14);
        playSound('buzz');
      }
    }
  }

  function reset() {
    game.screen = 'play';
    game.timeLeft = SHIFT_SECONDS;
    game.elapsed = 0;
    game.score = 0;
    game.coins = 0;
    game.served = 0;
    game.missed = 0;
    game.combo = 0;
    game.bestCombo = 0;
    chefApi.reset(640, 600);
    game.board.item = null;
    game.grill[0].item = null;
    game.grill[1].item = null;
    game.assembly.plate = null;
    orders.clear();
    game.popups.length = 0;
    game.particles.length = 0;
    game.spawnTimer = 3;
    game.lastTickSecond = -1;
    orders.spawn(0);
  }

  // Serving: the plate must match an open ticket exactly. Called by stations.
  game.serveCarriedPlate = function serveCarriedPlate(station) {
    const plate = chef.carry;
    const events = [];
    const order = orders.matchPlate(plate.items);
    if (!order) {
      game.combo = 0;
      events.push({ type: 'sound', name: 'buzz' });
      events.push({ type: 'popup', text: 'No order wants this!', color: '#d84a35', x: station.x + station.w / 2, y: station.y - 14 });
      return events;
    }
    const fast = order.patience > order.maxPatience * 0.5;
    const tip = fast ? 2 : 0;
    game.combo += 1;
    game.bestCombo = Math.max(game.bestCombo, game.combo);
    const mult = 1 + 0.2 * (Math.min(game.combo, 5) - 1);
    const points = Math.round(order.price * 10 * mult);
    game.score += points;
    game.coins += order.price + tip;
    game.served += 1;
    chef.carry = null;
    events.push({ type: 'sound', name: 'coin' });
    events.push({ type: 'sound', name: 'ding' });
    events.push({ type: 'popup', text: `+$${order.price + tip}  ${order.name}`, color: '#2e7f3a', x: station.x + station.w / 2, y: station.y - 14 });
    if (game.combo >= 2) {
      events.push({ type: 'popup', text: `Combo x${game.combo}!`, color: '#e4572e', x: chef.x, y: chef.y - 70 });
    }
    burst(station.x + station.w / 2, station.y + 40, '#f5c542', 14, 130);
    return events;
  };

  function updatePlaying(dt, input) {
    game.elapsed += dt;
    game.timeLeft = Math.max(0, SHIFT_SECONDS - game.elapsed);
    const whole = Math.ceil(game.timeLeft);
    if (whole <= 10 && whole !== game.lastTickSecond && whole > 0) {
      game.lastTickSecond = whole;
      playSound('tick');
    }

    chefApi.update(dt, input);

    // Click a station: walk to it, then interact on arrival.
    if (input.mouse.clicked) {
      const clicked = stationAt(input.mouse.clickX, input.mouse.clickY);
      if (clicked) {
        const c = stationCentre(clicked);
        chefApi.moveTo(c.x, Math.min(c.y + clicked.h / 2 + 46, 690));
        game.pendingStation = clicked;
      } else {
        chefApi.moveTo(input.mouse.clickX, input.mouse.clickY);
        game.pendingStation = null;
      }
    }
    game.activeStation = stationAt(chef.x, chef.y);
    if (game.pendingStation && !chef.moveTarget) {
      const events = interact(game, game.pendingStation);
      game.pendingStation = null;
      applyEvents(events);
    } else if (input.interactPressed() && game.activeStation) {
      // A key press wins over a queued click, and clears the queue so the
      // same station is never used twice for one arrival.
      game.pendingStation = null;
      applyEvents(interact(game, game.activeStation));
    }

    // Grill cooks on its own; steam rises off a cooking patty.
    applyEvents(tickGrill(game.grill, dt));
    for (const slot of game.grill) {
      if (slot.item && slot.item.stage !== 'burnt' && rng() < dt * 6) {
        const station = STATIONS.find((s) => s.id === 'grill');
        const index = game.grill.indexOf(slot);
        game.particles.push({
          x: station.x + 62 + index * 158 + (rng() - 0.5) * 20,
          y: station.y + station.h / 2 - 20,
          vx: 0, vy: -34,
          life: 0.9, maxLife: 0.9,
          size: 3 + rng() * 3,
          color: 'rgba(200,200,200,0.7)',
        });
      }
    }

    // New tickets arrive on a quickening schedule.
    game.spawnTimer -= dt;
    if (game.spawnTimer <= 0) {
      if (orders.orders.length < maxOrdersFor(game.elapsed)) {
        orders.spawn(game.elapsed);
        playSound('click');
      }
      game.spawnTimer = spawnIntervalFor(game.elapsed);
    }

    const expired = orders.tick(dt);
    for (const order of expired) {
      game.missed += 1;
      game.combo = 0;
      addPopup(`Ticket ${order.ticket} walked out!`, '#d84a35', 640, 150);
      playSound('buzz');
    }

    // Popups rise, particles drift.
    for (const p of game.popups) p.life -= dt;
    game.popups = game.popups.filter((p) => p.life > 0);
    for (const p of game.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy -= 12 * dt;
    }
    game.particles = game.particles.filter((p) => p.life > 0);

    if (game.timeLeft <= 0) {
      game.screen = 'over';
      playSound('fanfare');
    }
  }

  return {
    game,
    reset,
    update(dt, input) {
      if (game.screen === 'title') {
        if (input.confirmPressed() || input.mouse.clicked) {
          sounds.unlock();
          reset();
          playSound('click');
        }
        return;
      }
      if (game.screen === 'over') {
        if (input.held.has('up') || input.held.has('down')) return;
        if (input.mouse.clicked) {
          reset();
          playSound('click');
        }
        return;
      }
      updatePlaying(dt, input);
    },
    // KeyR restarts from the game-over screen; KeyM toggles mute.
    handleKey(code) {
      if (code === 'KeyM') {
        game.muted = sounds.toggleMute();
      }
      if (code === 'KeyR' && game.screen === 'over') {
        reset();
        playSound('click');
      }
    },
  };
}
