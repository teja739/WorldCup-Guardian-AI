'use client';

import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CloudLightning, 
  Plane, 
  Clock, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface LiveAlertsProps {
  notifications: any[];
  markRead: (id?: string) => void;
  simulateDelay: () => void;
  simulateWeather: () => void;
  simulating: boolean;
}

export default function LiveAlerts({
  notifications,
  markRead,
  simulateDelay,
  simulateWeather,
  simulating
}: LiveAlertsProps) {
  
  // Dynamic Delay Propagation Chain
  // If the user clicked "Sim Delay", there is a delay in notifications. Let's inspect notifications for delayed.
  const hasDelay = notifications.some(n => n.title.toLowerCase().includes('delay') || n.message.toLowerCase().includes('delay'));
  const hasStorm = notifications.some(n => n.title.toLowerCase().includes('rain') || n.title.toLowerCase().includes('metlife') || n.message.toLowerCase().includes('rain'));

  const propagationSteps = [
    {
      label: "Storm/Delay Signal",
      desc: hasStorm ? "Severe Rain Forecast for MetLife" : hasDelay ? "Flight AI-101 Delayed 3 Hours" : "No telemetry alerts",
      status: hasStorm || hasDelay ? "triggered" : "pending",
      color: "border-brand-pink text-brand-pink bg-brand-pink/5"
    },
    {
      label: "Transit Rerouting",
      desc: hasStorm ? "Rideshare surged. NJ Transit Rail recommended" : hasDelay ? "DEL -> JFK flight landing pushed to 20:30" : "Schedules on track",
      status: hasStorm || hasDelay ? "triggered" : "pending",
      color: "border-amber-500 text-amber-500 bg-amber-500/5"
    },
    {
      label: "Hotel Check-in Sync",
      desc: hasDelay ? "citizenM check-in pushed to 21:00" : "Checked-in default",
      status: hasDelay ? "triggered" : "pending",
      color: "border-purple-500 text-purple-400 bg-purple-500/5"
    },
    {
      label: "Stadium Entry Alarm",
      desc: hasStorm ? "Stadium poncho advisory. Stay indoor until 18:30" : hasDelay ? "MetLife transit connection delayed 1h" : "Gate clear",
      status: hasStorm || hasDelay ? "triggered" : "pending",
      color: "border-cyan-500 text-brand-blue bg-brand-blue/5"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Simulation triggers block */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-brand-pink/5 via-transparent to-transparent">
        <div>
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-brand-pink animate-pulse" />
            Emergency Simulation Controllers
          </h3>
          <p className="text-xs text-slate-500 mt-1">Simulate airport and stadium weather disruptions to trigger the Emergency AI Recalculator.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={simulateDelay}
            disabled={simulating}
            className="px-4 py-2.5 rounded-xl bg-brand-pink/10 hover:bg-brand-pink/20 text-brand-pink border border-brand-pink/30 text-xs font-bold transition-all duration-200"
          >
            Simulate Flight Delay
          </button>
          <button 
            onClick={simulateWeather}
            disabled={simulating}
            className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold transition-all duration-200"
          >
            Simulate Storm Warning
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Active Alerts List (Col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-brand-pink animate-pulse" />
                Live Notification Logs
              </span>
              <button 
                onClick={() => markRead()}
                className="text-xs text-brand-blue font-bold hover:underline"
              >
                Clear All Alerts
              </button>
            </div>

            <div className="space-y-4">
              {notifications.map((notif: any) => {
                const isFlight = notif.type === 'flight';
                const isWeather = notif.type === 'weather';
                return (
                  <div 
                    key={notif._id} 
                    className={`p-4.5 rounded-2xl border flex items-start gap-4 transition-all duration-200 ${
                      notif.read ? 'bg-slate-950/45 border-white/5 text-slate-400' : 'bg-brand-pink/5 border-brand-pink/20 text-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                      isFlight ? 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue' :
                      isWeather ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      'bg-brand-pink/10 border-brand-pink/20 text-brand-pink'
                    }`}>
                      {isFlight && <Plane className="w-4 h-4" />}
                      {isWeather && <CloudLightning className="w-4 h-4" />}
                      {!isFlight && !isWeather && <AlertTriangle className="w-4 h-4" />}
                    </div>

                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">{notif.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{notif.message}</p>
                      {!notif.read && (
                        <button 
                          onClick={() => markRead(notif._id)}
                          className="text-[9px] text-brand-blue font-bold hover:underline mt-1 block"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {notifications.length === 0 && (
                <p className="text-slate-500 text-xs italic py-8 text-center">No active notifications. Telemetry is clear.</p>
              )}
            </div>
          </div>
        </div>

        {/* Delay Propagation Chain (Col-span 4) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4.5 h-4.5 text-brand-blue" />
            Delay Propagation Chain
          </h3>
          
          <div className="space-y-5 relative pl-4 border-l border-white/10 ml-2 py-1">
            {propagationSteps.map((step, idx) => {
              const isTriggered = step.status === 'triggered';
              return (
                <div key={idx} className="space-y-1 relative">
                  {/* Circle indicator */}
                  <div className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 ${
                    isTriggered ? 'bg-brand-pink border-brand-pink animate-ping' : 'bg-slate-950 border-white/20'
                  }`} />
                  <div className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 ${
                    isTriggered ? 'bg-slate-950 border-brand-pink' : 'bg-slate-950 border-white/20'
                  }`} />
                  
                  <div className={`p-3 rounded-xl border ${isTriggered ? step.color : 'bg-slate-950/20 border-white/5 text-slate-500'} text-xs space-y-0.5`}>
                    <span className={`font-bold block ${isTriggered ? 'text-slate-200' : 'text-slate-500'}`}>{step.label}</span>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
