'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  DollarSign, 
  PlusCircle, 
  TrendingUp, 
  PieChart as LucidePieChart, 
  Share2, 
  CheckCircle2, 
  Users,
  Trash2,
  Edit2,
  X,
  Plane,
  Hotel,
  Coffee,
  Train,
  Ticket,
  ShoppingBag,
  AlertOctagon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { api } from '../../lib/api';

interface ExpenseTrackerProps {
  budgets: any[];
  addExpense: (e: React.FormEvent, tripId: string, desc: string, amt: string, cat: string) => void;
  loadDashboardData?: () => void;
}

export default function ExpenseTracker({ budgets, addExpense, loadDashboardData }: ExpenseTrackerProps) {
  const [expDesc, setExpDesc] = useState('');
  const [expAmt, setExpAmt] = useState('');
  const [expCat, setExpCat] = useState<'flight' | 'hotel' | 'food' | 'transport' | 'tickets' | 'shopping' | 'emergency'>('food');

  // Edit Expense States
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editAmt, setEditAmt] = useState('');
  const [editCat, setEditCat] = useState<'flight' | 'hotel' | 'food' | 'transport' | 'tickets' | 'shopping' | 'emergency'>('food');

  const handleSubmit = (e: React.FormEvent, tripId: string) => {
    e.preventDefault();
    if (!expDesc || !expAmt) return;
    addExpense(e, tripId, expDesc, expAmt, expCat);
    setExpDesc('');
    setExpAmt('');
  };

  const handleStartEdit = (exp: any) => {
    setEditingExpenseId(exp.id);
    setEditDesc(exp.description);
    setEditAmt(exp.amount.toString());
    setEditCat(exp.category || 'food');
  };

  const handleUpdate = async (tripId: string, expenseId: string) => {
    if (!editDesc || !editAmt) return;
    try {
      const res = await api.updateExpense(tripId, expenseId, {
        description: editDesc,
        amount: Number(editAmt),
        category: editCat
      });
      if (res.success) {
        setEditingExpenseId(null);
        if (loadDashboardData) loadDashboardData();
      }
    } catch (err) {
      alert('Error updating expense');
    }
  };

  const handleDelete = async (tripId: string, expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      const res = await api.deleteExpense(tripId, expenseId);
      if (res.success) {
        if (loadDashboardData) loadDashboardData();
      }
    } catch (err) {
      alert('Error deleting expense');
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'flight': return <Plane className="w-3.5 h-3.5 text-brand-blue" />;
      case 'hotel': return <Hotel className="w-3.5 h-3.5 text-purple-400" />;
      case 'food': return <Coffee className="w-3.5 h-3.5 text-amber-400" />;
      case 'transport': return <Train className="w-3.5 h-3.5 text-emerald-400" />;
      case 'tickets':
      case 'match': return <Ticket className="w-3.5 h-3.5 text-brand-pink" />;
      case 'shopping': return <ShoppingBag className="w-3.5 h-3.5 text-brand-gold" />;
      default: return <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {budgets.map((b: any) => {
        // Calculate category totals
        const catTotals: Record<string, number> = {
          flight: 0,
          hotel: 0,
          food: 0,
          transport: 0,
          tickets: 0,
          shopping: 0,
          emergency: 0
        };

        b.expenses.forEach((exp: any) => {
          let cat = exp.category?.toLowerCase() || 'shopping';
          if (cat === 'match') cat = 'tickets';
          if (cat === 'other') cat = 'shopping';
          if (catTotals[cat] !== undefined) {
            catTotals[cat] += exp.amount;
          } else {
            catTotals.shopping += exp.amount;
          }
        });

        const totalCategoriesCost = Object.values(catTotals).reduce((sum, val) => sum + val, 0);
        const utilizationPct = b.estimatedCost > 0 ? (b.actualCost / b.estimatedCost) * 100 : 0;
        const remaining = Math.max(b.estimatedCost - b.actualCost, 0);

        // Format Recharts data
        const pieData = Object.entries(catTotals)
          .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
          }))
          .filter(item => item.value > 0);

        const COLORS = {
          Flight: '#00D4FF',
          Hotel: '#A855F7',
          Food: '#FBBF24',
          Transport: '#34D399',
          Tickets: '#FF007F',
          Shopping: '#EAB308',
          Emergency: '#EF4444'
        };

        const renderCustomTooltip = ({ active, payload }: any) => {
          if (active && payload && payload.length) {
            return (
              <div className="bg-slate-950/95 border border-white/10 p-3 rounded-xl text-xs shadow-2xl">
                <p className="font-bold text-white">{payload[0].name}</p>
                <p className="text-brand-blue font-mono font-bold mt-1">${payload[0].value.toLocaleString()}</p>
              </div>
            );
          }
          return null;
        };

        return (
          <div key={b._id} className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 relative">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
              <div>
                <span className="text-[9px] text-brand-blue font-bold uppercase tracking-widest block font-mono">Dynamic Travel Budget Connection</span>
                <h3 className="text-xl font-bold text-white mt-0.5">Budget Allocation Summary</h3>
              </div>
              <span className="text-xs font-mono bg-brand-blue/15 text-brand-blue border border-brand-blue/20 px-3.5 py-1 rounded-full font-bold">
                Total Limit: ${b.estimatedCost.toLocaleString()}
              </span>
            </div>

            {/* Spent progress bar */}
            <div className="space-y-3 bg-slate-900/40 p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">Spent: ${b.actualCost.toLocaleString()}</span>
                <span className="text-slate-500 font-mono">Target: ${b.estimatedCost.toLocaleString()}</span>
              </div>
              
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${b.actualCost > b.estimatedCost ? 'bg-brand-pink animate-pulse' : 'bg-brand-blue'}`}
                  style={{ width: `${Math.min(utilizationPct, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold font-mono">
                <span>{utilizationPct.toFixed(0)}% Utilized</span>
                <span className={remaining === 0 ? 'text-brand-pink' : 'text-emerald-400'}>
                  Remaining Budget: ${remaining.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Category Chart & AI Optimizer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Category Recharts Donut Pie Chart */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between h-[310px]">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <LucidePieChart className="w-4 h-4 text-brand-blue" />
                  Category Division
                </span>
                
                <div className="w-full h-44 shrink-0">
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry: any, index) => (
                            <Cell key={`cell-${index}`} fill={(COLORS as any)[entry.name] || '#64748B'} />
                          ))}
                        </Pie>
                        <Tooltip content={renderCustomTooltip} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">No expense data</div>
                  )}
                </div>

                {/* Custom Legends Grid */}
                <div className="grid grid-cols-3 gap-1.5 text-[9px] text-slate-400 font-medium">
                  {pieData.map((d: any) => (
                    <div key={d.name} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: (COLORS as any)[d.name] }} />
                      <span className="truncate">{d.name}: ${d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Budget Recommendations */}
              <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/5 space-y-3.5 bg-gradient-to-br from-brand-blue/5 via-transparent to-transparent h-[310px] overflow-y-auto">
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Sparkles className="w-4 h-4 text-brand-blue animate-pulse" />
                  AI Budget Insights & Optimizer
                </span>
                
                <div className="space-y-3 text-xs text-slate-300">
                  {catTotals.flight > 1000 && (
                    <div className="p-3 bg-brand-blue/10 border border-brand-blue/20 rounded-xl leading-relaxed">
                      <strong>✈️ Flight Optimization Alert:</strong> Flights represent the largest cost component. Rerouting via secondary hubs or off-peak booking windows can save up to $150.
                    </div>
                  )}
                  {catTotals.hotel > 1000 && (
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl leading-relaxed">
                      <strong>🏨 Hotel Split Notice:</strong> Hotel charges have been synchronized into group memory. Ensure other travel buddies are linked on the Group tab to split the lodging bills automatically.
                    </div>
                  )}
                  {catTotals.transport > 100 && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl leading-relaxed">
                      <strong>🚗 Transport Advisory:</strong> Rideshare congestion surge around the stadium matches peaks at 2.5x. Taking the local metro/rail connection is recommended to cut transit expenses.
                    </div>
                  )}
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl leading-relaxed">
                    <strong>💡 Guardian Savings Tip:</strong> MetLife and other venues enforce luggage constraints. Avoid stadium lockers storage fees ($15) by packing a stadium-compliant clear bag.
                  </div>
                </div>
              </div>
            </div>

            {/* Logged Expenses List & Manual Add Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-white/5">
              
              {/* Expenses list with edit/delete triggers */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-300">Itemized Expense Log</h4>
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                  {b.expenses.map((exp: any) => (
                    <div key={exp.id} className="bg-slate-950/60 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:border-brand-blue/25 transition-all duration-200">
                      
                      {editingExpenseId === exp.id ? (
                        /* INLINE EDIT MODE */
                        <div className="w-full space-y-3 text-xs">
                          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                            <span className="font-bold text-brand-blue">Edit Expense</span>
                            <button onClick={() => setEditingExpenseId(null)} className="text-slate-500 hover:text-white">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <input 
                            type="text" 
                            value={editDesc} 
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs" 
                            placeholder="Description"
                          />
                          
                          <div className="grid grid-cols-2 gap-3">
                            <input 
                              type="number" 
                              value={editAmt} 
                              onChange={(e) => setEditAmt(e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs font-mono" 
                              placeholder="Amount"
                            />
                            <select
                              value={editCat}
                              onChange={(e) => setEditCat(e.target.value as any)}
                              className="w-full bg-slate-950 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs"
                            >
                              <option value="flight">Flight</option>
                              <option value="hotel">Hotel</option>
                              <option value="food">Food</option>
                              <option value="transport">Transport</option>
                              <option value="tickets">Tickets</option>
                              <option value="shopping">Shopping</option>
                              <option value="emergency">Emergency</option>
                            </select>
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button 
                              onClick={() => setEditingExpenseId(null)}
                              className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-slate-400"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleUpdate(b.tripId, exp.id)}
                              className="px-3 py-1 rounded bg-brand-blue text-slate-950 text-[10px] font-bold"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* STANDARD EXPENSE LOG DISPLAY */
                        <>
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 shrink-0">
                              {getCategoryIcon(exp.category || '')}
                            </div>
                            <div className="overflow-hidden">
                              <span className="font-bold text-xs text-slate-200 block truncate" title={exp.description}>
                                {exp.description}
                              </span>
                              <span className="text-[9px] text-slate-500 block uppercase font-mono mt-0.5">
                                {exp.category} &bull; {new Date(exp.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0 ml-4">
                            <div className="text-right">
                              <span className="text-sm font-bold text-white font-mono block">${exp.amount}</span>
                              <span className="text-[8px] text-slate-500 block truncate font-sans">Paid by: {exp.paidBy}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => handleStartEdit(exp)}
                                className="p-1 rounded bg-white/5 border border-white/5 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all"
                                title="Edit Expense"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => handleDelete(b.tripId, exp.id)}
                                className="p-1 rounded bg-white/5 border border-white/5 text-slate-400 hover:text-brand-pink hover:bg-brand-pink/5 transition-all"
                                title="Delete Expense"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {b.expenses.length === 0 && (
                    <p className="text-xs text-slate-500 italic py-4">No expenses logged.</p>
                  )}
                </div>
              </div>

              {/* Log Custom Expense Form */}
              <div className="bg-slate-900/20 p-5 rounded-2xl border border-white/5 h-fit space-y-4">
                <h4 className="text-sm font-bold text-slate-300">Log Custom Expense</h4>
                <form onSubmit={(e) => handleSubmit(e, b.tripId)} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block uppercase">Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Metro rail ticket, Dinner, Stadium jersey" 
                      value={expDesc}
                      onChange={(e) => setExpDesc(e.target.value)}
                      className="glass-input text-xs w-full py-2.5" 
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block uppercase">Amount ($)</label>
                      <input 
                        type="number" 
                        placeholder="Amount" 
                        value={expAmt}
                        onChange={(e) => setExpAmt(e.target.value)}
                        className="glass-input text-xs w-full py-2.5" 
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block uppercase">Category</label>
                      <select 
                        value={expCat}
                        onChange={(e) => setExpCat(e.target.value as any)}
                        className="glass-input text-xs w-full py-2.5"
                      >
                        <option value="flight">Flight</option>
                        <option value="hotel">Hotel</option>
                        <option value="food">Food</option>
                        <option value="transport">Local Transport</option>
                        <option value="tickets">Match Tickets</option>
                        <option value="shopping">Shopping</option>
                        <option value="emergency">Emergency / Other</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-2.5 rounded-xl bg-brand-blue text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-md"
                  >
                    Log Expense
                  </button>
                </form>
              </div>

            </div>

          </div>
        );
      })}

      {budgets.length === 0 && (
        <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center text-slate-500 text-xs italic">
          No active budget limits configured. Start by creating a travel itinerary first.
        </div>
      )}
    </div>
  );
}
