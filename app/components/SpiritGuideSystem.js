class EnhancedSpiritGuideSystem {
  constructor() {
    this.state = {
      form: 'ethereal',
      wisdom: [],
      energy: 100
    };

    // Initialize guide forms
    this.forms = {
      ethereal: {
        color: '#4fc3f7',
        particles: 'spirit_mist',
        voice: 'ethereal_whisper',
        textStyle: {
          font: 'Cinzel',
          glow: '#4fc3f7'
        }
      },
      celestial: {
        color: '#ffd700',
        particles: 'star_dust',
        voice: 'celestial_chorus',
        textStyle: {
          font: 'Philosopher',
          glow: '#ffd700'
        }
      },
      ancient: {
        color: '#9c27b0',
        particles: 'time_fragments',
        voice: 'ancient_echo',
        textStyle: {
          font: 'Uncial Antiqua',
          glow: '#9c27b0'
        }
      }
    };

    // Initialize effect systems
    this.effects = {
      particles: new ParticleSystem(),
      sound: new SoundManager(),
      visual: new VisualEffects()
    };
  }

  async appear(trigger) {
    const form = this.selectAppropriateForm(trigger);
    
    // Create manifestation effect
    await this.createManifestationEffect(form);
    
    // Select and deliver wisdom
    const wisdom = this.selectWisdom(trigger);
    await this.deliverWisdom(wisdom, form);
    
    // Create ambient effects
    await this.createAmbientEffects(form);
  }

  selectAppropriateForm(trigger) {
    switch (trigger) {
      case 'error_recovery':
        return this.forms.ancient;
      case 'meditation_guide':
        return this.forms.ethereal;
      case 'achievement':
        return this.forms.celestial;
      default:
        return this.forms.ethereal;
    }
  }

  async createManifestationEffect(form) {
    // Create particle effect
    this.effects.particles.emit(form.particles, {
      position: 'center',
      radius: 200,
      duration: 2000,
      color: form.color
    });
    
    // Play manifestation sound
    this.effects.sound.play('spirit_manifest', {
      voice: form.voice,
      reverb: 0.7,
      spatial: true
    });
    
    // Create light rays
    await this.effects.visual.createLightRays({
      count: 8,
      color: form.color,
      duration: 1500
    });
  }

  async deliverWisdom(wisdom, form) {
    // Create floating text
    const textEffect = new FloatingText({
      text: wisdom.message,
      style: {
        ...form.textStyle,
        size: '24px',
        spacing: '2px'
      },
      animation: {
        duration: 2000,
        float: true,
        fade: true
      }
    });

    // Add voice effect
    this.effects.sound.playVoice(wisdom.message, {
      voice: form.voice,
      speed: 0.8,
      echo: 0.3
    });

    // Create wisdom particles
    this.effects.particles.emit('wisdom_sparkles', {
      text: textEffect,
      color: form.color,
      count: wisdom.message.length
    });
  }
}
