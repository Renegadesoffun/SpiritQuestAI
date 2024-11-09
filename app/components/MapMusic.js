import React, { useEffect, useRef } from 'react';

import MusicComposer from '../audio/MusicComposer';



const MapMusic = () => {

  const composerRef = useRef(MusicComposer);
  const intervalsRef = useRef([]);

  useEffect(() => {

    const startMapMusic = async () => {

      try {

        await composerRef.current.init();
        
        // Start ethereal map ambience
        await composerRef.current.playMapAmbience('ethereal', {
          volume: 0.3,
          fadeIn: true,
          fadeInDuration: 2000
        });

        // Add meditation bells at intervals
        intervalsRef.current.push(
          setInterval(() => {
            composerRef.current.playBellSequence(
              ['C6', 'E6', 'G6'], 
              0.1
            );
          }, 12000)
        );

        // Add random crystal sounds
        intervalsRef.current.push(
          setInterval(() => {
            if (Math.random() < 0.2) {
              composerRef.current.playCrystalSound(
                ['E6', 'G6', 'B6'][Math.floor(Math.random() * 3)],
                0.05
              );
            }
          }, 4000)
        );

      } catch (err) {

        console.warn('Failed to start map music:', err);

      }

    };



    startMapMusic();

    return () => {
      intervalsRef.current.forEach(clearInterval);
      composerRef.current.stopAll();
    };

  }, []);



  return null;

};



export default MapMusic;



