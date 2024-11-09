import { Audio } from 'expo-av';

class DSPEffectsProcessor {
  constructor() {
    this.effects = new Map();
    this.audioContext = null;
    this.masterGain = null;
    this.analyser = null;
    this.fftSize = 2048;
    this.frequencyData = null;
    this.timeData = null;
  }

  async init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.analyser = this.audioContext.createAnalyser();
      
      this.analyser.fftSize = this.fftSize;
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.timeData = new Uint8Array(this.fftSize);
      
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      
      console.log('✅ DSP Effects Processor initialized');
    } catch (error) {
      console.warn('❌ Failed to initialize DSP Effects:', error);
    }
  }

  createEffect(type, options = {}) {
    let effect;
    switch (type) {
      case 'reverb':
        effect = this.createReverb(options);
        break;
      case 'delay':
        effect = this.createDelay(options);
        break;
      case 'filter':
        effect = this.createFilter(options);
        break;
      case 'compressor':
        effect = this.createCompressor(options);
        break;
      case 'distortion':
        effect = this.createDistortion(options);
        break;
      default:
        throw new Error(`Unknown effect type: ${type}`);
    }
    this.effects.set(type, effect);
    return effect;
  }

  createReverb({ decay = 2.0, mix = 0.5 }) {
    const convolver = this.audioContext.createConvolver();
    const dryGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    
    // Generate impulse response
    const rate = this.audioContext.sampleRate;
    const length = rate * decay;
    const impulse = this.audioContext.createBuffer(2, length, rate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    
    convolver.buffer = impulse;
    dryGain.gain.value = 1 - mix;
    wetGain.gain.value = mix;
    
    return { convolver, dryGain, wetGain };
  }

  createDelay({ time = 0.5, feedback = 0.5, mix = 0.3 }) {
    const delay = this.audioContext.createDelay();
    const feedback = this.audioContext.createGain();
    const dryGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    
    delay.delayTime.value = time;
    feedback.gain.value = feedback;
    dryGain.gain.value = 1 - mix;
    wetGain.gain.value = mix;
    
    return { delay, feedback, dryGain, wetGain };
  }

  createFilter({ type = 'lowpass', frequency = 1000, Q = 1.0 }) {
    const filter = this.audioContext.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = Q;
    return filter;
  }

  createCompressor({ threshold = -24, knee = 30, ratio = 12, attack = 0.003, release = 0.25 }) {
    const compressor = this.audioContext.createDynamicsCompressor();
    compressor.threshold.value = threshold;
    compressor.knee.value = knee;
    compressor.ratio.value = ratio;
    compressor.attack.value = attack;
    compressor.release.value = release;
    return compressor;
  }

  createDistortion({ amount = 400 }) {
    const distortion = this.audioContext.createWaveShaper();
    const curve = new Float32Array(44100);
    
    for (let i = 0; i < 44100; i++) {
      const x = (i * 2) / 44100 - 1;
      curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    
    distortion.curve = curve;
    return distortion;
  }

  async processAudioBuffer(buffer, effects) {
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    
    let currentNode = source;
    
    // Chain effects
    for (const [type, options] of effects) {
      const effect = this.createEffect(type, options);
      currentNode.connect(effect);
      currentNode = effect;
    }
    
    // Connect to master output
    currentNode.connect(this.masterGain);
    
    return source;
  }

  getSpectralData() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.timeData);
    return {
      frequency: Array.from(this.frequencyData),
      time: Array.from(this.timeData)
    };
  }

  async cleanup() {
    if (this.audioContext) {
      await this.audioContext.close();
    }
    this.effects.clear();
  }
}

export default new DSPEffectsProcessor(); 