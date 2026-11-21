import sharp from 'sharp'
const [f, x1, y1, x2, y2, out] = process.argv.slice(2)
await sharp(`../design/references/${f}.webp`).extract({ left: +x1, top: +y1, width: x2 - x1, height: y2 - y1 }).resize({ width: (x2 - x1) * 3 }).png().toFile(out)
