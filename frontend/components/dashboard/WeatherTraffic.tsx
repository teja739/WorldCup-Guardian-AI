'use client';

import React, { useState } from 'react';
import { 
  CloudLightning, 
  Wind, 
  Droplets, 
  Compass, 
  MapPin, 
  Activity, 
  Car, 
  Train 
} from 'lucide-react';

export default function WeatherTraffic() {
  const [selectedCity, setSelectedCity] = useState<'nyc' | 'johannesburg' | 'paris'>('nyc');

  const telemetry = {
    nyc: {
      temp: "64°F",
      wind: "18 mph East",
      humidity: "89%",
      warning: "Severe Storm Advisory. MetLife MetLife Stadium area experiencing thunderstorms.",
      traffic: [
        { road: "I-95 South (stadium approach)", delay: "+25 mins", status: "congested", color: "text-brand-pink" },
        { road: "Route 3 West", delay: "+12 mins", status: "moderate", color: "text-amber-500" },
        { road: "NJ Transit Secaucus Line", delay: "On Time", status: "clear", color: "text-emerald-400" }
      ]
    },
    johannesburg: {
      temp: "22°C",
      wind: "8 km/h North",
      humidity: "42%",
      warning: "Clear skies. Perfect weather for cricket matches at the Wanderers.",
      traffic: [
        { road: "M1 Highway (Southbound)", delay: "On Time", status: "clear", color: "text-emerald-400" },
        { road: "Corlett Dr", delay: "+8 mins", status: "moderate", color: "text-amber-500" },
        { road: "Gautrain Shuttle Service", delay: "On Time", status: "clear", color: "text-emerald-400" }
      ]
    },
    paris: {
      temp: "19°C",
      wind: "12 km/h West",
      humidity: "60%",
      warning: "Light drizzle expected. Stade de France running track may be damp.",
      traffic: [
        { road: "A1 Autoroute (St-Denis approach)", delay: "+18 mins", status: "moderate", color: "text-amber-500" },
        { road: "RER B Rail Train", delay: "+3 mins", status: "clear", color: "text-emerald-400" },
        { road: "Metro Line 13", delay: "On Time", status: "clear", color: "text-emerald-400" }
      ]
    }
  };

  const current = telemetry[selectedCity];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      
      {/* Doppler Radar & weather stats (Col-span 7) */}
      <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
        
        {/* City Toggle */}
        <div className="flex gap-2 border-b border-white/5 pb-4">
          <button 
            onClick={() => setSelectedCity('nyc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCity === 'nyc' ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MetLife Stadium (NYC)
          </button>
          <button 
            onClick={() => setSelectedCity('johannesburg')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCity === 'johannesburg' ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Wanderers (Johannesburg)
          </button>
          <button 
            onClick={() => setSelectedCity('paris')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCity === 'paris' ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stade de France (Paris)
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <CloudLightning className="w-4.5 h-4.5 text-brand-blue" />
            Live Doppler Weather Radar
          </span>
          <span className="text-[9px] text-slate-500 font-mono">Telemetry Feed active</span>
        </div>

        {/* Doppler radar animated graphic */}
        <div className="bg-slate-950/60 rounded-2xl p-6 border border-white/5 flex justify-center relative overflow-hidden h-[240px] items-center">
          {/* Pulsing radar circles */}
          <div className="absolute w-48 h-48 rounded-full border border-brand-blue/10 animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute w-32 h-32 rounded-full border border-brand-blue/20 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute w-16 h-16 rounded-full border border-brand-blue/30 animate-ping" style={{ animationDuration: '2s' }} />
          
          <div className="w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_15px_#00d4ff]" />

          {/* Radar sweeping line */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-brand-blue/5 to-transparent origin-center rotate-45 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Weather stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Temperature</span>
            <span className="text-lg font-bold text-white font-mono">{current.temp}</span>
          </div>
          <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Wind Velocity</span>
            <span className="text-md font-bold text-white font-mono">{current.wind}</span>
          </div>
          <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Humidity Index</span>
            <span className="text-lg font-bold text-white font-mono">{current.humidity}</span>
          </div>
        </div>

        {/* Warning notification */}
        <div className="p-4 bg-brand-pink/5 border border-brand-pink/25 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-slate-300">
          <AlertCircle className="w-5 h-5 text-brand-pink shrink-0 animate-pulse mt-0.5" />
          <span><strong>Guardian Weather Advisory:</strong> {current.warning} Check live transit alerts before leaving hotel.</span>
        </div>

      </div>

      {/* Traffic Congestion & Timetables (Col-span 5) */}
      <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
          <Car className="w-4.5 h-4.5 text-brand-blue" />
          Stadium Access Traffic Telemetry
        </h3>

        <div className="space-y-4">
          {current.traffic.map((t, idx) => (
            <div key={idx} className="bg-slate-950/40 p-3.5 rounded-xl border border-white/5 flex justify-between items-center text-xs">
              <div className="space-y-1 pr-2">
                <span className="font-semibold text-slate-200 block">{t.road}</span>
                <span className="text-[10px] text-slate-500 font-mono">Access Status: {t.status}</span>
              </div>
              <div className="text-right">
                <span className={`font-bold font-mono ${t.color}`}>{t.delay}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Public transit advisories */}
        <div className="border-t border-white/5 pt-4 space-y-3">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1">
            <Train className="w-3.5 h-3.5 text-slate-500" />
            Live Public Transit Feeds
          </span>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 text-[10px] leading-relaxed text-slate-400">
            Due to heavy rideshare surge pricing (estimated up to 3.2x), judges and fans are strongly advised to coordinate via the municipal rail shuttle networks, which are running additional game day trains on on schedule.
          </div>
        </div>

      </div>

    </div>
  );
}

// Inline fallback for missing import
function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
