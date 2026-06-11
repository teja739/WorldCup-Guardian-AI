'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Filter, 
  Sparkles, 
  ShieldAlert 
} from 'lucide-react';

interface MatchCalendarProps {
  events: any[];
}

export default function MatchCalendar({ events }: MatchCalendarProps) {
  const [filterSport, setFilterSport] = useState<'all' | 'Soccer' | 'Cricket' | 'Olympics'>('all');

  // Gather all matches
  const allMatches: any[] = [];
  events.forEach(ev => {
    if (ev.matches) {
      ev.matches.forEach((m: any) => {
        allMatches.push({
          ...m,
          sport: ev.sport,
          eventTitle: ev.title
        });
      });
    }
  });

  // Sort matches by date
  allMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filtered = allMatches.filter(m => {
    if (filterSport === 'all') return true;
    if (filterSport === 'Olympics') return m.eventTitle.toLowerCase().includes('olympic');
    return m.sport === filterSport;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Filters Header */}
      <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-brand-blue" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">World Cup Match Schedules</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Filter calendar fixtures by sport and check stadium clearance gates.</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'Soccer', 'Cricket', 'Olympics'] as const).map((sport) => (
            <button
              key={sport}
              onClick={() => setFilterSport(sport)}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all duration-200 ${
                filterSport === sport
                  ? 'bg-brand-blue/15 text-brand-blue border-brand-blue/30 shadow-[0_0_10px_rgba(0,212,255,0.03)]'
                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((match) => (
          <div key={match.id} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-brand-blue/20 transition-all duration-250">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[9px] bg-slate-950 border border-white/5 text-slate-400 px-2.5 py-0.5 rounded uppercase font-bold tracking-wider font-mono">
                  {match.eventTitle}
                </span>
                <span className="text-[9px] text-slate-500 font-mono uppercase font-bold">
                  {match.group}
                </span>
              </div>

              <div className="flex items-center gap-3 py-1">
                <span className="text-sm font-bold text-slate-100">{match.homeTeam}</span>
                <span className="text-xs text-slate-500 font-mono">vs</span>
                <span className="text-sm font-bold text-slate-100">{match.awayTeam}</span>
              </div>

              <div className="space-y-1 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{match.venueName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{new Date(match.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3.5 mt-4 flex justify-between items-center text-[10px]">
              <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                match.status === 'live' ? 'bg-brand-pink/10 text-brand-pink border border-brand-pink/20 animate-pulse' :
                match.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                'bg-slate-950 text-slate-400 border border-white/5'
              }`}>
                {match.status}
              </span>
              <div className="flex items-center gap-1.5 text-slate-500 font-sans">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
                <span>Clear Bag Policy Active</span>
              </div>
            </div>

          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-slate-500 italic py-8 text-center md:col-span-2">No calendar fixtures found matching this filter.</p>
        )}
      </div>

    </div>
  );
}
