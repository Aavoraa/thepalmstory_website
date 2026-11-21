// Extracts the food/brand photography from the reference screenshots in ../design/references/
// into public/images/*. Screenshots are low-resolution, so crops are upscaled —
// replace with original photo files when available (same file names).
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const C = [
  // [screenshot, left, top, right, bottom, output]
  [7, 33, 142, 343, 314, 'products/karupatti-mysore-pak.jpg'],
  [5, 29, 402, 219, 522, 'products/karupatti-mysore-pak-2.jpg'],
  [5, 232, 402, 422, 522, 'products/karupatti-halwa.jpg'],
  [7, 34, 1596, 154, 1700, 'products/karupatti-halwa-2.jpg'],
  [5, 436, 402, 625, 522, 'products/athi-palam-karupatti-halwa.jpg'],
  [7, 469, 1584, 589, 1675, 'products/athi-palam-karupatti-halwa-2.jpg'],
  [5, 249, 729, 406, 827, 'products/nattu-sarkarai-laddu.jpg'],
  [5, 436, 716, 625, 836, 'products/banana-appichakara-halwa.jpg'],
  [5, 29, 1027, 219, 1147, 'products/palm-jaggery-peda.jpg'],
  [5, 232, 1027, 422, 1147, 'products/palm-badam-katli.jpg'],
  [6, 31, 755, 150, 866, 'products/karupatti-laddu.jpg'],
  [5, 29, 716, 219, 836, 'products/signature-hamper.jpg'],
  [7, 336, 1596, 444, 1700, 'products/heritage-sweet-tin.jpg'],
  [6, 277, 1331, 500, 1451, 'products/festive-celebration-box.jpg'],
  [6, 204, 465, 340, 552, 'products/karupatti-plum-cake.jpg'],
  [6, 374, 465, 509, 552, 'products/kai-murukku.jpg'],
  [6, 35, 465, 171, 552, 'categories/sweets.jpg'],
  [6, 204, 465, 340, 552, 'categories/cakes.jpg'],
  [6, 374, 465, 509, 552, 'categories/savories.jpg'],
  [7, 28, 1326, 209, 1400, 'story/story-1.jpg'],
  [7, 220, 1326, 403, 1400, 'story/story-2.jpg'],
  [5, 436, 716, 625, 836, 'story/story-3.jpg'],
  [7, 414, 1326, 596, 1400, 'story/story-4.jpg'],
  [6, 277, 1331, 500, 1451, 'story/story-5.jpg'],
  [6, 31, 755, 150, 866, 'banners/banner-1.jpg'],
  [7, 28, 1326, 209, 1400, 'banners/banner-2.jpg'],
  [5, 232, 402, 422, 522, 'banners/banner-3.jpg'],
  [7, 220, 1326, 403, 1400, 'banners/banner-4.jpg'],
  [6, 277, 1331, 500, 1451, 'banners/banner-5.jpg'],
  [6, 277, 1331, 500, 1451, 'brand/gifting.jpg'],
  [7, 414, 1326, 596, 1400, 'brand/about.jpg'],
  [7, 33, 142, 343, 314, 'brand/about-2.jpg'],
  [7, 28, 1326, 209, 1400, 'brand/craft-1.jpg'],
  [7, 220, 1326, 403, 1400, 'brand/craft-2.jpg'],
  [7, 414, 1326, 596, 1400, 'brand/craft-3.jpg'],
]

for (const [f, l, t, r, b, out] of C) {
  const dir = `public/images/${out.split('/')[0]}`
  mkdirSync(dir, { recursive: true })
  const w = r - l, h = b - t
  await sharp(`../design/references/${f}.webp`)
    .extract({ left: l, top: t, width: w, height: h })
    .resize({ width: Math.max(1200, w * 4), kernel: 'lanczos3' })
    .sharpen({ sigma: 1.1 })
    .modulate({ saturation: 1.02 })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`public/images/${out}`)
}
console.log('extracted', C.length)
