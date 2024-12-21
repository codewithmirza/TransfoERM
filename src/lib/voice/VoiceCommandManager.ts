export class VoiceCommandManager {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesisUtterance | null = null
  private isListening: boolean = false
  private commandHandlers: Map<string, (args: string) => Promise<void>>

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.synthesis = new SpeechSynthesisUtterance()
      this.setupRecognition()
    }
    this.commandHandlers = new Map()
    this.registerDefaultCommands()
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = true
    this.recognition.interimResults = false
    this.recognition.lang = 'en-US'

    this.recognition.onresult = async (event) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase()
      await this.processCommand(command)
    }

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error)
    }
  }

  private async processCommand(command: string) {
    // Extract command and arguments
    const [action, ...args] = command.split(' ')
    const handler = this.commandHandlers.get(action)
    
    if (handler) {
      await handler(args.join(' '))
    } else {
      await this.speak('Command not recognized')
    }
  }

  private registerDefaultCommands() {
    // Register basic commands
    this.commandHandlers.set('search', async (query) => {
      await this.speak(`Searching for ${query}`)
      // Implement search logic
    })

    this.commandHandlers.set('create', async (type) => {
      await this.speak(`Creating new ${type}`)
      // Implement creation logic
    })

    this.commandHandlers.set('show', async (what) => {
      await this.speak(`Showing ${what}`)
      // Implement display logic
    })
  }

  async speak(text: string) {
    if (!this.synthesis) return

    this.synthesis.text = text
    window.speechSynthesis.speak(this.synthesis)
  }

  startListening() {
    if (!this.recognition || this.isListening) return
    this.recognition.start()
    this.isListening = true
  }

  stopListening() {
    if (!this.recognition || !this.isListening) return
    this.recognition.stop()
    this.isListening = false
  }

  registerCommand(command: string, handler: (args: string) => Promise<void>) {
    this.commandHandlers.set(command.toLowerCase(), handler)
  }
} 