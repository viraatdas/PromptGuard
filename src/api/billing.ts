import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../logger';

const router = Router();

// Define subscription plan tiers
export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

// Define subscription plans with features and limits
export const SUBSCRIPTION_PLANS = {
  [SubscriptionTier.FREE]: {
    id: 'free',
    name: 'Free Tier',
    description: 'Basic access with limited requests and features',
    price: 0,
    features: [
      'Up to 100 requests per day',
      'Access to basic models only',
      'Basic PII detection',
      'Standard support',
    ],
    limits: {
      dailyRequests: 100,
      modelAccess: {
        openai: ['gpt-3.5-turbo'],
        anthropic: ['claude-instant'],
        cohere: ['command-light'],
      },
    },
  },
  [SubscriptionTier.BASIC]: {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Enhanced access with more requests and features',
    price: 9.99,
    features: [
      'Up to 1,000 requests per day',
      'Access to standard models',
      'Advanced PII detection',
      'Priority support',
    ],
    limits: {
      dailyRequests: 1000,
      modelAccess: {
        openai: ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
        anthropic: ['claude-instant', 'claude-2'],
        cohere: ['command-light', 'command'],
      },
    },
  },
  [SubscriptionTier.PREMIUM]: {
    id: 'premium',
    name: 'Premium Plan',
    description: 'Premium access with high volume requests and all models',
    price: 49.99,
    features: [
      'Up to 10,000 requests per day',
      'Access to all models except GPT-4-32k',
      'Advanced PII detection and custom rules',
      'Priority support and SLA',
    ],
    limits: {
      dailyRequests: 10000,
      modelAccess: {
        openai: ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-turbo'],
        anthropic: ['claude-instant', 'claude-2', 'claude-3-sonnet', 'claude-3-haiku'],
        cohere: ['command-light', 'command', 'command-r'],
      },
    },
  },
  [SubscriptionTier.ENTERPRISE]: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    description: 'Customized enterprise solution with unlimited access',
    price: 499.99,
    features: [
      'Unlimited requests',
      'Access to all models including the most powerful ones',
      'Custom PII detection rules and rehydration',
      'Dedicated support and account manager',
      'Custom SLA and compliance features',
    ],
    limits: {
      dailyRequests: Infinity,
      modelAccess: {
        openai: ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-turbo', 'gpt-4-32k'],
        anthropic: [
          'claude-instant',
          'claude-2',
          'claude-3-sonnet',
          'claude-3-haiku',
          'claude-3-opus',
        ],
        cohere: ['command-light', 'command', 'command-r', 'command-r-plus'],
        custom: ['custom-model'],
      },
    },
  },
};

// Define subscription status
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  INACTIVE = 'INACTIVE',
}

// Define user subscription interface
export interface UserSubscription {
  userId: string;
  planId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  usage: {
    dailyRequests: number;
    lastResetDate: Date;
  };
  paymentMethod?: {
    type: string;
    lastFour?: string;
    expiryDate?: string;
  };
}

// Mock storage for user subscriptions (in production this would be a database)
const userSubscriptions: Record<string, UserSubscription> = {};

/**
 * Get a user's subscription
 * @param userId The user ID
 * @returns The user's subscription or null if not found
 */
export function getUserSubscription(userId: string): UserSubscription | null {
  return userSubscriptions[userId] || null;
}

/**
 * Create or update a user's subscription
 * @param userId The user ID
 * @param tier The subscription tier
 * @returns The updated user subscription
 */
export function updateUserSubscription(
  userId: string,
  tier: SubscriptionTier
): UserSubscription {
  const now = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  const existingSubscription = userSubscriptions[userId];
  
  // Create new subscription or update existing one
  const subscription: UserSubscription = {
    userId,
    planId: SUBSCRIPTION_PLANS[tier].id,
    tier,
    status: SubscriptionStatus.ACTIVE,
    createdAt: existingSubscription?.createdAt || now,
    updatedAt: now,
    currentPeriodStart: now,
    currentPeriodEnd: endDate,
    cancelAtPeriodEnd: false,
    usage: existingSubscription?.usage || {
      dailyRequests: 0,
      lastResetDate: now,
    },
    paymentMethod: existingSubscription?.paymentMethod,
  };

  // Store the subscription
  userSubscriptions[userId] = subscription;
  
  return subscription;
}

/**
 * Cancel a user's subscription
 * @param userId The user ID
 * @returns The updated user subscription
 */
export function cancelUserSubscription(userId: string): UserSubscription | null {
  const subscription = userSubscriptions[userId];
  
  if (!subscription) {
    return null;
  }
  
  subscription.cancelAtPeriodEnd = true;
  subscription.updatedAt = new Date();
  
  return subscription;
}

/**
 * Check if a user can make a request to a specific model
 * @param userId The user ID
 * @param model The model ID
 * @returns Whether the user can make a request
 */
export function canMakeRequest(userId: string, model: string): boolean {
  // Get the user's subscription
  const subscription = getUserSubscription(userId);
  
  // If no subscription exists, create a free tier subscription
  if (!subscription) {
    updateUserSubscription(userId, SubscriptionTier.FREE);
    return canMakeRequest(userId, model); // Recursive call with newly created subscription
  }
  
  // If subscription is not active, deny the request
  if (subscription.status !== SubscriptionStatus.ACTIVE) {
    return false;
  }
  
  // Check daily request limit
  const now = new Date();
  const lastResetDate = new Date(subscription.usage.lastResetDate);
  
  // Reset daily count if it's a new day
  if (now.toDateString() !== lastResetDate.toDateString()) {
    subscription.usage.dailyRequests = 0;
    subscription.usage.lastResetDate = now;
  }
  
  // Check if user has reached daily limit
  const plan = SUBSCRIPTION_PLANS[subscription.tier];
  if (subscription.usage.dailyRequests >= plan.limits.dailyRequests) {
    return false;
  }
  
  // Check if the model is accessible on the user's plan
  for (const [provider, models] of Object.entries(plan.limits.modelAccess)) {
    if (models.includes(model)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Increment a user's usage count
 * @param userId The user ID
 * @returns The updated usage count
 */
export function incrementUsage(userId: string): number {
  const subscription = getUserSubscription(userId);
  
  if (!subscription) {
    return 0;
  }
  
  // Check if it's a new day and reset if needed
  const now = new Date();
  const lastResetDate = new Date(subscription.usage.lastResetDate);
  
  if (now.toDateString() !== lastResetDate.toDateString()) {
    subscription.usage.dailyRequests = 0;
    subscription.usage.lastResetDate = now;
  }
  
  // Increment the usage count
  subscription.usage.dailyRequests += 1;
  
  return subscription.usage.dailyRequests;
}

/**
 * Get all available subscription plans
 */
router.get('/plans', async (req: AuthRequest, res, next) => {
  try {
    return res.status(200).json({
      status: 'success',
      data: Object.values(SUBSCRIPTION_PLANS),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get the current user's subscription
 */
router.get('/subscription', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.id || req.apiKey?.userId;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }
    
    // Get the user's subscription or create a free tier one if none exists
    let subscription = getUserSubscription(userId);
    
    if (!subscription) {
      subscription = updateUserSubscription(userId, SubscriptionTier.FREE);
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        subscription,
        plan: SUBSCRIPTION_PLANS[subscription.tier],
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update the user's subscription
 */
router.post(
  '/subscription',
  [
    body('tier')
      .isString()
      .isIn(Object.values(SubscriptionTier))
      .withMessage('Valid subscription tier is required'),
    body('paymentMethodId').optional().isString(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation error', 400, true, { errors: errors.array() });
      }
      
      const userId = req.user?.id || req.apiKey?.userId;
      if (!userId) {
        throw new AppError('User identification required', 403);
      }
      
      const { tier, paymentMethodId } = req.body;
      
      // For paid plans, require a payment method
      if (tier !== SubscriptionTier.FREE && !paymentMethodId) {
        throw new AppError('Payment method required for paid plans', 400);
      }
      
      // Update the subscription
      const subscription = updateUserSubscription(userId, tier);
      
      // Add payment method if provided
      if (paymentMethodId) {
        // In a real implementation, this would validate the payment method
        // and possibly charge the user
        subscription.paymentMethod = {
          type: 'card',
          lastFour: '4242', // Mock data
          expiryDate: '12/2025', // Mock data
        };
      }
      
      return res.status(200).json({
        status: 'success',
        data: {
          subscription,
          plan: SUBSCRIPTION_PLANS[subscription.tier],
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Cancel the user's subscription
 */
router.post('/subscription/cancel', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.id || req.apiKey?.userId;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }
    
    const subscription = cancelUserSubscription(userId);
    
    if (!subscription) {
      throw new AppError('No active subscription found', 404);
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        subscription,
        message: 'Subscription will be canceled at the end of the billing period',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get the user's usage statistics
 */
router.get('/usage', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.id || req.apiKey?.userId;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }
    
    const subscription = getUserSubscription(userId);
    
    if (!subscription) {
      throw new AppError('No subscription found', 404);
    }
    
    const plan = SUBSCRIPTION_PLANS[subscription.tier];
    
    return res.status(200).json({
      status: 'success',
      data: {
        usage: subscription.usage,
        limit: plan.limits.dailyRequests,
        remainingRequests: plan.limits.dailyRequests - subscription.usage.dailyRequests,
        usagePercentage: (subscription.usage.dailyRequests / plan.limits.dailyRequests) * 100,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update the user's payment method
 */
router.post(
  '/payment-method',
  [
    body('paymentMethodId').isString().withMessage('Payment method ID is required'),
    body('type').isString().withMessage('Payment method type is required'),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation error', 400, true, { errors: errors.array() });
      }
      
      const userId = req.user?.id || req.apiKey?.userId;
      if (!userId) {
        throw new AppError('User identification required', 403);
      }
      
      let subscription = getUserSubscription(userId);
      
      if (!subscription) {
        // Create a free tier subscription if none exists
        subscription = updateUserSubscription(userId, SubscriptionTier.FREE);
      }
      
      // Update the payment method
      // In a real implementation, this would validate the payment method with a payment processor
      subscription.paymentMethod = {
        type: req.body.type,
        lastFour: '4242', // Mock data
        expiryDate: '12/2025', // Mock data
      };
      
      return res.status(200).json({
        status: 'success',
        data: {
          paymentMethod: subscription.paymentMethod,
          message: 'Payment method updated successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export const billingRoutes = router;