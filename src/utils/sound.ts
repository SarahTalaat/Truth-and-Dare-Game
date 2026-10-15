/**
 * High-fidelity Web Audio API sound effect engine for "Playful"
 * Zero external audio files required, instant latency, full offline support.
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  private volume: number = 0.8; // 0.0 to 1.0

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setVolume(level: number) {
    this.volume = Math.max(0, Math.min(1, level));
  }

  getVolume(): number {
    return this.volume;
  }

  // Soft pleasant click / bubble pop for UI taps
  playTap(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.05);

      const maxGain = 0.18 * this.volume;
      gain.gain.setValueAtTime(maxGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  // Satisfying TRUTH card reveal: mystical, crystal major chime arpeggio
  playTruthReveal(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Magical high crystal notes: F5, A5, C6, E6
      const freqs = [698.46, 880.0, 1046.5, 1318.51];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);

        const noteGain = 0.12 * this.volume;
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(noteGain, now + idx * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.045 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.4);
      });

      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(349.23, now);
      subGain.gain.setValueAtTime(0.08 * this.volume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.35);
    } catch {}
  }

  // Satisfying DARE card reveal: energetic, punchy rising fanfare with sub-kick
  playDareReveal(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Snappy punch kick
      const punchOsc = ctx.createOscillator();
      const punchGain = ctx.createGain();
      punchOsc.type = 'sine';
      punchOsc.frequency.setValueAtTime(160, now);
      punchOsc.frequency.exponentialRampToValueAtTime(45, now + 0.09);

      punchGain.gain.setValueAtTime(0.28 * this.volume, now);
      punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      punchOsc.connect(punchGain);
      punchGain.connect(ctx.destination);
      punchOsc.start(now);
      punchOsc.stop(now + 0.1);

      // Rising brass swoop
      const swoop = ctx.createOscillator();
      const swoopGain = ctx.createGain();
      swoop.type = 'sawtooth';
      swoop.frequency.setValueAtTime(293.66, now + 0.02);
      swoop.frequency.exponentialRampToValueAtTime(587.33, now + 0.14);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      swoopGain.gain.setValueAtTime(0, now);
      swoopGain.gain.setValueAtTime(0.14 * this.volume, now + 0.02);
      swoopGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      swoop.connect(filter);
      filter.connect(swoopGain);
      swoopGain.connect(ctx.destination);
      swoop.start(now + 0.02);
      swoop.stop(now + 0.32);

      // Bright sparkle top
      [880.0, 1174.66].forEach((f, idx) => {
        const topOsc = ctx.createOscillator();
        const topGain = ctx.createGain();
        topOsc.type = 'triangle';
        topOsc.frequency.setValueAtTime(f, now + 0.08 + idx * 0.04);
        topGain.gain.setValueAtTime(0.12 * this.volume, now + 0.08 + idx * 0.04);
        topGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        topOsc.connect(topGain);
        topGain.connect(ctx.destination);
        topOsc.start(now + 0.08 + idx * 0.04);
        topOsc.stop(now + 0.38);
      });
    } catch {}
  }

  // Rich celebratory fanfare for challenge completed
  playComplete(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Initial click pop
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'sine';
      click.frequency.setValueAtTime(900, now);
      click.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      clickGain.gain.setValueAtTime(0.2 * this.volume, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(now);
      click.stop(now + 0.04);

      // Major Arpeggio: C5, E5, G5, C6, E6
      const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      const spacing = 0.04;

      arpeggio.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === arpeggio.length - 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * spacing);

        const peakGain = (idx === arpeggio.length - 1 ? 0.22 : 0.14) * this.volume;
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(peakGain, now + idx * spacing);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + idx * spacing + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * spacing);
        osc.stop(now + idx * spacing + 0.45);
      });

      // Sustained root & 5th chord
      [261.63, 392.0].forEach(f => {
        const warmOsc = ctx.createOscillator();
        const warmGain = ctx.createGain();
        warmOsc.type = 'sine';
        warmOsc.frequency.setValueAtTime(f, now + 0.08);
        warmGain.gain.setValueAtTime(0.12 * this.volume, now + 0.08);
        warmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        warmOsc.connect(warmGain);
        warmGain.connect(ctx.destination);
        warmOsc.start(now + 0.08);
        warmOsc.stop(now + 0.55);
      });
    } catch {}
  }

  // Smooth card swap swoosh
  playCardFlip(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);

      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  // Gentle low skip cue
  playSkip(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.16);

      gain.gain.setValueAtTime(0.14 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // Sparkle tone for streak or unlock
  playSparkle(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.15 * this.volume, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.28);
      });
    } catch {}
  }

  // --- REACTION ENGINE SOUNDS ---

  // Cheering ("YAAAAAY!", "YOU DID IT!")
  playCheer(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Triumphant multi-chord cascade
      const chords = [
        [523.25, 659.25, 783.99], // C Major
        [587.33, 739.99, 880.0],  // D Major
        [659.25, 830.61, 987.77], // E Major
        [783.99, 987.77, 1174.66, 1567.98] // High G Major flourish
      ];

      chords.forEach((chord, cIdx) => {
        const startTime = now + cIdx * 0.07;
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.setValueAtTime(0.09 * this.volume, startTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.35);
        });
      });
    } catch {}
  }

  // Giggling / Laughing ("HAHAHA!")
  playGiggle(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Bouncy pitch hops
      const hops = [620, 780, 640, 820, 680, 860];
      hops.forEach((freq, idx) => {
        const startTime = now + idx * 0.06;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq - 60, startTime + 0.05);

        gain.gain.setValueAtTime(0.12 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.055);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.055);
      });
    } catch {}
  }

  // Surprise Pop ("WOOOOW!", "NO WAYYYY!", "PLOT TWIST!")
  playSurprisePop(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Whimsical pitch slide up and down
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.28);

      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  // Drumroll for tense moments
  playDrumroll(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const count = 10;
      for (let i = 0; i < count; i++) {
        const time = now + i * 0.035;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180 + Math.random() * 40, time);
        gain.gain.setValueAtTime(0.08 * (i / count + 0.3) * this.volume, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.03);
      }
    } catch {}
  }

  // Funny fail sound (playful "wah wah" slide)
  playFunnyFail(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const notes = [
        { f: 370, t: 0 },
        { f: 349, t: 0.15 },
        { f: 330, t: 0.3 },
        { f: 293, t: 0.45 },
      ];

      notes.forEach(({ f, t }) => {
        const startTime = now + t;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, startTime);
        osc.frequency.linearRampToValueAtTime(f - 20, startTime + 0.14);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, startTime);

        gain.gain.setValueAtTime(0.12 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.14);
      });
    } catch {}
  }

  // Timer countdown tick
  playCountdownTick(isFinal: boolean = false, enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isFinal ? 880 : 540, now);
      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // Curious question tone for "PLAY NICE?"
  playQuestionTone(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Inquisitive ascending melody: C5 -> E5 -> G5 (rising questioning inflection)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = now + idx * 0.12;
        osc.frequency.setValueAtTime(freq, start);
        if (idx === freqs.length - 1) {
          // Final pitch bend up like a questioning voice
          osc.frequency.exponentialRampToValueAtTime(880, start + 0.18);
        }
        gain.gain.setValueAtTime(0.14 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.22);
      });
    } catch {}
  }

  // Punchy, cheeky celebration reveal for "NEVERRRR! 😈"
  playNeverReveal(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Sub drop punch
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(180, now);
      sub.frequency.exponentialRampToValueAtTime(55, now + 0.2);
      subGain.gain.setValueAtTime(0.32 * this.volume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.22);

      // Cheeky brassy flourish: E5 -> G5 -> C6 -> E6 rapid arpeggio
      const notes = [659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = now + 0.04 + idx * 0.05;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.38);
      });

      // Shimmer sparkles
      [1567.98, 2093.0].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = now + 0.15 + idx * 0.07;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.08 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {}
  }

  // Combined full brand catchphrase reveal: "PLAY NICE? ... NEVERRRR! 😈"
  playCatchphraseReveal(enabled: boolean = true) {
    if (!enabled) return;
    this.playQuestionTone(enabled);
    setTimeout(() => {
      this.playNeverReveal(enabled);
    }, 650);
  }

  // Cheeky "UH-OH… PLAYFUL!"
  playUhOhPlayful(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // "Uh-oh": Two-note dip and slide
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.linearRampToValueAtTime(392, now + 0.12);
      gain1.gain.setValueAtTime(0.18 * this.volume, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.14);

      // "Playful!": Bouncy upward spring
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(330, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(740, now + 0.36);
      gain2.gain.setValueAtTime(0.16 * this.volume, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.42);
    } catch {}
  }

  // Enthusiastic "ONE MORE? OBVIOUSLY!"
  playOneMoreObviously(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Double upbeat rhythmic chord stabs
      [
        { t: 0, chord: [523.25, 659.25] },
        { t: 0.15, chord: [659.25, 783.99, 1046.5] }
      ].forEach(({ t, chord }) => {
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + t);
          gain.gain.setValueAtTime(0.12 * this.volume, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + 0.28);
        });
      });
    } catch {}
  }

  triggerHaptic(enabled: boolean = true) {
    if (!enabled) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }
  }
}

export const soundManager = new SoundEffects();
