import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../logger';

const router = Router();

// Mock user database for demo purposes
// In a real app, this would be a database
const users: Record<string, { id: string; email: string; password: string; role: string }> = {
  'test@example.com': {
    id: '1',
    email: 'test@example.com',
    // hashed password for 'password123'
    password: '$2b$10$1XpzUYu8FuvuaBb3rkQO0.O5dBtJ9FbOsJDgx9JpjUU8jFJK3NKxa',
    role: 'admin'
  }
};

/**
 * User registration endpoint
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ],
  async (req, res, next) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation error', 400, true, { errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user already exists
      if (users[email]) {
        throw new AppError('User already exists', 409);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // In a real app, save user to database
      const userId = Math.random().toString(36).substring(2, 15);
      users[email] = {
        id: userId,
        email,
        password: hashedPassword,
        role: 'user'
      };

      // Create JWT token
      const token = jwt.sign(
        { id: userId, email, role: 'user' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Log successful registration
      logger.info(`User registered: ${email}`);

      // Return token to client
      return res.status(201).json({
        status: 'success',
        data: {
          token,
          user: {
            id: userId,
            email,
            role: 'user'
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * User login endpoint
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res, next) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation error', 400, true, { errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user exists
      const user = users[email];
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Log successful login
      logger.info(`User logged in: ${email}`);

      // Return token to client
      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 