// Generates transparent logo variants from public/images/logo/logo-full.webp
import sharp from 'sharp';
const src = 'public/images/logo/logo-full.webp';
const meta = await sharp(src).metadata();
console.log(meta.width, meta.height);
async function variant(region, out, { light = false } = {}) {
  const { data, info } = await sharp(src).extract(region).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // sample background from top-left corner
  const bg = [data[0], data[1], data[2]];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const d = Math.sqrt((r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2);
    let a = Math.max(0, Math.min(1, (d - 14) / 46));
    data[i + 3] = Math.round(a * 255);
    if (light) {
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum < 110 && Math.abs(r - g) > 15) { data[i] = 244; data[i + 1] = 232; data[i + 2] = 213; }
      else if (lum < 80) { data[i] = 244; data[i + 1] = 232; data[i + 2] = 213; }
    }
  }
  await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(out);
  console.log('wrote', out);
}
const W = meta.width, H = meta.height, s = W / 1254;
const mark = { left: Math.round(390 * s), top: Math.round(100 * s), width: Math.round(470 * s), height: Math.round(600 * s) };
const full = { left: Math.round(180 * s), top: Math.round(95 * s), width: Math.round(900 * s), height: Math.round(940 * s) };
await variant(mark, 'public/images/logo/mark.png');
await variant(mark, 'public/images/logo/mark-light.png', { light: true });
await variant(full, 'public/images/logo/logo.png');
await variant(full, 'public/images/logo/logo-light.png', { light: true });
await sharp('public/images/logo/mark.png').resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile('public/favicon.png');
