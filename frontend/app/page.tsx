'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, MapPin, Compass, DollarSign, CloudLightning, Loader2, LogOut, CheckCircle2, User, ArrowRight, Github, Lock, Mail, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';

const MOCK_PROFILES = [
  {
    name: 'Lionel Messi',
    email: 'messi.goat@gmail.com',
    picture: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=150&q=80',
    favoriteSport: 'Soccer',
    favoriteTeam: 'Argentina',
    budgetPreference: 'Luxury',
    provider: 'Google'
  },
  {
    name: 'Cristiano Ronaldo',
    email: 'ronaldo.cr7@gmail.com',
    picture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    favoriteSport: 'Soccer',
    favoriteTeam: 'Portugal',
    budgetPreference: 'Luxury',
    provider: 'Google'
  },
  {
    name: 'Alex Mercer',
    email: 'alex.guardian@gmail.com',
    picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    favoriteSport: 'Soccer',
    favoriteTeam: 'Argentina',
    budgetPreference: 'Moderate',
    provider: 'Google'
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah.cricket@gmail.com',
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    favoriteSport: 'Cricket',
    favoriteTeam: 'India',
    budgetPreference: 'Economy',
    provider: 'GitHub'
  }
];

export default function AuthenticationPage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialProvider, setSocialProvider] = useState<'Google' | 'GitHub'>('Google');
  const [loadingText, setLoadingText] = useState('');
  
  // Custom user input form states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // Custom sign-up detail states inside modal
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('guardian_token');
    if (token && token !== 'mock-token') {
      api.getProfile()
        .then(res => {
          if (res.success) {
            setSessionUser(res.user);
          } else {
            localStorage.removeItem('guardian_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('guardian_token');
        });
    }
  }, []);

  const handleLogin = async (profile: { name: string; email: string; picture: string; favoriteSport: string; favoriteTeam: string; budgetPreference: string }) => {
    setLoading(true);
    setShowSocialModal(false);
    setLoadingText(`Connecting to ${socialProvider} Authenticator...`);
    
    // Simulate steps for a premium look
    setTimeout(async () => {
      setLoadingText('Syncing profile preferences to MongoDB Atlas...');
      setTimeout(async () => {
        setLoadingText('Generating secure session JWT...');
        try {
          const res = await api.login(profile.email, profile.name, profile.picture);
          if (res.success) {
            // Update preferences memory if user profile in db is newly created
            await api.updateProfile({
              name: profile.name,
              favoriteSport: profile.favoriteSport,
              favoriteTeam: profile.favoriteTeam,
              budgetPreference: profile.budgetPreference
            });
            window.location.href = '/dashboard';
          } else {
            alert('Authentication failed');
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
          alert('Error logging in');
          setLoading(false);
        }
      }, 800);
    }, 800);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;
    
    // Auto-derive a display name from the email
    const namePart = emailInput.split('@')[0];
    const derivedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    
    setSocialProvider('Google');
    handleLogin({
      name: derivedName,
      email: emailInput,
      picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      favoriteSport: 'Soccer',
      favoriteTeam: 'Argentina',
      budgetPreference: 'Moderate'
    });
  };

  const handleCustomSocialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) return;
    
    const randomAvatarIdx = Math.floor(Math.random() * MOCK_PROFILES.length);
    handleLogin({
      name: customName,
      email: customEmail,
      picture: MOCK_PROFILES[randomAvatarIdx].picture,
      favoriteSport: 'Soccer',
      favoriteTeam: 'Argentina',
      budgetPreference: 'Moderate'
    });
  };

  const triggerSocialModal = (provider: 'Google' | 'GitHub') => {
    setSocialProvider(provider);
    setShowSocialModal(true);
  };

  const handleLogout = () => {
    api.logout();
    setSessionUser(null);
    localStorage.removeItem('guardian_token');
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-slate-950 font-sans text-slate-100">
      
      {/* Background Decorative Blur Orbs (stadium lights) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      
      {/* Subtle Pitch Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header / Brand Logo Area */}
      <header className="max-w-7xl mx-auto w-full px-6 py-8 flex justify-center items-center z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-brand-blue" />
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              WorldCup <span className="text-brand-blue">Guardian AI</span>
            </h1>
          </div>
          <div className="text-center mt-1.5 space-y-1">
            <p className="text-[11px] tracking-widest font-semibold text-brand-blue/90 uppercase font-mono">
              Plan &bull; Travel &bull; Track &bull; Experience
            </p>
            <p className="text-xs text-slate-400 font-medium">
              The World\'s Biggest Sporting Events with AI
            </p>
          </div>
        </div>
      </header>

      {/* Main Centered Login Section */}
      <main className="max-w-md mx-auto w-full px-6 py-6 z-10 flex-grow flex items-center justify-center">
        
        {/* Glassmorphic Centered Card */}
        <div className="w-full glass-panel rounded-2xl p-8 space-y-6 relative overflow-hidden shadow-2xl">
          
          {/* Top Line Decorator representing Stadium Grass Pitch Theme */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue via-purple-600 to-brand-blue" />

          {loading ? (
            /* LOADING DISPLAY */
            <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
              <div>
                <h3 className="font-semibold text-white">Please wait</h3>
                <p className="text-xs text-slate-400 mt-1">{loadingText}</p>
              </div>
            </div>
          ) : (
            /* LOGIN FORM VIEW */
            <div className="space-y-6">
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white font-display">Sign In</h2>
                <p className="text-xs text-slate-400 mt-1.5">
                  Enter your credentials below to access your travel agent dashboard
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="email">Email address</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-brand-blue/50 focus:border-brand-blue focus:outline-none focus:ring-2 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400" htmlFor="password">Password</label>
                    <a href="#forgot" className="text-xs font-semibold text-brand-blue hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-brand-blue/50 focus:border-brand-blue focus:outline-none focus:ring-2 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-blue focus:ring-brand-blue"
                  />
                  <label htmlFor="remember" className="ml-2.5 text-xs text-slate-400 select-none cursor-pointer">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-brand-blue text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/10"
                >
                  Sign In
                </button>
              </form>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 border-t border-white/5 w-full" />
                <span className="relative px-3 bg-[#0d1527] text-[10px] text-slate-500 font-bold uppercase tracking-wider">or continue with</span>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Continue with Google */}
                <button
                  onClick={() => triggerSocialModal('Google')}
                  className="py-3 px-4 rounded-xl border border-white/5 hover:border-white/10 bg-white/5 text-xs text-slate-300 font-semibold flex items-center justify-center gap-2.5 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

                {/* Continue with GitHub */}
                <button
                  onClick={() => triggerSocialModal('GitHub')}
                  className="py-3 px-4 rounded-xl border border-white/5 hover:border-white/10 bg-white/5 text-xs text-slate-300 font-semibold flex items-center justify-center gap-2.5 transition-all"
                >
                  <Github className="w-4 h-4 text-white" />
                  GitHub
                </button>
              </div>

              <div className="text-center">
                <span className="text-xs text-slate-400">
                  Don't have an account? <a href="#signup" className="text-brand-blue font-semibold hover:underline">Sign up</a>
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Social Authenticator Modal Simulation */}
      {showSocialModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                {socialProvider === 'Google' ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                ) : (
                  <Github className="w-5 h-5 text-white" />
                )}
                <h3 className="font-bold text-white">{socialProvider} OAuth Portal</h3>
              </div>
              <button 
                onClick={() => setShowSocialModal(false)}
                className="text-xs text-slate-500 hover:text-slate-300 font-semibold"
              >
                Cancel
              </button>
            </div>

            {/* List selector */}
            <div className="space-y-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Choose a Google Account:</span>
              <div className="space-y-2.5">
                {MOCK_PROFILES.filter(p => p.provider === socialProvider || socialProvider === 'Google').map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLogin(p)}
                    className="w-full p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-brand-blue/30 text-left flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.picture} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-white/5" />
                      <div>
                        <span className="text-sm font-semibold text-white block">{p.name}</span>
                        <span className="text-xs text-slate-500 block font-mono">{p.email}</span>
                      </div>
                    </div>
                    <span className="text-xs text-brand-blue font-bold">Select</span>
                  </button>
                ))}
              </div>

              {/* Custom Sign-In Form inside Modal */}
              <div className="border-t border-white/5 pt-4 mt-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Or enter manual details:</span>
                <form onSubmit={handleCustomSocialLogin} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Cristiano Ronaldo)"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-4 py-3 glass-input text-xs text-white focus:ring-[#2563EB]/50 focus:border-[#2563EB]"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address (e.g. ronaldo@gmail.com)"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-4 py-3 glass-input text-xs text-white focus:ring-[#2563EB]/50 focus:border-[#2563EB]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand-blue text-slate-950 font-bold text-xs transition-all shadow-md"
                  >
                    Sign in with custom {socialProvider} details
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500 z-10 bg-slate-950/80">
        &copy; {new Date().getFullYear()} WorldCup Guardian AI. Built for Global AI Hackathon.
      </footer>
    </div>
  );
}
