import fs from 'fs/promises';
import path from 'path';

class NodeAudio {
    static async createSound() {
        return {
            async loadAsync(source) {
                // Mock load for Node environment
                console.log('Loading audio in Node environment...');
            },
            async playAsync() {
                console.log('Playing audio in Node environment...');
            },
            async stopAsync() {
                console.log('Stopping audio in Node environment...');
            },
            async unloadAsync() {
                console.log('Unloading audio in Node environment...');
            },
            async setVolumeAsync(volume) {
                console.log(`Setting volume to ${volume} in Node environment...`);
            }
        };
    }

    static Recording = class {
        async prepareToRecordAsync(options) {
            console.log('Preparing to record with options:', options);
        }

        async startAsync() {
            console.log('Starting recording...');
        }

        async stopAndUnloadAsync() {
            console.log('Stopping and unloading recording...');
        }

        getURI() {
            return 'mock-recording-uri';
        }
    };

    static RecordingOptionsPresets = {
        HIGH_QUALITY: {
            android: {
                extension: '.wav',
                outputFormat: 2,
                audioEncoder: 3,
                sampleRate: 44100,
                numberOfChannels: 2,
                bitRate: 128000,
            },
            ios: {
                extension: '.wav',
                audioQuality: 0x7F,
                sampleRate: 44100,
                numberOfChannels: 2,
                bitRate: 128000,
                linearPCMBitDepth: 16,
                linearPCMIsBigEndian: false,
                linearPCMIsFloat: false,
            },
        }
    };
}

export { NodeAudio as Audio }; 