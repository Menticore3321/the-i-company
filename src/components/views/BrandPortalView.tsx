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
      {/* Brand Header Banner (Light Glass) */}
      <div className="p-6 rounded-3xl weather-glass-card weather-glass-card-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/35 to-transparent" />
        
        <div className="flex items-center gap-4">
          <img
            src={activeBrand.logo}
            alt={activeBrand.name}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-blue-600 tracking-wide uppercase">
                Enterprise Client Portal
              </span>
            </div>
            <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">{activeBrand.name}</h2>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              {activeBrand.industry} · Contact: {activeBrand.contactEmail}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl weather-glass-pod text-xs text-slate-700 shadow-xs">
            <span className="text-slate-400 font-medium">Account: </span>
            <strong className="text-slate-900 font-semibold">{activeBrand.loginEmail || activeBrand.contactEmail}</strong>
          </div>

          <button
            onClick={onOpenCampaignGenerator}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Campaign Brief</span>
          </button>
        </div>
      </div>

      {/* Brand KPI Strip (Weather Card Glassmorphic Pods) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl weather-glass-card weather-glass-card-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          <span className="text-xs font-semibold text-slate-500 block">Active Campaigns</span>
          <div className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {brandCampaigns.length} <span className="text-base font-semibold text-slate-500">Live</span>
          </div>
          <span className="text-xs text-slate-500 mt-1.5 block">Managed creator networks</span>
        </div>

        <div className="p-5 rounded-3xl weather-glass-card weather-glass-card-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          <span className="text-xs font-semibold text-slate-500 block">Projected Reach</span>
          <div className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {(totalImpressions / 1000000).toFixed(1)}M
          </div>
          <span className="text-xs text-emerald-700 mt-1.5 block font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Blended multi-tier audience
          </span>
        </div>

        <div className="p-5 rounded-3xl weather-glass-card weather-glass-card-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          <span className="text-xs font-semibold text-slate-500 block">Deployed Budget</span>
          <div className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            ₹{(totalSpent / 100000).toFixed(1)} <span className="text-base font-semibold text-slate-500">Lakhs</span>
          </div>
          <span className="text-xs text-slate-500 mt-1.5 block">Contracted across deliverables</span>
        </div>

        <div className="p-5 rounded-3xl weather-glass-card weather-glass-card-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          <span className="text-xs font-semibold text-slate-500 block">Pending Reviews</span>
          <div className="font-sans text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1 tracking-tight">
            {pendingApprovals.length} <span className="text-base font-semibold text-amber-600/80">Drafts</span>
          </div>
          <span className="text-xs text-slate-500 mt-1.5 block">Awaiting client sign-off</span>
        </div>
      </div>

      {/* Deliverable Review / Approval Queue */}
      <VintageCard
        sectionNumber="SECTION I · CONTENT CLEARANCE"
        title="Creator Submissions & Pre-Launch Approvals"
        subtitle="Review creator scripts, video drafts, and grant publishing clearance for Instagram release"
        badge={
          pendingApprovals.length > 0 ? (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold font-mono">
              {pendingApprovals.length} Action Required
            </span>
          ) : (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold font-mono">
              All Approved
            </span>
          )
        }
      >
        {pendingApprovals.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
            <p className="font-sans text-base font-bold text-slate-800">All Submitted Content Cleared</p>
            <p className="text-xs text-slate-500 mt-1 font-mono">Creators have been notified to publish approved deliverables on their channels.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApprovals.map((del) => (
              <div
                key={del.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all space-y-3 relative overflow-hidden shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">@{del.influencerHandle}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-mono font-bold uppercase">
                    Draft Submitted
                  </span>
                </div>

                <div className="font-sans text-base font-bold text-slate-900">
                  {del.type} Deliverable for {activeBrand.name}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between font-mono">
                  <span>Contracted Milestone Payout:</span>
                  <strong className="text-slate-900 font-bold">₹{del.agreedPayout.toLocaleString()}</strong>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={del.submittedUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-center text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors font-semibold shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview Draft Video</span>
                  </a>

                  <button
                    onClick={() => {
                      const parentCamp = brandCampaigns.find(c => c.deliverables.some(d => d.id === del.id));
                      if (parentCamp) {
                        onApproveDeliverable(parentCamp.id, del.id);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(5,150,105,0.2)] cursor-pointer"
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
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all space-y-4 relative overflow-hidden shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-sans text-lg font-bold text-slate-900 tracking-tight">{camp.name}</h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono font-semibold">
                      {camp.niche}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono mt-1 block">
                    Campaign timeline: {camp.startDate} to {camp.endDate}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block font-medium">Total Campaign Budget:</span>
                    <div className="font-mono text-lg font-bold text-emerald-600">
                      ₹{(camp.totalBudget / 100000).toFixed(2)} Lakhs
                    </div>
                  </div>

                  {onOpenContract && (
                    <button
                      onClick={() => onOpenContract(camp)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Agreement & GST Invoice</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Deliverable Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {camp.deliverables.map((del) => (
                  <div key={del.id} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">@{del.influencerHandle}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase border ${
                        del.status === 'live'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : del.status === 'draft_submitted'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}>
                        {del.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px]">{del.type} · Due {del.dueDate}</div>
                    <div className="pt-2 border-t border-slate-200/60 flex justify-between font-mono text-[11px]">
                      <span className="text-slate-500">Payout:</span>
                      <span className="text-slate-900 font-bold">₹{del.agreedPayout.toLocaleString()}</span>
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
