'use client';

import React from 'react';
import { 
  Bookmark, 
  Download, 
  Share2, 
  CheckCircle2, 
  FileText, 
  Calendar 
} from 'lucide-react';

export default function SavedItineraries() {
  const archives = [
    {
      id: "arch-1",
      destination: "New York/New Jersey, USA",
      event: "FIFA World Cup 2026",
      dateRange: "June 12 - June 17, 2026",
      cost: 2800,
      buddiesCount: 1,
      itemsCount: 4
    },
    {
      id: "arch-2",
      destination: "Johannesburg, South Africa",
      event: "ICC Cricket World Cup 2027",
      dateRange: "March 15 - March 20, 2027",
      cost: 1850,
      buddiesCount: 2,
      itemsCount: 5
    },
    {
      id: "arch-3",
      destination: "Paris, France",
      event: "Olympic Games Paris 2024",
      dateRange: "July 24 - July 30, 2024",
      cost: 4100,
      buddiesCount: 0,
      itemsCount: 4
    }
  ];

  const handleExportPDF = (dest: string) => {
    alert(`Itinerary PDF for "${dest}" compiled and downloaded successfully!`);
  };

  const handleExportJSON = (dest: string) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(archives[0]));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `guardian_itinerary_${dest.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShareLink = (dest: string) => {
    navigator.clipboard.writeText(`http://localhost:3000/shared/itinerary/${dest.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
    alert("Shareable itinerary URL copied to your clipboard!");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="glass-panel p-5 rounded-2xl border border-white/5">
        <h3 className="text-md font-bold text-white flex items-center gap-2">
          <Bookmark className="w-4.5 h-4.5 text-brand-blue" />
          Itinerary Archives (Saved Plans)
        </h3>
        <p className="text-xs text-slate-500 mt-1">Export, restore, or share your saved sporting travel plans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {archives.map((item) => (
          <div key={item.id} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4 hover:border-brand-blue/20 transition-all duration-200">
            <div className="space-y-1">
              <span className="text-[9px] bg-slate-950 text-slate-400 border border-white/5 px-2.5 py-0.5 rounded font-mono uppercase font-bold w-fit block">
                {item.event}
              </span>
              <h4 className="font-bold text-sm text-slate-200 mt-2 block">{item.destination}</h4>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5" /> {item.dateRange}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-slate-950/40 p-2.5 rounded-xl border border-white/5 font-mono">
              <div>
                <span className="text-slate-500 block">Spent</span>
                <span className="font-bold text-white block mt-0.5">${item.cost}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Buddies</span>
                <span className="font-bold text-white block mt-0.5">{item.buddiesCount}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Events</span>
                <span className="font-bold text-white block mt-0.5">{item.itemsCount}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <button 
                onClick={() => handleExportPDF(item.destination)}
                className="py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-brand-blue/30 text-slate-400 hover:text-slate-200 flex flex-col items-center justify-center gap-1 transition-all"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>PDF</span>
              </button>
              <button 
                onClick={() => handleExportJSON(item.destination)}
                className="py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-brand-blue/30 text-slate-400 hover:text-slate-200 flex flex-col items-center justify-center gap-1 transition-all"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>JSON</span>
              </button>
              <button 
                onClick={() => handleShareLink(item.destination)}
                className="py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-brand-blue/30 text-slate-400 hover:text-slate-200 flex flex-col items-center justify-center gap-1 transition-all"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>Share</span>
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
