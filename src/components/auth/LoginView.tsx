import React, { useState } from 'react';
import { UserAccount, UserRole } from '../../types';
import { INITIAL_ACCOUNTS } from '../../lib/mockData';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Briefcase,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { PeacefulLiveWallpaper, WallpaperTheme, WALLPAPER_PRESETS } from '../vintage/PeacefulLiveWallpaper';

interface LoginViewProps {
  accounts: UserAccount[];
  onLogin: (account: UserAccount) => void;
  currentWallpaper?: WallpaperTheme;
  onWallpaperChange?: (theme: WallpaperTheme) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ 
  accounts, 
  onLogin,
  currentWallpaper = 'dawn',
  onWallpaperChange
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activePreset = WALLPAPER_PRESETS[currentWallpaper] || WALLPAPER_PRESETS.dawn;
  const allKnownAccounts: UserAccount[] = [...accounts, ...INITIAL_ACCOUNTS];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const found = allKnownAccounts.find(
      acc => acc.email.toLowerCase() === cleanEmail && acc.password === password
    );

    if (found) {
      onLogin(found);
    } else {
      setErrorMessage('Invalid credentials. Please verify your assigned email and password.');
    }
  };

  const handleQuickDemoLogin = (accountId: string) => {
    let found = allKnownAccounts.find(acc => acc.id === accountId);
    
    // Fallback search if exact ID differs
    if (!found) {
      if (accountId.includes('br-') || accountId.includes('brand')) {
        found = allKnownAccounts.find(acc => acc.role === 'brand');
      } else if (accountId.includes('inf-') || accountId.includes('creator')) {
        found = allKnownAccounts.find(acc => acc.role === 'influencer');
      } else {
        found = allKnownAccounts.find(acc => acc.role === 'agency');
      }
    }

    if (found) {
      setEmail(found.email);
      setPassword(found.password);
      onLogin(found);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-blue-500/20 selection:text-blue-900 relative overflow-hidden">
      {/* Peaceful Live Wallpaper (Light Theme) */}
      <PeacefulLiveWallpaper 
        currentTheme={currentWallpaper} 
        onThemeChange={onWallpaperChange} 
      />

      {/* Top Notice with Live Wallpaper Switcher */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full weather-glass-pod text-[11px] font-mono text-slate-800 shadow-xs">
          <img src="/logo-icon.png" alt="" className="w-4 h-4 object-contain" />
          <span className="font-bold tracking-wider">THE I COMPANY · ATELIER MMXXVI</span>
        </div>

        {/* Live Wallpaper Trigger */}
        <div className="relative">
          <PeacefulLiveWallpaper 
            currentTheme={currentWallpaper} 
            onThemeChange={onWallpaperChange} 
            showSwitcher={true} 
          />
        </div>
      </div>

      {/* Main Login Weather Glass Card */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <div className="weather-glass-card weather-glass-card-hover rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Card Top Border Specular Highlight */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent absolute top-0 left-0 opacity-90" />

          {/* Brand Seal Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/90 p-2.5 flex items-center justify-center shadow-[0_4px_20px_rgba(15,23,42,0.08)] border border-white mx-auto relative group hover:scale-105 transition-transform">
              <img 
                src="/logo-icon.png" 
                alt="The I Company" 
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
              The I Company
            </h1>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Sign in to your designated workspace. Accounts are managed exclusively by agency administrators.
            </p>
          </div>

          {/* Atmosphere Status Ribbon (Weather Card Style) */}
          <div className="p-2.5 rounded-2xl weather-glass-pod text-[11px] font-mono text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <span>{activePreset.icon}</span>
              <span>{activePreset.name}</span>
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
              PEACEFUL VIBE
            </span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50/90 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Assigned Email ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@theicompany.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl weather-glass-pod focus:bg-white focus:border-blue-500 text-xs text-slate-900 placeholder-slate-400 transition-all font-mono outline-none shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security token"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl weather-glass-pod focus:bg-white focus:border-blue-500 text-xs text-slate-900 placeholder-slate-400 transition-all font-mono outline-none shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Authenticate & Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-3 border-t border-white/60 space-y-2">
            <button
              type="button"
              onClick={() => setShowQuickAccess(!showQuickAccess)}
              className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 transition-colors py-1.5 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-bold text-[11px]">
                  {showQuickAccess ? 'Hide Quick Switcher' : 'Agency Reference Logins (Admin, Brand, Creator)'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                {showQuickAccess ? '▲ Close' : '▼ View'}
              </span>
            </button>

            {showQuickAccess && (
              <div className="grid grid-cols-1 gap-2 pt-1 animate-fade-in max-h-60 overflow-y-auto pr-1">
                {/* Admin Button */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('acc-admin')}
                  className="p-2.5 rounded-2xl weather-glass-pod hover:bg-white hover:border-blue-300 text-left transition-all flex items-center justify-between text-xs group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-xs">
                      👑
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        Super Admin (Agency HQ)
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">admin@theicompany.com · admin123</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    Full Control
                  </span>
                </button>

                {/* Brand Accounts */}
                {allKnownAccounts
                  .filter(acc => acc.role === 'brand')
                  .filter((acc, idx, arr) => arr.findIndex(a => a.email === acc.email) === idx)
                  .map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setEmail(acc.email);
                        setPassword(acc.password);
                        onLogin(acc);
                      }}
                      className="p-2.5 rounded-2xl weather-glass-pod hover:bg-white hover:border-purple-300 text-left transition-all flex items-center justify-between text-xs group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center text-xs">
                          🏢
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                            {acc.name}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{acc.email} · {acc.password}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">Brand Portal ➔</span>
                    </button>
                  ))}

                {/* Creator Accounts */}
                {allKnownAccounts
                  .filter(acc => acc.role === 'influencer')
                  .filter((acc, idx, arr) => arr.findIndex(a => a.email === acc.email) === idx)
                  .map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setEmail(acc.email);
                        setPassword(acc.password);
                        onLogin(acc);
                      }}
                      className="p-2.5 rounded-2xl weather-glass-pod hover:bg-white hover:border-emerald-300 text-left transition-all flex items-center justify-between text-xs group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xs">
                          ✨
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {acc.name}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{acc.email} · {acc.password}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">Creator Desk ➔</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center pb-4 text-xs text-slate-500 font-mono">
        <span>The I Company Platform · End-to-End Escrow Protection · MMXXVI</span>
      </div>
    </div>
  );
};
