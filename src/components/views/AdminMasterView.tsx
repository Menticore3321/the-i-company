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
      {/* SECTION 1: EXECUTIVE KEY METRICS STRIP (Weather Card Glassmorphic Pods) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="weather-glass-card weather-glass-card-hover rounded-3xl p-5 relative overflow-hidden group">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent absolute top-0 left-0 opacity-90" />
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="font-mono uppercase tracking-wider text-[10px] font-bold">MANAGED ROSTER</span>
            <span className="p-2 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-600 shadow-xs">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight font-sans">
            {influencers.length} Creators
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 mt-2.5 pt-2.5 border-t border-white/60 font-medium">
            <span>Total Reach:</span>
            <strong className="text-slate-900 font-mono font-extrabold">{(totalFollowers / 1000000).toFixed(1)}M</strong>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="weather-glass-card weather-glass-card-hover rounded-3xl p-5 relative overflow-hidden group">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent absolute top-0 left-0 opacity-90" />
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="font-mono uppercase tracking-wider text-[10px] font-bold">COMMERCIAL VOLUME (GMV)</span>
            <span className="p-2 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-600 shadow-xs">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2 tracking-tight font-sans">
            ₹{(financials.totalGMV / 100000).toFixed(1)} Lakhs
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 mt-2.5 pt-2.5 border-t border-white/60 font-medium">
            <span>Escrow Secured:</span>
            <strong className="text-emerald-700 font-mono font-extrabold">₹{(financials.escrowHeld / 100000).toFixed(1)}L</strong>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="weather-glass-card weather-glass-card-hover rounded-3xl p-5 relative overflow-hidden group">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent absolute top-0 left-0 opacity-90" />
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="font-mono uppercase tracking-wider text-[10px] font-bold">AGENCY REVENUE (20%)</span>
            <span className="p-2 rounded-2xl bg-purple-50/80 border border-purple-200/80 text-purple-600 shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight font-sans">
            ₹{(financials.agencyRevenue / 100000).toFixed(2)} Lakhs
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 mt-2.5 pt-2.5 border-t border-white/60 font-medium">
            <span>Disbursed to Talent:</span>
            <strong className="text-slate-900 font-mono font-extrabold">₹{(financials.creatorsPaid / 100000).toFixed(1)}L</strong>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="weather-glass-card weather-glass-card-hover rounded-3xl p-5 relative overflow-hidden group">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent absolute top-0 left-0 opacity-90" />
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="font-mono uppercase tracking-wider text-[10px] font-bold">AUTHENTICITY RATING</span>
            <span className="p-2 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-600 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight font-sans">
            {avgAuthenticity}% Authentic
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 mt-2.5 pt-2.5 border-t border-white/60 font-medium">
            <span>Bot Shield Verification:</span>
            <span className="text-emerald-700 font-extrabold text-[11px] font-mono">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ADMIN NAVIGATION TABS (Weather Card Frosted Pill Bar) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/60">
        <div className="flex items-center gap-1.5 p-1.5 rounded-3xl weather-glass-pod overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('roster')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs transition-all select-none cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-white text-blue-600 font-bold shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-white/80'
                : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/40'
            }`}
          >
            Influencer Roster ({influencers.length})
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs transition-all select-none cursor-pointer ${
              activeTab === 'brands'
                ? 'bg-white text-blue-600 font-bold shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-white/80'
                : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/40'
            }`}
          >
            Brand Portfolios ({brands.length})
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs transition-all select-none cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-white text-blue-600 font-bold shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-white/80'
                : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/40'
            }`}
          >
            Campaigns & Escrow ({campaigns.length})
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs transition-all select-none flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'accounts'
                ? 'bg-white text-blue-600 font-bold shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-white/80'
                : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/40'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-blue-600" />
            <span>Login Credentials ({accounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('geo')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs transition-all select-none cursor-pointer ${
              activeTab === 'geo'
                ? 'bg-white text-blue-600 font-bold shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-white/80'
                : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/40'
            }`}
          >
            Regional Reach (6 Hubs)
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs transition-all select-none cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-white text-blue-600 font-bold shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-white/80'
                : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/40'
            }`}
          >
            Audit Ledger
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Link Creator</span>
          </button>

          <button
            onClick={onOpenAddBrandModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-emerald-700 shadow-xs transition-all cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
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
              className="text-xs font-semibold px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
            >
              + Link Instagram Handle
            </button>
          }
        >
          {/* Search & Filter Bar (Weather Card Sub-Pods) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search creator by name or @handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl weather-glass-pod focus:bg-white focus:border-blue-500 text-xs text-slate-900 placeholder-slate-400 transition-all font-sans outline-none shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl weather-glass-pod text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 shadow-xs"
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
                className="px-3.5 py-2.5 rounded-2xl weather-glass-pod text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 shadow-xs"
              >
                <option value="all">All Tiers</option>
                <option value="Mega">Mega (1M+)</option>
                <option value="Mid">Mid (50K-500K)</option>
                <option value="Micro">Micro (10K-50K)</option>
              </select>
            </div>
          </div>

          {/* Table (Weather Glass Pod Container) */}
          <div className="overflow-x-auto rounded-3xl weather-glass-pod shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/40 text-slate-600 border-b border-white/60 text-[11px] font-mono uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Creator</th>
                  <th className="py-3.5 px-4 font-bold">Niche / Tier</th>
                  <th className="py-3.5 px-4 font-bold">Followers</th>
                  <th className="py-3.5 px-4 font-bold">ER% / Auth</th>
                  <th className="py-3.5 px-4 font-bold">Rate Card</th>
                  <th className="py-3.5 px-4 font-bold">Trajectory</th>
                  <th className="py-3.5 px-4 font-bold text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/50 text-xs">
                {filteredInfluencers.map((inf) => (
                  <tr
                    key={inf.id}
                    onClick={() => onSelectInfluencer(inf)}
                    className="hover:bg-white/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={inf.avatar}
                          alt={inf.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 group-hover:border-blue-500 transition-colors shadow-xs"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1 group-hover:text-blue-600 transition-colors font-sans text-sm">
                            <span>{inf.name}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <span className="text-[11px] text-blue-600 font-mono font-medium">@{inf.handle}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-semibold font-sans">{inf.category}</div>
                      <span className="text-[10px] text-slate-500 font-mono">{inf.tier}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm text-slate-900 font-sans">{(inf.followers / 1000).toFixed(0)}k</div>
                      <span className="text-[10px] text-slate-500 font-mono">~{(inf.avgReelViews / 1000).toFixed(0)}k views/reel</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-emerald-600">{inf.engagementRate}%</div>
                      <span className="text-[10px] text-slate-500 font-mono">{inf.authenticityScore}% verified</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">₹{inf.ratePerReel.toLocaleString()}</div>
                      <span className="text-[10px] text-slate-500 font-mono">Story: ₹{(inf.ratePerStory / 1000).toFixed(0)}k</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border inline-block ${
                        inf.performanceStatus === 'stellar'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : inf.performanceStatus === 'high_growth'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : inf.performanceStatus === 'stable'
                          ? 'bg-slate-50 text-slate-700 border-slate-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
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
                          className="px-3 py-1 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all cursor-pointer shadow-xs"
                        >
                          Inspect ↗
                        </button>
                        {onSwitchToCreator && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSwitchToCreator(inf);
                            }}
                            className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
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
              className="text-xs font-semibold px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-1.5 shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
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
                className="p-5 rounded-2xl bg-white/80 border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 group-hover:border-blue-400 transition-colors shadow-xs"
                    />
                    <div>
                      <h4 className="text-base font-bold text-slate-900 font-sans">{brand.name}</h4>
                      <span className="text-[11px] text-slate-500 font-medium">{brand.industry}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Active Campaigns:</span>
                      <strong className="text-slate-900 font-bold">{brand.activeCampaignsCount} Live</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Total Spend:</span>
                      <strong className="text-slate-900 font-mono font-bold">₹{(brand.totalSpent / 100000).toFixed(1)}L</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Escrow Balance:</span>
                      <strong className="text-emerald-600 font-mono font-bold">₹{(brand.escrowBalance / 100000).toFixed(1)}L</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-[120px]">{brand.contactEmail}</span>
                  <button
                    onClick={onOpenCampaignGenerator}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
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
            <span className="font-mono text-xs px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shadow-xs">
              ESCROW LOCKED: ₹{(financials.escrowHeld / 100000).toFixed(1)} LAKHS
            </span>
          }
        >
          <div className="space-y-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-5 rounded-2xl bg-white/80 border border-slate-200/90 hover:border-slate-300 transition-all space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-slate-900 font-sans tracking-tight">{camp.name}</h4>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono font-semibold">
                        {camp.brandName}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block font-medium">
                      Timeline: {camp.startDate} to {camp.endDate} · Niche: {camp.niche}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block font-medium">Total Campaign Budget:</span>
                      <div className="text-lg font-extrabold text-emerald-600 font-sans">
                        ₹{(camp.totalBudget / 100000).toFixed(2)} Lakhs
                        <span className="text-xs font-sans text-slate-500 font-normal ml-2">
                          (Agency Margin: ₹{((camp.totalBudget * 0.2) / 100000).toFixed(2)}L)
                        </span>
                      </div>
                    </div>

                    {onOpenContract && (
                      <button
                        onClick={() => onOpenContract(camp)}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Contract & Invoice</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-700 block font-bold">
                    Deliverables & Escrow Milestones:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {camp.deliverables.map((del) => (
                      <div
                        key={del.id}
                        className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">@{del.influencerHandle}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                            del.status === 'live'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : del.status === 'draft_submitted'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-white text-slate-600 border-slate-200'
                          }`}>
                            {del.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="text-slate-500 font-medium">
                          {del.type} · Due {del.dueDate}
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900">
                            ₹{del.agreedPayout.toLocaleString()}
                          </span>

                          {del.status === 'draft_submitted' && (
                            <button
                              onClick={() => onApproveDeliverable(camp.id, del.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs transition-colors cursor-pointer"
                            >
                              Approve & Release
                            </button>
                          )}

                          {del.status === 'live' && (
                            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Live on IG</span>
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
                className="text-xs px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold transition-all cursor-pointer shadow-xs"
              >
                + New Brand Login
              </button>
              <button
                onClick={onOpenAddModal}
                className="text-xs px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
              >
                + New Creator Login
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white/80 shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 text-slate-500 border-b border-slate-200/80 text-[11px] font-mono uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Account User</th>
                  <th className="py-3.5 px-4 font-semibold">Role Type</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Email ID</th>
                  <th className="py-3.5 px-4 font-semibold">Password</th>
                  <th className="py-3.5 px-4 font-semibold">Last Login</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Dispatch Packet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{acc.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase border ${
                        acc.role === 'agency'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : acc.role === 'brand'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {acc.role === 'agency' ? 'Super Admin' : acc.role === 'brand' ? 'Brand Client' : 'Creator'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {acc.email}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {acc.password}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {acc.lastLogin || 'Recent'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopyCredentials(acc)}
                          title="Copy login slip"
                          className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs transition-colors inline-flex items-center gap-1 cursor-pointer shadow-xs font-semibold"
                        >
                          {copiedAccountId === acc.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span className="text-[11px] hidden sm:inline">{copiedAccountId === acc.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`*The I Company · Portal Access Credentials*\nHello ${acc.name},\n\nYour ${acc.role.toUpperCase()} portal is active:\nURL: https://theicompany.netlify.app\nEmail: ${acc.email}\nPassword: ${acc.password}\n\nPlease log in to access your designated workspace.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Dispatch via WhatsApp"
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs transition-colors inline-flex items-center gap-1 font-semibold"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">WhatsApp</span>
                        </a>

                        <a
                          href={`mailto:${acc.email}?subject=${encodeURIComponent(`The I Company · Your Portal Credentials (${acc.role.toUpperCase()})`)}&body=${encodeURIComponent(`Hello ${acc.name},\n\nYour platform account credentials for The I Company are ready:\n\nAccess URL: https://theicompany.netlify.app\nAssigned Email: ${acc.email}\nPassword: ${acc.password}\n\nPlease sign in to access your dashboard.\n\nBest regards,\nThe I Company Atelier`)}`}
                          title="Dispatch via Email"
                          className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs transition-colors inline-flex items-center gap-1 font-semibold shadow-xs"
                        >
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-[11px] hidden sm:inline">Email</span>
                        </a>

                        {onSwitchToAccount && (
                          <button
                            onClick={() => onSwitchToAccount(acc)}
                            title="Directly enter this portal"
                            className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs transition-colors inline-flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
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
          <div className="divide-y divide-slate-100 text-xs">
            {financials.recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs ${
                    tx.type === 'brand_deposit'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : tx.type === 'creator_payout'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {tx.type === 'brand_deposit' ? 'IN' : tx.type === 'creator_payout' ? 'OUT' : 'COM'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 font-sans">{tx.campaignName}</div>
                    <span className="text-[11px] text-slate-500 font-medium">{tx.timestamp} · Status: {tx.status}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-slate-900">
                    {tx.type === 'brand_deposit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{tx.id.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </VintageCard>
      )}
    </div>
  );
};
