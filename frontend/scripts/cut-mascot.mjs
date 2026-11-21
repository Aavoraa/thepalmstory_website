// Cuts the mascot poses out of ../design/references/mascot.webp onto transparent backgrounds.
// Flood-fills the cream background inward from the crop edges, so white eye
// highlights inside the character are kept.
import sharp from 'sharp'

const SRC = '../design/references/mascot.webp'
// background colour sampled from a clean area of the sheet
const BG = sharp(SRC).extract({ left: 700, top: 640, width: 1, height: 1 }).raw().toBuffer().then((b) => [b[0], b[1], b[2]])
const CROPS = {
  main: [40, 15, 665, 770, [[0, 0, 190, 105]]], // [x1,y1,x2,y2, eraseRects(relative)]
  happy: [735, 86, 962, 292],
  surprised: [992, 66, 1232, 292],
  wink: [1252, 66, 1492, 292],
  thinking: [700, 338, 962, 570],
  excited: [955, 340, 1242, 570],
  laughing: [1252, 340, 1508, 570],
  front: [622, 688, 832, 925],
}

async function cut(name, [x1, y1, x2, y2, erase = []]) {
  const w = x2 - x1, h = y2 - y1
  const { data } = await sharp(SRC).extract({ left: x1, top: y1, width: w, height: h }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const bg = await BG
  for (const [ex, ey, ew, eh] of erase) for (let y = ey; y < ey + eh; y++) for (let x = ex; x < ex + ew; x++) { const i = (y * w + x) * 4; data[i] = bg[0]; data[i + 1] = bg[1]; data[i + 2] = bg[2] }
  const dist = (i) => Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2])
  const TOL = 62
  const seen = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x)
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1)
  while (stack.length) {
    const p = stack.pop()
    if (seen[p]) continue
    const i = p * 4
    if (dist(i) > TOL) continue
    seen[p] = 1
    const x = p % w, y = (p / w) | 0
    if (x > 0) stack.push(p - 1)
    if (x < w - 1) stack.push(p + 1)
    if (y > 0) stack.push(p - w)
    if (y < h - 1) stack.push(p + w)
  }
  // background -> transparent, with a soft 1px edge
  for (let p = 0; p < w * h; p++) {
    if (seen[p]) { data[p * 4 + 3] = 0; continue }
    const x = p % w, y = (p / w) | 0
    const nb = (x > 0 && seen[p - 1]) || (x < w - 1 && seen[p + 1]) || (y > 0 && seen[p - w]) || (y < h - 1 && seen[p + w])
    if (nb) data[p * 4 + 3] = Math.min(255, Math.round((dist(p * 4) / TOL) * 160))
  }
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim().png({ compressionLevel: 9 }).toFile(`public/images/mascot/${name}.png`) // then converted to .webp (height 260, main 520)
}

for (const [n, c] of Object.entries(CROPS)) await cut(n, c)
console.log('done')
