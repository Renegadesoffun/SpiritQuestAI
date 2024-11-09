import AudioEngine from '../audio/AudioEngine';

class AdvancedVFXManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.effects = new Map();
    this.particleSystem = new ParticleSystem();
    
    // Initialize effect types
    this.effectTypes = {
      spiritual_surge: {
        duration: 2000,
        particles: {
          count: 50,
          color: '#4fc3f7',
          size: { min: 2, max: 5 },
          lifetime: { min: 1000, max: 2000 }
        },
        sound: 'spiritual_surge',
        glow: {
          color: '#4fc3f7',
          radius: 100,
          intensity: 0.7
        }
      },
      chakra_alignment: {
        duration: 3000,
        particles: {
          count: 100,
          color: '#ffd700',
          size: { min: 3, max: 8 },
          lifetime: { min: 2000, max: 4000 }
        },
        sound: 'chakra_align',
        glow: {
          color: '#ffd700',
          radius: 150,
          intensity: 0.8
        }
      },
      karma_wave: {
        duration: 2500,
        particles: {
          count: 75,
          color: '#9c27b0',
          size: { min: 4, max: 10 },
          lifetime: { min: 1500, max: 3000 }
        },
        sound: 'karma_pulse',
        glow: {
          color: '#9c27b0',
          radius: 120,
          intensity: 0.6
        }
      }
    };
  }

  async createEffect(type, position, customConfig = {}) {
    const baseConfig = this.effectTypes[type];
    const config = { ...baseConfig, ...customConfig };
    
    const effectId = Date.now().toString();
    
    // Create particle effect
    this.particleSystem.emit(config.particles, {
      position,
      duration: config.duration
    });
    
    // Create glow effect
    this.createGlowEffect(position, config.glow);
    
    // Play sound effect
    this.playSoundEffect(config.sound);
    
    // Store effect reference
    this.effects.set(effectId, {
      type,
      position,
      startTime: Date.now(),
      config
    });

    // Schedule cleanup
    setTimeout(() => {
      this.effects.delete(effectId);
    }, config.duration);

    return effectId;
  }

  createGlowEffect(position, config) {
    const { ctx } = this;
    const gradient = ctx.createRadialGradient(
      position.x, position.y, 0,
      position.x, position.y, config.radius
    );
    
    gradient.addColorStop(0, `${config.color}ff`);
    gradient.addColorStop(0.5, `${config.color}88`);
    gradient.addColorStop(1, `${config.color}00`);
    
    ctx.globalAlpha = config.intensity;
    ctx.fillStyle = gradient;
    ctx.fillRect(
      position.x - config.radius,
      position.y - config.radius,
      config.radius * 2,
      config.radius * 2
    );
    ctx.globalAlpha = 1;
  }

  playSoundEffect(soundId) {
    try {
      const soundEffects = {
        sparkle: async () => {
          await AudioEngine.playSound(AudioEngine.frequencies.chakra.crown, 200, 0.2);
        },
        glow: async () => {
          await AudioEngine.playSound(AudioEngine.frequencies.chakra.heart, 300, 0.15);
        },
        burst: async () => {
          await Promise.all([
            AudioEngine.playSound(AudioEngine.frequencies.meditation.transcend[0], 150, 0.2),
            AudioEngine.playSound(AudioEngine.frequencies.meditation.relax[0], 200, 0.15)
          ]);
        }
      };

      if (soundEffects[soundId]) {
        soundEffects[soundId]();
      }
    } catch (err) {
      console.warn('Failed to play VFX sound:', err);
    }
  }

  update(deltaTime) {
    // Update all active effects
    for (const [id, effect] of this.effects) {
      const elapsed = Date.now() - effect.startTime;
      const progress = Math.min(elapsed / effect.config.duration, 1);
      
      // Update effect properties based on progress
      this.updateEffect(effect, progress);
      
      // Remove completed effects
      if (progress >= 1) {
        this.effects.delete(id);
      }
    }
  }

  updateEffect(effect, progress) {
    // Update glow intensity
    const glowIntensity = effect.config.glow.intensity * 
      (1 - Math.pow(progress - 0.5, 2) * 4);
    
    this.createGlowEffect(effect.position, {
      ...effect.config.glow,
      intensity: glowIntensity
    });
    
    // Update particle properties
    this.particleSystem.updateParticles(effect.type, progress);
  }
}

export default new AdvancedVFXManager();
