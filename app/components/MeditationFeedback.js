class EnhancedMeditationFeedback {
  constructor(ctx) {
    this.ctx = ctx;
    this.breathingData = [];
    this.chakraStates = new Map();
    this.energyFlow = 0;
    
    this.feedbackEffects = {
      perfect: {
        color: '#ffd700',
        particles: 20,
        soundFrequency: 432 // Hz
      },
      good: {
        color: '#4fc3f7',
        particles: 12,
        soundFrequency: 528 // Hz
      },
      needsImprovement: {
        color: '#ff4081',
        particles: 5,
        soundFrequency: 396 // Hz
      }
    };
  }

  analyzeMeditationQuality(breathPattern) {
    const consistency = this.calculateConsistency(breathPattern);
    const depth = this.calculateBreathDepth(breathPattern);
    const rhythm = this.analyzeBreathingRhythm(breathPattern);
    
    return {
      quality: this.determineQuality(consistency, depth, rhythm),
      feedback: this.generateFeedback(consistency, depth, rhythm),
      visualEffect: this.createVisualFeedback(consistency)
    };
  }

  createVisualFeedback(quality) {
    const effect = this.feedbackEffects[quality];
    return {
      particles: this.generateParticles(effect),
      glow: this.createEnergyGlow(effect),
      soundFrequency: effect.soundFrequency
    };
  }

  calculateConsistency(breathPattern) {
    const intervals = [];
    let totalDeviation = 0;

    // Calculate breathing intervals
    for (let i = 1; i < breathPattern.length; i++) {
      intervals.push(breathPattern[i].timestamp - breathPattern[i-1].timestamp);
    }

    // Calculate average interval
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

    // Calculate deviation
    intervals.forEach(interval => {
      totalDeviation += Math.abs(interval - avgInterval);
    });

    return 1 - (totalDeviation / (avgInterval * intervals.length));
  }

  calculateBreathDepth(breathPattern) {
    let totalDepth = 0;
    const maxDepth = Math.max(...breathPattern.map(b => b.depth));
    const minDepth = Math.min(...breathPattern.map(b => b.depth));
    
    breathPattern.forEach(breath => {
      const normalizedDepth = (breath.depth - minDepth) / (maxDepth - minDepth);
      totalDepth += normalizedDepth;
    });

    return totalDepth / breathPattern.length;
  }

  generateFeedback(consistency, depth, rhythm) {
    const feedbacks = [];
    
    // Consistency feedback
    if (consistency > 0.9) {
      feedbacks.push({
        type: 'consistency',
        message: "Your breath flows like a gentle stream",
        effect: 'perfect_harmony'
      });
    } else if (consistency > 0.7) {
      feedbacks.push({
        type: 'consistency',
        message: "Find your natural rhythm",
        effect: 'gentle_guidance'
      });
    }

    // Depth feedback
    if (depth > 0.8) {
      feedbacks.push({
        type: 'depth',
        message: "Deep like the ocean",
        effect: 'deep_resonance'
      });
    } else if (depth > 0.6) {
      feedbacks.push({
        type: 'depth',
        message: "Let your breath fill you completely",
        effect: 'expanding_awareness'
      });
    }

    return {
      messages: feedbacks.map(f => f.message),
      effects: feedbacks.map(f => f.effect)
    };
  }

  generateParticles(effect) {
    return {
      type: 'meditation_feedback',
      count: effect.particles,
      color: effect.color,
      lifetime: 2000,
      behavior: {
        rise: true,
        spread: 120,
        fadeOut: true
      }
    };
  }

  createEnergyGlow(effect) {
    return {
      color: effect.color,
      intensity: effect.particles / 20,
      radius: 100 + (effect.particles * 5),
      pulseRate: effect.soundFrequency / 100
    };
  }
}
