'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Terminal, 
  Database, 
  ShieldAlert, 
  TrendingUp, 
  Plane, 
  Bell, 
  ArrowRight,
  Play 
} from 'lucide-react';

export default function JudgeDemo() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  const nodes = [
    {
      id: 1,
      title: "User Request",
      tech: "Next.js Web UI",
      desc: "User submits travel prompt in natural language (e.g. 'Plan a soccer trip to MetLife').",
      schema: {
        method: "POST",
        endpoint: "/api/agent/chat",
        payload: { message: "I am traveling from India to watch the FIFA World Cup Final." }
      },
      icon: Terminal
    },
    {
      id: 2,
      title: "AI Planning Core",
      tech: "Gemini 1.5 & Cloud Agent Builder",
      desc: "Gemini Generative model parses intent, extracts target cities/events, and coordinates thinking cycles.",
      schema: {
        model: "gemini-1.5-flash",
        temperature: 0.1,
        systemInstruction: "You are the WorldCup Guardian AI, coordinating flights, lodging, and safety alarms..."
      },
      icon: Sparkles
    },
    {
      id: 3,
      title: "Tool Calls",
      tech: "Gemini Function Calling",
      desc: "AI triggers autonomous function definitions to read schedules, query flight rates, and fetch hotel catalogs.",
      schema: {
        tools: [
          { name: "save_user_profile", parameters: { userId: "string", favoriteTeam: "string" } },
          { name: "save_itinerary", parameters: { userId: "string", destination: "string", itinerary: "array" } }
        ]
      },
      icon: Layers
    },
    {
      id: 4,
      title: "MongoDB MCP",
      tech: "Model Context Protocol Sidecar",
      desc: "Atlas connector writes preferences, logged trips, and split debts directly to the MongoDB collections.",
      schema: {
        port: 5000,
        mongoUri: "mongodb+srv://worldcup_guardian",
        schemas: ["UserSchema", "TripSchema", "BudgetSchema"]
      },
      icon: Database
    },
    {
      id: 5,
      title: "Expense Engine",
      tech: "Smart Split Calculator",
      desc: "Allocates estimated budgets, itemizes cost structures, and splits balances equally among travel buddies.",
      schema: {
        splitsCalculator: "(Total cost) / (Group members + 1)",
        categories: ["flight", "hotel", "food", "transport", "tickets", "emergency"]
      },
      icon: TrendingUp
    },
    {
      id: 6,
      title: "Travel Planning",
      tech: "Itinerary Compiler",
      desc: "Generates custom day-by-day active timeline files, meeting zones, and transport connections.",
      schema: {
        startDate: "Date.now() + 15 Days",
        days: 5,
        defaultCheckpoints: ["Hotel Lobby Meeting", "Stadium Entry Gate Shuttle"]
      },
      icon: Plane
    },
    {
      id: 7,
      title: "Live Alerts Feed",
      tech: "Emergency Recalculator Alarms",
      desc: "Monitors stadium storms and airport reschedules, executing delay propagation rerouting alerts.",
      schema: {
        triggers: ["Simulate Flight Delay", "Simulate Weather Alert"],
        propagationChain: ["Delay Signal", "Transit Reroute", "Hotel Delay Check-in", "Poncho Advisory"]
      },
      icon: Bell
    }
  ];

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationLogs([]);
    setActiveNode(1);

    const logs = [
      "[1] User Query Received: 'Plan a soccer trip to MetLife NYC'",
      "[2] Gemini 1.5 Parser: Extracted sport='Soccer', city='New York', event='FIFA 2026'",
      "[3] Function Calls Triggered: search_flights(), find_hotels_near_stadium()",
      "[4] MongoDB MCP Sidecar: Committed profile preferences, created Trip Document",
      "[5] Expense Split Engine: Assigned $4,500 budget cap, mapped category shares",
      "[6] Itinerary Compiler: Day 1-5 active schedule created. citizenM check-in locked",
      "[7] Alert Monitoring: Connected MetLife weather radar telemetry. Alarm armed."
    ];

    let current = 1;
    const interval = setInterval(() => {
      setSimulationLogs(prev => [...prev, logs[current - 1]]);
      current += 1;
      setActiveNode(current);
      if (current > nodes.length) {
        clearInterval(interval);
        setIsSimulating(false);
        setActiveNode(null);
      }
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      
      {/* Node Pipeline flow diagram (Col-span 7) */}
      <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div>
            <span className="text-[9px] text-brand-blue font-bold uppercase tracking-widest font-mono block">Judging Demo Panel</span>
            <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-blue" />
              Full Stack AI Pipeline Graph
            </h3>
          </div>
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-4 py-2 rounded-xl bg-brand-gold text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,215,0,0.15)]"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            Run System Trace
          </button>
        </div>

        {/* Nodes Grid */}
        <div className="relative py-4 space-y-4">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isHighlighted = activeNode === node.id;
            return (
              <div key={node.id} className="relative">
                {/* Arrow Connector line */}
                {index < nodes.length - 1 && (
                  <div className="absolute left-7 top-14 bottom-0 w-0.5 bg-white/5 z-0" />
                )}

                <div 
                  onClick={() => setActiveNode(node.id)}
                  className={`p-4 rounded-2xl border cursor-pointer relative z-10 transition-all duration-300 flex items-start gap-4 ${
                    isHighlighted 
                      ? 'bg-brand-blue/15 border-brand-blue text-slate-100 shadow-[0_0_20px_rgba(0,212,255,0.08)] scale-[1.01]' 
                      : 'bg-slate-950/45 border-white/5 text-slate-400 hover:bg-slate-900/60'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                    isHighlighted ? 'bg-brand-blue/20 border-brand-blue text-brand-blue' : 'bg-slate-900 border-white/5 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-200">{node.title}</span>
                      <span className="text-[9px] text-slate-500 font-mono">({node.tech})</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-sans">{node.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Expand Node Details console (Col-span 5) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Node JSON details */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Node Integration Details
          </h3>

          {activeNode ? (
            <div className="space-y-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200">{nodes[activeNode - 1].title} Details</span>
                <span className="text-[9px] text-slate-500 font-mono">Component: {nodes[activeNode - 1].tech}</span>
              </div>
              
              <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5 text-[10px] font-mono leading-relaxed text-brand-blue overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(nodes[activeNode - 1].schema, null, 2)}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed italic py-4">
              Click any node in the pipeline graph on the left to view active integration schemas, payloads, and parameter definitions.
            </p>
          )}
        </div>

        {/* Live Simulation Logs console */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-brand-gold" />
            System Simulation Trace Logs
          </h3>

          <div className="bg-slate-950/80 p-4.5 rounded-xl border border-white/5 h-48 overflow-y-auto space-y-2 text-[10px] font-mono text-slate-300">
            {simulationLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed border-b border-white/5 pb-1 last:border-0">
                <span className="text-brand-gold font-bold">INFO</span> {log}
              </div>
            ))}
            {simulationLogs.length === 0 && (
              <p className="text-slate-600 italic">Click "Run System Trace" above to animate the active data flow pipeline.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
