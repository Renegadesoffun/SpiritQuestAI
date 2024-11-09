class AudioDebugger {
  constructor() {
    this.isEnabled = __DEV__;
    this.logs = [];
    this.maxLogs = 100;
    this.metrics = {
      activeSounds: 0,
      totalMemoryUsage: 0,
      cpuUsage: 0,
      failedLoads: 0,
      successfulLoads: 0
    };
  }

  log(message, type = 'info') {
    if (!this.isEnabled) return;

    const logEntry = {
      timestamp: new Date(),
      message,
      type
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Also log to console in development
    switch (type) {
      case 'error':
        console.error('🔊❌', message);
        break;
      case 'warning':
        console.warn('🔊⚠️', message);
        break;
      default:
        console.log('🔊', message);
    }
  }

  trackSoundLoad(success) {
    if (success) {
      this.metrics.successfulLoads++;
    } else {
      this.metrics.failedLoads++;
    }
  }

  updateMetrics(metrics) {
    this.metrics = { ...this.metrics, ...metrics };
  }

  getDebugInfo() {
    return {
      metrics: this.metrics,
      recentLogs: this.logs.slice(0, 10)
    };
  }

  renderDebugOverlay() {
    if (!this.isEnabled) return null;

    return `
      Active Sounds: ${this.metrics.activeSounds}
      Memory Usage: ${Math.round(this.metrics.totalMemoryUsage / 1024 / 1024)}MB
      CPU Usage: ${Math.round(this.metrics.cpuUsage * 100)}%
      Success Rate: ${Math.round(
        (this.metrics.successfulLoads /
          (this.metrics.successfulLoads + this.metrics.failedLoads)) *
          100
      )}%
    `;
  }
}

export default new AudioDebugger(); 