import Lenis from 'lenis'

// One Lenis instance for the entire site, started once from App.jsx. Anything
// that needs to react to smooth-scrolled position (like ScrollStack's pin
// math) taps into this same instance via `getLenis()` instead of creating
// its own — two competing Lenis instances fighting over window scroll causes
// visible jank.
let lenis = null
let rafId = null

export const getLenis = () => lenis

export const startSmoothScroll = () => {
  if (lenis) return lenis

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
    wheelMultiplier: 1,
    lerp: 0.1
  })

  const raf = (time) => {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  return lenis
}

export const stopSmoothScroll = () => {
  if (rafId) cancelAnimationFrame(rafId)
  if (lenis) lenis.destroy()
  lenis = null
  rafId = null
}
