import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../logger';

const router = Router();

// Mock API key storage
// In a real app, this would be stored in a database
interface APIKey {
  id: string;
  name: string;
  key: string;
  userId: string;
  permissions: string[];
  createdAt: Date;
  lastUsed?: Date;
}

const apiKeys: Record<string, APIKey> = {};

/**
 * Create a new API key
 */
router.post(
  '/',
  [
    body('name').isString().notEmpty().withMessage('API key name is required'),
    body('permissions').isArray().withMessage('Permissions must be an array'),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation error', 400, true, { errors: errors.array() });
      }

      // Get user ID from auth middleware
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User identification required', 403);
      }

      const { name, permissions = ['proxy:read'] } = req.body;

      // Generate a unique API key
      const apiKey = `pg_${uuidv4().replace(/-/g, '')}`;
      const id = uuidv4();

      // Store the API key (in a real app, this would be hashed)
      apiKeys[apiKey] = {
        id,
        name,
        key: apiKey,
        userId,
        permissions,
        createdAt: new Date(),
      };

      // Log API key creation
      logger.info(`API key created: ${name} for user ${userId}`);

      // Return the API key to the client
      return res.status(201).json({
        status: 'success',
        data: {
          id,
          name,
          key: apiKey,
          permissions,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * List API keys for the authenticated user
 */
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }

    // Find API keys for this user
    const userApiKeys = Object.values(apiKeys).filter(
      (key) => key.userId === userId
    );

    // Return filtered API keys (without the actual key value)
    return res.status(200).json({
      status: 'success',
      data: userApiKeys.map(({ key, ...rest }) => ({
        ...rest,
        // Show only the first and last 4 characters of the key
        keyPreview: `${key.substring(0, 4)}...${key.substring(key.length - 4)}`,
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get a single API key by ID
 */
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }

    const { id } = req.params;

    // Find the API key
    const apiKey = Object.values(apiKeys).find(
      (key) => key.id === id && key.userId === userId
    );

    if (!apiKey) {
      throw new AppError('API key not found', 404);
    }

    // Return the API key (without the actual key value)
    const { key, ...rest } = apiKey;
    return res.status(200).json({
      status: 'success',
      data: {
        ...rest,
        // Show only the first and last 4 characters of the key
        keyPreview: `${key.substring(0, 4)}...${key.substring(key.length - 4)}`,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete an API key
 */
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }

    const { id } = req.params;

    // Find the API key
    const apiKeyEntry = Object.entries(apiKeys).find(
      ([_, key]) => key.id === id && key.userId === userId
    );

    if (!apiKeyEntry) {
      throw new AppError('API key not found', 404);
    }

    // Delete the API key
    const [keyString, apiKey] = apiKeyEntry;
    delete apiKeys[keyString];

    // Log API key deletion
    logger.info(`API key deleted: ${apiKey.name} for user ${userId}`);

    // Return success
    return res.status(200).json({
      status: 'success',
      message: 'API key deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export const apiKeyRoutes = router; 