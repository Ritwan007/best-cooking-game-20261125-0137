// The kitchen stations: where they are, which one the chef stands at, and
// what pressing E does at each. Every interaction returns events the game
// turns into sounds and floating text; stations never score anything.
import { CHOP_HITS, GRILL_BURN_SECONDS, GRILL_COOK_SECONDS, INGREDIENTS, INTERACT_PAD, STATIONS } from './config.js';

export function stationAt(x, y) {
  let best = null;
  let bestDist = Infinity;
  for (const station of STATIONS) {
    const cx = station.x + station.w / 2;
    const cy = station.y + station.h / 2;
    const inside = x >= station.x - INTERACT_PAD && x <= station.x + station.w + INTERACT_PAD
      && y >= station.y - INTERACT_PAD && y <= station.y + station.h + INTERACT_PAD;
    if (!inside) continue;
    const dist = Math.hypot(x - cx, y - cy);
    if (dist < bestDist) {
      bestDist = dist;
      best = station;
    }
  }
  return best;
}

export function stationCentre(station) {
  return { x: station.x + station.w / 2, y: station.y + station.h / 2 };
}

function popupAt(station, text, color) {
  return { type: 'popup', text, color, x: station.x + station.w / 2, y: station.y - 14 };
}

// One press of E at a station. `game` carries the chef, board, grill,
// assembly counter and the order board; serving is delegated to the game.
export function interact(game, station) {
  const chef = game.chef;
  const events = [];
  const carried = chef.carry;

  if (station.kind === 'bin') {
    if (carried) {
      events.push(popupAt(station, 'Hands full!', '#d84a35'));
      events.push({ type: 'sound', name: 'buzz' });
      return events;
    }
    chef.carry = { kind: 'item', id: station.gives };
    events.push({ type: 'sound', name: 'pickup' });
    return events;
  }

  if (station.kind === 'plates') {
    if (carried) {
      events.push(popupAt(station, 'Hands full!', '#d84a35'));
      events.push({ type: 'sound', name: 'buzz' });
      return events;
    }
    chef.carry = { kind: 'plate', items: [] };
    events.push({ type: 'sound', name: 'pickup' });
    return events;
  }

  if (station.kind === 'board') {
    const board = game.board;
    if (board.item) {
      if (board.item.hits >= CHOP_HITS) {
        if (carried) {
          events.push(popupAt(station, 'Hands full!', '#d84a35'));
          events.push({ type: 'sound', name: 'buzz' });
          return events;
        }
        chef.carry = { kind: 'item', id: INGREDIENTS[board.item.id].chop };
        board.item = null;
        events.push({ type: 'sound', name: 'pickup' });
        return events;
      }
      board.item.hits += 1;
      events.push({ type: 'sound', name: 'chop' });
      events.push({ type: 'crumbs', x: station.x + station.w / 2, y: station.y + station.h / 2 });
      if (board.item.hits >= CHOP_HITS) {
        events.push(popupAt(station, `${INGREDIENTS[board.item.id].name} chopped!`, '#4c9a3f'));
      }
      return events;
    }
    if (carried && carried.kind === 'item' && INGREDIENTS[carried.id].chop) {
      board.item = { id: carried.id, hits: 0 };
      chef.carry = null;
      events.push({ type: 'sound', name: 'place' });
      return events;
    }
    events.push(popupAt(station, 'Needs something to chop', '#8a6a45'));
    return events;
  }

  if (station.kind === 'grill') {
    const grill = game.grill;
    if (carried && carried.kind === 'item' && carried.id === 'pattyRaw') {
      const slot = grill.find((s) => s.item === null);
      if (!slot) {
        events.push(popupAt(station, 'Grill is full!', '#d84a35'));
        events.push({ type: 'sound', name: 'buzz' });
        return events;
      }
      slot.item = { id: 'pattyRaw', t: 0, stage: 'raw' };
      chef.carry = null;
      events.push({ type: 'sound', name: 'sizzle' });
      return events;
    }
    const ready = grill.find((s) => s.item && s.item.stage !== 'raw');
    if (ready) {
      if (carried) {
        events.push(popupAt(station, 'Hands full!', '#d84a35'));
        events.push({ type: 'sound', name: 'buzz' });
        return events;
      }
      chef.carry = { kind: 'item', id: ready.item.stage === 'cooked' ? 'patty' : 'pattyBurnt' };
      ready.item = null;
      events.push({ type: 'sound', name: 'pickup' });
      return events;
    }
    const raw = grill.find((s) => s.item && s.item.stage === 'raw');
    if (raw) {
      events.push(popupAt(station, 'Still cooking…', '#8a6a45'));
      return events;
    }
    events.push(popupAt(station, 'Grill a raw patty here', '#8a6a45'));
    return events;
  }

  if (station.kind === 'assembly') {
    const assembly = game.assembly;
    if (!assembly.plate) {
      if (carried && carried.kind === 'plate') {
        assembly.plate = carried;
        chef.carry = null;
        events.push({ type: 'sound', name: 'place' });
        return events;
      }
      events.push(popupAt(station, 'Put a plate here first', '#8a6a45'));
      return events;
    }
    if (!carried) {
      chef.carry = assembly.plate;
      assembly.plate = null;
      events.push({ type: 'sound', name: 'pickup' });
      return events;
    }
    if (carried.kind === 'item' && INGREDIENTS[carried.id].plateReady) {
      if (assembly.plate.items.includes(carried.id)) {
        events.push(popupAt(station, 'Already on the plate', '#d84a35'));
        events.push({ type: 'sound', name: 'buzz' });
        return events;
      }
      assembly.plate.items.push(carried.id);
      chef.carry = null;
      events.push({ type: 'sound', name: 'place' });
      return events;
    }
    events.push(popupAt(station, 'That does not go on a plate', '#d84a35'));
    events.push({ type: 'sound', name: 'buzz' });
    return events;
  }

  if (station.kind === 'serve') {
    if (!carried || carried.kind !== 'plate' || carried.items.length === 0) {
      events.push(popupAt(station, 'Bring a finished plate!', '#8a6a45'));
      return events;
    }
    return game.serveCarriedPlate(station);
  }

  if (station.kind === 'trash') {
    if (!carried) return events;
    chef.carry = null;
    events.push({ type: 'sound', name: 'place' });
    events.push(popupAt(station, 'Tossed', '#8a6a45'));
    return events;
  }

  return events;
}

// Grill timing: raw patties cook, cooked ones burn if forgotten.
export function tickGrill(grill, dt) {
  const done = [];
  for (const slot of grill) {
    if (!slot.item) continue;
    slot.item.t += dt;
    if (slot.item.stage === 'raw' && slot.item.t >= GRILL_COOK_SECONDS) {
      slot.item.stage = 'cooked';
      done.push({ type: 'grill-ready', slot });
    } else if (slot.item.stage === 'cooked' && slot.item.t >= GRILL_BURN_SECONDS) {
      slot.item.stage = 'burnt';
      done.push({ type: 'grill-burnt', slot });
    }
  }
  return done;
}
