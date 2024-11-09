import React, { useEffect } from 'react';
import AudioEngine from '../audio/AudioEngine';

const MenuMusic = () => {
  useEffect(() => {
    const startMenuMusic = async () => {
      try {
        await AudioEngine.init();
        
        const playMenuPattern = async () => {
          await Promise.all([
            AudioEngine.playSound('meditation', 3000, 0.2),
            AudioEngine.playSound('crystal', 2500, 0.15),
            AudioEngine.playSound('astral', 2000, 0.1)
          ]);
        };

        const interval = setInterval(playMenuPattern, 4000);
        return () => clearInterval(interval);
      } catch (err) {
        console.warn('Failed to start menu music:', err);
      }
    };

    startMenuMusic();
  }, []);

  return null;
};

export default MenuMusic;
