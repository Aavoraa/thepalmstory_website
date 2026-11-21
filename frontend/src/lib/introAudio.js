/**
 * Ambient sound for the brand intro, generated with the Web Audio API.
 * Nothing is downloaded: wind, leaf rustle, whoosh, chime and a soft pad are
 * synthesised on the fly. Audio only starts after a user gesture (sound toggle).
 */
let ctx = null
let master = null
let bed = [] // looping sources to stop later

function noiseBuffer(ac, seconds = 2) {
  const b = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate)
  const d = b.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return b
}

/** Start the ambient bed (wind + rustle + pad). Safe to call repeatedly. */
export function startIntroAudio() {
  if (ctx) {
    ctx.resume()
    master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.3)
    return
  }
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)
  master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.4)

  // wind: band-passed noise with a slow swell
  const wind = ctx.createBufferSource()
  wind.buffer = noiseBuffer(ctx, 4)
  wind.loop = true
  const wf = ctx.createBiquadFilter()
  wf.type = 'bandpass'
  wf.frequency.value = 420
  wf.Q.value = 0.6
  const wg = ctx.createGain()
  wg.gain.value = 0.05
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.18
  const lg = ctx.createGain()
  lg.gain.value = 0.03
  lfo.connect(lg).connect(wg.gain)
  wind.connect(wf).connect(wg).connect(master)
  wind.start()
  lfo.start()

  // leaf rustle: high, gated noise
  const rustle = ctx.createBufferSource()
  rustle.buffer = noiseBuffer(ctx, 3)
  rustle.loop = true
  const rf = ctx.createBiquadFilter()
  rf.type = 'highpass'
  rf.frequency.value = 3200
  const rg = ctx.createGain()
  rg.gain.value = 0.006
  const rl = ctx.createOscillator()
  rl.frequency.value = 0.7
  const rlg = ctx.createGain()
  rlg.gain.value = 0.006
  rl.connect(rlg).connect(rg.gain)
  rustle.connect(rf).connect(rg).connect(master)
  rustle.start()
  rl.start()

  // soft pad: a warm open fifth with gentle detune
  ;[110, 164.81, 220.5].forEach((f, i) => {
    const o = ctx.createOscillator()
    o.type = i === 1 ? 'triangle' : 'sine'
    o.frequency.value = f
    const g = ctx.createGain()
    g.gain.value = 0
    g.gain.setTargetAtTime(0.022, ctx.currentTime + 0.3, 1.5)
    o.connect(g).connect(master)
    o.start()
    bed.push(o)
  })

  bed.push(wind, lfo, rustle, rl)
}

/** Short airy whoosh (scene transitions) */
export function whoosh(delay = 0) {
  if (!ctx) return
  const t = ctx.currentTime + delay
  const n = ctx.createBufferSource()
  n.buffer = noiseBuffer(ctx, 1.2)
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = 1.2
  f.frequency.setValueAtTime(300, t)
  f.frequency.exponentialRampToValueAtTime(2400, t + 0.7)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(0.12, t + 0.35)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1)
  n.connect(f).connect(g).connect(master)
  n.start(t)
  n.stop(t + 1.2)
}

/** Delicate metallic chime (logo complete) */
export function chime(delay = 0) {
  if (!ctx) return
  const t = ctx.currentTime + delay
  ;[[1318.5, 0.05], [1975.5, 0.03], [2637, 0.018], [3951, 0.008]].forEach(([f, v]) => {
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = f
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(v, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4)
    o.connect(g).connect(master)
    o.start(t)
    o.stop(t + 2.5)
  })
}

/** Fade everything out and release the audio device */
export function stopIntroAudio(fade = 1.2) {
  if (!ctx) return
  const c = ctx
  master.gain.setTargetAtTime(0, c.currentTime, fade / 4)
  setTimeout(() => {
    bed.forEach((n) => {
      try {
        n.stop()
      } catch {
        /* already stopped */
      }
    })
    bed = []
    c.close()
  }, fade * 1000 + 200)
  ctx = null
}

export function muteIntroAudio() {
  if (ctx) master.gain.setTargetAtTime(0, ctx.currentTime, 0.15)
}
