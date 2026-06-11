'use client';

import React, { useState } from 'react';
import { 
  Map, 
  Compass, 
  MapPin, 
  Clock, 
  Shield, 
  Car, 
  Train, 
  Activity 
} from 'lucide-react';

export default function StadiumMap() {
  const [selectedStadium, setSelectedStadium] = useState<'metlife' | 'wanderers' | 'stade_de_france'>('metlife');
  const [selectedGate, setSelectedGate] = useState<string>('Gate A');
  const [selectedSection, setSelectedSection] = useState<string>('Lower Tier');

  const stadiums = {
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
        { name: "Wanderers Club Field", occupancy: "35%", status: "Open" }
      ],
      transit: "Rosebank Gautrain Station shuttle departs every 10 mins."
    },
    stade_de_france: {
      name: "Stade de France 🥇",
      city: "Saint-Denis, Paris, France",
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

  const current = stadiums[selectedStadium];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stadium Toggle Header */}
      <div className="flex flex-wrap gap-3">
        {(Object.keys(stadiums) as Array<keyof typeof stadiums>).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedStadium(key);
              setSelectedGate(stadiums[key].gates[0].name);
              setSelectedSection(stadiums[key].sections[0].name);
            }}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${
              selectedStadium === key
                ? 'bg-brand-blue text-slate-950 border-brand-blue shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {stadiums[key].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive SVG blueprint map (Col-span 7) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Map className="w-4 h-4 text-brand-blue" />
              Dynamic Seating & Entry Blueprint
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{current.city}</span>
          </div>

          {/* Blueprint Drawing */}
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
              {/* Field details */}
              <circle cx="200" cy="200" r="10" fill="none" stroke="rgba(0,212,255,0.2)" />

              {/* Seating Rings */}
              {/* VIP / Inner */}
              <circle 
                cx="200" 
                cy="200" 
                r="95" 
                fill="none" 
                stroke={selectedSection === 'VIP Suites' || selectedSection === 'Presidential Pavilion' || selectedSection === 'Official Club Loge' ? 'rgba(0,212,255,0.8)' : 'rgba(255,255,255,0.08)'} 
                strokeWidth="12" 
                className="cursor-pointer hover:stroke-brand-blue/60 transition-all"
                onClick={() => setSelectedSection(current.sections[0].name)}
              />
              {/* Lower */}
              <circle 
                cx="200" 
                cy="200" 
                r="115" 
                fill="none" 
                stroke={selectedSection.includes('Lower') || selectedSection.includes('Basse') || selectedSection.includes('Memorial') ? 'rgba(0,212,255,0.8)' : 'rgba(255,255,255,0.05)'} 
                strokeWidth="16" 
                className="cursor-pointer hover:stroke-brand-blue/60 transition-all"
                onClick={() => setSelectedSection(current.sections[1].name)}
              />
              {/* Mid */}
              <circle 
                cx="200" 
                cy="200" 
                r="140" 
                fill="none" 
                stroke={selectedSection.includes('Mid') || selectedSection.includes('Grass') || selectedSection.includes('Intermédiaire') ? 'rgba(0,212,255,0.8)' : 'rgba(255,255,255,0.03)'} 
                strokeWidth="20" 
                className="cursor-pointer hover:stroke-brand-blue/60 transition-all"
                onClick={() => setSelectedSection(current.sections[2].name)}
              />
              {/* Upper */}
              <circle 
                cx="200" 
                cy="200" 
                r="168" 
                fill="none" 
                stroke={selectedSection.includes('Upper') || selectedSection.includes('Unity') || selectedSection.includes('Haute') ? 'rgba(0,212,255,0.8)' : 'rgba(255,255,255,0.02)'} 
                strokeWidth="22" 
                className="cursor-pointer hover:stroke-brand-blue/60 transition-all"
                onClick={() => setSelectedSection(current.sections[3].name)}
              />

              {/* Gate indicators around stadium */}
              {/* Gate A (Top) */}
              <circle 
                cx="200" cy="20" r="10" 
                fill={selectedGate.includes('A') || selectedGate.includes('Main') ? '#00d4ff' : 'rgba(255,255,255,0.2)'} 
                className="cursor-pointer animate-pulse" 
                onClick={() => setSelectedGate(current.gates[0].name)}
              />
              <text x="200" y="40" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Gate 1</text>

              {/* Gate B (Right) */}
              <circle 
                cx="380" cy="200" r="10" 
                fill={selectedGate.includes('B') || selectedGate.includes('East') || selectedGate.includes('H') ? '#ffd700' : 'rgba(255,255,255,0.2)'} 
                className="cursor-pointer animate-pulse" 
                onClick={() => setSelectedGate(current.gates[1].name)}
              />
              <text x="380" y="220" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Gate 2</text>

              {/* Gate C (Bottom) */}
              <circle 
                cx="200" cy="380" r="10" 
                fill={selectedGate.includes('C') || selectedGate.includes('West') || selectedGate.includes('N') ? '#ff007f' : 'rgba(255,255,255,0.2)'} 
                className="cursor-pointer animate-pulse" 
                onClick={() => setSelectedGate(current.gates[2].name)}
              />
              <text x="200" y="370" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Gate 3</text>
            </svg>
          </div>

          {/* Interactive Legends Info */}
          <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl text-xs space-y-2 text-slate-300">
            <p><strong>💡 Stadium Blueprint Tips:</strong> Click the outer circular seat sections to view seat tier reviews, or click the pulsing outer circles (Gate 1, 2, 3) to view entrance security queue lengths.</p>
          </div>
        </div>

        {/* Gate wait times & Seating Reviews (Col-span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Gate Queue Status */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-pink" /> Entry Gate Queue Status
            </h3>
            
            <div className="space-y-3">
              {current.gates.map((g, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedGate(g.name)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedGate === g.name 
                      ? 'bg-brand-blue/10 border-brand-blue/40 text-slate-100 shadow-[0_0_10px_rgba(0,212,255,0.03)]' 
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-900'
                  } flex justify-between items-center text-xs`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200 block">{g.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Queue duration: {g.waitTime}</span>
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

          {/* Seat Quality Review */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-blue" /> Seating Section Overview
            </h3>

            <div className="space-y-3">
              {current.sections.map((s, idx) => (
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
                  <p className="text-[11px] text-slate-400 leading-relaxed">{s.view}</p>
                  <span className="text-[10px] text-slate-500 block font-mono">Price Range: {s.priceRange}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Parking & Transit Status */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-3">🚗 Parking & Public Transit</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Train className="w-4.5 h-4.5 text-brand-blue shrink-0" />
                <span><strong>Public Rail:</strong> {current.transit}</span>
              </div>
              
              <div className="border-t border-white/5 pt-3 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Parking Lot Loads</span>
                {current.parking.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-semibold">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono">{p.occupancy} Full</span>
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
  );
}
