import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Cloud, Wind, Flower2 } from 'lucide-react';

export type WallpaperTheme = 'dawn' | 'sky' | 'zen' | 'sakura';

interface PeacefulLiveWallpaperProps {
  currentTheme?: WallpaperTheme;
  onThemeChange?: (theme: WallpaperTheme) => void;
  showSwitcher?: boolean;
}

export const WALLPAPER_PRESETS: Record<WallpaperTheme, {
  name: string;
  icon: string;
  gradient: string;
  bgUrl: string;
  orb1: string;
  orb2: string;
  orb3: string;
  description: string;
  weatherTag: string;
}> = {
  dawn: {
    name: 'Serene Dawn',
    icon: '🌅',
    gradient: 'from-[#FFF7ED] via-[#FEF2F2] to-[#EFF6FF]',
    // High-resolution peaceful daylight sunburst cloudscape
    bgUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80',
    orb1: 'rgba(254, 215, 170, 0.45)', // Warm peach / gold
    orb2: 'rgba(186, 230, 253, 0.45)', // Soft sky cyan
    orb3: 'rgba(254, 205, 211, 0.35)', // Rose dawn
    description: 'Golden hour warmth, gentle horizon & soft daylight mist',
    weatherTag: '☀️ 24°C Serene Dawn · Gentle Light · Pure Vibe'
  },
  sky: {
    name: 'Ethereal Clouds',
    icon: '☁️',
    gradient: 'from-[#F0F9FF] via-[#E0F2FE] to-[#F8FAFC]',
    bgUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2400&q=80',
    orb1: 'rgba(191, 219, 254, 0.50)', // Sky azure
    orb2: 'rgba(165, 243, 252, 0.45)', // Clean cyan
    orb3: 'rgba(224, 231, 255, 0.40)', // Indigo mist
    description: 'Crisp open sky, peaceful drifting clouds & pure daylight breeze',
    weatherTag: '🌤️ 22°C Gentle Breeze · 1014 hPa · Crystal Clear'
  },
  zen: {
    name: 'Zen Meadow',
    icon: '🍃',
    gradient: 'from-[#F0FDF4] via-[#ECFDF5] to-[#F8FAFC]',
    bgUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=2400&q=80',
    orb1: 'rgba(167, 243, 208, 0.45)', // Mint / jade
    orb2: 'rgba(254, 240, 138, 0.35)', // Morning sunlight
    orb3: 'rgba(204, 251, 241, 0.40)', // Morning dew
    description: 'Tranquil emerald morning dew, calm breeze & refreshing stillness',
    weatherTag: '🌿 21°C Tranquil Meadow · Humidity 48% · Zen Air'
  },
  sakura: {
    name: 'Sakura Breeze',
    icon: '🌸',
    gradient: 'from-[#FDF2F8] via-[#FAF5FF] to-[#F8FAFC]',
    bgUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=2400&q=80',
    orb1: 'rgba(251, 207, 232, 0.45)', // Soft blossom pink
    orb2: 'rgba(233, 213, 255, 0.40)', // Calming lavender
    orb3: 'rgba(254, 226, 226, 0.35)', // Warm cream
    description: 'Peaceful pastel blush skies, calming breeze & soothing harmony',
    weatherTag: '🌸 23°C Spring Blossom · Calm 4km/h · Serenity'
  }
};

export const PeacefulLiveWallpaper: React.FC<PeacefulLiveWallpaperProps> = ({
  currentTheme: controlledTheme,
  onThemeChange,
  showSwitcher = false
}) => {
  const [internalTheme, setInternalTheme] = useState<WallpaperTheme>(() => {
    try {
      const saved = localStorage.getItem('the_i_company_wallpaper') as WallpaperTheme;
      return (saved && WALLPAPER_PRESETS[saved]) ? saved : 'dawn';
    } catch {
      return 'dawn';
    }
  });

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const theme = controlledTheme || internalTheme;
  const currentPreset = WALLPAPER_PRESETS[theme] || WALLPAPER_PRESETS.dawn;

  const handleSelectTheme = (newTheme: WallpaperTheme) => {
    setInternalTheme(newTheme);
    try {
      localStorage.setItem('the_i_company_wallpaper', newTheme);
    } catch {
      // ignore local storage error
    }
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
    setIsSwitcherOpen(false);
  };

  // Mote particles for peaceful live presence
  const motes = [
    { left: '10%', delay: '0s', duration: '18s', size: 6 },
    { left: '22%', delay: '4s', duration: '22s', size: 8 },
    { left: '35%', delay: '2s', duration: '16s', size: 5 },
    { left: '48%', delay: '7s', duration: '20s', size: 7 },
    { left: '60%', delay: '1s', duration: '19s', size: 6 },
    { left: '72%', delay: '5s', duration: '24s', size: 8 },
    { left: '85%', delay: '3s', duration: '17s', size: 5 },
    { left: '92%', delay: '8s', duration: '21s', size: 6 },
  ];

  return (
    <>
      {/* Fixed Fullscreen Live Wallpaper Canvas */}
      <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden select-none">
        {/* Layer 1: Base Peaceful Daylight Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentPreset.gradient} transition-colors duration-1000`} />

        {/* Layer 2: Scenic Daylight Landscape Wallpaper with subtle live drift */}
        <div 
          className="absolute inset-0 animate-peaceful-sky transition-opacity duration-1000 opacity-25 mix-blend-multiply"
          style={{
            backgroundImage: `url('${currentPreset.bgUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            filter: 'saturate(130%) brightness(105%)'
          }}
        />

        {/* Layer 3: Soft Daylight Sunlight Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/30 to-transparent" />

        {/* Layer 4: Live Floating Ambient Daylight Orbs (Refracts through Weather Glass) */}
        <div 
          className="absolute -top-32 -left-20 w-[600px] h-[600px] rounded-full blur-[110px] animate-peaceful-orb-1 opacity-90 transition-all duration-1000"
          style={{ backgroundColor: currentPreset.orb1 }}
        />
        <div 
          className="absolute top-1/4 right-0 w-[680px] h-[680px] rounded-full blur-[125px] animate-peaceful-orb-2 opacity-85 transition-all duration-1000"
          style={{ backgroundColor: currentPreset.orb2 }}
        />
        <div 
          className="absolute -bottom-24 left-1/3 w-[640px] h-[640px] rounded-full blur-[115px] animate-peaceful-orb-3 opacity-80 transition-all duration-1000"
          style={{ backgroundColor: currentPreset.orb3 }}
        />

        {/* Layer 5: Peaceful Floating Sun Motes / Dust Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {motes.map((mote, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.9)]"
              style={{
                left: mote.left,
                bottom: '-20px',
                width: `${mote.size}px`,
                height: `${mote.size}px`,
                animation: `peacefulMote ${mote.duration} linear infinite`,
                animationDelay: mote.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating or Inline Live Wallpaper Selector (Weather Card Inspired) */}
      {showSwitcher && (
        <div className="relative">
          <button
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/80 backdrop-blur-xl text-xs font-semibold text-slate-800 shadow-[0_4px_16px_rgba(15,23,42,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all cursor-pointer"
            title="Customize Peaceful Live Wallpaper"
          >
            <span className="text-sm">{currentPreset.icon}</span>
            <span className="hidden sm:inline font-sans">{currentPreset.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </button>

          {isSwitcherOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 p-3 rounded-3xl bg-white/85 backdrop-blur-3xl border border-white/90 shadow-[0_20px_50px_rgba(15,23,42,0.12),inset_0_1.5px_1px_rgba(255,255,255,0.95)] z-50 animate-fade-in space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <span className="text-[11px] font-mono uppercase font-bold text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Peaceful Live Wallpaper</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  LIVE 60FPS
                </span>
              </div>

              <div className="space-y-1.5">
                {(Object.keys(WALLPAPER_PRESETS) as WallpaperTheme[]).map((key) => {
                  const p = WALLPAPER_PRESETS[key];
                  const isActive = theme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectTheme(key)}
                      className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-50/90 border border-blue-200 shadow-sm text-blue-900 font-bold'
                          : 'bg-white/50 hover:bg-white/80 border border-white/60 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl p-1.5 rounded-xl bg-white/80 border border-white shadow-xs">
                          {p.icon}
                        </span>
                        <div>
                          <div className="text-xs font-sans">{p.name}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{p.description}</div>
                        </div>
                      </div>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1 border-t border-slate-100 px-1 text-[10px] text-slate-500 font-mono text-center">
                Refracts through Weather Glassmorphic Cards
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
