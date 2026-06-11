'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Sparkles, 
  Volume2, 
  Lock, 
  Eye, 
  Code, 
  Paintbrush,
  LogOut
} from 'lucide-react';

export default function SettingsView({ logout }: { logout?: () => void }) {
  const [developerMode, setDeveloperMode] = useState(true);
  const [mockDb, setMockDb] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<'blue' | 'green' | 'purple'>('blue');
  const [volume, setVolume] = useState(60);

  const themes = [
    { id: 'blue', label: 'Blue Laser (Default)', color: 'bg-brand-blue' },
    { id: 'green', label: 'Green Pitch (Stadium)', color: 'bg-emerald-500' },
    { id: 'purple', label: 'Purple Nebula (Space)', color: 'bg-purple-600' }
  ];

  return (
    <div className="max-w-2xl glass-panel p-6 rounded-3xl border border-white/5 space-y-6 animate-fadeIn">
      <h3 className="text-md font-bold text-white border-b border-white/5 pb-3 flex items-center gap-1.5">
        <Settings className="w-4.5 h-4.5 text-brand-blue" />
        System Configuration Control
      </h3>

      <div className="space-y-6 text-xs text-slate-300">
        
        {/* Theme select */}
        <div className="space-y-2.5">
          <span className="font-bold text-slate-400 block uppercase tracking-wider flex items-center gap-1.5">
            <Paintbrush className="w-4 h-4 text-brand-blue" /> Accent Color Presets
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTheme(t.id as any)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all duration-200 ${
                  selectedTheme === t.id 
                    ? 'bg-white/5 border-brand-blue text-white shadow-[0_0_10px_rgba(0,212,255,0.03)]' 
                    : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${t.color} shrink-0`} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio settings */}
        <div className="space-y-2 border-t border-white/5 pt-4">
          <span className="font-bold text-slate-400 block uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-brand-blue" /> Alert Volume & Notifications
          </span>
          <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span>Primary alarm volume</span>
              <span className="font-mono">{volume}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-brand-blue" 
            />
          </div>
        </div>

        {/* Developer toggles */}
        <div className="space-y-3 border-t border-white/5 pt-4">
          <span className="font-bold text-slate-400 block uppercase tracking-wider flex items-center gap-1.5">
            <Code className="w-4 h-4 text-brand-blue" /> Developer Mode Options
          </span>
          
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-200 block">Debug Logging Console</span>
                <span className="text-[10px] text-slate-500 block leading-relaxed font-sans">
                  Logs raw JSON structures, MongoDB schemas, and Google OAuth credentials in real-time.
                </span>
              </div>
              <input 
                type="checkbox" 
                checked={developerMode}
                onChange={(e) => setDeveloperMode(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-white/10 bg-white/5 text-brand-blue focus:ring-brand-blue accent-brand-blue"
              />
            </div>

            <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-200 block">Atlas MCP Mock Fallback Bypassing</span>
                <span className="text-[10px] text-slate-500 block leading-relaxed font-sans">
                  Permits local routing bypassing if MongoAtlas is unavailable. Active by default.
                </span>
              </div>
              <input 
                type="checkbox" 
                checked={mockDb}
                onChange={(e) => setMockDb(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-white/10 bg-white/5 text-brand-blue focus:ring-brand-blue accent-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="space-y-2 border-t border-white/5 pt-4">
          <span className="font-bold text-slate-400 block uppercase tracking-wider flex items-center gap-1.5">
            <LogOut className="w-4 h-4 text-brand-pink" /> Session Management
          </span>
          <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-200 block">Sign Out of Account</span>
              <span className="text-[10px] text-slate-500 block leading-relaxed">
                Clears your local JWT session token and returns to the authentication portal.
              </span>
            </div>
            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-brand-pink/10 shrink-0 animate-pulse-subtle"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
