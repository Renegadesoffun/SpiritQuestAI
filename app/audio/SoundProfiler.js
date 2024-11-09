class SoundProfiler {
  constructor() {
    this.profiles = new Map();
    this.startTime = Date.now();
    this.metrics = {
      totalPlayTime: 0,
      averageLoadTime: 0,
      peakMemoryUsage: 0,
      soundCount: 0
    };
  }

  startProfile(soundId) {
    this.profiles.set(soundId, {
      startTime: performance.now(),
      loadTime: 0,
      playCount: 0,
      totalPlayTime: 0,
      memoryUsage: 0,
      errors: []
    });
  }

  recordLoadTime(soundId, loadTime) {
    const profile = this.profiles.get(soundId);
    if (profile) {
      profile.loadTime = loadTime;
      this.updateAverageLoadTime();
    }
  }

  recordPlayStart(soundId) {
    const profile = this.profiles.get(soundId);
    if (profile) {
      profile.playCount++;
      profile.lastPlayStart = performance.now();
    }
  }

  recordPlayEnd(soundId) {
    const profile = this.profiles.get(soundId);
    if (profile && profile.lastPlayStart) {
      const playTime = performance.now() - profile.lastPlayStart;
      profile.totalPlayTime += playTime;
      this.metrics.totalPlayTime += playTime;
    }
  }

  recordError(soundId, error) {
    const profile = this.profiles.get(soundId);
    if (profile) {
      profile.errors.push({
        timestamp: new Date(),
        error: error.message
      });
    }
  }

  updateAverageLoadTime() {
    let totalLoadTime = 0;
    let count = 0;
    
    this.profiles.forEach(profile => {
      if (profile.loadTime) {
        totalLoadTime += profile.loadTime;
        count++;
      }
    });

    this.metrics.averageLoadTime = count ? totalLoadTime / count : 0;
  }

  getProfileSummary() {
    return {
      totalSounds: this.profiles.size,
      uptime: Date.now() - this.startTime,
      ...this.metrics,
      profiles: Array.from(this.profiles.entries()).map(([id, profile]) => ({
        id,
        playCount: profile.playCount,
        averagePlayTime: profile.totalPlayTime / profile.playCount || 0,
        errorCount: profile.errors.length,
        loadTime: profile.loadTime
      }))
    };
  }

  cleanup() {
    this.profiles.clear();
    this.metrics = {
      totalPlayTime: 0,
      averageLoadTime: 0,
      peakMemoryUsage: 0,
      soundCount: 0
    };
  }
}

export default new SoundProfiler(); 