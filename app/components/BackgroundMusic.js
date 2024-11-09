import React, { useEffect } from 'react';
import AudioEngine from '../audio/AudioEngine';

const BackgroundMusic = ({ realm = 'physical', mood = 'calm' }) => {
  useEffect(() => {
    const initAudio = async () => {
      try {
        await AudioEngine.init();
        await AudioEngine.startMusic(realm);
      } catch (err) {
        console.warn('Failed to initialize background music:', err);
      }
    };
    
    initAudio();
    
    return () => {
      AudioEngine.stopMusic();
    };
  }, [realm]);

  useEffect(() => {
    AudioEngine.setMood(mood);
  }, [mood]);

  return null;
};

export default BackgroundMusic;
