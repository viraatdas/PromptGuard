import axios from 'axios';
import OpenAI from 'openai';
import { logger } from '../logger';
import { AppError } from '../middlewares/errorHandler';

/**
 * LLM Provider proxy configuration
 */

// LLM Providers supported by the proxy
export enum Provider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  COHERE = 'cohere',
  CUSTOM = 'custom'
}

/**
 * Interface for proxy request options
 */
export interface ProxyRequestOptions {
  prompt: string;
  model: string;
  provider: string;
  options?: Record<string, any>;
}

// Request options for the LLM
export interface LLMRequestOptions {
  temperature?: number;
  maxTokens?: number;
  stop?: string[];
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  [key: string]: any; // Additional provider-specific options
}

// Request parameters for forwarding to LLM
export interface ForwardRequest {
  prompt: string;
  model: string;
  provider: string;
  options?: LLMRequestOptions;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder',
});

/**
 * Forward a request to the OpenAI API
 */
const forwardToOpenAI = async (
  prompt: string,
  model: string,
  options: LLMRequestOptions = {}
): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      stop: options.stop,
      top_p: options.topP,
      frequency_penalty: options.frequencyPenalty,
      presence_penalty: options.presencePenalty,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    logger.error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new AppError(
      `Error calling OpenAI API: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
};

/**
 * Forward a request to the Anthropic API
 */
const forwardToAnthropic = async (
  prompt: string,
  model: string,
  options: LLMRequestOptions = {}
): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/complete',
      {
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
        model,
        max_tokens_to_sample: options.maxTokens || 1000,
        temperature: options.temperature,
        stop_sequences: options.stop || ['\n\nHuman:'],
        top_p: options.topP,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.ANTHROPIC_API_KEY || 'placeholder',
        },
      }
    );

    return response.data.completion || '';
  } catch (error) {
    logger.error(`Anthropic API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new AppError(
      `Error calling Anthropic API: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
};

/**
 * Forward a request to the Cohere API
 */
const forwardToCohere = async (
  prompt: string,
  model: string,
  options: LLMRequestOptions = {}
): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        prompt,
        model,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature,
        stop_sequences: options.stop,
        k: options.topP ? Math.round(options.topP * 100) : undefined,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.COHERE_API_KEY || 'placeholder'}`,
        },
      }
    );

    return response.data.generations[0]?.text || '';
  } catch (error) {
    logger.error(`Cohere API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new AppError(
      `Error calling Cohere API: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
};

/**
 * Forward a request to a custom API endpoint
 */
const forwardToCustom = async (
  prompt: string,
  model: string,
  options: LLMRequestOptions = {}
): Promise<string> => {
  try {
    // Get custom endpoint from environment or options
    const endpoint = options.endpoint || process.env.CUSTOM_LLM_ENDPOINT;
    
    if (!endpoint) {
      throw new Error('Custom endpoint not configured');
    }
    
    // Get custom API key from environment or options
    const apiKey = options.apiKey || process.env.CUSTOM_LLM_API_KEY;
    
    // Forward request to custom endpoint
    const response = await axios.post(
      endpoint,
      {
        prompt,
        model,
        ...options,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
          ...options.headers,
        },
      }
    );

    // Extract response based on the path provided in options or use a default
    const responsePath = options.responsePath || 'result';
    const pathParts = responsePath.split('.');
    
    let result = response.data;
    for (const part of pathParts) {
      if (result && typeof result === 'object' && part in result) {
        result = result[part];
      } else {
        result = '';
        break;
      }
    }

    return typeof result === 'string' ? result : JSON.stringify(result);
  } catch (error) {
    logger.error(`Custom API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new AppError(
      `Error calling custom API: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
};

/**
 * Forward sanitized prompt to the selected LLM provider
 */
export async function forwardToLLM(request: ForwardRequest): Promise<string> {
  const { prompt, model, provider, options = {} } = request;
  
  try {
    // Determine provider and call appropriate function
    switch (provider.toLowerCase()) {
      case Provider.OPENAI:
        return await forwardToOpenAI(prompt, model, options);
      case Provider.ANTHROPIC:
        return await forwardToAnthropic(prompt, model, options);
      case Provider.COHERE:
        return await forwardToCohere(prompt, model, options);
      case Provider.CUSTOM:
        return await forwardToCustom(prompt, model, options);
      default:
        throw new AppError(`Unsupported provider: ${provider}`, 400);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      `Error forwarding request to LLM: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
} 