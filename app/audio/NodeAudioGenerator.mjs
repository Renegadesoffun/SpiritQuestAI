import fs from 'fs/promises';
import path from 'path';

class NodeAudioGenerator {
    static sampleRate = 44100;

    static async generateTone(frequency, duration, volume = 0.5) {
        const numSamples = Math.floor(this.sampleRate * duration);
        const buffer = Buffer.alloc(44 + numSamples * 2); // WAV header + audio data

        // Write WAV header
        buffer.write('RIFF', 0);
        buffer.writeUInt32LE(36 + numSamples * 2, 4);
        buffer.write('WAVE', 8);
        buffer.write('fmt ', 12);
        buffer.writeUInt32LE(16, 16);
        buffer.writeUInt16LE(1, 20);
        buffer.writeUInt16LE(1, 22);
        buffer.writeUInt32LE(this.sampleRate, 24);
        buffer.writeUInt32LE(this.sampleRate * 2, 28);
        buffer.writeUInt16LE(2, 32);
        buffer.writeUInt16LE(16, 34);
        buffer.write('data', 36);
        buffer.writeUInt32LE(numSamples * 2, 40);

        // Generate audio data
        for (let i = 0; i < numSamples; i++) {
            const t = i / this.sampleRate;
            const sample = Math.sin(2 * Math.PI * frequency * t) * volume * 32767;
            buffer.writeInt16LE(Math.floor(sample), 44 + i * 2);
        }

        return buffer;
    }

    static async generateChord(frequencies, duration, volume = 0.5) {
        const numSamples = Math.floor(this.sampleRate * duration);
        const audioData = new Int16Array(numSamples);

        for (let i = 0; i < numSamples; i++) {
            const t = i / this.sampleRate;
            let sample = 0;
            for (const freq of frequencies) {
                sample += Math.sin(2 * Math.PI * freq * t);
            }
            audioData[i] = Math.floor((sample / frequencies.length) * volume * 32767);
        }

        return Buffer.from(audioData.buffer);
    }

    static async generateInstrumentSound(outputPath, type, note, settings = {}) {
        const noteFrequencies = {
            'C3': 130.81, 'G3': 196.00,
            'C4': 261.63, 'G4': 392.00,
            'chord_Cmaj': [261.63, 329.63, 392.00]
        };

        let audioData;
        const duration = settings.duration || 2.0;
        const freq = noteFrequencies[note];

        if (Array.isArray(freq)) {
            audioData = await this.generateChord(freq, duration, settings.volume || 0.5);
        } else {
            audioData = await this.generateTone(freq, duration, settings.volume || 0.5);
        }

        await this.saveWavFile(outputPath, audioData);
    }

    static async generateEffect(outputPath, effect, config) {
        const duration = config.duration / 1000; // Convert ms to seconds
        const baseFreq = 440;
        let audioData;

        switch (effect) {
            case 'magical_chime':
                audioData = await this.generateChord([baseFreq, baseFreq * 1.5, baseFreq * 2], duration, config.volume);
                break;
            case 'collect_crystal':
                audioData = await this.generateTone(baseFreq * 2, duration, config.volume);
                break;
            case 'achievement':
                audioData = await this.generateChord([baseFreq, baseFreq * 1.25, baseFreq * 1.5], duration, config.volume);
                break;
            case 'spirit_whoosh':
                audioData = await this.generateTone(baseFreq / 2, duration, config.volume);
                break;
            default:
                audioData = await this.generateTone(baseFreq, duration, config.volume);
        }

        await this.saveWavFile(outputPath, audioData);
    }

    static async saveWavFile(outputPath, audioData) {
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, audioData);
        console.log(`Generated: ${outputPath}`);
    }
}

export { NodeAudioGenerator }; 