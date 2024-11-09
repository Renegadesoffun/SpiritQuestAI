import MusicComposer from './MusicComposer';

class SoundEnhancer {
  constructor() {
    this.composer = MusicComposer;
  }

  async createLayeredSound(baseSound, options = {}) {
    const {
      harmonics = [1, 1.5, 2], // Frequency multipliers
      volumes = [1, 0.5, 0.25], // Volume for each harmonic
      delays = [0, 100, 200], // Delay in ms for each layer
    } = options;

    for (let i = 0; i < harmonics.length; i++) {
      setTimeout(() => {
        this.composer.playSound(baseSound, {
          rate: harmonics[i],
          volume: volumes[i] * (options.volume || 0.3),
          duration: options.duration || 2000
        });
      }, delays[i]);
    }
  }

  async createAmbientPad(realm, options = {}) {
    const realmHarmonics = {
      meditation: [1, 1.5, 2],
      crystal: [1, 1.2, 1.5, 1.8],
      spirit: [1, 1.3, 1.6, 2],
      forest: [1, 1.4, 1.7, 2.1],
      astral: [1, 1.6, 2, 2.5]
    };

    const harmonics = realmHarmonics[realm] || [1, 1.5, 2];
    await this.createLayeredSound(realm, {
      harmonics,
      volumes: harmonics.map((_, i) => 1 / (i + 1)),
      delays: harmonics.map((_, i) => i * 150),
      ...options
    });
  }
}

export default new SoundEnhancer();
