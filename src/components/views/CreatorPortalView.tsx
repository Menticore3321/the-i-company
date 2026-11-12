import React, { useState } from 'react';
import { Influencer, Campaign, CampaignDeliverable } from '../../types';
import { VintageCard } from '../vintage/VintageCard';
import { 
  Instagram, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Sparkles, 
  UploadCloud, 
  Link2, 
  Send, 
  Wallet, 
  ShieldCheck, 
  Award,
  AlertCircle,
  FileText,
  ExternalLink,
  Play,
  Eye,
  Heart,
  MessageCircle,
  Users,
  MapPin
} from 'lucide-react';

interface CreatorPortalViewProps {
  creator: Influencer;
  campaigns: Campaign[];
  onSubmitDeliverableUrl: (campaignId: string, deliverableId: string, url: string) => void;
  onRequestPayout: (amount: number) => void;
  onOpenContract?: (campaign: Campaign) => void;
}

function formatFollowerCount(num: number): string {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toLocaleString();
}

export const CreatorPortalView: React.FC<CreatorPortalViewProps> = ({
  creator,
  campaigns,
  onSubmitDeliverableUrl,
  onRequestPayout,
  onOpenContract
}) => {
  const [inputUrls, setInputUrls] = useState<Record<string, string>>({});
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Find all deliverables assigned to this creator across campaigns
  const myDeliverables: { campaign: Campaign; deliverable: CampaignDeliverable }[] = [];
  campaigns.forEach((camp) => {
    camp.deliverables.forEach((del) => {
      if (del.influencerId === creator.id || del.influencerHandle.toLowerCase() === creator.handle.toLowerCase()) {
        myDeliverables.push({ campaign: camp, deliverable: del });
      }
    });
  });

  const totalEarnings = myDeliverables.reduce((sum, d) => sum + d.deliverable.agreedPayout, 0);
  const completedEarnings = myDeliverables
    .filter(d => d.deliverable.status === 'live' || d.deliverable.status === 'approved')
    .reduce((sum, d) => sum + d.deliverable.agreedPayout, 0);
  const inEscrow = totalEarnings - completedEarnings;

  const handleSubmitUrl = (campaignId: string, deliverableId: string) => {
    const url = inputUrls[deliverableId];
    if (!url || !url.trim()) return;
    onSubmitDeliverableUrl(campaignId, deliverableId, url);
    setInputUrls(prev => ({ ...prev, [deliverableId]: '' }));
  };

  const cleanHandle = creator.handle.replace('@', '').trim();
  const recentReels = creator.recentContent || [];

  return (
    <div className="space-y-6">
      {/* Creator Profile Header */}
      <div className="p-6 rounded-2xl bg-[#0B0E17]/85 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5B8BF7]/50 to-transparent" />
        
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#5B8BF7]/60 shadow-[0_0_16px_rgba(91,139,247,0.3)]"
            />
            <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white shadow-md">
              <Instagram className="w-3 h-3" />
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7189BA]">
                TALENT ACCOUNT ·
              </span>
              <h2 className="font-sans text-xl sm:text-2xl font-bold text-white tracking-tight">{creator.name}</h2>
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-medium text-[#8FA5D9]">
                {creator.tier}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[10px] font-mono font-semibold text-[#10B981] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                {creator.authenticityScore}% Verified
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8FA5D9]/80 mt-1.5 font-sans">
              <a
                href={`https://instagram.com/${cleanHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white hover:text-[#5B8BF7] flex items-center gap-1 transition-colors"
              >
                <span>@{cleanHandle}</span>
                <ExternalLink className="w-3 h-3 text-[#7189BA]" />
              </a>
              <span>·</span>
              <span className="text-[#D7DCEA]">{creator.category}</span>
              <span>·</span>
              <span className="text-[#8FA5D9]">{creator.location}</span>
            </div>

            {creator.bio && (
              <p className="text-xs text-[#8FA5D9]/70 italic mt-2 max-w-2xl line-clamp-2">
                "{creator.bio}"
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-stretch lg:self-auto">
          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
            <span className="text-[10px] text-[#7189BA] block uppercase">Talent Access Email</span>
            <strong className="text-white text-[11px]">{creator.loginEmail || `${cleanHandle}@creators.theicompany.com`}</strong>
          </div>
          <a
            href={`https://instagram.com/${cleanHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#5B8BF7] hover:bg-[#4F75E8] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(91,139,247,0.35)] transition-all"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Open Instagram Profile</span>
          </a>
        </div>
      </div>

      {/* Creator Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B0E17]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5B8BF7]/30 to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] block">AUDIENCE REACH</span>
          <div className="font-sans text-2xl font-bold text-white mt-1 tracking-tight">
            {formatFollowerCount(creator.followers)}
          </div>
          <span className="text-[11px] text-[#10B981] mt-1 block font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            {creator.engagementRate}% Engagement Rate
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E17]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5B8BF7]/30 to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] block">AVG REEL PERFORMANCE</span>
          <div className="font-sans text-2xl font-bold text-white mt-1 tracking-tight">
            ~{formatFollowerCount(creator.avgReelViews)} views
          </div>
          <span className="text-[11px] text-[#8FA5D9]/70 mt-1 block font-mono">
            ~{formatFollowerCount(creator.avgLikes)} likes · ~{creator.avgComments} comments
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E17]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5B8BF7]/30 to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] block">COMMERCIAL RATE CARD</span>
          <div className="font-sans text-2xl font-bold text-white mt-1 tracking-tight">
            ₹{creator.ratePerReel.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#8FA5D9]/70 mt-1 block font-mono">
            Story: ₹{(creator.ratePerStory / 1000).toFixed(0)}k · Post: ₹{(creator.ratePerPost / 1000).toFixed(0)}k
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E17]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/40 to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] block">CLEARED ESCROW BALANCE</span>
          <div className="font-sans text-2xl font-bold text-[#10B981] mt-1 tracking-tight flex items-center gap-1.5">
            ₹{completedEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#8FA5D9]/70 mt-1 block font-mono">
            ₹{inEscrow.toLocaleString()} in escrow pending review
          </span>
        </div>
      </div>

      {/* SECTION I · VERIFIED RECENT CONTENT & REEL DELIVERABLES (The Scraped Live Reels) */}
      <VintageCard
        sectionNumber="SECTION I · VERIFIED MEDIA DOSSIER"
        title={`Recent Content & Live Instagram Reels (${recentReels.length})`}
        subtitle="Real-time extracted deliverables from creator profile with exact views, engagement, and working video posters"
      >
        {recentReels.length === 0 ? (
          <div className="p-8 text-center bg-[#07090F]/60 rounded-xl border border-dashed border-white/10 text-[#8FA5D9] text-xs">
            <Play className="w-8 h-8 text-[#7189BA] mx-auto mb-2 opacity-50" />
            <p className="font-sans text-base font-semibold text-white">No Live Reels Attached</p>
            <p className="text-xs text-[#8FA5D9]/70 mt-1 font-mono">
              Ask your Agency Administrator to run the live Chromium reel extraction for @{cleanHandle}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {recentReels.map((item) => (
              <div
                key={item.id}
                className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#07090F]/80 flex flex-col group hover:border-[#5B8BF7]/60 hover:shadow-[0_0_24px_rgba(91,139,247,0.2)] transition-all"
              >
                {/* Reel Thumbnail with Fail-Safe Proxy */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#020307]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#0B0E17] to-[#020307] text-[#8FA5D9]">
                    <Play className="w-6 h-6 text-[#5B8BF7]/70 mb-1" />
                    <span className="text-[9px] font-mono text-[#7189BA] line-clamp-2">{item.title}</span>
                  </div>

                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const shortcodeMatch = item.url?.match(/\/reel\/([a-zA-Z0-9_-]+)/);
                      const shortcode = shortcodeMatch ? shortcodeMatch[1] : '';
                      if (shortcode && !target.src.includes('thumbnail')) {
                        target.src = `/api/thumbnail?shortcode=${shortcode}`;
                      } else if (shortcode && !target.src.includes('onrender.com')) {
                        target.src = `https://the-i-company-scraper.onrender.com/thumbnail?shortcode=${shortcode}`;
                      }
                    }}
                  />

                  {/* Reel Type Tag */}
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] text-[#8FA5D9] font-mono flex items-center gap-1 z-20 border border-white/10">
                    <span>{item.type === 'Reel' ? '▶' : item.type === 'Carousel' ? '📷' : '🖼️'}</span>
                    <span>{item.type}</span>
                  </div>

                  {/* Bottom Stats Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-[10px] text-white font-mono flex items-center justify-between z-20">
                    <span className="font-semibold text-white">{formatFollowerCount(item.views || item.likes)} views</span>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-full bg-white/10 hover:bg-[#5B8BF7] text-white transition-colors"
                        title="Open on Instagram"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <p className="text-[11px] text-[#D7DCEA] font-medium line-clamp-2 leading-tight">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-[#7189BA] font-mono mt-2 pt-1.5 border-t border-white/[0.06]">
                    <span>{item.postedDaysAgo}d ago</span>
                    <span className="text-[#10B981] font-semibold">{item.engagement}% ER</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </VintageCard>

      {/* SECTION II · AUDIENCE DEMOGRAPHICS & BRAND MATCH */}
      {creator.audience && (
        <VintageCard
          sectionNumber="SECTION II · AUDIENCE DEMOGRAPHICS"
          title="Follower Composition & Engagement Analytics"
          subtitle="Audience distribution across demographic brackets, metro hubs, and trajectory consistency"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gender Split */}
            <div className="p-4 rounded-xl bg-[#07090F]/70 border border-white/[0.08] space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] font-semibold block">
                GENDER CONCENTRATION
              </span>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-sans">
                    <span className="text-[#D7DCEA]">Female</span>
                    <span className="font-mono font-bold text-white">{creator.audience.gender.female}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#F43F5E] to-[#FB7185] rounded-full" style={{ width: `${creator.audience.gender.female}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-sans">
                    <span className="text-[#D7DCEA]">Male</span>
                    <span className="font-mono font-bold text-white">{creator.audience.gender.male}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#5B8BF7] to-[#7189BA] rounded-full" style={{ width: `${creator.audience.gender.male}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Geographic Hubs */}
            <div className="p-4 rounded-xl bg-[#07090F]/70 border border-white/[0.08] space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] font-semibold block">
                TOP INDIAN METRO HUBS
              </span>
              <div className="space-y-1.5">
                {creator.audience.topCities.map((city, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.06] last:border-0 font-sans">
                    <span className="text-[#D7DCEA] flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#5B8BF7]" />
                      {city.city}
                    </span>
                    <span className="font-mono font-semibold text-white">{city.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth & Consistency Trajectory */}
            <div className="p-4 rounded-xl bg-[#07090F]/70 border border-white/[0.08] space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] font-semibold block">
                PORTFOLIO TRAJECTORY
              </span>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-[#8FA5D9]/80">Weekly Momentum:</span>
                  <span className="font-mono font-semibold text-[#10B981]">+{creator.progressTrajectory.weekGrowth}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-[#8FA5D9]/80">Monthly Momentum:</span>
                  <span className="font-mono font-semibold text-[#10B981]">+{creator.progressTrajectory.monthGrowth}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-[#8FA5D9]/80">Consistency Score:</span>
                  <span className="font-mono font-semibold text-white">{creator.progressTrajectory.consistencyScore}/100</span>
                </div>
              </div>
              <p className="text-[11px] text-[#7189BA] italic font-sans pt-1">
                Recommendation: {creator.progressTrajectory.aiRecommendation}
              </p>
            </div>
          </div>
        </VintageCard>
      )}

      {/* SECTION III · ASSIGNED DELIVERABLES & MISSIONS */}
      <VintageCard
        sectionNumber="SECTION III · CONTRACTED MISSIONS"
        title="Assigned Deliverables & Content Submission"
        subtitle="Submit drafted content links for brand review and trigger instant escrow release"
      >
        {myDeliverables.length === 0 ? (
          <div className="p-8 text-center bg-[#07090F]/60 rounded-xl border border-dashed border-white/10 text-[#8FA5D9] text-xs">
            <Clock className="w-8 h-8 text-[#7189BA] mx-auto mb-2 opacity-50" />
            <p className="font-sans text-base font-semibold text-white">No Active Deliverables Pending</p>
            <p className="text-xs text-[#8FA5D9]/70 mt-1 font-mono">
              Your profile is verified. When agency brands assign campaigns to @{cleanHandle}, they appear here for draft submission.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myDeliverables.map(({ campaign, deliverable: del }) => (
              <div
                key={del.id}
                className="p-5 rounded-xl bg-[#07090F]/80 border border-white/10 hover:border-[#5B8BF7]/40 transition-all space-y-3 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B8BF7] font-semibold">
                      {campaign.brandName}
                    </span>
                    <h4 className="font-sans text-lg font-bold text-white mt-0.5 tracking-tight">{campaign.name}</h4>
                    <p className="text-xs text-[#7189BA] font-mono">Format: {del.type} · Deadline: {del.dueDate}</p>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <span className="text-xs text-[#7189BA] block">Contracted Compensation:</span>
                    <div className="font-mono text-lg font-bold text-[#10B981]">
                      ₹{del.agreedPayout.toLocaleString()}
                    </div>
                    {onOpenContract && (
                      <button
                        onClick={() => onOpenContract(campaign)}
                        className="mt-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-[#5B8BF7] hover:text-white text-[11px] font-medium text-[#D7DCEA] flex items-center gap-1.5 transition-all"
                      >
                        <FileText className="w-3 h-3 text-[#5B8BF7]" />
                        <span>View Deal Voucher (TDS)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Submission State */}
                {del.status === 'pending' && (
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="url"
                      placeholder="Paste your unlisted Instagram Reel URL or draft link..."
                      value={inputUrls[del.id] || ''}
                      onChange={(e) => setInputUrls({ ...inputUrls, [del.id]: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#5B8BF7] focus:bg-black/60 transition-colors"
                    />
                    <button
                      onClick={() => handleSubmitUrl(campaign.id, del.id)}
                      className="px-4 py-2.5 rounded-xl bg-[#5B8BF7] hover:bg-[#4F75E8] text-white font-medium text-xs shadow-[0_0_16px_rgba(91,139,247,0.3)] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Draft Link</span>
                    </button>
                  </div>
                )}

                {del.status === 'draft_submitted' && (
                  <div className="p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-between text-xs text-[#F59E0B]">
                    <span>Draft submitted to {campaign.brandName}. Review in progress.</span>
                    <span className="font-medium text-[11px] underline cursor-pointer hover:text-white" onClick={() => window.open(del.submittedUrl, '_blank')}>
                      View Submitted Link
                    </span>
                  </div>
                )}

                {del.status === 'live' && (
                  <div className="p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-between text-xs text-[#10B981]">
                    <span className="font-medium">Approved & Live on Instagram · Escrow Cleared</span>
                    <span className="font-mono font-semibold">Live in Portfolio</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </VintageCard>

      {/* SECTION IV · TALENT WALLET & BANK PAYOUTS */}
      <VintageCard
        sectionNumber="SECTION IV · TALENT WALLET"
        title="Commercial Payout Ledger & Direct Bank Transfer"
        subtitle="Instant payout withdrawal via secure NEFT/RTGS banking rail"
      >
        <div className="p-6 rounded-2xl bg-[#0B0E17]/85 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/40 to-transparent" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7189BA]">CLEARED ESCROW BALANCE</span>
            <div className="font-sans text-3xl font-bold text-white mt-1 tracking-tight">
              ₹{completedEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-[#8FA5D9]/70 mt-1 font-mono">
              Verified beneficiary account: HDFC Bank · Ending in ****4821 (IFSC: HDFC0001244)
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                if (completedEarnings > 0) {
                  onRequestPayout(completedEarnings);
                  setPayoutRequested(true);
                  setTimeout(() => setPayoutRequested(false), 4000);
                }
              }}
              disabled={completedEarnings === 0}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs shadow-lg transition-all flex items-center gap-2 ${
                completedEarnings > 0
                  ? 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white cursor-pointer'
                  : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>{payoutRequested ? 'Transfer Initiated ✓' : 'Withdraw Full Cleared Balance'}</span>
            </button>
          </div>
        </div>
      </VintageCard>
    </div>
  );
};
