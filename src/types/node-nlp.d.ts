declare module 'node-nlp' {
  export class NlpManager {
    constructor(options: { languages: string[]; forceNER: boolean });
    load(filename: string): Promise<any>;
    process(language: string, text: string): Promise<{
      entities: Array<{
        entity: string;
        start: number;
        end: number;
        resolution: any;
        accuracy: number;
        sourceText: string;
      }>;
    }>;
  }
} 