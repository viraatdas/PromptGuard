import { Router } from 'express';
import { query } from 'express-validator';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/errorHandler';
import { getRequestLogs, getRequestStats } from '../logger/requestLogger';

const router = Router();

/**
 * Get usage statistics for the dashboard
 */
router.get('/stats', [
  query('timeframe').optional().isIn(['day', 'week', 'month']).withMessage('Timeframe must be day, week, or month'),
], async (req: AuthRequest, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }

    // Get timeframe from query parameters (default to 'day')
    const timeframe = (req.query.timeframe as 'day' | 'week' | 'month') || 'day';

    // Get statistics for this user
    const stats = await getRequestStats(timeframe, userId);

    return res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get recent request logs for the dashboard
 */
router.get('/logs', [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'),
], async (req: AuthRequest, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }

    // Get pagination parameters
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    // Get logs for this user
    const logs = await getRequestLogs(userId, limit, offset);

    return res.status(200).json({
      status: 'success',
      data: {
        logs,
        pagination: {
          limit,
          offset,
          total: logs.length // In a real implementation, would return actual total count
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get top redacted terms for the dashboard
 * This is a mock implementation; in a real app, this would query a database
 */
router.get('/redacted-terms', async (req: AuthRequest, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }

    // In a real implementation, this would query a database
    // For now, return mock data
    const redactedTerms = [
      { type: 'EMAIL', count: 45 },
      { type: 'PHONE', count: 23 },
      { type: 'NAME', count: 18 },
      { type: 'SSN', count: 12 },
      { type: 'ADDRESS', count: 8 },
      { type: 'CREDIT_CARD', count: 5 }
    ];

    return res.status(200).json({
      status: 'success',
      data: redactedTerms
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get top blocked reasons for the dashboard
 * This is a mock implementation; in a real app, this would query a database
 */
router.get('/blocked-reasons', async (req: AuthRequest, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User identification required', 403);
    }

    // In a real implementation, this would query a database
    // For now, return mock data
    const blockedReasons = [
      { reason: 'DAN jailbreak attempt', count: 12 },
      { reason: 'Attempt to ignore instructions', count: 8 },
      { reason: 'Potential system prompt injection', count: 5 },
      { reason: 'Ethics bypass attempt', count: 3 },
      { reason: 'Harmful instructions request', count: 2 }
    ];

    return res.status(200).json({
      status: 'success',
      data: blockedReasons
    });
  } catch (error) {
    next(error);
  }
});

export const dashboardRoutes = router;