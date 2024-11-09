import MusicComposer from '../audio/MusicComposer';



class EnhancedMusicSystem {

  constructor() {

    this.composer = MusicComposer;

    this.currentRealm = 'physical';

    this.currentIntensity = 0;

  }



  async init() {

    await this.composer.init();

  }



  async transitionToRealm(targetRealm, transitionDuration = 2000) {

    if (this.currentRealm === targetRealm) return;



    try {

      // Fade out current realm
      await this.composer.fadeOut(transitionDuration / 2);
      
      // Start new realm music
      await this.composer.playRealmAmbience(targetRealm);
      
      // Fade in new realm
      await this.composer.fadeIn(transitionDuration / 2);
      
      this.currentRealm = targetRealm;

    } catch (err) {

      console.warn('Failed to transition realm:', err);

    }

  }



  async handleGameplayEvent(event, data = {}) {

    try {

      switch (event) {

        case 'LEVEL_START':

          await this.composer.playGameEvent('levelStart', {
            volume: 0.4,
            duration: 2000
          });

          break;
          
        case 'POWER_UP':

          await this.composer.playGameEvent('powerUp', {
            volume: 0.3,
            duration: 1000
          });

          break;
          
        case 'ACHIEVEMENT':

          await this.composer.playGameEvent('achievement', {
            volume: 0.4,
            duration: 2000
          });

          break;
          
        case 'DANGER':

          await this.composer.playGameEvent('danger', {
            volume: 0.3,
            duration: 800
          });

          break;

      }

    } catch (err) {

      console.warn('Failed to handle gameplay event:', err);

    }

  }



  async updateGameIntensity(intensity) {

    // Adjust music based on gameplay intensity (0-1)
    this.currentIntensity = intensity;
    await this.composer.adjustMusicIntensity(intensity);

  }



  async createMeditationHarmony(breathingPattern) {

    try {

      await this.composer.playGameEvent('meditation', {
        duration: breathingPattern?.duration || 3000,
        volume: (breathingPattern?.intensity || 0.5) * 0.15
      });

    } catch (err) {

      console.warn('Failed to create meditation harmony:', err);

    }

  }

}



export default EnhancedMusicSystem;



