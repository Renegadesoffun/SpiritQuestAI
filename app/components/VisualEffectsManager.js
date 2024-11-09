class VisualEffectsManager {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.effects = new Map();
    
    // Initialize effect pools
    this.initializeEffects();
  }

  initializeEffects() {
    this.effects.set('portalRipple', {
      particles: [],
      settings: {
        color: ['#4fc3f7', '#2196f3', '#1976d2'],
        count: 100,
        size: { min: 2, max: 6 },
        speed: { min: 0.5, max: 2 },
        life: { min: 1000, max: 3000 },
        opacity: { start: 0.8, end: 0 }
      }
    });

    this.effects.set('spiritTrail', {
      particles: [],
      settings: {
        color: ['#e1bee7', '#ce93d8', '#ba68c8'],
        count: 50,
        size: { min: 1, max: 4 },
        speed: { min: 0.2, max: 1 },
        life: { min: 500, max: 1500 },
        opacity: { start: 0.6, end: 0 }
      }
    });

    this.effects.set('energyField', {
      lines: [],
      settings: {
        count: 20,
        color: '#4a148c',
        width: { min: 1, max: 3 },
        speed: 0.5,
        glow: true
      }
    });
  }

  createEffect(type, position, options = {}) {
    const effect = this.effects.get(type);
    if (!effect) return;

    const settings = { ...effect.settings, ...options };

    switch(type) {
      case 'portalRipple':
        this.createPortalRipple(position, settings);
        break;
      case 'spiritTrail':
        this.createSpiritTrail(position, settings);
        break;
      case 'energyField':
        this.createEnergyField(position, settings);
        break;
    }
  }

  createPortalRipple(position, settings) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (settings.speed.max - settings.speed.min) + settings.speed.min;
    const size = Math.random() * (settings.size.max - settings.size.min) + settings.size.min;
    const life = Math.random() * (settings.life.max - settings.life.min) + settings.life.min;
    const color = settings.color[Math.floor(Math.random() * settings.color.length)];

    this.effects.get('portalRipple').particles.push({
      x: position.x,
      y: position.y,
      angle,
      speed,
      size,
      color,
      life,
      maxLife: life,
      opacity: settings.opacity.start
    });
  }

  update(deltaTime) {
    this.updatePortalRipple(deltaTime);
    this.updateSpiritTrail(deltaTime);
    this.updateEnergyField(deltaTime);
  }

  render() {
    this.ctx.save();
    
    // Enable global composite operations for glow effects
    this.ctx.globalCompositeOperation = 'screen';
    
    this.renderPortalRipple();
    this.renderSpiritTrail();
    this.renderEnergyField();
    
    this.ctx.restore();
  }
}
