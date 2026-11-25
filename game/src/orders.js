// The order board: spawning tickets, ticking patience, matching a finished
// plate against the open orders. Pure state, no drawing, no sound.
import { DISHES, DISH_IDS } from './config.js';
import { pick } from './rng.js';

export function createOrderBoard(rng) {
  let nextId = 1;
  const orders = [];

  function patienceFor(elapsed) {
    // Later in the shift the tickets get less patient.
    return Math.max(34, 58 - elapsed * 0.12);
  }

  return {
    orders,
    spawn(elapsed) {
      const dishId = pick(rng, DISH_IDS);
      const dish = DISHES[dishId];
      const patience = patienceFor(elapsed);
      const order = {
        id: nextId,
        ticket: `A${String(nextId).padStart(2, '0')}`,
        dishId,
        name: dish.name,
        price: dish.price,
        items: dish.items.slice(),
        patience,
        maxPatience: patience,
        bornAt: elapsed,
      };
      nextId += 1;
      orders.push(order);
      return order;
    },
    // Tick every open ticket down. Returns the tickets that just expired.
    tick(dt) {
      const expired = [];
      for (let i = orders.length - 1; i >= 0; i -= 1) {
        const order = orders[i];
        order.patience -= dt;
        if (order.patience <= 0) {
          orders.splice(i, 1);
          expired.push(order);
        }
      }
      return expired;
    },
    // A plate matches an order when its ingredients are the same multiset,
    // in any order. Returns the matched order (earliest ticket first) or null.
    matchPlate(plateItems) {
      const wanted = plateItems.slice().sort().join('|');
      for (let i = 0; i < orders.length; i += 1) {
        const order = orders[i];
        if (order.items.slice().sort().join('|') === wanted) {
          orders.splice(i, 1);
          return order;
        }
      }
      return null;
    },
    clear() {
      orders.length = 0;
      nextId = 1;
    },
  };
}

// How long to wait before the next ticket, in seconds: the rush builds.
export function spawnIntervalFor(elapsed) {
  return Math.max(8, 14 - elapsed * 0.045);
}

export function maxOrdersFor(elapsed) {
  return elapsed > 60 ? 4 : 3;
}
