import AudioEngine from '../audio/AudioEngine';

export const playSound = async (soundName) => {
  try {
    await AudioEngine.playSound(soundName);
  } catch (error) {
    console.warn('Error playing sound:', error);
  }
};
