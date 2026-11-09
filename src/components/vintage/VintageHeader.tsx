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
    <header className="border-b border-[#E7E2DA] bg-[#FBF9F5]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Heritage Ribbon */}
      <div className="border-b border-[#EFECE6] bg-[#F7F4EE] px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#78716C]">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-[#2E523E]" />
          <span className="font-semibold text-[#1C1917] tracking-wider uppercase">
            {currentUser.role === 'agency' && 'The I Company · Executive Admin Deck'}
            {currentUser.role === 'brand' && `The I Company · Brand Client Portal (${currentUser.name})`}
            {currentUser.role === 'influencer' && `The I Company · Creator Studio (${currentUser.name})`}
          </span>
          <span className="text-[#D6CFBF] hidden md:inline">|</span>
          <span className="hidden md:inline text-[#78716C]">
            Status: Authenticated Session · {currentUser.email}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#A8A29E] hidden sm:inline">IST:</span>
            <span className="text-[#1C1917] font-medium">{time}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#EEF5F1] border border-[#D1E3D8] text-[#2E523E] text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 text-[#2E523E]" />
            <span>ESCROW SECURED</span>
          </div>
        </div>
      </div>

      {/* Main Vintage Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand Monogram & Title */}
        <div className="flex items-center gap-3.5 select-none">
          {/* Atelier Seal */}
          <div className="w-10 h-10 rounded-lg bg-[#1C1917] text-[#FBF9F5] flex items-center justify-center font-serif text-xl font-bold tracking-tight shadow-vintage-sm border border-[#3E3834] relative flex-shrink-0">
            <span>I</span>
            <span className="absolute -bottom-1 -right-1 text-[8px] font-mono px-1 py-0.2 bg-[#C25E3E] text-white rounded font-bold">
              EST.26
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif text-xl font-bold tracking-tight text-[#1C1917]">
                The I Company
              </h1>
              <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border ${
                currentUser.role === 'agency'
                  ? 'bg-[#EEF5F1] text-[#2E523E] border-[#D1E3D8]'
                  : currentUser.role === 'brand'
                  ? 'bg-[#FDF3EE] text-[#C25E3E] border-[#F2DACF]'
                  : 'bg-[#FDF8EC] text-[#B8860B] border-[#F5E6BD]'
              }`}>
                {currentUser.role === 'agency' && 'SUPER ADMIN'}
                {currentUser.role === 'brand' && 'BRAND CLIENT'}
                {currentUser.role === 'influencer' && 'CREATOR PORTFOLIO'}
              </span>
            </div>
            <p className="text-xs text-[#78716C] font-sans">
              {currentUser.role === 'agency' && 'Executive Administration, Talent Roster & Escrow Vault'}
              {currentUser.role === 'brand' && `Dedicated Campaign Portfolio for ${currentUser.name}`}
              {currentUser.role === 'influencer' && `Creator Production Desk for ${currentUser.name}`}
            </p>
          </div>
        </div>

        {/* User Identity & Actions */}
        <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
          {/* Action buttons for Admin */}
          {currentUser.role === 'agency' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddModal}
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F5F2EB] border border-[#E2DDD5] text-[#1C1917] text-xs font-sans font-medium shadow-vintage-sm transition-all"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C25E3E]" />
                <span>+ Link Creator</span>
              </button>

              <button
                onClick={onOpenAddBrandModal}
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F5F2EB] border border-[#E2DDD5] text-[#1C1917] text-xs font-sans font-medium shadow-vintage-sm transition-all"
              >
                <Building2 className="w-3.5 h-3.5 text-[#2E523E]" />
                <span>+ Add Brand</span>
              </button>

              <button
                onClick={onOpenCampaignGenerator}
                className="whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white text-xs font-sans font-medium shadow-vintage-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E7E2DA]" />
                <span>+ Brief</span>
              </button>
            </div>
          )}

          {/* Action for Brand */}
          {currentUser.role === 'brand' && onOpenCampaignGenerator && (
            <button
              onClick={onOpenCampaignGenerator}
              className="whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white text-xs font-sans font-medium shadow-vintage-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E7E2DA]" />
              <span>+ Request Campaign Brief</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Sign out of current workspace"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#FDF3EE] border border-[#E2DDD5] hover:border-[#F2DACF] text-xs font-medium text-[#78716C] hover:text-[#C25E3E] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
