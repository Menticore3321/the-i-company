import React, { useState } from 'react';
import { Influencer, Brand, Campaign, FinancialLedger, UserAccount, InfluencerCategory } from '../../types';
import { VintageCard } from '../vintage/VintageCard';
import { VintageAudienceMatrix } from '../vintage/VintageAudienceMatrix';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Plus, 
  Briefcase, 
  Layers, 
  Sparkles, 
  Instagram, 
  ArrowUpRight, 
  Filter, 
  Check, 
  Building2, 
  Clock, 
  Wallet, 
  Lock, 
  Copy, 
  Key, 
  FileText, 
  Send, 
  Mail,
  UserCheck
} from 'lucide-react';

interface AdminMasterViewProps {
  influencers: Influencer[];
  brands: Brand[];
  campaigns: Campaign[];
  financials: FinancialLedger;
  accounts: UserAccount[];
  onSelectInfluencer: (influencer: Influencer) => void;
  onOpenAddModal: () => void;
  onOpenAddBrandModal: () => void;
  onOpenCampaignGenerator: () => void;
  onApproveDeliverable: (campaignId: string, deliverableId: string) => void;
  onOpenContract?: (campaign: Campaign) => void;
  onSwitchToCreator?: (influencer: Influencer) => void;
  onSwitchToAccount?: (account: UserAccount) => void;
}

export const AdminMasterView: React.FC<AdminMasterViewProps> = ({
  influencers,
  brands,
  campaigns,
  financials,
  accounts,
  onSelectInfluencer,
  onOpenAddModal,
  onOpenAddBrandModal,
  onOpenCampaignGenerator,
  onApproveDeliverable,
  onOpenContract,
  onSwitchToCreator,
  onSwitchToAccount
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'brands' | 'campaigns' | 'geo' | 'accounts' | 'ledger'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [copiedAccountId, setCopiedAccountId] = useState<string | null>(null);

  // Filter creators
  const filteredInfluencers = influencers.filter((inf) => {
    const matchesSearch = 
      inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.handle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || inf.category === selectedCategory;
    const matchesTier = selectedTier === 'all' || inf.tier.toLowerCase().includes(selectedTier.toLowerCase());
    return matchesSearch && matchesCategory && matchesTier;
  });

  const totalFollowers = influencers.reduce((acc, inf) => acc + inf.followers, 0);
  const avgAuthenticity = Math.round(
    influencers.reduce((acc, inf) => acc + inf.authenticityScore, 0) / (influencers.length || 1)
  );

  const handleCopyCredentials = (acc: UserAccount) => {
    navigator.clipboard.writeText(`THE I COMPANY · SECURE PORTAL CREDENTIALS
Access URL: https://theicompany.netlify.app
Account Name: ${acc.name}
Role Type: ${acc.role.toUpperCase()}
Assigned Email: ${acc.email}
Password: ${acc.password}

Please sign in and access your designated workspace.`);
    setCopiedAccountId(acc.id);
    setTimeout(() => setCopiedAccountId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: EXECUTIVE KEY METRICS STRIP (Agentic Glass Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#0B0E17]/85 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all relative overflow-hidden group">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#5B8BF7]/40 to-transparent absolute top-0 left-0" />
          <div className="flex items-center justify-between text-xs text-[#8E95A5]">
            <span className="font-mono uppercase tracking-wider text-[10px]">MANAGED ROSTER</span>
            <Users className="w-4 h-4 text-[#5B8BF7]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 tracking-tight">
            {influencers.length} Creators
          </div>
          <div className="flex items-center justify-between text-xs text-[#8E95A5] mt-2 pt-2 border-t border-white/[0.06]">
            <span>Total Reach:</span>
            <strong className="text-white font-mono">{(totalFollowers / 1000000).toFixed(1)}M</strong>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#0B0E17]/85 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-[#10B981]/30 transition-all relative overflow-hidden group">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#10B981]/40 to-transparent absolute top-0 left-0" />
          <div className="flex items-center justify-between text-xs text-[#8E95A5]">
            <span className="font-mono uppercase tracking-wider text-[10px]">COMMERCIAL VOLUME (GMV)</span>
            <DollarSign className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold text-[#10B981] mt-2 tracking-tight">
            ₹{(financials.totalGMV / 100000).toFixed(1)} Lakhs
          </div>
          <div className="flex items-center justify-between text-xs text-[#8E95A5] mt-2 pt-2 border-t border-white/[0.06]">
            <span>Escrow Secured:</span>
            <strong className="text-[#10B981] font-mono">₹{(financials.escrowHeld / 100000).toFixed(1)}L</strong>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#0B0E17]/85 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-[#F43F5E]/30 transition-all relative overflow-hidden group">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#F43F5E]/40 to-transparent absolute top-0 left-0" />
          <div className="flex items-center justify-between text-xs text-[#8E95A5]">
            <span className="font-mono uppercase tracking-wider text-[10px]">AGENCY REVENUE (20%)</span>
            <TrendingUp className="w-4 h-4 text-[#F43F5E]" />
          </div>
          <div className="text-2xl font-bold text-[#F43F5E] mt-2 tracking-tight">
            ₹{(financials.agencyRevenue / 100000).toFixed(2)} Lakhs
          </div>
          <div className="flex items-center justify-between text-xs text-[#8E95A5] mt-2 pt-2 border-t border-white/[0.06]">
            <span>Disbursed to Talent:</span>
            <strong className="text-white font-mono">₹{(financials.creatorsPaid / 100000).toFixed(1)}L</strong>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#0B0E17]/85 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all relative overflow-hidden group">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#8FA5D9]/40 to-transparent absolute top-0 left-0" />
          <div className="flex items-center justify-between text-xs text-[#8E95A5]">
            <span className="font-mono uppercase tracking-wider text-[10px]">AUTHENTICITY RATING</span>
            <ShieldCheck className="w-4 h-4 text-[#8FA5D9]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 tracking-tight">
            {avgAuthenticity}% Authentic
          </div>
          <div className="flex items-center justify-between text-xs text-[#8E95A5] mt-2 pt-2 border-t border-white/[0.06]">
            <span>Bot Shield Verification:</span>
            <span className="text-[#10B981] font-semibold text-[11px]">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ADMIN NAVIGATION TABS (Agentic Pill Bar) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#06080E] border border-white/10 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('roster')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs transition-all select-none cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-[#141B2D] text-white font-semibold shadow-[0_0_15px_rgba(91,139,247,0.3)] border border-[#5B8BF7]/50'
                : 'text-[#8E95A5] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Influencer Roster ({influencers.length})
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs transition-all select-none cursor-pointer ${
              activeTab === 'brands'
                ? 'bg-[#141B2D] text-white font-semibold shadow-[0_0_15px_rgba(91,139,247,0.3)] border border-[#5B8BF7]/50'
                : 'text-[#8E95A5] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Brand Portfolios ({brands.length})
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs transition-all select-none cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-[#141B2D] text-white font-semibold shadow-[0_0_15px_rgba(91,139,247,0.3)] border border-[#5B8BF7]/50'
                : 'text-[#8E95A5] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Campaigns & Escrow ({campaigns.length})
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs transition-all select-none flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'accounts'
                ? 'bg-[#141B2D] text-white font-semibold shadow-[0_0_15px_rgba(91,139,247,0.3)] border border-[#5B8BF7]/50'
                : 'text-[#8E95A5] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-[#5B8BF7]" />
            <span>Login Credentials ({accounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('geo')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs transition-all select-none cursor-pointer ${
              activeTab === 'geo'
                ? 'bg-[#141B2D] text-white font-semibold shadow-[0_0_15px_rgba(91,139,247,0.3)] border border-[#5B8BF7]/50'
                : 'text-[#8E95A5] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Regional Reach (6 Hubs)
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs transition-all select-none cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-[#141B2D] text-white font-semibold shadow-[0_0_15px_rgba(91,139,247,0.3)] border border-[#5B8BF7]/50'
                : 'text-[#8E95A5] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Audit Ledger
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101524] border border-white/10 text-xs font-medium text-[#D7DCEA] hover:text-white hover:border-[#5B8BF7]/50 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#5B8BF7]" />
            <span>Link Creator</span>
          </button>

          <button
            onClick={onOpenAddBrandModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101524] border border-white/10 text-xs font-medium text-[#D7DCEA] hover:text-white hover:border-[#10B981]/50 transition-all cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>+ Add Brand</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INFLUENCER ROSTER */}
      {activeTab === 'roster' && (
        <VintageCard
          sectionNumber="SECTION I · TALENT ROSTER"
          title="Master Creator Ledger & Instagram Telemetry"
          subtitle="Directory of represented talent, categories, real-time engagement rate %, rate cards, and progress trajectories"
          badge={
            <button
              onClick={onOpenAddModal}
              className="text-xs font-medium px-3.5 py-1.5 rounded-xl bg-[#5B8BF7] hover:bg-[#4A7AE6] text-white shadow-[0_0_15px_rgba(91,139,247,0.35)] transition-all cursor-pointer"
            >
              + Link Instagram Handle
            </button>
          }
        >
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#5A6275] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search creator by name or @handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-xs text-white placeholder-[#5A6275] focus:outline-none focus:border-[#5B8BF7] focus:ring-1 focus:ring-[#5B8BF7] transition-all font-sans"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-xs text-[#D7DCEA] focus:outline-none focus:border-[#5B8BF7]"
              >
                <option value="all" className="bg-[#0B0E17]">All Categories</option>
                <option value="Tech & AI" className="bg-[#0B0E17]">Tech & AI</option>
                <option value="Fashion & Beauty" className="bg-[#0B0E17]">Fashion & Beauty</option>
                <option value="Fitness & Health" className="bg-[#0B0E17]">Fitness & Health</option>
                <option value="Finance & Crypto" className="bg-[#0B0E17]">Finance & Crypto</option>
                <option value="Gaming & Esports" className="bg-[#0B0E17]">Gaming & Esports</option>
                <option value="Lifestyle & Entertainment" className="bg-[#0B0E17]">Lifestyle</option>
              </select>

              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-xs text-[#D7DCEA] focus:outline-none focus:border-[#5B8BF7]"
              >
                <option value="all" className="bg-[#0B0E17]">All Tiers</option>
                <option value="Mega" className="bg-[#0B0E17]">Mega (1M+)</option>
                <option value="Mid" className="bg-[#0B0E17]">Mid (50K-500K)</option>
                <option value="Micro" className="bg-[#0B0E17]">Micro (10K-50K)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#06080E]/60">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0A0D16] text-[#8FA5D9] border-b border-white/10 text-[11px] font-mono uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Creator</th>
                  <th className="py-3.5 px-4 font-semibold">Niche / Tier</th>
                  <th className="py-3.5 px-4 font-semibold">Followers</th>
                  <th className="py-3.5 px-4 font-semibold">ER% / Auth</th>
                  <th className="py-3.5 px-4 font-semibold">Rate Card</th>
                  <th className="py-3.5 px-4 font-semibold">Trajectory</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-xs">
                {filteredInfluencers.map((inf) => (
                  <tr
                    key={inf.id}
                    onClick={() => onSelectInfluencer(inf)}
                    className="hover:bg-[#101524]/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={inf.avatar}
                          alt={inf.name}
                          className="w-9 h-9 rounded-full object-cover border border-white/20 group-hover:border-[#5B8BF7] transition-colors"
                        />
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1 group-hover:text-[#8FA5D9] transition-colors">
                            <span>{inf.name}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          </div>
                          <span className="text-[11px] text-[#8E95A5]">@{inf.handle}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#D7DCEA] font-medium">{inf.category}</div>
                      <span className="text-[10px] text-[#5A6275]">{inf.tier}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm text-white">{(inf.followers / 1000).toFixed(0)}k</div>
                      <span className="text-[10px] text-[#8E95A5]">~{(inf.avgReelViews / 1000).toFixed(0)}k views/reel</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-[#10B981]">{inf.engagementRate}%</div>
                      <span className="text-[10px] text-[#8E95A5]">{inf.authenticityScore}% verified</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-white">₹{inf.ratePerReel.toLocaleString()}</div>
                      <span className="text-[10px] text-[#8E95A5]">Story: ₹{(inf.ratePerStory / 1000).toFixed(0)}k</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase border inline-block ${
                        inf.performanceStatus === 'stellar'
                          ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/35 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                          : inf.performanceStatus === 'high_growth'
                          ? 'bg-[#5B8BF7]/15 text-[#8FA5D9] border-[#5B8BF7]/35 shadow-[0_0_10px_rgba(91,139,247,0.15)]'
                          : inf.performanceStatus === 'stable'
                          ? 'bg-white/5 text-[#8E95A5] border-white/10'
                          : 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/35'
                      }`}>
                        {inf.performanceStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectInfluencer(inf);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#101524] border border-white/10 text-xs text-[#D7DCEA] hover:text-white hover:border-[#5B8BF7] transition-all cursor-pointer"
                        >
                          Inspect ↗
                        </button>
                        {onSwitchToCreator && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSwitchToCreator(inf);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#10B981] hover:bg-[#10B981] hover:text-black transition-all font-medium flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-pointer"
                            title="Open creator's live studio dashboard"
                          >
                            <span>Studio</span>
                            <span>➔</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VintageCard>
      )}

      {/* TAB 2: BRAND PORTFOLIOS */}
      {activeTab === 'brands' && (
        <VintageCard
          sectionNumber="SECTION II · BRAND CLIENTS"
          title="Brand Partnership Accounts & Commercial Ledgers"
          subtitle="Enterprise clients, contract value, deployed budgets, and live deliverables pipeline"
          badge={
            <button
              onClick={onOpenAddBrandModal}
              className="text-xs font-medium px-3.5 py-1.5 rounded-xl bg-[#5B8BF7] hover:bg-[#4A7AE6] text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(91,139,247,0.35)] transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>+ Onboard Brand Client</span>
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="p-5 rounded-2xl bg-[#06080E]/80 border border-white/10 hover:border-[#5B8BF7]/40 transition-all flex flex-col justify-between group shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-10 h-10 rounded-xl object-cover border border-white/20 group-hover:border-[#5B8BF7] transition-colors"
                    />
                    <div>
                      <h4 className="text-base font-bold text-white">{brand.name}</h4>
                      <span className="text-[11px] text-[#8E95A5]">{brand.industry}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#8E95A5]">Active Campaigns:</span>
                      <strong className="text-white">{brand.activeCampaignsCount} Live</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E95A5]">Total Spend:</span>
                      <strong className="text-white font-mono">₹{(brand.totalSpent / 100000).toFixed(1)}L</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E95A5]">Escrow Balance:</span>
                      <strong className="text-[#10B981] font-mono">₹{(brand.escrowBalance / 100000).toFixed(1)}L</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-[#5A6275] font-mono truncate max-w-[120px]">{brand.contactEmail}</span>
                  <button
                    onClick={onOpenCampaignGenerator}
                    className="text-xs font-medium text-[#8FA5D9] hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>New Brief</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </VintageCard>
      )}

      {/* TAB 3: CAMPAIGNS & ESCROW */}
      {activeTab === 'campaigns' && (
        <VintageCard
          sectionNumber="SECTION III · COMMERCIAL ESCROW"
          title="Active Campaigns & Deliverables Clearance Vault"
          subtitle="Brand campaign budgets, milestone deliverables review, 1-click escrow payout release, and 20% agency margins"
          badge={
            <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              ESCROW LOCKED: ₹{(financials.escrowHeld / 100000).toFixed(1)} LAKHS
            </span>
          }
        >
          <div className="space-y-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-5 rounded-2xl bg-[#06080E]/80 border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-white">{camp.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#141B2D] text-[#8FA5D9] border border-white/10 font-mono">
                        {camp.brandName}
                      </span>
                    </div>
                    <span className="text-xs text-[#8E95A5] mt-0.5 block">
                      Timeline: {camp.startDate} to {camp.endDate} · Niche: {camp.niche}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-[#8E95A5] block">Total Campaign Budget:</span>
                      <div className="text-lg font-bold text-[#10B981]">
                        ₹{(camp.totalBudget / 100000).toFixed(2)} Lakhs
                        <span className="text-xs font-sans text-[#8E95A5] font-normal ml-2">
                          (Agency Margin: ₹{((camp.totalBudget * 0.2) / 100000).toFixed(2)}L)
                        </span>
                      </div>
                    </div>

                    {onOpenContract && (
                      <button
                        onClick={() => onOpenContract(camp)}
                        className="px-3 py-1.5 rounded-xl bg-[#101524] border border-white/10 hover:border-[#5B8BF7] text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-all shadow-vintage-xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#5B8BF7]" />
                        <span>Contract & Invoice</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#8FA5D9] block font-semibold">
                    Deliverables & Escrow Milestones:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {camp.deliverables.map((del) => (
                      <div
                        key={del.id}
                        className="p-3.5 rounded-xl bg-[#0A0D16] border border-white/10 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">@{del.influencerHandle}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase border ${
                            del.status === 'live'
                              ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                              : del.status === 'draft_submitted'
                              ? 'bg-[#F43F5E]/15 text-[#FDA4AF] border-[#F43F5E]/30'
                              : 'bg-white/5 text-[#8E95A5] border-white/10'
                          }`}>
                            {del.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="text-[#8E95A5]">
                          {del.type} · Due {del.dueDate}
                        </div>

                        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                          <span className="font-mono font-medium text-white">
                            ₹{del.agreedPayout.toLocaleString()}
                          </span>

                          {del.status === 'draft_submitted' && (
                            <button
                              onClick={() => onApproveDeliverable(camp.id, del.id)}
                              className="px-2.5 py-1 rounded-lg bg-[#10B981] hover:bg-[#0E9F6E] text-black font-semibold text-[11px] shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-colors cursor-pointer"
                            >
                              Approve & Release Escrow
                            </button>
                          )}

                          {del.status === 'live' && (
                            <span className="text-[11px] text-[#10B981] font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Live on Instagram</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </VintageCard>
      )}

      {/* TAB 4: ACCESS CREDENTIALS DIRECTORY */}
      {activeTab === 'accounts' && (
        <VintageCard
          sectionNumber="SECTION IV · ACCESS CONTROL"
          title="Designated Client & Creator Login Credentials"
          subtitle="All platform accounts generated by the Admin. Copy credentials to send directly to brands and creators."
          badge={
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddBrandModal}
                className="text-xs px-3 py-1.5 rounded-xl bg-[#101524] border border-white/10 text-white hover:border-[#10B981] transition-all cursor-pointer"
              >
                + New Brand Login
              </button>
              <button
                onClick={onOpenAddModal}
                className="text-xs px-3 py-1.5 rounded-xl bg-[#5B8BF7] hover:bg-[#4A7AE6] text-white shadow-[0_0_15px_rgba(91,139,247,0.35)] transition-all cursor-pointer"
              >
                + New Creator Login
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#06080E]/60">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0A0D16] text-[#8FA5D9] border-b border-white/10 text-[11px] font-mono uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Account User</th>
                  <th className="py-3.5 px-4 font-semibold">Role Type</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Email ID</th>
                  <th className="py-3.5 px-4 font-semibold">Password</th>
                  <th className="py-3.5 px-4 font-semibold">Last Login</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Dispatch Packet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-xs font-mono">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-[#101524]/80 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{acc.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium uppercase border ${
                        acc.role === 'agency'
                          ? 'bg-[#5B8BF7]/15 text-[#8FA5D9] border-[#5B8BF7]/30'
                          : acc.role === 'brand'
                          ? 'bg-[#F43F5E]/15 text-[#FDA4AF] border-[#F43F5E]/30'
                          : 'bg-[#10B981]/15 text-[#6EE7B7] border-[#10B981]/30'
                      }`}>
                        {acc.role === 'agency' ? 'Super Admin' : acc.role === 'brand' ? 'Brand Client' : 'Creator'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#D7DCEA]">
                      {acc.email}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#8E95A5]">
                      {acc.password}
                    </td>

                    <td className="py-3.5 px-4 text-[#5A6275] text-[11px]">
                      {acc.lastLogin || 'Recent'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopyCredentials(acc)}
                          title="Copy login slip"
                          className="p-1.5 rounded-lg bg-[#101524] hover:bg-white/10 text-white border border-white/10 text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          {copiedAccountId === acc.id ? (
                            <Check className="w-3.5 h-3.5 text-[#10B981]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-[#8FA5D9]" />
                          )}
                          <span className="text-[11px] hidden sm:inline">{copiedAccountId === acc.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`*The I Company · Portal Access Credentials*\nHello ${acc.name},\n\nYour ${acc.role.toUpperCase()} portal is active:\nURL: https://theicompany.netlify.app\nEmail: ${acc.email}\nPassword: ${acc.password}\n\nPlease log in to access your designated workspace.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Dispatch via WhatsApp"
                          className="p-1.5 rounded-lg bg-[#10B981]/15 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/30 text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">WhatsApp</span>
                        </a>

                        <a
                          href={`mailto:${acc.email}?subject=${encodeURIComponent(`The I Company · Your Portal Credentials (${acc.role.toUpperCase()})`)}&body=${encodeURIComponent(`Hello ${acc.name},\n\nYour platform account credentials for The I Company are ready:\n\nAccess URL: https://theicompany.netlify.app\nAssigned Email: ${acc.email}\nPassword: ${acc.password}\n\nPlease sign in to access your dashboard.\n\nBest regards,\nThe I Company Atelier`)}`}
                          title="Dispatch via Email"
                          className="p-1.5 rounded-lg bg-[#101524] hover:bg-white/10 text-white border border-white/10 text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#8FA5D9]" />
                          <span className="text-[11px] hidden sm:inline">Email</span>
                        </a>

                        {onSwitchToAccount && (
                          <button
                            onClick={() => onSwitchToAccount(acc)}
                            title="Directly enter this portal"
                            className="p-1.5 rounded-lg bg-[#101524] hover:bg-white/10 text-white border border-white/10 text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-[#10B981]" />
                            <span className="text-[11px] hidden sm:inline">Open</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VintageCard>
      )}

      {/* TAB 5: GEOGRAPHIC REACH */}
      {activeTab === 'geo' && (
        <VintageAudienceMatrix />
      )}

      {/* TAB 6: SYSTEM AUDIT LEDGER */}
      {activeTab === 'ledger' && (
        <VintageCard
          sectionNumber="SECTION V · TRANSACTION LOG"
          title="Real-Time Agency Activity & Audit Ledger"
          subtitle="Immutable operational log of talent additions, contract agreements, content clearance and disbursements"
        >
          <div className="divide-y divide-white/[0.06] text-xs">
            {financials.recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    tx.type === 'brand_deposit'
                      ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                      : tx.type === 'creator_payout'
                      ? 'bg-[#F43F5E]/15 text-[#FDA4AF] border border-[#F43F5E]/30'
                      : 'bg-white/10 text-white'
                  }`}>
                    {tx.type === 'brand_deposit' ? 'IN' : tx.type === 'creator_payout' ? 'OUT' : 'COM'}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{tx.campaignName}</div>
                    <span className="text-[11px] text-[#8E95A5]">{tx.timestamp} · Status: {tx.status}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-white">
                    {tx.type === 'brand_deposit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-[#5A6275] font-mono">{tx.id.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </VintageCard>
      )}
    </div>
  );
};
