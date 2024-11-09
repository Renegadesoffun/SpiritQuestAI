import { Animated } from 'react-native';
import AudioEngine from '../audio/AudioEngine';

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.lastSoundTime = 0;
    this.engine = AudioEngine;
  }

  emit(config, { position, duration }) {
    const now = Date.now();
    // Add sound effect with rate limiting
    if (now - this.lastSoundTime > 100) { // Prevent sound spam
      this.engine.playSound(
        this.engine.frequencies.spirit_high,
        100,
        0.15
      );
      this.lastSoundTime = now;
    }

    // Create particles
    for (let i = 0; i < config.count; i++) {
      const angle = (Math.PI * 2 * i) / config.count;
      const speed = Math.random() * 2 + 1;
      
      this.particles.push({
        x: position.x,
        y: position.y,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        color: config.color,
        size: Math.random() * 
          (config.size.max - config.size.min) + 
          config.size.min,
        life: Math.random() * 
          (config.lifetime.max - config.lifetime.min) / 1000 + 
          config.lifetime.min / 1000
      });
    }
  }

  update(deltaTime) {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.velocity.x;
      particle.y += particle.velocity.y;
      particle.life -= deltaTime;
      return particle.life > 0;
    });
  }
}

export default new ParticleSystem();
