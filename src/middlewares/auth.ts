import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { logger } from '../logger';

/**
 * Extended Request interface to include user data
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  apiKey?: {
    id: string;
    userId: string;
    name: string;
    permissions: string[];
  };
}

/**
 * Authentication middleware
 * Validates JWT tokens from Authorization header
 * or API keys from X-API-Key header
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const apiKey = req.headers['x-api-key'] as string;

    // Check if using JWT auth or API key
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // JWT authentication
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        throw new AppError('No authentication token provided', 401);
      }

      try {
        // Verify token
        const decoded = jwt.verify(
          token, 
          process.env.JWT_SECRET || 'your-secret-key'
        ) as { id: string; email: string; role: string };
        
        // Add user data to request object
        req.user = decoded;
        
        return next();
      } catch (error) {
        throw new AppError('Invalid or expired token', 401);
      }
    } else if (apiKey) {
      // API key authentication
      // In a real implementation, you would verify the API key against your database
      // For now, we'll mock this functionality
      
      // TODO: Replace with actual API key verification from database
      if (apiKey === 'test-api-key') {
        req.apiKey = {
          id: 'api-key-id',
          userId: 'user-id',
          name: 'Test API Key',
          permissions: ['proxy:read', 'proxy:write']
        };
        
        return next();
      }
      
      throw new AppError('Invalid API key', 401);
    } else {
      throw new AppError('Authentication required', 401);
    }
  } catch (error) {
    logger.error(`Auth error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
}; 