import { Audio } from './expoAVWrapper.mjs';

export class AudioEngine {
    static async init() {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false
        });
    }

    static async loadSound(path) {
        const sound = new Audio.Sound();
        try {
            await sound.loadAsync(path);
            return sound;
        } catch (error) {
            console.error('Error loading sound:', error);
            return null;
        }
    }

    static async playSound(sound, options = {}) {
        try {
            await sound.playAsync(options);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    static async stopSound(sound) {
        try {
            await sound.stopAsync();
        } catch (error) {
            console.error('Error stopping sound:', error);
        }
    }
}
