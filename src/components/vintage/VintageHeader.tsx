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
  Key,
  Sun
} from 'lucide-react';
import { WallpaperTheme, WALLPAPER_PRESETS } from './PeacefulLiveWallpaper';

interface VintageHeaderProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onOpenAddModal?: () => void;
  onOpenAddBrandModal?: () => void;
  onOpenCampaignGenerator?: () => void;
  creatorsCount?: number;
  activeCampaignsCount?: number;
  currentWallpaper?: WallpaperTheme;
  onWallpaperChange?: (theme: WallpaperTheme) => void;
}

export const VintageHeader: React.FC<VintageHeaderProps> = ({
  currentUser,
  onLogout,
  onOpenAddModal,
  onOpenAddBrandModal,
  onOpenCampaignGenerator,
  creatorsCount = 0,
  activeCampaignsCount = 0,
  currentWallpaper = 'dawn',
  onWallpaperChange
}) => {
  const [time, setTime] = useState<string>('');
  const [isWallpaperMenuOpen, setIsWallpaperMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activePreset = WALLPAPER_PRESETS[currentWallpaper] || WALLPAPER_PRESETS.dawn;

  return (
    <header className="border-b border-white/70 bg-white/45 backdrop-blur-3xl sticky top-0 z-40 shadow-[0_4px_30px_rgba(15,23,42,0.04),inset_0_-1px_1px_rgba(255,255,255,0.7)] transition-all">
      {/* Top Status Ribbon (Weather Card Atmosphere Strip) */}
      <div className="border-b border-white/50 bg-white/25 px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold text-slate-900 tracking-wider uppercase font-sans">
              {currentUser.role === 'agency' && 'The I Company · Executive Command Deck'}
              {currentUser.role === 'brand' && `The I Company · Brand Client Portal (${currentUser.name})`}
              {currentUser.role === 'influencer' && `The I Company · Creator Studio (${currentUser.name})`}
            </span>
          </div>
          <span className="text-slate-300 hidden md:inline">|</span>
          <span className="hidden lg:inline text-slate-500">
            {activePreset.weatherTag}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden sm:inline">IST:</span>
            <span className="text-slate-800 font-bold">{time}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50/80 border border-emerald-200 text-emerald-700 text-[10px] font-bold shadow-xs">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>ESCROW SECURED</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand Monogram & Title */}
        <div className="flex items-center gap-3.5 select-none">
          {/* Luminous Emblem */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl tracking-tight shadow-[0_4px_16px_rgba(37,99,235,0.25)] border border-blue-400/30 relative flex-shrink-0 group">
            <span className="text-white font-serif">I</span>
            <span className="absolute -bottom-1 -right-1 text-[8px] font-mono px-1 py-0.2 bg-slate-900 text-white rounded font-bold shadow-xs">
              AI
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
                <span>The I Company</span>
              </h1>
              <span className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border font-bold ${
                currentUser.role === 'agency'
                  ? 'bg-blue-50 text-blue-700 border-blue-200/80 shadow-xs'
                  : currentUser.role === 'brand'
                  ? 'bg-purple-50 text-purple-700 border-purple-200/80 shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-xs'
              }`}>
                {currentUser.role === 'agency' && 'SUPER ADMIN'}
                {currentUser.role === 'brand' && 'BRAND CLIENT'}
                {currentUser.role === 'influencer' && 'CREATOR STUDIO'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {currentUser.role === 'agency' && 'Autonomous Talent Intelligence, Verified Media & Escrow Vault'}
              {currentUser.role === 'brand' && `Dedicated Campaign Portfolio for ${currentUser.name}`}
              {currentUser.role === 'influencer' && `Creator Production Desk for ${currentUser.name}`}
            </p>
          </div>
        </div>

        {/* User Identity & Actions */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
          {/* Peaceful Live Wallpaper Switcher (Weather Card Style) */}
          <div className="relative">
            <button
              onClick={() => setIsWallpaperMenuOpen(!isWallpaperMenuOpen)}
              className="weather-glass-pod hover:bg-white/70 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold text-slate-800 transition-all cursor-pointer"
              title="Change Peaceful Live Wallpaper"
            >
              <span>{activePreset.icon}</span>
              <span className="hidden sm:inline font-sans">{activePreset.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse ml-0.5" />
            </button>

            {isWallpaperMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 p-2.5 rounded-3xl bg-white/90 backdrop-blur-3xl border border-white/90 shadow-[0_20px_50px_rgba(15,23,42,0.15),inset_0_1.5px_1px_rgba(255,255,255,0.95)] z-50 animate-fade-in space-y-1.5">
                <div className="px-2 py-1 text-[10px] font-mono uppercase font-bold text-slate-500 border-b border-slate-100 flex justify-between items-center">
                  <span>Peaceful Wallpaper</span>
                  <span className="text-emerald-600 font-bold">LIVE 60FPS</span>
                </div>
                {(Object.keys(WALLPAPER_PRESETS) as WallpaperTheme[]).map((key) => {
                  const p = WALLPAPER_PRESETS[key];
                  const isActive = currentWallpaper === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        if (onWallpaperChange) onWallpaperChange(key);
                        setIsWallpaperMenuOpen(false);
                      }}
                      className={`w-full p-2 rounded-2xl flex items-center justify-between text-left text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                          : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{p.icon}</span>
                        <div>
                          <div>{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal line-clamp-1">{p.description}</div>
                        </div>
                      </div>
                      {isActive && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action buttons for Admin */}
          {currentUser.role === 'agency' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddModal}
                className="whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl weather-glass-pod hover:bg-white/80 hover:border-blue-400 text-slate-700 hover:text-blue-600 text-xs font-bold transition-all cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5 text-blue-600" />
                <span>+ Link Creator</span>
              </button>

              <button
                onClick={onOpenAddBrandModal}
                className="whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl weather-glass-pod hover:bg-white/80 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>+ Add Brand</span>
              </button>

              <button
                onClick={onOpenCampaignGenerator}
                className="whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
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
              className="whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>+ Request Campaign Brief</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Sign out of current workspace"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl weather-glass-pod hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
