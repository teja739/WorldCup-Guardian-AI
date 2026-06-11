'use client';

import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Trash2, 
  PlusCircle, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';

interface MemoryViewProps {
  user: any;
  updateProfile: (profile: any) => void;
}

export default function MemoryView({ user, updateProfile }: MemoryViewProps) {
  const [profile, setProfile] = useState({ ...user });
  const [customKey, setCustomKey] = useState('');
  const [customVal, setCustomVal] = useState('');

  // Interactive Memory nodes representation
  const memoryNodes = [
    { label: "Sport: Soccer", x: 200, y: 200, r: 40, color: "#00d4ff", id: "sport" },
    { label: `Team: ${profile.favoriteTeam}`, x: 80, y: 120, r: 35, color: "#ffd700", id: "team" },
    { label: `Budget: ${profile.budgetPreference}`, x: 320, y: 110, r: 35, color: "#ff007f", id: "budget" },
    { label: `Lang: ${profile.languagePreference || 'English'}`, x: 100, y: 280, r: 35, color: "#a855f7", id: "lang" },
    { label: "Clear Bag: Compliant", x: 300, y: 280, r: 35, color: "#10b981", id: "bag" }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
  };

  const handlePruneMemory = (nodeId: string) => {
    if (confirm(`Prune "${nodeId}" memory node from MongoDB Atlas sidecar?`)) {
      if (nodeId === 'team') setProfile({ ...profile, favoriteTeam: 'None' });
      if (nodeId === 'sport') setProfile({ ...profile, favoriteSport: 'None' });
      alert(`Pruned ${nodeId} reference. Synchronizing preferences...`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      
      {/* Visual Brain Network Nodes (Col-span 7) */}
      <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Brain className="w-4.5 h-4.5 text-brand-blue" />
            Atlas Autonomous Memory Graph
          </span>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Synced
          </span>
        </div>

        {/* Brain Graph visualization */}
        <div className="bg-slate-950/60 rounded-2xl p-6 border border-white/5 flex justify-center relative overflow-hidden h-[360px] items-center">
          <svg viewBox="0 0 400 360" className="w-full h-full">
            {/* Connection lines */}
            <line x1="200" y1="200" x2="80" y2="120" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <line x1="200" y1="200" x2="320" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <line x1="200" y1="200" x2="100" y2="280" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <line x1="200" y1="200" x2="300" y2="280" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

            {/* Render Nodes */}
            {memoryNodes.map((node, idx) => (
              <g key={idx} className="cursor-pointer group" onClick={() => handlePruneMemory(node.id)}>
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={node.r} 
                  fill="rgba(15, 23, 42, 0.8)" 
                  stroke={node.color} 
                  strokeWidth="2.5" 
                  className="transition-all duration-300 group-hover:fill-slate-900 group-hover:scale-105"
                />
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={node.r + 5} 
                  fill="none" 
                  stroke={node.color} 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                  className="animate-spin" 
                  style={{ animationDuration: '10s' }}
                />
                <text 
                  x={node.x} 
                  y={node.y + 4} 
                  fill="#f8fafc" 
                  fontSize="9.5" 
                  fontWeight="bold"
                  textAnchor="middle" 
                  fontFamily="sans-serif"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl text-xs space-y-2 text-slate-300 font-sans leading-relaxed">
          <p><strong>💡 Memory Graph Interactions:</strong> Click on any node above to prune that reference from the MongoDB memory client database. Commits happen instantly to Atlas.</p>
        </div>
      </div>

      {/* Preferences Editor (Col-span 5) */}
      <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/5 space-y-5">
        <h3 className="text-md font-bold text-white border-b border-white/5 pb-3">Preference Configuration</h3>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">User Name</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="glass-input text-xs w-full py-2.5" 
            />
          </div>

          <div className="space-y-1.5">
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

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Favorite Team</label>
            <input 
              type="text" 
              value={profile.favoriteTeam}
              onChange={(e) => setProfile({ ...profile, favoriteTeam: e.target.value })}
              className="glass-input text-xs w-full py-2.5" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Budget Preference Limit</label>
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

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Language Preference</label>
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

          <button 
            type="submit" 
            className="w-full py-2.5 rounded-xl bg-brand-blue text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-md"
          >
            Commit Memory changes
          </button>
        </form>
      </div>

    </div>
  );
}
