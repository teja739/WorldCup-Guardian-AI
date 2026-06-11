'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Home, 
  Terminal, 
  Compass, 
  DollarSign, 
  Calendar, 
  Map, 
  Ticket, 
  Bell, 
  Users, 
  TrendingUp, 
  Brain, 
  CloudLightning, 
  Bookmark, 
  User, 
  Settings, 
  Layers, 
  LogOut,
  ChevronDown,
  ChevronUp,
  Trophy,
  Play,
  Activity
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  notifications: any[];
  logout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, notifications, logout }: SidebarProps) {
  const unreadCount = notifications.filter(n => !n.read).length;
  const [sportsExpanded, setSportsExpanded] = useState(true);

  const coreItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'agent', label: 'AI Command Center', icon: Terminal },
    { id: 'trips', label: 'AI Travel Planner', icon: Compass },
    { id: 'budgets', label: 'Expense Tracker', icon: DollarSign },
  ];

  const sportsItems = [
    { id: 'sports_icc', label: 'World Cup 2027', icon: Trophy },
    { id: 'sports_fifa', label: 'FIFA Hub', icon: Shield },
    { id: 'sports_cricket', label: 'Cricket Hub', icon: Activity },
    { id: 'sports_live', label: 'Live Matches', icon: Play },
    { id: 'sports_upcoming', label: 'Upcoming Fixtures', icon: Calendar },
    { id: 'sports_stadium', label: 'Stadium Guide', icon: Map },
    { id: 'sports_tickets', label: 'Ticket Watchlist', icon: Ticket },
  ];

  const otherItems = [
    { id: 'events', label: 'Match Calendar', icon: Calendar },
    { id: 'alerts', label: 'Live Alerts', icon: Bell, badge: unreadCount },
    { id: 'weather_traffic', label: 'Weather & Traffic', icon: CloudLightning },
  ];

  const isSportsActive = activeTab.startsWith('sports_');

  return (
    <aside className="w-full md:w-72 bg-slate-950/90 border-r border-white/5 flex flex-col justify-between p-5 z-20 shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-purple-600 flex items-center justify-center border border-brand-blue/30 pulse-glow">
              <Shield className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <span className="text-sm font-black tracking-wider font-display text-white">
                GUARDIAN <span className="text-brand-blue">AI</span>
              </span>
              <span className="block text-[9px] text-slate-500 font-mono">MongoDB MCP Memory</span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="space-y-4">
          
          {/* Core Platform Section */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 block">
              Core Platform
            </span>
            <div className="space-y-0.5">
              {coreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-brand-blue/10 text-brand-blue border-l-2 border-brand-blue' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-blue' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible Sports Hub Section */}
          <div className="space-y-1">
            <button
              onClick={() => setSportsExpanded(!sportsExpanded)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-250 ${
                isSportsActive 
                  ? 'text-brand-blue' 
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-brand-gold animate-pulse" />
                <span>Sports Hub</span>
              </div>
              {sportsExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {sportsExpanded && (
              <div className="pl-4 border-l border-white/5 ml-4.5 mt-1 space-y-0.5 animate-fadeIn">
                {sportsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive 
                          ? 'bg-brand-blue/10 text-brand-blue font-bold border-l-2 border-brand-blue' 
                          : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-blue' : 'text-slate-600'}`} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Live Telemetry Section */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 block">
              Live Telemetry
            </span>
            <div className="space-y-0.5">
              {otherItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-brand-blue/10 text-brand-blue border-l-2 border-brand-blue' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-blue' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="w-5 h-5 rounded-full bg-brand-pink text-[9px] text-white flex items-center justify-center font-bold animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Preferences Section */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 block">
              Preferences
            </span>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeTab === 'profile' 
                    ? 'bg-brand-blue/10 text-brand-blue border-l-2 border-brand-blue' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-brand-blue' : 'text-slate-500'}`} />
                  <span>User Profile</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeTab === 'settings' 
                    ? 'bg-brand-blue/10 text-brand-blue border-l-2 border-brand-blue' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-brand-blue' : 'text-slate-500'}`} />
                  <span>System Settings</span>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Area with Judge Demo Page Trigger & User Card */}
      <div className="border-t border-white/5 pt-4 mt-6 space-y-4">
        {/* Judge Demo Page Shortcut */}
        <button
          onClick={() => setActiveTab('judge_demo')}
          className={`w-full py-3 rounded-xl border font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'judge_demo'
              ? 'bg-brand-gold text-slate-950 border-brand-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]'
              : 'bg-brand-gold/10 border-brand-gold/30 text-brand-gold hover:bg-brand-gold/20'
          }`}
        >
          <Layers className="w-4 h-4" />
          JUDGE DEMO PORTAL
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img 
              src={user.picture} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full object-cover border border-brand-blue/20 shrink-0" 
            />
            <div className="overflow-hidden">
              <span className="text-xs font-bold block text-slate-200 truncate">{user.name}</span>
              <span className="text-[9px] text-slate-500 block truncate">{user.email}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-pink hover:bg-white/5 transition-all"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
