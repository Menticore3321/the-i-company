import React, { useState, useEffect } from 'react';
import { UserAccount } from '../../types';
import { 
  ShieldCheck, 
  Sparkles, 
  Instagram, 
  Building2, 
  LogOut, 
  Sliders,
  ChevronDown
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
  currentWallpaper = 'dawn',
  onWallpaperChange
}) => {
  const [isWallpaperMenuOpen, setIsWallpaperMenuOpen] = useState(false);
  const [opacity, setOpacity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('the_i_company_wallpaper_opacity');
      return saved ? Number(saved) : 85;
    } catch {
      return 85;
    }
  });

  const handleOpacityChange = (val: number) => {
    setOpacity(val);
    try {
      localStorage.setItem('the_i_company_wallpaper_opacity', String(val));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('wallpaper-opacity-change', { detail: { opacity: val } }));
  };

  const activePreset = WALLPAPER_PRESETS[currentWallpaper] || WALLPAPER_PRESETS.dawn;

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/40 backdrop-blur-2xl shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition-all">
      {/* Top Specular Glint Highlight */}
      <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand & Workspace Identity */}
        <div className="flex items-center gap-3 select-none">
          {/* Official Emblem Logo */}
          <div className="w-9 h-9 rounded-xl bg-white/80 p-1 flex items-center justify-center shadow-[0_2px_10px_rgba(15,23,42,0.06)] border border-white/90 flex-shrink-0">
            <img 
              src="/logo-icon.png" 
              alt="The I Company" 
              className="w-full h-full object-contain" 
            />
          </div>

          <div className="flex items-center gap-2.5">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 font-sans">
              The I Company
            </h1>
            <span className={`text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full border shadow-xs ${
              currentUser.role === 'agency'
                ? 'bg-blue-50/90 text-blue-700 border-blue-200/80'
                : currentUser.role === 'brand'
                ? 'bg-purple-50/90 text-purple-700 border-purple-200/80'
                : 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80'
            }`}>
              {currentUser.role === 'agency' && 'Admin Deck'}
              {currentUser.role === 'brand' && 'Brand Portal'}
              {currentUser.role === 'influencer' && 'Creator Studio'}
            </span>
          </div>
        </div>

        {/* Center: Weather Atmosphere Pill */}
        <div className="relative">
          <button
            onClick={() => setIsWallpaperMenuOpen(!isWallpaperMenuOpen)}
            className="weather-glass-pod hover:bg-white/80 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-xs"
            title="Atmosphere & Live Wallpaper Controls"
          >
            <span>{activePreset.icon}</span>
            <span className="hidden md:inline font-sans">{activePreset.name}</span>
            <span className="text-[10px] text-slate-400 font-mono hidden lg:inline">({opacity}%)</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isWallpaperMenuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3.5 rounded-3xl bg-white/95 backdrop-blur-3xl border border-white/90 shadow-[0_20px_50px_rgba(15,23,42,0.15)] z-50 animate-fade-in space-y-3">
              <div className="px-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex justify-between items-center">
                <span>Scenic Atmosphere</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                  LIVE
                </span>
              </div>

              {/* Opacity Slider */}
              <div className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-[11px]">
                    <Sliders className="w-3 h-3 text-blue-600" />
                    <span>Wallpaper Opacity</span>
                  </span>
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 text-[10px]">
                    {opacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={opacity}
                  onChange={(e) => handleOpacityChange(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
              </div>

              {/* Theme Presets */}
              <div className="space-y-1">
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
                      className={`w-full p-2 rounded-xl flex items-center justify-between text-left text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-50/90 text-blue-900 font-bold border border-blue-200 shadow-xs'
                          : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{p.icon}</span>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal line-clamp-1">{p.description}</div>
                        </div>
                      </div>
                      {isActive && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions & User Menu */}
        <div className="flex items-center gap-2.5">
          {/* Admin Primary Action */}
          {currentUser.role === 'agency' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-[0_4px_14px_rgba(37,99,235,0.2)] transition-all cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>+ Link Creator</span>
              </button>

              <button
                onClick={onOpenAddBrandModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl weather-glass-pod hover:bg-white/80 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>+ Add Brand</span>
              </button>
            </div>
          )}

          {/* Brand Primary Action */}
          {currentUser.role === 'brand' && onOpenCampaignGenerator && (
            <button
              onClick={onOpenCampaignGenerator}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-[0_4px_14px_rgba(37,99,235,0.2)] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ New Campaign Brief</span>
            </button>
          )}

          {/* User Email & Sign Out */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/60">
            <span className="text-xs text-slate-600 font-medium hidden lg:inline px-1">
              {currentUser.email}
            </span>

            <button
              onClick={onLogout}
              title="Sign out of workspace"
              className="p-1.5 rounded-xl weather-glass-pod hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
