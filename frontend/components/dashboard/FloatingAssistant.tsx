'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Terminal, 
  Mic, 
  Loader2, 
  CornerDownLeft 
} from 'lucide-react';

interface FloatingAssistantProps {
  chatInput: string;
  setChatInput: (val: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isThinking: boolean;
  agentResponse: string;
  agentSteps: any[];
}

export default function FloatingAssistant({
  chatInput,
  setChatInput,
  handleSubmit,
  isThinking,
  agentResponse,
  agentSteps
}: FloatingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-blue to-purple-600 border border-brand-blue/30 flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all duration-300 pulse-glow"
        >
          <MessageSquare className="w-5 h-5 text-slate-950" />
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="w-[360px] h-[480px] glass-panel rounded-2xl border border-white/10 flex flex-col justify-between p-4 shadow-2xl relative overflow-hidden animate-fadeIn">
          {/* Top Line decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue to-purple-600" />
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold text-white block">Guardian AI Quick-Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Logs Screen */}
          <div className="flex-grow py-3 overflow-y-auto space-y-4">
            {!agentResponse && !isThinking ? (
              <div className="text-center py-8 space-y-2 text-slate-500 text-xs leading-relaxed font-sans">
                <p>Hello! I am your Guardian travel companion.</p>
                <p className="text-[10px]">Type below to plan flights, analyze weather alarms, or split bills instantly.</p>
              </div>
            ) : null}

            {isThinking && (
              <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-mono bg-slate-950/40 p-3 rounded-lg border border-white/5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
                <span>Thinking...</span>
              </div>
            )}

            {agentSteps.length > 0 && isThinking && (
              <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-white/5 text-[9px] font-mono text-slate-500">
                <span className="font-bold text-slate-400 block uppercase mb-1">Execution Nodes</span>
                {agentSteps.slice(-1).map((s, idx) => (
                  <div key={idx} className="truncate">
                    &gt; {s.title}: {s.description}
                  </div>
                ))}
              </div>
            )}

            {agentResponse && (
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] font-mono leading-relaxed text-slate-300 whitespace-pre-wrap max-h-[280px] overflow-y-auto">
                <span className="text-brand-blue block mb-1 font-bold text-[9px] uppercase tracking-wider">[AGENT LOG]</span>
                {agentResponse}
              </div>
            )}
          </div>

          {/* Form input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }} 
            className="flex gap-2 border-t border-white/5 pt-3"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Guardian..."
              className="flex-grow glass-input text-xs py-2 px-3 rounded-lg"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={isThinking}
              className="p-2.5 rounded-lg bg-brand-blue text-slate-950 hover:text-white font-bold text-xs disabled:opacity-50 transition-all flex items-center justify-center shrink-0"
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
