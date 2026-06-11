import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import tripRoutes from './routes/trips';
import budgetRoutes from './routes/budget';
import notificationRoutes from './routes/notifications';
import eventRoutes from './routes/events';
import agentRoutes from './routes/agent';
import cricketRoutes from './routes/cricket';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Base Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'WorldCup Guardian Backend' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/cricket', cricketRoutes);

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;
