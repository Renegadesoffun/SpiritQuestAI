class MenuTransitionManager {
  constructor() {
    this.transitions = new Map();
    this.currentTransition = null;
    
    this.initializeTransitions();
  }

  initializeTransitions() {
    // Mystical portal transition
    this.transitions.set('portal', {
      duration: 1000,
      easing: 'easeInOutCubic',
      enter: (ctx, progress) => {
        const radius = this.canvas.width * (1 - progress);
        const gradient = ctx.createRadialGradient(
          this.canvas.width/2, this.canvas.height/2, 0,
          this.canvas.width/2, this.canvas.height/2, radius
        );
        gradient.addColorStop(0, 'rgba(74, 20, 140, 0)');
        gradient.addColorStop(0.5, 'rgba(74, 20, 140, 0.5)');
        gradient.addColorStop(1, 'rgba(74, 20, 140, 1)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    });

    // Spirit realm transition
    this.transitions.set('spirit', {
      duration: 1500,
      easing: 'easeInOutQuart',
      enter: (ctx, progress) => {
        const particles = [];
        const particleCount = 100;
        
        for(let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 4 + 2,
            speed: Math.random() * 2 + 1
          });
        }
        
        ctx.globalAlpha = progress;
        particles.forEach(particle => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = '#7B68EE';
          ctx.fill();
        });
      }
    });
  }

  async transition(from, to, type = 'portal') {
    const transition = this.transitions.get(type);
    if (!transition) return;

    this.currentTransition = {
      type,
      progress: 0,
      startTime: performance.now()
    };

    // Start transition animation
    await new Promise(resolve => {
      const animate = (currentTime) => {
        const elapsed = currentTime - this.currentTransition.startTime;
        const progress = Math.min(elapsed / transition.duration, 1);
        
        this.currentTransition.progress = progress;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.currentTransition = null;
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }

  render(ctx) {
    if (!this.currentTransition) return;
    
    const transition = this.transitions.get(this.currentTransition.type);
    if (!transition) return;
    
    ctx.save();
    transition.enter(ctx, this.currentTransition.progress);
    ctx.restore();
  }
}
