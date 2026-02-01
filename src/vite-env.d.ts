/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ELEVENLABS_AGENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// ElevenLabs Widget Web Component
declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': {
      'agent-id'?: string;
      'dynamic-variables'?: string;
      children?: React.ReactNode;
    };
  }
}
