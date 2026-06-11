'use client';

import React from 'react';
import { 
  BarChart3, 
  Leaf, 
  Compass, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-react';

export default function AnalyticsDashboard() {
  
  // Custom travel metrics mock
  const carbonTons = 1.45;
  const milesSaved = 820;
  const transitSavings = 145;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">CO2 Carbon Footprint</span>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-white block mt-2">{carbonTons} Tons CO2</span>
            <span className="text-[10px] text-slate-500 block font-mono mt-1">Offset program: 15% contributing</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-cyan-500/10 to-transparent flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Transit Miles Logged</span>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-brand-blue">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-white block mt-2">7,850 Miles</span>
            <span className="text-[10px] text-slate-500 block font-mono mt-1">Flights DEL {"\u2192"} JFK, JFK {"\u2192"} CDG</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Transit Cost Savings</span>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-purple-500/20 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-emerald-400 block mt-2">${transitSavings} Saved</span>
            <span className="text-[10px] text-slate-500 block font-mono mt-1">Via local trains over taxi surge</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SVG Pricing Volatility Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4.5 h-4.5 text-brand-blue" />
              14-Day Match Ticket Price Index
            </h3>
            <span className="text-[9px] bg-slate-950 border border-white/5 px-2.5 py-0.5 rounded font-mono text-slate-500 uppercase">
              FIFA NYC Final
            </span>
          </div>

          <div className="h-64 bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between relative">
            <div className="absolute top-3 right-3 text-[10px] text-brand-pink font-semibold flex items-center gap-0.5">
              Price Volatility: High <ArrowUpRight className="w-3.5 h-3.5 text-brand-pink" />
            </div>
            
            {/* SVG Graph */}
            <div className="w-full h-40 pt-4 relative">
              {/* grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-white/20 w-full" />
                <div className="border-b border-white/20 w-full" />
                <div className="border-b border-white/20 w-full" />
                <div className="border-b border-white/20 w-full" />
              </div>
              <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                <path 
                  d="M 10 90 L 50 85 L 90 95 L 130 60 L 170 65 L 210 30 L 250 45 L 290 10" 
                  fill="none" 
                  stroke="#00d4ff" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
                <path 
                  d="M 10 90 L 50 85 L 90 95 L 130 60 L 170 65 L 210 30 L 250 45 L 290 10 L 290 120 L 10 120 Z" 
                  fill="url(#grad-blue)" 
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="grad-blue" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Labels */}
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Day 1</span>
              <span>Day 4</span>
              <span>Day 7</span>
              <span>Day 10</span>
              <span>Day 14</span>
            </div>
          </div>
        </div>

        {/* Carbon offsetting options */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
            AI Carbon Offset Engine
          </h3>
          
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Guardian AI calculates carbon emissions based on aircraft flight sectors, hotel nights, and ground transit models. You can fund tree planting offsets automatically via verified carbon standard projects.
          </p>

          <div className="space-y-3 pt-1 text-xs">
            <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">Amazon Reforestation Project</span>
                <span className="text-[10px] text-slate-500">Gold Standard Carbon Offset</span>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] transition-all">
                Contribute $12
              </button>
            </div>

            <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">Wind Power Clean Grid Project</span>
                <span className="text-[10px] text-slate-500">UNFCCC Certified credits</span>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] transition-all">
                Contribute $8
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
