import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Trip from '../models/Trip';
import Budget from '../models/Budget';
import Notification from '../models/Notification';
import { mockTrips } from './tripController';
import { mockBudgets } from './budgetController';

// Time-based Cricket Match score simulator
const SERVER_START_TIME = Date.now();

// Static Venue guide data
export const VENUES = [
  {
    id: 'venue-wanderers',
    name: 'Wanderers Stadium',
    city: 'Johannesburg',
    country: 'South Africa',
    capacity: 34000,
    transport: 'Rosebank Gautrain Station followed by the Wanderers Shuttle (5 mins) or local taxis.',
    nearbyHotels: [
      { name: 'Hyatt House Rosebank', rating: '4.6/5', pricePerNight: 120, location: 'Rosebank' },
      { name: 'Radisson Blu Gautrain Hotel', rating: '4.5/5', pricePerNight: 140, location: 'Sandton' },
      { name: 'The Saxon Hotel & Villas', rating: '4.9/5', pricePerNight: 450, location: 'Sandhurst' }
    ],
    travelTips: 'Wanderers is known as the "Bullring" for its electric atmosphere. Evening games can get chilly in the Highveld, so pack a jacket. Avoid walking outside the immediate precinct alone after dark.'
  },
  {
    id: 'venue-wankhede',
    name: 'Wankhede Stadium',
    city: 'Mumbai',
    country: 'India',
    capacity: 33000,
    transport: 'Churchgate Suburban Railway Station is adjacent (2 mins walk). Local black-and-yellow taxis are also available.',
    nearbyHotels: [
      { name: 'InterContinental Marine Drive', rating: '4.7/5', pricePerNight: 280, location: 'Marine Drive' },
      { name: 'Trident Nariman Point', rating: '4.6/5', pricePerNight: 220, location: 'Nariman Point' },
      { name: 'Taj Mahal Palace', rating: '4.9/5', pricePerNight: 400, location: 'Colaba' }
    ],
    travelTips: 'Take the local suburban rail to Churchgate station to completely bypass the extreme match-day traffic on Marine Drive. Try local snacks like Vada Pav from vendors around the ground.'
  },
  {
    id: 'venue-lords',
    name: 'Lord\'s Cricket Ground',
    city: 'London',
    country: 'United Kingdom',
    capacity: 31100,
    transport: 'St. John\'s Wood Underground Station (Jubilee Line) is a 5-minute walk. Multiple bus routes stop on Wellington Road.',
    nearbyHotels: [
      { name: 'The Landmark London', rating: '4.8/5', pricePerNight: 350, location: 'Marylebone' },
      { name: 'Danubius Hotel Regents Park', rating: '4.2/5', pricePerNight: 180, location: 'St. John\'s Wood' },
      { name: 'Sonder | The Henry', rating: '4.3/5', pricePerNight: 160, location: 'Bayswater' }
    ],
    travelTips: 'The "Home of Cricket" enforces a strict smart-casual dress code if you have access to the Members Pavilion. Take time to tour the MCC Museum to view the historic Ashes Urn.'
  },
  {
    id: 'venue-mcg',
    name: 'Melbourne Cricket Ground (MCG)',
    city: 'Melbourne',
    country: 'Australia',
    capacity: 100024,
    transport: 'Richmond and Jolimont Railway Stations are within 5 mins walk. Trams 70 and 48 stop directly outside the park.',
    nearbyHotels: [
      { name: 'Pullman Melbourne on the Park', rating: '4.5/5', pricePerNight: 210, location: 'East Melbourne' },
      { name: 'Mantra on Jolimont', rating: '4.1/5', pricePerNight: 130, location: 'Jolimont' },
      { name: 'The Langham Melbourne', rating: '4.8/5', pricePerNight: 290, location: 'Southbank' }
    ],
    travelTips: 'Use the Free Tram Zone from Melbourne CBD to reach the MCG gates at zero fare. It is one of the largest stadiums in the world; ensure you enter through the gate printed on your ticket to avoid massive walking loops.'
  },
  {
    id: 'venue-newlands',
    name: 'Newlands Cricket Ground',
    city: 'Cape Town',
    country: 'South Africa',
    capacity: 25000,
    transport: 'Newlands Railway Station is located immediately behind the North Stand (1 min walk). Local minibus taxis service Main Road.',
    nearbyHotels: [
      { name: 'Vineyard Hotel', rating: '4.7/5', pricePerNight: 190, location: 'Newlands' },
      { name: 'Park Inn by Radisson Newlands', rating: '4.1/5', pricePerNight: 95, location: 'Newlands' },
      { name: 'Southern Sun Newlands', rating: '4.3/5', pricePerNight: 110, location: 'Newlands' }
    ],
    travelTips: 'Sit on the grass embankment under the famous oak trees for a traditional, relaxed experience with Table Mountain as a stunning backdrop. Day matches get highly intense sun; sunscreen and hats are essential.'
  }
];

// Seed matches structure
const INITIAL_MATCHES = [
  {
    id: 'match-live-1',
    homeTeam: 'India',
    awayTeam: 'Australia',
    format: 'Test',
    status: 'live',
    venueId: 'venue-mcg',
    venueName: 'Melbourne Cricket Ground',
    city: 'Melbourne',
    country: 'Australia',
    date: new Date(),
    innings: [
      { team: 'Australia', score: 312, wickets: 10, overs: 94.2, declared: false },
      { team: 'India', score: 280, wickets: 10, overs: 82.5, declared: false },
      { team: 'Australia', score: 215, wickets: 10, overs: 70.4, declared: false }
    ],
    currentInningsIndex: 3, // India chasing in 4th innings
    liveDetails: {
      batsmen: [
        { name: 'Virat Kohli', runs: 74, balls: 112, fours: 8, sixes: 1 },
        { name: 'Rishabh Pant', runs: 38, balls: 45, fours: 4, sixes: 2 }
      ],
      bowlers: [
        { name: 'Pat Cummins', overs: 16.2, maidens: 3, wickets: 2, runs: 54 },
        { name: 'Nathan Lyon', overs: 22.0, maidens: 4, wickets: 1, runs: 68 }
      ],
      requiredRuns: 118,
      wicketsRemaining: 6,
      target: 248,
      commentary: 'A tense final session on Day 4. Kohli holds the key as Australia hunts for wickets.'
    }
  },
  {
    id: 'match-live-2',
    homeTeam: 'England',
    awayTeam: 'West Indies',
    format: 'T20I',
    status: 'live',
    venueId: 'venue-lords',
    venueName: 'Lord\'s Cricket Ground',
    city: 'London',
    country: 'United Kingdom',
    date: new Date(),
    innings: [
      { team: 'West Indies', score: 180, wickets: 8, overs: 20.0, declared: false }
    ],
    currentInningsIndex: 1,
    liveDetails: {
      batsmen: [
        { name: 'Jos Buttler', runs: 58, balls: 32, fours: 6, sixes: 3 },
        { name: 'Liam Livingstone', runs: 24, balls: 11, fours: 1, sixes: 2 }
      ],
      bowlers: [
        { name: 'Alzarri Joseph', overs: 3.4, maidens: 0, wickets: 2, runs: 38 },
        { name: 'Akeal Hosein', overs: 4.0, maidens: 0, wickets: 1, runs: 28 }
      ],
      requiredRuns: 12,
      ballsRemaining: 8,
      target: 181,
      commentary: 'Livingstone launches it over long-on! Lord\'s goes wild. England closing in on victory.'
    }
  },
  {
    id: 'match-up-1',
    homeTeam: 'South Africa',
    awayTeam: 'India',
    format: 'ODI',
    status: 'upcoming',
    venueId: 'venue-wanderers',
    venueName: 'Wanderers Stadium',
    city: 'Johannesburg',
    country: 'South Africa',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // in 2 days
  },
  {
    id: 'match-up-2',
    homeTeam: 'South Africa',
    awayTeam: 'Australia',
    format: 'T20I',
    status: 'upcoming',
    venueId: 'venue-newlands',
    venueName: 'Newlands Cricket Ground',
    city: 'Cape Town',
    country: 'South Africa',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // in 5 days
  },
  {
    id: 'match-comp-1',
    homeTeam: 'India',
    awayTeam: 'England',
    format: 'ODI',
    status: 'completed',
    venueId: 'venue-wankhede',
    venueName: 'Wankhede Stadium',
    city: 'Mumbai',
    country: 'India',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    innings: [
      { team: 'England', score: 254, wickets: 10, overs: 48.2, declared: false },
      { team: 'India', score: 258, wickets: 4, overs: 44.5, declared: false }
    ],
    result: 'India won by 6 wickets (India 258/4 in 44.5 ov vs England 254/10 in 48.2 ov)'
  }
];

// Helper to simulate incrementing live match scores
const getSimulatedMatches = () => {
  const elapsedSec = Math.floor((Date.now() - SERVER_START_TIME) / 1000);
  
  // Clone initial matches
  return INITIAL_MATCHES.map(match => {
    if (match.status !== 'live') return match;

    const cloned = JSON.parse(JSON.stringify(match));
    
    if (cloned.id === 'match-live-1') {
      // Test Match score progress
      // Approx 1 run every 12 seconds, wicket probability 1% per 10 seconds
      const runsScored = Math.floor(elapsedSec / 12);
      const wicketsFallen = Math.floor(elapsedSec / 180) % 4; // cap at 3 wickets lost
      
      const currentScore = 130 + runsScored;
      const currentWickets = 4 + wicketsFallen;
      
      cloned.innings.push({
        team: 'India',
        score: currentScore,
        wickets: currentWickets,
        overs: parseFloat((42 + Math.floor(runsScored / 4) + (runsScored % 4) / 10).toFixed(1)),
        declared: false
      });
      
      if (cloned.liveDetails) {
        cloned.liveDetails.requiredRuns = Math.max(0, cloned.liveDetails.target - currentScore);
        cloned.liveDetails.wicketsRemaining = Math.max(0, 10 - currentWickets);
        cloned.liveDetails.batsmen[0].runs = 74 + Math.floor(runsScored * 0.6);
        cloned.liveDetails.batsmen[1].runs = 38 + Math.floor(runsScored * 0.3);
        
        if (cloned.liveDetails.requiredRuns === 0) {
          cloned.status = 'completed';
          cloned.result = 'India won by ' + cloned.liveDetails.wicketsRemaining + ' wickets';
        }
      }
    } else if (cloned.id === 'match-live-2') {
      // T20 Match score progress
      // 2 runs every 5 seconds, wickets lost every 60 seconds
      const runsScored = Math.floor(elapsedSec / 4);
      const wicketsFallen = Math.floor(elapsedSec / 60) % 2;
      
      const currentScore = 169 + runsScored;
      const currentWickets = 5 + wicketsFallen;
      
      cloned.innings.push({
        team: 'England',
        score: currentScore,
        wickets: currentWickets,
        overs: parseFloat((18 + Math.floor(runsScored / 6) + (runsScored % 6) / 10).toFixed(1)),
        declared: false
      });
      
      if (cloned.liveDetails) {
        cloned.liveDetails.requiredRuns = Math.max(0, cloned.liveDetails.target - currentScore);
        cloned.liveDetails.ballsRemaining = Math.max(0, 12 - runsScored);
        cloned.liveDetails.batsmen[0].runs = 58 + Math.floor(runsScored * 0.5);
        cloned.liveDetails.batsmen[1].runs = 24 + Math.floor(runsScored * 0.4);
        
        if (cloned.liveDetails.requiredRuns === 0) {
          cloned.status = 'completed';
          cloned.result = 'England won by ' + (10 - currentWickets) + ' wickets';
        } else if (cloned.liveDetails.ballsRemaining === 0) {
          cloned.status = 'completed';
          cloned.result = 'West Indies won by ' + (cloned.liveDetails.requiredRuns - 1) + ' runs';
        }
      }
    }
    
    return cloned;
  });
};

// GET live, upcoming, and completed matches
export const getCricketMatches = async (req: AuthRequest, res: Response) => {
  try {
    const matches = getSimulatedMatches();
    return res.status(200).json({ success: true, matches });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching matches' });
  }
};

// GET stadium venues list
export const getCricketVenues = async (req: AuthRequest, res: Response) => {
  try {
    return res.status(200).json({ success: true, venues: VENUES });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching venues' });
  }
};

// GET alerts based on stadium
export const getCricketAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const { venueId } = req.query;
    
    const allAlerts = [
      {
        id: 'cric-alert-1',
        venueId: 'venue-mcg',
        title: 'Stadium Tram Route Delay',
        message: 'Severe congestion reported on Tram Route 70 heading towards Richmond. Commuters are advised to walk through Fitzroy Gardens or use the Jolimont train route.',
        type: 'traffic',
        severity: 'warning',
        timestamp: new Date()
      },
      {
        id: 'cric-alert-2',
        venueId: 'venue-mcg',
        title: 'Showers Forecast at MCG',
        message: 'Light showers predicted at 18:30 local time. Wind speeds are increasing off Port Phillip Bay. Bring rain gear as umbrellas are prohibited inside the stands.',
        type: 'weather',
        severity: 'info',
        timestamp: new Date()
      },
      {
        id: 'cric-alert-3',
        venueId: 'venue-wanderers',
        title: 'Gautrain Shuttle Scheduling Update',
        message: 'Gautrain Rosebank shuttle bus services will run every 5 minutes instead of 15 minutes starting from 2 hours prior to match kickoff.',
        type: 'transit',
        severity: 'success',
        timestamp: new Date()
      },
      {
        id: 'cric-alert-4',
        venueId: 'venue-wanderers',
        title: 'OR Tambo International Airport Flight Warning',
        message: 'High-velocity winds have delayed incoming flights from London (LHR) and Doha (DOH). WorldCup Guardian AI recommends checking live flight logs.',
        type: 'flight',
        severity: 'danger',
        timestamp: new Date()
      },
      {
        id: 'cric-alert-5',
        venueId: 'venue-wankhede',
        title: 'Marine Drive Road Closure',
        message: 'Mumbai traffic police have closed Netaji Subhash Chandra Bose Road (Marine Drive) from 15:00 to 23:00 to ensure crowd safety around Gate 1 and 2.',
        type: 'traffic',
        severity: 'danger',
        timestamp: new Date()
      },
      {
        id: 'cric-alert-6',
        venueId: 'venue-lords',
        title: 'London Underground Congestion Warning',
        message: 'St. John\'s Wood station (Jubilee Line) is extremely busy. Passengers returning towards Central London should consider walking to Maida Vale (Bakerloo Line).',
        type: 'traffic',
        severity: 'warning',
        timestamp: new Date()
      }
    ];

    const filtered = venueId 
      ? allAlerts.filter(a => a.venueId === venueId) 
      : allAlerts;

    return res.status(200).json({ success: true, alerts: filtered });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching alerts' });
  }
};

// POST generate dynamic travel plan for selected match
export const generateCricketTravelPlan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { matchId, budgetLimit } = req.body;
    const matches = getSimulatedMatches();
    const match = matches.find(m => m.id === matchId);

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const venue = VENUES.find(v => v.id === match.venueId);
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue details not found' });
    }

    // Budget determination (Luxury, Moderate, Economy)
    const baseBudget = budgetLimit ? Number(budgetLimit) : 3000;
    
    // Choose hotels and flights based on venue city
    const hotelChoice = venue.nearbyHotels[0];
    const flightCost = match.country === 'Australia' ? 1400 : match.country === 'United Kingdom' ? 1100 : 900;
    const hotelCost = hotelChoice.pricePerNight * 5; // 5 days stay
    const ticketCost = 250;
    const mealsCost = 400;
    const transitCost = 150;
    const actualCostTotal = flightCost + hotelCost + ticketCost + mealsCost + transitCost;

    const airline = match.country === 'Australia' ? 'Qantas Airways' : match.country === 'United Kingdom' ? 'British Airways' : 'South African Airways';
    const flightNum = match.country === 'Australia' ? 'QF-10' : match.country === 'United Kingdom' ? 'BA-226' : 'SA-322';

    // Build dynamic itinerary items
    const itineraryItems = [
      {
        id: `iti-cric-${Date.now()}-1`,
        day: 1,
        time: '08:45',
        type: 'flight' as const,
        title: `Flight to ${venue.city} (${flightNum})`,
        description: `Boarding ${airline} Flight ${flightNum}. Transit from Origin to ${venue.city} International Airport. Seat 22C.`,
        location: `${venue.city} Airport`,
        cost: flightCost
      },
      {
        id: `iti-cric-${Date.now()}-2`,
        day: 1,
        time: '15:30',
        type: 'hotel' as const,
        title: `Lodging Check-in: ${hotelChoice.name}`,
        description: `5-night booking confirmed. Rating: ${hotelChoice.rating}. Location: ${hotelChoice.location}. ${venue.name} is reachable via local transit.`,
        location: hotelChoice.location,
        cost: hotelCost
      },
      {
        id: `iti-cric-${Date.now()}-3`,
        day: 2,
        time: '09:00',
        type: 'match' as const,
        title: `${match.homeTeam} vs ${match.awayTeam} (${match.format})`,
        description: `Match day! Watch the action live at ${venue.name}. Gate Entry opens at 07:30. Bring rain poncho just in case.`,
        location: venue.name,
        cost: ticketCost
      },
      {
        id: `iti-cric-${Date.now()}-4`,
        day: 3,
        time: '10:00',
        type: 'sightseeing' as const,
        title: `Explore ${venue.city} City & Landmarks`,
        description: `Explore local points of interest. Dining recommended at local hotspots.`,
        location: venue.city,
        cost: mealsCost
      },
      {
        id: `iti-cric-${Date.now()}-5`,
        day: 4,
        time: '11:00',
        type: 'other' as const,
        title: `Local Transit & Metro Guide Routing`,
        description: `Utilize local connections: ${venue.transport}. Quick card top-up included in budget.`,
        location: venue.city,
        cost: transitCost
      }
    ];

    const tripObj = {
      _id: `trip-cric-${Date.now()}`,
      userId,
      event: `${match.homeTeam} vs ${match.awayTeam} ${match.format} Live Match`,
      destination: `${venue.city}, ${venue.country}`,
      budget: baseBudget,
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      status: 'planned' as const,
      itinerary: itineraryItems,
      groupMembers: ['cricketfan@example.com'],
      meetingPoints: [
        { name: `${venue.name} Main Gate`, time: '08:00 AM' }
      ]
    };

    // Save to Database / Mocks
    try {
      const dbTrip = await Trip.create({
        ...tripObj,
        _id: undefined // let mongoose generate ObjectId
      });
      
      await Budget.create({
        userId,
        tripId: dbTrip._id,
        estimatedCost: baseBudget,
        actualCost: actualCostTotal,
        expenses: itineraryItems.map(item => ({
          id: `exp-${Math.random().toString(36).substr(2, 9)}`,
          description: item.title,
          amount: item.cost,
          category: item.type === 'flight' ? 'flight' : item.type === 'hotel' ? 'hotel' : item.type === 'match' ? 'match' : item.type === 'sightseeing' ? 'food' : 'other',
          date: new Date(),
          paidBy: 'Me',
          splitWith: []
        }))
      });

      await Notification.create({
        userId,
        title: `Travel Plan Confirmed: ${match.homeTeam} vs ${match.awayTeam}`,
        message: `Guardian AI compiled flight ${flightNum}, hotel check-in at ${hotelChoice.name}, and route planning to ${venue.name} successfully.`,
        type: 'general',
        read: false
      });

      return res.status(201).json({ success: true, trip: dbTrip });
    } catch (dbErr) {
      console.warn('DB write failed in Cricket Travel Plan generator, saving in-memory:', dbErr);
      mockTrips.push(tripObj);
      
      const budgetObj = {
        _id: `budget-cric-${Date.now()}`,
        userId,
        tripId: tripObj._id,
        estimatedCost: baseBudget,
        actualCost: actualCostTotal,
        expenses: itineraryItems.map(item => ({
          id: `exp-${Math.random().toString(36).substr(2, 9)}`,
          description: item.title,
          amount: item.cost,
          category: item.type === 'flight' ? 'flight' : item.type === 'hotel' ? 'hotel' : item.type === 'match' ? 'match' : item.type === 'sightseeing' ? 'food' : 'other',
          date: new Date(),
          paidBy: 'Me',
          splitWith: []
        }))
      };
      mockBudgets.push(budgetObj);

      return res.status(201).json({ success: true, trip: tripObj });
    }
  } catch (error: any) {
    console.error('Error in cricket travel plan generator:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error generating plan' });
  }
};
