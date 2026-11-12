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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white/95 border border-white/90 rounded-3xl shadow-[0_25px_70px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl text-slate-800 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-slate-200/80">
          <div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-slate-500 font-semibold">
              CAMPAIGN INTELLIGENCE
            </span>
            <h3 className="font-sans text-lg font-extrabold text-slate-900 tracking-tight">
              Generate Smart Campaign Brief
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!isGenerated ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 focus:border-blue-500 focus:bg-white text-xs text-slate-900 placeholder-slate-400 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Client Brand
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 focus:border-blue-500 focus:bg-white text-xs text-slate-900 placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Target Niche
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InfluencerCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 focus:border-blue-500 focus:bg-white text-xs text-slate-900 font-medium"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} className="bg-white text-slate-900">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 font-sans">
                      Total Budget
                    </label>
                    <span className="font-mono font-extrabold text-sm text-emerald-600">
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
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                    <span>₹1.0L</span>
                    <span>₹15L</span>
                    <span>₹30L</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">TARGET REELS</span>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setTargetReels(cnt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          targetReels === cnt
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">TARGET STORIES</span>
                  <div className="flex items-center gap-2 mt-2">
                    {[2, 4, 6, 10].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setTargetStories(cnt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          targetStories === cnt
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
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
                  className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all flex items-center gap-2 cursor-pointer"
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
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">SELECTED TALENT</span>
                  <div className="font-sans text-lg font-extrabold text-slate-900 mt-0.5">
                    {generatedSquad.length} Creators
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono font-semibold">100% niche aligned</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">PROJECTED REACH</span>
                  <div className="font-sans text-lg font-extrabold text-slate-900 mt-0.5">
                    {(totalProjectedReach / 1000000).toFixed(1)}M
                  </div>
                  <span className="text-[10px] text-blue-600 font-mono font-semibold">Combined followers</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">CREATOR PAYOUTS</span>
                  <div className="font-mono text-lg font-extrabold text-emerald-600 mt-0.5">
                    ₹{creatorSpend.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Milestone escrow</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">AGENCY MARGIN</span>
                  <div className="font-mono text-lg font-extrabold text-blue-600 mt-0.5">
                    ₹{agencyCommission.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">20% management cut</span>
                </div>
              </div>

              {/* Influencer Squadron List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 block font-sans">
                  Recommended Creator Allocation
                </span>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {generatedSquad.map((inf) => (
                    <div
                      key={inf.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={inf.avatar}
                          alt={inf.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{inf.name}</span>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 font-mono font-medium">
                              {inf.tier}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">@{inf.handle} · {inf.engagementRate}% ER</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-xs text-emerald-600">
                          ₹{inf.ratePerReel.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">1 Reel + Story</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex justify-between items-center border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsGenerated(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  ← Adjust Parameters
                </button>

                <button
                  type="button"
                  onClick={handleCommitCampaign}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
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
