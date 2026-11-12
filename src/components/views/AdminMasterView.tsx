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
      {/* SECTION 1: EXECUTIVE KEY METRICS STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm hover:shadow-vintage-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span className="font-mono uppercase tracking-wider text-[10px]">MANAGED ROSTER</span>
            <Users className="w-4 h-4 text-[#1C1917]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#1C1917] mt-2">
            {influencers.length} Creators
          </div>
          <div className="flex items-center justify-between text-xs text-[#78716C] mt-2 pt-2 border-t border-[#F0ECE4]">
            <span>Total Reach:</span>
            <strong className="text-[#1C1917] font-mono">{(totalFollowers / 1000000).toFixed(1)}M</strong>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm hover:shadow-vintage-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span className="font-mono uppercase tracking-wider text-[10px]">COMMERCIAL VOLUME (GMV)</span>
            <DollarSign className="w-4 h-4 text-[#2E523E]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#2E523E] mt-2">
            ₹{(financials.totalGMV / 100000).toFixed(1)} Lakhs
          </div>
          <div className="flex items-center justify-between text-xs text-[#78716C] mt-2 pt-2 border-t border-[#F0ECE4]">
            <span>Escrow Secured:</span>
            <strong className="text-[#2E523E] font-mono">₹{(financials.escrowHeld / 100000).toFixed(1)}L</strong>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm hover:shadow-vintage-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span className="font-mono uppercase tracking-wider text-[10px]">AGENCY REVENUE (20%)</span>
            <TrendingUp className="w-4 h-4 text-[#C25E3E]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#C25E3E] mt-2">
            ₹{(financials.agencyRevenue / 100000).toFixed(2)} Lakhs
          </div>
          <div className="flex items-center justify-between text-xs text-[#78716C] mt-2 pt-2 border-t border-[#F0ECE4]">
            <span>Disbursed to Talent:</span>
            <strong className="text-[#1C1917] font-mono">₹{(financials.creatorsPaid / 100000).toFixed(1)}L</strong>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm hover:shadow-vintage-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span className="font-mono uppercase tracking-wider text-[10px]">AUTHENTICITY RATING</span>
            <ShieldCheck className="w-4 h-4 text-[#1C1917]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#1C1917] mt-2">
            {avgAuthenticity}% Authentic
          </div>
          <div className="flex items-center justify-between text-xs text-[#78716C] mt-2 pt-2 border-t border-[#F0ECE4]">
            <span>Bot Shield Verification:</span>
            <span className="text-[#2E523E] font-semibold text-[11px]">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ADMIN NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#E7E2DA]">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#EFECE6] border border-[#E2DDD5] overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('roster')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-md text-xs font-sans transition-all select-none ${
              activeTab === 'roster'
                ? 'bg-white text-[#1C1917] font-semibold shadow-vintage-sm border border-[#E2DDD5]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Influencer Roster ({influencers.length})
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-md text-xs font-sans transition-all select-none ${
              activeTab === 'brands'
                ? 'bg-white text-[#1C1917] font-semibold shadow-vintage-sm border border-[#E2DDD5]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Brand Portfolios ({brands.length})
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-md text-xs font-sans transition-all select-none ${
              activeTab === 'campaigns'
                ? 'bg-white text-[#1C1917] font-semibold shadow-vintage-sm border border-[#E2DDD5]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Campaigns & Escrow ({campaigns.length})
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-md text-xs font-sans transition-all select-none flex items-center gap-1.5 ${
              activeTab === 'accounts'
                ? 'bg-white text-[#1C1917] font-semibold shadow-vintage-sm border border-[#E2DDD5]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-[#C25E3E]" />
            <span>Login Credentials ({accounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('geo')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-md text-xs font-sans transition-all select-none ${
              activeTab === 'geo'
                ? 'bg-white text-[#1C1917] font-semibold shadow-vintage-sm border border-[#E2DDD5]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Regional Reach (6 Hubs)
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-md text-xs font-sans transition-all select-none ${
              activeTab === 'ledger'
                ? 'bg-white text-[#1C1917] font-semibold shadow-vintage-sm border border-[#E2DDD5]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Audit Ledger
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2DDD5] text-xs font-medium text-[#1C1917] hover:bg-[#F5F2EB] shadow-vintage-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Link Creator</span>
          </button>

          <button
            onClick={onOpenAddBrandModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2DDD5] text-xs font-medium text-[#1C1917] hover:bg-[#F5F2EB] shadow-vintage-sm"
          >
            <Building2 className="w-3.5 h-3.5" />
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
              className="text-xs font-medium px-3 py-1 rounded bg-[#1C1917] text-white hover:bg-[#2E2A27]"
            >
              + Link Instagram Handle
            </button>
          }
        >
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search creator by name or @handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-all font-sans"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              >
                <option value="all">All Categories</option>
                <option value="Tech & AI">Tech & AI</option>
                <option value="Fashion & Beauty">Fashion & Beauty</option>
                <option value="Fitness & Health">Fitness & Health</option>
                <option value="Finance & Crypto">Finance & Crypto</option>
                <option value="Gaming & Esports">Gaming & Esports</option>
                <option value="Lifestyle & Entertainment">Lifestyle</option>
              </select>

              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              >
                <option value="all">All Tiers</option>
                <option value="Mega">Mega (1M+)</option>
                <option value="Mid">Mid (50K-500K)</option>
                <option value="Micro">Micro (10K-50K)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-[#E7E2DA]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#78716C] border-b border-[#E7E2DA] text-[11px] font-mono uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Creator</th>
                  <th className="py-3 px-4 font-semibold">Niche / Tier</th>
                  <th className="py-3 px-4 font-semibold">Followers</th>
                  <th className="py-3 px-4 font-semibold">ER% / Auth</th>
                  <th className="py-3 px-4 font-semibold">Rate Card</th>
                  <th className="py-3 px-4 font-semibold">Trajectory</th>
                  <th className="py-3 px-4 font-semibold text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE4] text-xs bg-white">
                {filteredInfluencers.map((inf) => (
                  <tr
                    key={inf.id}
                    onClick={() => onSelectInfluencer(inf)}
                    className="hover:bg-[#FAF8F5] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={inf.avatar}
                          alt={inf.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#E2DDD5]"
                        />
                        <div>
                          <div className="font-semibold text-[#1C1917] flex items-center gap-1 group-hover:text-[#C25E3E] transition-colors">
                            <span>{inf.name}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E523E]" />
                          </div>
                          <span className="text-[11px] text-[#78716C]">@{inf.handle}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-[#1C1917] font-medium">{inf.category}</div>
                      <span className="text-[10px] text-[#A8A29E]">{inf.tier}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-serif font-bold text-sm text-[#1C1917]">{(inf.followers / 1000).toFixed(0)}k</div>
                      <span className="text-[10px] text-[#78716C]">~{(inf.avgReelViews / 1000).toFixed(0)}k views/reel</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-[#2E523E]">{inf.engagementRate}%</div>
                      <span className="text-[10px] text-[#78716C]">{inf.authenticityScore}% verified</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-[#1C1917]">₹{inf.ratePerReel.toLocaleString()}</div>
                      <span className="text-[10px] text-[#78716C]">Story: ₹{(inf.ratePerStory / 1000).toFixed(0)}k</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium uppercase border inline-block ${
                        inf.performanceStatus === 'stellar'
                          ? 'bg-[#EEF5F1] text-[#2E523E] border-[#D1E3D8]'
                          : inf.performanceStatus === 'high_growth'
                          ? 'bg-[#FDF3EE] text-[#C25E3E] border-[#F2DACF]'
                          : inf.performanceStatus === 'stable'
                          ? 'bg-[#F5F2EB] text-[#57534E] border-[#E7E2DA]'
                          : 'bg-[#FDF8EC] text-[#B8860B] border-[#F5E6BD]'
                      }`}>
                        {inf.performanceStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectInfluencer(inf);
                          }}
                          className="px-2.5 py-1 rounded bg-[#FAF8F5] border border-[#E2DDD5] text-xs text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-colors"
                        >
                          Inspect ↗
                        </button>
                        {onSwitchToCreator && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSwitchToCreator(inf);
                            }}
                            className="px-2.5 py-1 rounded bg-[#EEF5F1] border border-[#D1E3D8] text-xs text-[#2E523E] hover:bg-[#2E523E] hover:text-white transition-colors font-medium flex items-center gap-1 shadow-vintage-xs"
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
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-[#1C1917] text-white hover:bg-[#2E2A27] flex items-center gap-1.5 shadow-vintage-sm"
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
                className="p-5 rounded-xl bg-white border border-[#E7E2DA] hover:border-[#D6CFBF] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#E2DDD5]"
                    />
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#1C1917]">{brand.name}</h4>
                      <span className="text-[11px] text-[#78716C]">{brand.industry}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0ECE4] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#78716C]">Active Campaigns:</span>
                      <strong className="text-[#1C1917]">{brand.activeCampaignsCount} Live</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78716C]">Total Spend:</span>
                      <strong className="text-[#1C1917] font-mono">₹{(brand.totalSpent / 100000).toFixed(1)}L</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78716C]">Escrow Balance:</span>
                      <strong className="text-[#2E523E] font-mono">₹{(brand.escrowBalance / 100000).toFixed(1)}L</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                  <span className="text-[11px] text-[#A8A29E] font-mono truncate max-w-[120px]">{brand.contactEmail}</span>
                  <button
                    onClick={onOpenCampaignGenerator}
                    className="text-xs font-medium text-[#C25E3E] hover:underline flex items-center gap-1"
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
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#EEF5F1] text-[#2E523E] border border-[#D1E3D8] font-bold">
              ESCROW LOCKED: ₹{(financials.escrowHeld / 100000).toFixed(1)} LAKHS
            </span>
          }
        >
          <div className="space-y-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-5 rounded-xl bg-white border border-[#E7E2DA] hover:border-[#D6CFBF] transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0ECE4]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-lg font-bold text-[#1C1917]">{camp.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#F5F2EB] text-[#78716C] border border-[#E2DDD5]">
                        {camp.brandName}
                      </span>
                    </div>
                    <span className="text-xs text-[#78716C]">
                      Timeline: {camp.startDate} to {camp.endDate} · Niche: {camp.niche}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-[#78716C] block">Total Campaign Budget:</span>
                      <div className="font-serif text-lg font-bold text-[#2E523E]">
                        ₹{(camp.totalBudget / 100000).toFixed(2)} Lakhs
                        <span className="text-xs font-sans text-[#78716C] font-normal ml-2">
                          (Agency Margin: ₹{((camp.totalBudget * 0.2) / 100000).toFixed(2)}L)
                        </span>
                      </div>
                    </div>

                    {onOpenContract && (
                      <button
                        onClick={() => onOpenContract(camp)}
                        className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D6CFBF] hover:bg-[#1C1917] hover:text-white text-xs font-medium text-[#1C1917] flex items-center justify-center gap-1.5 transition-all shadow-vintage-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#8A6B32]" />
                        <span>Contract & Invoice</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#78716C] block">
                    Deliverables & Escrow Milestones:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {camp.deliverables.map((del) => (
                      <div
                        key={del.id}
                        className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#1C1917]">@{del.influencerHandle}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${
                            del.status === 'live'
                              ? 'bg-[#EEF5F1] text-[#2E523E] border-[#D1E3D8]'
                              : del.status === 'draft_submitted'
                              ? 'bg-[#FDF3EE] text-[#C25E3E] border-[#F2DACF]'
                              : 'bg-white text-[#78716C] border-[#E7E2DA]'
                          }`}>
                            {del.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="text-[#57534E]">
                          {del.type} · Due {del.dueDate}
                        </div>

                        <div className="pt-2 border-t border-[#EFECE6] flex items-center justify-between">
                          <span className="font-mono font-medium text-[#1C1917]">
                            ₹{del.agreedPayout.toLocaleString()}
                          </span>

                          {del.status === 'draft_submitted' && (
                            <button
                              onClick={() => onApproveDeliverable(camp.id, del.id)}
                              className="px-2.5 py-1 rounded bg-[#2E523E] hover:bg-[#244231] text-white text-[11px] font-medium transition-colors"
                            >
                              Approve & Release Escrow
                            </button>
                          )}

                          {del.status === 'live' && (
                            <span className="text-[11px] text-[#2E523E] font-medium flex items-center gap-1">
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

      {/* TAB 4: ACCESS CREDENTIALS DIRECTORY (NEW) */}
      {activeTab === 'accounts' && (
        <VintageCard
          sectionNumber="SECTION IV · ACCESS CONTROL"
          title="Designated Client & Creator Login Credentials"
          subtitle="All platform accounts generated by the Admin. Copy credentials to send directly to brands and creators."
          badge={
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddBrandModal}
                className="text-xs px-2.5 py-1 rounded bg-white border border-[#E2DDD5] text-[#1C1917] hover:bg-[#FAF8F5]"
              >
                + New Brand Login
              </button>
              <button
                onClick={onOpenAddModal}
                className="text-xs px-2.5 py-1 rounded bg-[#1C1917] text-white hover:bg-[#2E2A27]"
              >
                + New Creator Login
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto rounded-xl border border-[#E7E2DA]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#78716C] border-b border-[#E7E2DA] text-[11px] font-mono uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Account User</th>
                  <th className="py-3 px-4 font-semibold">Role Type</th>
                  <th className="py-3 px-4 font-semibold">Assigned Email ID</th>
                  <th className="py-3 px-4 font-semibold">Password</th>
                  <th className="py-3 px-4 font-semibold">Last Login</th>
                  <th className="py-3 px-4 font-semibold text-right">Dispatch Packet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE4] text-xs bg-white font-mono">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4 font-sans font-semibold text-[#1C1917]">
                      <div className="flex items-center gap-2">
                        <span>{acc.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium uppercase border ${
                        acc.role === 'agency'
                          ? 'bg-[#EEF5F1] text-[#2E523E] border-[#D1E3D8]'
                          : acc.role === 'brand'
                          ? 'bg-[#FDF3EE] text-[#C25E3E] border-[#F2DACF]'
                          : 'bg-[#FDF8EC] text-[#B8860B] border-[#F5E6BD]'
                      }`}>
                        {acc.role === 'agency' ? 'Super Admin' : acc.role === 'brand' ? 'Brand Client' : 'Creator'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[#1C1917]">
                      {acc.email}
                    </td>

                    <td className="py-3 px-4 font-semibold text-[#57534E]">
                      {acc.password}
                    </td>

                    <td className="py-3 px-4 text-[#78716C] text-[11px]">
                      {acc.lastLogin || 'Recent'}
                    </td>

                    <td className="py-3 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopyCredentials(acc)}
                          title="Copy login slip"
                          className="p-1.5 rounded bg-[#FAF8F5] hover:bg-[#1C1917] text-[#1C1917] hover:text-white border border-[#E2DDD5] text-xs transition-colors inline-flex items-center gap-1"
                        >
                          {copiedAccountId === acc.id ? (
                            <Check className="w-3.5 h-3.5 text-[#2E523E]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[11px] hidden sm:inline">{copiedAccountId === acc.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`*The I Company · Portal Access Credentials*\nHello ${acc.name},\n\nYour ${acc.role.toUpperCase()} portal is active:\nURL: https://theicompany.netlify.app\nEmail: ${acc.email}\nPassword: ${acc.password}\n\nPlease log in to access your designated workspace.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Dispatch via WhatsApp"
                          className="p-1.5 rounded bg-[#EEF5F1] hover:bg-[#2E523E] text-[#2E523E] hover:text-white border border-[#D1E3D8] text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">WhatsApp</span>
                        </a>

                        <a
                          href={`mailto:${acc.email}?subject=${encodeURIComponent(`The I Company · Your Portal Credentials (${acc.role.toUpperCase()})`)}&body=${encodeURIComponent(`Hello ${acc.name},\n\nYour platform account credentials for The I Company are ready:\n\nAccess URL: https://theicompany.netlify.app\nAssigned Email: ${acc.email}\nPassword: ${acc.password}\n\nPlease sign in to access your dashboard.\n\nBest regards,\nThe I Company Atelier`)}`}
                          title="Dispatch via Email"
                          className="p-1.5 rounded bg-[#FAF8F5] hover:bg-[#1C1917] text-[#1C1917] hover:text-white border border-[#E2DDD5] text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">Email</span>
                        </a>

                        {onSwitchToAccount && (
                          <button
                            onClick={() => onSwitchToAccount(acc)}
                            title="Directly enter this portal"
                            className="p-1.5 rounded bg-[#FAF8F5] hover:bg-[#1C1917] text-[#1C1917] hover:text-white border border-[#E2DDD5] text-xs transition-colors inline-flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-[#2E523E]" />
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
          <div className="divide-y divide-[#F0ECE4] text-xs">
            {financials.recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    tx.type === 'brand_deposit'
                      ? 'bg-[#EEF5F1] text-[#2E523E]'
                      : tx.type === 'creator_payout'
                      ? 'bg-[#FDF3EE] text-[#C25E3E]'
                      : 'bg-[#F5F2EB] text-[#1C1917]'
                  }`}>
                    {tx.type === 'brand_deposit' ? 'IN' : tx.type === 'creator_payout' ? 'OUT' : 'COM'}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1C1917]">{tx.campaignName}</div>
                    <span className="text-[11px] text-[#78716C]">{tx.timestamp} · Status: {tx.status}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-[#1C1917]">
                    {tx.type === 'brand_deposit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-[#A8A29E] font-mono">{tx.id.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </VintageCard>
      )}
    </div>
  );
};
