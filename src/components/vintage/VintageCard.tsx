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
    <div className={`bg-white rounded-xl border border-[#E7E2DA] shadow-vintage-sm hover:shadow-vintage-md transition-all duration-300 relative overflow-hidden ${className}`}>
      {/* Optional top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#E7E2DA] to-transparent" />

      {(title || sectionNumber || badge) && (
        <div className="px-5 py-4 border-b border-[#F0ECE4] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FCFAF7]/60">
          <div>
            {sectionNumber && (
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#A8A29E] block mb-0.5">
                {sectionNumber}
              </span>
            )}
            {title && (
              <h3 className="font-serif text-lg font-semibold text-[#1C1917] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#78716C] mt-0.5 font-sans leading-relaxed">
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

      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

