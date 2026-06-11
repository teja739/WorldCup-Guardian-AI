'use client';

import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Trophy, 
  Clock, 
  HelpCircle, 
  Users, 
  ChevronRight, 
  Compass, 
  ShieldAlert, 
  FileText
} from 'lucide-react';

interface SportsHubsProps {
  activeTab: 'football' | 'cricket' | 'olympics';
  events: any[];
  trips: any[];
  setChatInput: (val: string) => void;
  setActiveTab: (tab: string) => void;
  submitAgent: () => void;
}

export default function SportsHubs({ 
  activeTab, 
  events, 
  trips, 
  setChatInput, 
  setActiveTab, 
  submitAgent 
}: SportsHubsProps) {
  
  const handleAutoPlan = (promptText: string) => {
    setChatInput(promptText);
    setActiveTab('agent');
    // Give it a tiny delay for state to sync, then the parent page triggers handleAgentSubmit
    setTimeout(() => {
      const askBtn = document.getElementById('ask-agent-submit-btn');
      if (askBtn) askBtn.click();
    }, 100);
  };

  // Find corresponding events
  const footballEvent = events.find(e => e.sport === 'Soccer');
  const cricketEvent = events.find(e => e.sport === 'Cricket');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ⚽ FOOTBALL HUB */}
      {activeTab === 'football' && (
        <>
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-brand-blue/15 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-3xl font-bold">⚽</div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Featured Event</span>
              <span className="text-xl font-bold text-white mt-1 block">FIFA World Cup 2026</span>
              <span className="text-xs text-brand-blue mt-2 block">16 Host Cities &bull; North America</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-3xl font-bold">✈️</div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">AI Planned Travel</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {trips.filter(t => t.event.toLowerCase().includes('fifa') || t.destination.toLowerCase().includes('new york')).length} Planned
              </span>
              <span className="text-xs text-slate-400 mt-2 block">Synced to MongoDB Memory</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-3xl font-bold">🏟️</div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Stadium Status</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">MetLife Ready</span>
              <span className="text-xs text-slate-400 mt-2 block">Clear Bag Policy Enforced</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Matches & Teams */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-md font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Trophy className="w-4.5 h-4.5 text-brand-blue" />
                  FIFA World Cup Match Fixtures
                </h3>
                <div className="space-y-3">
                  {footballEvent?.matches ? (
                    footballEvent.matches.map((match: any) => (
                      <div key={match.id} className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:border-brand-blue/20 transition-all duration-200">
                        <div className="space-y-1">
                          <span className="text-[9px] bg-brand-blue/15 text-brand-blue border border-brand-blue/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                            {match.group}
                          </span>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs font-bold text-slate-100">{match.homeTeam}</span>
                            <span className="text-xs text-slate-500">vs</span>
                            <span className="text-xs font-bold text-slate-100">{match.awayTeam}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block font-mono">
                            {match.venueName} &bull; {new Date(match.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-bold block">{match.status}</span>
                          {match.homeScore !== undefined && (
                            <span className="text-xs text-brand-blue font-bold font-mono">{match.homeScore} - {match.awayScore}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs italic">No football fixtures found.</p>
                  )}
                </div>
              </div>

              {/* Team Information */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-md font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-brand-blue" />
                  Tactical AI Analytics & Team Profiles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-white">Argentina 🇦🇷</span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">Champions</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Defending champions featuring dynamic high-possession plays. Key venue matches in East Rutherford, NJ.</p>
                    <button 
                      onClick={() => handleAutoPlan("Provide tactical football details for Argentina in FIFA 2026.")}
                      className="text-[10px] text-brand-blue hover:underline font-bold flex items-center gap-0.5"
                    >
                      AI Tactical Preview <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-white">France 🇫🇷</span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">Top Seed</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Counter-attacking specialists led by Mbappé. Highly favored for the final matches at MetLife Stadium.</p>
                    <button 
                      onClick={() => handleAutoPlan("Provide tactical football details for France in FIFA 2026.")}
                      className="text-[10px] text-brand-blue hover:underline font-bold flex items-center gap-0.5"
                    >
                      AI Tactical Preview <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stadium Details & presets */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">🏟️ Host Venues</h3>
                {footballEvent?.venues ? (
                  footballEvent.venues.map((venue: any, idx: number) => (
                    <div key={idx} className="bg-slate-950/30 p-4 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-200">{venue.name}</span>
                        <span className="text-[8px] bg-brand-blue/15 text-brand-blue px-2 py-0.5 rounded border border-brand-blue/20 font-mono">{venue.capacity.toLocaleString()} Capacity</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{venue.info}</p>
                      <div className="text-[9px] text-slate-500 pt-1">
                        <span className="font-bold text-slate-400 block">Nearby Dining:</span>
                        {venue.nearbyRestaurants?.join(', ')}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs italic">No venues loaded.</p>
                )}
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 bg-gradient-to-br from-brand-blue/5 to-transparent">
                <span className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                  Auto-Plan Football
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">Let the AI Agent build an optimized 5-day flight, hotel, and match ticket itinerary for MetLife Stadium.</p>
                <button 
                  onClick={() => handleAutoPlan("Plan a trip to watch FIFA in New York MetLife Stadium")}
                  className="w-full py-2.5 rounded-xl bg-brand-blue text-slate-950 font-bold text-xs hover:brightness-110 transition-all"
                >
                  AI Plan Football Journey
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 🏏 CRICKET HUB */}
      {activeTab === 'cricket' && (
        <>
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-brand-blue/15 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-3xl font-bold">🏏</div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Featured Tournament</span>
              <span className="text-xl font-bold text-white mt-1 block">ICC Cricket World Cup 2027</span>
              <span className="text-xs text-brand-blue mt-2 block">South Africa, Zimbabwe & Namibia</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-3xl font-bold">🏆</div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Tournaments Synced</span>
              <span className="text-xl font-bold text-white mt-1 block">IPL & ICC Trophies</span>
              <span className="text-xs text-slate-400 mt-2 block">Emergency Gautrain Routes loaded</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-3xl font-bold">⚡</div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Cricket Alarms</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">System Active</span>
              <span className="text-xs text-slate-400 mt-2 block">Rain/Over-Delay monitoring</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Matches & Leagues */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-md font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Trophy className="w-4.5 h-4.5 text-brand-blue" />
                  ICC ODI World Cup Schedule
                </h3>
                <div className="space-y-3">
                  {cricketEvent?.matches ? (
                    cricketEvent.matches.map((match: any) => (
                      <div key={match.id} className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:border-brand-blue/20 transition-all duration-200">
                        <div className="space-y-1">
                          <span className="text-[9px] bg-brand-blue/15 text-brand-blue border border-brand-blue/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                            {match.group}
                          </span>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs font-bold text-slate-100">{match.homeTeam}</span>
                            <span className="text-xs text-slate-500">vs</span>
                            <span className="text-xs font-bold text-slate-100">{match.awayTeam}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block font-mono">
                            {match.venueName} &bull; {new Date(match.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-brand-blue font-bold block">{match.status}</span>
                          <span className="text-[9px] text-slate-500 font-mono">Starts 09:30 AM local</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs italic">No cricket fixtures found.</p>
                  )}
                </div>
              </div>

              {/* IPL T20 Alarms */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-md font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4.5 h-4.5 text-brand-pink" />
                  IPL & Domestic League Feeds
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-1.5">
                    <span className="font-bold text-xs text-slate-200 block">Mumbai Indians (Wankhede Stadium)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Monitored for local transport congestion and monsoon weather rain updates.</p>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-1.5">
                    <span className="font-bold text-xs text-slate-200 block">Chennai Super Kings (Chepauk Stadium)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">AI budget trackers automatically allocate Chennai local rail travel presets.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gautrain & Wanderers Stadium Guide */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">🏟️ Wanderers Stadium</h3>
                {cricketEvent?.venues ? (
                  cricketEvent.venues.map((venue: any, idx: number) => (
                    <div key={idx} className="bg-slate-950/30 p-4 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-200">{venue.name}</span>
                        <span className="text-[8px] bg-brand-blue/15 text-brand-blue px-2 py-0.5 rounded border border-brand-blue/20 font-mono">{venue.capacity.toLocaleString()} Seats</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{venue.info}</p>
                      <div className="text-[9px] text-slate-500 pt-1">
                        <span className="font-bold text-slate-400 block">Local Gautrain Station:</span>
                        Rosebank Gautrain Station (5 min Shuttle)
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs italic">No venues loaded.</p>
                )}
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 bg-gradient-to-br from-brand-blue/5 to-transparent">
                <span className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                  Auto-Plan Cricket
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">Plan a cricket journey to watch India vs Australia live in Johannesburg, South Africa.</p>
                <button 
                  onClick={() => handleAutoPlan("Plan a cricket trip to Johannesburg for India vs Australia")}
                  className="w-full py-2.5 rounded-xl bg-brand-blue text-slate-950 font-bold text-xs hover:brightness-110 transition-all"
                >
                  AI Plan Cricket Journey
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 🥇 OLYMPICS HUB */}
      {activeTab === 'olympics' && (
        <>
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-brand-blue/15 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-3xl font-bold">🥇</div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Featured Event</span>
              <span className="text-xl font-bold text-white mt-1 block">Olympic Games Paris 2024</span>
              <span className="text-xs text-brand-blue mt-2 block">Paris, France &bull; Stade de France</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-3xl font-bold">🚴</div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Disciplines List</span>
              <span className="text-xl font-bold text-white mt-1 block">42 Sports Loaded</span>
              <span className="text-xs text-slate-400 mt-2 block">Paris RER Metro Synced</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-3xl font-bold">🛂</div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Travel Assistant</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">Schengen Visa Guide</span>
              <span className="text-xs text-slate-400 mt-2 block">Active documentation check</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Disciplines & Medal Ticker */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-md font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Trophy className="w-4.5 h-4.5 text-brand-blue" />
                  Featured Olympic Disciplines & Schedules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="text-xs font-bold text-slate-200 block">Athletics & Track (Stade de France)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Men\'s and Women\'s 100m, 200m, relays, and field events. Connected via RER B and RER D rail.</p>
                  </div>
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="text-xs font-bold text-slate-200 block">Swimming & Aquatics (Saint-Denis)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Freestyle, butterfly, relays, and diving. Quick-access security lane guidelines synced.</p>
                  </div>
                </div>
              </div>

              {/* Countries Ticker */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-md font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Compass className="w-4.5 h-4.5 text-brand-blue" />
                  Participating Countries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['France 🇫🇷', 'USA 🇺🇸', 'Greece 🇬🇷', 'Great Britain 🇬🇧', 'China 🇨🇳', 'Japan 🇯🇵', 'Australia 🇦🇺', 'South Africa 🇿🇦', 'India 🇮🇳', 'Germany 🇩🇪'].map((country, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => handleAutoPlan(`Show details for ${country} in Paris Olympics`)}
                      className="text-xs bg-slate-950 border border-white/5 px-3 py-2 rounded-full text-slate-300 font-semibold hover:border-brand-blue/30 cursor-pointer transition-all duration-200"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stadium Info & Presets */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">🏟️ Olympic Stadium</h3>
                <div className="bg-slate-950/30 p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-200">Stade de France</span>
                    <span className="text-[8px] bg-brand-blue/15 text-brand-blue px-2 py-0.5 rounded border border-brand-blue/20 font-mono">80,000 Capacity</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Located in Saint-Denis. Host to athletics, rugby sevens, and the Closing Ceremony.</p>
                  <div className="text-[9px] text-slate-500 pt-1">
                    <span className="font-bold text-slate-400 block">Schengen Visa Warning:</span>
                    Apply at least 45 days prior to departure.
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 bg-gradient-to-br from-brand-blue/5 to-transparent">
                <span className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                  Auto-Plan Olympics
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">Let the AI Agent coordinate a trip to watch the Olympics in Paris, France.</p>
                <button 
                  onClick={() => handleAutoPlan("Plan a trip to watch the Olympics in Paris")}
                  className="w-full py-2.5 rounded-xl bg-brand-blue text-slate-950 font-bold text-xs hover:brightness-110 transition-all"
                >
                  AI Plan Olympic Journey
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
