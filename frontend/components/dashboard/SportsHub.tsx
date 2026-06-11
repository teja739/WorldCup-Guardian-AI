'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  MapPin, 
  Users, 
  Volume2, 
  Bell, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CloudLightning, 
  Train, 
  Compass, 
  ShieldAlert, 
  Hotel, 
  Plane,
  Play,
  CheckCircle,
  RefreshCw,
  Ticket,
  ChevronRight,
  Clock,
  Shield,
  Activity,
  PlusCircle,
  TrendingDown,
  Info,
  Map as MapIcon
} from 'lucide-react';
import { api } from '../../lib/api';

interface SportsHubProps {
  subTab: string; // 'icc' | 'fifa' | 'cricket' | 'live' | 'upcoming' | 'stadium' | 'tickets'
  setActiveTab: (tab: string) => void;
  loadDashboardData: () => void;
}

export default function SportsHub({ subTab, setActiveTab, loadDashboardData }: SportsHubProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Travel Planner Trigger States
  const [planningMatchId, setPlanningMatchId] = useState<string | null>(null);
  const [budgetLimit, setBudgetLimit] = useState<string>('3000');
  const [isPlanning, setIsPlanning] = useState(false);

  // Cricket format filter
  const [cricketFormatFilter, setCricketFormatFilter] = useState<string>('all');

  // Interactive Stadium Map States
  const [selectedStadium, setSelectedStadium] = useState<'metlife' | 'wanderers' | 'stade_de_france'>('metlife');
  const [selectedGate, setSelectedGate] = useState<string>('Gate A');
  const [selectedSection, setSelectedSection] = useState<string>('Lower Tier');

  // Ticket Watchlist States
  const [watchlist, setWatchlist] = useState([
    {
      id: 1,
      match: "FIFA World Cup Final",
      event: "FIFA World Cup 2026",
      currentPrice: 850,
      previousPrice: 920,
      threshold: 800,
      sparkline: "M 0 50 Q 20 20 40 40 T 80 10 T 120 45 T 160 5",
      trend: "down",
      availability: "12% Seats Left",
      isLive: true
    },
    {
      id: 2,
      match: "India vs Australia T20",
      event: "ICC World Cup 2027",
      currentPrice: 350,
      previousPrice: 320,
      threshold: 300,
      sparkline: "M 0 40 Q 20 50 40 30 T 80 45 T 120 15 T 160 25",
      trend: "up",
      availability: "45% Seats Left",
      isLive: false
    },
    {
      id: 3,
      match: "Athletics Men's 100m Final",
      event: "Paris Olympics 2024",
      currentPrice: 420,
      previousPrice: 480,
      threshold: 450,
      sparkline: "M 0 60 Q 20 40 40 50 T 80 30 T 120 20 T 160 5",
      trend: "down",
      availability: "8% Seats Left",
      isLive: true
    }
  ]);

  const [newMatch, setNewMatch] = useState('FIFA Semi-Final');
  const [newThreshold, setNewThreshold] = useState('500');
  const [newPrice, setNewPrice] = useState('620');

  // Fetch initial data
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchLiveMatchesOnly();
    }, 5000);
    return () => clearInterval(interval);
  }, [subTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const matchRes = await api.getCricketMatches();
      if (matchRes.success) setMatches(matchRes.matches);

      const venueRes = await api.getCricketVenues();
      if (venueRes.success) setVenues(venueRes.venues);

      const alertRes = await api.getCricketAlerts();
      if (alertRes.success) setAlerts(alertRes.alerts);

      const eventRes = await api.getEvents();
      if (eventRes.success) setEvents(eventRes.events);
    } catch (err) {
      console.error('Error fetching sports data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveMatchesOnly = async () => {
    try {
      const matchRes = await api.getCricketMatches();
      if (matchRes.success) setMatches(matchRes.matches);
    } catch (err) {
      console.warn('Silent live scores refresh failed:', err);
    }
  };

  const handlePlanTravel = async (matchId: string) => {
    setIsPlanning(true);
    try {
      const res = await api.generateCricketTravelPlan(matchId, Number(budgetLimit));
      if (res.success) {
        alert('AI Travel Plan & Expenses split generated successfully!');
        loadDashboardData();
        setActiveTab('trips'); // Go to travel planner to view it
      } else {
        alert('Failed to generate plan.');
      }
    } catch (err) {
      alert('Error building travel itinerary.');
    } finally {
      setIsPlanning(false);
      setPlanningMatchId(null);
    }
  };

  const handleSetThreshold = (id: number, val: number) => {
    setWatchlist(watchlist.map(item => {
      if (item.id === id) {
        return { ...item, threshold: val };
      }
      return item;
    }));
  };

  const handleAddWatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch) return;
    const newItem = {
      id: Date.now(),
      match: newMatch,
      event: "FIFA World Cup 2026",
      currentPrice: Number(newPrice),
      previousPrice: Number(newPrice) + 40,
      threshold: Number(newThreshold),
      sparkline: "M 0 30 Q 20 40 40 20 T 80 35 T 120 10 T 160 15",
      trend: "down" as const,
      availability: "30% Seats Left",
      isLive: false
    };
    setWatchlist([...watchlist, newItem]);
    setNewMatch('FIFA Semi-Final');
    setNewThreshold('500');
  };

  // Find corresponding events
  const soccerEvent = events.find(e => e.sport === 'Soccer');
  const cricketEvent = events.find(e => e.sport === 'Cricket');

  // Filter matches based on statuses
  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  const completedMatches = matches.filter(m => m.status === 'completed');

  // Filtered Cricket Matches for Cricket Hub
  const filteredCricketMatches = matches.filter(m => {
    if (cricketFormatFilter === 'all') return true;
    return m.format.toLowerCase() === cricketFormatFilter.toLowerCase();
  });

  // Interactive Seating blueprint stadiums config
  const interactiveStadiums = {
    metlife: {
      name: "MetLife Stadium ⚽",
      city: "East Rutherford, NJ, USA",
      capacity: 82500,
      sport: "FIFA World Cup 2026 Venue",
      gates: [
        { name: "Gate A (Verizon)", waitTime: "5 mins", status: "Clear" },
        { name: "Gate B (Pepsi)", waitTime: "25 mins", status: "Congested" },
        { name: "Gate C (Bud Light)", waitTime: "12 mins", status: "Moderate" },
        { name: "Gate D (MetLife)", waitTime: "8 mins", status: "Clear" }
      ],
      sections: [
        { name: "VIP Suites", rating: "4.9/5", view: "Excellent tactical pitch height, premium dining.", priceRange: "$2,500 - $8,000" },
        { name: "Lower Tier (100)", rating: "4.7/5", view: "Extremely close to pitch side, high energy.", priceRange: "$800 - $1,500" },
        { name: "Mid Tier (200)", rating: "4.8/5", view: "Best balance of overview and action proximity.", priceRange: "$600 - $1,200" },
        { name: "Upper Tier (300)", rating: "4.1/5", view: "Steep angles, cost-effective but windy.", priceRange: "$250 - $550" }
      ],
      parking: [
        { name: "Lot Gold (West)", occupancy: "92%", status: "Nearly Full" },
        { name: "Lot Silver (South)", occupancy: "64%", status: "Filling" },
        { name: "Lot Green (North)", occupancy: "15%", status: "Plenty Space" }
      ],
      transit: "NJ Transit Secaucus shuttle running every 8 mins."
    },
    wanderers: {
      name: "The Wanderers Stadium 🏏",
      city: "Johannesburg, South Africa",
      capacity: 34000,
      sport: "ICC Cricket World Cup 2027 Venue",
      gates: [
        { name: "Main Gate (Corlett)", waitTime: "4 mins", status: "Clear" },
        { name: "East Gate (Golf Club)", waitTime: "15 mins", status: "Moderate" },
        { name: "West Gate (Premium)", waitTime: "6 mins", status: "Clear" }
      ],
      sections: [
        { name: "Presidential Pavilion", rating: "4.9/5", view: "Behind bowler arm, fine dining dining.", priceRange: "R4,000 - R12,000" },
        { name: "Memorial Stand", rating: "4.5/5", view: "Excellent side-on view of batting creases.", priceRange: "R900 - R2,200" },
        { name: "The Grass Embankment", rating: "4.8/5", view: "High fan energy, picnic layout, sunny.", priceRange: "R300 - R650" },
        { name: "Unity Stand", rating: "4.2/5", view: "Upper tier view, clear sighting of wicket wickets.", priceRange: "R500 - R1,100" }
      ],
      parking: [
        { name: "Main Club Parking", occupancy: "98%", status: "Full" },
        { name: "Kent Park Lot", occupancy: "70%", status: "Filling" },
        { name: "Wanderers Field", occupancy: "35%", status: "Open" }
      ],
      transit: "Rosebank Gautrain Station shuttle departs every 10 mins."
    },
    stade_de_france: {
      name: "Stade de France 🥇",
      city: "Paris, France",
      capacity: 80000,
      sport: "Olympic Games Paris 2024 Venue",
      gates: [
        { name: "Porte A (North)", waitTime: "18 mins", status: "Moderate" },
        { name: "Porte H (East)", waitTime: "30 mins", status: "Congested" },
        { name: "Porte N (South)", waitTime: "9 mins", status: "Clear" },
        { name: "Porte R (West)", waitTime: "5 mins", status: "Clear" }
      ],
      sections: [
        { name: "Official Club Loge", rating: "4.9/5", view: "Perfect halfway line elevation, hospitality.", priceRange: "€1,200 - €4,500" },
        { name: "Tribune Basse (Cat 1)", rating: "4.6/5", view: "Close proximity to running tracks, high energy.", priceRange: "€450 - €900" },
        { name: "Tribune Intermédiaire", rating: "4.7/5", view: "Clear sightlines of both athletics field and goals.", priceRange: "€300 - €650" },
        { name: "Tribune Haute (Cat 3)", rating: "4.0/5", view: "High altitude overview of entire stadium grid.", priceRange: "€85 - €220" }
      ],
      parking: [
        { name: "P1 Parking (RER B)", occupancy: "96%", status: "Full" },
        { name: "P2 Parking (RER D)", occupancy: "85%", status: "Congested" },
        { name: "P3 Parking (North)", occupancy: "40%", status: "Open" }
      ],
      transit: "Metro Line 13 and RER B/D trains running at 3-minute intervals."
    }
  };

  const currentStadium = interactiveStadiums[selectedStadium];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Loading state */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-10 h-10 text-brand-blue animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Syncing with Sports API feed...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* ============================================================== */}
          {/* 1. ICC Cricket World Cup 2027 ('icc') */}
          {/* ============================================================== */}
          {subTab === 'icc' && (
            <div className="space-y-8 text-left">
              {/* Coming Soon Glass Header Card */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent text-center space-y-5 max-w-2xl mx-auto py-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-bold">🏏</div>
                <div className="w-14 h-14 rounded-full bg-brand-gold/10 border border-brand-gold/30 mx-auto flex items-center justify-center animate-pulse">
                  <Trophy className="w-7 h-7 text-brand-gold" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white font-display">ICC Cricket World Cup 2027</h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/20 text-[10px] font-mono font-bold uppercase">
                    Status: Coming Soon
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-lg mx-auto">
                  The flagship tournament returns to Africa! Jointly hosted across <strong>South Africa, Zimbabwe, and Namibia</strong>, featuring 14 of the world's best international cricket nations.
                </p>

                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-slate-400 max-w-md mx-auto font-mono">
                  🚨 Official fixtures will be displayed once announced by the ICC.
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  Guardian AI stands ready to automatically plot flight paths, emergency alerts, and Gautrain connection shuttles as soon as schedules are live.
                </div>
              </div>

              {/* Grid: Qualification Tracker & Tour Guide */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Qualification Tracker */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 bg-slate-900/10">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-brand-gold" /> Qualification Tracker
                  </h4>
                  <p className="text-xs text-slate-400">
                    The 2027 tournament features 14 teams. Check out the current qualification status:
                  </p>
                  
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs p-2.5 bg-slate-950/40 border border-white/5 rounded-xl">
                      <div>
                        <span className="font-bold text-slate-200">South Africa, Zimbabwe, Namibia</span>
                        <span className="block text-[10px] text-slate-500">Co-hosts</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold font-mono">Qualified</span>
                    </div>

                    <div className="flex justify-between items-center text-xs p-2.5 bg-slate-950/40 border border-white/5 rounded-xl">
                      <div>
                        <span className="font-bold text-slate-200">Top 8 ODI Teams</span>
                        <span className="block text-[10px] text-slate-500">Based on ICC ODI rankings mid-2027</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-[9px] font-bold font-mono">Rankings Cutoff</span>
                    </div>

                    <div className="flex justify-between items-center text-xs p-2.5 bg-slate-950/40 border border-white/5 rounded-xl">
                      <div>
                        <span className="font-bold text-slate-200">Global Qualifier (4 Slots)</span>
                        <span className="block text-[10px] text-slate-500">To be decided via ICC Qualifier tournament</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-500 border border-white/5 text-[9px] font-bold font-mono">TBD</span>
                    </div>
                  </div>
                </div>

                {/* Tour & Travel Guide */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 bg-slate-900/10">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-brand-blue" /> Host Countries Tour & Travel Guide
                  </h4>
                  <p className="text-xs text-slate-400">
                    Traveling to South Africa, Zimbabwe, or Namibia? Here are essential safety & transit details:
                  </p>

                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <div className="flex gap-2">
                      <span className="text-brand-blue">🚆</span>
                      <p><strong>Gautrain Network:</strong> Use high-speed Gautrain from OR Tambo Airport to Sandton/Rosebank in Johannesburg. Safe and extremely efficient.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-brand-blue">📞</span>
                      <p><strong>Emergency Contacts:</strong> South Africa Police (10111), Ambulance (10177), National Cell Emergency (112).</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-brand-blue">🛂</span>
                      <p><strong>Visa Requirements:</strong> International spectators require valid passports and eVisas depending on nationality. Check requirements at least 60 days before.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Venues Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Host Venues Sneak Peek</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[9px] bg-brand-gold/15 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded uppercase font-bold font-mono">Johannesburg</span>
                    <h5 className="font-bold text-slate-200 mt-1">Wanderers Stadium</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">Capacity: 34,000. Known as the "Bullring". Major venue for playoffs and key matches.</p>
                  </div>
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[9px] bg-brand-gold/15 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded uppercase font-bold font-mono">Cape Town</span>
                    <h5 className="font-bold text-slate-200 mt-1">Newlands Cricket Ground</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">Capacity: 25,000. Features oak tree grass embankments and a stunning view of Table Mountain.</p>
                  </div>
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[9px] bg-brand-gold/15 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded uppercase font-bold font-mono">Pretoria</span>
                    <h5 className="font-bold text-slate-200 mt-1">Centurion Park</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">Capacity: 22,000. Known for its quick wickets and excellent fan-friendly grass banks.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 2. FIFA Hub ('fifa') */}
          {/* ============================================================== */}
          {subTab === 'fifa' && (
            <div className="space-y-8 text-left">
              {/* Dynamic Matches Placeholder Alert */}
              {(!soccerEvent || !soccerEvent.matches || soccerEvent.matches.length === 0) ? (
                <div className="glass-panel p-8 rounded-3xl border border-brand-blue/20 bg-gradient-to-br from-brand-blue/10 via-transparent to-transparent text-center space-y-6 max-w-xl mx-auto py-12">
                  <div className="w-16 h-16 rounded-full bg-brand-blue/10 border border-brand-blue/30 mx-auto flex items-center justify-center animate-pulse">
                    <Shield className="w-8 h-8 text-brand-blue" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Live FIFA Telemetry Feed</h3>
                    <p className="text-xs text-slate-400 font-mono tracking-tight bg-slate-950/60 p-4 border border-white/5 rounded-xl">
                      "Live FIFA data unavailable. Waiting for official updates."
                    </p>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                    The Express mock-backend contains no hardcoded fake FIFA matches. Fixture telemetry will sync automatically upon official API activation.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">FIFA Match Fixtures</h4>
                  {/* If we had soccer matches, render them here */}
                </div>
              )}

              {/* USA/Canada/Mexico 2026 Host Venues Guide */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4.5 h-4.5 text-brand-blue" />
                  FIFA World Cup 2026 Host Stadiums
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {soccerEvent?.venues?.map((venue: any, idx: number) => (
                    <div key={idx} className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/10 hover:border-brand-blue/20 transition-all duration-300 relative">
                      <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-4">
                        <div>
                          <h5 className="font-bold text-slate-100">{venue.name}</h5>
                          <span className="text-[10px] text-slate-500 block">{venue.city}, {venue.country}</span>
                        </div>
                        <span className="text-[9px] bg-brand-blue/15 text-brand-blue border border-brand-blue/20 px-2 py-0.5 rounded font-mono font-bold">
                          {venue.capacity.toLocaleString()} Capacity
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">{venue.info}</p>
                      
                      <div className="text-[10px] space-y-2">
                        <div className="bg-slate-950/30 p-2.5 rounded-lg border border-white/5">
                          <span className="font-bold text-slate-400 block uppercase text-[8px] tracking-wider mb-1">Nearby Dining</span>
                          <span className="text-slate-300">{venue.nearbyRestaurants?.join(', ')}</span>
                        </div>
                        <div className="bg-slate-950/30 p-2.5 rounded-lg border border-white/5">
                          <span className="font-bold text-slate-400 block uppercase text-[8px] tracking-wider mb-1">Nearby Lodging</span>
                          <span className="text-slate-300">{venue.nearbyHotels?.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. Cricket Hub ('cricket') */}
          {/* ============================================================== */}
          {subTab === 'cricket' && (
            <div className="space-y-6 text-left">
              {/* Format Filter Bar */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex gap-2">
                  {['all', 'Test', 'ODI', 'T20I'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setCricketFormatFilter(f)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        cricketFormatFilter === f
                          ? 'bg-brand-blue text-slate-950 border-brand-blue font-bold shadow-[0_0_10px_rgba(0,212,255,0.15)]'
                          : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Formats Monitor Active</span>
              </div>

              {/* Cricket scoreboards grid */}
              {filteredCricketMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCricketMatches.map((match) => (
                    <div key={match.id} className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/10 hover:border-brand-blue/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] bg-brand-blue/15 text-brand-blue border border-brand-blue/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                            {match.format} &bull; {match.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{match.city}, {match.country}</span>
                        </div>
                        <h4 className="text-md font-bold text-white">{match.homeTeam} vs {match.awayTeam}</h4>
                        
                        {/* Scores if active */}
                        {match.innings && match.innings.length > 0 && (
                          <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl space-y-2">
                            {match.innings.map((inn: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-xs font-mono text-slate-300">
                                <span>{inn.team}</span>
                                <span className="font-bold text-white">
                                  {inn.score}/{inn.wickets} <span className="text-[10px] text-slate-500">({inn.overs} ov)</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {match.result && (
                          <p className="text-xs text-brand-blue font-bold font-mono">{match.result}</p>
                        )}
                      </div>

                      <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {match.status === 'live' ? '⚡ Score Poll Online' : `📅 Date: ${new Date(match.date).toLocaleDateString()}`}
                        </span>
                        
                        {planningMatchId === match.id ? (
                          <div className="flex gap-2">
                            <input 
                              type="number" 
                              placeholder="Limit ($)" 
                              value={budgetLimit} 
                              onChange={(e) => setBudgetLimit(e.target.value)} 
                              className="w-20 bg-slate-950 text-xs px-2.5 py-1 rounded border border-white/10" 
                            />
                            <button
                              onClick={() => handlePlanTravel(match.id)}
                              disabled={isPlanning}
                              className="px-3 py-1.5 rounded-lg bg-brand-blue text-slate-950 text-[10px] font-bold flex items-center gap-1 hover:brightness-105 transition-all shrink-0"
                            >
                              {isPlanning ? 'Planning...' : 'Generate'}
                            </button>
                            <button 
                              onClick={() => setPlanningMatchId(null)}
                              className="text-[10px] text-slate-500"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setPlanningMatchId(match.id)}
                            className="px-3 py-1.5 rounded-lg bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-slate-950 text-[10px] font-bold transition-all flex items-center gap-1 border border-brand-blue/30"
                          >
                            <Sparkles className="w-3 h-3" /> AI Plan Travel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs italic text-center py-10">No matches found for format filter: {cricketFormatFilter}</p>
              )}

              {/* Weather Telemetry */}
              <div className="glass-panel p-5 rounded-2xl border border-brand-blue/10 bg-gradient-to-r from-brand-blue/5 to-transparent space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CloudLightning className="w-4 h-4 text-amber-500" /> Active Weather Telemetry
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Doppler radar scans active for Lord's Cricket Ground, Wankhede Stadium, MCG, and Cape Town Newlands. Alarms automatically fire to reschedule travel itineraries on flight corridors if rainfall exceed 8mm/hr.
                </p>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. Live Matches ('live') */}
          {/* ============================================================== */}
          {subTab === 'live' && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-emerald-500 animate-pulse" /> Live Scoreboards
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Real-time API Updates (5s polling)
                </span>
              </div>

              {liveMatches.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {liveMatches.map((match) => (
                    <div key={match.id} className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/10 hover:border-brand-blue/20 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                      {/* Live Badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-black uppercase text-emerald-400 tracking-wider">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" /> Live
                      </div>

                      {/* Header info */}
                      <div className="space-y-1">
                        <span className="text-[9px] bg-brand-blue/15 text-brand-blue border border-brand-blue/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                          {match.format} MATCH &bull; {match.venueName}
                        </span>
                        <h4 className="text-lg font-bold text-white mt-2">
                          {match.homeTeam} vs {match.awayTeam}
                        </h4>
                      </div>

                      {/* Score display */}
                      <div className="my-5 p-4 bg-slate-950/50 border border-white/5 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Match Progress:</span>
                          <span className="text-xs text-brand-blue font-bold font-mono">
                            {match.innings[match.innings.length - 1]?.team || match.homeTeam} Innings
                          </span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-2xl font-black text-white font-mono">
                            {match.innings[match.innings.length - 1]?.score || 0}/{match.innings[match.innings.length - 1]?.wickets || 0}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {match.innings[match.innings.length - 1]?.overs || 0.0} Overs
                          </span>
                        </div>

                        {/* Batter/Bowler stats */}
                        {match.liveDetails && (
                          <div className="border-t border-white/5 pt-3 mt-2 grid grid-cols-2 gap-4 text-[10px]">
                            <div className="space-y-1">
                              <span className="text-slate-500 font-bold block">Batsmen:</span>
                              {match.liveDetails.batsmen.map((b: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-slate-300">
                                  <span>{b.name}*</span>
                                  <span className="font-mono font-bold text-white">{b.runs} ({b.balls})</span>
                                </div>
                              ))}
                            </div>
                            <div className="space-y-1 border-l border-white/5 pl-4">
                              <span className="text-slate-500 font-bold block">Bowlers:</span>
                              {match.liveDetails.bowlers.map((bl: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-slate-300">
                                  <span>{bl.name}</span>
                                  <span className="font-mono font-bold text-white">{bl.wickets}-{bl.runs} ({bl.overs} ov)</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Commentary/Status */}
                      {match.liveDetails && (
                        <p className="text-[11px] text-slate-400 italic mb-4 leading-relaxed font-sans bg-slate-950/20 p-2.5 rounded-xl border border-white/5">
                          💬 {match.liveDetails.commentary}
                        </p>
                      )}

                      {/* Travel Button */}
                      <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="text-[10px] text-brand-gold font-mono font-bold">
                          {match.liveDetails ? (
                            <span>Target: {match.liveDetails.target} &bull; Needs {match.liveDetails.requiredRuns} to win</span>
                          ) : (
                            <span>Live Match Telemetry Online</span>
                          )}
                        </div>

                        {planningMatchId === match.id ? (
                          <div className="flex gap-2 w-full sm:w-auto">
                            <input 
                              type="number" 
                              placeholder="Limit ($)" 
                              value={budgetLimit} 
                              onChange={(e) => setBudgetLimit(e.target.value)} 
                              className="w-20 bg-slate-950 text-xs px-2.5 py-1 rounded border border-white/10" 
                            />
                            <button
                              onClick={() => handlePlanTravel(match.id)}
                              disabled={isPlanning}
                              className="px-3 py-1.5 rounded-lg bg-brand-blue text-slate-950 text-[10px] font-bold flex items-center gap-1 hover:brightness-105 transition-all shrink-0"
                            >
                              {isPlanning ? 'Planning...' : 'Generate'}
                            </button>
                            <button 
                              onClick={() => setPlanningMatchId(null)}
                              className="text-[10px] text-slate-500"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setPlanningMatchId(match.id)}
                            className="px-3.5 py-2 rounded-xl bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 border border-brand-blue/30 shadow-md shadow-brand-blue/5"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> AI Plan Travel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs italic">No live matches running at this moment.</p>
              )}

              {/* Completed Segment */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recently Completed Matches</h4>
                <div className="space-y-3">
                  {completedMatches.map((match) => (
                    <div key={match.id} className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 tracking-wider font-semibold font-mono uppercase">{match.format}</span>
                        <div className="font-bold text-slate-200 mt-1">{match.homeTeam} vs {match.awayTeam}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{match.venueName}, {match.city}</div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">Completed</span>
                        <p className="text-[10px] text-brand-blue font-bold mt-1 max-w-[280px] leading-relaxed font-mono">{match.result}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 5. Upcoming Fixtures ('upcoming') */}
          {/* ============================================================== */}
          {subTab === 'upcoming' && (
            <div className="space-y-6 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4.5 h-4.5 text-brand-blue" /> Scheduled International Matches
              </h3>

              {upcomingMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {upcomingMatches.map((match) => (
                    <div key={match.id} className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/10 hover:border-brand-blue/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] bg-brand-blue/15 text-brand-blue border border-brand-blue/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">{match.format}</span>
                          <span className="text-[10px] text-slate-500 font-mono font-bold flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-brand-blue" /> {new Date(match.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-md font-bold text-white pt-2">{match.homeTeam} vs {match.awayTeam}</h4>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-sans">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" /> {match.venueName} &bull; {match.city}, {match.country}
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-semibold font-mono">Starts 09:30 AM local time</span>
                        
                        {planningMatchId === match.id ? (
                          <div className="flex gap-2">
                            <input 
                              type="number" 
                              placeholder="Limit ($)" 
                              value={budgetLimit} 
                              onChange={(e) => setBudgetLimit(e.target.value)} 
                              className="w-20 bg-slate-950 text-xs px-2.5 py-1 rounded border border-white/10" 
                            />
                            <button
                              onClick={() => handlePlanTravel(match.id)}
                              disabled={isPlanning}
                              className="px-3 py-1.5 rounded-lg bg-brand-blue text-slate-950 text-[10px] font-bold flex items-center gap-1 hover:brightness-105 transition-all shrink-0"
                            >
                              {isPlanning ? 'Planning...' : 'Generate'}
                            </button>
                            <button 
                              onClick={() => setPlanningMatchId(null)}
                              className="text-[10px] text-slate-500"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setPlanningMatchId(match.id)}
                            className="px-3 py-1.5 rounded-lg bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-slate-950 text-[10px] font-bold transition-all flex items-center gap-1 border border-brand-blue/30"
                          >
                            <Sparkles className="w-3 h-3" /> AI Plan Travel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs italic">No upcoming matches scheduled.</p>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 6. Stadium Guide ('stadium') */}
          {/* ============================================================== */}
          {subTab === 'stadium' && (
            <div className="space-y-8 text-left">
              {/* Stadium Selector Bar */}
              <div className="flex flex-wrap gap-3">
                {(Object.keys(interactiveStadiums) as Array<keyof typeof interactiveStadiums>).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedStadium(key);
                      setSelectedGate(interactiveStadiums[key].gates[0].name);
                      setSelectedSection(interactiveStadiums[key].sections[0].name);
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${
                      selectedStadium === key
                        ? 'bg-brand-blue text-slate-950 border-brand-blue shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                        : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {interactiveStadiums[key].name}
                  </button>
                ))}
              </div>

              {/* Main Stadium Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Blueprint Col-span 7 */}
                <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <MapIcon className="w-4 h-4 text-brand-blue" />
                      Dynamic Seating & Entry Blueprint
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{currentStadium.city}</span>
                  </div>

                  {/* SVG Blueprint */}
                  <div className="flex justify-center bg-slate-950/60 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-white/5 font-mono text-slate-400">
                      <Activity className="w-3.5 h-3.5 text-brand-blue animate-pulse" /> Live Telemetry
                    </div>

                    <svg viewBox="0 0 400 400" className="w-full max-w-[320px] aspect-square">
                      {/* Pitch */}
                      {selectedStadium === 'metlife' || selectedStadium === 'stade_de_france' ? (
                        <rect x="130" y="130" width="140" height="140" rx="10" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5" />
                      ) : (
                        <circle cx="200" cy="200" r="70" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5" />
                      )}
                      <circle cx="200" cy="200" r="10" fill="none" stroke="rgba(0,212,255,0.2)" />

                      {/* Seating Rings */}
                      <circle 
                        cx="200" cy="200" r="95" fill="none" 
                        stroke={selectedSection === 'VIP Suites' || selectedSection === 'Presidential Pavilion' || selectedSection === 'Official Club Loge' ? 'rgba(0,212,255,0.8)' : 'rgba(255,255,255,0.08)'} 
                        strokeWidth="12" className="cursor-pointer hover:stroke-brand-blue/60 transition-all"
                        onClick={() => setSelectedSection(currentStadium.sections[0].name)}
                      />
                      <circle 
                        cx="200" cy="200" r="115" fill="none" 
                        stroke={selectedSection.includes('Lower') || selectedSection.includes('Basse') || selectedSection.includes('Memorial') ? 'rgba(0,212,255,0.8)' : 'rgba(255,255,255,0.05)'} 
                        strokeWidth="16" className="cursor-pointer hover:stroke-brand-blue/60 transition-all"
                        onClick={() => setSelectedSection(currentStadium.sections[1].name)}
                      />
                      <circle 
                        cx="200" cy="200" r="140" fill="none" 
                        stroke={selectedSection.includes('Mid') || selectedSection.includes('Grass') || selectedSection.includes('Intermédiaire') ? 'rgba(0,212,255,0.8)' : 'rgba(255,255,255,0.03)'} 
                        strokeWidth="20" className="cursor-pointer hover:stroke-brand-blue/60 transition-all"
                        onClick={() => setSelectedSection(currentStadium.sections[2].name)}
                      />
                      <circle 
                        cx="200" cy="200" r="168" fill="none" 
                        stroke={selectedSection.includes('Upper') || selectedSection.includes('Unity') || selectedSection.includes('Haute') ? 'rgba(0,212,255,0.8)' : 'rgba(255,255,255,0.02)'} 
                        strokeWidth="22" className="cursor-pointer hover:stroke-brand-blue/60 transition-all"
                        onClick={() => setSelectedSection(currentStadium.sections[3].name)}
                      />

                      {/* Gates */}
                      <circle 
                        cx="200" cy="20" r="10" 
                        fill={selectedGate.includes('A') || selectedGate.includes('Main') ? '#00d4ff' : 'rgba(255,255,255,0.2)'} 
                        className="cursor-pointer animate-pulse" 
                        onClick={() => setSelectedGate(currentStadium.gates[0].name)}
                      />
                      <text x="200" y="40" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Gate 1</text>

                      <circle 
                        cx="380" cy="200" r="10" 
                        fill={selectedGate.includes('B') || selectedGate.includes('East') || selectedGate.includes('H') ? '#ffd700' : 'rgba(255,255,255,0.2)'} 
                        className="cursor-pointer animate-pulse" 
                        onClick={() => setSelectedGate(currentStadium.gates[1].name)}
                      />
                      <text x="380" y="220" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Gate 2</text>

                      <circle 
                        cx="200" cy="380" r="10" 
                        fill={selectedGate.includes('C') || selectedGate.includes('West') || selectedGate.includes('N') ? '#ff007f' : 'rgba(255,255,255,0.2)'} 
                        className="cursor-pointer animate-pulse" 
                        onClick={() => setSelectedGate(currentStadium.gates[2].name)}
                      />
                      <text x="200" y="370" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Gate 3</text>
                    </svg>
                  </div>

                  <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl text-xs text-slate-300">
                    <p><strong>💡 Stadium Blueprint Tips:</strong> Click the outer circular seating sections to view seat reviews, or click pulsing gates (Gate 1, 2, 3) to view queue wait times.</p>
                  </div>
                </div>

                {/* Queue times & reviews Col-span 5 */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Gate Wait Times */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-pink" /> Entry Gate Queue Status
                    </h3>
                    
                    <div className="space-y-3">
                      {currentStadium.gates.map((g, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedGate(g.name)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedGate === g.name 
                              ? 'bg-brand-blue/10 border-brand-blue/40 text-slate-100' 
                              : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-900'
                          } flex justify-between items-center text-xs`}
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-200 block">{g.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">Queue wait: {g.waitTime}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            g.status === 'Clear' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            g.status === 'Moderate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-brand-pink/10 text-brand-pink border border-brand-pink/20 animate-pulse'
                          }`}>
                            {g.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seat Review */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-brand-blue" /> Seating Section Overview
                    </h3>

                    <div className="space-y-3">
                      {currentStadium.sections.map((s, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedSection(s.name)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            selectedSection === s.name 
                              ? 'bg-brand-blue/10 border-brand-blue/40 text-slate-100' 
                              : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-900'
                          } space-y-1.5 text-xs`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-200">{s.name}</span>
                            <span className="text-[10px] bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/20 font-bold">{s.rating} Quality</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{s.view}</p>
                          <span className="text-[10px] text-slate-500 block font-mono">Price: {s.priceRange}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transport Detail */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-3">🚗 Parking & Transit Details</h3>
                    <div className="space-y-3 text-xs leading-relaxed text-slate-300 font-sans">
                      <div className="flex items-center gap-2">
                        <Train className="w-4.5 h-4.5 text-brand-blue shrink-0" />
                        <span><strong>Public Rail:</strong> {currentStadium.transit}</span>
                      </div>
                      <div className="border-t border-white/5 pt-3 space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Parking Lot Loads</span>
                        {currentStadium.parking.map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] font-mono">
                            <span className="text-slate-400 font-semibold font-sans">{p.name}</span>
                            <div className="flex items-center gap-2">
                              <span>{p.occupancy} Full</span>
                              <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold uppercase ${
                                p.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400' :
                                p.status === 'Filling' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-brand-pink/10 text-brand-pink'
                              }`}>
                                {p.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 7. Ticket Watchlist ('tickets') */}
          {/* ============================================================== */}
          {subTab === 'tickets' && (
            <div className="space-y-8 text-left">
              {/* Add Ticket Watchlist Alert Form */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-r from-brand-blue/5 via-transparent to-transparent">
                <h3 className="text-md font-bold mb-4 flex items-center gap-2 text-white">
                  <PlusCircle className="w-4.5 h-4.5 text-brand-blue" />
                  Add Ticket Watchlist Alert
                </h3>
                <form onSubmit={handleAddWatch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Match Fixture</label>
                    <input 
                      type="text" 
                      value={newMatch}
                      onChange={(e) => setNewMatch(e.target.value)}
                      className="glass-input text-xs w-full py-2.5" 
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Current Ticket Price ($)</label>
                    <input 
                      type="number" 
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="glass-input text-xs w-full py-2.5" 
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Alert Threshold ($)</label>
                    <input 
                      type="number" 
                      value={newThreshold}
                      onChange={(e) => setNewThreshold(e.target.value)}
                      className="glass-input text-xs w-full py-2.5" 
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="submit" 
                      className="w-full py-2.5 rounded-xl bg-brand-blue text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                    >
                      Add Price Tracker
                    </button>
                  </div>
                </form>
              </div>

              {/* Grid of Tracked Matches */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {watchlist.map((item) => {
                  const isTriggered = item.currentPrice <= item.threshold;
                  return (
                    <div key={item.id} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4 hover:border-brand-blue/30 transition-all duration-200">
                      
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="overflow-hidden">
                          <span className="text-[9px] bg-slate-950 text-slate-400 border border-white/5 px-2.5 py-0.5 rounded uppercase font-semibold block w-fit truncate">
                            {item.event}
                          </span>
                          <span className="font-bold text-sm text-slate-200 block truncate mt-1.5">{item.match}</span>
                        </div>
                        <div className={`p-2 rounded-lg ${isTriggered ? 'bg-brand-pink/15 text-brand-pink border border-brand-pink/30 animate-pulse' : 'bg-slate-900 border-white/5 text-slate-500'}`}>
                          <Bell className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Sparkline */}
                      <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5 flex flex-col justify-between h-20">
                        <span className="text-[9px] text-slate-500 font-mono">14-Day Price Sparkline</span>
                        <div className="w-full h-8 pt-1">
                          <svg viewBox="0 0 160 60" className="w-full h-full overflow-visible">
                            <path 
                              d={item.sparkline} 
                              fill="none" 
                              stroke={item.trend === 'down' ? '#10b981' : '#ff007f'} 
                              strokeWidth="2" 
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Price Details */}
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div className="bg-slate-950/20 p-2.5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-slate-500 block">Current price</span>
                          <span className="text-sm font-bold text-white block mt-0.5">${item.currentPrice}</span>
                          <span className={`text-[9px] flex items-center gap-0.5 mt-0.5 font-sans font-bold ${item.trend === 'down' ? 'text-emerald-400' : 'text-brand-pink'}`}>
                            {item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                            {item.trend === 'down' ? 'Price Falling' : 'Price Rising'}
                          </span>
                        </div>

                        <div className="bg-slate-950/20 p-2.5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-slate-500 block">Alert threshold</span>
                          <span className="text-sm font-bold text-brand-gold block mt-0.5">${item.threshold}</span>
                          <span className="text-[9px] text-slate-500 block mt-0.5 font-sans">
                            {isTriggered ? '🔔 Threshold Met' : '⏱️ Waiting'}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Threshold Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold font-mono">
                          <span>Adjust Alert:</span>
                          <span>${item.threshold}</span>
                        </div>
                        <input 
                          type="range" 
                          min="200" 
                          max="1200" 
                          step="25"
                          value={item.threshold} 
                          onChange={(e) => handleSetThreshold(item.id, Number(e.target.value))}
                          className="w-full accent-brand-blue" 
                        />
                      </div>

                      {/* Availability */}
                      <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-3">
                        <span className="text-slate-500 font-sans">Seating availability</span>
                        <span className="text-brand-pink font-bold font-mono">{item.availability}</span>
                      </div>

                      {/* Alert Notification */}
                      {isTriggered && (
                        <div className="p-2.5 bg-brand-pink/5 border border-brand-pink/20 rounded-lg text-[10px] text-brand-pink leading-relaxed flex items-start gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-brand-pink shrink-0 mt-0.5 animate-pulse" />
                          <span><strong>ALERT:</strong> Ticket price for this match has dropped below your threshold of ${item.threshold}! Purchase instantly to secure seats.</span>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Verified Tickets Notice */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/30">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider border-b border-white/5 pb-2">
                  <Ticket className="w-4.5 h-4.5 text-brand-blue" />
                  Official Ticketing Channels
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
                  Guardian AI connects you to verified ticketing exchanges. Ensure you avoid third-party marketplaces which see 3x price inflations during World Cup seasons. Set automated email alerts or WhatsApp alerts in Settings to receive real-time threshold notifications.
                </p>
              </div>
            </div>
          )}

          {/* Active Safety Telemetry Panel (Footer area for all tabs except icc/fifa which have custom guides) */}
          {subTab !== 'icc' && subTab !== 'fifa' && (
            <div className="glass-panel p-5 rounded-2xl border border-brand-blue/10 bg-gradient-to-r from-brand-blue/5 to-transparent space-y-4 text-left">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <ShieldAlert className="w-5 h-5 text-brand-blue" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active Sports Hub Safety Telemetry</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className="bg-slate-950/40 p-3 rounded-xl border border-white/5 flex gap-3 text-xs leading-relaxed">
                    <div className="shrink-0 mt-0.5">
                      {alert.type === 'weather' ? (
                        <CloudLightning className="w-4 h-4 text-amber-500" />
                      ) : alert.type === 'flight' ? (
                        <Plane className="w-4 h-4 text-brand-pink animate-pulse" />
                      ) : alert.type === 'transit' ? (
                        <Train className="w-4 h-4 text-brand-blue" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-brand-blue" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block">{alert.title}</span>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">{alert.message}</p>
                      <span className="text-[8px] text-slate-500 font-mono block mt-1.5">Telemetry active &bull; {new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
