declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export class VoiceRecognition {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;

  constructor(
    private onResult: (transcript: string) => void,
    private onStart?: () => void,
    private onEnd?: () => void,
    private onError?: (error: string) => void
  ) {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor = (
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
      ) as new () => SpeechRecognition;

      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.setupRecognition();
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStart?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEnd?.();
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.onError?.(event.error);
      this.isListening = false;
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = Array.from(event.results);
      const transcript = results
        .map(result => result[0].transcript)
        .join('');

      this.onResult(transcript);
    };
  }

  start() {
    if (!this.recognition) {
      this.onError?.('Speech recognition not supported');
      return;
    }

    if (!this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }
} 