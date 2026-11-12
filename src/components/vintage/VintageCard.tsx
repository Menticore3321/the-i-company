import React from 'react';

interface VintageCardProps {
  sectionNumber?: string;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const VintageCard: React.FC<VintageCardProps> = ({
  sectionNumber,
  title,
  subtitle,
  badge,
  children,
  className = '',
  action
}) => {
  return (
    <div className={`bg-white/75 backdrop-blur-2xl rounded-2xl border border-white/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04),0_0_0_1px_rgba(255,255,255,0.8)_inset] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.07)] hover:bg-white/85 transition-all duration-300 relative overflow-hidden group ${className}`}>
      {/* Top Luminous Ambient Reflection Accent */}
      <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-blue-500/35 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

      {(title || sectionNumber || badge) && (
        <div className="px-6 py-4.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/40">
          <div>
            {sectionNumber && (
              <span className="font-mono text-[10px] tracking-widest uppercase text-blue-600 font-bold block mb-1">
                {sectionNumber}
              </span>
            )}
            {title && (
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-sans">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {badge && <div>{badge}</div>}
            {action && <div>{action}</div>}
          </div>
        </div>
      )}

      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
