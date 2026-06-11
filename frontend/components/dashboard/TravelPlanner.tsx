'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  MapPin, 
  Calendar, 
  Compass, 
  Clock, 
  Plane, 
  Hotel, 
  PlusCircle,
  Sparkles,
  Train,
  CloudLightning,
  AlertTriangle,
  RefreshCw,
  Info
} from 'lucide-react';
import { api } from '../../lib/api';

interface TravelPlannerProps {
  trips: any[];
  addTrip: (e: React.FormEvent, event: string, destination: string, budget: string) => void;
  deleteTrip: (id: string) => void;
  updateTrip: (id: string, itinerary: any[]) => void;
  loadDashboardData: () => void;
}

export default function TravelPlanner({ 
  trips, 
  addTrip, 
  deleteTrip, 
  updateTrip, 
  loadDashboardData 
}: TravelPlannerProps) {
  const [newTripDest, setNewTripDest] = useState('');
  const [newTripEvent, setNewTripEvent] = useState('FIFA World Cup 2026');
  const [newTripBudget, setNewTripBudget] = useState('3000');
  
  const [matches, setMatches] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [matchPreview, setMatchPreview] = useState<any>(null);

  useEffect(() => {
    // Fetch live/upcoming cricket matches for the planner dropdown
    api.getCricketMatches()
      .then(res => {
        if (res.success) {
          // Only show live and upcoming matches for planning
          setMatches(res.matches.filter((m: any) => m.status === 'live' || m.status === 'upcoming'));
        }
      })
      .catch(err => console.warn('Error loading matches for planner:', err));

    api.getCricketVenues()
      .then(res => {
        if (res.success) {
          setVenues(res.venues);
        }
      })
      .catch(err => console.warn('Error loading venues for planner:', err));
  }, []);

  // Update preview when match selection changes
  useEffect(() => {
    if (!selectedMatchId) {
      setMatchPreview(null);
      return;
    }

    const match = matches.find(m => m.id === selectedMatchId);
    if (!match) return;

    const venue = venues.find((v: any) => v.id === match.venueId);
    if (!venue) return;

    // Pre-populate fields
    setNewTripDest(`${match.city}, ${match.country}`);
    setNewTripEvent(`${match.homeTeam} vs ${match.awayTeam} (${match.format}) Live Match`);

    // Dynamic preview data
    const hotelChoice = venue.nearbyHotels[0];
    const flightCost = match.country === 'Australia' ? 1400 : match.country === 'United Kingdom' ? 1100 : 900;
    const hotelCost = hotelChoice.pricePerNight * 5;
    const estimatedTotal = flightCost + hotelCost + 250 + 400 + 150;

    setMatchPreview({
      match,
      venue,
      hotel: hotelChoice,
      estimatedTotal,
      flight: {
        airline: match.country === 'Australia' ? 'Qantas Airways' : match.country === 'United Kingdom' ? 'British Airways' : 'South African Airways',
        cost: flightCost
      },
      weather: match.country === 'Australia' ? '18°C, Clear' : match.country === 'United Kingdom' ? '16°C, Light Showers' : '21°C, Sunny',
      transit: venue.transport
    });
  }, [selectedMatchId, matches, venues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMatchId) {
      // Use match-based AI Planner
      setIsGenerating(true);
      try {
        const res = await api.generateCricketTravelPlan(selectedMatchId, Number(newTripBudget));
        if (res.success) {
          alert('AI Itinerary, flights, hotel, and Gautrain routes generated successfully!');
          setSelectedMatchId('');
          loadDashboardData();
        } else {
          alert('Failed to generate match-based travel plan.');
        }
      } catch (err) {
        alert('Error generating travel plan.');
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Standard custom creator
      if (!newTripDest) return;
      addTrip(e, newTripEvent, newTripDest, newTripBudget);
      setNewTripDest('');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dynamic Trip Creator Form */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden bg-gradient-to-r from-brand-blue/5 via-transparent to-transparent">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl">✈️</div>
        
        <h3 className="text-md font-bold mb-4 flex items-center gap-2 text-white">
          <PlusCircle className="w-4.5 h-4.5 text-brand-blue" />
          Create New AI Travel Plan
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Match selector (Requirement 5) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plan Travel for Match</label>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="glass-input text-xs w-full py-2.5 bg-slate-950 border border-white/10 text-white"
            >
              <option value="">-- Custom Plan (No Specific Match Selected) --</option>
              {matches.map(m => (
                <option key={m.id} value={m.id}>
                  🏏 [{m.format}] {m.homeTeam} vs {m.awayTeam} &bull; {m.city} ({m.status === 'live' ? 'LIVE NOW' : 'Upcoming'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Destination</label>
              <input 
                type="text" 
                placeholder="e.g. Paris, France" 
                value={newTripDest}
                onChange={(e) => setNewTripDest(e.target.value)}
                className="glass-input text-xs w-full py-2.5" 
                disabled={!!selectedMatchId}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Select Event / Target</label>
              {selectedMatchId ? (
                <input 
                  type="text" 
                  value={newTripEvent}
                  className="glass-input text-xs w-full py-2.5 text-brand-blue font-semibold" 
                  disabled
                />
              ) : (
                <select 
                  value={newTripEvent}
                  onChange={(e) => setNewTripEvent(e.target.value)}
                  className="glass-input text-xs w-full py-2.5"
                >
                  <option value="FIFA World Cup 2026">FIFA World Cup 2026</option>
                  <option value="Olympic Games Paris 2024">Olympic Games Paris 2024</option>
                </select>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Max Budget Limit ($)</label>
              <input 
                type="number" 
                placeholder="Budget Limit" 
                value={newTripBudget}
                onChange={(e) => setNewTripBudget(e.target.value)}
                className="glass-input text-xs w-full py-2.5" 
                required
              />
            </div>
          </div>

          {/* Dynamic Match Telemetry Preview (Requirement 5 & 11) */}
          {matchPreview && (
            <div className="p-4 bg-slate-950/60 border border-brand-blue/20 rounded-2xl space-y-3 animate-fadeIn text-xs">
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Info className="w-4 h-4 text-brand-blue" />
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">Auto-Generated Match Preview Details</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Stadium & Capacity</span>
                  <span className="text-slate-200 block font-semibold">{matchPreview.venue.name}</span>
                  <span className="text-[10px] text-slate-400 block">{matchPreview.venue.capacity.toLocaleString()} seats &bull; {matchPreview.venue.city}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Suggested Flight</span>
                  <span className="text-slate-200 block font-semibold flex items-center gap-1">
                    <Plane className="w-3.5 h-3.5 text-brand-blue" /> {matchPreview.flight.airline}
                  </span>
                  <span className="text-[10px] text-brand-gold block font-mono font-bold">Estimated Cost: ${matchPreview.flight.cost}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Lodging & Transit</span>
                  <span className="text-slate-200 block font-semibold flex items-center gap-1">
                    <Hotel className="w-3.5 h-3.5 text-brand-blue" /> {matchPreview.hotel.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block flex items-center gap-0.5">
                    <Train className="w-3 h-3 text-brand-blue" /> Local Shuttle active
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px]">
                <div className="flex gap-4">
                  <span className="text-slate-400 font-medium">Expected Weather: <strong className="text-white">{matchPreview.weather}</strong></span>
                  <span className="text-slate-400 font-medium">Estimated Trip Cost: <strong className="text-brand-gold">${matchPreview.estimatedTotal}</strong></span>
                </div>
                <span className="text-[9px] text-slate-500 italic">Click build to write travel plan, alerts, and split expenses to MongoDB Atlas</span>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isGenerating}
              className="px-6 py-3 rounded-xl bg-brand-blue text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,212,255,0.15)] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  Generating Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Build Itinerary
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Itinerary List */}
      <div className="space-y-8">
        {trips.length > 0 ? (
          trips.map((trip: any) => (
            <div key={trip._id} className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 relative hover:border-brand-blue/5 transition-all duration-300">
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Trip to {trip.destination}
                    <span className="text-xs bg-brand-blue/15 text-brand-blue px-2.5 py-0.5 rounded border border-brand-blue/30 font-semibold uppercase">
                      {trip.status}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400 block mt-1">
                    Event Target: <strong className="text-slate-200">{trip.event}</strong> &bull; Budget threshold: <strong className="text-brand-gold">${trip.budget}</strong>
                  </span>
                </div>
                <button 
                  onClick={() => deleteTrip(trip._id)}
                  className="p-2 bg-slate-900 border border-white/5 rounded-xl text-slate-400 hover:text-brand-pink hover:border-brand-pink/30 hover:bg-brand-pink/5 transition-all duration-200"
                  title="Delete Travel Plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Itinerary Timeline */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4.5 h-4.5 text-brand-blue" />
                  Day-by-Day Timeline
                </h4>
                
                <div className="relative border-l border-white/10 ml-3.5 space-y-6 py-2">
                  {trip.itinerary && trip.itinerary.map((item: any, idx: number) => {
                    return (
                      <div key={item.id || idx} className="relative pl-6">
                        {/* Dot indicator with category icon */}
                        <div className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-brand-blue border-2 border-slate-950 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                        </div>
                        
                        <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-2 hover:border-brand-blue/10 transition-all duration-250">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-brand-blue font-bold tracking-widest uppercase">DAY {item.day} &bull; {item.time}</span>
                            <span className="text-slate-400 bg-slate-950 border border-white/5 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                              {item.type === 'flight' ? '✈️ Flight' : item.type === 'hotel' ? '🏨 Lodging' : item.type === 'match' ? '🎟️ Match' : '🗺️ Sightseeing'}
                            </span>
                          </div>
                          <span className="font-bold text-sm text-slate-200 block">{item.title}</span>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.description}</p>
                          {item.cost > 0 && (
                            <span className="text-[10px] text-brand-gold font-bold block pt-1">
                              Estimated Cost: ${item.cost}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Meeting zones & travel buddies */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-5 pt-5 border-t border-white/5">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Travel Buddies</span>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-slate-900 border border-white/5 px-3 py-1 rounded-full text-slate-300 font-semibold">Me</span>
                    {trip.groupMembers && trip.groupMembers.map((email: string, mIdx: number) => (
                      <span key={mIdx} className="text-xs bg-slate-900 border border-white/5 px-3 py-1 rounded-full text-slate-300 font-semibold">{email}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Synchronized Meeting Zones</span>
                  <div className="flex gap-4">
                    {trip.meetingPoints && trip.meetingPoints.map((pt: any, ptIdx: number) => (
                      <div key={ptIdx} className="text-xs bg-slate-950 border border-white/5 p-2.5 rounded-lg">
                        <span className="font-bold text-slate-300 block">{pt.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Scheduled: {pt.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center text-slate-500 text-xs italic">
            No travel plans generated yet. Select a match above or prompt the AI Agent in the AI Command Center to auto-generate a full trip!
          </div>
        )}
      </div>

    </div>
  );
}
