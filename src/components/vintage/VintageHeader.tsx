import React, { useState, useEffect } from 'react';
import { UserAccount } from '../../types';
import { 
  ShieldCheck, 
  Sparkles, 
  Briefcase, 
  Instagram, 
  Building2, 
  UserCheck, 
  LogOut, 
  Plus,
  Key
} from 'lucide-react';

interface VintageHeaderProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onOpenAddModal?: () => void;
  onOpenAddBrandModal?: () => void;
  onOpenCampaignGenerator?: () => void;
  creatorsCount?: number;
  activeCampaignsCount?: number;
}

export const VintageHeader: React.FC<VintageHeaderProps> = ({
  currentUser,
  onLogout,
  onOpenAddModal,
  onOpenAddBrandModal,
  onOpenCampaignGenerator,
  creatorsCount = 0,
  activeCampaignsCount = 0
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-white/[0.08] bg-[#07090F]/85 backdrop-blur-2xl sticky top-0 z-40">
      {/* Top Agentic Status Ribbon */}
      <div className="border-b border-white/[0.05] bg-[#04060B]/80 px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#8E95A5]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="font-semibold text-white tracking-wider uppercase">
              {currentUser.role === 'agency' && 'The I Company · Executive Command Deck'}
              {currentUser.role === 'brand' && `The I Company · Brand Client Portal (${currentUser.name})`}
              {currentUser.role === 'influencer' && `The I Company · Creator Studio (${currentUser.name})`}
            </span>
          </div>
          <span className="text-white/20 hidden md:inline">|</span>
          <span className="hidden md:inline text-[#8E95A5]">
            Session: <span className="text-[#8FA5D9]">{currentUser.email}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#5A6275] hidden sm:inline">IST:</span>
            <span className="text-white font-medium">{time}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[10px] font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-3 h-3 text-[#10B981]" />
            <span>ESCROW SECURED</span>
          </div>
        </div>
      </div>

      {/* Main Agentic Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand Monogram & Title */}
        <div className="flex items-center gap-3.5 select-none">
          {/* Glowing Agentic Emblem */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16213B] to-[#0A0E18] text-white flex items-center justify-center font-bold text-xl tracking-tight shadow-[0_0_20px_rgba(91,139,247,0.35)] border border-[#5B8BF7]/40 relative flex-shrink-0 group">
            <span className="bg-gradient-to-br from-white to-[#8FA5D9] bg-clip-text text-transparent font-serif">I</span>
            <span className="absolute -bottom-1 -right-1 text-[8px] font-mono px-1 py-0.2 bg-[#5B8BF7] text-white rounded font-bold shadow-sm">
              AI
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>The I Company</span>
              </h1>
              <span className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${
                currentUser.role === 'agency'
                  ? 'bg-[#5B8BF7]/15 text-[#8FA5D9] border-[#5B8BF7]/35 shadow-[0_0_10px_rgba(91,139,247,0.15)]'
                  : currentUser.role === 'brand'
                  ? 'bg-[#F43F5E]/15 text-[#FDA4AF] border-[#F43F5E]/35'
                  : 'bg-[#10B981]/15 text-[#6EE7B7] border-[#10B981]/35'
              }`}>
                {currentUser.role === 'agency' && 'SUPER ADMIN'}
                {currentUser.role === 'brand' && 'BRAND CLIENT'}
                {currentUser.role === 'influencer' && 'CREATOR STUDIO'}
              </span>
            </div>
            <p className="text-xs text-[#8E95A5] mt-0.5">
              {currentUser.role === 'agency' && 'Autonomous Talent Intelligence, Verified Media & Escrow Vault'}
              {currentUser.role === 'brand' && `Dedicated Campaign Portfolio for ${currentUser.name}`}
              {currentUser.role === 'influencer' && `Creator Production Desk for ${currentUser.name}`}
            </p>
          </div>
        </div>

        {/* User Identity & Actions */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
          {/* Action buttons for Admin */}
          {currentUser.role === 'agency' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddModal}
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101524] hover:bg-[#161F36] border border-white/10 hover:border-[#5B8BF7]/50 text-[#D7DCEA] hover:text-white text-xs font-medium shadow-vintage-xs transition-all cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5 text-[#5B8BF7]" />
                <span>+ Link Creator</span>
              </button>

              <button
                onClick={onOpenAddBrandModal}
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101524] hover:bg-[#161F36] border border-white/10 hover:border-[#10B981]/50 text-[#D7DCEA] hover:text-white text-xs font-medium shadow-vintage-xs transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>+ Add Brand</span>
              </button>

              <button
                onClick={onOpenCampaignGenerator}
                className="whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5B8BF7] hover:bg-[#4A7AE6] text-white text-xs font-medium shadow-[0_0_20px_rgba(91,139,247,0.4)] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>+ Brief</span>
              </button>
            </div>
          )}

          {/* Action for Brand */}
          {currentUser.role === 'brand' && onOpenCampaignGenerator && (
            <button
              onClick={onOpenCampaignGenerator}
              className="whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5B8BF7] hover:bg-[#4A7AE6] text-white text-xs font-medium shadow-[0_0_20px_rgba(91,139,247,0.4)] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>+ Request Campaign Brief</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Sign out of current workspace"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101524]/60 hover:bg-[#F43F5E]/15 border border-white/10 hover:border-[#F43F5E]/40 text-[#8E95A5] hover:text-[#F43F5E] text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
