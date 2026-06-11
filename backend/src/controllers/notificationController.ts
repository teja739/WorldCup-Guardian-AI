import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';

export let mockNotifications: any[] = [
  {
    _id: '66185a9ee6e76cf0a2b53c70',
    userId: '66185860e6e76cf0a2b53c61',
    title: 'Flight Delayed: AI Recalculating Schedule',
    message: 'Your flight AI-101 from DEL to JFK is delayed by 2 hours. Your citizenM check-in window and MetLife Stadium transit route have been updated automatically.',
    type: 'flight',
    read: false,
    createdAt: new Date()
  },
  {
    _id: '66185aafe6e76cf0a2b53c72',
    userId: '66185860e6e76cf0a2b53c61',
    title: 'Severe Weather Warning at MetLife Stadium',
    message: 'Scattered thunderstorms are forecast for Jersey City tomorrow night. The AI recommends taking the public train instead of rideshares to avoid gridlocks and packing a rain poncho.',
    type: 'weather',
    read: false,
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    _id: '66185abfe6e76cf0a2b53c74',
    userId: '66185860e6e76cf0a2b53c61',
    title: 'Match Reminder: Semi-Finals Tomorrow',
    message: 'Kickoff at 20:00 EST. Gates open at 17:00 EST. Be sure to arrive early for security checks.',
    type: 'match',
    read: true,
    createdAt: new Date(Date.now() - 86400000)
  }
];

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let notifications = [];
    try {
      notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
      if (notifications.length === 0) {
        notifications = mockNotifications.filter(n => n.userId === userId);
      }
    } catch (dbErr) {
      notifications = mockNotifications.filter(n => n.userId === userId);
    }

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { notificationId } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let success = false;
    try {
      if (notificationId) {
        const result = await Notification.updateOne({ _id: notificationId, userId }, { read: true });
        success = result.modifiedCount > 0;
      } else {
        await Notification.updateMany({ userId }, { read: true });
        success = true;
      }
    } catch (dbErr) {
      // In-memory mock
      if (notificationId) {
        const notif = mockNotifications.find(n => n._id === notificationId && n.userId === userId);
        if (notif) {
          notif.read = true;
          success = true;
        }
      } else {
        mockNotifications.forEach(n => {
          if (n.userId === userId) n.read = true;
        });
        success = true;
      }
    }

    return res.status(200).json({ success, message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return res.status(500).json({ message: 'Error updating notifications' });
  }
};

export const addNotification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '66185860e6e76cf0a2b53c61';
    const { title, message, type } = req.body;

    const newNotification = {
      _id: `mock-notif-${Date.now()}`,
      userId,
      title,
      message,
      type: type || 'general',
      read: false,
      createdAt: new Date()
    };

    try {
      await Notification.create({
        userId,
        title,
        message,
        type: type || 'general'
      });
    } catch (dbErr) {
      mockNotifications.unshift(newNotification);
    }

    return res.status(201).json({ success: true, notification: newNotification });
  } catch (error) {
    console.error('Error adding notification:', error);
    return res.status(500).json({ message: 'Error adding notification' });
  }
};
