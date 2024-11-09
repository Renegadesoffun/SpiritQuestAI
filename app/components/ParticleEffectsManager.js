class EnhancedParticleSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.particles = [];
    this.emitters = new Map();
    
    // Initialize particle types
    this.particleTypes = {
      spirit: {
        color: '#7B68EE',
        size: { min: 2, max: 5 },
        lifetime: { min: 1000, max: 2000 },
        velocity: { min: 1, max: 3 },
        alpha: { start: 1, end: 0 },
        blend: 'screen'
      },
      meditation: {
        color: '#4FC3F7',
        size: { min: 3, max: 8 },
        lifetime: { min: 2000, max: 4000 },
        velocity: { min: 0.5, max: 1.5 },
        alpha: { start: 0.8, end: 0 },
        blend: 'overlay'
      },
      enlightenment: {
        color: '#FFD700',
        size: { min: 4, max: 10 },
        lifetime: { min: 1500, max: 3000 },
        velocity: { min: 2, max: 4 },
        alpha: { start: 1, end: 0 },
        blend: 'add'
      }
    };
  }

  createParticle(type, position, customConfig = {}) {
    const baseConfig = this.particleTypes[type];
    const config = { ...baseConfig, ...customConfig };
    
    return {
      x: position.x,
      y: position.y,
      size: this.randomRange(config.size),
      lifetime: this.randomRange(config.lifetime),
      velocity: this.randomRange(config.velocity),
      angle: Math.random() * Math.PI * 2,
      alpha: config.alpha.start,
      color: config.color,
      blend: config.blend,
      age: 0
    };
  }

  emit(type, config) {
    const emitter = {
      type,
      position: { x: config.x, y: config.y },
      rate: config.rate || 10,
      duration: config.duration || 1000,
      spread: config.spread || 50,
      active: true,
      elapsed: 0
    };

    this.emitters.set(Date.now(), emitter);
  }

  update(deltaTime) {
    // Update emitters
    this.updateEmitters(deltaTime);
    
    // Update particles
    this.updateParticles(deltaTime);
    
    // Remove dead particles
    this.removeDeadParticles();
  }

  updateEmitters(deltaTime) {
    for (const [id, emitter] of this.emitters) {
      if (!emitter.active) continue;

      emitter.elapsed += deltaTime;
      
      // Create new particles
      const particlesToCreate = Math.floor(emitter.rate * (deltaTime / 1000));
      for (let i = 0; i < particlesToCreate; i++) {
        const particle = this.createParticle(emitter.type, emitter.position);
        this.particles.push(particle);
      }

      // Check if emitter should be removed
      if (emitter.elapsed >= emitter.duration) {
        this.emitters.delete(id);
      }
    }
  }

  render() {
    this.ctx.save();
    
    for (const particle of this.particles) {
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.globalCompositeOperation = particle.blend;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }
}
