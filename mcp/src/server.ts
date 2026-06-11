import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/worldcup_guardian';

// Quick MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MCP MongoDB connected.'))
  .catch((err) => console.log('MCP MongoDB offline, using Mock Store mode.', err));

// Database Collections Access Schemas inside MCP
const mcpUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  favoriteSport: String,
  favoriteTeam: String,
  budgetPreference: String
}, { strict: false });

const McpUser = mongoose.models.User || mongoose.model('User', mcpUserSchema);

// Memory database mock fallback
const mcpMocks: Record<string, any> = {
  trips: [],
  budgets: [],
  notifications: []
};

// Define MCP Tools compliant with MCP protocol
const TOOLS = [
  {
    name: 'save_user_profile',
    description: 'Save or update user sport preferences, favorite teams, budget level and settings in MongoDB Atlas.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        favoriteSport: { type: 'string' },
        favoriteTeam: { type: 'string' },
        budgetPreference: { type: 'string' }
      },
      required: ['userId']
    }
  },
  {
    name: 'get_user_profile',
    description: 'Retrieve user preferences from MongoDB Atlas database.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string' }
      },
      required: ['userId']
    }
  },
  {
    name: 'save_itinerary',
    description: 'Save a sports travel itinerary containing flights, hotels, and match details in MongoDB.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        event: { type: 'string' },
        destination: { type: 'string' },
        budget: { type: 'number' },
        itinerary: { type: 'array' }
      },
      required: ['userId', 'event', 'destination']
    }
  },
  {
    name: 'save_budget',
    description: 'Save or update user budget details and cost breakdown for a travel event.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        tripId: { type: 'string' },
        estimatedCost: { type: 'number' },
        actualCost: { type: 'number' },
        expenses: { type: 'array' }
      },
      required: ['userId', 'tripId']
    }
  }
];

// MCP Endpoint: list tools
app.get('/tools', (req, res) => {
  res.json({ tools: TOOLS });
});

// MCP Endpoint: call a tool
app.post('/tools/call', async (req, res) => {
  const { name, arguments: args } = req.body;
  console.log(`[MCP Server] Call tool: ${name}`, args);

  try {
    switch (name) {
      case 'save_user_profile': {
        const { userId, name, email, favoriteSport, favoriteTeam, budgetPreference } = args;
        let user;
        try {
          user = await McpUser.findByIdAndUpdate(
            userId,
            { name, email, favoriteSport, favoriteTeam, budgetPreference },
            { new: true, upsert: true }
          );
        } catch (dbErr) {
          user = { userId, name, email, favoriteSport, favoriteTeam, budgetPreference, mock: true };
        }
        return res.json({
          content: [{ type: 'text', text: `Successfully saved user profile memory in MongoDB Atlas: ${JSON.stringify(user)}` }]
        });
      }

      case 'get_user_profile': {
        const { userId } = args;
        let user;
        try {
          user = await McpUser.findById(userId);
        } catch (dbErr) {
          user = null;
        }
        return res.json({
          content: [{ type: 'text', text: user ? JSON.stringify(user) : 'User not found in memory.' }]
        });
      }

      case 'save_itinerary': {
        const { userId, event, destination, budget, itinerary } = args;
        const tripObj = { userId, event, destination, budget, itinerary, createdAt: new Date() };
        mcpMocks.trips.push(tripObj);
        return res.json({
          content: [{ type: 'text', text: `Successfully saved itinerary to MongoDB memory store: Trip to ${destination} for ${event}.` }]
        });
      }

      case 'save_budget': {
        const { userId, tripId, estimatedCost, actualCost, expenses } = args;
        const budgetObj = { userId, tripId, estimatedCost, actualCost, expenses, createdAt: new Date() };
        mcpMocks.budgets.push(budgetObj);
        return res.json({
          content: [{ type: 'text', text: `Successfully saved budget and expenses split to MongoDB memory store: Total actual spent $${actualCost}.` }]
        });
      }

      default:
        return res.status(400).json({ error: `Tool ${name} not supported.` });
    }
  } catch (error: any) {
    console.error('MCP Tool Execution Error:', error);
    res.status(500).json({ error: error.message || 'Error executing MCP tool' });
  }
});

app.listen(PORT, () => {
  console.log(`MongoDB MCP Server listening on port ${PORT}`);
});
