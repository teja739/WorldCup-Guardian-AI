import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { runAgentWorkflow } from '../services/geminiAgent';
import History from '../models/History';

export const agentChat = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const agentResult = await runAgentWorkflow(userId, message);

    return res.status(200).json({
      success: true,
      ...agentResult
    });
  } catch (error) {
    console.error('Agent chat error:', error);
    return res.status(500).json({ message: 'Error processing agent chat request' });
  }
};

export const getAgentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let history: any[] = [];
    try {
      history = await History.find({ userId }).sort({ createdAt: -1 });
    } catch (dbErr) {
      // Return empty if db fails
    }

    return res.status(200).json({ success: true, history });
  } catch (error) {
    console.error('Error fetching agent history:', error);
    return res.status(500).json({ message: 'Error fetching history' });
  }
};
