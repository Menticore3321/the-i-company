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
  FileText
} from 'lucide-react';

interface CreatorPortalViewProps {
  creator: Influencer;
  campaigns: Campaign[];
  onSubmitDeliverableUrl: (campaignId: string, deliverableId: string, url: string) => void;
  onRequestPayout: (amount: number) => void;
  onOpenContract?: (campaign: Campaign) => void;
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

  return (
    <div className="space-y-6">
      {/* Creator Profile Header */}
      <div className="p-6 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#1C1917]"
            />
            <span className="absolute bottom-0 right-0 p-1 rounded-full bg-[#1C1917] text-white">
              <Instagram className="w-3 h-3" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716C]">
                TALENT ACCOUNT ·
              </span>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">{creator.name}</h2>
              <CheckCircle2 className="w-4 h-4 text-[#2E523E]" />
            </div>
            <p className="text-xs text-[#78716C] mt-0.5">
              @{creator.handle} · {creator.category} · {creator.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-xs font-mono text-[#78716C]">
            <span>Talent ID: </span>
            <strong className="text-[#1C1917]">{creator.loginEmail || `${creator.handle}@creators.theicompany.com`}</strong>
          </div>
        </div>
      </div>

      {/* Creator Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">CLEARED EARNINGS</span>
          <div className="font-serif text-2xl font-bold text-[#2E523E] mt-1">
            ₹{completedEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#78716C] mt-1 block">Available for instant transfer</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">IN ESCROW</span>
          <div className="font-serif text-2xl font-bold text-[#C25E3E] mt-1">
            ₹{inEscrow.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#78716C] mt-1 block">Releases upon draft approval</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">AUDIENCE REACH</span>
          <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
            {(creator.followers / 1000).toFixed(0)}k Followers
          </div>
          <span className="text-[11px] text-[#2E523E] mt-1 block font-medium">
            {creator.engagementRate}% Engagement Rate
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">COMMERCIAL RATE</span>
          <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
            ₹{creator.ratePerReel.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#78716C] mt-1 block">Per sponsored Reel</span>
        </div>
      </div>

      {/* Assigned Deliverables Section */}
      <VintageCard
        sectionNumber="SECTION I · CONTRACTED MISSIONS"
        title="Assigned Deliverables & Content Submission"
        subtitle="Submit drafted content links for brand review and trigger instant escrow release"
      >
        {myDeliverables.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] text-[#78716C] text-xs">
            <Clock className="w-8 h-8 text-[#A8A29E] mx-auto mb-2 opacity-70" />
            <p className="font-serif text-base font-semibold text-[#1C1917]">No Pending Deliverables Assigned</p>
            <p className="text-xs text-[#78716C] mt-1">The I Company team is currently negotiating new partnerships for your portfolio.</p>
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
                    <span className="font-mono font-semibold">540k Views · 68k Likes</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </VintageCard>

      {/* Talent Wallet & Payout Transfer */}
      <VintageCard
        sectionNumber="SECTION II · TALENT WALLET"
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
