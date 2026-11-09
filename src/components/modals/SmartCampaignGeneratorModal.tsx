import React, { useState } from 'react';
import { Influencer, Campaign, InfluencerCategory } from '../../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SmartCampaignGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableInfluencers: Influencer[];
  onCreateCampaign: (campaign: Campaign) => void;
}

const CATEGORIES: InfluencerCategory[] = [
  'Tech & AI',
  'Fashion & Beauty',
  'Fitness & Health',
  'Finance & Crypto',
  'Gaming & Esports',
  'Food & Travel',
  'Lifestyle & Entertainment'
];

export const SmartCampaignGeneratorModal: React.FC<SmartCampaignGeneratorModalProps> = ({
  isOpen,
  onClose,
  availableInfluencers,
  onCreateCampaign
}) => {
  const [name, setName] = useState('Festive Q4 Viral Surge');
  const [brandName, setBrandName] = useState('Boat Lifestyle');
  const [category, setCategory] = useState<InfluencerCategory>('Tech & AI');
  const [budget, setBudget] = useState<number>(600000);
  const [targetReels, setTargetReels] = useState<number>(3);
  const [targetStories, setTargetStories] = useState<number>(6);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedSquad, setGeneratedSquad] = useState<Influencer[]>([]);

  if (!isOpen) return null;

  // Matching algorithm: pick matching niche creators within budget
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    let candidates = availableInfluencers.filter(inf => inf.category === category);
    if (candidates.length === 0) candidates = availableInfluencers;

    candidates.sort((a, b) => b.engagementRate - a.engagementRate);

    // 80% budget for creators, 20% agency margin
    const creatorPoolBudget = budget * 0.8;
    let currentCost = 0;
    const selected: Influencer[] = [];

    for (const cand of candidates) {
      if (currentCost + cand.ratePerReel <= creatorPoolBudget) {
        selected.push(cand);
        currentCost += cand.ratePerReel;
      }
    }

    if (selected.length === 0 && candidates.length > 0) {
      selected.push(candidates[0]);
    }

    setGeneratedSquad(selected);
    setIsGenerated(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C25E3E', '#2E523E', '#B8860B']
      });
    } catch (e) {
      // Ignore
    }
  };

  const handleCommitCampaign = () => {
    const totalEstViews = generatedSquad.reduce((acc, inf) => acc + inf.avgReelViews, 0) * targetReels;
    const totalEstLikes = generatedSquad.reduce((acc, inf) => acc + inf.avgLikes, 0) * targetReels;

    const newCampaign: Campaign = {
      id: `cmp-gen-${Date.now()}`,
      name,
      brandId: 'brand-custom',
      brandName,
      niche: category,
      totalBudget: budget,
      spentBudget: 0,
      agencyMarginRate: 0.20,
      status: 'production',
      startDate: '2026-11-15',
      endDate: '2026-12-15',
      targetDeliverables: {
        reels: targetReels,
        stories: targetStories,
        carousels: 1
      },
      assignedInfluencers: generatedSquad.map(inf => inf.id),
      deliverables: generatedSquad.map((inf, idx) => ({
        id: `del-gen-${Date.now()}-${idx}`,
        influencerId: inf.id,
        influencerHandle: inf.handle,
        influencerName: inf.name,
        type: 'Reel',
        status: 'pending',
        dueDate: '2026-11-25',
        agreedPayout: inf.ratePerReel
      })),
      projectedMetrics: {
        reach: generatedSquad.reduce((acc, inf) => acc + inf.followers, 0),
        impressions: totalEstViews * 1.4,
        estimatedClicks: Math.round(totalEstViews * 0.05),
        estimatedCPE: 1.8
      }
    };

    onCreateCampaign(newCampaign);
    onClose();
    setIsGenerated(false);
  };

  const creatorSpend = generatedSquad.reduce((acc, inf) => acc + inf.ratePerReel, 0);
  const agencyCommission = budget - creatorSpend;
  const totalProjectedReach = generatedSquad.reduce((acc, inf) => acc + inf.followers, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C1917]/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white border border-[#E7E2DA] rounded-2xl shadow-vintage-lg text-[#1C1917] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF8F5] border-b border-[#E7E2DA]">
          <div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#78716C]">
              CAMPAIGN INTELLIGENCE
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Generate Smart Campaign Brief
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!isGenerated ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#1C1917] block mb-1">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] focus:border-[#1C1917] focus:bg-white text-xs text-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#1C1917] block mb-1">
                    Client Brand
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] focus:border-[#1C1917] focus:bg-white text-xs text-[#1C1917]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#1C1917] block mb-1">
                    Target Niche
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InfluencerCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] focus:border-[#1C1917] text-xs text-[#1C1917]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-[#1C1917]">
                      Total Budget
                    </label>
                    <span className="font-serif font-bold text-sm text-[#2E523E]">
                      ₹{budget.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="3000000"
                    step="50000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-[#1C1917] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#A8A29E] font-mono mt-0.5">
                    <span>₹1.0L</span>
                    <span>₹15L</span>
                    <span>₹30L</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA]">
                  <span className="text-[10px] text-[#78716C] uppercase font-mono block">TARGET REELS</span>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setTargetReels(cnt)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                          targetReels === cnt
                            ? 'bg-[#1C1917] text-white'
                            : 'bg-white border border-[#E2DDD5] text-[#1C1917] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA]">
                  <span className="text-[10px] text-[#78716C] uppercase font-mono block">TARGET STORIES</span>
                  <div className="flex items-center gap-2 mt-2">
                    {[2, 4, 6, 10].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setTargetStories(cnt)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                          targetStories === cnt
                            ? 'bg-[#1C1917] text-white'
                            : 'bg-white border border-[#E2DDD5] text-[#1C1917] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-white border border-[#E2DDD5] text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white font-medium text-xs shadow-vintage-sm transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommend Creator Roster</span>
                </button>
              </div>
            </form>
          ) : (
            /* Generated Roster & Financial Plan */
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA]">
                  <span className="text-[10px] text-[#78716C] font-mono uppercase">SELECTED TALENT</span>
                  <div className="font-serif text-lg font-bold text-[#1C1917] mt-0.5">
                    {generatedSquad.length} Creators
                  </div>
                  <span className="text-[10px] text-[#2E523E]">100% niche aligned</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA]">
                  <span className="text-[10px] text-[#78716C] font-mono uppercase">PROJECTED REACH</span>
                  <div className="font-serif text-lg font-bold text-[#1C1917] mt-0.5">
                    {(totalProjectedReach / 1000000).toFixed(1)}M
                  </div>
                  <span className="text-[10px] text-[#78716C]">Combined followers</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA]">
                  <span className="text-[10px] text-[#78716C] font-mono uppercase">CREATOR PAYOUTS</span>
                  <div className="font-serif text-lg font-bold text-[#2E523E] mt-0.5">
                    ₹{creatorSpend.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-[#78716C]">Milestone escrow</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA]">
                  <span className="text-[10px] text-[#78716C] font-mono uppercase">AGENCY MARGIN</span>
                  <div className="font-serif text-lg font-bold text-[#C25E3E] mt-0.5">
                    ₹{agencyCommission.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-[#78716C]">20% management cut</span>
                </div>
              </div>

              {/* Influencer Squadron List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#1C1917] block">
                  Recommended Creator Allocation
                </span>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {generatedSquad.map((inf) => (
                    <div
                      key={inf.id}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={inf.avatar}
                          alt={inf.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#E2DDD5]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#1C1917]">{inf.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white text-[#78716C] border border-[#E2DDD5]">
                              {inf.tier}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#78716C]">@{inf.handle} · {inf.engagementRate}% ER</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-semibold text-xs text-[#2E523E]">
                          ₹{inf.ratePerReel.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-[#78716C]">1 Reel + Story</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex justify-between items-center border-t border-[#EFECE6]">
                <button
                  type="button"
                  onClick={() => setIsGenerated(false)}
                  className="px-4 py-2 rounded-lg bg-white border border-[#E2DDD5] text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5]"
                >
                  ← Adjust Parameters
                </button>

                <button
                  type="button"
                  onClick={handleCommitCampaign}
                  className="px-5 py-2.5 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white font-medium text-xs shadow-vintage-sm transition-all"
                >
                  Deploy Campaign Brief
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
