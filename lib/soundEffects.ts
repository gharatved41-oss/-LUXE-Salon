// Web Audio API Synthesized Retro Indian Salon Sound FX
// Zero external audio asset dependencies — guaranteed to work in any browser

class SoundFX {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    // Lazy initialized on first user interaction to comply with browser autoplay policies
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  // 1. Retro Brass Counter Shop Bell ("Ting-Ting!")
  public playShopBell() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime

    // First Ding (Bright brass strike)
    this.createBellNote(ctx, 2093.0, now, 0.35, 0.4) // C7
    // Second Ding slightly higher for cheerful shop vibe
    this.createBellNote(ctx, 2637.02, now + 0.1, 0.4, 0.6) // E7
  }

  private createBellNote(ctx: AudioContext, freq: number, startTime: number, volume: number, duration: number) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, startTime)

    // Harmonics for brassy metal ring
    const oscHarmonic = ctx.createOscillator()
    const gainHarmonic = ctx.createGain()
    oscHarmonic.type = 'triangle'
    oscHarmonic.frequency.setValueAtTime(freq * 2.76, startTime)

    gain.gain.setValueAtTime(volume, startTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

    gainHarmonic.gain.setValueAtTime(volume * 0.3, startTime)
    gainHarmonic.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.6)

    osc.connect(gain)
    oscHarmonic.connect(gainHarmonic)
    gain.connect(ctx.destination)
    gainHarmonic.connect(ctx.destination)

    osc.start(startTime)
    oscHarmonic.start(startTime)
    osc.stop(startTime + duration)
    oscHarmonic.stop(startTime + duration)
  }

  // 2. Rubber Ink Stamp Thud ("Thump-Click!")
  public playStampThud() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Heavy low thud
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12)

    gain.gain.setValueAtTime(0.6, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.15)

    // Wood snap click
    const click = ctx.createOscillator()
    const clickGain = ctx.createGain()
    click.type = 'square'
    click.frequency.setValueAtTime(800, now)
    click.frequency.exponentialRampToValueAtTime(100, now + 0.04)

    clickGain.gain.setValueAtTime(0.3, now)
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    click.connect(clickGain)
    clickGain.connect(ctx.destination)
    click.start(now)
    click.stop(now + 0.05)
  }

  // 3. Queue Advance / Tatkal Priority Alert
  public playQueueAlert() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const freqs = [523.25, 659.25, 783.99] // C5, E5, G5 major triad

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(f, now + idx * 0.08)

      gain.gain.setValueAtTime(0.25, now + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.35)
    })
  }

  // 4. Delay Buffer Alert (+5m click)
  public playBufferTick() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.08)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.1)
  }
}

export const soundFx = new SoundFX()
