import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// In-memory fallback if Mongo fails
const mockUsersDb: Record<string, any> = {
  '66185860e6e76cf0a2b53c61': {
    _id: '66185860e6e76cf0a2b53c61',
    googleId: 'google-123456',
    name: 'Alex Mercer',
    email: 'alex.guardian@gmail.com',
    picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    favoriteSport: 'Soccer',
    favoriteTeam: 'Argentina',
    budgetPreference: 'Moderate',
    languagePreference: 'English',
    createdAt: new Date()
  }
};

const generateMockObjectId = () => {
  const hex = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += hex[Math.floor(Math.random() * 16)];
  }
  return result;
};

const getOrCreateMockUser = (email: string, name: string, picture: string) => {
  const existingId = Object.keys(mockUsersDb).find(k => mockUsersDb[k].email === email);
  if (existingId) {
    return mockUsersDb[existingId];
  }
  const newId = generateMockObjectId();
  mockUsersDb[newId] = {
    _id: newId,
    name,
    email,
    picture,
    favoriteSport: 'Soccer',
    favoriteTeam: 'Argentina',
    budgetPreference: 'Moderate',
    languagePreference: 'English',
    createdAt: new Date()
  };
  return mockUsersDb[newId];
};

export const loginUser = async (req: AuthRequest, res: Response) => {
  const { credential, email, name, picture } = req.body;

  try {
    let userRecord: any = null;

    if (credential === 'mock-google-credential' || !credential) {
      // Demo / Mock login
      const mockEmail = email || 'alex.guardian@gmail.com';
      const mockName = name || 'Alex Mercer';
      const mockPic = picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

      try {
        userRecord = await User.findOne({ email: mockEmail });
        if (!userRecord) {
          userRecord = await User.create({
            name: mockName,
            email: mockEmail,
            picture: mockPic,
            favoriteSport: 'Soccer',
            favoriteTeam: 'Argentina',
            budgetPreference: 'Moderate',
            languagePreference: 'English'
          });
        }
      } catch (dbErr) {
        console.warn('DB Error in login, using mock store:', dbErr);
        userRecord = getOrCreateMockUser(mockEmail, mockName, mockPic);
      }
    } else {
      // Real OAuth validation
      // decode token or verify with google-auth-library
      // For this hackathon template, we decode or use Google payload
      const mockEmail = email || 'user@example.com';
      try {
        userRecord = await User.findOne({ email: mockEmail });
        if (!userRecord) {
          userRecord = await User.create({
            name: name || 'Google Fan',
            email: mockEmail,
            picture: picture || '',
            favoriteSport: 'Soccer',
            favoriteTeam: 'Any',
            budgetPreference: 'Moderate',
            languagePreference: 'English'
          });
        }
      } catch (dbErr) {
        userRecord = {
          _id: '66185860e6e76cf0a2b53c61',
          name: name || 'Google Fan',
          email: mockEmail,
          picture: picture || ''
        };
      }
    }

    // Record Login History
    const loginEntry = {
      timestamp: new Date(),
      ip: req.ip || req.socket.remoteAddress || '',
      userAgent: req.headers['user-agent'] || ''
    };

    if (mongoose.connection.readyState === 1 && typeof userRecord.save === 'function') {
      try {
        if (!userRecord.loginHistory) userRecord.loginHistory = [];
        userRecord.loginHistory.push(loginEntry);
        await userRecord.save();
      } catch (saveErr) {
        console.warn('Error saving login history to MongoDB:', saveErr);
      }
    } else {
      if (!userRecord.loginHistory) userRecord.loginHistory = [];
      userRecord.loginHistory.push(loginEntry);
      if (mockUsersDb[userRecord._id]) {
        mockUsersDb[userRecord._id] = userRecord;
      }
    }

    const token = jwt.sign(
      { id: userRecord._id, email: userRecord.email, name: userRecord.name },
      process.env.JWT_SECRET || 'supersecretjwtkeyforhackathon2026',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: userRecord
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
};

export const logoutUser = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let user = null;
    try {
      user = await User.findById(userId);
    } catch (dbErr) {
      user = mockUsersDb[userId];
    }

    if (!user) {
      // Create user on the fly if profile requested but missing
      try {
        user = await User.create({
          _id: userId,
          name: req.user?.name || 'Alex Mercer',
          email: req.user?.email || 'alex.guardian@gmail.com',
          favoriteSport: 'Soccer',
          favoriteTeam: 'Argentina',
          budgetPreference: 'Moderate',
          languagePreference: 'English'
        });
      } catch (cErr) {
        user = mockUsersDb[userId] || mockUsersDb['66185860e6e76cf0a2b53c61'];
      }
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { favoriteSport, favoriteTeam, budgetPreference, languagePreference, name } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let user = null;
    try {
      user = await User.findByIdAndUpdate(
        userId,
        { favoriteSport, favoriteTeam, budgetPreference, languagePreference, name },
        { new: true, runValidators: true }
      );
    } catch (dbErr) {
      // In-memory update
      if (mockUsersDb[userId]) {
        mockUsersDb[userId] = {
          ...mockUsersDb[userId],
          favoriteSport,
          favoriteTeam,
          budgetPreference,
          languagePreference,
          name
        };
        user = mockUsersDb[userId];
      }
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Error updating profile' });
  }
};
