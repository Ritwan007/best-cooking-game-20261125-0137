// Keyboard and mouse, in one place. The game reads `held` for movement and
// consumes `pressed` edges for one-shot actions like interacting.
const MOVE_KEYS = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
};

export function createInput(canvas) {
  const held = new Set();
  const pressed = new Set();
  const mouse = { x: 0, y: 0, clicked: false, clickX: 0, clickY: 0 };

  function toGameCoords(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    if (MOVE_KEYS[event.code]) held.add(MOVE_KEYS[event.code]);
    if (event.code === 'KeyE' || event.code === 'Space' || event.code === 'Enter') pressed.add(event.code);
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
  });
  window.addEventListener('keyup', (event) => {
    if (MOVE_KEYS[event.code]) held.delete(MOVE_KEYS[event.code]);
  });
  canvas.addEventListener('mousemove', (event) => {
    const p = toGameCoords(event);
    mouse.x = p.x;
    mouse.y = p.y;
  });
  canvas.addEventListener('mousedown', (event) => {
    const p = toGameCoords(event);
    mouse.x = p.x;
    mouse.y = p.y;
    mouse.clicked = true;
    mouse.clickX = p.x;
    mouse.clickY = p.y;
  });

  return {
    held,
    mouse,
    interactPressed() {
      return pressed.has('KeyE') || pressed.has('Space');
    },
    confirmPressed() {
      return pressed.has('Enter') || pressed.has('Space');
    },
    consume() {
      pressed.clear();
      mouse.clicked = false;
    },
    // Test hooks: let an automated play-test press keys without a real keyboard.
    press(code) { pressed.add(code); if (MOVE_KEYS[code]) held.add(MOVE_KEYS[code]); },
    release(code) { held.delete(MOVE_KEYS[code]); },
    clickAt(x, y) { mouse.clicked = true; mouse.clickX = x; mouse.clickY = y; mouse.x = x; mouse.y = y; },
  };
}
