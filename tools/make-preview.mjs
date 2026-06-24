// Generates assets/preview.svg — a faithful illustration of the heart finale,
// using the same palette, brick math, and heart art as the game itself.
import { writeFileSync, mkdirSync } from 'node:fs';

const P = {
  cream: '#F7F3EC', bg: '#1C1917', card: '#FDFBF7', border: '#E7E1D8',
  boardBorder: '#3D3835', ivory: '#F7F3EC', parchment: '#EDE8DF',
  ink: '#1C1917', inkLight: '#57534E', inkFaint: '#A8A29E',
  blush: '#D4929A', blushLight: '#E4B5BB', terracotta: '#C2704E', sage: '#5F7A5E',
};

const W = 800, H = 600, COLS = 12, BW = 58, BH = 18, PAD = 5, TOP = 56;
const LEFT = (W - (COLS * (BW + PAD) - PAD)) / 2;
const ROWS = 9;

const HEART = [
  '..xxxx..xxxx..',
  '.xxxxxx.xxxxxx',
  'xxxxxxxxxxxxxx',
  'xxxxxxxxxxxxxx',
  '.xxxxxxxxxxxx.',
  '..xxxxxxxxxx..',
  '...xxxxxxxx...',
  '....xxxxxx....',
  '.....xxxx.....',
  '......xx......',
];
const isHeart = (r, c) => {
  if (r >= HEART.length) return false;
  const idx = c + Math.floor((14 - COLS) / 2);
  return idx >= 0 && idx < HEART[r].length && HEART[r][idx] === 'x';
};

const PADX = 40, PADY = 36; // board offset inside the cream frame
const SW = W + PADX * 2, SH = H + PADY * 2 + 48; // room for a footer line

let bricks = '';
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (!isHeart(r, c)) continue;
    const x = LEFT + c * (BW + PAD);
    const y = TOP + r * (BH + PAD);
    bricks +=
      `<rect x="${x}" y="${y}" width="${BW}" height="${BH}" rx="4" fill="${P.blush}"/>` +
      `<rect x="${x}" y="${y}" width="${BW}" height="${BH / 2}" rx="4" fill="${P.blushLight}" opacity="0.25"/>` +
      `<rect x="${x}" y="${y}" width="${BW}" height="${BH}" rx="4" fill="none" stroke="${P.blushLight}" stroke-width="1" opacity="0.35"/>`;
  }
}

// faint grid
let grid = '';
for (let x = 0; x < W; x += 63) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
for (let y = 0; y < H; y += 63) grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;

// ball with a little trail
const bx = 520, by = 372;
let trail = '';
for (let i = 1; i <= 7; i++) {
  const t = i / 8;
  trail += `<circle cx="${bx - i * 9}" cy="${by + i * 7}" r="${6 * t}" fill="${P.ivory}" opacity="${t * 0.3}"/>`;
}

const paddleW = 124, paddleX = 452, paddleY = H - 46;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SW} ${SH}" font-family="'Outfit', system-ui, sans-serif">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#1C1917" flood-opacity="0.14"/>
    </filter>
    <filter id="glow"><feGaussianBlur stdDeviation="4"/></filter>
  </defs>

  <rect width="${SW}" height="${SH}" fill="${P.cream}"/>

  <g transform="translate(${PADX} ${PADY})">
    <rect width="${W}" height="${H}" rx="14" fill="${P.bg}" stroke="${P.border}" filter="url(#shadow)"/>
    <clipPath id="board"><rect width="${W}" height="${H}" rx="14"/></clipPath>
    <g clip-path="url(#board)">
      <g stroke="${P.boardBorder}" stroke-width="0.6">${grid}</g>

      <!-- faint signature -->
      <text x="${W / 2}" y="${H / 2 + 78}" text-anchor="middle" font-family="'Newsreader', Georgia, serif"
            font-size="64" font-weight="300" fill="${P.blush}" opacity="0.07">F + I</text>

      <!-- the heart -->
      ${bricks}

      <!-- ball + trail -->
      ${trail}
      <circle cx="${bx}" cy="${by}" r="9" fill="${P.ivory}" opacity="0.5" filter="url(#glow)"/>
      <circle cx="${bx}" cy="${by}" r="6" fill="${P.ivory}"/>

      <!-- paddle -->
      <rect x="${paddleX}" y="${paddleY}" width="${paddleW}" height="12" rx="6" fill="${P.ivory}"/>

      <!-- HUD bar -->
      <rect x="0" y="0" width="${W}" height="46" fill="${P.card}" opacity="0.96"/>
      <line x1="0" y1="46" x2="${W}" y2="46" stroke="${P.border}"/>
      <text x="24" y="29" font-size="12" letter-spacing="1.2" fill="${P.inkFaint}">SCORE
        <tspan font-family="'Newsreader', Georgia, serif" font-size="18" fill="${P.ink}" letter-spacing="0" dx="6">12,480</tspan></text>
      <text x="360" y="29" font-size="12" letter-spacing="1.2" fill="${P.inkFaint}">LEVEL
        <tspan font-family="'Newsreader', Georgia, serif" font-size="18" fill="${P.ink}" letter-spacing="0" dx="6">8</tspan></text>
      <text x="470" y="29" font-size="12" letter-spacing="1.2" fill="${P.inkFaint}">LIVES
        <tspan font-family="'Newsreader', Georgia, serif" font-size="18" fill="${P.ink}" letter-spacing="0" dx="6">3</tspan></text>
      <circle cx="${W - 58}" cy="23" r="17" fill="${P.card}" stroke="${P.border}"/>
      <rect x="${W - 62}" y="17" width="3.5" height="12" rx="1" fill="${P.inkLight}"/>
      <rect x="${W - 55}" y="17" width="3.5" height="12" rx="1" fill="${P.inkLight}"/>
      <circle cx="${W - 22}" cy="23" r="17" fill="${P.card}" stroke="${P.border}"/>
      <path d="M ${W - 30} 20 h3 l4 -3 v12 l-4 -3 h-3 z" fill="${P.inkLight}"/>
      <path d="M ${W - 18} 18 a4 4 0 0 1 0 10" fill="none" stroke="${P.inkLight}" stroke-width="1.6" stroke-linecap="round"/>
    </g>
  </g>

  <text x="${SW / 2}" y="${SH - 20}" text-anchor="middle" font-size="14" fill="${P.inkFaint}"
        letter-spacing="0.4">A small game, made with love · Isfar &amp; Chonkie</text>
</svg>
`;

mkdirSync(new URL('../assets/', import.meta.url), { recursive: true });
writeFileSync(new URL('../assets/preview.svg', import.meta.url), svg);
console.log('wrote assets/preview.svg');
