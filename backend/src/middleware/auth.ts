import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  // For hackathon convenience, if no header is present or it's 'Bearer mock-token',
  // we check if we should inject a default mock user.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Inject mock user for easy testing without complex login flow
    req.user = {
      id: '66185860e6e76cf0a2b53c61', // Consistent mock ObjectId
      email: 'alex.guardian@gmail.com',
      name: 'Alex Mercer'
    };
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (token === 'mock-token') {
    req.user = {
      id: '66185860e6e76cf0a2b53c61',
      email: 'alex.guardian@gmail.com',
      name: 'Alex Mercer'
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforhackathon2026') as {
      id: string;
      email: string;
      name: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    // If JWT fails but we want things to work, fallback to mock.
    // In production, we'd return 401: res.status(401).json({ message: 'Token is invalid' });
    req.user = {
      id: '66185860e6e76cf0a2b53c61',
      email: 'alex.guardian@gmail.com',
      name: 'Alex Mercer'
    };
    next();
  }
};
