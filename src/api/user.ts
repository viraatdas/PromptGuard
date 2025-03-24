import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../logger';

const router = Router();

// Mock user database for demo purposes
// In a real app, this would be stored in a database
interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  name?: string;
  organization?: string;
  createdAt: Date;
}

// Re-using the mock users from auth.ts - in a real app, this would be a database
const users: Record<string, User> = {
  'test@example.com': {
    id: '1',
    email: 'test@example.com',
    // hashed password for 'password123'
    password: '$2b$10$1XpzUYu8FuvuaBb3rkQO0.O5dBtJ9FbOsJDgx9JpjUU8jFJK3NKxa',
    role: 'admin',
    createdAt: new Date()
  }
};

/**
 * Get current user profile
 */
router.get('/me', async (req: AuthRequest, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }

    // Find user by ID
    const user = Object.values(users).find(user => user.id === userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Return user data (without password)
    const { password, ...userData } = user;
    return res.status(200).json({
      status: 'success',
      data: userData
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update current user profile
 */
router.patch('/me', [
  body('name').optional().isString(),
  body('organization').optional().isString(),
  body('email').optional().isEmail(),
  body('currentPassword').optional().isString(),
  body('newPassword').optional().isString().isLength({ min: 8 })
], async (req: AuthRequest, res, next) => {
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

    // Find user by ID
    const userEntry = Object.entries(users).find(([_, user]) => user.id === userId);
    if (!userEntry) {
      throw new AppError('User not found', 404);
    }

    const [userEmail, user] = userEntry;
    const updates: Partial<User> = {};

    // Handle basic field updates
    if (req.body.name) updates.name = req.body.name;
    if (req.body.organization) updates.organization = req.body.organization;

    // Handle email update
    if (req.body.email && req.body.email !== user.email) {
      // Check if email already exists
      if (users[req.body.email]) {
        throw new AppError('Email already in use', 409);
      }
      updates.email = req.body.email;
    }

    // Handle password update
    if (req.body.currentPassword && req.body.newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.newPassword, salt);
    }

    // Apply updates to user
    Object.assign(user, updates);

    // If email changed, update the key in the users object
    if (updates.email && updates.email !== userEmail) {
      users[updates.email] = user;
      delete users[userEmail];
    }

    // Log the update
    logger.info(`User updated: ${user.email}`);

    // Return updated user data (without password)
    const { password, ...userData } = user;
    return res.status(200).json({
      status: 'success',
      data: userData
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete current user
 */
router.delete('/me', async (req: AuthRequest, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }

    // Find user by ID
    const userEntry = Object.entries(users).find(([_, user]) => user.id === userId);
    if (!userEntry) {
      throw new AppError('User not found', 404);
    }

    const [userEmail, user] = userEntry;

    // Delete user
    delete users[userEmail];

    // Log the deletion
    logger.info(`User deleted: ${user.email}`);

    // Return success
    return res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export const userRoutes = router; 