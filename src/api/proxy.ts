import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { sanitizeInput } from '../sanitizer';
import { analyzePrompt } from '../analyzer';
import { forwardToLLM, Provider } from '../proxy';
import { processOutput } from '../proxy/outputProcessor';
import { logRequest } from '../logger/requestLogger';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/errorHandler';
import { canMakeRequest, incrementUsage } from './billing';

const router = Router();

// Available models by provider
export const AVAILABLE_MODELS = {
  [Provider.OPENAI]: [
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k',
    'gpt-4',
    'gpt-4-turbo', 
    'gpt-4-32k',
  ],
  [Provider.ANTHROPIC]: [
    'claude-2',
    'claude-instant',
    'claude-3-opus',
    'claude-3-sonnet',
    'claude-3-haiku',
  ],
  [Provider.COHERE]: [
    'command',
    'command-light',
    'command-r',
    'command-r-plus',
  ],
  [Provider.CUSTOM]: [
    'custom-model', // placeholder for custom models
  ]
};

/**
 * Get available models endpoint
 */
router.get('/models', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || req.apiKey?.userId;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }
    
    // Prepare the list of models with availability status based on user's subscription
    const modelsByProvider: Record<string, { id: string; name: string; available: boolean }[]> = {};
    
    for (const [provider, models] of Object.entries(AVAILABLE_MODELS)) {
      modelsByProvider[provider] = models.map(modelId => ({
        id: modelId,
        name: modelId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Format name
        available: canMakeRequest(userId, modelId)
      }));
    }
    
    return res.status(200).json({
      status: 'success',
      data: modelsByProvider
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Main proxy endpoint for LLM requests
 * Handles:
 * 1. Input validation
 * 2. PII sanitization
 * 3. Prompt analysis for injections/risks
 * 4. Forwarding to LLM provider
 * 5. Output processing
 * 6. Request logging
 */
router.post(
  '/completion',
  [
    // Input validation
    body('prompt').isString().notEmpty().withMessage('Prompt is required'),
    body('model').isString().notEmpty().withMessage('Model is required'),
    body('provider').isString().notEmpty().withMessage('Provider is required'),
    body('options').optional().isObject(),
    body('rehydrateOutput').optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation error', 400, true, { errors: errors.array() });
      }

      const { prompt, model, provider, options = {}, rehydrateOutput = false } = req.body;
      
      // Get user ID from auth context (JWT or API key)
      const userId = req.user?.id || req.apiKey?.userId;
      if (!userId) {
        throw new AppError('User identification required', 403);
      }
      
      // Check if the requested model is available for the user's subscription
      if (!canMakeRequest(userId, model)) {
        throw new AppError('Model not available on your current subscription plan', 403, true, {
          upgradePlanUrl: '/api/billing/plans',
          currentModel: model
        });
      }
      
      // 1. Sanitize input to remove PII
      const { sanitizedPrompt, redactions } = await sanitizeInput(prompt);
      
      // 2. Analyze prompt for injections/risks
      const analysis = await analyzePrompt(sanitizedPrompt);
      
      // 3. Check if the prompt is safe to process
      if (analysis.risk === 'HIGH') {
        // Log blocked request
        await logRequest({
          userId,
          prompt: sanitizedPrompt, 
          model,
          provider,
          status: 'BLOCKED',
          riskScore: analysis.score,
          riskReason: analysis.reason
        });
        
        throw new AppError('Prompt blocked due to safety concerns', 403, true, {
          reason: analysis.reason,
          score: analysis.score
        });
      }
      
      // 4. Forward to LLM
      const llmResponse = await forwardToLLM({
        prompt: sanitizedPrompt,
        model,
        provider,
        options
      });
      
      // 5. Process output if needed (rehydrate PII or filter content)
      const finalOutput = rehydrateOutput 
        ? await processOutput(llmResponse, redactions)
        : llmResponse;
      
      // 6. Log request and increment usage for billing
      await logRequest({
        userId,
        prompt: sanitizedPrompt,
        model,
        provider,
        status: 'COMPLETED',
        riskScore: analysis.score
      });
      
      // Increment usage for billing
      incrementUsage(userId);
      
      // Return the response
      return res.status(200).json({
        status: 'success',
        data: {
          output: finalOutput,
          riskLevel: analysis.risk,
          riskScore: analysis.score,
          redactedElementsCount: Object.keys(redactions).length
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Stream completion endpoint for streaming responses
 * Similar to the completion endpoint but uses SSE for streaming
 */
router.post('/stream-completion', [
  // Same validation as above
  body('prompt').isString().notEmpty().withMessage('Prompt is required'),
  body('model').isString().notEmpty().withMessage('Model is required'),
  body('provider').isString().notEmpty().withMessage('Provider is required'),
  body('options').optional().isObject(),
  body('rehydrateOutput').optional().isBoolean(),
], async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Implement streaming logic similar to completion endpoint
    // Will need to use Server-Sent Events (SSE) for streaming
    
    // Get user ID from auth context (JWT or API key)
    const userId = req.user?.id || req.apiKey?.userId;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }
    
    const { model } = req.body;
    
    // Check if the requested model is available for the user's subscription
    if (!canMakeRequest(userId, model)) {
      throw new AppError('Model not available on your current subscription plan', 403, true, {
        upgradePlanUrl: '/api/billing/plans',
        currentModel: model
      });
    }
    
    // Placeholder for streaming implementation
    res.status(501).json({ message: 'Streaming not yet implemented' });
  } catch (error) {
    next(error);
  }
});

export const proxyRoutes = router; 