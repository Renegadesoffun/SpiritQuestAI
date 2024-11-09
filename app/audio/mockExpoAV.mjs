class MockAudio {
    static Sound = class {
        async loadAsync() { return Promise.resolve(); }
        async playAsync() { return Promise.resolve(); }
        async stopAsync() { return Promise.resolve(); }
        async unloadAsync() { return Promise.resolve(); }
        async setVolumeAsync() { return Promise.resolve(); }
    };

    static Recording = class {
        async prepareToRecordAsync() { return Promise.resolve(); }
        async startAsync() { return Promise.resolve(); }
        async stopAndUnloadAsync() { return Promise.resolve(); }
        getURI() { return 'mock-recording.wav'; }
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
                audioQuality: 127,
                sampleRate: 44100,
                numberOfChannels: 2,
                bitRate: 128000,
                linearPCMBitDepth: 16,
                linearPCMIsBigEndian: false,
                linearPCMIsFloat: false,
            },
        }
    };

    static async setAudioModeAsync() {
        return Promise.resolve();
    }
}

export default { Audio: MockAudio }; 