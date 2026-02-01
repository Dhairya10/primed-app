export class AudioCaptureService {
  private onAudioChunk: (pcmData: ArrayBuffer) => void;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private gainNode: GainNode | null = null;
  private stream: MediaStream | null = null;
  private inputVolume = 0;

  isMuted = false;
  isRecording = false;

  constructor(onAudioChunk: (pcmData: ArrayBuffer) => void) {
    this.onAudioChunk = onAudioChunk;
  }

  setOnAudioChunk(onAudioChunk: (pcmData: ArrayBuffer) => void) {
    this.onAudioChunk = onAudioChunk;
  }

  async start(): Promise<void> {
    if (this.isRecording) return;

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.audioContext = new AudioContext({ sampleRate: 16000 });
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;

    const bufferSize = 4096;
    this.processorNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

    this.processorNode.onaudioprocess = (event) => {
      if (!this.audioContext) return;

      const input = event.inputBuffer.getChannelData(0);
      this.inputVolume = calculateRms(input);

      if (this.isMuted) return;

      const pcmBuffer = downsampleToPCM16(input, this.audioContext.sampleRate, 16000);
      if (pcmBuffer.byteLength > 0) {
        this.onAudioChunk(pcmBuffer);
      }
    };

    this.sourceNode.connect(this.processorNode);
    this.processorNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    this.isRecording = true;
  }

  stop(): void {
    this.isRecording = false;

    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode.onaudioprocess = null;
      this.processorNode = null;
    }

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.audioContext) {
      void this.audioContext.close();
      this.audioContext = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.isMuted = false;
    this.inputVolume = 0;
  }

  mute(): void {
    this.isMuted = true;
  }

  unmute(): void {
    this.isMuted = false;
  }

  getInputVolume(): number {
    return this.inputVolume;
  }
}

function calculateRms(input: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < input.length; i += 1) {
    sum += input[i] * input[i];
  }
  return Math.sqrt(sum / input.length);
}

function downsampleToPCM16(
  buffer: Float32Array,
  inputSampleRate: number,
  outputSampleRate: number
): ArrayBuffer {
  if (outputSampleRate === inputSampleRate) {
    return float32ToPCM16(buffer);
  }

  const sampleRateRatio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Int16Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accumulator = 0;
    let count = 0;

    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i += 1) {
      accumulator += buffer[i];
      count += 1;
    }

    const sample = accumulator / count;
    const clamped = Math.max(-1, Math.min(1, sample));
    result[offsetResult] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    offsetResult += 1;
    offsetBuffer = nextOffsetBuffer;
  }

  return result.buffer;
}

function float32ToPCM16(float32Array: Float32Array): ArrayBuffer {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, float32Array[i]));
    pcm16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return pcm16.buffer;
}
