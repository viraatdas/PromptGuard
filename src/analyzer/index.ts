import { logger } from '../logger';

// Risk level enum
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

// Analysis result interface
export interface PromptAnalysisResult {
  risk: RiskLevel;
  score: number; // 0-100 score, higher = more risky
  reason?: string;
}

// Patterns for common injection techniques
const INJECTION_PATTERNS = [
  // System prompt injection attempts
  { pattern: /ignore\s+(previous|above|all)\s+(instructions|prompts)/i, weight: 0.8, reason: 'Attempt to ignore instructions' },
  { pattern: /ignore\s+your\s+(guidelines|training|rules)/i, weight: 0.8, reason: 'Attempt to bypass training' },
  { pattern: /disregard\s+(previous|above|all)\s+(instructions|prompts)/i, weight: 0.7, reason: 'Attempt to disregard instructions' },
  
  // Role play pattern
  { pattern: /you\s+(are|act\s+as)\s+a\s+DAN/i, weight: 0.9, reason: 'DAN jailbreak attempt' },
  { pattern: /you\s+(are|act\s+as)\s+a.*with\s+no\s+ethical\s+constraints/i, weight: 0.9, reason: 'Ethics bypass attempt' },
  
  // Delimiter exploit attempts
  { pattern: /```.*?```/s, weight: 0.5, reason: 'Code block delimitation' },
  { pattern: /\<\/?system\>/i, weight: 0.7, reason: 'Potential system prompt injection' },
  
  // Continuation tricks
  { pattern: /\.\.\./i, weight: 0.3, reason: 'Potential continuation trick' },
  
  // Command injection patterns
  { pattern: /sudo|\/bin\/bash|exec\(|system\(/i, weight: 0.8, reason: 'Command injection pattern' },
  
  // Harmful instructions
  { pattern: /how\s+to\s+(make|create|build)\s+(bombs|explosives|weapons)/i, weight: 0.9, reason: 'Harmful instructions request' },
  { pattern: /how\s+to\s+(hack|break\s+into|steal)/i, weight: 0.8, reason: 'Harmful activity instructions request' },
  
  // URL/payload patterns
  { pattern: /(https?:\/\/[^\s]+)/i, weight: 0.6, reason: 'External URL in prompt' },
  
  // Nested quotes
  { pattern: /""".*?"""/s, weight: 0.6, reason: 'Triple quote delimitation' }
];

/**
 * Check for suspicious repetition that could indicate an attack
 */
const checkForRepetition = (text: string): { detected: boolean; weight: number } => {
  // Check for repeated characters
  const repeatedCharsMatch = text.match(/(.)\1{10,}/g);
  if (repeatedCharsMatch) {
    return { detected: true, weight: 0.7 };
  }
  
  // Check for repeated words or phrases (simple check)
  const words = text.split(/\s+/);
  const wordFreq: Record<string, number> = {};
  
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  const maxFreq = Math.max(...Object.values(wordFreq));
  if (maxFreq > 10 && words.length > 20) {
    return { detected: true, weight: 0.6 };
  }
  
  return { detected: false, weight: 0 };
};

/**
 * Analyze prompt text for potential injection risks
 * @param text The text to analyze
 * @returns Analysis result with risk level and score
 */
export const analyzePrompt = async (text: string): Promise<PromptAnalysisResult> => {
  try {
    // Initialize result
    let score = 0;
    let highestWeight = 0;
    let primaryReason = '';
    
    // Check prompt length (unusually long prompts might be suspicious)
    const promptLength = text.length;
    if (promptLength > 10000) {
      score += 20;
    } else if (promptLength > 5000) {
      score += 10;
    }
    
    // Check for dangerous patterns
    for (const { pattern, weight, reason } of INJECTION_PATTERNS) {
      if (pattern.test(text)) {
        score += weight * 100;
        
        // Store the reason with the highest weight
        if (weight > highestWeight) {
          highestWeight = weight;
          primaryReason = reason;
        }
      }
    }
    
    // Check for repetition
    const repetition = checkForRepetition(text);
    if (repetition.detected) {
      score += repetition.weight * 100;
      if (repetition.weight > highestWeight) {
        highestWeight = repetition.weight;
        primaryReason = 'Suspicious repetition pattern detected';
      }
    }
    
    // Apply additional NLP-based analysis in a production system
    // This would involve a pre-trained model to classify injection attempts
    
    // Cap the score at 100
    score = Math.min(score, 100);
    
    // Determine risk level based on score
    let risk: RiskLevel;
    if (score >= 70) {
      risk = RiskLevel.HIGH;
    } else if (score >= 30) {
      risk = RiskLevel.MEDIUM;
    } else {
      risk = RiskLevel.LOW;
    }
    
    // Log analysis (without including the full text)
    logger.debug(`Prompt analysis: Risk=${risk}, Score=${score.toFixed(2)}`);
    
    return {
      risk,
      score,
      reason: primaryReason || undefined
    };
  } catch (error) {
    logger.error(`Error analyzing prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // Return low risk by default in case of error
    return {
      risk: RiskLevel.LOW,
      score: 0,
      reason: 'Analysis error'
    };
  }
}; 