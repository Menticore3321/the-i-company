import React, { useState } from 'react';
import { Brand, Campaign, Influencer, CampaignDeliverable } from '../../types';
import { VintageCard } from '../vintage/VintageCard';
import { 
  Briefcase, 
  Sparkles, 
  DollarSign, 
  Eye, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  TrendingUp, 
  ThumbsUp,
  FileText,
  Building2,
  Check
} from 'lucide-react';

interface BrandPortalViewProps {
  activeBrand: Brand;
  campaigns: Campaign[];
  influencers: Influencer[];
  onOpenCampaignGenerator: () => void;
  onSelectInfluencer: (influencer: Influencer) => void;
  onApproveDeliverable: (campaignId: string, deliverableId: string) => void;
  onOpenContract?: (campaign: Campaign) => void;
}

export const BrandPortalView: React.FC<BrandPortalViewProps> = ({
  activeBrand,
  campaigns,
  influencers,
  onOpenCampaignGenerator,
  onSelectInfluencer,
  onApproveDeliverable,
  onOpenContract
}) => {
  const brandCampaigns = campaigns.filter(c => c.brandId === activeBrand.id || c.brandName.toLowerCase().includes(activeBrand.name.toLowerCase()));

  const totalSpent = brandCampaigns.reduce((sum, c) => sum + c.spentBudget, 0);
  const totalImpressions = brandCampaigns.reduce((sum, c) => sum + c.projectedMetrics.impressions, 0);
  const allDeliverables = brandCampaigns.flatMap(c => c.deliverables);
  const pendingApprovals = allDeliverables.filter(d => d.status === 'draft_submitted');

  return (
    <div className="space-y-6">
      {/* Brand Header Banner */}
      <div className="p-6 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeBrand.logo}
            alt={activeBrand.name}
            className="w-14 h-14 rounded-xl object-cover border border-[#E2DDD5]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716C]">
                ENTERPRISE CLIENT PORTAL ·
              </span>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">{activeBrand.name}</h2>
            </div>
            <p className="text-xs text-[#78716C] mt-0.5">
              {activeBrand.industry} · Primary Contact: {activeBrand.contactEmail}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-xs font-mono text-[#78716C]">
            <span>Account: </span>
            <strong className="text-[#1C1917]">{activeBrand.loginEmail || activeBrand.contactEmail}</strong>
          </div>

          <button
            onClick={onOpenCampaignGenerator}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white text-xs font-medium shadow-vintage-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Campaign Brief</span>
          </button>
        </div>
      </div>

      {/* Brand KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">ACTIVE CAMPAIGNS</span>
          <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
            {brandCampaigns.length} Active
          </div>
          <span className="text-[11px] text-[#78716C] mt-1 block">Live across India creator networks</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">PROJECTED IMPRESSIONS</span>
          <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
            {(totalImpressions / 1000000).toFixed(1)}M
          </div>
          <span className="text-[11px] text-[#78716C] mt-1 block">Blended multi-tier reach</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">DEPLOYED BUDGET</span>
          <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
            ₹{(totalSpent / 100000).toFixed(1)} Lakhs
          </div>
          <span className="text-[11px] text-[#78716C] mt-1 block">Contracted across deliverables</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">PENDING REVIEWS</span>
          <div className="font-serif text-2xl font-bold text-[#C25E3E] mt-1">
            {pendingApprovals.length} Drafts
          </div>
          <span className="text-[11px] text-[#78716C] mt-1 block">Awaiting client sign-off</span>
        </div>
      </div>

      {/* Deliverable Review / Approval Queue */}
      <VintageCard
        sectionNumber="SECTION I · CONTENT CLEARANCE"
        title="Creator Submissions & Pre-Launch Approvals"
        subtitle="Review creator scripts, video drafts, and grant publishing clearance for Instagram release"
        badge={
          pendingApprovals.length > 0 ? (
            <span className="text-xs px-2.5 py-0.5 rounded bg-[#FDF3EE] text-[#C25E3E] border border-[#F2DACF] font-medium">
              {pendingApprovals.length} Action Required
            </span>
          ) : (
            <span className="text-xs px-2.5 py-0.5 rounded bg-[#EEF5F1] text-[#2E523E] border border-[#D1E3D8] font-medium">
              All Approved
            </span>
          )
        }
      >
        {pendingApprovals.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] text-[#78716C] text-xs">
            <CheckCircle2 className="w-8 h-8 text-[#2E523E] mx-auto mb-2 opacity-80" />
            <p className="font-serif text-base font-semibold text-[#1C1917]">All Submitted Content Cleared</p>
            <p className="text-xs text-[#78716C] mt-1">Creators have been notified to publish approved deliverables on their channels.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApprovals.map((del) => (
              <div
                key={del.id}
                className="p-5 rounded-xl bg-white border border-[#E7E2DA] hover:border-[#D6CFBF] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1C1917]">@{del.influencerHandle}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#FDF3EE] text-[#C25E3E] border border-[#F2DACF] font-medium uppercase">
                    Draft Submitted
                  </span>
                </div>

                <div className="font-serif text-base font-semibold text-[#1C1917]">
                  {del.type} Deliverable for {activeBrand.name}
                </div>

                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-xs text-[#78716C] flex items-center justify-between">
                  <span>Contracted Milestone Payout:</span>
                  <strong className="text-[#1C1917] font-mono">₹{del.agreedPayout.toLocaleString()}</strong>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={del.submittedUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#E2DDD5] text-xs text-center text-[#1C1917] hover:bg-[#FAF8F5] flex items-center justify-center gap-1.5 transition-colors font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>Preview Draft Video</span>
                  </a>

                  <button
                    onClick={() => {
                      const parentCamp = brandCampaigns.find(c => c.deliverables.some(d => d.id === del.id));
                      if (parentCamp) {
                        onApproveDeliverable(parentCamp.id, del.id);
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-[#2E523E] hover:bg-[#244231] text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Approve & Clear Escrow</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </VintageCard>

      {/* Active Brand Campaigns */}
      <VintageCard
        sectionNumber="SECTION II · ACTIVE CAMPAIGNS"
        title="Live Campaign Deployments & Performance"
        subtitle="Delivery metrics, contracted creator roster, and engagement benchmarks"
      >
        <div className="space-y-4">
          {brandCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-5 rounded-xl bg-white border border-[#E7E2DA] hover:border-[#D6CFBF] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0ECE4]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">{camp.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#F5F2EB] text-[#78716C] border border-[#E2DDD5]">
                      {camp.niche}
                    </span>
                  </div>
                  <span className="text-xs text-[#78716C]">
                    Campaign timeline: {camp.startDate} to {camp.endDate}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-[#78716C] block">Total Campaign Budget:</span>
                    <div className="font-serif text-lg font-bold text-[#2E523E]">
                      ₹{(camp.totalBudget / 100000).toFixed(2)} Lakhs
                    </div>
                  </div>

                  {onOpenContract && (
                    <button
                      onClick={() => onOpenContract(camp)}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D6CFBF] hover:bg-[#1C1917] hover:text-white text-xs font-medium text-[#1C1917] flex items-center justify-center gap-1.5 transition-all shadow-vintage-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#8A6B32]" />
                      <span>Agreement & GST Invoice</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Deliverable Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {camp.deliverables.map((del) => (
                  <div key={del.id} className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#1C1917]">@{del.influencerHandle}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase border ${
                        del.status === 'live'
                          ? 'bg-[#EEF5F1] text-[#2E523E] border-[#D1E3D8]'
                          : del.status === 'draft_submitted'
                          ? 'bg-[#FDF3EE] text-[#C25E3E] border-[#F2DACF]'
                          : 'bg-white text-[#78716C] border-[#E7E2DA]'
                      }`}>
                        {del.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[#78716C]">{del.type} · Due {del.dueDate}</div>
                    <div className="pt-2 border-t border-[#EFECE6] flex justify-between font-mono text-[11px]">
                      <span>Payout:</span>
                      <span className="text-[#1C1917] font-semibold">₹{del.agreedPayout.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </VintageCard>
    </div>
  );
};
