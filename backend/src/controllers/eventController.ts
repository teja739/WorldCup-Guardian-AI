import { Request, Response } from 'express';
import Event from '../models/Event';

const mockEvents = [
  {
    _id: 'event-fifa-2026',
    title: 'FIFA World Cup 2026',
    sport: 'Soccer',
    year: 2026,
    startDate: new Date('2026-06-11'),
    endDate: new Date('2026-07-19'),
    matches: [],
    venues: [
      {
        name: 'MetLife Stadium',
        city: 'East Rutherford, NJ',
        country: 'USA',
        capacity: 82500,
        lat: 40.8136,
        lng: -74.0744,
        info: 'MetLife Stadium is host to the FIFA World Cup 2026 Final. Transit is via the Meadowlands Rail Line from Secaucus Junction.',
        nearbyRestaurants: ['Katz\'s Delicatessen (NYC)', 'Redd\'s Restaurant & Bar', 'Lupardi\'s Nursery'],
        nearbyHotels: ['citizenM Bowery NYC', 'Hilton Meadowlands', 'Sheraton Meadowlands']
      },
      {
        name: 'SoFi Stadium',
        city: 'Inglewood, CA',
        country: 'USA',
        capacity: 70000,
        lat: 33.9534,
        lng: -118.3392,
        info: 'Ultra-modern stadium with a translucent canopy. Dedicated rideshare lanes and Metro shuttle routes are active during match days.',
        nearbyRestaurants: ['In-N-Out Burger', 'Roscoe\'s Chicken & Waffles', 'Sweet Red Peach'],
        nearbyHotels: ['Luxe City Center', 'Sonder Luma', 'The Westin Los Angeles Airport']
      }
    ]
  },
  {
    _id: 'event-cricket-2027',
    title: 'ICC Cricket World Cup 2027',
    sport: 'Cricket',
    year: 2027,
    startDate: new Date('2027-10-01'),
    endDate: new Date('2027-11-15'),
    matches: [],
    venues: [
      {
        name: 'Wanderers Stadium',
        city: 'Johannesburg',
        country: 'South Africa',
        capacity: 34000,
        lat: -26.1347,
        lng: 28.0518,
        info: 'Known as the Bullring due to its intimidating atmosphere. Easy access via Sandton Gautrain station followed by local shuttles.',
        nearbyRestaurants: ['The Grillhouse Rosebank', 'Marble Restaurant', 'The Local Grill'],
        nearbyHotels: ['Hyatt House Rosebank', 'Radisson Blu Gautrain Hotel', 'The Saxon Villa']
      }
    ]
  }
];

export const getEvents = async (req: Request, res: Response) => {
  try {
    let events = [];
    try {
      events = await Event.find({});
      if (events.length === 0) {
        events = mockEvents;
      }
    } catch (dbErr) {
      events = mockEvents;
    }
    return res.status(200).json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Error fetching events' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    let event = null;
    try {
      event = await Event.findById(eventId);
    } catch (dbErr) {
      event = mockEvents.find(e => e._id === eventId);
    }

    if (!event) {
      event = mockEvents.find(e => e._id === eventId);
    }

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ success: true, event });
  } catch (error) {
    console.error('Error fetching event detail:', error);
    return res.status(500).json({ message: 'Error fetching event' });
  }
};
