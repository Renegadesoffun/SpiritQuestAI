import { Platform } from 'react-native';

export const FREESOUND_CONFIG = {
  CLIENT_ID: 'AhgmIJeQuxpHM3XHUoIw',
  API_KEY: 'YhtmO8qRDvAlPWJTT0zYBk189QMPX4zs1iuw9nCc',
  BASE_URL: 'https://freesound.org/apiv2'
};

export const AUDIO_CONFIG = {
  mode: {
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    shouldDuckAndroid: true
  },
  soundQuality: {
    sampleRate: 44100,
    channels: 2,
    bitDepth: 16
  }
};
