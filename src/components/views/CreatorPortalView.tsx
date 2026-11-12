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
      {/* Creator Profile Header (Weather Card Style Glass Banner) */}
      <div className="p-6 rounded-3xl weather-glass-card weather-glass-card-hover flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
        
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white shadow-xs">
              <Instagram className="w-3 h-3" />
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                TALENT ACCOUNT ·
              </span>
              <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{creator.name}</h2>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono font-semibold text-slate-700">
                {creator.tier}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-700 flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {creator.authenticityScore}% Verified
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1.5 font-sans font-medium">
              <a
                href={`https://instagram.com/${cleanHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors font-mono"
              >
                <span>@{cleanHandle}</span>
                <ExternalLink className="w-3 h-3 text-blue-400" />
              </a>
              <span>·</span>
              <span className="text-slate-700 font-semibold">{creator.category}</span>
              <span>·</span>
              <span className="text-slate-500">{creator.location}</span>
            </div>

            {creator.bio && (
              <p className="text-xs text-slate-600 italic mt-2 max-w-2xl line-clamp-2 font-serif">
                "{creator.bio}"
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-stretch lg:self-auto">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono shadow-xs">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Talent Access Email</span>
            <strong className="text-slate-800 text-[11px]">{creator.loginEmail || `${cleanHandle}@creators.theicompany.com`}</strong>
          </div>
          <a
            href={`https://instagram.com/${cleanHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Open Instagram Profile</span>
          </a>
        </div>
      </div>

      {/* Creator Metrics Strip (Weather Card Glassmorphic Pods) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl weather-glass-card weather-glass-card-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block font-bold">AUDIENCE REACH</span>
          <div className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {formatFollowerCount(creator.followers)}
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block font-bold font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {creator.engagementRate}% Engagement Rate
          </span>
        </div>

        <div className="p-5 rounded-3xl weather-glass-card weather-glass-card-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block font-bold">AVG REEL PERFORMANCE</span>
          <div className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            ~{formatFollowerCount(creator.avgReelViews)} views
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-mono">
            ~{formatFollowerCount(creator.avgLikes)} likes · ~{creator.avgComments} comments
          </span>
        </div>

        <div className="p-5 rounded-3xl weather-glass-card weather-glass-card-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block font-bold">COMMERCIAL RATE CARD</span>
          <div className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            ₹{creator.ratePerReel.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-mono">
            Story: ₹{(creator.ratePerStory / 1000).toFixed(0)}k · Post: ₹{(creator.ratePerPost / 1000).toFixed(0)}k
          </span>
        </div>

        <div className="p-5 rounded-3xl weather-glass-card weather-glass-card-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block font-bold">CLEARED ESCROW BALANCE</span>
          <div className="font-sans text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 tracking-tight">
            ₹{completedEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-mono">
            ₹{inEscrow.toLocaleString()} in escrow pending review
          </span>
        </div>
      </div>

      {/* SECTION I · VERIFIED RECENT CONTENT & REEL DELIVERABLES */}
      <VintageCard
        sectionNumber="SECTION I · VERIFIED MEDIA DOSSIER"
        title={`Recent Content & Live Instagram Reels (${recentReels.length})`}
        subtitle="Real-time extracted deliverables from creator profile with exact views, engagement, and working video posters"
      >
        {recentReels.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
            <Play className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
            <p className="font-sans text-base font-bold text-slate-800">No Live Reels Attached</p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Ask your Agency Administrator to run the live Chromium reel extraction for @{cleanHandle}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {recentReels.map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-xs flex flex-col group hover:border-blue-400 hover:shadow-md transition-all"
              >
                {/* Reel Thumbnail with Fail-Safe Proxy */}
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-slate-800 to-slate-950 text-slate-300">
                    <Play className="w-6 h-6 text-blue-400 mb-1" />
                    <span className="text-[9px] font-mono text-slate-400 line-clamp-2">{item.title}</span>
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
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] text-white font-mono flex items-center gap-1 z-20 border border-white/20">
                    <span>{item.type === 'Reel' ? '▶' : item.type === 'Carousel' ? '📷' : '🖼️'}</span>
                    <span>{item.type}</span>
                  </div>

                  {/* Bottom Stats Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-[10px] text-white font-mono flex items-center justify-between z-20">
                    <span className="font-bold text-white">{formatFollowerCount(item.views || item.likes)} views</span>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-full bg-white/20 hover:bg-blue-600 text-white transition-colors"
                        title="Open on Instagram"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-800 font-semibold line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2 pt-1.5 border-t border-slate-100">
                    <span>{item.postedDaysAgo}d ago</span>
                    <span className="text-emerald-700 font-bold">{item.engagement}% ER</span>
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
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600 font-bold block">
                GENDER CONCENTRATION
              </span>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-sans">
                    <span className="text-slate-700 font-medium">Female</span>
                    <span className="font-mono font-bold text-slate-900">{creator.audience.gender.female}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" style={{ width: `${creator.audience.gender.female}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-sans">
                    <span className="text-slate-700 font-medium">Male</span>
                    <span className="font-mono font-bold text-slate-900">{creator.audience.gender.male}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" style={{ width: `${creator.audience.gender.male}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Geographic Hubs */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600 font-bold block">
                TOP INDIAN METRO HUBS
              </span>
              <div className="space-y-1.5">
                {creator.audience.topCities.map((city, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/60 last:border-0 font-sans">
                    <span className="text-slate-800 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {city.city}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{city.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth & Consistency Trajectory */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600 font-bold block">
                PORTFOLIO TRAJECTORY
              </span>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-600 font-medium">Weekly Momentum:</span>
                  <span className="font-mono font-bold text-emerald-600">+{creator.progressTrajectory.weekGrowth}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-600 font-medium">Monthly Momentum:</span>
                  <span className="font-mono font-bold text-emerald-600">+{creator.progressTrajectory.monthGrowth}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-600 font-medium">Consistency Score:</span>
                  <span className="font-mono font-bold text-slate-900">{creator.progressTrajectory.consistencyScore}/100</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic font-serif pt-1">
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
          <div className="p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
            <p className="font-sans text-base font-bold text-slate-800">No Active Deliverables Pending</p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Your profile is verified. When agency brands assign campaigns to @{cleanHandle}, they appear here for draft submission.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myDeliverables.map(({ campaign, deliverable: del }) => (
              <div
                key={del.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all space-y-3 relative overflow-hidden shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">
                      {campaign.brandName}
                    </span>
                    <h4 className="font-sans text-lg font-bold text-slate-900 mt-0.5 tracking-tight">{campaign.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">Format: {del.type} · Deadline: {del.dueDate}</p>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <span className="text-xs text-slate-500 block font-medium">Contracted Compensation:</span>
                    <div className="font-mono text-lg font-bold text-emerald-600">
                      ₹{del.agreedPayout.toLocaleString()}
                    </div>
                    {onOpenContract && (
                      <button
                        onClick={() => onOpenContract(campaign)}
                        className="mt-1 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
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
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />
                    <button
                      onClick={() => handleSubmitUrl(campaign.id, del.id)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Draft Link</span>
                    </button>
                  </div>
                )}

                {del.status === 'draft_submitted' && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-800">
                    <span className="font-medium">Draft submitted to {campaign.brandName}. Review in progress.</span>
                    <span className="font-bold underline cursor-pointer hover:text-amber-950" onClick={() => window.open(del.submittedUrl, '_blank')}>
                      View Submitted Link
                    </span>
                  </div>
                )}

                {del.status === 'live' && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                    <span className="font-semibold">Approved & Live on Instagram · Escrow Cleared</span>
                    <span className="font-mono font-bold">Live in Portfolio</span>
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
        <div className="p-6 rounded-2xl bg-white/80 border border-slate-200/90 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">CLEARED ESCROW BALANCE</span>
            <div className="font-sans text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              ₹{completedEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
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
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 ${
                completedEarnings > 0
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer shadow-[0_4px_14px_rgba(5,150,105,0.25)]'
                  : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
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
