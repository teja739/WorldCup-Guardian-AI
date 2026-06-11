'use client';

import React from 'react';
import { 
  Sparkles, 
  Bell, 
  CheckCircle2, 
  MapPin, 
  Compass, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  ShieldAlert,
  ArrowRight,
  Trophy,
  Shield,
  Play,
  Calendar
} from 'lucide-react';

interface HomeDashboardProps {
  trips: any[];
  budgets: any[];
  notifications: any[];
  events: any[];
  user: any;
  setActiveTab: (tab: string) => void;
  markRead: (id?: string) => void;
}

export default function HomeDashboard({ 
  trips, 
  budgets, 
  notifications, 
  events, 
  user, 
  setActiveTab, 
  markRead 
}: HomeDashboardProps) {
  
  const totalSpent = budgets.reduce((sum, b) => sum + b.actualCost, 0);
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.estimatedCost, 0);
  const unreadAlerts = notifications.filter(n => !n.read).length;
  const activeItinerariesCount = trips.length;

  const stats = [
    {
      label: "Active Itineraries",
      value: activeItinerariesCount,
      subtext: "Synced with MongoDB MCP",
      icon: Compass,
      gradient: "from-cyan-500/20 via-blue-600/10 to-transparent",
      borderColor: "border-cyan-500/20",
      glowColor: "shadow-cyan-500/5",
      textColor: "text-brand-blue"
    },
    {
      label: "Total Spent Tracking",
      value: `$${totalSpent.toLocaleString()}`,
      subtext: `Budget Cap: $${totalBudgetLimit.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-purple-500/20 via-pink-600/10 to-transparent",
      borderColor: "border-purple-500/20",
      glowColor: "shadow-purple-500/5",
      textColor: "text-purple-400"
    },
    {
      label: "Guardian AI Alerts",
      value: unreadAlerts,
      subtext: unreadAlerts > 0 ? "Emergency rerouting active" : "Weather/Traffic all clear",
      icon: ShieldAlert,
      gradient: "from-rose-500/20 via-red-600/10 to-transparent",
      borderColor: "border-rose-500/20",
      glowColor: "shadow-rose-500/5",
      textColor: unreadAlerts > 0 ? "text-brand-pink" : "text-slate-400"
    },
    {
      label: "Atlas Memory Nodes",
      value: "14 Nodes",
      subtext: `Focus: ${user.favoriteTeam} (${user.favoriteSport})`,
      icon: Activity,
      gradient: "from-amber-500/20 via-yellow-600/10 to-transparent",
      borderColor: "border-amber-500/20",
      glowColor: "shadow-amber-500/5",
      textColor: "text-brand-gold"
    }
  ];

  // 4 Main Sports Modules (Requirement 1 - Page 1)
  const modules = [
    {
      id: "sports_icc",
      title: "ICC Cricket World Cup 2027",
      description: "Explore host stadiums, qualified teams list, local South African Gautrain travel guidelines, and tournament news.",
      icon: Trophy,
      badge: "Coming Soon",
      badgeColor: "bg-brand-gold/15 text-brand-gold border-brand-gold/30",
      glow: "hover:border-brand-gold/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.05)]",
      borderColor: "border-white/5",
      cta: "Open Tournament Hub",
      iconColor: "text-brand-gold"
    },
    {
      id: "sports_fifa",
      title: "FIFA World Cup & Competitions",
      description: "Live real-time FIFA match feeds, upcoming schedules, group statistics, and regional MetLife/SoFi stadium maps.",
      icon: Shield,
      badge: "Official APIs",
      badgeColor: "bg-brand-blue/15 text-brand-blue border-brand-blue/30",
      glow: "hover:border-brand-blue/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.05)]",
      borderColor: "border-white/5",
      cta: "Open FIFA Hub",
      iconColor: "text-brand-blue"
    },
    {
      id: "sports_cricket",
      title: "Cricket Hub Analytics",
      description: "Dynamic scoreboard feeds for Test, ODI, and T20I matches. Integrated ticket pricing watchdog and telemetry alerts.",
      icon: Activity,
      badge: "Real-time Polling",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      glow: "hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)]",
      borderColor: "border-white/5",
      cta: "Open Cricket Hub",
      iconColor: "text-emerald-400"
    },
    {
      id: "sports_live",
      title: "Live Sports Overview",
      description: "Consolidated match schedules, score ticker, active warnings, and general sports calendar updates.",
      icon: Play,
      badge: "Live Telemetry",
      badgeColor: "bg-brand-pink/15 text-brand-pink border-brand-pink/30",
      glow: "hover:border-brand-pink/30 hover:shadow-[0_0_20px_rgba(255,0,127,0.05)]",
      borderColor: "border-white/5",
      cta: "View Live Matches",
      iconColor: "text-brand-pink"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* 4 Sports Modules Landing Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-white">
          <Sparkles className="w-4.5 h-4.5 text-brand-blue animate-pulse" />
          Active Sports Portals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className={`glass-panel p-6 rounded-3xl border ${m.borderColor} ${m.glow} cursor-pointer transition-all duration-300 flex flex-col justify-between bg-slate-900/10 h-48`}
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${m.iconColor}`} />
                      <span className="font-bold text-sm text-slate-100">{m.title}</span>
                    </div>
                    <span className={`text-[9px] border px-2.5 py-0.5 rounded-full font-mono font-black uppercase tracking-wider ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{m.description}</p>
                </div>

                <div className="flex justify-end items-center text-[10px] text-brand-blue font-bold tracking-wider uppercase group pt-2 border-t border-white/5">
                  <span className="mr-1 hover:mr-2 transition-all">{m.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Statistics Grid */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Dashboard Telemetry Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className={`glass-panel p-5 rounded-2xl border ${stat.borderColor} bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.glowColor} flex flex-col justify-between h-32 hover:scale-[1.02] transition-all duration-200`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-slate-950/80 border ${stat.borderColor}`}>
                    <Icon className={`w-4 h-4 ${stat.textColor}`} />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold tracking-tight text-white block mt-1">
                    {stat.value}
                  </span>
                  <span className="text-[9px] text-slate-500 block font-mono mt-0.5">
                    {stat.subtext}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Trip & Safety Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Trip Overview Segment */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Travel Plans</h3>
            {trips.length > 0 && (
              <button 
                onClick={() => setActiveTab('trips')} 
                className="text-xs text-brand-blue hover:underline font-semibold flex items-center gap-1"
              >
                Go to Planner <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {trips.length > 0 ? (
            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4 bg-slate-900/10">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] text-brand-blue font-bold uppercase tracking-wider font-mono">
                  Current Itinerary
                </span>
                <h4 className="text-md font-bold text-white mt-0.5">
                  Trip to {trips[0].destination} &bull; <span className="text-xs text-slate-400 font-normal">{trips[0].event}</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trips[0].itinerary.slice(0, 4).map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between text-[9px] font-mono">
                      <span className="text-brand-blue font-bold">DAY {item.day}</span>
                      <span className="text-slate-500 font-bold">{item.time}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-200 block truncate">{item.title}</span>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-sans">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center text-slate-500 text-xs italic">
              No active travel plans found. Select a match from Sports Hub to plan travel instantly.
            </div>
          )}
        </div>

        {/* Right Column - Live Alerts Ticker */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-brand-pink" />
              Live Safety Feed
            </h3>
            <button 
              onClick={() => setActiveTab('alerts')} 
              className="text-xs text-slate-500 hover:text-slate-300 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 3).map((notif: any) => (
              <div 
                key={notif._id} 
                className={`p-4 rounded-xl border ${
                  notif.read 
                    ? 'bg-slate-950/40 border-white/5 text-slate-400' 
                    : 'bg-brand-pink/5 border-brand-pink/20 text-slate-200 shadow-[0_0_15px_rgba(255,0,127,0.03)]'
                } transition-all duration-200 text-xs leading-relaxed`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block text-white">{notif.title}</span>
                    <span className="text-[9px] text-slate-500 font-mono block">
                      {new Date(notif.createdAt).toLocaleTimeString()} &bull; {notif.type}
                    </span>
                  </div>
                  {!notif.read && (
                    <button 
                      onClick={() => markRead(notif._id)} 
                      className="text-[9px] text-brand-blue font-bold uppercase hover:underline"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-sans">
                  {notif.message}
                </p>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="glass-panel p-6 rounded-xl border border-white/5 text-center text-slate-500 text-xs">
                Perfect weather conditions. Flight routes on time.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
