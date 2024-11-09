class AAAParticleSystem {
  constructor() {
    this.particleGroups = new Map();
    this.emitters = new Map();
    
    // GPU-accelerated particle computation
    this.gpuCompute = new GPUComputationRenderer(1024, 1024, renderer);
    
    this.presets = {
      spirit: {
        count: 1000,
        size: { min: 0.1, max: 0.3 },
        lifetime: { min: 1, max: 3 },
        velocity: { min: -1, max: 1 },
        color: new Color('#4fc3f7'),
        opacity: { start: 1, end: 0 },
        blending: AdditiveBlending
      },
      meditation: {
        count: 500,
        size: { min: 0.2, max: 0.5 },
        lifetime: { min: 2, max: 4 },
        velocity: { min: -0.5, max: 0.5 },
        color: new Color('#9c27b0'),
        opacity: { start: 0.8, end: 0 },
        blending: NormalBlending
      }
    };
  }
}
