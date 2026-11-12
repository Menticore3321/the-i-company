import React, { useState, useEffect } from 'react';
import { UserRole, Influencer, Campaign, Brand, FinancialLedger, UserAccount } from './types';
import { INITIAL_INFLUENCERS, INITIAL_BRANDS, INITIAL_CAMPAIGNS, INITIAL_FINANCIALS, INITIAL_ACCOUNTS } from './lib/mockData';
import { LoginView } from './components/auth/LoginView';
import { VintageHeader } from './components/vintage/VintageHeader';
import { AdminMasterView } from './components/views/AdminMasterView';
import { BrandPortalView } from './components/views/BrandPortalView';
import { CreatorPortalView } from './components/views/CreatorPortalView';
import { InstagramInsightsModal } from './components/modals/InstagramInsightsModal';
import { AddInfluencerModal } from './components/modals/AddInfluencerModal';
import { AddBrandModal } from './components/modals/AddBrandModal';
import { SmartCampaignGeneratorModal } from './components/modals/SmartCampaignGeneratorModal';
import { DealContractModal } from './components/modals/DealContractModal';
import { databaseService } from './lib/databaseService';
import { Check } from 'lucide-react';

export const App: React.FC = () => {
  // Authentication & Session
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_ACCOUNTS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('the_i_company_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Core Data
  const [influencers, setInfluencers] = useState<Influencer[]>(INITIAL_INFLUENCERS);
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [financials, setFinancials] = useState<FinancialLedger>(INITIAL_FINANCIALS);

  // Load from Supabase Cloud or Local Persistence on mount
  useEffect(() => {
    async function initDatabase() {
      try {
        const [loadedAccounts, loadedInfluencers, loadedBrands, loadedCampaigns, loadedFinancials] = await Promise.all([
          databaseService.getAccounts(),
          databaseService.getInfluencers(),
          databaseService.getBrands(),
          databaseService.getCampaigns(),
          databaseService.getFinancials()
        ]);
        if (loadedAccounts?.length) setAccounts(loadedAccounts);
        if (loadedInfluencers?.length) setInfluencers(loadedInfluencers);
        if (loadedBrands?.length) setBrands(loadedBrands);
        if (loadedCampaigns?.length) setCampaigns(loadedCampaigns);
        if (loadedFinancials) setFinancials(loadedFinancials);
      } catch (e) {
        console.warn('Using offline persistence layer:', e);
      }
    }
    initDatabase();
  }, []);

  // Modal states
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [isAddCreatorModalOpen, setIsAddCreatorModalOpen] = useState(false);
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [isCampaignGeneratorOpen, setIsCampaignGeneratorOpen] = useState(false);
  const [selectedContractCampaign, setSelectedContractCampaign] = useState<Campaign | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Handlers
  const handleLogin = (account: UserAccount) => {
    setCurrentUser(account);
    try {
      localStorage.setItem('the_i_company_user', JSON.stringify(account));
    } catch (e) {
      // Ignore
    }
    showToast(`Welcome back, ${account.name}! Accessing ${account.role.toUpperCase()} Workspace.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('the_i_company_user');
    } catch (e) {
      // Ignore
    }
    showToast('Signed out successfully. Session terminated.');
  };

  // Add Creator with Login Credentials
  const handleAddInfluencer = (newInf: Influencer, newAcc: UserAccount) => {
    setInfluencers([newInf, ...influencers]);
    setAccounts([newAcc, ...accounts]);
    databaseService.saveInfluencer(newInf);
    databaseService.saveAccount(newAcc);
    showToast(`Creator Added: @${newInf.handle} onboarded. Login credentials generated & activated!`);
  };

  // Add Brand with Login Credentials
  const handleAddBrand = (newBrand: Brand, newAcc: UserAccount) => {
    setBrands([newBrand, ...brands]);
    setAccounts([newAcc, ...accounts]);
    databaseService.saveBrand(newBrand);
    databaseService.saveAccount(newAcc);
    showToast(`Brand Client Added: ${newBrand.name} onboarded. Portal credentials generated & activated!`);
  };

  // Create new campaign
  const handleCreateCampaign = (newCamp: Campaign) => {
    const updatedCampaigns = [newCamp, ...campaigns];
    setCampaigns(updatedCampaigns);
    databaseService.saveCampaign(newCamp);

    setFinancials(prev => {
      const updated = {
        ...prev,
        totalGMV: prev.totalGMV + newCamp.totalBudget,
        agencyRevenue: prev.agencyRevenue + Math.round(newCamp.totalBudget * newCamp.agencyMarginRate),
        escrowHeld: prev.escrowHeld + newCamp.spentBudget,
        activeDealsCount: prev.activeDealsCount + 1,
        recentTransactions: [
          {
            id: `tx-${Date.now()}`,
            timestamp: 'Just now',
            type: 'brand_deposit' as const,
            partyName: newCamp.brandName,
            campaignName: newCamp.name,
            amount: newCamp.totalBudget,
            status: 'escrow_hold' as const
          },
          ...prev.recentTransactions
        ]
      };
      databaseService.saveFinancials(updated);
      return updated;
    });

    showToast(`Campaign Brief Deployed: ${newCamp.name} launched with ${newCamp.assignedInfluencers.length} creators.`);
  };

  // Approve deliverable
  const handleApproveDeliverable = (campaignId: string, deliverableId: string) => {
    setCampaigns(prev => {
      const updated = prev.map(camp => {
        if (camp.id !== campaignId) return camp;
        return {
          ...camp,
          deliverables: camp.deliverables.map(del => {
            if (del.id !== deliverableId) return del;
            return {
              ...del,
              status: 'live' as const,
              liveViews: 540000,
              liveLikes: 68000
            };
          })
        };
      });
      const targetCamp = updated.find(c => c.id === campaignId);
      if (targetCamp) databaseService.saveCampaign(targetCamp);
      return updated;
    });

    showToast('Content Approved: Deliverable verified & milestone escrow released to creator.');
  };

  // Submit deliverable URL
  const handleSubmitDeliverableUrl = (campaignId: string, deliverableId: string, url: string) => {
    setCampaigns(prev => {
      const updated = prev.map(camp => {
        if (camp.id !== campaignId) return camp;
        return {
          ...camp,
          deliverables: camp.deliverables.map(del => {
            if (del.id !== deliverableId) return del;
            return {
              ...del,
              status: 'draft_submitted' as const,
              submittedUrl: url
            };
          })
        };
      });
      const targetCamp = updated.find(c => c.id === campaignId);
      if (targetCamp) databaseService.saveCampaign(targetCamp);
      return updated;
    });

    showToast('Draft Submitted: Sent to client brand for review.');
  };

  // Request payout
  const handleRequestPayout = (amount: number) => {
    setFinancials(prev => {
      const updated = {
        ...prev,
        creatorsPaid: prev.creatorsPaid + amount,
        escrowHeld: Math.max(0, prev.escrowHeld - amount)
      };
      databaseService.saveFinancials(updated);
      return updated;
    });

    showToast(`Disbursement Cleared: ₹${amount.toLocaleString()} transferred via escrow banking rail.`);
  };

  // Direct workspace switcher for Admin
  const handleSwitchToCreator = (inf: Influencer) => {
    const acc = accounts.find(a => a.associatedId === inf.id && a.role === 'influencer');
    if (acc) {
      setCurrentUser(acc);
      showToast(`Switched workspace: Viewing Creator Studio for ${inf.name} (@${inf.handle})`);
    } else {
      const syntheticAcc: UserAccount = {
        id: `acc-${inf.id}`,
        email: inf.loginEmail || `${inf.handle}@creators.theicompany.com`,
        password: inf.loginPassword || 'creator#1234',
        role: 'influencer',
        name: `${inf.name} (@${inf.handle})`,
        associatedId: inf.id,
        status: 'active',
        lastLogin: 'Just now'
      };
      setCurrentUser(syntheticAcc);
      showToast(`Switched workspace: Viewing Creator Studio for ${inf.name} (@${inf.handle})`);
    }
  };

  const handleSwitchToAccount = (acc: UserAccount) => {
    setCurrentUser(acc);
    showToast(`Switched workspace: Now logged in as ${acc.name}`);
  };

  // -------------------------------------------------------------
  // If NOT logged in, show the Login Gateway
  // -------------------------------------------------------------
  if (!currentUser) {
    return <LoginView accounts={accounts} onLogin={handleLogin} />;
  }

  // -------------------------------------------------------------
  // If LOGGED IN, resolve role-specific isolated scope
  // -------------------------------------------------------------
  const activeBrand = brands.find(b => b.id === currentUser.associatedId) || brands[0];
  const activeCreator = influencers.find(i => i.id === currentUser.associatedId) || influencers[0];

  return (
    <div className="min-h-screen bg-transparent text-[#D7DCEA] flex flex-col font-sans selection:bg-[#5B8BF7]/30 selection:text-white">
      {/* Minimal Vintage Header */}
      <VintageHeader
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAddModal={() => setIsAddCreatorModalOpen(true)}
        onOpenAddBrandModal={() => setIsAddBrandModalOpen(true)}
        onOpenCampaignGenerator={() => setIsCampaignGeneratorOpen(true)}
        creatorsCount={influencers.length}
        activeCampaignsCount={campaigns.length}
      />

      {/* Main Command Canvas - Scoped by Role */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* 1. Admin Master Deck (Super Admin) */}
        {currentUser.role === 'agency' && (
          <AdminMasterView
            influencers={influencers}
            brands={brands}
            campaigns={campaigns}
            financials={financials}
            accounts={accounts}
            onSelectInfluencer={(inf) => setSelectedInfluencer(inf)}
            onOpenAddModal={() => setIsAddCreatorModalOpen(true)}
            onOpenAddBrandModal={() => setIsAddBrandModalOpen(true)}
            onOpenCampaignGenerator={() => setIsCampaignGeneratorOpen(true)}
            onApproveDeliverable={handleApproveDeliverable}
            onOpenContract={(camp) => setSelectedContractCampaign(camp)}
            onSwitchToCreator={handleSwitchToCreator}
            onSwitchToAccount={handleSwitchToAccount}
          />
        )}

        {/* 2. Isolated Brand Client Portal */}
        {currentUser.role === 'brand' && (
          <BrandPortalView
            activeBrand={activeBrand}
            campaigns={campaigns}
            influencers={influencers}
            onOpenCampaignGenerator={() => setIsCampaignGeneratorOpen(true)}
            onSelectInfluencer={(inf) => setSelectedInfluencer(inf)}
            onApproveDeliverable={handleApproveDeliverable}
            onOpenContract={(camp) => setSelectedContractCampaign(camp)}
          />
        )}

        {/* 3. Isolated Creator Studio Desk */}
        {currentUser.role === 'influencer' && (
          <CreatorPortalView
            creator={activeCreator}
            campaigns={campaigns}
            onSubmitDeliverableUrl={handleSubmitDeliverableUrl}
            onRequestPayout={handleRequestPayout}
            onOpenContract={(camp) => setSelectedContractCampaign(camp)}
          />
        )}
      </main>

      {/* Agentic Luminous Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#0B0E17]/95 text-white text-xs font-sans shadow-agentic-glow flex items-center gap-3 border border-white/10 backdrop-blur-xl animate-fade-in">
          <span className="w-5 h-5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-[#10B981]" />
          </span>
          <span className="font-medium text-[#D7DCEA]">{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <InstagramInsightsModal
        influencer={selectedInfluencer}
        onClose={() => setSelectedInfluencer(null)}
        onAssignToCampaign={() => {
          setSelectedInfluencer(null);
          setIsCampaignGeneratorOpen(true);
        }}
      />

      {/* Add Creator Modal */}
      <AddInfluencerModal
        isOpen={isAddCreatorModalOpen}
        onClose={() => setIsAddCreatorModalOpen(false)}
        onAddInfluencer={handleAddInfluencer}
      />

      {/* Add Brand Modal */}
      <AddBrandModal
        isOpen={isAddBrandModalOpen}
        onClose={() => setIsAddBrandModalOpen(false)}
        onAddBrand={handleAddBrand}
      />

      {/* Campaign Generator Modal */}
      <SmartCampaignGeneratorModal
        isOpen={isCampaignGeneratorOpen}
        onClose={() => setIsCampaignGeneratorOpen(false)}
        availableInfluencers={influencers}
        onCreateCampaign={handleCreateCampaign}
      />

      {/* Deal Memo, Agreement & Invoicing Modal */}
      <DealContractModal
        isOpen={!!selectedContractCampaign}
        onClose={() => setSelectedContractCampaign(null)}
        campaign={selectedContractCampaign}
        brand={brands.find(b => b.id === selectedContractCampaign?.brandId || b.name === selectedContractCampaign?.brandName)}
        influencer={influencers.find(i => i.id === currentUser?.associatedId)}
        userRole={currentUser.role}
      />

      {/* Minimal Vintage Footer */}
      <footer className="mt-auto border-t border-[#E7E2DA] bg-[#F7F4EE] px-6 sm:px-8 py-5 text-xs text-[#78716C] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-[#1C1917] text-sm">The I Company</span>
          <span className="text-[#D6CFBF]">·</span>
          <span>Atelier MMXXVI · Authenticated Role: {currentUser.role.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-4 text-[#78716C]">
          <span>Role Isolation Active</span>
          <span>•</span>
          <span>Escrow Protected Rail</span>
          <span>•</span>
          <span className="text-[#2E523E] font-medium">Session: {currentUser.email}</span>
        </div>
      </footer>
    </div>
  );
};
