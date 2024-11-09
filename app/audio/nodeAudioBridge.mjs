import fs from 'fs/promises';
import path from 'path';

class NodeAudioBridge {
    static async createSound(filePath) {
        return {
            async loadAsync() {
                console.log(`[Node] Loading sound: ${filePath}`);
                return Promise.resolve();
            },
            async playAsync() {
                console.log(`[Node] Playing sound: ${filePath}`);
                return Promise.resolve();
            },
            async stopAsync() {
                console.log(`[Node] Stopping sound: ${filePath}`);
                return Promise.resolve();
            },
            async unloadAsync() {
                console.log(`[Node] Unloading sound: ${filePath}`);
                return Promise.resolve();
            }
        };
    }

    static async setAudioModeAsync() {
        console.log('[Node] Setting audio mode');
        return Promise.resolve();
    }

    static Recording = class {
        constructor() {
            this.outputFile = null;
        }

        async prepareToRecordAsync() {
            console.log('[Node] Preparing to record');
            return Promise.resolve();
        }

        async startAsync() {
            console.log('[Node] Starting recording');
            return Promise.resolve();
        }

        async stopAndUnloadAsync() {
            console.log('[Node] Stopping recording');
            return Promise.resolve();
        }

        getURI() {
            return this.outputFile;
        }

        setOutputFile(file) {
            this.outputFile = file;
        }
    };

    static Sound = class {
        static createAsync(source, initialStatus = {}) {
            console.log('[Node] Creating sound:', source);
            return NodeAudioBridge.createSound(source);
        }
    };
}

export { NodeAudioBridge as Audio }; 