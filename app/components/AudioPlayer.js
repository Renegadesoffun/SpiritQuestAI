import React, { useEffect } from 'react';

import MusicComposer from '../audio/MusicComposer';



export function AudioPlayer({ realm, autoPlay = true }) {

  useEffect(() => {

    let mounted = true;

    async function setupAudio() {

      try {

        await MusicComposer.init();

        

        if (mounted && autoPlay && realm) {

          await MusicComposer.playMusic(realm);

        }

      } catch (error) {

        console.warn('Audio setup failed:', error);

      }

    }



    setupAudio();



    // Cleanup

    return () => {

      mounted = false;

      MusicComposer.stopAll();

    };

  }, [realm, autoPlay]);



  return null;

}



export default AudioPlayer;



