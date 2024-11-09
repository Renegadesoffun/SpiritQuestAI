import React, { useEffect, useRef } from 'react';
import MusicComposer from '../audio/MusicComposer';

const MeditationMusic = ({ breathingState = 'inhale', intensity = 0.5 }) => {
  const composerRef = useRef(MusicComposer);
  const intervalsRef = useRef([]);

  useEffect(() => {
    const startMeditationMusic = async () => {
      try {
        await composerRef.current.init();
        
        // Play base meditation drone
        await composerRef.current.playDrone('C3', {
          waveform: 'sine',
          volume: 0.15,
          pulseRate: 0.3
        });

        // Add harmonic layers
        await composerRef.current.playDrone('G3', {
          waveform: 'triangle',
          volume: 0.1,
          pulseRate: 0.4
        });

        // Add gentle bells
        intervalsRef.current.push(
          setInterval(() => {
            composerRef.current.playBellSequence(
              ['C5', 'E5', 'G5'],
              0.08
            );
          }, 15000)
        );

      } catch (err) {
        console.warn('Failed to start meditation music:', err);
      }
    };

    startMeditationMusic();

    return () => {
      intervalsRef.current.forEach(clearInterval);
      composerRef.current.stopAll();
    };
  }, []);

  // Adjust music based on breathing state
  useEffect(() => {
    const volume = breathingState === 'inhale' ? 0.15 : 0.1;
    const frequency = breathingState === 'inhale' ? 1.0 : 0.9;
    
    composerRef.current.adjustDroneParameters({
      volume,
      frequency,
      intensity
    });
  }, [breathingState, intensity]);

  return null;
};

export default MeditationMusic;
