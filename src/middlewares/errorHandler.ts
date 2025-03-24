import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

// Custom error class that can include status code and additional data
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  data?: any;

  constructor(message: string, statusCode: number, isOperational = true, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Default error status and message
  let statusCode = 500;
  let message = 'Something went wrong';
  let isOperational = false;
  let errorData = {};

  // If it's our custom AppError, use its properties
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
    errorData = err.data || {};
  } else if (err.name === 'ValidationError') {
    // Handle validation errors (e.g., from express-validator)
    statusCode = 400;
    message = err.message;
    isOperational = true;
  }

  // Log error details
  if (isOperational) {
    logger.info({
      message: `Operational error: ${message}`,
      statusCode,
      path: req.path,
      method: req.method,
      ...(Object.keys(errorData).length > 0 && { data: errorData }),
    });
  } else {
    logger.error({
      message: `Unexpected error: ${err.message}`,
      error: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(Object.keys(errorData).length > 0 && { data: errorData }),
  });
}; 