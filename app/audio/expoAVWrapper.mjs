// This file handles expo-av imports in a way that works in both Node.js and Expo environments
let Audio;

async function initAudio() {
    try {
        if (typeof window !== 'undefined') {
            // Browser/Expo environment
            const expo = await import('expo-av');
            Audio = expo.Audio;
        } else {
            // Node.js environment (for asset generation)
            Audio = {
                Sound: {
                    createAsync: async () => ({
                        sound: { playAsync: () => {} },
                        status: {}
                    })
                },
                setAudioModeAsync: async () => {},
                INTERRUPTION_MODE_IOS_DUCK_OTHERS: 0,
                INTERRUPTION_MODE_ANDROID_DUCK_OTHERS: 1
            };
        }
    } catch (error) {
        console.error('Error initializing Audio:', error);
        throw error;
    }
}

// Initialize Audio immediately
await initAudio();

export { Audio };

export async function initializeAudio() {
    console.log('✓ Audio system initialized');
    return true;
} 