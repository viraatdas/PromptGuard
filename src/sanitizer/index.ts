import { v4 as uuidv4 } from 'uuid';
import { NlpManager } from 'node-nlp';
import { logger } from '../logger';

// Define redaction types
export enum RedactionType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  NAME = 'NAME',
  ADDRESS = 'ADDRESS',
  SSN = 'SSN',
  CREDIT_CARD = 'CREDIT_CARD',
  IP_ADDRESS = 'IP_ADDRESS',
  DATE_OF_BIRTH = 'DATE_OF_BIRTH',
  CUSTOM = 'CUSTOM'
}

// Interface for redacted elements
export interface Redaction {
  originalText: string;
  type: RedactionType;
  placeholder: string;
}

// Redactions map to store original values
export interface RedactionsMap {
  [placeholder: string]: Redaction;
}

// Result of sanitization
export interface SanitizeResult {
  sanitizedPrompt: string;
  redactions: RedactionsMap;
}

// Regular expressions for common PII
const PII_PATTERNS = {
  [RedactionType.EMAIL]: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  [RedactionType.PHONE]: /(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g,
  [RedactionType.SSN]: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
  [RedactionType.CREDIT_CARD]: /\b(?:\d{4}[- ]?){3}\d{4}\b/g, 
  [RedactionType.IP_ADDRESS]: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  // Basic date pattern - could be made more sophisticated
  [RedactionType.DATE_OF_BIRTH]: /\b(0?[1-9]|1[0-2])[\/.-](0?[1-9]|[12]\d|3[01])[\/.-](19|20)?\d{2}\b/g
};

// Initialize NER model for name/address detection
const initializeNER = async (): Promise<NlpManager> => {
  const manager = new NlpManager({ languages: ['en'], forceNER: true });
  // In a production environment, you would load a pre-trained model
  // For now, we'll just use some basic entity recognition
  
  // In practice, you would train or load a pre-trained model here
  // manager.load('./models/ner-model.nlp');
  
  return manager;
};

// Singleton instance of NER model
let nerManager: NlpManager | null = null;

/**
 * Initialize the NER model if not already initialized
 */
const getNERManager = async (): Promise<NlpManager> => {
  if (!nerManager) {
    nerManager = await initializeNER();
  }
  return nerManager;
};

/**
 * Create a placeholder for redacted content
 */
const createPlaceholder = (type: RedactionType): string => {
  // Create a unique ID for the redaction
  const uuid = uuidv4().substring(0, 8);
  return `{{${type}_${uuid}}}`;
};

/**
 * Sanitize input text by redacting PII
 * @param input The input text to sanitize
 * @returns The sanitized text and a map of redactions
 */
export const sanitizeInput = async (input: string): Promise<SanitizeResult> => {
  // Initialize result
  let sanitizedText = input;
  const redactions: RedactionsMap = {};
  
  try {
    // 1. Apply regex patterns for structured PII
    for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
      sanitizedText = sanitizedText.replace(pattern, (match) => {
        const placeholder = createPlaceholder(type as RedactionType);
        redactions[placeholder] = {
          originalText: match,
          type: type as RedactionType,
          placeholder
        };
        return placeholder;
      });
    }
    
    // 2. Use NER for unstructured PII (names, addresses)
    // This is a simplified version, in a real implementation you would use
    // a more robust NER system like spaCy or a fine-tuned model
    
    const manager = await getNERManager();
    const result = await manager.process('en', sanitizedText);
    
    if (result.entities && result.entities.length > 0) {
      // Sort entities by start position in descending order to avoid offset issues
      const entities = [...result.entities].sort((a, b) => b.start - a.start);
      
      for (const entity of entities) {
        if (entity.entity === 'person' || entity.entity === 'location') {
          const type = entity.entity === 'person' ? RedactionType.NAME : RedactionType.ADDRESS;
          const originalText = sanitizedText.substring(entity.start, entity.end);
          const placeholder = createPlaceholder(type);
          
          // Replace the entity in the text
          sanitizedText = 
            sanitizedText.substring(0, entity.start) + 
            placeholder + 
            sanitizedText.substring(entity.end);
          
          // Store the redaction
          redactions[placeholder] = {
            originalText,
            type,
            placeholder
          };
        }
      }
    }
    
    // Log sanitization activity (redacted count only, not the actual content)
    logger.info(`Sanitized input: Found ${Object.keys(redactions).length} PII elements`);
    
    return {
      sanitizedPrompt: sanitizedText,
      redactions
    };
  } catch (error) {
    logger.error(`Error sanitizing input: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // In case of error, return the original text
    // This is a fallback - in production, you might want to fail safely
    return {
      sanitizedPrompt: input,
      redactions: {}
    };
  }
}; 