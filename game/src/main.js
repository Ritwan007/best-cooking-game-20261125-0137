// Kilat Kitchen bootstrap: canvas setup, the loop, query params.
// ?shot=cover|rush|serve|results renders one frozen staged frame for the
// screenshots; ?selftest=1 runs a scripted play-through and reports it on
// window.__selftest. Otherwise the game plays live.
import { VIEW } from './config.js';
import { createSoundBank } from './audio.js';
import { createInput } from './input.js';
import { createGame } from './game.js';
import { renderGame } from './render.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const params = new URLSearchParams(window.location.search);
const sounds = createSoundBank();
const input = createInput(canvas);
const { game, reset, update, handleKey } = createGame(sounds);

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyM' || event.code === 'KeyR') handleKey(event.code);
  if (event.code === 'KeyM' || event.code === 'KeyR' || event.code === 'Space') sounds.unlock();
});
canvas.addEventListener('mousedown', () => sounds.unlock());

function fitCanvas() {
  const scale = Math.min(window.innerWidth / VIEW.width, window.innerHeight / VIEW.height);
  canvas.style.width = `${Math.floor(VIEW.width * scale)}px`;
  canvas.style.height = `${Math.floor(VIEW.height * scale)}px`;
}
window.addEventListener('resize', fitCanvas);
fitCanvas();

// Exposed for automated play-tests: the live state and the input hooks.
window.KILAT = { game, input, reset };

const shot = params.get('shot');
if (shot) {
  stageShot(shot, game);
  renderGame(ctx, game, 1000);
  window.__shotReady = true;
} else if (params.get('selftest') === '1') {
  runSelfTest();
} else {
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt, input);
    input.consume();
    renderGame(ctx, game, now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// A scripted play-through of one full order, driven through the same input
// hooks a player uses, so a headless run can prove the loop works: it reads
// the first ticket and cooks exactly that dish — plate, bun, chop, grill,
// assemble, serve — then reports what happened on window.__selftest.
// Clicking a station walks the chef there and uses it on arrival, so a
// plain goTo IS the interaction for bins, plates, assembly and serve;
// E is only pressed for the repeated actions (chopping, grill pickup).
async function runSelfTest() {
  const log = [];
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  async function goTo(x, y) {
    input.clickAt(x, y);
    for (let i = 0; i < 240; i += 1) {
      update(1 / 60, input);
      input.consume();
      renderGame(ctx, game, performance.now());
      if (!game.chef.moveTarget) break;
      await sleep(16);
    }
    // One more beat so the arrival interaction has landed.
    update(1 / 60, input);
    input.consume();
  }
  async function pressE() {
    input.press('KeyE');
    update(1 / 60, input);
    input.consume();
    await sleep(30);
  }
  async function step(dt, seconds) {
    const n = Math.round(seconds / dt);
    for (let i = 0; i < n; i += 1) {
      update(dt, input);
      input.consume();
      if (i % 30 === 0) renderGame(ctx, game, performance.now());
      await sleep(5);
    }
  }
  // Where each ingredient comes from: bin click point, and how to process it.
  const FETCH = {
    bun: { bin: [95, 186], process: 'carry' },
    cheese: { bin: [623, 186], process: 'carry' },
    lettuce: { bin: [359, 186], process: 'chop' },
    tomato: { bin: [491, 186], process: 'chop' },
    onion: { bin: [755, 186], process: 'chop' },
    patty: { bin: [227, 186], process: 'grill' },
  };
  try {
    input.press('Enter');
    update(1 / 60, input);
    input.consume();
    log.push(`screen=${game.screen}`);
    const order = game.orders.orders[0];
    if (!order) throw new Error('no first order');
    log.push(`first-order=${order.name} items=${order.items.join(',')}`);
    // Plate onto the assembly counter (click picks it up, click puts it down).
    await goTo(102, 480);
    log.push(`carry-after-plates=${JSON.stringify(game.chef.carry)}`);
    await goTo(790, 368);
    log.push(`assembly-plate=${JSON.stringify(game.assembly.plate)}`);
    for (const item of order.items) {
      const fetch = FETCH[item];
      await goTo(fetch.bin[0], fetch.bin[1]);
      if (fetch.process === 'chop') {
        await goTo(152, 368); // place on the board on arrival
        await pressE(); // chop 1
        await pressE(); // chop 2
        await pressE(); // chop 3
        await pressE(); // pick the chopped piece up
      } else if (fetch.process === 'grill') {
        await goTo(471, 368); // patty onto the grill on arrival
        await step(1 / 60, 6); // wait for it to cook
        await pressE(); // pick the cooked patty up
      }
      log.push(`carry-${item}=${JSON.stringify(game.chef.carry)}`);
      await goTo(790, 368); // add it to the plate on arrival
      log.push(`plate-now=${JSON.stringify(game.assembly.plate && game.assembly.plate.items)}`);
    }
    await goTo(790, 368); // pick the finished plate up on arrival
    log.push(`carry-plate=${JSON.stringify(game.chef.carry)}`);
    await goTo(1172, 320); // serve on arrival
    log.push(`served=${game.served} score=${game.score} coins=${game.coins} orders-left=${game.orders.orders.length}`);
    window.__selftest = { ok: game.served >= 1, log };
  } catch (error) {
    window.__selftest = { ok: false, log, error: String(error) };
  }
}
