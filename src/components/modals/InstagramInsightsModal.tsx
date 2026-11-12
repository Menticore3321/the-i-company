import React from 'react';
import { Influencer } from '../../types';
import { 
  X, 
  Instagram, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  CheckCircle2, 
  MapPin, 
  Sparkles,
  Award,
  DollarSign
} from 'lucide-react';

interface InstagramInsightsModalProps {
  influencer: Influencer | null;
  onClose: () => void;
  onAssignToCampaign?: (influencer: Influencer) => void;
}

export const InstagramInsightsModal: React.FC<InstagramInsightsModalProps> = ({
  influencer,
  onClose,
  onAssignToCampaign
}) => {
  if (!influencer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#020307]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0B0E17]/95 border border-white/10 rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-[#D7DCEA] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#5B8BF7] to-transparent" />
        
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#07090F]/90 backdrop-blur-xl border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#7189BA]">
              CREATOR TELEMETRY DOSSIER · ID: {influencer.id.toUpperCase()}
            </span>
            <h3 className="font-sans text-lg font-bold text-white tracking-tight">
              Instagram Analytics & Valuation
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8FA5D9] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Top Profile Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#07090F]/80 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={influencer.avatar}
                  alt={influencer.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#5B8BF7]/60 shadow-[0_0_16px_rgba(91,139,247,0.3)]"
                />
                <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white">
                  <Instagram className="w-3 h-3" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-xl font-bold text-white">{influencer.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#8FA5D9]/80 font-sans">
                  <span className="font-medium text-white">@{influencer.handle}</span>
                  <span>•</span>
                  <span>{influencer.category}</span>
                  <span>•</span>
                  <span>{influencer.location}</span>
                </div>
                <p className="text-xs text-[#8FA5D9]/70 mt-1 line-clamp-1 italic">{influencer.bio}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/5 text-[#8FA5D9] border border-white/10 text-xs font-mono font-medium">
                {influencer.tier}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-mono font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                {influencer.authenticityScore}% Verified
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-[#07090F]/70 border border-white/[0.08]">
              <span className="font-mono text-[10px] text-[#7189BA] uppercase">FOLLOWERS</span>
              <div className="font-sans text-2xl font-bold text-white mt-1">
                {(influencer.followers / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-[#10B981] font-mono">+{influencer.progressTrajectory.monthGrowth}% 30d</span>
            </div>

            <div className="p-4 rounded-xl bg-[#07090F]/70 border border-white/[0.08]">
              <span className="font-mono text-[10px] text-[#7189BA] uppercase">ENGAGEMENT RATE</span>
              <div className="font-sans text-2xl font-bold text-[#10B981] mt-1">
                {influencer.engagementRate}%
              </div>
              <span className="text-[11px] text-[#7189BA] font-mono">vs 2.4% avg</span>
            </div>

            <div className="p-4 rounded-xl bg-[#07090F]/70 border border-white/[0.08]">
              <span className="font-mono text-[10px] text-[#7189BA] uppercase">AVG REEL VIEWS</span>
              <div className="font-sans text-2xl font-bold text-white mt-1">
                {(influencer.avgReelViews / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-[#7189BA] font-mono">Per 60s video</span>
            </div>

            <div className="p-4 rounded-xl bg-[#07090F]/70 border border-white/[0.08]">
              <span className="font-mono text-[10px] text-[#7189BA] uppercase">CONSISTENCY</span>
              <div className="font-sans text-2xl font-bold text-[#5B8BF7] mt-1">
                {influencer.progressTrajectory.consistencyScore}/100
              </div>
              <span className="text-[11px] text-[#7189BA] font-mono">High cadence</span>
            </div>
          </div>

          {/* AI Strategic Assessment */}
          <div className="p-5 rounded-xl bg-[#07090F]/80 border border-white/10">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5B8BF7]" />
                <h4 className="font-sans text-base font-semibold text-white">
                  Agency Strategic Assessment & Growth Diagnosis
                </h4>
              </div>
              <span className="text-xs font-mono font-medium text-[#7189BA]">Status: {influencer.performanceStatus.toUpperCase()}</span>
            </div>
            <div className="mt-3 p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#D7DCEA] leading-relaxed">
              <strong className="text-[#5B8BF7] font-medium mr-1">Strategic Prescription:</strong>
              {influencer.progressTrajectory.aiRecommendation}
            </div>
          </div>

          {/* Negotiated Rate Card */}
          <div className="p-5 rounded-xl bg-[#07090F]/80 border border-white/10 space-y-3">
            <h4 className="font-sans text-base font-semibold text-white">
              Commercial Rate Card (The I Company Standard)
            </h4>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="font-mono text-[10px] text-[#7189BA] uppercase">SPONSORED REEL</span>
                <div className="font-mono text-xl font-bold text-[#10B981] mt-1">
                  ₹{influencer.ratePerReel.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#8FA5D9]/70 font-mono">60-90 sec with CTA</span>
              </div>

              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="font-mono text-[10px] text-[#7189BA] uppercase">STORY CAMPAIGN</span>
                <div className="font-mono text-xl font-bold text-white mt-1">
                  ₹{influencer.ratePerStory.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#8FA5D9]/70 font-mono">3-frame story</span>
              </div>

              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="font-mono text-[10px] text-[#7189BA] uppercase">STATIC / CAROUSEL</span>
                <div className="font-mono text-xl font-bold text-white mt-1">
                  ₹{influencer.ratePerPost.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#8FA5D9]/70 font-mono">Permanent grid</span>
              </div>
            </div>
          </div>

          {/* Demographics & Top Cities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender & Age */}
            <div className="p-5 rounded-xl bg-[#07090F]/80 border border-white/10 space-y-3">
              <h4 className="font-sans text-sm font-semibold text-white">Audience Demographic Breakdown</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#8FA5D9] font-mono">
                  <span>Male: {influencer.audience.gender.male}%</span>
                  <span>Female: {influencer.audience.gender.female}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
                  <div className="bg-[#5B8BF7] h-full" style={{ width: `${influencer.audience.gender.male}%` }} />
                  <div className="bg-[#F43F5E] h-full" style={{ width: `${influencer.audience.gender.female}%` }} />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                {influencer.audience.ageDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between text-[#8FA5D9] font-mono">
                      <span>Age {item.range}</span>
                      <strong className="text-white">{item.percentage}%</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="bg-[#5B8BF7] h-full rounded-full" style={{ width: `${item.percentage * 1.5}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Geographic Clusters */}
            <div className="p-5 rounded-xl bg-[#07090F]/80 border border-white/10 space-y-3">
              <h4 className="font-sans text-sm font-semibold text-white">Audience Geographic Hubs</h4>
              <div className="space-y-2">
                {influencer.audience.topCities.map((city, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#7189BA]">0{idx + 1}.</span>
                      <span className="font-medium text-white">{city.city}</span>
                    </div>
                    <span className="font-mono font-semibold text-[#10B981]">{city.percentage}% of audience</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Content Showcase */}
          <div className="space-y-3">
            <h4 className="font-sans text-base font-semibold text-white">
              Verified Recent Content & Performance
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {influencer.recentContent.map((post) => (
                <div key={post.id} className="p-3.5 rounded-xl bg-[#07090F]/80 border border-white/10 flex gap-3 hover:border-[#5B8BF7]/50 transition-colors">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#020307]">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0B0E17] to-[#020307] text-[#8FA5D9]">
                      <span className="text-[10px] font-mono">▶ Reel</span>
                    </div>
                    <img 
                      src={post.thumbnail} 
                      alt={post.title} 
                      referrerPolicy="no-referrer"
                      className="relative z-10 w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const shortcodeMatch = post.url?.match(/\/reel\/([a-zA-Z0-9_-]+)/);
                        const shortcode = shortcodeMatch ? shortcodeMatch[1] : '';
                        if (shortcode && !target.src.includes('thumbnail')) {
                          target.src = `/api/thumbnail?shortcode=${shortcode}`;
                        } else if (shortcode && !target.src.includes('onrender.com')) {
                          target.src = `https://the-i-company-scraper.onrender.com/thumbnail?shortcode=${shortcode}`;
                        }
                      }}
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-black/80 text-[8px] text-white font-mono z-20 border border-white/10">
                      {post.type}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between overflow-hidden">
                    <div>
                      <h5 className="text-xs text-white font-medium line-clamp-2 leading-tight">{post.title}</h5>
                      <span className="text-[10px] text-[#7189BA] font-mono mt-0.5 block">{post.postedDaysAgo} days ago</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#8FA5D9] mt-2">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#7189BA]" />
                        {(post.views / 1000).toFixed(0)}k
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#F43F5E]" />
                        {(post.likes / 1000).toFixed(0)}k
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-[#7189BA]" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
