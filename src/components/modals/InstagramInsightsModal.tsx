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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C1917]/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-[#E7E2DA] rounded-2xl shadow-vintage-lg text-[#1C1917]">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#FAF8F5] border-b border-[#E7E2DA]">
          <div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#78716C]">
              CREATOR TELEMETRY DOSSIER · ID: {influencer.id.toUpperCase()}
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Instagram Analytics & Valuation
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Top Profile Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={influencer.avatar}
                  alt={influencer.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#1C1917]"
                />
                <span className="absolute bottom-0 right-0 p-1 rounded-full bg-[#1C1917] text-white">
                  <Instagram className="w-3 h-3" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold text-[#1C1917]">{influencer.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-[#2E523E]" />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#78716C]">
                  <span className="font-medium text-[#1C1917]">@{influencer.handle}</span>
                  <span>•</span>
                  <span>{influencer.category}</span>
                  <span>•</span>
                  <span>{influencer.location}</span>
                </div>
                <p className="text-xs text-[#57534E] mt-1 line-clamp-1 italic font-serif">{influencer.bio}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-white text-[#1C1917] border border-[#E2DDD5] text-xs font-medium">
                {influencer.tier}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#EEF5F1] text-[#2E523E] border border-[#D1E3D8] text-xs font-semibold">
                {influencer.authenticityScore}% Verified
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-white border border-[#E7E2DA]">
              <span className="font-mono text-[10px] text-[#78716C] uppercase">FOLLOWERS</span>
              <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
                {(influencer.followers / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-[#2E523E]">+{influencer.progressTrajectory.monthGrowth}% 30d</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E7E2DA]">
              <span className="font-mono text-[10px] text-[#78716C] uppercase">ENGAGEMENT RATE</span>
              <div className="font-serif text-2xl font-bold text-[#2E523E] mt-1">
                {influencer.engagementRate}%
              </div>
              <span className="text-[11px] text-[#78716C]">vs 2.4% industry avg</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E7E2DA]">
              <span className="font-mono text-[10px] text-[#78716C] uppercase">AVG REEL VIEWS</span>
              <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
                {(influencer.avgReelViews / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-[#78716C]">Per 60s video</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E7E2DA]">
              <span className="font-mono text-[10px] text-[#78716C] uppercase">CONSISTENCY</span>
              <div className="font-serif text-2xl font-bold text-[#C25E3E] mt-1">
                {influencer.progressTrajectory.consistencyScore}/100
              </div>
              <span className="text-[11px] text-[#78716C]">High cadence</span>
            </div>
          </div>

          {/* AI Strategic Assessment */}
          <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFECE6]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C25E3E]" />
                <h4 className="font-serif text-base font-semibold text-[#1C1917]">
                  Agency Strategic Assessment & Growth Diagnosis
                </h4>
              </div>
              <span className="text-xs font-mono font-medium text-[#78716C]">Status: {influencer.performanceStatus.toUpperCase()}</span>
            </div>
            <div className="mt-3 p-3.5 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#57534E] leading-relaxed">
              <strong className="text-[#1C1917] font-medium mr-1">Strategic Prescription:</strong>
              {influencer.progressTrajectory.aiRecommendation}
            </div>
          </div>

          {/* Negotiated Rate Card */}
          <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#1C1917]">
              Commercial Rate Card (The I Company Standard)
            </h4>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA]">
                <span className="font-mono text-[10px] text-[#78716C] uppercase">SPONSORED REEL</span>
                <div className="font-serif text-xl font-bold text-[#2E523E] mt-1">
                  ₹{influencer.ratePerReel.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#78716C]">60-90 sec with CTA sticker</span>
              </div>

              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA]">
                <span className="font-mono text-[10px] text-[#78716C] uppercase">STORY CAMPAIGN</span>
                <div className="font-serif text-xl font-bold text-[#1C1917] mt-1">
                  ₹{influencer.ratePerStory.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#78716C]">3-frame sequenced story</span>
              </div>

              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA]">
                <span className="font-mono text-[10px] text-[#78716C] uppercase">STATIC / CAROUSEL</span>
                <div className="font-serif text-xl font-bold text-[#1C1917] mt-1">
                  ₹{influencer.ratePerPost.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#78716C]">Permanent grid feature</span>
              </div>
            </div>
          </div>

          {/* Demographics & Top Cities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender & Age */}
            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] space-y-3">
              <h4 className="font-serif text-sm font-semibold text-[#1C1917]">Audience Demographic Breakdown</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#78716C]">
                  <span>Male: {influencer.audience.gender.male}%</span>
                  <span>Female: {influencer.audience.gender.female}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E7E2DA] overflow-hidden flex">
                  <div className="bg-[#1C1917] h-full" style={{ width: `${influencer.audience.gender.male}%` }} />
                  <div className="bg-[#C25E3E] h-full" style={{ width: `${influencer.audience.gender.female}%` }} />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#EFECE6]">
                {influencer.audience.ageDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-0.5 text-xs">
                    <div className="flex justify-between text-[#78716C]">
                      <span>Age {item.range}</span>
                      <strong className="text-[#1C1917] font-mono">{item.percentage}%</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#E7E2DA] overflow-hidden">
                      <div className="bg-[#1C1917] h-full rounded-full" style={{ width: `${item.percentage * 1.5}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Geographic Clusters */}
            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] space-y-3">
              <h4 className="font-serif text-sm font-semibold text-[#1C1917]">Audience Geographic Hubs</h4>
              <div className="space-y-2">
                {influencer.audience.topCities.map((city, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white border border-[#E7E2DA] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#A8A29E]">0{idx + 1}.</span>
                      <span className="font-medium text-[#1C1917]">{city.city}</span>
                    </div>
                    <span className="font-mono font-semibold text-[#2E523E]">{city.percentage}% of audience</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Content Showcase */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#1C1917]">
              Verified Recent Content & Performance
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {influencer.recentContent.map((post) => (
                <div key={post.id} className="p-3.5 rounded-xl bg-white border border-[#E7E2DA] flex gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#2A2421]">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#2E2824] to-[#1C1917] text-white">
                      <span className="text-[10px] font-mono text-[#D6CFBF]">▶ Reel</span>
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
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[8px] text-white font-mono z-20">
                      {post.type}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between overflow-hidden">
                    <div>
                      <h5 className="text-xs text-[#1C1917] font-medium line-clamp-2">{post.title}</h5>
                      <span className="text-[10px] text-[#A8A29E] mt-0.5 block">{post.postedDaysAgo} days ago</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#78716C] mt-2">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {(post.views / 1000).toFixed(0)}k
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#C25E3E]" />
                        {(post.likes / 1000).toFixed(0)}k
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
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
