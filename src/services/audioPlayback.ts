export class AudioPlaybackService {
  private audioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private outputVolume = 0;

  isPlaying = false;

  async playAudio(pcmData: ArrayBuffer, mimeType: string): Promise<void> {
    const sampleRate = parseSampleRate(mimeType) ?? 24000;

    if (!this.audioContext) {
      this.audioContext = new AudioContext({ sampleRate });
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const float32Array = pcm16ToFloat32(pcmData);
    this.outputVolume = calculateRms(float32Array);

    const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, sampleRate);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    const startTime = Math.max(this.audioContext.currentTime, this.nextStartTime);
    source.start(startTime);
    this.nextStartTime = startTime + audioBuffer.duration;
    this.isPlaying = true;

    source.onended = () => {
      if (this.audioContext && this.audioContext.currentTime >= this.nextStartTime - 0.01) {
        this.isPlaying = false;
        this.outputVolume = 0;
      }
    };
  }

  stop(): void {
    this.isPlaying = false;
    this.nextStartTime = 0;
    this.outputVolume = 0;

    if (this.audioContext) {
      void this.audioContext.close();
      this.audioContext = null;
    }
  }

  getOutputVolume(): number {
    return this.outputVolume;
  }
}

function parseSampleRate(mimeType?: string): number | null {
  if (!mimeType) return null;
  const match = /rate=(\d+)/.exec(mimeType);
  return match ? Number(match[1]) : null;
}

function pcm16ToFloat32(pcmData: ArrayBuffer): Float32Array {
  const int16Array = new Int16Array(pcmData);
  const float32Array = new Float32Array(int16Array.length);

  for (let i = 0; i < int16Array.length; i += 1) {
    float32Array[i] = int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7fff);
  }

  return float32Array;
}

function calculateRms(input: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < input.length; i += 1) {
    sum += input[i] * input[i];
  }
  return Math.sqrt(sum / input.length);
}
