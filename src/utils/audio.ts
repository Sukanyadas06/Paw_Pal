// Retro 8-bit Web Audio Synthesizer

class RetroAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled: boolean = true;
  private activeOscillators: Set<OscillatorNode> = new Set();
  private activeTimeouts: Set<ReturnType<typeof setTimeout>> = new Set();

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopAll();
        }
      });
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Stop all actively playing sounds & scheduled note timeouts
  public stopAll() {
    this.activeTimeouts.forEach((id) => clearTimeout(id));
    this.activeTimeouts.clear();

    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Already stopped
      }
    });
    this.activeOscillators.clear();
  }

  private registerOscillator(osc: OscillatorNode, stopTime: number) {
    this.activeOscillators.add(osc);
    osc.onended = () => {
      this.activeOscillators.delete(osc);
      try {
        osc.disconnect();
      } catch {}
    };
    try {
      osc.stop(stopTime);
    } catch {}
  }

  private registerTimeout(fn: () => void, delayMs: number) {
    const id = setTimeout(() => {
      this.activeTimeouts.delete(id);
      fn();
    }, delayMs);
    this.activeTimeouts.add(id);
    return id;
  }

  // Cute 8-bit bark sound
  public playBark() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      this.registerOscillator(osc, now + 0.14);

      // Second harmonic bark
      this.registerTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const now2 = this.ctx.currentTime;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(440, now2);
        osc2.frequency.exponentialRampToValueAtTime(200, now2 + 0.1);
        gain2.gain.setValueAtTime(0.2, now2);
        gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.1);
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(now2);
        this.registerOscillator(osc2, now2 + 0.1);
      }, 50);
    } catch {
      // Audio errors silenced
    }
  }

  // Retro button click / tick
  public playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      this.registerOscillator(osc, now + 0.04);
    } catch {}
  }

  // Task check / toggle sound
  public playToggle(checked: boolean) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      
      if (checked) {
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.09);
      } else {
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.07);
      }
      
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      this.registerOscillator(osc, now + 0.09);
    } catch {}
  }

  // Level up / Achievement unlock chime
  public playChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        this.registerOscillator(osc, now + 0.2);
      });
    } catch {}
  }

  // Munching / Feeding sound
  public playEat() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      [0, 0.08, 0.16].forEach((delay) => {
        this.registerTimeout(() => {
          if (!this.ctx || !this.masterGain) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(280 + Math.random() * 80, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now);
          this.registerOscillator(osc, now + 0.05);
        }, delay * 1000);
      });
    } catch {}
  }

  // Happy pet sound
  public playPet() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      this.registerOscillator(osc, now + 0.18);
    } catch {}
  }
}

export const audio = new RetroAudio();

