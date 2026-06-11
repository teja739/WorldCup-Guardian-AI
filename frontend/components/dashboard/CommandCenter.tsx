'use client';

import React from 'react';
import { 
  Terminal, 
  Mic, 
  Volume2, 
  Loader2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  CornerDownLeft 
} from 'lucide-react';

interface CommandCenterProps {
  chatInput: string;
  setChatInput: (val: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isThinking: boolean;
  agentResponse: string;
  agentSteps: any[];
  voiceEnabled: boolean;
  setVoiceEnabled: (val: boolean) => void;
  handleSpeechInput: () => void;
}

export default function CommandCenter({
  chatInput,
  setChatInput,
  handleSubmit,
  isThinking,
  agentResponse,
  agentSteps,
  voiceEnabled,
  setVoiceEnabled,
  handleSpeechInput
}: CommandCenterProps) {

  const quickPrompts = [
    "I am traveling from India to watch the FIFA World Cup Final.",
    "Plan a cricket trip to Johannesburg for India vs Australia match.",
    "Find cheap hotels near MetLife Stadium NYC.",
    "Log custom split expense: $180 dinner at Katz's with friends."
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      
      {/* Chat / Terminal console (Col-span 8) */}
      <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-white/5 space-y-6 min-h-[520px] flex flex-col justify-between">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="text-sm font-bold text-white block">Autonomous Travel Agent Console</span>
                <span className="text-[10px] text-slate-500 block font-mono">Gemini-1.5-flash &bull; MongoDB Atlas sidecar</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-xl border transition-all duration-200 ${
                  voiceEnabled 
                    ? 'bg-brand-blue/20 border-brand-blue text-brand-blue' 
                    : 'bg-slate-900 border-white/5 text-slate-500'
                }`}
                title="Toggle Voice Output"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button 
                onClick={handleSpeechInput}
                className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all duration-200"
                title="Voice Dictation"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Log Output */}
          <div className="space-y-6">
            {!agentResponse && !isThinking ? (
              <div className="space-y-6 py-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,212,255,0.08)]">
                  <Terminal className="w-6 h-6 text-brand-blue" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="font-bold text-white text-sm">Interactive AI Agent Core</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    Execute travel planning instructions, coordinate flight routing, split group bills, and set weather alerts by typing below.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-4 text-left">
                  {quickPrompts.map((prompt, pIdx) => (
                    <button 
                      key={pIdx}
                      onClick={() => setChatInput(prompt)}
                      className="p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 text-[11px] font-semibold text-slate-400 hover:text-slate-200 border border-white/5 hover:border-brand-blue/20 transition-all duration-200 leading-relaxed"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {isThinking && (
              <div className="flex items-center gap-3 text-slate-400 text-xs font-mono bg-slate-950/60 p-4 rounded-xl border border-white/5">
                <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                <span>[PROCESS] Gemini reasoning loops analyzing sports events, flight schedules, and budget limits...</span>
              </div>
            )}

            {agentResponse && (
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 text-xs font-mono leading-relaxed text-slate-300 whitespace-pre-wrap shadow-inner max-h-[350px] overflow-y-auto">
                <span className="text-brand-blue block mb-2 font-bold uppercase font-sans tracking-widest text-[9px]">[AGENT RESPONSE LOG]</span>
                {agentResponse}
              </div>
            )}
          </div>
        </div>

        {/* Input box */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }} 
          className="flex gap-2 pt-6 border-t border-white/5"
        >
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type command (e.g. Plan trip to watch cricket, split Uber split...)" 
            className="flex-grow glass-input text-xs"
            disabled={isThinking}
          />
          <button 
            id="ask-agent-submit-btn"
            type="submit" 
            disabled={isThinking}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-purple-600 text-slate-950 hover:text-white font-bold text-xs disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,212,255,0.1)]"
          >
            {isThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CornerDownLeft className="w-3.5 h-3.5" />}
            <span>Execute</span>
          </button>
        </form>

      </div>

      {/* Execution Tracker Steps (Col-span 4) */}
      <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-brand-blue" />
          AI Execution Steps
        </h3>

        <div className="space-y-4">
          {agentSteps.length > 0 ? (
            agentSteps.map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start animate-fadeIn">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                  step.status === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                  step.status === 'error' ? 'bg-brand-pink/20 text-brand-pink border border-brand-pink/40' :
                  'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {idx + 1}
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-200 block">{step.title}</span>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{step.description}</p>
                  <span className="text-[9px] font-mono text-brand-blue block mt-0.5">{step.duration || '300ms'}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed py-6 italic text-center">
              Agent execution timelines, MongoDB Atlas write status, and tool calls will log here during active queries.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
