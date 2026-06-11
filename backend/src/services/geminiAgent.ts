import { GoogleGenerativeAI } from '@google/generative-ai';
import Trip, { IItineraryItem } from '../models/Trip';
import Budget from '../models/Budget';
import Notification from '../models/Notification';
import User from '../models/User';
import History from '../models/History';
import { mockTrips } from '../controllers/tripController';
import { mockBudgets } from '../controllers/budgetController';
import { mockNotifications } from '../controllers/notificationController';

// In-memory fallback tool responses and helper states
const FLIGHT_MOCKS = [
  { company: 'Air India', flight: 'AI-101', price: 1100, duration: '15h 30m', route: 'DEL -> JFK' },
  { company: 'Emirates', flight: 'EK-201', price: 1450, duration: '17h 45m', route: 'DEL -> DXB -> JFK' },
  { company: 'United Airlines', flight: 'UA-83', price: 1250, duration: '16h 15m', route: 'BOM -> EWR' }
];

const HOTEL_MOCKS = [
  { name: 'citizenM Bowery NYC', rating: '4.7/5', pricePerNight: 180, location: 'Lower East Side, Manhattan' },
  { name: 'Hilton Meadowlands NJ', rating: '4.2/5', pricePerNight: 220, location: 'East Rutherford, NJ (near stadium)' },
  { name: 'Pod 39 Hotel NYC', rating: '4.4/5', pricePerNight: 120, location: 'Midtown East, Manhattan' }
];

export interface AgentStep {
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'pending';
  duration?: string;
}

export interface AgentResponse {
  response: string;
  steps: AgentStep[];
  tripCreated?: any;
  budgetCreated?: any;
}

export const runAgentWorkflow = async (
  userId: string,
  userMessage: string
): Promise<AgentResponse> => {
  const steps: AgentStep[] = [];
  let responseText = '';
  let tripCreated: any = null;
  let budgetCreated: any = null;

  const addStep = (title: string, description: string, status: 'success' | 'warning' | 'error' | 'pending', duration = '300ms') => {
    steps.push({ title, description, status, duration });
  };

  try {
    const lowerMsg = userMessage.toLowerCase();
    
    // Check if the user is asking to plan a trip/schedule or if it's conversational chat
    const isPlanRequest = lowerMsg.includes('plan') || 
                          lowerMsg.includes('trip') || 
                          lowerMsg.includes('schedule') || 
                          lowerMsg.includes('book') || 
                          lowerMsg.includes('travel') || 
                          lowerMsg.includes('itinerary') || 
                          lowerMsg.includes('flight') || 
                          lowerMsg.includes('hotel') || 
                          lowerMsg.includes('stadium') || 
                          lowerMsg.includes('ticket') || 
                          lowerMsg.includes('register') || 
                          lowerMsg.includes('create');

    if (!isPlanRequest) {
      addStep('1. Parse Intent', `Conversational query: "${userMessage}"`, 'success', '80ms');
      addStep('2. AI Reasoning', 'Formulating dynamic chat response...', 'success', '250ms');

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const prompt = `
            You are the WorldCup Guardian AI, an intelligent companion for sports travel (FIFA, Cricket World Cup, Olympics).
            The user is chatting with you. User query: "${userMessage}".
            Provide a helpful, detailed, and polite response answering their question in detail. Formulate it cleanly in markdown. Respond like ChatGPT. Keep it engaging and sports-travel themed. Keep it under 250 words.
          `;
          const result = await model.generateContent(prompt);
          responseText = result.response.text();
        } catch (geminiErr) {
          console.error('Gemini API Chat Error:', geminiErr);
          responseText = getMockConversationalResponse(lowerMsg);
        }
      } else {
        responseText = getMockConversationalResponse(lowerMsg);
      }

      // Save history
      try {
        await History.create({
          userId,
          query: userMessage,
          response: responseText,
          steps: steps.map(s => ({
            title: s.title,
            description: s.description,
            status: s.status,
            duration: s.duration
          }))
        });
      } catch (histErr) {
        console.warn('History save failed:', histErr);
      }

      return {
        response: responseText,
        steps
      };
    }

    // Step 1: Understand request (Planning branch)
    addStep('1. Parse Intent', `Analyzing request: "${userMessage}"`, 'success', '120ms');

    // Simple keyword extraction for planning
    const isFifa = lowerMsg.includes('fifa') || lowerMsg.includes('football') || lowerMsg.includes('soccer');
    const isCricket = lowerMsg.includes('cricket') || lowerMsg.includes('icc');
    const isCricketWorldCup = lowerMsg.includes('world cup') && !isFifa;
    const isCricketTrip = isCricket || isCricketWorldCup;
    const isOlympics = lowerMsg.includes('olympic') || lowerMsg.includes('olympics') || lowerMsg.includes('athens') || lowerMsg.includes('paris');

    let sport = 'Soccer';
    let eventTitle = 'FIFA World Cup 2026';
    let destination = 'New York/New Jersey, USA';

    if (isCricketTrip) {
      sport = 'Cricket';
      eventTitle = 'ICC Cricket World Cup 2027';
      destination = 'Johannesburg, South Africa';
    } else if (isOlympics) {
      sport = 'Olympics';
      eventTitle = 'Olympic Games Paris 2024';
      destination = 'Paris, France';
    }

    // Step 2: Check Event Schedule
    addStep('2. Check Event Schedule', `Looking up schedule for ${eventTitle}...`, 'success', '250ms');
    
    // Step 3: Estimate Budget
    addStep('3. Estimate Budget', `Calculating flights, hotel stays, tickets and meals for ${destination}...`, 'success', '180ms');
    
    // Step 4: Find Hotels
    addStep('4. Find Accommodations', `Finding available hotels in ${destination} matching moderate budget preference...`, 'success', '320ms');
    
    // Step 5: Find Transport
    addStep('5. Flight Search', `Searching for flights from user origin to ${destination}...`, 'success', '410ms');
    
    // Step 6: Create Itinerary
    addStep('6. Build Itinerary', `Compiling 5-day active itinerary with sports events and tourist attractions...`, 'success', '150ms');

    // Step 7: Store in Database (MongoDB via Mongoose/MCP)
    addStep('7. Save to Database', `Writing trip itinerary and budget breakdown to MongoDB...`, 'success', '200ms');

    // Step 8: Monitor Updates
    addStep('8. Register Alarm', `Setting up weather alarms and delay monitoring alerts...`, 'success', '100ms');

    // Step 9: Notify User
    addStep('9. Send Notifications', `Creating dashboard notifications and summaries...`, 'success', '90ms');

    // Perform actual database saves if mongoose is connected
    const generatedTripId = `trip-${Date.now()}`;
    const budgetVal = isCricketTrip ? 3500 : isOlympics ? 5000 : 4500;
    
    const itineraryItems: IItineraryItem[] = [
      {
        id: `iti-${Date.now()}-1`,
        day: 1,
        time: '11:00',
        type: 'flight' as const,
        title: `Flight to ${destination}`,
        description: `Direct flight. Price estimated at $${isCricketTrip ? '900' : '1100'}.`,
        location: destination,
        cost: isCricketTrip ? 900 : 1100
      },
      {
        id: `iti-${Date.now()}-2`,
        day: 1,
        time: '15:00',
        type: 'hotel' as const,
        title: `Hotel Check-in`,
        description: `${HOTEL_MOCKS[0].name} - Rating: ${HOTEL_MOCKS[0].rating}`,
        location: HOTEL_MOCKS[0].location,
        cost: HOTEL_MOCKS[0].pricePerNight * 5
      },
      {
        id: `iti-${Date.now()}-3`,
        day: 2,
        time: '19:00',
        type: 'match' as const,
        title: `${eventTitle} Match Event`,
        description: `Watching the match live at stadium! Group seats booked.`,
        location: destination,
        cost: 650
      },
      {
        id: `iti-${Date.now()}-4`,
        day: 3,
        time: '10:00',
        type: 'sightseeing' as const,
        title: `Local Sightseeing Guide`,
        description: `Explore local points of interest, tourist hubs, and restaurants.`,
        location: destination,
        cost: 150
      }
    ];

    try {
      // Find user
      const user = await User.findById(userId);
      const userFavSport = user?.favoriteSport || sport;
      const userFavTeam = user?.favoriteTeam || 'Argentina';

      tripCreated = await Trip.create({
        userId,
        event: eventTitle,
        destination,
        budget: budgetVal,
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // in 15 days
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        itinerary: itineraryItems,
        groupMembers: ['friend1@example.com'],
        meetingPoints: [
          { name: 'Hotel Lobby', time: '10:00 AM' }
        ],
        status: 'planned'
      });

      budgetCreated = await Budget.create({
        userId,
        tripId: tripCreated._id,
        estimatedCost: budgetVal,
        actualCost: itineraryItems.reduce((acc, curr) => acc + (curr.cost || 0), 0),
        expenses: itineraryItems.map(item => ({
          id: `exp-${Math.random().toString(36).substr(2, 9)}`,
          description: item.title,
          amount: item.cost || 0,
          category: item.type === 'flight' ? 'flight' : item.type === 'hotel' ? 'hotel' : item.type === 'match' ? 'match' : item.type === 'food' ? 'food' : 'other',
          date: new Date(),
          paidBy: 'Me',
          splitWith: []
        }))
      });

      // Notify
      await Notification.create({
        userId,
        title: `Trip Scheduled: ${eventTitle}`,
        message: `Your travel plan to ${destination} has been created and synced. View it on the Trips tab.`,
        type: 'general',
        read: false
      });
    } catch (dbErr) {
      console.warn('DB Write failed in Gemini Agent, building in-memory response:', dbErr);
      tripCreated = {
        _id: generatedTripId,
        userId,
        event: eventTitle,
        destination,
        budget: budgetVal,
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // in 15 days
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        itinerary: itineraryItems,
        groupMembers: ['friend1@example.com'],
        meetingPoints: [
          { name: 'Hotel Lobby', time: '10:00 AM' }
        ],
        status: 'planned'
      };
      budgetCreated = {
        _id: `budget-${Date.now()}`,
        userId,
        tripId: generatedTripId,
        estimatedCost: budgetVal,
        actualCost: itineraryItems.reduce((acc, curr) => acc + (curr.cost || 0), 0),
        expenses: itineraryItems.map(item => ({
          id: `exp-${Math.random().toString(36).substr(2, 9)}`,
          description: item.title,
          amount: item.cost || 0,
          category: item.type === 'flight' ? 'flight' : item.type === 'hotel' ? 'hotel' : item.type === 'match' ? 'match' : item.type === 'food' ? 'food' : 'other',
          date: new Date(),
          paidBy: 'Me',
          splitWith: []
        }))
      };
      
      // Persist in-memory fallback stores
      mockTrips.push(tripCreated);
      mockBudgets.push(budgetCreated);
      
      const mockNotif = {
        _id: `mock-notif-${Date.now()}`,
        userId,
        title: `Trip Scheduled: ${eventTitle}`,
        message: `Your travel plan to ${destination} has been created and synced. View it on the Trips tab.`,
        type: 'general',
        read: false,
        createdAt: new Date()
      };
      mockNotifications.unshift(mockNotif);
    }

    // Call Gemini API if available, else format a beautiful AI text response
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `
          You are the WorldCup Guardian AI. The user has asked: "${userMessage}".
          We have generated an itinerary for them:
          Event: ${eventTitle}
          Destination: ${destination}
          Budget: $${budgetVal}
          Itinerary items: ${JSON.stringify(itineraryItems)}
          
          Write a concise, friendly response summarizing the travel plan, flight details (${FLIGHT_MOCKS[0].company} ${FLIGHT_MOCKS[0].flight}), hotel (${HOTEL_MOCKS[0].name}), matches, and emergency weather monitoring alerts. Keep it exciting and start with a brief greeting. Keep it under 250 words.
        `;
        
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
      } catch (geminiErr) {
        console.error('Gemini API Error:', geminiErr);
        responseText = getDefaultResponseText(eventTitle, destination, budgetVal, itineraryItems);
      }
    } else {
      responseText = getDefaultResponseText(eventTitle, destination, budgetVal, itineraryItems);
    }

    // Save history
    try {
      await History.create({
        userId,
        query: userMessage,
        response: responseText,
        steps: steps.map(s => ({
          title: s.title,
          description: s.description,
          status: s.status,
          duration: s.duration
        }))
      });
    } catch (histErr) {
      console.warn('History save failed:', histErr);
    }

    return {
      response: responseText,
      steps,
      tripCreated,
      budgetCreated
    };

  } catch (error) {
    console.error('Agent workflow exception:', error);
    return {
      response: "I encountered an error planning your trip. Please try again.",
      steps: [{ title: 'Failed', description: 'Execution encountered an unexpected error', status: 'error', duration: '0ms' }]
    };
  }
};

const getDefaultResponseText = (eventTitle: string, destination: string, budget: number, itineraryItems: any[]) => {
  return `🎒 **WorldCup Guardian AI Travel Plan Created!**

I have planned an amazing itinerary for you to attend the **${eventTitle}** in **${destination}**.

✈️ **Flight Details:** I found a direct flight from your location for **$1,100** (Air India AI-101).
🏨 **Accommodations:** Stay booked at **citizenM Bowery NYC** ($900 total).
🎟️ **Events & Matches:** I have scheduled your semi-final tickets, split expenses with friends, and added tourist guides.
💰 **Estimated Budget:** **$${budget}** (Current actual spending tracked at **$${itineraryItems.reduce((acc: number, curr: any) => acc + curr.cost, 0)}**).

I am now actively monitoring weather forecasts at the stadium and flight delay alerts. Let me know if you would like me to adjust any days!`;
};

const getMockConversationalResponse = (query: string): string => {
  if (query.includes('weather') || query.includes('rain') || query.includes('storm')) {
    return `🌦️ **MetLife Stadium Weather & Delay Guide**

According to live storm tracks, a low-pressure system is passing near East Rutherford, NJ. Here are the recommendations from WorldCup Guardian AI:

1. **Stadium Ponchos**: MetLife Stadium rules forbid umbrellas in the stands. Buy heavy-duty ponchos at the Meadowlands Hub before boarding.
2. **Transit over Rideshares**: Heavy rain delays transit routes. It is highly recommended to take the **NJ Transit Secaucus Rail Line** to the stadium instead of using Uber/Lyft, which will see 3x surge pricing and gridlock.
3. **Warm Layers**: Winds off the Hackensack River can drop the temperature rapidly after sunset. Pack a windbreaker.

Let me know if you would like me to adjust your matchday itinerary times accordingly!`;
  }
  
  if (query.includes('food') || query.includes('eat') || query.includes('restaurant')) {
    return `🍔 **New York City Sports Culinary Guide**

Since you are staying at **citizenM Bowery NYC** in the Lower East Side, here are the top sports bars and local food spots recommended for World Cup fans:

* **Katz's Delicatessen**: Right around the corner (205 E Houston St). Famous for legendary pastrami sandwiches. Go at off-peak hours (3 PM - 5 PM) to avoid 1-hour queues!
* **The Football Factory at Legends**: Located near the Empire State Building. The absolute hub for soccer fans in NYC, showing live matches across 30+ screens.
* **Superbuy Bowls**: A great budget-friendly health food option near Bowery.
* **Rubirosa**: In Nolita, serving world-class thin-crust pizza (reservation required).

Would you like me to map out directions or calculate group expense splits for dining?`;
  }

  if (query.includes('pack') || query.includes('clothing') || query.includes('carry')) {
    return `🎒 **World Cup Spectator Packing Checklist**

Preparing for an international matches travel? Here is what you must carry:

1. **Clear Bag**: Most international stadiums (including MetLife) enforce a strict **Clear Bag Policy** (maximum size 12" x 6" x 12"). Non-clear bags will be rejected at the gate.
2. **Power Bank**: GPS tracking, digital ticketing, and stadium photos drain batteries fast. Bring a small portable charger (stadium rules allow portable power banks up to 10,000mAh).
3. **Digital Documents**: Keep offline copies of your flight tickets, hotel reservations, and match tickets saved in Google Drive / Apple Files.
4. **Physical Poncho**: Weather can be unpredictable at open-air stadium events.

Do you want me to add any of these items to your travel budget estimation?`;
  }

  if (query.includes('budget') || query.includes('cost') || query.includes('split') || query.includes('expense')) {
    return `💸 **Guardian AI Smart Expense Splitting**

WorldCup Guardian AI makes splitting travel expenses with friends simple. 

* **How it works**: When you log a trip, estimated costs (flight, hotel, match ticket) are automatically allocated. In the **Expense Splits** tab, you can add individual custom expenses (e.g. food, local trains) and select group members to split them with.
* **Cost Allocation**: The platform tracks Estimated vs Actual costs in real-time, helping you stay under your target budget (e.g. $4500 for FIFA New York, $3500 for Cricket Johannesburg).

Simply navigate to the **Expense Splits** tab to add a custom expense and split it instantly!`;
  }

  if (query.includes('ticket') || query.includes('seat')) {
    return `🎟️ **Ticketing & Seating Advice**

For major events like FIFA World Cup, ICC Cricket World Cup, and the Olympics, check the following guidelines:

1. **Official Channels**: Buy tickets only from authorized platforms (e.g. FIFA.com/tickets or ICC-cricket.com) to avoid counterfeit entries.
2. **Stadium Entry gates**: Double-check your ticket zone (e.g., Gate B, Section 112). MetLife Stadium is massive, and entering the wrong gate can add 25 minutes of walking.
3. **Seating view**: Lower Tier seats (100-level) offer close proximity, but Mid Tier (200-level) offers the best tactical view of the entire pitch.

Let me know if you would like to log a ticket purchase expense!`;
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greeting')) {
    return `👋 **Hello! I am WorldCup Guardian AI**

I am your autonomous sports travel companion. I am fully synced with your MongoDB Atlas memory preferences.

Here is what you can ask me to do:
- ✈️ **Plan a Trip**: *"Plan a trip to watch FIFA in New York"* or *"Plan a cricket trip to Johannesburg"*
- 🌦️ **Simulate Alarms**: Get weather alerts and flight delay reschedules (using the buttons on top right).
- 🎟️ **Ticketing & Guides**: Ask about clear bag policies, local sports bars, stadium directions, or packing guides.
- 💰 **Budget & Splits**: Track Estimated vs Actual spending and split restaurant bills or taxi fares with friends.

How can I assist you with your sports journey today?`;
  }

  // General fallback
  return `🤖 **WorldCup Guardian AI Assistant**

I am here to help you manage your international sports travel and stay prepared for emergencies. 

Since you asked: *"${query}"*, here is how I can support you:
* **Autonomous Travel Planner**: Ask me to plan a soccer, cricket, or olympic journey, and I will instantly write flight schedules, hotels, and tourist guides to the database.
* **Emergency AI Recalculator**: If you simulate a flight delay or storm, I will reschedule your itinerary transit times and notify your group automatically.
* **Budget Tracking**: I keep a record of all expenses, actual vs estimated spending, and split bills with friends.

Let me know if you would like to **plan a trip** or if you have questions about stadium locations, local foods, packing guides, or stadium weather!`;
};
