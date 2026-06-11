'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CloudLightning
} from 'lucide-react';
import { api } from '../../lib/api';

// Sub-components
import Sidebar from '../../components/dashboard/Sidebar';
import HomeDashboard from '../../components/dashboard/HomeDashboard';
import SportsHubs from '../../components/dashboard/SportsHubs';
import SportsHub from '../../components/dashboard/SportsHub';
import TravelPlanner from '../../components/dashboard/TravelPlanner';
import ExpenseTracker from '../../components/dashboard/ExpenseTracker';
import StadiumMap from '../../components/dashboard/StadiumMap';
import TicketWatchlist from '../../components/dashboard/TicketWatchlist';
import CommandCenter from '../../components/dashboard/CommandCenter';
import LiveAlerts from '../../components/dashboard/LiveAlerts';
import GroupPlanner from '../../components/dashboard/GroupPlanner';
import AnalyticsDashboard from '../../components/dashboard/AnalyticsDashboard';
import MemoryView from '../../components/dashboard/MemoryView';
import WeatherTraffic from '../../components/dashboard/WeatherTraffic';
import SavedItineraries from '../../components/dashboard/SavedItineraries';
import ProfileView from '../../components/dashboard/ProfileView';
import SettingsView from '../../components/dashboard/SettingsView';
import FloatingAssistant from '../../components/dashboard/FloatingAssistant';
import JudgeDemo from '../../components/dashboard/JudgeDemo';
import MatchCalendar from '../../components/dashboard/MatchCalendar';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<any>({
    name: 'Alex Mercer',
    email: 'alex.guardian@gmail.com',
    picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    favoriteSport: 'Soccer',
    favoriteTeam: 'Argentina',
    budgetPreference: 'Moderate',
    languagePreference: 'English'
  });

  const [trips, setTrips] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  
  // Agent Chat states
  const [chatInput, setChatInput] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [agentSteps, setAgentSteps] = useState<any[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Simulator state
  const [simulating, setSimulating] = useState(false);

  // Load Initial Data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('guardian_token');
      if (!token) {
        window.location.href = '/';
        return;
      }
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const uRes = await api.getProfile();
      if (uRes.success) setUser(uRes.user);

      const tRes = await api.getTrips();
      if (tRes.success) setTrips(tRes.trips);

      const bRes = await api.getBudgets();
      if (bRes.success) setBudgets(bRes.budgets);

      const nRes = await api.getNotifications();
      if (nRes.success) setNotifications(nRes.notifications);

      const eRes = await api.getEvents();
      if (eRes.success) setEvents(eRes.events);

      const hRes = await api.chatAgent('GET_HISTORY').catch(() => ({ success: false }));
      if (hRes.success) setHistory(hRes.history || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  // Run AI Agent request
  const handleAgentSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    setIsThinking(true);
    setAgentResponse('');
    setAgentSteps([]);

    const userMsg = chatInput;
    setChatInput('');

    try {
      const data = await api.chatAgent(userMsg);
      if (data.success) {
        setAgentResponse(data.response);
        setAgentSteps(data.steps || []);
        
        // Refresh local dashboard stores
        loadDashboardData();

        // Voice output simulation
        if (voiceEnabled) {
          speak(data.response);
        }
      }
    } catch (err) {
      setAgentResponse("Sorry, I could not complete that task. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const cleanText = text.replace(/[*#_\-\[\]()]+/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.voice = window.speechSynthesis.getVoices().find(v => v.lang.includes('en')) || null;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeechInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();

      setIsThinking(true);
      setAgentResponse("Listening...");
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsThinking(false);
        setAgentResponse(`Voice input received: "${transcript}". Press send to execute.`);
      };
      
      recognition.onerror = () => {
        setIsThinking(false);
        setAgentResponse("Speech recognition failed. Please try typing.");
      };
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  // Add Trip manually
  const handleAddTrip = async (e: React.FormEvent, event: string, destination: string, budget: string) => {
    e.preventDefault();
    try {
      const res = await api.createTrip({
        event,
        destination,
        budget: Number(budget),
        startDate: new Date(),
        endDate: new Date(Date.now() + 7*24*60*60*1000)
      });
      if (res.success) {
        loadDashboardData();
        setActiveTab('trips');
      }
    } catch (err) {
      alert("Error adding trip");
    }
  };

  // Delete Trip
  const handleDeleteTrip = async (tripId: string) => {
    if (confirm("Are you sure you want to delete this trip itinerary?")) {
      try {
        await api.deleteTrip(tripId);
        loadDashboardData();
      } catch (err) {
        alert("Error deleting trip");
      }
    }
  };

  // Add Expense manually
  const handleAddExpense = async (e: React.FormEvent, tripId: string, desc: string, amt: string, cat: string) => {
    e.preventDefault();
    try {
      const res = await api.addExpense({
        tripId,
        description: desc,
        amount: Number(amt),
        category: cat
      });
      if (res.success) {
        loadDashboardData();
      }
    } catch (err) {
      alert("Error adding expense");
    }
  };

  // Mark all notifications read
  const handleMarkNotifRead = async (notifId?: string) => {
    try {
      await api.markNotificationsRead(notifId);
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Profile preferences update
  const handleProfileUpdate = async (updatedUser: any) => {
    try {
      const res = await api.updateProfile(updatedUser);
      if (res.success) {
        alert("Memory Preferences Updated in MongoDB Atlas!");
        loadDashboardData();
      }
    } catch (err) {
      alert("Error saving preferences");
    }
  };

  // SIMULATOR: Trigger Emergency AI Delay Recalculator
  const simulateFlightDelay = async () => {
    setSimulating(true);
    try {
      await api.triggerEmergencyAlert({
        title: 'ALERT: Flight AI-101 Delayed',
        message: 'Flight AI-101 is delayed by 3 hours. WorldCup Guardian AI has auto-recalculated transit routes, delayed citizenM hotel check-in time to 20:30, and created a new train connection schedule to MetLife Stadium.',
        type: 'flight'
      });
      
      if (trips.length > 0) {
        const activeTrip = trips[0];
        const updatedItinerary = [...activeTrip.itinerary];
        
        const flightIdx = updatedItinerary.findIndex(item => item.type === 'flight');
        if (flightIdx !== -1) {
          updatedItinerary[flightIdx].title = 'Flight DEL to JFK (RESCHEDULED)';
          updatedItinerary[flightIdx].description = 'Delayed. New arrival 20:30. Secaucus Rail connection updated.';
        }

        await api.updateTrip({
          tripId: activeTrip._id,
          itinerary: updatedItinerary
        });
      }

      await loadDashboardData();
      setActiveTab('alerts');
      alert("Emergency AI Simulator triggered! Itinerary rescheduled, notification pushed.");
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  // SIMULATOR: Trigger Weather Alert
  const simulateWeatherAlert = async () => {
    setSimulating(true);
    try {
      await api.triggerEmergencyAlert({
        title: 'ALERT: Severe Rain Forecast for MetLife',
        message: 'Thunderstorm warning. Local guides recommend buying ponchos from East Rutherford Hub, using train line rather than Uber, and staying indoors till 18:30.',
        type: 'weather'
      });
      await loadDashboardData();
      setActiveTab('alerts');
      alert("Weather Alert simulated!");
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  const logout = () => {
    api.logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-100 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        notifications={notifications} 
        logout={logout} 
      />

      {/* Main Content Pane */}
      <main className="flex-grow p-5 md:p-8 max-w-7xl mx-auto w-full z-10 overflow-y-auto h-screen relative">
        
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold font-display uppercase tracking-tight text-white flex items-center gap-2">
              {activeTab === 'home' && 'Guardian Overview'}
              {activeTab === 'agent' && '🤖 AI Command Center'}
              {activeTab === 'trips' && '🧭 AI Travel Planner'}
              {activeTab === 'budgets' && '💰 Smart Expense Tracker'}
              {activeTab === 'sports_icc' && '🏆 World Cup 2027'}
              {activeTab === 'sports_fifa' && '⚽ FIFA Hub'}
              {activeTab === 'sports_cricket' && '🏏 Cricket Hub'}
              {activeTab === 'sports_live' && '🏏 Live Matches'}
              {activeTab === 'sports_upcoming' && '📅 Upcoming Fixtures'}
              {activeTab === 'sports_stadium' && '🏟️ Stadium Guide'}
              {activeTab === 'sports_tickets' && '🎟️ Ticket Watchlist'}
              {activeTab === 'olympics' && '🥇 Olympics Hub'}
              {activeTab === 'events' && '📅 Match Calendar'}
              {activeTab === 'stadium_map' && '🏟️ Stadium Map'}
              {activeTab === 'tickets' && '🎟️ Ticket Watchlist'}
              {activeTab === 'alerts' && '🔔 Live Alerts'}
              {activeTab === 'weather_traffic' && '🌦️ Weather & Traffic'}
              {activeTab === 'group_planner' && '👥 Group Trip Planner'}
              {activeTab === 'analytics' && '📈 Analytics Dashboard'}
              {activeTab === 'ai_memory' && '🧠 AI Memory Client'}
              {activeTab === 'saved_itineraries' && '📁 Saved Itineraries'}
              {activeTab === 'profile' && '👤 User Profile'}
              {activeTab === 'settings' && '⚙️ System Settings'}
              {activeTab === 'judge_demo' && '🏆 Judge Demo Portal'}
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              {activeTab === 'home' && 'Live matches, travel summaries, and weather alarms.'}
              {activeTab === 'agent' && 'Ask WorldCup Guardian AI to coordinate matches, flights, hotels, and split bills.'}
              {activeTab === 'trips' && 'Plan your travel itineraries and coordinate meeting zones.'}
              {activeTab === 'budgets' && 'Track flights, lodging, food, and other travel expenditures.'}
              {activeTab === 'sports_icc' && 'Official ICC Cricket World Cup 2027 information and qualification tracking.'}
              {activeTab === 'sports_fifa' && 'Live FIFA matches, host cities info, and stadium maps.'}
              {activeTab === 'sports_cricket' && 'International cricket formats, live scorecards, and weather telemetry.'}
              {activeTab === 'sports_live' && 'Real-time scores, active batsman/bowler stats, and travel planning.'}
              {activeTab === 'sports_upcoming' && 'Future scheduled international cricket fixtures and travel planners.'}
              {activeTab === 'sports_stadium' && 'Capacity, transport options, hotel recommendations, and seating blueprint.'}
              {activeTab === 'sports_tickets' && 'Track ticket prices, availability, and pricing thresholds.'}
              {activeTab === 'olympics' && 'Athletics, Paris metro schedules, and Schengen visa guides.'}
              {activeTab === 'events' && 'Filter and check stadium rules for upcoming World Cup fixtures.'}
              {activeTab === 'stadium_map' && 'Seating tiers overview, entry gate queues, and parking occupancy.'}
              {activeTab === 'tickets' && 'Track ticket pricing levels, availability, and sparkline trends.'}
              {activeTab === 'alerts' && 'Manage flight delays, Doppler alerts, and emergency propagation tracks.'}
              {activeTab === 'weather_traffic' && 'Live weather Doppler radar scans and route delays.'}
              {activeTab === 'group_planner' && 'Vote on flights, track shared expenditures, and sync checklist details.'}
              {activeTab === 'analytics' && 'Carbon footprint offsets, transit savings, and price charts.'}
              {activeTab === 'ai_memory' && 'Visualize and edit preference fragments written to MongoDB MCP database.'}
              {activeTab === 'saved_itineraries' && 'Export travel plans to PDF/JSON or share links with friends.'}
              {activeTab === 'profile' && 'Set favorite teams, sports, and language preferences.'}
              {activeTab === 'settings' && 'Customize accents, set alarm volume, and edit developer modes.'}
              {activeTab === 'judge_demo' && 'Visualize the end-to-end hackathon data stack pipeline.'}
            </p>
          </div>

          {/* Quick AI Trigger Simulator Panel */}
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={simulateFlightDelay} 
              disabled={simulating}
              className="px-3 py-1.5 rounded-lg bg-brand-pink/10 hover:bg-brand-pink/20 text-brand-pink border border-brand-pink/30 text-[10px] font-bold flex items-center gap-1 transition-all duration-200"
              title="Simulate Flight Delay"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Sim Delay
            </button>
            <button 
              onClick={simulateWeatherAlert}
              disabled={simulating}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 transition-all duration-200"
              title="Simulate Storm Warning"
            >
              <CloudLightning className="w-3.5 h-3.5" /> Sim Weather
            </button>
            <button 
              onClick={loadDashboardData}
              className="p-2 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all duration-200"
              title="Refresh Telemetry"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Tab Router Contents */}
        {activeTab === 'home' && (
          <HomeDashboard 
            trips={trips} 
            budgets={budgets} 
            notifications={notifications} 
            events={events} 
            user={user}
            setActiveTab={setActiveTab}
            markRead={handleMarkNotifRead}
          />
        )}

        {activeTab === 'agent' && (
          <CommandCenter 
            chatInput={chatInput} 
            setChatInput={setChatInput} 
            handleSubmit={handleAgentSubmit}
            isThinking={isThinking}
            agentResponse={agentResponse}
            agentSteps={agentSteps}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
            handleSpeechInput={handleSpeechInput}
          />
        )}

        {activeTab === 'trips' && (
          <TravelPlanner 
            trips={trips} 
            addTrip={handleAddTrip}
            deleteTrip={handleDeleteTrip}
            updateTrip={async (id, itinerary) => {
              await api.updateTrip({ tripId: id, itinerary });
              loadDashboardData();
            }}
            loadDashboardData={loadDashboardData}
          />
        )}

        {activeTab === 'budgets' && (
          <ExpenseTracker 
            budgets={budgets} 
            addExpense={handleAddExpense}
            loadDashboardData={loadDashboardData}
          />
        )}

        {(activeTab === 'football' || activeTab === 'cricket' || activeTab === 'olympics') && (
          <SportsHubs 
            activeTab={activeTab as any}
            events={events}
            trips={trips}
            setChatInput={setChatInput}
            setActiveTab={setActiveTab}
            submitAgent={handleAgentSubmit}
          />
        )}

        {activeTab.startsWith('sports_') && (
          <SportsHub 
            subTab={activeTab.replace('sports_', '')}
            setActiveTab={setActiveTab}
            loadDashboardData={loadDashboardData}
          />
        )}

        {activeTab === 'events' && (
          <MatchCalendar 
            events={events}
          />
        )}

        {activeTab === 'stadium_map' && (
          <StadiumMap />
        )}

        {activeTab === 'tickets' && (
          <TicketWatchlist />
        )}

        {activeTab === 'alerts' && (
          <LiveAlerts 
            notifications={notifications}
            markRead={handleMarkNotifRead}
            simulateDelay={simulateFlightDelay}
            simulateWeather={simulateWeatherAlert}
            simulating={simulating}
          />
        )}

        {activeTab === 'weather_traffic' && (
          <WeatherTraffic />
        )}

        {activeTab === 'group_planner' && (
          <GroupPlanner />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'ai_memory' && (
          <MemoryView 
            user={user}
            updateProfile={handleProfileUpdate}
          />
        )}

        {activeTab === 'saved_itineraries' && (
          <SavedItineraries />
        )}

        {activeTab === 'profile' && (
          <ProfileView 
            user={user}
            updateProfile={handleProfileUpdate}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView logout={logout} />
        )}

        {activeTab === 'judge_demo' && (
          <JudgeDemo />
        )}

        {/* Global Floating Agent Assistant Drawer */}
        <FloatingAssistant 
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSubmit={handleAgentSubmit}
          isThinking={isThinking}
          agentResponse={agentResponse}
          agentSteps={agentSteps}
        />

      </main>
    </div>
  );
}
