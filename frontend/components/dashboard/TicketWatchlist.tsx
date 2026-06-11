'use client';

import React, { useState } from 'react';
import { 
  Ticket, 
  TrendingUp, 
  Bell, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle 
} from 'lucide-react';

export default function TicketWatchlist() {
  const [watchlist, setWatchlist] = useState([
    {
      id: 1,
      match: "FIFA World Cup Final",
      event: "FIFA World Cup 2026",
      currentPrice: 850,
      previousPrice: 920,
      threshold: 800,
      sparkline: "M 0 50 Q 20 20 40 40 T 80 10 T 120 45 T 160 5", // SVG path
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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Set alert panel */}
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

      {/* Grid of tracked matches */}
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

              {/* Sparkline chart */}
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

              {/* Alert notifications */}
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

      {/* Ticket buying info */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3.5 bg-slate-900/30">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider border-b border-white/5 pb-2">
          <Ticket className="w-4.5 h-4.5 text-brand-blue" />
          Official Ticketing Channels
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          WorldCup Guardian AI connects you to verified ticketing exchanges. Ensure you avoid third-party marketplaces which see 3x price inflations during World Cup seasons. Set automated email alerts or WhatsApp alerts in Settings to receive real-time threshold notifications.
        </p>
      </div>

    </div>
  );
}
