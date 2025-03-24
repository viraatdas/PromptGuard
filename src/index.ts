import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'PromptGuard API is running',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api/proxy/models',
        method: 'GET', 
        description: 'Get available models based on subscription'
      },
      {
        path: '/api/proxy/completion',
        method: 'POST',
        description: 'Send a prompt to an LLM provider'
      },
      {
        path: '/api/billing/plans',
        method: 'GET',
        description: 'Get available subscription plans'
      }
    ]
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PromptGuard server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app; 