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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 border border-white/90 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl text-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4.5 bg-white/80 backdrop-blur-xl border-b border-slate-100">
          <div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-slate-400 font-bold">
              CREATOR TELEMETRY DOSSIER · ID: {influencer.id.toUpperCase()}
            </span>
            <h3 className="font-sans text-xl font-extrabold text-slate-900 tracking-tight">
              Instagram Analytics & Valuation
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Top Profile Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={influencer.avatar}
                  alt={influencer.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white shadow-xs">
                  <Instagram className="w-3 h-3" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-xl font-bold text-slate-900">{influencer.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                  <span className="font-bold text-blue-600 font-mono">@{influencer.handle}</span>
                  <span>•</span>
                  <span className="text-slate-700">{influencer.category}</span>
                  <span>•</span>
                  <span>{influencer.location}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic font-serif">{influencer.bio}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-semibold">
                {influencer.tier}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {influencer.authenticityScore}% Verified
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">FOLLOWERS</span>
              <div className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {(influencer.followers / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-emerald-700 font-bold font-mono">+{influencer.progressTrajectory.monthGrowth}% 30d</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">ENGAGEMENT RATE</span>
              <div className="font-sans text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 font-mono">
                {influencer.engagementRate}%
              </div>
              <span className="text-[11px] text-slate-500 font-medium font-mono">vs 2.4% avg</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">AVG REEL VIEWS</span>
              <div className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {(influencer.avgReelViews / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-slate-500 font-medium font-mono">Per 60s video</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">CONSISTENCY</span>
              <div className="font-sans text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1 font-mono">
                {influencer.progressTrajectory.consistencyScore}/100
              </div>
              <span className="text-[11px] text-slate-500 font-medium font-mono">High cadence</span>
            </div>
          </div>

          {/* AI Strategic Assessment */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="font-sans text-base font-bold text-slate-900">
                  Agency Strategic Assessment & Growth Diagnosis
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Status: {influencer.performanceStatus.toUpperCase()}
              </span>
            </div>
            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <strong className="text-blue-700 font-bold mr-1">Strategic Prescription:</strong>
              {influencer.progressTrajectory.aiRecommendation}
            </div>
          </div>

          {/* Negotiated Rate Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-xs">
            <h4 className="font-sans text-base font-bold text-slate-900">
              Commercial Rate Card (The I Company Standard)
            </h4>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">SPONSORED REEL</span>
                <div className="font-mono text-xl font-extrabold text-emerald-600 mt-1">
                  ₹{influencer.ratePerReel.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">60-90 sec with CTA</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">STORY CAMPAIGN</span>
                <div className="font-mono text-xl font-extrabold text-slate-900 mt-1">
                  ₹{influencer.ratePerStory.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">3-frame story</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">STATIC / CAROUSEL</span>
                <div className="font-mono text-xl font-extrabold text-slate-900 mt-1">
                  ₹{influencer.ratePerPost.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Permanent grid</span>
              </div>
            </div>
          </div>

          {/* Demographics & Top Cities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender & Age */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-xs">
              <h4 className="font-sans text-sm font-bold text-slate-900">Audience Demographic Breakdown</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 font-mono">
                  <span>Male: {influencer.audience.gender.male}%</span>
                  <span>Female: {influencer.audience.gender.female}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                  <div className="bg-blue-600 h-full" style={{ width: `${influencer.audience.gender.male}%` }} />
                  <div className="bg-rose-500 h-full" style={{ width: `${influencer.audience.gender.female}%` }} />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {influencer.audience.ageDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600 font-mono">
                      <span>Age {item.range}</span>
                      <strong className="text-slate-900 font-bold">{item.percentage}%</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${item.percentage * 1.5}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Geographic Clusters */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-xs">
              <h4 className="font-sans text-sm font-bold text-slate-900">Audience Geographic Hubs</h4>
              <div className="space-y-2">
                {influencer.audience.topCities.map((city, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 font-bold">0{idx + 1}.</span>
                      <span className="font-bold text-slate-800">{city.city}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">{city.percentage}% of audience</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Content Showcase */}
          <div className="space-y-3">
            <h4 className="font-sans text-base font-bold text-slate-900">
              Verified Recent Content & Performance
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {influencer.recentContent.map((post) => (
                <div key={post.id} className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex gap-3 hover:border-blue-300 transition-colors shadow-xs">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950 text-slate-300">
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
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-black/80 text-[8px] text-white font-mono z-20 border border-white/20">
                      {post.type}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between overflow-hidden">
                    <div>
                      <h5 className="text-xs text-slate-900 font-bold line-clamp-2 leading-tight">{post.title}</h5>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{post.postedDaysAgo} days ago</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600 mt-2">
                      <span className="flex items-center gap-1 font-semibold">
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        {(post.views / 1000).toFixed(0)}k
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-rose-600">
                        <Heart className="w-3.5 h-3.5" />
                        {(post.likes / 1000).toFixed(0)}k
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
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
