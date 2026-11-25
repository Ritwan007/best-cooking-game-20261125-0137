// Every pixel of Kilat Kitchen: the kitchen, the order board, the chef, the
// food, the HUD and the title / game-over screens. Canvas shapes only, no
// image files. One job: draw the state the game hands it.
import { DISHES, HUD_HEIGHT, INGREDIENTS, PALETTE, STATIONS, VIEW } from './config.js';

const FONT = "'Trebuchet MS', Verdana, sans-serif";

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, size, color, align = 'center', weight = 'bold') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// ---- food ---------------------------------------------------------------

export function drawIngredient(ctx, id, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  const r = s / 2;
  if (id === 'bun') {
    ctx.fillStyle = '#d99a4e';
    roundRect(ctx, -r, -r * 0.25, s, r * 0.6, 3);
    ctx.fill();
    ctx.fillStyle = '#e8b06a';
    ctx.beginPath();
    ctx.arc(0, -r * 0.2, r * 0.95, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#f7dc9a';
    for (const [dx, dy] of [[-r * 0.4, -r * 0.6], [0, -r * 0.85], [r * 0.4, -r * 0.6]]) {
      ctx.beginPath();
      ctx.ellipse(dx, dy, 2.5, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'pattyRaw') {
    ctx.fillStyle = '#c96a5a';
    roundRect(ctx, -r, -r * 0.55, s, r * 1.1, 6);
    ctx.fill();
    ctx.fillStyle = '#a04a3e';
    roundRect(ctx, -r * 0.7, -r * 0.3, s * 0.7, r * 0.6, 4);
    ctx.fill();
  } else if (id === 'patty') {
    ctx.fillStyle = '#7a4a28';
    roundRect(ctx, -r, -r * 0.5, s, r, 7);
    ctx.fill();
    ctx.fillStyle = '#5d3419';
    for (const dx of [-r * 0.5, 0, r * 0.5]) {
      ctx.beginPath();
      ctx.arc(dx, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'pattyBurnt') {
    ctx.fillStyle = '#241a12';
    roundRect(ctx, -r, -r * 0.5, s, r, 7);
    ctx.fill();
    ctx.strokeStyle = '#5a4632';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.3);
    ctx.lineTo(r * 0.4, r * 0.2);
    ctx.moveTo(r * 0.5, -r * 0.3);
    ctx.lineTo(-r * 0.3, r * 0.25);
    ctx.stroke();
  } else if (id === 'lettuce' || id === 'lettuceRaw') {
    ctx.fillStyle = id === 'lettuce' ? '#8fd45e' : '#6db33f';
    for (const [dx, dy, rr] of [[-r * 0.45, 0, r * 0.55], [r * 0.45, 0, r * 0.55], [0, -r * 0.3, r * 0.6]]) {
      ctx.beginPath();
      ctx.arc(dx, dy, rr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#4c8a2f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, r * 0.1);
    ctx.quadraticCurveTo(0, r * 0.55, r * 0.6, r * 0.1);
    ctx.stroke();
  } else if (id === 'tomato' || id === 'tomatoRaw') {
    ctx.fillStyle = '#e8604a';
    ctx.beginPath();
    ctx.arc(0, r * 0.1, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4c9a3f';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.75);
    ctx.lineTo(-r * 0.35, -r * 0.2);
    ctx.lineTo(0, -r * 0.4);
    ctx.lineTo(r * 0.35, -r * 0.2);
    ctx.closePath();
    ctx.fill();
    if (id === 'tomato') {
      ctx.strokeStyle = '#f7a08f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-r * 0.3, -r * 0.2, r * 0.35, Math.PI * 0.9, Math.PI * 1.7);
      ctx.stroke();
    }
  } else if (id === 'cheese') {
    ctx.fillStyle = '#f5c542';
    ctx.beginPath();
    ctx.moveTo(-r, r * 0.6);
    ctx.lineTo(r, r * 0.6);
    ctx.lineTo(r, -r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d99a1f';
    for (const [dx, dy] of [[-r * 0.35, r * 0.25], [r * 0.3, r * 0.1], [r * 0.05, r * 0.4]]) {
      ctx.beginPath();
      ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'onion' || id === 'onionRaw') {
    ctx.fillStyle = '#e3d3f0';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a97fc0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
    ctx.stroke();
    if (id === 'onionRaw') {
      ctx.strokeStyle = '#7c9a4a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.quadraticCurveTo(r * 0.2, -r * 1.2, r * 0.45, -r * 1.05);
      ctx.stroke();
    }
  }
  ctx.restore();
}

export function drawPlate(ctx, items, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#fdfdf8';
  ctx.beginPath();
  ctx.ellipse(0, 0, s / 2, s / 3.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c8c2b2';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, s / 2.6, s / 4.6, 0, 0, Math.PI * 2);
  ctx.stroke();
  items.forEach((id, i) => {
    const slot = items.length === 1 ? 0 : (i - (items.length - 1) / 2) * (s * 0.24);
    drawIngredient(ctx, id, slot, -s * 0.06, s * 0.34);
  });
  ctx.restore();
}

// ---- kitchen -------------------------------------------------------------

function drawFloor(ctx) {
  ctx.fillStyle = PALETTE.wall;
  ctx.fillRect(0, 0, VIEW.width, HUD_HEIGHT + 16);
  ctx.fillStyle = PALETTE.wallTrim;
  ctx.fillRect(0, HUD_HEIGHT + 12, VIEW.width, 4);
  const tile = 64;
  for (let ty = HUD_HEIGHT + 16; ty < VIEW.height; ty += tile) {
    for (let tx = 0; tx < VIEW.width; tx += tile) {
      const odd = ((tx / tile) + (ty / tile)) % 2 === 0;
      ctx.fillStyle = odd ? PALETTE.floorA : PALETTE.floorB;
      ctx.fillRect(tx, ty, tile, tile);
    }
  }
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  for (let tx = 0; tx < VIEW.width; tx += tile) ctx.fillRect(tx, HUD_HEIGHT + 16, 1, VIEW.height);
}

function drawCounter(ctx, station, active, now) {
  const { x, y, w, h } = station;
  ctx.save();
  ctx.fillStyle = PALETTE.counterFront;
  roundRect(ctx, x, y + 10, w, h - 6, 8);
  ctx.fill();
  ctx.fillStyle = PALETTE.counterTop;
  roundRect(ctx, x - 4, y, w + 8, 16, 6);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(x + 8, y + 26, w - 16, 3);
  if (active) {
    const pulse = 0.5 + 0.3 * Math.sin(now / 180);
    ctx.strokeStyle = `rgba(245,197,66,${pulse})`;
    ctx.lineWidth = 4;
    roundRect(ctx, x - 8, y - 8, w + 16, h + 16, 12);
    ctx.stroke();
  }
  text(ctx, station.label, x + w / 2, y + h + 14, 13, PALETTE.ink);
  ctx.restore();
}

function drawStations(ctx, game, now) {
  for (const station of STATIONS) {
    const active = game.activeStation === station;
    if (station.kind === 'serve') {
      // The pass-through window on the right wall.
      ctx.save();
      ctx.fillStyle = '#3d2c1e';
      roundRect(ctx, station.x, station.y, station.w, station.h, 10);
      ctx.fill();
      ctx.fillStyle = '#f7e8cf';
      roundRect(ctx, station.x + 10, station.y + 10, station.w - 20, station.h - 66, 6);
      ctx.fill();
      ctx.fillStyle = '#e4572e';
      roundRect(ctx, station.x + 10, station.y + station.h - 46, station.w - 20, 36, 6);
      ctx.fill();
      text(ctx, 'SERVE', station.x + station.w / 2, station.y + station.h - 28, 16, '#fff8ea');
      // The service bell.
      ctx.fillStyle = '#f5c542';
      ctx.beginPath();
      ctx.arc(station.x + station.w / 2, station.y + 46, 16, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(station.x + station.w / 2 - 20, station.y + 44, 40, 5);
      ctx.fillStyle = '#8a6a45';
      ctx.fillRect(station.x + station.w / 2 - 2, station.y + 22, 4, 10);
      if (active) {
        ctx.strokeStyle = 'rgba(245,197,66,0.9)';
        ctx.lineWidth = 4;
        roundRect(ctx, station.x - 6, station.y - 6, station.w + 12, station.h + 12, 12);
        ctx.stroke();
      }
      text(ctx, station.label, station.x + station.w / 2, station.y + station.h + 14, 13, PALETTE.ink);
      ctx.restore();
      continue;
    }
    if (station.kind === 'trash') {
      ctx.save();
      ctx.fillStyle = '#5d6b73';
      roundRect(ctx, station.x + 18, station.y + 8, station.w - 36, station.h - 8, 8);
      ctx.fill();
      ctx.fillStyle = '#7d8b93';
      roundRect(ctx, station.x + 10, station.y, station.w - 20, 16, 6);
      ctx.fill();
      if (active) {
        ctx.strokeStyle = 'rgba(245,197,66,0.9)';
        ctx.lineWidth = 4;
        roundRect(ctx, station.x - 6, station.y - 6, station.w + 12, station.h + 12, 12);
        ctx.stroke();
      }
      text(ctx, station.label, station.x + station.w / 2, station.y + station.h + 14, 13, PALETTE.ink);
      ctx.restore();
      continue;
    }
    drawCounter(ctx, station, active, now);
    const cx = station.x + station.w / 2;
    const cy = station.y + station.h / 2;
    if (station.kind === 'bin') {
      drawIngredient(ctx, station.gives, cx, cy - 4, 44);
    } else if (station.kind === 'board') {
      // Wooden board with the item being chopped.
      ctx.save();
      ctx.fillStyle = '#d9b380';
      roundRect(ctx, station.x + 16, station.y + 14, station.w - 32, station.h - 28, 10);
      ctx.fill();
      ctx.strokeStyle = '#b98a56';
      ctx.lineWidth = 2;
      roundRect(ctx, station.x + 16, station.y + 14, station.w - 32, station.h - 28, 10);
      ctx.stroke();
      ctx.restore();
      if (game.board.item) {
        drawIngredient(ctx, game.board.item.id, cx, cy - 6, 46);
        const done = game.board.item.hits / 3;
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        roundRect(ctx, cx - 46, cy + 26, 92, 9, 4);
        ctx.fill();
        ctx.fillStyle = done >= 1 ? '#4c9a3f' : '#f5c542';
        roundRect(ctx, cx - 46, cy + 26, 92 * Math.min(1, done), 9, 4);
        ctx.fill();
      } else {
        ctx.save();
        ctx.strokeStyle = '#8a6a45';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 26, cy - 8);
        ctx.lineTo(cx + 26, cy + 8);
        ctx.stroke();
        ctx.fillStyle = '#8a6a45';
        ctx.fillRect(cx + 18, cy - 2, 14, 6);
        ctx.restore();
        text(ctx, 'chop: press E ×3', cx, cy + 34, 12, '#8a6a45');
      }
    } else if (station.kind === 'grill') {
      ctx.save();
      ctx.fillStyle = '#3a3f44';
      roundRect(ctx, station.x + 12, station.y + 12, station.w - 24, station.h - 24, 8);
      ctx.fill();
      ctx.strokeStyle = '#565e66';
      ctx.lineWidth = 3;
      for (let i = 1; i < 6; i += 1) {
        ctx.beginPath();
        ctx.moveTo(station.x + 12, station.y + 12 + (i * (station.h - 24)) / 6);
        ctx.lineTo(station.x + station.w - 12, station.y + 12 + (i * (station.h - 24)) / 6);
        ctx.stroke();
      }
      ctx.restore();
      game.grill.forEach((slot, i) => {
        const sx = station.x + 62 + i * 158;
        const sy = station.y + station.h / 2 - 4;
        if (!slot.item) {
          ctx.save();
          ctx.strokeStyle = 'rgba(255,255,255,0.25)';
          ctx.setLineDash([5, 5]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sx, sy, 30, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
          return;
        }
        const item = slot.item;
        const cooked = item.stage === 'cooked';
        const burnt = item.stage === 'burnt';
        const frac = item.stage === 'raw'
          ? item.t / 5
          : (item.t - 5) / 6;
        ctx.save();
        ctx.strokeStyle = burnt ? '#d84a35' : cooked ? '#4c9a3f' : '#f5c542';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(sx, sy, 34, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, Math.max(0, frac)));
        ctx.stroke();
        ctx.restore();
        drawIngredient(ctx, item.stage === 'raw' ? 'pattyRaw' : item.stage === 'cooked' ? 'patty' : 'pattyBurnt', sx, sy, 48);
        if (cooked) text(ctx, 'READY!', sx, sy + 48, 13, '#4c9a3f');
        if (burnt) text(ctx, 'BURNT!', sx, sy + 48, 13, '#d84a35');
      });
    } else if (station.kind === 'assembly') {
      if (game.assembly.plate) {
        drawPlate(ctx, game.assembly.plate.items, cx, cy - 2, 110);
      } else {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 52, 30, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        text(ctx, 'plate + toppings', cx, cy + 38, 12, '#fff8ea');
      }
    } else if (station.kind === 'plates') {
      for (let i = 0; i < 3; i += 1) {
        ctx.save();
        ctx.fillStyle = i === 2 ? '#fdfdf8' : '#e8e2d2';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 16 - i * 9, 46, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

// ---- chef -----------------------------------------------------------------

function drawChef(ctx, chef, now) {
  const bob = chef.walking ? Math.sin(chef.bob) * 2.5 : Math.sin(now / 500) * 1;
  const x = chef.x;
  const y = chef.y + bob * 0.4;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(x, chef.y + 24, 24, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Body: teal shirt, white apron.
  ctx.fillStyle = '#2e7f86';
  roundRect(ctx, x - 20, y - 6, 40, 34, 12);
  ctx.fill();
  ctx.fillStyle = '#fdfdf8';
  roundRect(ctx, x - 13, y + 2, 26, 26, 6);
  ctx.fill();
  ctx.strokeStyle = '#2e7f86';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 13, y + 2);
  ctx.lineTo(x - 18, y - 10);
  ctx.moveTo(x + 13, y + 2);
  ctx.lineTo(x + 18, y - 10);
  ctx.stroke();
  // Arms.
  ctx.fillStyle = '#f2c89b';
  ctx.beginPath();
  ctx.arc(x - 22, y + 8, 7, 0, Math.PI * 2);
  ctx.arc(x + 22, y + 8, 7, 0, Math.PI * 2);
  ctx.fill();
  // Head and toque.
  ctx.fillStyle = '#f2c89b';
  ctx.beginPath();
  ctx.arc(x, y - 18, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fdfdf8';
  ctx.beginPath();
  ctx.arc(x - 8, y - 30, 8, 0, Math.PI * 2);
  ctx.arc(x, y - 34, 9, 0, Math.PI * 2);
  ctx.arc(x + 8, y - 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 14, y - 32, 28, 8);
  // Eyes look where the chef faces.
  const look = chef.facing === 'left' ? -3 : chef.facing === 'right' ? 3 : 0;
  ctx.fillStyle = '#2e2118';
  ctx.beginPath();
  ctx.arc(x - 5 + look, y - 18, 2, 0, Math.PI * 2);
  ctx.arc(x + 5 + look, y - 18, 2, 0, Math.PI * 2);
  ctx.fill();
  // Carried food floats above the toque.
  if (chef.carry) {
    const lift = Math.sin(now / 300) * 2;
    if (chef.carry.kind === 'plate') {
      drawPlate(ctx, chef.carry.items, x, y - 56 + lift, 64);
    } else {
      drawIngredient(ctx, chef.carry.id, x, y - 56 + lift, 34);
    }
  }
  ctx.restore();
}

// ---- HUD: orders, timer, score --------------------------------------------

function drawOrderBoard(ctx, game, now) {
  const orders = game.orders.orders;
  orders.forEach((order, i) => {
    const x = 16 + i * 222;
    const y = 8;
    const w = 212;
    const h = 92;
    const frac = Math.max(0, order.patience / order.maxPatience);
    const urgent = frac < 0.35;
    ctx.save();
    ctx.fillStyle = '#fffdf6';
    roundRect(ctx, x, y, w, h, 10);
    ctx.fill();
    ctx.strokeStyle = urgent ? '#d84a35' : '#d9c9a8';
    ctx.lineWidth = urgent ? 3 : 2;
    roundRect(ctx, x, y, w, h, 10);
    ctx.stroke();
    text(ctx, order.ticket, x + 10, y + 14, 11, '#8a6a45', 'left');
    text(ctx, order.name, x + 10, y + 32, 15, PALETTE.ink, 'left');
    text(ctx, `$${order.price}`, x + w - 10, y + 14, 14, '#2e7f3a', 'right');
    order.items.forEach((id, j) => {
      drawIngredient(ctx, id, x + 22 + j * 34, y + 58, 26);
    });
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    roundRect(ctx, x + 10, y + h - 14, w - 20, 7, 3);
    ctx.fill();
    ctx.fillStyle = urgent ? '#d84a35' : frac < 0.65 ? '#e8a13a' : '#4c9a3f';
    roundRect(ctx, x + 10, y + h - 14, (w - 20) * frac, 7, 3);
    ctx.fill();
    ctx.restore();
  });
  if (orders.length === 0 && game.screen !== 'over') {
    text(ctx, 'No orders yet — the rush is coming…', 16 + 222 * 2, 54, 15, '#8a6a45', 'center', 'normal');
  }
}

function drawHud(ctx, game, now) {
  drawOrderBoard(ctx, game, now);
  const x = 920;
  const y = 8;
  const w = 344;
  const h = 92;
  ctx.save();
  ctx.fillStyle = '#2e2118';
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();
  const total = game.shiftSeconds;
  const left = Math.max(0, game.timeLeft);
  const mins = Math.floor(left / 60);
  const secs = Math.floor(left % 60);
  const timerColor = left <= 15 && game.screen === 'play' ? (Math.sin(now / 150) > 0 ? '#ff6b4a' : '#ffd166') : '#ffd166';
  text(ctx, `${mins}:${String(secs).padStart(2, '0')}`, x + 64, y + 30, 30, timerColor);
  text(ctx, 'SHIFT', x + 64, y + 62, 11, '#cbb98f');
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  roundRect(ctx, x + 132, y + 16, w - 148, 8, 4);
  ctx.fill();
  ctx.fillStyle = timerColor;
  roundRect(ctx, x + 132, y + 16, (w - 148) * (left / total), 8, 4);
  ctx.fill();
  text(ctx, `SCORE ${game.score}`, x + 140, y + 44, 16, '#fff8ea', 'left');
  text(ctx, `COINS $${game.coins}`, x + 140, y + 68, 16, '#f5c542', 'left');
  if (game.combo >= 2) {
    text(ctx, `COMBO x${game.combo}`, x + w - 14, y + 44, 15, '#ff9d5c', 'right');
  }
  text(ctx, `served ${game.served}`, x + w - 14, y + 68, 12, '#cbb98f', 'right');
  ctx.restore();
}

// ---- particles, popups, screens -------------------------------------------

function drawParticles(ctx, game) {
  for (const p of game.particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawPopups(ctx, game) {
  for (const p of game.popups) {
    const frac = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - frac * 1.2);
    text(ctx, p.text, p.x, p.y - frac * 34, 18, p.color);
    ctx.restore();
  }
}

function drawTitle(ctx, game, now) {
  ctx.save();
  ctx.fillStyle = 'rgba(30,20,12,0.72)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  text(ctx, 'KILAT KITCHEN', VIEW.width / 2, 170, 64, '#ffd166');
  text(ctx, 'Dapur Kilat — cook fast, serve right, keep the rush alive', VIEW.width / 2, 222, 20, '#fff8ea', 'center', 'normal');
  const lines = [
    'WASD / arrows or click — move the chef',
    'E or Space — grab, chop, grill, plate, serve',
    'Bins give ingredients · board chops (E ×3) · grill cooks patties',
    'Build the dish on a plate at Assembly, then ring the bell at Serve',
    'Serve before the ticket runs out — tips for fast serves, combos for streaks',
  ];
  lines.forEach((line, i) => text(ctx, line, VIEW.width / 2, 300 + i * 34, 17, '#f7e8cf', 'center', 'normal'));
  const pulse = 0.65 + 0.35 * Math.sin(now / 280);
  ctx.save();
  ctx.globalAlpha = pulse;
  text(ctx, 'Press ENTER or click to start the shift', VIEW.width / 2, 510, 22, '#ffd166');
  ctx.restore();
  text(ctx, 'Shift: 2½ minutes · 5 dishes on the menu · the rush only grows', VIEW.width / 2, 556, 14, '#cbb98f', 'center', 'normal');
  ctx.restore();
}

function drawGameOver(ctx, game) {
  ctx.save();
  ctx.fillStyle = 'rgba(30,20,12,0.78)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  ctx.fillStyle = '#fff8ea';
  roundRect(ctx, VIEW.width / 2 - 280, 130, 560, 420, 16);
  ctx.fill();
  text(ctx, 'SHIFT OVER!', VIEW.width / 2, 180, 40, '#e4572e');
  text(ctx, `Score  ${game.score}`, VIEW.width / 2, 248, 26, PALETTE.ink);
  text(ctx, `Coins earned  $${game.coins}`, VIEW.width / 2, 292, 22, '#2e7f3a');
  text(ctx, `Dishes served  ${game.served}   ·   missed  ${game.missed}`, VIEW.width / 2, 336, 20, PALETTE.ink, 'center', 'normal');
  text(ctx, `Best combo  x${game.bestCombo}`, VIEW.width / 2, 376, 20, PALETTE.ink, 'center', 'normal');
  const verdict = game.served >= 14 ? 'Head-chef material. The kitchen is yours.'
    : game.served >= 8 ? 'A solid shift — the rush nearly had you.'
    : 'The tickets won this time. One more shift?';
  text(ctx, verdict, VIEW.width / 2, 424, 17, '#8a6a45', 'center', 'normal');
  text(ctx, 'Press R to cook again', VIEW.width / 2, 492, 18, '#e4572e');
  ctx.restore();
}

// ---- top level --------------------------------------------------------------

export function renderGame(ctx, game, now) {
  ctx.clearRect(0, 0, VIEW.width, VIEW.height);
  drawFloor(ctx);
  drawStations(ctx, game, now);
  drawParticles(ctx, game);
  if (game.screen === 'play') drawChef(ctx, game.chef, now);
  drawPopups(ctx, game);
  drawHud(ctx, game, now);
  if (game.screen === 'title') drawTitle(ctx, game, now);
  if (game.screen === 'over') drawGameOver(ctx, game);
  if (game.muted) text(ctx, 'muted (M)', VIEW.width - 16, VIEW.height - 16, 12, 'rgba(255,255,255,0.7)', 'right', 'normal');
}
