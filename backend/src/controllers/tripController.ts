import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Trip from '../models/Trip';
import Budget from '../models/Budget';

// Mock database store in memory
export let mockTrips: any[] = [
  {
    _id: '6618593de6e76cf0a2b53c65',
    userId: '66185860e6e76cf0a2b53c61',
    event: 'FIFA World Cup 2026',
    destination: 'New York/New Jersey, USA',
    budget: 4500,
    startDate: new Date('2026-07-10'),
    endDate: new Date('2026-07-20'),
    status: 'planned',
    itinerary: [
      {
        id: 'iti-1',
        day: 1,
        time: '14:00',
        type: 'flight',
        title: 'Flight from New Delhi (DEL) to New York (JFK)',
        description: 'Air India AI 101 - Economy class. Terminal 4 arrival.',
        location: 'JFK Airport, NY',
        cost: 1100
      },
      {
        id: 'iti-2',
        day: 1,
        time: '17:30',
        type: 'hotel',
        title: 'Check-in at citizenM Bowery Hotel',
        description: 'Reserved for 10 nights. High-speed WiFi, modern designs.',
        location: '189 Bowery, New York',
        cost: 1800
      },
      {
        id: 'iti-3',
        day: 2,
        time: '19:00',
        type: 'match',
        title: 'Attend Semi-Final Match',
        description: 'MetLife Stadium. Seat Section 112, Row 10.',
        location: 'MetLife Stadium, East Rutherford',
        cost: 650
      },
      {
        id: 'iti-4',
        day: 3,
        time: '12:00',
        type: 'food',
        title: 'Lunch at Katz\'s Delicatessen',
        description: 'Famous pastrami sandwich. Try to go during off-peak hours.',
        location: '205 E Houston St, New York',
        cost: 40
      }
    ],
    groupMembers: ['friend1@example.com', 'friend2@example.com'],
    meetingPoints: [
      { name: 'citizenM Bowery Lobby', time: '09:00 AM' },
      { name: 'MetLife Stadium Gate B', time: '05:30 PM' }
    ]
  }
];

export const getTrips = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let trips = [];
    try {
      trips = await Trip.find({ userId });
      if (trips.length === 0) {
        // Return mocks if DB empty or mongoose not connected
        trips = mockTrips.filter(t => t.userId === userId);
      }
    } catch (dbErr) {
      trips = mockTrips.filter(t => t.userId === userId);
    }

    return res.status(200).json({ success: true, trips });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return res.status(500).json({ message: 'Error fetching trips' });
  }
};

export const createTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { event, destination, budget, startDate, endDate, itinerary, groupMembers, meetingPoints } = req.body;

    let newTrip: any = null;
    try {
      newTrip = await Trip.create({
        userId,
        event,
        destination,
        budget,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        itinerary: itinerary || [],
        groupMembers: groupMembers || [],
        meetingPoints: meetingPoints || [],
        status: 'planned'
      });

      // Initialize the budget record for this trip automatically
      await Budget.create({
        userId,
        tripId: newTrip._id,
        estimatedCost: budget,
        actualCost: (itinerary || []).reduce((acc: number, item: any) => acc + (item.cost || 0), 0),
        expenses: (itinerary || []).map((item: any) => ({
          id: `exp-${Math.random().toString(36).substr(2, 9)}`,
          description: item.title,
          amount: item.cost || 0,
          category: item.type === 'flight' ? 'flight' : item.type === 'hotel' ? 'hotel' : item.type === 'match' ? 'match' : item.type === 'food' ? 'food' : 'other',
          date: new Date(),
          paidBy: 'Me',
          splitWith: []
        }))
      });
    } catch (dbErr) {
      console.warn('DB error, writing to mock database:', dbErr);
      newTrip = {
        _id: `mock-trip-${Date.now()}`,
        userId,
        event,
        destination,
        budget,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        itinerary: itinerary || [],
        groupMembers: groupMembers || [],
        meetingPoints: meetingPoints || [],
        status: 'planned'
      };
      mockTrips.push(newTrip);
    }

    return res.status(201).json({ success: true, trip: newTrip });
  } catch (error) {
    console.error('Error creating trip:', error);
    return res.status(500).json({ message: 'Error creating trip' });
  }
};

export const updateTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { tripId, event, destination, budget, startDate, endDate, itinerary, status, groupMembers, meetingPoints } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let updatedTrip: any = null;
    try {
      updatedTrip = await Trip.findOneAndUpdate(
        { _id: tripId, userId },
        { event, destination, budget, startDate, endDate, itinerary, status, groupMembers, meetingPoints },
        { new: true }
      );
    } catch (dbErr) {
      const idx = mockTrips.findIndex(t => t._id === tripId);
      if (idx !== -1) {
        mockTrips[idx] = {
          ...mockTrips[idx],
          event: event !== undefined ? event : mockTrips[idx].event,
          destination: destination !== undefined ? destination : mockTrips[idx].destination,
          budget: budget !== undefined ? budget : mockTrips[idx].budget,
          startDate: startDate !== undefined ? new Date(startDate) : mockTrips[idx].startDate,
          endDate: endDate !== undefined ? new Date(endDate) : mockTrips[idx].endDate,
          itinerary: itinerary !== undefined ? itinerary : mockTrips[idx].itinerary,
          status: status !== undefined ? status : mockTrips[idx].status,
          groupMembers: groupMembers !== undefined ? groupMembers : mockTrips[idx].groupMembers,
          meetingPoints: meetingPoints !== undefined ? meetingPoints : mockTrips[idx].meetingPoints
        };
        updatedTrip = mockTrips[idx];
      }
    }

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json({ success: true, trip: updatedTrip });
  } catch (error) {
    console.error('Error updating trip:', error);
    return res.status(500).json({ message: 'Error updating trip' });
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { tripId } = req.query;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let deleted = false;
    try {
      const res = await Trip.deleteOne({ _id: tripId, userId });
      deleted = res.deletedCount > 0;
      if (deleted) {
        await Budget.deleteOne({ tripId });
      }
    } catch (dbErr) {
      const initialLen = mockTrips.length;
      mockTrips = mockTrips.filter(t => !(t._id === tripId && t.userId === userId));
      deleted = mockTrips.length < initialLen;
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return res.status(500).json({ message: 'Error deleting trip' });
  }
};
