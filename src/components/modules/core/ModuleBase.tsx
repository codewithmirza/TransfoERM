export abstract class ModuleBase {
  abstract init(): Promise<void>
  abstract render(): JSX.Element
  abstract handleEvents(): void
} 