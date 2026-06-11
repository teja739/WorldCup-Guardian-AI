'use client';

import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Settings, 
  Activity, 
  Calendar, 
  Save 
} from 'lucide-react';

interface ProfileViewProps {
  user: any;
  updateProfile: (profile: any) => void;
}

export default function ProfileView({ user, updateProfile }: ProfileViewProps) {
  const [profile, setProfile] = useState({ ...user });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      
      {/* Account Settings Form (Col-span 7) */}
      <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
        <h3 className="text-md font-bold text-white border-b border-white/5 pb-3 flex items-center gap-1.5">
          <Settings className="w-4.5 h-4.5 text-brand-blue" />
          Edit Profile Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Display Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="glass-input text-xs w-full py-2.5" 
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
              <input 
                type="email" 
                value={profile.email}
                className="glass-input text-xs w-full py-2.5 opacity-60 cursor-not-allowed" 
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Favorite Sport</label>
              <select 
                value={profile.favoriteSport}
                onChange={(e) => setProfile({ ...profile, favoriteSport: e.target.value })}
                className="glass-input text-xs w-full py-2.5"
              >
                <option value="Soccer">Soccer / Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Olympics">Olympics</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Favorite Sports Team</label>
              <input 
                type="text" 
                value={profile.favoriteTeam}
                onChange={(e) => setProfile({ ...profile, favoriteTeam: e.target.value })}
                className="glass-input text-xs w-full py-2.5" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Budget Tier Parameter</label>
              <select 
                value={profile.budgetPreference}
                onChange={(e) => setProfile({ ...profile, budgetPreference: e.target.value })}
                className="glass-input text-xs w-full py-2.5"
              >
                <option value="Budget">Budget Friendly (Under $2000)</option>
                <option value="Moderate">Moderate (Under $5000)</option>
                <option value="Premium">Premium Luxury (No Limit)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">System Language</label>
              <select 
                value={profile.languagePreference || 'English'}
                onChange={(e) => setProfile({ ...profile, languagePreference: e.target.value })}
                className="glass-input text-xs w-full py-2.5"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 rounded-xl bg-brand-blue text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            <Save className="w-4 h-4 text-slate-950" />
            Save Changes
          </button>
        </form>
      </div>

      {/* Access History Logs (Col-span 5) */}
      <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
          <Activity className="w-4.5 h-4.5 text-brand-blue" />
          Authentication History Logs
        </h3>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {profile.loginHistory && profile.loginHistory.length > 0 ? (
            profile.loginHistory.slice().reverse().map((log: any, idx: number) => (
              <div key={idx} className="bg-slate-950/40 p-3 rounded-xl border border-white/5 flex justify-between text-[10px] text-slate-400 font-mono leading-relaxed">
                <div className="space-y-0.5 overflow-hidden">
                  <span className="text-slate-300 block">IP: {log.ip || '127.0.0.1'}</span>
                  <span className="block truncate text-slate-500 max-w-[150px] sm:max-w-[200px]">Agent: {log.userAgent || 'Mozilla/Chrome'}</span>
                </div>
                <div className="text-right shrink-0">
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic py-4">No historical logs parsed.</p>
          )}
        </div>
      </div>

    </div>
  );
}
