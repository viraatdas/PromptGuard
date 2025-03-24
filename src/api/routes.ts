import { Express } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { proxyRoutes } from './proxy';
import { apiKeyRoutes } from './apiKey';
import { userRoutes } from './user';
import { dashboardRoutes } from './dashboard';
import { billingRoutes } from './billing';

/**
 * Setup all API routes for the application
 * @param app Express application instance
 */
export const setupRoutes = (app: Express): void => {
  // Health check endpoint (public)
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });

  // API Version endpoint (public)
  app.get('/version', (req, res) => {
    res.status(200).json({ 
      version: process.env.npm_package_version || '1.0.0',
      name: 'PromptGuard'
    });
  });

  // API endpoints that require authentication
  app.use('/api', authMiddleware);
  
  // Main proxy endpoint route for handling LLM requests
  app.use('/api/proxy', proxyRoutes);
  
  // API key management routes
  app.use('/api/keys', apiKeyRoutes);
  
  // User management routes
  app.use('/api/users', userRoutes);
  
  // Dashboard and analytics routes
  app.use('/api/dashboard', dashboardRoutes);
  
  // Billing and subscription routes
  app.use('/api/billing', billingRoutes);
  
  // Auth routes (register, login)
  app.use('/auth', require('./auth').default);
}; 