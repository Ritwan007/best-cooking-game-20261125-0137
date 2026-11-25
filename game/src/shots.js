// Staged screenshot scenes behind ?shot=cover|rush|serve|results. Each one
// builds a real mid-game state by hand — real orders, a real plate, a real
// grill — then freezes the clock, so the frame is deterministic and shows
// the kitchen at its most complete.
import { DISHES } from './config.js';

function makeOrder(game, ticket, dishId, patienceFrac) {
  const dish = DISHES[dishId];
  const patience = 50 * patienceFrac;
  return {
    id: game.orders.orders.length + 1,
    ticket,
    dishId,
    name: dish.name,
    price: dish.price,
    items: dish.items.slice(),
    patience,
    maxPatience: 50,
    bornAt: 0,
  };
}

function baseState(game) {
  game.screen = 'play';
  game.orders.clear();
  game.popups.length = 0;
  game.particles.length = 0;
  game.board.item = null;
  game.grill[0].item = null;
  game.grill[1].item = null;
  game.assembly.plate = null;
  game.chef.carry = null;
  game.chef.moveTarget = null;
  game.chef.walking = false;
}

// The cover: a full kitchen, three tickets, a dish mid-assembly, a patty on
// the grill, a tomato half-chopped, the timer running.
function stageCover(game) {
  baseState(game);
  game.elapsed = 43;
  game.timeLeft = 107;
  game.score = 340;
  game.coins = 34;
  game.served = 4;
  game.combo = 3;
  game.bestCombo = 3;
  game.orders.orders.push(
    makeOrder(game, 'A07', 'burger', 0.8),
    makeOrder(game, 'A08', 'cheese', 0.55),
    makeOrder(game, 'A09', 'garden', 0.9),
  );
  game.board.item = { id: 'tomatoRaw', hits: 2 };
  game.grill[0].item = { id: 'pattyRaw', t: 3.2, stage: 'raw' };
  game.grill[1].item = null;
  game.assembly.plate = { kind: 'plate', items: ['bun', 'patty'] };
  game.chef.x = 790;
  game.chef.y = 470;
  game.chef.facing = 'left';
  game.chef.carry = { kind: 'item', id: 'lettuce' };
  game.activeStation = null;
  game.popups.push({ text: 'Chop it! E ×3', color: '#8a6a45', x: 152, y: 232, life: 1.4, maxLife: 1.4 });
}

// The rush: four tickets, one nearly gone, both grill slots cooking, the chef
// chopping hard, the clock nearly out.
function stageRush(game) {
  baseState(game);
  game.elapsed = 118;
  game.timeLeft = 32;
  game.score = 920;
  game.coins = 92;
  game.served = 11;
  game.missed = 1;
  game.combo = 4;
  game.bestCombo = 5;
  game.orders.orders.push(
    makeOrder(game, 'A15', 'smash', 0.14),
    makeOrder(game, 'A16', 'burger', 0.62),
    makeOrder(game, 'A17', 'salad', 0.85),
    makeOrder(game, 'A18', 'cheese', 0.45),
  );
  game.board.item = { id: 'onionRaw', hits: 1 };
  game.grill[0].item = { id: 'pattyRaw', t: 4.6, stage: 'raw' };
  game.grill[1].item = { id: 'pattyRaw', t: 6.8, stage: 'cooked' };
  game.assembly.plate = { kind: 'plate', items: ['bun'] };
  game.chef.x = 152;
  game.chef.y = 470;
  game.chef.facing = 'up';
  game.chef.carry = null;
  game.activeStation = null;
}

// The serve: the chef at the window with a finished Kilat Burger, the
// matching ticket on top, coins popping.
function stageServe(game) {
  baseState(game);
  game.elapsed = 62;
  game.timeLeft = 88;
  game.score = 610;
  game.coins = 61;
  game.served = 7;
  game.combo = 2;
  game.bestCombo = 4;
  game.orders.orders.push(
    makeOrder(game, 'A11', 'burger', 0.7),
    makeOrder(game, 'A12', 'garden', 0.5),
  );
  game.chef.x = 1050;
  game.chef.y = 350;
  game.chef.facing = 'right';
  game.chef.carry = { kind: 'plate', items: ['bun', 'patty', 'lettuce'] };
  game.activeStation = null;
  game.popups.push({ text: '+$8  Kilat Burger', color: '#2e7f3a', x: 1172, y: 200, life: 1.4, maxLife: 1.4 });
  game.popups.push({ text: 'Combo x2!', color: '#e4572e', x: 1010, y: 480, life: 1.4, maxLife: 1.4 });
  for (let i = 0; i < 10; i += 1) {
    game.particles.push({
      x: 1172 + (i % 5) * 12 - 24, y: 270 + Math.floor(i / 5) * 14,
      vx: 0, vy: -20, life: 0.7, maxLife: 0.7, size: 3, color: '#f5c542',
    });
  }
}

// The results: the shift-end panel with a shift worth bragging about.
function stageResults(game) {
  baseState(game);
  game.screen = 'over';
  game.elapsed = 150;
  game.timeLeft = 0;
  game.score = 1240;
  game.coins = 124;
  game.served = 14;
  game.missed = 2;
  game.combo = 0;
  game.bestCombo = 5;
}

export function stageShot(name, game) {
  if (name === 'rush') stageRush(game);
  else if (name === 'serve') stageServe(game);
  else if (name === 'results') stageResults(game);
  else stageCover(game);
}
