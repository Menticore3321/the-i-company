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
      <div className="p-6 rounded-2xl bg-[#0B0E17]/85 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5B8BF7]/50 to-transparent" />
        
        <div className="flex items-center gap-4">
          <img
            src={activeBrand.logo}
            alt={activeBrand.name}
            className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7189BA]">
                ENTERPRISE CLIENT PORTAL ·
              </span>
              <h2 className="font-sans text-xl font-bold text-white tracking-tight">{activeBrand.name}</h2>
            </div>
            <p className="text-xs text-[#8FA5D9]/70 mt-1 font-sans">
              {activeBrand.industry} · Primary Contact: {activeBrand.contactEmail}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-[#8FA5D9]">
            <span className="text-[#7189BA]">Account: </span>
            <strong className="text-white">{activeBrand.loginEmail || activeBrand.contactEmail}</strong>
          </div>

          <button
            onClick={onOpenCampaignGenerator}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B8BF7] hover:bg-[#4F75E8] text-white text-xs font-medium shadow-[0_0_20px_rgba(91,139,247,0.35)] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Campaign Brief</span>
          </button>
        </div>
      </div>

      {/* Brand KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B0E17]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5B8BF7]/30 to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] block">ACTIVE CAMPAIGNS</span>
          <div className="font-sans text-2xl font-bold text-white mt-1 tracking-tight">
            {brandCampaigns.length} Active
          </div>
          <span className="text-[11px] text-[#8FA5D9]/70 mt-1 block font-mono">Live across India creator networks</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E17]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5B8BF7]/30 to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] block">PROJECTED IMPRESSIONS</span>
          <div className="font-sans text-2xl font-bold text-white mt-1 tracking-tight">
            {(totalImpressions / 1000000).toFixed(1)}M
          </div>
          <span className="text-[11px] text-[#10B981] mt-1 block font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Blended multi-tier reach
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E17]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5B8BF7]/30 to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] block">DEPLOYED BUDGET</span>
          <div className="font-sans text-2xl font-bold text-white mt-1 tracking-tight">
            ₹{(totalSpent / 100000).toFixed(1)} Lakhs
          </div>
          <span className="text-[11px] text-[#8FA5D9]/70 mt-1 block font-mono">Contracted across deliverables</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E17]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F59E0B]/40 to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] block">PENDING REVIEWS</span>
          <div className="font-sans text-2xl font-bold text-[#F59E0B] mt-1 tracking-tight">
            {pendingApprovals.length} Drafts
          </div>
          <span className="text-[11px] text-[#8FA5D9]/70 mt-1 block font-mono">Awaiting client sign-off</span>
        </div>
      </div>

      {/* Deliverable Review / Approval Queue */}
      <VintageCard
        sectionNumber="SECTION I · CONTENT CLEARANCE"
        title="Creator Submissions & Pre-Launch Approvals"
        subtitle="Review creator scripts, video drafts, and grant publishing clearance for Instagram release"
        badge={
          pendingApprovals.length > 0 ? (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-medium font-mono">
              {pendingApprovals.length} Action Required
            </span>
          ) : (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 font-medium font-mono">
              All Approved
            </span>
          )
        }
      >
        {pendingApprovals.length === 0 ? (
          <div className="p-8 text-center bg-[#07090F]/60 rounded-xl border border-dashed border-white/10 text-[#8FA5D9] text-xs">
            <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto mb-2 opacity-80" />
            <p className="font-sans text-base font-semibold text-white">All Submitted Content Cleared</p>
            <p className="text-xs text-[#8FA5D9]/70 mt-1 font-mono">Creators have been notified to publish approved deliverables on their channels.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApprovals.map((del) => (
              <div
                key={del.id}
                className="p-5 rounded-xl bg-[#07090F]/80 border border-white/10 hover:border-[#5B8BF7]/40 transition-all space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">@{del.influencerHandle}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-mono uppercase">
                    Draft Submitted
                  </span>
                </div>

                <div className="font-sans text-base font-semibold text-white">
                  {del.type} Deliverable for {activeBrand.name}
                </div>

                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#8FA5D9] flex items-center justify-between font-mono">
                  <span>Contracted Milestone Payout:</span>
                  <strong className="text-white">₹{del.agreedPayout.toLocaleString()}</strong>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={del.submittedUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-center text-[#D7DCEA] hover:bg-white/10 flex items-center justify-center gap-1.5 transition-colors font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#7189BA]" />
                    <span>Preview Draft Video</span>
                  </a>

                  <button
                    onClick={() => {
                      const parentCamp = brandCampaigns.find(c => c.deliverables.some(d => d.id === del.id));
                      if (parentCamp) {
                        onApproveDeliverable(parentCamp.id, del.id);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white font-medium text-xs flex items-center gap-1.5 transition-all"
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
              className="p-5 rounded-xl bg-[#07090F]/80 border border-white/10 hover:border-white/20 transition-all space-y-4 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-sans text-lg font-bold text-white tracking-tight">{camp.name}</h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 text-[#8FA5D9] border border-white/10 font-mono">
                      {camp.niche}
                    </span>
                  </div>
                  <span className="text-xs text-[#7189BA] font-mono mt-1 block">
                    Campaign timeline: {camp.startDate} to {camp.endDate}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-[#7189BA] block font-mono">Total Campaign Budget:</span>
                    <div className="font-mono text-lg font-bold text-[#10B981]">
                      ₹{(camp.totalBudget / 100000).toFixed(2)} Lakhs
                    </div>
                  </div>

                  {onOpenContract && (
                    <button
                      onClick={() => onOpenContract(camp)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-[#5B8BF7] hover:text-white text-xs font-medium text-[#D7DCEA] flex items-center justify-center gap-1.5 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#5B8BF7]" />
                      <span>Agreement & GST Invoice</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Deliverable Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {camp.deliverables.map((del) => (
                  <div key={del.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.07] space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">@{del.influencerHandle}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border ${
                        del.status === 'live'
                          ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                          : del.status === 'draft_submitted'
                          ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
                          : 'bg-white/5 text-[#7189BA] border-white/10'
                      }`}>
                        {del.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[#8FA5D9]/70 font-mono text-[11px]">{del.type} · Due {del.dueDate}</div>
                    <div className="pt-2 border-t border-white/[0.06] flex justify-between font-mono text-[11px]">
                      <span className="text-[#7189BA]">Payout:</span>
                      <span className="text-white font-semibold">₹{del.agreedPayout.toLocaleString()}</span>
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
