// All sound is synthesised with WebAudio: short oscillator blips and filtered
// noise bursts. No audio files, no network, nothing to load.
export function createSoundBank() {
  let context = null;
  let muted = false;

  function ensure() {
    if (context) return context;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new AudioContext();
    } catch {
      context = null;
    }
    return context;
  }

  function tone(freq, seconds, type, gainValue, slideTo) {
    const ctx = ensure();
    if (!ctx || muted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + seconds);
    gain.gain.setValueAtTime(gainValue, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + seconds + 0.02);
  }

  function noise(seconds, gainValue, lowpass) {
    const ctx = ensure();
    if (!ctx || muted) return;
    const now = ctx.currentTime;
    const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = lowpass;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainValue, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
  }

  return {
    unlock() {
      const ctx = ensure();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    chop() { noise(0.09, 0.5, 900); tone(180, 0.07, 'square', 0.12, 90); },
    pickup() { tone(520, 0.08, 'sine', 0.18, 700); },
    place() { tone(340, 0.08, 'sine', 0.18, 260); },
    sizzle() { noise(0.35, 0.12, 3200); },
    ding() { tone(880, 0.18, 'sine', 0.25); tone(1318, 0.3, 'sine', 0.2); },
    coin() { tone(988, 0.09, 'triangle', 0.22); tone(1319, 0.16, 'triangle', 0.22); },
    buzz() { tone(140, 0.3, 'sawtooth', 0.2, 90); },
    tick() { tone(1050, 0.05, 'square', 0.1); },
    click() { tone(660, 0.05, 'sine', 0.15); },
    fanfare() {
      tone(523, 0.12, 'triangle', 0.22);
      setTimeout(() => tone(659, 0.12, 'triangle', 0.22), 120);
      setTimeout(() => tone(784, 0.2, 'triangle', 0.25), 240);
    },
  };
}
