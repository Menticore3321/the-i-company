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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const allKnownAccounts = [...accounts, ...INITIAL_ACCOUNTS];
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
    const allKnownAccounts = [...accounts, ...INITIAL_ACCOUNTS];
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
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-[#EAE4D9]">
      {/* Top Heritage Notice */}
      <div className="max-w-md mx-auto w-full text-center pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E2DA] text-[11px] font-mono text-[#78716C]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E523E]" />
          <span>THE I COMPANY · SECURE ATELIER MMXXVI</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <div className="bg-white rounded-2xl border border-[#E7E2DA] shadow-vintage-lg p-6 sm:p-8 space-y-6">
          {/* Brand Seal Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#1C1917] text-[#FBF9F5] flex items-center justify-center font-serif text-2xl font-bold tracking-tight shadow-vintage-sm border border-[#3E3834] mx-auto relative">
              <span>I</span>
              <span className="absolute -bottom-1 -right-1 text-[8px] font-mono px-1 py-0.2 bg-[#C25E3E] text-white rounded font-bold">
                EST.26
              </span>
            </div>

            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
              The I Company
            </h1>
            <p className="text-xs text-[#78716C] font-sans">
              Sign in to your designated workspace. Accounts are issued exclusively by agency administrators.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-[#FDF3EE] border border-[#F2DACF] text-xs text-[#C25E3E] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#1C1917] block mb-1">
                Assigned Email ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78716C]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@theicompany.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] focus:border-[#1C1917] focus:bg-white text-xs text-[#1C1917] placeholder-[#A8A29E] transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#1C1917] block mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78716C]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] focus:border-[#1C1917] focus:bg-white text-xs text-[#1C1917] placeholder-[#A8A29E] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#78716C] hover:text-[#1C1917]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white font-medium text-xs shadow-vintage-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-[#F0ECE4] space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#78716C]">
              <span className="font-mono uppercase tracking-wider text-[10px]">Instant Local Access:</span>
              <span>Click to auto-login</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('acc-admin')}
                className="p-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F5F2EB] border border-[#E7E2DA] text-left transition-colors flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-md bg-[#1C1917] text-white flex items-center justify-center font-bold text-xs">
                    👑
                  </span>
                  <div>
                    <div className="font-semibold text-[#1C1917] group-hover:text-[#C25E3E]">
                      Super Admin (Agency HQ)
                    </div>
                    <span className="text-[10px] text-[#78716C] font-mono">admin@theicompany.com</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#2E523E] font-medium px-2 py-0.5 rounded bg-[#EEF5F1] border border-[#D1E3D8]">
                  Full Control
                </span>
              </button>

              {/* Brand 1: Nothing India */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('acc-br-1')}
                className="p-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F5F2EB] border border-[#E7E2DA] text-left transition-colors flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-md bg-[#FAF8F5] border border-[#E2DDD5] flex items-center justify-center text-xs">
                    🏢
                  </span>
                  <div>
                    <div className="font-semibold text-[#1C1917] group-hover:text-[#C25E3E]">
                      Nothing India (Brand Client)
                    </div>
                    <span className="text-[10px] text-[#78716C] font-mono">nothing@brands.theicompany.com</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#78716C] font-mono">₹18.5L Budget</span>
              </button>

              {/* Creator 1: Tech Burner */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('acc-inf-1')}
                className="p-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F5F2EB] border border-[#E7E2DA] text-left transition-colors flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-md bg-[#FAF8F5] border border-[#E2DDD5] flex items-center justify-center text-xs">
                    ✨
                  </span>
                  <div>
                    <div className="font-semibold text-[#1C1917] group-hover:text-[#C25E3E]">
                      Shlok Srivastava (@techburner)
                    </div>
                    <span className="text-[10px] text-[#78716C] font-mono">techburner@creators.theicompany.com</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#2E523E] font-mono">4.3M Reach</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center pb-6 text-xs text-[#78716C] space-y-1">
        <p className="font-serif">The I Company · Atelier MMXXVI</p>
        <p className="text-[11px] text-[#A8A29E]">Isolated Portals · Escrow Guaranteed · Real-Time Telemetry</p>
      </footer>
    </div>
  );
};

