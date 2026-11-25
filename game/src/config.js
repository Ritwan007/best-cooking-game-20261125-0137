// Kilat Kitchen: every tunable number, the kitchen layout and the menu.
// One job: hold the constants the rest of the game reads. Nothing here runs.
export const VIEW = { width: 1280, height: 720 };
export const HUD_HEIGHT = 108;
export const SHIFT_SECONDS = 150;
export const CHEF_SPEED = 270;
export const CHEF_RADIUS = 22;
export const INTERACT_PAD = 52;

// The walkable floor, inside the kitchen walls.
export const FLOOR = { x: 16, y: 124, width: 1248, height: 580 };

// Ingredient catalogue. `chop` names the item a raw ingredient becomes on the
// board; `grill` names what a raw patty becomes on the grill. `plateReady`
// items may go straight onto a plate.
export const INGREDIENTS = {
  bun:        { name: 'Bun',        color: '#e8b06a', plateReady: true },
  pattyRaw:   { name: 'Raw Patty',  color: '#b0563c', grill: 'patty' },
  patty:      { name: 'Patty',      color: '#7a4a28', plateReady: true },
  pattyBurnt: { name: 'Burnt Patty',color: '#2b2118', plateReady: false },
  lettuceRaw: { name: 'Lettuce',    color: '#7cc24a', chop: 'lettuce' },
  lettuce:    { name: 'Lettuce',    color: '#8fd45e', plateReady: true },
  tomatoRaw:  { name: 'Tomato',     color: '#d84a35', chop: 'tomato' },
  tomato:     { name: 'Tomato',     color: '#e8604a', plateReady: true },
  cheese:     { name: 'Cheese',     color: '#f5c542', plateReady: true },
  onionRaw:   { name: 'Onion',      color: '#c9a7d8', chop: 'onion' },
  onion:      { name: 'Onion',      color: '#e3d3f0', plateReady: true },
};

// The menu: every dish an order can ask for. `items` are plate-ready ids.
export const DISHES = {
  burger: { name: 'Kilat Burger', price: 8,  items: ['bun', 'patty', 'lettuce'] },
  cheese: { name: 'Cheese Melt',  price: 9,  items: ['bun', 'patty', 'cheese'] },
  garden: { name: 'Garden Stack', price: 7,  items: ['bun', 'lettuce', 'tomato', 'cheese'] },
  smash:  { name: 'Onion Smash',  price: 11, items: ['bun', 'patty', 'onion', 'cheese'] },
  salad:  { name: 'Crisp Salad',  price: 6,  items: ['lettuce', 'tomato', 'onion'] },
};
export const DISH_IDS = ['burger', 'cheese', 'garden', 'smash', 'salad'];

// Station layout. Bins sit along the top wall; the work stations in the
// middle; plates, serve window and trash around the edges.
export const STATIONS = [
  { id: 'bin-bun',        kind: 'bin',      gives: 'bun',        label: 'Buns',    x: 36,  y: 124, w: 118, h: 62 },
  { id: 'bin-patty',      kind: 'bin',      gives: 'pattyRaw',   label: 'Patties', x: 168, y: 124, w: 118, h: 62 },
  { id: 'bin-lettuce',    kind: 'bin',      gives: 'lettuceRaw', label: 'Lettuce', x: 300, y: 124, w: 118, h: 62 },
  { id: 'bin-tomato',     kind: 'bin',      gives: 'tomatoRaw',  label: 'Tomato',  x: 432, y: 124, w: 118, h: 62 },
  { id: 'bin-cheese',     kind: 'bin',      gives: 'cheese',     label: 'Cheese',  x: 564, y: 124, w: 118, h: 62 },
  { id: 'bin-onion',      kind: 'bin',      gives: 'onionRaw',   label: 'Onion',   x: 696, y: 124, w: 118, h: 62 },
  { id: 'board',          kind: 'board',    label: 'Chop Board', x: 36,  y: 250, w: 232, h: 118 },
  { id: 'grill',          kind: 'grill',    label: 'Grill',      x: 330, y: 250, w: 282, h: 118 },
  { id: 'assembly',       kind: 'assembly', label: 'Assembly',   x: 674, y: 250, w: 232, h: 118 },
  { id: 'plates',         kind: 'plates',   label: 'Plates',     x: 36,  y: 430, w: 132, h: 100 },
  { id: 'serve',          kind: 'serve',    label: 'Serve Window', x: 1100, y: 230, w: 144, h: 180 },
  { id: 'trash',          kind: 'trash',    label: 'Trash',      x: 1100, y: 470, w: 144, h: 100 },
];

export const GRILL_COOK_SECONDS = 5;
export const GRILL_BURN_SECONDS = 11;
export const CHOP_HITS = 3;
export const PALETTE = {
  wall: '#f7e8cf',
  wallTrim: '#e0c69a',
  floorA: '#e9d3ae',
  floorB: '#dfc294',
  counterTop: '#b98a56',
  counterFront: '#8a5a33',
  steel: '#9aa5ad',
  steelDark: '#6e7a82',
  ink: '#2e2118',
  cream: '#fff8ea',
  accent: '#e4572e',
  accentDark: '#b93a1a',
  gold: '#f5c542',
  green: '#4c9a3f',
  red: '#d84a35',
};
