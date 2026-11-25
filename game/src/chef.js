// The chef: position, facing, what they carry, and click-to-move.
// Movement is plain velocity in the walkable floor; stations stop nobody,
// the chef walks around them by steering, not by collision.
import { CHEF_RADIUS, CHEF_SPEED, FLOOR, VIEW } from './config.js';

export function createChef() {
  const chef = {
    x: VIEW.width / 2,
    y: 600,
    facing: 'up',
    moveTarget: null,
    // carry: null, or { kind: 'item', id } or { kind: 'plate', items: [] }
    carry: null,
    walking: false,
    bob: 0,
  };

  function clampToFloor() {
    chef.x = Math.min(FLOOR.x + FLOOR.width - CHEF_RADIUS, Math.max(FLOOR.x + CHEF_RADIUS, chef.x));
    chef.y = Math.min(FLOOR.y + FLOOR.height - CHEF_RADIUS, Math.max(FLOOR.y + CHEF_RADIUS, chef.y));
  }

  return {
    chef,
    reset(x, y) {
      chef.x = x;
      chef.y = y;
      chef.facing = 'up';
      chef.moveTarget = null;
      chef.carry = null;
      chef.walking = false;
    },
    moveTo(x, y) {
      chef.moveTarget = { x, y };
    },
    stop() {
      chef.moveTarget = null;
    },
    update(dt, input) {
      let dx = 0;
      let dy = 0;
      if (input.held.has('up')) dy -= 1;
      if (input.held.has('down')) dy += 1;
      if (input.held.has('left')) dx -= 1;
      if (input.held.has('right')) dx += 1;
      if (dx !== 0 || dy !== 0) {
        chef.moveTarget = null;
        const len = Math.hypot(dx, dy);
        chef.x += (dx / len) * CHEF_SPEED * dt;
        chef.y += (dy / len) * CHEF_SPEED * dt;
        chef.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
        chef.walking = true;
      } else if (chef.moveTarget) {
        const tx = chef.moveTarget.x - chef.x;
        const ty = chef.moveTarget.y - chef.y;
        const dist = Math.hypot(tx, ty);
        if (dist < 6) {
          chef.moveTarget = null;
          chef.walking = false;
        } else {
          chef.x += (tx / dist) * CHEF_SPEED * dt;
          chef.y += (ty / dist) * CHEF_SPEED * dt;
          chef.facing = Math.abs(tx) > Math.abs(ty) ? (tx > 0 ? 'right' : 'left') : (ty > 0 ? 'down' : 'up');
          chef.walking = true;
        }
      } else {
        chef.walking = false;
      }
      if (chef.walking) chef.bob += dt * 11;
      clampToFloor();
    },
  };
}
