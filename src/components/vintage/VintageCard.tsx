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
    <div className={`weather-glass-card weather-glass-card-hover rounded-3xl relative overflow-hidden group ${className}`}>
      {/* Top Specular Edge Highlight Glint (Weather Card Style) */}
      <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

      {(title || sectionNumber || badge) && (
        <div className="px-6 py-4.5 border-b border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/30 backdrop-blur-md">
          <div>
            {sectionNumber && (
              <span className="font-mono text-[10px] tracking-widest uppercase text-blue-600 font-bold block mb-1">
                {sectionNumber}
              </span>
            )}
            {title && (
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">
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
