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
    <div className="min-h-screen bg-transparent text-[#D7DCEA] flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-[#5B8BF7]/30 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5B8BF7]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[250px] bg-[#4D6C9D]/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Top Heritage Notice */}
      <div className="max-w-md mx-auto w-full text-center pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0E17]/80 border border-white/10 text-[11px] font-mono text-[#8FA5D9] backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span>THE I COMPANY · AGENTIC EXPERIENCE MMXXVI</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <div className="bg-[#0B0E17]/85 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(91,139,247,0.12)] p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Card Top Border Highlight */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#5B8BF7]/50 to-transparent absolute top-0 left-0" />

          {/* Brand Seal Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16213B] to-[#0A0E18] text-white flex items-center justify-center font-serif text-2xl font-bold tracking-tight shadow-[0_0_20px_rgba(91,139,247,0.35)] border border-[#5B8BF7]/40 mx-auto relative">
              <span className="bg-gradient-to-br from-white to-[#8FA5D9] bg-clip-text text-transparent">I</span>
              <span className="absolute -bottom-1 -right-1 text-[8px] font-mono px-1 py-0.2 bg-[#5B8BF7] text-white rounded font-bold shadow-sm">
                AI
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              The I Company
            </h1>
            <p className="text-xs text-[#8E95A5]">
              Sign in to your designated workspace. Accounts are managed exclusively by agency administrators.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/30 text-xs text-[#FDA4AF] flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#F43F5E]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#D7DCEA] block mb-1">
                Assigned Email ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A6275]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@theicompany.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 focus:border-[#5B8BF7] focus:ring-1 focus:ring-[#5B8BF7] text-xs text-white placeholder-[#5A6275] transition-all font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#D7DCEA] block mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A6275]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security token"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#06080E] border border-white/10 focus:border-[#5B8BF7] focus:ring-1 focus:ring-[#5B8BF7] text-xs text-white placeholder-[#5A6275] transition-all font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5A6275] hover:text-[#D7DCEA] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#5B8BF7] hover:bg-[#4A7AE6] text-white font-medium text-xs shadow-[0_0_20px_rgba(91,139,247,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            <button
              type="button"
              onClick={() => setShowQuickAccess(!showQuickAccess)}
              className="w-full flex items-center justify-between text-xs text-[#8E95A5] hover:text-white transition-colors py-1.5"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5B8BF7]" />
                <span className="font-medium text-[11px]">
                  {showQuickAccess ? 'Hide Quick Switcher' : 'Agency Reference Logins (Admin, Brand, Creator)'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#8FA5D9] bg-[#101524] px-2 py-0.5 rounded-full border border-white/10">
                {showQuickAccess ? '▲ Close' : '▼ View'}
              </span>
            </button>

            {showQuickAccess && (
              <div className="grid grid-cols-1 gap-2 pt-1 animate-fade-in max-h-60 overflow-y-auto pr-1">
                {/* Admin Button */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('acc-admin')}
                  className="p-2.5 rounded-xl bg-[#06080E] hover:bg-[#101524] border border-white/10 hover:border-[#5B8BF7]/40 text-left transition-all flex items-center justify-between text-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#5B8BF7]/20 border border-[#5B8BF7]/30 text-[#8FA5D9] flex items-center justify-center font-bold text-xs">
                      👑
                    </span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-[#8FA5D9] transition-colors">
                        Super Admin (Agency HQ)
                      </div>
                      <span className="text-[10px] text-[#5A6275] font-mono">admin@theicompany.com · admin123</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#10B981] font-medium px-2 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30">
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
                      className="p-2.5 rounded-xl bg-[#06080E] hover:bg-[#101524] border border-white/10 hover:border-[#F43F5E]/40 text-left transition-all flex items-center justify-between text-xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-[#F43F5E]/20 border border-[#F43F5E]/30 text-[#FDA4AF] flex items-center justify-center text-xs">
                          🏢
                        </span>
                        <div>
                          <div className="font-semibold text-white group-hover:text-[#FDA4AF] transition-colors">
                            {acc.name}
                          </div>
                          <span className="text-[10px] text-[#5A6275] font-mono">{acc.email} · {acc.password}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#8E95A5] font-mono">Brand Portal ➔</span>
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
                      className="p-2.5 rounded-xl bg-[#06080E] hover:bg-[#101524] border border-white/10 hover:border-[#10B981]/40 text-left transition-all flex items-center justify-between text-xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-[#10B981]/20 border border-[#10B981]/30 text-[#6EE7B7] flex items-center justify-center text-xs">
                          ✨
                        </span>
                        <div>
                          <div className="font-semibold text-white group-hover:text-[#6EE7B7] transition-colors">
                            {acc.name}
                          </div>
                          <span className="text-[10px] text-[#5A6275] font-mono">{acc.email} · {acc.password}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#10B981] font-mono font-medium">Creator Desk ➔</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center pb-6 text-xs text-[#5A6275]">
        <p>The I Company Platform · End-to-End Escrow Protection · MMXXVI</p>
      </div>
    </div>
  );
};
