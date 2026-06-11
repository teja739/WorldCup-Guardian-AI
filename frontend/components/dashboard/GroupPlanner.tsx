'use client';

import React, { useState } from 'react';
import { 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  ThumbsUp, 
  HelpCircle, 
  UserMinus, 
  DollarSign, 
  Sparkles 
} from 'lucide-react';

export default function GroupPlanner() {
  const [members, setMembers] = useState(['alex.guardian@gmail.com', 'friend1@example.com', 'kane.williamson@gmail.com']);
  const [newEmail, setNewEmail] = useState('');
  
  // Dynamic Polls
  const [polls, setPolls] = useState([
    {
      id: 1,
      category: "Flight Option",
      question: "Which airline routing do we book?",
      options: [
        { text: "Air India AI-101 (Direct, $1100)", votes: 2, votedBy: ['alex.guardian@gmail.com', 'friend1@example.com'] },
        { text: "Emirates EK-201 (1 stop, $1450)", votes: 1, votedBy: ['kane.williamson@gmail.com'] }
      ]
    },
    {
      id: 2,
      category: "Lodging Option",
      question: "Where do we stay in NYC?",
      options: [
        { text: "citizenM Bowery NYC ($180/night)", votes: 3, votedBy: ['alex.guardian@gmail.com', 'friend1@example.com', 'kane.williamson@gmail.com'] },
        { text: "Hilton Meadowlands NJ ($220/night)", votes: 0, votedBy: [] }
      ]
    }
  ]);

  const [balances, setBalances] = useState([
    { name: "friend1@example.com", status: "owes you", amount: 450 },
    { name: "kane.williamson@gmail.com", status: "you owe", amount: 80 }
  ]);

  const handleVote = (pollId: number, optionIdx: number) => {
    setPolls(polls.map(p => {
      if (p.id === pollId) {
        const updatedOptions = p.options.map((opt, idx) => {
          // Add vote to the clicked one, remove from others for simplicity
          const alreadyVoted = opt.votedBy.includes('alex.guardian@gmail.com');
          if (idx === optionIdx) {
            if (alreadyVoted) return opt; // no change
            return {
              ...opt,
              votes: opt.votes + 1,
              votedBy: [...opt.votedBy, 'alex.guardian@gmail.com']
            };
          } else {
            if (opt.votedBy.includes('alex.guardian@gmail.com')) {
              return {
                ...opt,
                votes: opt.votes - 1,
                votedBy: opt.votedBy.filter(email => email !== 'alex.guardian@gmail.com')
              };
            }
            return opt;
          }
        });
        return { ...p, options: updatedOptions };
      }
      return p;
    }));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || members.includes(newEmail)) return;
    setMembers([...members, newEmail]);
    setNewEmail('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      
      {/* Travel Group and Polls (Col-span 8) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Voting Polls */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-5">
          <h3 className="text-md font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-brand-blue" />
            Active Group Voting Polls
          </h3>

          <div className="space-y-6">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-slate-950/40 p-4.5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] bg-brand-blue/15 text-brand-blue border border-brand-blue/20 px-2.5 py-0.5 rounded font-mono uppercase tracking-widest font-bold">
                    {poll.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Anonymous Sync</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{poll.question}</h4>

                <div className="space-y-2.5 pt-1">
                  {poll.options.map((opt, oIdx) => {
                    const hasVoted = opt.votedBy.includes('alex.guardian@gmail.com');
                    return (
                      <div 
                        key={oIdx} 
                        onClick={() => handleVote(poll.id, oIdx)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 relative overflow-hidden flex justify-between items-center text-xs ${
                          hasVoted 
                            ? 'bg-brand-blue/10 border-brand-blue/40 text-slate-100' 
                            : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <div className="space-y-0.5 z-10">
                          <span className="font-semibold">{opt.text}</span>
                          <span className="text-[9px] text-slate-500 block truncate max-w-xs sm:max-w-md">
                            Votes: {opt.votes} ({opt.votedBy.map(e => e.split('@')[0]).join(', ')})
                          </span>
                        </div>
                        <ThumbsUp className={`w-4 h-4 z-10 shrink-0 ${hasVoted ? 'text-brand-blue' : 'text-slate-600'}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Sync checklist */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
          <h3 className="text-md font-bold text-white border-b border-white/5 pb-3">📁 Shared Member Itinerary Sync</h3>
          
          <div className="space-y-3">
            {[
              { task: "Flight booked", status: "alex.guardian@gmail.com, friend1@example.com (Pending: kane.williamson@gmail.com)" },
              { task: "citizenM Hotel check-in scheduled", status: "All Synced (3/3 members)" },
              { task: "FIFA Match Tickets linked", status: "alex.guardian@gmail.com, friend1@example.com (Pending: kane.williamson@gmail.com)" }
            ].map((check, idx) => (
              <div key={idx} className="p-3 bg-slate-950/30 border border-white/5 rounded-xl flex items-center gap-3 text-xs">
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-blue shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">{check.task}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{check.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Invite panel & balances (Col-span 4) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Travel Buddies List */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-blue" /> Group Members
          </h3>

          <div className="space-y-3">
            {members.map((email, mIdx) => (
              <div key={mIdx} className="flex justify-between items-center text-xs bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                <span className="font-semibold text-slate-300 truncate pr-2">{email}</span>
                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase shrink-0 font-mono">
                  {email.includes('alex') ? 'Leader' : 'Synced'}
                </span>
              </div>
            ))}
          </div>

          {/* Add member form */}
          <form onSubmit={handleAddMember} className="space-y-2.5 pt-2 border-t border-white/5">
            <input 
              type="email" 
              placeholder="friend.email@example.com" 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="glass-input text-[11px] w-full py-2" 
              required
            />
            <button 
              type="submit" 
              className="w-full py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-brand-blue/30 text-slate-300 hover:text-slate-100 font-bold text-[11px] transition-all"
            >
              Invite Buddy
            </button>
          </form>
        </div>

        {/* Expenses Matrix */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-brand-gold" /> Shared Debts Matrix
          </h3>

          <div className="space-y-3 text-xs font-mono">
            {balances.map((bal, idx) => {
              const isOwed = bal.status === 'owes you';
              return (
                <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-300 block font-sans text-xs truncate max-w-[130px]">{bal.name}</span>
                    <span className={`text-[9px] font-sans font-bold uppercase tracking-wider ${isOwed ? 'text-emerald-400' : 'text-brand-pink'}`}>
                      {bal.status}
                    </span>
                  </div>
                  <span className={`text-sm font-bold font-mono ${isOwed ? 'text-emerald-400' : 'text-brand-pink'}`}>
                    ${bal.amount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
