/**
 * AudioSiren utility using Web Audio API.
 * Synthesizes a cybersecurity emergency siren in real time with zero external audio assets.
 */
class SirenSynthesizer {
  private audioCtx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: any = null;
  private isPlaying = false;

  public start() {
    if (this.isPlaying) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.audioCtx = new AudioCtxClass();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.osc = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.osc.type = 'sawtooth';
      this.osc.frequency.setValueAtTime(850, this.audioCtx.currentTime);

      // Volume ramping
      this.gainNode.gain.setValueAtTime(0.15, this.audioCtx.currentTime);

      this.osc.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      this.osc.start();

      let toggle = false;
      this.intervalId = setInterval(() => {
        if (!this.audioCtx || !this.osc) return;
        const targetFreq = toggle ? 1250 : 750;
        this.osc.frequency.exponentialRampToValueAtTime(targetFreq, this.audioCtx.currentTime + 0.28);
        toggle = !toggle;
      }, 350);

      this.isPlaying = true;
    } catch (e) {
      console.warn('AudioContext unable to start siren:', e);
    }
  }

  public stop() {
    if (!this.isPlaying) return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    try {
      if (this.osc) {
        this.osc.stop();
        this.osc.disconnect();
        this.osc = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      if (this.audioCtx) {
        this.audioCtx.close();
        this.audioCtx = null;
      }
    } catch (e) {
      console.warn('Error stopping siren audio:', e);
    }

    this.isPlaying = false;
  }

  public isActive(): boolean {
    return this.isPlaying;
  }
}

export const sirenPlayer = new SirenSynthesizer();
