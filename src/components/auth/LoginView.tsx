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

interface LoginViewProps {
  accounts: UserAccount[];
  onLogin: (account: UserAccount) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ accounts, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    
    // Robust fallback by role if exact ID differed
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
      {/* Background Soft Aurora Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-400/10 via-indigo-300/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[300px] bg-emerald-400/8 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Top Notice */}
      <div className="max-w-md mx-auto w-full text-center pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200/90 text-[11px] font-mono text-blue-700 backdrop-blur-md shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wider">THE I COMPANY · ATELIER MMXXVI</span>
        </div>
      </div>

      {/* Main Login Glass Card */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.8)_inset] p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Card Top Border Specular Highlight */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500/35 to-transparent absolute top-0 left-0" />

          {/* Brand Seal Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-serif text-2xl font-bold tracking-tight shadow-[0_4px_16px_rgba(37,99,235,0.3)] border border-blue-400/30 mx-auto relative">
              <span>I</span>
              <span className="absolute -bottom-1 -right-1 text-[8px] font-mono px-1 py-0.2 bg-slate-900 text-white rounded font-bold shadow-xs">
                AI
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
              The I Company
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Sign in to your designated workspace. Accounts are managed exclusively by agency administrators.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
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
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all font-mono outline-none shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all font-mono outline-none shadow-xs"
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
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => setShowQuickAccess(!showQuickAccess)}
              className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-900 transition-colors py-1.5"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold text-[11px]">
                  {showQuickAccess ? 'Hide Quick Switcher' : 'Agency Reference Logins (Admin, Brand, Creator)'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60 font-semibold">
                {showQuickAccess ? '▲ Close' : '▼ View'}
              </span>
            </button>

            {showQuickAccess && (
              <div className="grid grid-cols-1 gap-2 pt-1 animate-fade-in max-h-60 overflow-y-auto pr-1">
                {/* Admin Button */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('acc-admin')}
                  className="p-2.5 rounded-xl bg-slate-50/90 hover:bg-white border border-slate-200/80 hover:border-blue-300 text-left transition-all flex items-center justify-between text-xs group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-xs">
                      👑
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        Super Admin (Agency HQ)
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">admin@theicompany.com · admin123</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
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
                      className="p-2.5 rounded-xl bg-slate-50/90 hover:bg-white border border-slate-200/80 hover:border-purple-300 text-left transition-all flex items-center justify-between text-xs group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center text-xs">
                          🏢
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                            {acc.name}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{acc.email} · {acc.password}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono font-medium">Brand Portal ➔</span>
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
                      className="p-2.5 rounded-xl bg-slate-50/90 hover:bg-white border border-slate-200/80 hover:border-emerald-300 text-left transition-all flex items-center justify-between text-xs group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xs">
                          ✨
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {acc.name}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{acc.email} · {acc.password}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-mono font-semibold">Creator Desk ➔</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center pb-6 text-xs text-slate-400 font-medium">
        <p>The I Company Platform · End-to-End Escrow Protection · MMXXVI</p>
      </div>
    </div>
  );
};
