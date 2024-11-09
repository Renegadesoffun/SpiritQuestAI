class EnergyVisualization {
  constructor(ctx) {
    this.ctx = ctx;
    this.energyFields = new Map();
    this.flowLines = [];
    
    // Initialize energy types
    this.energyTypes = {
      spiritual: {
        color: '#4fc3f7',
        frequency: 432,
        wavelength: 50,
        amplitude: 20
      },
      chakra: {
        color: '#ffd700',
        frequency: 528,
        wavelength: 40,
        amplitude: 25
      },
      karmic: {
        color: '#9c27b0',
        frequency: 396,
        wavelength: 60,
        amplitude: 15
      }
    };
  }

  createEnergyField(type, position, radius) {
    const config = this.energyTypes[type];
    const fieldId = Date.now().toString();
    
    const field = {
      type,
      position,
      radius,
      energy: 100,
      phase: 0,
      flowLines: this.createFlowLines(position, radius)
    };

    this.energyFields.set(fieldId, field);
    return fieldId;
  }

  createFlowLines(position, radius) {
    const lines = [];
    const lineCount = Math.floor(radius / 20);
    
    for (let i = 0; i < lineCount; i++) {
      lines.push({
        points: this.generateFlowPoints(position, radius),
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5
      });
    }
    
    return lines;
  }

  generateFlowPoints(position, radius) {
    const points = [];
    const steps = 10;
    
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      points.push({
        x: position.x + Math.cos(angle) * radius,
        y: position.y + Math.sin(angle) * radius,
        offset: Math.random() * 20 - 10
      });
    }
    
    return points;
  }

  update(deltaTime) {
    // Update all energy fields
    for (const field of this.energyFields.values()) {
      // Update phase
      field.phase += deltaTime * 0.001;
      
      // Update flow lines
      field.flowLines.forEach(line => {
        line.phase += line.speed * deltaTime * 0.001;
      });
      
      // Draw field
      this.drawEnergyField(field);
    }
  }

  drawEnergyField(field) {
    const config = this.energyTypes[field.type];
    
    // Draw base glow
    this.drawFieldGlow(field, config);
    
    // Draw flow lines
    this.drawFlowLines(field, config);
    
    // Draw energy particles
    this.drawEnergyParticles(field, config);
  }

  drawFieldGlow(field, config) {
    const { ctx } = this;
    const gradient = ctx.createRadialGradient(
      field.position.x, field.position.y, 0,
      field.position.x, field.position.y, field.radius
    );
    
    gradient.addColorStop(0, `${config.color}44`);
    gradient.addColorStop(0.5, `${config.color}22`);
    gradient.addColorStop(1, `${config.color}00`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
      field.position.x,
      field.position.y,
      field.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  drawFlowLines(field, config) {
    const { ctx } = this;
    
    field.flowLines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.points[0].x, line.points[0].y);
      
      for (let i = 1; i < line.points.length; i++) {
        const point = line.points[i];
        const offset = Math.sin(line.phase + i * 0.5) * point.offset;
        
        ctx.lineTo(
          point.x + Math.cos(line.phase) * offset,
          point.y + Math.sin(line.phase) * offset
        );
      }
      
      ctx.strokeStyle = config.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
}
