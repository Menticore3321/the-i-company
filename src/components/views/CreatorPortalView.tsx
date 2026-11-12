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
      <div className="p-6 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#1C1917]"
            />
            <span className="absolute bottom-0 right-0 p-1 rounded-full bg-[#1C1917] text-white">
              <Instagram className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716C]">
                TALENT ACCOUNT ·
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">{creator.name}</h2>
              <CheckCircle2 className="w-4 h-4 text-[#2E523E]" />
              <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E7E2DA] text-[10px] font-mono font-medium text-[#1C1917]">
                {creator.tier}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#EEF5F1] border border-[#D1E3D8] text-[10px] font-mono font-semibold text-[#2E523E]">
                {creator.authenticityScore}% Verified
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C] mt-1">
              <a
                href={`https://instagram.com/${cleanHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#1C1917] hover:text-[#C25E3E] flex items-center gap-1 transition-colors"
              >
                <span>@{cleanHandle}</span>
                <ExternalLink className="w-3 h-3 text-[#A8A29E]" />
              </a>
              <span>·</span>
              <span>{creator.category}</span>
              <span>·</span>
              <span>{creator.location}</span>
            </div>

            {creator.bio && (
              <p className="text-xs text-[#57534E] italic font-serif mt-1.5 max-w-2xl line-clamp-2">
                "{creator.bio}"
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-stretch lg:self-auto">
          <div className="px-3.5 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-xs font-mono text-[#78716C]">
            <span className="text-[10px] text-[#A8A29E] block uppercase">Talent Access Email</span>
            <strong className="text-[#1C1917] text-[11px]">{creator.loginEmail || `${cleanHandle}@creators.theicompany.com`}</strong>
          </div>
          <a
            href={`https://instagram.com/${cleanHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-vintage-xs transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Open Instagram Profile</span>
          </a>
        </div>
      </div>

      {/* Creator Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">AUDIENCE REACH</span>
          <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
            {formatFollowerCount(creator.followers)}
          </div>
          <span className="text-[11px] text-[#2E523E] mt-1 block font-medium">
            {creator.engagementRate}% Engagement Rate
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">AVG REEL PERFORMANCE</span>
          <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
            ~{formatFollowerCount(creator.avgReelViews)} views
          </div>
          <span className="text-[11px] text-[#78716C] mt-1 block">
            ~{formatFollowerCount(creator.avgLikes)} likes · ~{creator.avgComments} comments
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">COMMERCIAL RATE CARD</span>
          <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
            ₹{creator.ratePerReel.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#78716C] mt-1 block">
            Story: ₹{(creator.ratePerStory / 1000).toFixed(0)}k · Post: ₹{(creator.ratePerPost / 1000).toFixed(0)}k
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">CLEARED ESCROW BALANCE</span>
          <div className="font-serif text-2xl font-bold text-[#2E523E] mt-1">
            ₹{completedEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#78716C] mt-1 block">
            ₹{inEscrow.toLocaleString()} in escrow pending review
          </span>
        </div>
      </div>

      {/* SECTION I · VERIFIED RECENT CONTENT & REEL DELIVERABLES (The 10 Scraped Live Reels) */}
      <VintageCard
        sectionNumber="SECTION I · VERIFIED MEDIA DOSSIER"
        title={`Recent Content & Live Instagram Reels (${recentReels.length})`}
        subtitle="Real-time extracted deliverables from creator profile with exact views, engagement, and working video posters"
      >
        {recentReels.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-dashed border-[#D6CFBF] text-[#78716C] text-xs">
            <Play className="w-8 h-8 text-[#A8A29E] mx-auto mb-2 opacity-60" />
            <p className="font-serif text-base font-semibold text-[#1C1917]">No Live Reels Attached</p>
            <p className="text-xs text-[#78716C] mt-1">
              Ask your Agency Administrator to run the live Chromium reel extraction for @{cleanHandle}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {recentReels.map((item) => (
              <div
                key={item.id}
                className="relative rounded-xl overflow-hidden border border-[#E7E2DA] bg-[#FAF8F5] flex flex-col group hover:border-[#1C1917] hover:shadow-vintage-sm transition-all"
              >
                {/* Reel Thumbnail with Fail-Safe Proxy */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#2A2421]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#2E2824] to-[#1C1917] text-white">
                    <Play className="w-6 h-6 text-[#E7E2DA]/70 mb-1" />
                    <span className="text-[9px] font-mono text-[#D6CFBF] line-clamp-2">{item.title}</span>
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
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] text-white font-mono flex items-center gap-1 z-20">
                    <span>{item.type === 'Reel' ? '▶' : item.type === 'Carousel' ? '📷' : '🖼️'}</span>
                    <span>{item.type}</span>
                  </div>

                  {/* Bottom Stats Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-[10px] text-white font-mono flex items-center justify-between z-20">
                    <span className="font-semibold">{formatFollowerCount(item.views || item.likes)} views</span>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded hover:bg-white/20 text-white"
                        title="Open on Instagram"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <p className="text-[11px] text-[#1C1917] font-medium line-clamp-2 leading-tight">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-[#78716C] font-mono mt-2 pt-1.5 border-t border-[#EFECE6]">
                    <span>{item.postedDaysAgo}d ago</span>
                    <span className="text-[#2E523E] font-semibold">{item.engagement}% ER</span>
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
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold block">
                GENDER CONCENTRATION
              </span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#1C1917]">Female</span>
                    <span className="font-mono font-bold text-[#1C1917]">{creator.audience.gender.female}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E7E2DA] overflow-hidden">
                    <div className="h-full bg-[#C25E3E]" style={{ width: `${creator.audience.gender.female}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#1C1917]">Male</span>
                    <span className="font-mono font-bold text-[#1C1917]">{creator.audience.gender.male}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E7E2DA] overflow-hidden">
                    <div className="h-full bg-[#1C1917]" style={{ width: `${creator.audience.gender.male}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Geographic Hubs */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold block">
                TOP INDIAN METRO HUBS
              </span>
              <div className="space-y-1.5">
                {creator.audience.topCities.map((city, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#EFECE6] last:border-0">
                    <span className="text-[#57534E] flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#A8A29E]" />
                      {city.city}
                    </span>
                    <span className="font-mono font-semibold text-[#1C1917]">{city.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth & Consistency Trajectory */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold block">
                PORTFOLIO TRAJECTORY
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#78716C]">Weekly Momentum:</span>
                  <span className="font-mono font-semibold text-[#2E523E]">+{creator.progressTrajectory.weekGrowth}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#78716C]">Monthly Momentum:</span>
                  <span className="font-mono font-semibold text-[#2E523E]">+{creator.progressTrajectory.monthGrowth}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#78716C]">Consistency Score:</span>
                  <span className="font-mono font-semibold text-[#1C1917]">{creator.progressTrajectory.consistencyScore}/100</span>
                </div>
              </div>
              <p className="text-[11px] text-[#78716C] italic font-serif pt-1">
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
          <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] text-[#78716C] text-xs">
            <Clock className="w-8 h-8 text-[#A8A29E] mx-auto mb-2 opacity-70" />
            <p className="font-serif text-base font-semibold text-[#1C1917]">No Active Deliverables Pending</p>
            <p className="text-xs text-[#78716C] mt-1">
              Your profile is verified. When agency brands assign campaigns to @{cleanHandle}, they appear here for draft submission.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myDeliverables.map(({ campaign, deliverable: del }) => (
              <div
                key={del.id}
                className="p-5 rounded-xl bg-white border border-[#E7E2DA] hover:border-[#D6CFBF] transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0ECE4]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C25E3E] font-semibold">
                      {campaign.brandName}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-[#1C1917] mt-0.5">{campaign.name}</h4>
                    <p className="text-xs text-[#78716C]">Format: {del.type} · Deadline: {del.dueDate}</p>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <span className="text-xs text-[#78716C] block">Contracted Compensation:</span>
                    <div className="font-serif text-lg font-bold text-[#2E523E]">
                      ₹{del.agreedPayout.toLocaleString()}
                    </div>
                    {onOpenContract && (
                      <button
                        onClick={() => onOpenContract(campaign)}
                        className="mt-1 px-2.5 py-1 rounded bg-[#FAF8F5] border border-[#D6CFBF] hover:bg-[#1C1917] hover:text-white text-[11px] font-medium text-[#1C1917] flex items-center gap-1 transition-all shadow-vintage-xs"
                      >
                        <FileText className="w-3 h-3 text-[#8A6B32]" />
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
                      className="flex-1 px-3.5 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white"
                    />
                    <button
                      onClick={() => handleSubmitUrl(campaign.id, del.id)}
                      className="px-4 py-2 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white font-medium text-xs shadow-vintage-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Draft Link</span>
                    </button>
                  </div>
                )}

                {del.status === 'draft_submitted' && (
                  <div className="p-3 rounded-lg bg-[#FDF3EE] border border-[#F2DACF] flex items-center justify-between text-xs text-[#C25E3E]">
                    <span>Draft submitted to {campaign.brandName}. Review in progress.</span>
                    <span className="font-medium text-[11px] underline cursor-pointer" onClick={() => window.open(del.submittedUrl, '_blank')}>
                      View Submitted Link
                    </span>
                  </div>
                )}

                {del.status === 'live' && (
                  <div className="p-3 rounded-lg bg-[#EEF5F1] border border-[#D1E3D8] flex items-center justify-between text-xs text-[#2E523E]">
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
        <div className="p-6 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C]">CLEARED ESCROW BALANCE</span>
            <div className="font-serif text-3xl font-bold text-[#1C1917] mt-1">
              ₹{completedEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-[#78716C] mt-1">
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
              className={`px-5 py-2.5 rounded-lg font-medium text-xs shadow-vintage-sm transition-all flex items-center gap-2 ${
                completedEarnings > 0
                  ? 'bg-[#1C1917] hover:bg-[#2E2A27] text-white cursor-pointer'
                  : 'bg-[#E7E2DA] text-[#A8A29E] cursor-not-allowed'
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
