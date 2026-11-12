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
    <div className={`bg-[#0B0E17]/85 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:border-white/20 transition-all duration-300 relative overflow-hidden group ${className}`}>
      {/* Top Luminous Ambient Accent */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#5B8BF7]/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

      {(title || sectionNumber || badge) && (
        <div className="px-6 py-4.5 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02]">
          <div>
            {sectionNumber && (
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#8FA5D9] font-semibold block mb-1">
                {sectionNumber}
              </span>
            )}
            {title && (
              <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#8E95A5] mt-0.5 leading-relaxed">
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
