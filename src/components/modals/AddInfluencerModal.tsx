import React, { useState } from 'react';
import { Influencer, InfluencerCategory, UserAccount } from '../../types';
import { 
  analyzeInstagramHandle, 
  getSavedInstagramSession, 
  setSavedInstagramSession,
  getScraperServiceUrl,
  setScraperServiceUrl,
  fetchLiveReelsFromMicroservice
} from '../../lib/instagramService';
import { 
  X, 
  Instagram, 
  Search, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Copy, 
  Check, 
  Send, 
  Mail, 
  Key, 
  DollarSign,
  Image as ImageIcon,
  FileText,
  Users,
  SlidersHorizontal,
  ExternalLink,
  Play,
  Trash2,
  Plus,
  Zap,
  Server
} from 'lucide-react';

interface AddInfluencerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInfluencer: (influencer: Influencer, account: UserAccount) => void;
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

function formatFollowerCount(num: number): string {
  if (!num) return '0';
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num.toLocaleString();
}

export const AddInfluencerModal: React.FC<AddInfluencerModalProps> = ({
  isOpen,
  onClose,
  onAddInfluencer
}) => {
  const [handle, setHandle] = useState('');
  const [category, setCategory] = useState<InfluencerCategory>('Tech & AI');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scannedResult, setScannedResult] = useState<Influencer | null>(null);
  const [isLiveExtracted, setIsLiveExtracted] = useState(false);
  const [extractionNotice, setExtractionNotice] = useState('');
  const [extractionMode, setExtractionMode] = useState('');

  // Engine configuration
  const [sessionId, setSessionId] = useState<string>(getSavedInstagramSession());
  const [showEngineSettings, setShowEngineSettings] = useState(false);

  // Editable fields by Admin
  const [customName, setCustomName] = useState('');
  const [customFollowers, setCustomFollowers] = useState(0);
  const [customRate, setCustomRate] = useState(0);
  const [customAvatar, setCustomAvatar] = useState('');
  const [customBio, setCustomBio] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorPassword, setCreatorPassword] = useState('');
  const [isCreated, setIsCreated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Editable Recent Media
  const [editableMedia, setEditableMedia] = useState<Influencer['recentContent']>([]);
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaViews, setNewMediaViews] = useState('');
  const [newMediaType, setNewMediaType] = useState<'Reel' | 'Carousel' | 'Post'>('Reel');

  // Headless Scraper Microservice (Option A)
  const [scraperServiceUrl, setScraperServiceUrlState] = useState<string>(getScraperServiceUrl());
  const [isFetchingReels, setIsFetchingReels] = useState(false);
  const [fetchReelsMessage, setFetchReelsMessage] = useState('');

  if (!isOpen) return null;

  const handleStartScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsScanning(true);
    setScanStep(1);

    try {
      await new Promise(r => setTimeout(r, 400));
      setScanStep(2);

      // Extract using our custom multi-tier engine
      const result = await analyzeInstagramHandle(handle, category, sessionId);
      setScanStep(3);
      await new Promise(r => setTimeout(r, 300));

      const cleanHandle = handle.replace('@', '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `${cleanHandle}@creators.theicompany.com`;
      const pwd = `creator#${Math.floor(1000 + Math.random() * 9000)}`;

      setScannedResult(result);
      setEditableMedia(result.recentContent || []);
      setIsLiveExtracted(Boolean(result.isLiveExtracted));
      setExtractionNotice(result.extractionNotice || '');
      setExtractionMode(result.extractionMode || '');
      setCustomName(result.name);
      setCustomFollowers(result.followers);
      setCustomRate(result.ratePerReel);
      setCustomAvatar(result.avatar);
      setCustomBio(result.bio);
      setCreatorEmail(email);
      setCreatorPassword(pwd);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
      setScanStep(0);
    }
  };

  const handleGenerateStrongPassword = () => {
    const cleanHandle = handle.replace('@', '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'talent';
    setCreatorPassword(`${cleanHandle}@${Math.floor(10000 + Math.random() * 90000)}!`);
  };

  const handleDeleteMedia = (id: string) => {
    setEditableMedia(prev => prev.filter(m => m.id !== id));
  };

  const handleAddCustomMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle.trim() && !newMediaUrl.trim()) return;

    const viewsNum = parseInt(newMediaViews.replace(/[^0-9]/g, ''), 10) || Math.round((Number(customFollowers) || scannedResult?.followers || 100000) * 0.35);
    const likesNum = Math.round(viewsNum * 0.065);
    const commentsNum = Math.max(10, Math.round(likesNum * 0.03));

    let finalUrl = newMediaUrl.trim();
    if (finalUrl && !finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
    }
    if (!finalUrl) {
      finalUrl = `https://instagram.com/${handle.replace('@', '')}`;
    }

    const newCard = {
      id: `custom-media-${Date.now()}`,
      type: newMediaType,
      title: newMediaTitle.trim() || `Featured ${newMediaType} on @${handle.replace('@', '')}`,
      views: viewsNum,
      likes: likesNum,
      comments: commentsNum,
      postedDaysAgo: 1,
      engagement: Number((3.5 + (Math.random() * 4)).toFixed(1)),
      thumbnail: customAvatar || scannedResult?.avatar || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=80',
      url: finalUrl
    };

    setEditableMedia(prev => [newCard, ...prev]);
    setNewMediaTitle('');
    setNewMediaUrl('');
    setNewMediaViews('');
    setShowAddMedia(false);
  };

  const handleFetchMicroserviceReels = async () => {
    if (!handle.trim()) return;
    setIsFetchingReels(true);
    setFetchReelsMessage('');

    try {
      const reels = await fetchLiveReelsFromMicroservice(handle, 10, scraperServiceUrl);
      if (reels && reels.length > 0) {
        setEditableMedia(reels);
        setFetchReelsMessage(`✅ Extracted ${reels.length} live reels via Headless Chromium!`);
      } else {
        setFetchReelsMessage(
          scraperServiceUrl
            ? '⚠️ Microservice connected but returned 0 reels. Verify account has public reels.'
            : '⚠️ Microservice URL not configured. Start scraper-service locally or configure URL in settings below.'
        );
      }
    } catch (err: any) {
      setFetchReelsMessage(`❌ Microservice error: ${err.message || 'Server unreachable'}`);
    } finally {
      setIsFetchingReels(false);
    }
  };

  const handleSave = () => {
    if (scannedResult) {
      const followersNum = Number(customFollowers) || scannedResult.followers;
      let calculatedTier = scannedResult.tier;
      if (followersNum < 10000) calculatedTier = 'Nano (1k-10k)';
      else if (followersNum < 50000) calculatedTier = 'Micro (10k-50k)';
      else if (followersNum < 500000) calculatedTier = 'Mid (50k-500k)';
      else if (followersNum < 1000000) calculatedTier = 'Macro (500k-1M)';
      else calculatedTier = 'Mega (1M+)';

      const finalInfluencer: Influencer = {
        ...scannedResult,
        name: customName.trim() || scannedResult.name,
        followers: followersNum,
        ratePerReel: Number(customRate) || scannedResult.ratePerReel,
        avatar: customAvatar.trim() || scannedResult.avatar,
        bio: customBio.trim() || scannedResult.bio,
        tier: calculatedTier,
        category,
        recentContent: editableMedia.length > 0 ? editableMedia : (scannedResult.recentContent || []),
        loginEmail: creatorEmail.trim(),
        loginPassword: creatorPassword.trim()
      };

      const newAccount: UserAccount = {
        id: `acc-${scannedResult.id}`,
        email: creatorEmail.trim().toLowerCase(),
        password: creatorPassword.trim(),
        role: 'influencer',
        name: `${finalInfluencer.name} (@${finalInfluencer.handle})`,
        associatedId: scannedResult.id,
        status: 'active',
        lastLogin: 'Never (Newly Onboarded)'
      };

      onAddInfluencer(finalInfluencer, newAccount);
      setIsCreated(true);
    }
  };

  const portalUrl = 'https://theicompany.netlify.app';

  const credentialsSummary = `THE I COMPANY · OFFICIAL CREATOR STUDIO ACCESS
Creator: ${customName || handle}
Handle: @${handle.replace('@', '')}
Studio URL: ${portalUrl}
Assigned Login Email: ${creatorEmail}
Temporary Password: ${creatorPassword}
Account Security: Verified Talent Rail

Please log in to review contracted campaigns, submit video drafts, and withdraw earnings.`;

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(credentialsSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const whatsappMessage = encodeURIComponent(
    `*The I Company · Creator Studio Login Credentials*\n` +
    `Hey ${customName || handle}!\n\n` +
    `Your verified agency talent desk is now active:\n` +
    `🔗 *URL:* ${portalUrl}\n` +
    `📧 *Email:* ${creatorEmail}\n` +
    `🔑 *Password:* ${creatorPassword}\n\n` +
    `Log in to view assigned brand campaigns, submit Reel drafts, and request instant payouts to your bank account.`
  );

  const emailSubject = encodeURIComponent(`The I Company · Creator Studio Login Credentials for @${handle.replace('@', '')}`);
  const emailBody = encodeURIComponent(credentialsSummary);

  const handleFinish = () => {
    setIsCreated(false);
    setHandle('');
    setScannedResult(null);
    setEditableMedia([]);
    setShowAddMedia(false);
    setCreatorEmail('');
    setCreatorPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020307]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-[#0B0E17]/95 border border-white/10 rounded-2xl w-full max-w-xl shadow-[0_16px_64px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col relative text-[#D7DCEA]">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#5B8BF7] to-transparent" />
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] bg-[#07090F]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white flex items-center justify-center shadow-[0_0_16px_rgba(253,29,29,0.3)]">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA]">
                  ADMIN ACCESS CONTROL ·
                </span>
                <span className="font-mono text-[10px] text-[#10B981] font-semibold">CUSTOM SCRAPER ENGINE</span>
              </div>
              <h3 className="font-sans text-xl font-bold text-white tracking-tight">
                Onboard Creator & Issue Studio Credentials
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#8FA5D9] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isCreated ? (
            <>
              {/* Scan Form */}
              <form onSubmit={handleStartScan} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-white block mb-1 font-sans">
                      Instagram Handle or Profile Link *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="e.g. techburner or instagram.com/komalpandeyofficial"
                        required
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#5B8BF7] transition-colors placeholder-white/30"
                      />
                      <span className="absolute left-3 top-2.5 text-xs text-[#7189BA] font-mono">@</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white block mb-1 font-sans">
                      Niche Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as InfluencerCategory)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#07090F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#5B8BF7] transition-colors"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#0B0E17] text-white">{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Collapsible Custom Session Bridge */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowEngineSettings(!showEngineSettings)}
                    className="text-[11px] font-mono text-[#8FA5D9] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3 h-3 text-[#5B8BF7]" />
                    <span>{showEngineSettings ? 'Hide Custom Scraper Bridge' : 'Configure Custom Instagram Session Key (Optional)'}</span>
                    {sessionId && (
                      <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block ml-1 animate-pulse"></span>
                    )}
                  </button>

                  {showEngineSettings && (
                    <div className="mt-2 p-4 rounded-xl bg-[#07090F]/90 border border-white/10 space-y-3 text-xs animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-white tracking-wider">
                          Proprietary Instagram Session Bridge
                        </span>
                        <span className="text-[10px] text-[#10B981] font-mono font-semibold">
                          {sessionId ? '🟢 AUTHENTICATED GRAPH' : '⚪ OPENGRAPH FALLBACK'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8FA5D9]/70 leading-relaxed font-sans">
                        Optionally paste the <code className="bg-black/50 px-1 py-0.5 rounded border border-white/10 text-[#5B8BF7] font-mono">sessionid</code> cookie from any dummy Instagram account to unlock single-digit follower accuracy and real Reels extraction.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={sessionId}
                          onChange={(e) => {
                            setSessionId(e.target.value);
                            setSavedInstagramSession(e.target.value);
                          }}
                          placeholder="Paste IG sessionid cookie (e.g. 683921...)"
                          className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#5B8BF7]"
                        />
                        {sessionId && (
                          <button
                            type="button"
                            onClick={() => {
                              setSessionId('');
                              setSavedInstagramSession('');
                            }}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F43F5E] hover:bg-white/10 cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Option A Headless Scraper Microservice Endpoint */}
                      <div className="pt-2 border-t border-white/[0.06] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase font-bold text-white flex items-center gap-1.5">
                            <Server className="w-3 h-3 text-[#10B981]" />
                            Option A: Headless Chromium Microservice
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-[#10B981]">
                            {scraperServiceUrl ? '🟢 CONFIGURED' : '⚪ NOT CONFIGURED'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8FA5D9]/70 leading-relaxed font-sans">
                          Enter your dedicated Headless Chromium Scraper URL (e.g. <code className="bg-black/50 px-1 py-0.5 rounded border border-white/10 text-[#5B8BF7] font-mono">http://localhost:4000</code> or Render URL) to extract live 10 reels.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={scraperServiceUrl}
                            onChange={(e) => {
                              setScraperServiceUrlState(e.target.value);
                              setScraperServiceUrl(e.target.value);
                            }}
                            placeholder="e.g. http://localhost:4000 or https://the-i-company-scraper.onrender.com"
                            className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#5B8BF7]"
                          />
                          {scraperServiceUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setScraperServiceUrlState('');
                                setScraperServiceUrl('');
                              }}
                              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F43F5E] hover:bg-white/10 cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isScanning || !handle.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5B8BF7] to-[#4F75E8] hover:shadow-[0_0_20px_rgba(91,139,247,0.4)] text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>
                        {scanStep === 1 && 'Querying Proprietary Instagram Engine...'}
                        {scanStep === 2 && 'Extracting authentic profile, followers & avatar...'}
                        {scanStep === 3 && 'Generating credentials & telemetry dossier...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5 text-white" />
                      <span>{scannedResult ? 'Re-scan Live Instagram Data' : 'Extract Live Instagram Data'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Scanned & Editable Dossier */}
              {scannedResult && (
                <div className="space-y-4 pt-4 border-t border-white/[0.08] animate-fade-in">
                  {/* Status Banner */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                    isLiveExtracted 
                      ? 'bg-[#10B981]/10 border-[#10B981]/30' 
                      : 'bg-white/[0.03] border-white/10'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={customAvatar || scannedResult.avatar}
                        alt={customName || scannedResult.name}
                        className="w-11 h-11 rounded-full object-cover border border-white/20 shadow-md"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-white font-sans text-sm font-semibold">
                            {customName || scannedResult.name}
                          </strong>
                          {isLiveExtracted ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#10B981] text-black text-[9px] font-mono uppercase tracking-wider font-bold">
                              {extractionMode === 'authenticated_private_api' ? 'Private API Verified' : 'Live Scraped'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#8FA5D9] text-[9px] font-mono uppercase tracking-wider font-semibold">
                              Manual Entry
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#8FA5D9]/70 font-mono block mt-0.5">
                          @{scannedResult.handle} · {formatFollowerCount(customFollowers || scannedResult.followers)} followers
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-[#10B981] text-xs block">
                        {scannedResult.authenticityScore}% Authenticity
                      </span>
                      <span className="text-[10px] text-[#7189BA] block font-mono">
                        {scannedResult.engagementRate}% Engagement
                      </span>
                    </div>
                  </div>

                  {extractionNotice && (
                    <div className="text-[11px] text-[#8FA5D9]/70 italic px-1 font-mono">
                      ℹ️ {extractionNotice}
                    </div>
                  )}

                  {/* Extracted Recent Content Manager */}
                  <div className="space-y-3 p-4 rounded-xl bg-[#07090F]/80 border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#7189BA] font-semibold block">
                          Recent Media & Viral Reels ({editableMedia.length})
                        </span>
                        <span className="text-[11px] text-[#8FA5D9]/60">
                          Verified reel deliverables · Edit, remove or scrape live from Instagram
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={handleFetchMicroserviceReels}
                          disabled={isFetchingReels || !handle.trim()}
                          className="px-2.5 py-1.5 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 hover:bg-[#10B981]/25 text-xs text-[#10B981] font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          title="Scrape top 10 reels via Headless Chromium"
                        >
                          {isFetchingReels ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#10B981]" />
                          ) : (
                            <Zap className="w-3.5 h-3.5 text-[#10B981]" />
                          )}
                          <span>{isFetchingReels ? 'Scraping 10 Reels...' : 'Live Scrape 10 Reels'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddMedia(!showAddMedia)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-white" />
                          <span>{showAddMedia ? 'Cancel' : '+ Add Live Reel'}</span>
                        </button>
                      </div>
                    </div>

                    {isFetchingReels && (
                      <div className="p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-xs text-[#10B981] flex items-center gap-2.5 animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0 text-[#10B981]" />
                        <div>
                          <div className="font-semibold">Launching Headless Chromium on Render (~15–20s)...</div>
                          <div className="text-[11px] text-[#8FA5D9]/70 font-mono">Navigating to Instagram @{handle.replace('@', '')} and scraping real reels with views</div>
                        </div>
                      </div>
                    )}

                    {fetchReelsMessage && !isFetchingReels && (
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-white font-mono">
                        {fetchReelsMessage}
                      </div>
                    )}

                    {/* Inline Add Live Reel / Post Form */}
                    {showAddMedia && (
                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                            <Play className="w-3.5 h-3.5 text-[#5B8BF7]" />
                            Add Live Instagram Reel / Deliverable
                          </span>
                          <div className="flex gap-1">
                            {(['Reel', 'Carousel', 'Post'] as const).map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setNewMediaType(t)}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                                  newMediaType === t 
                                    ? 'bg-[#5B8BF7] text-white font-semibold' 
                                    : 'bg-white/5 border border-white/10 text-[#8FA5D9]'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <div>
                            <label className="text-[10px] font-mono text-[#7189BA] uppercase block mb-1">
                              Instagram Reel / Post URL *
                            </label>
                            <input
                              type="text"
                              value={newMediaUrl}
                              onChange={(e) => setNewMediaUrl(e.target.value)}
                              placeholder="e.g. instagram.com/reel/C8xYz123"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#5B8BF7]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-[#7189BA] uppercase block mb-1">
                              Views / Reach Count
                            </label>
                            <input
                              type="text"
                              value={newMediaViews}
                              onChange={(e) => setNewMediaViews(e.target.value)}
                              placeholder="e.g. 1500000 or 1.5M"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#5B8BF7]"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-mono text-[#7189BA] uppercase block mb-1">
                              Reel Title / Caption Hook
                            </label>
                            <input
                              type="text"
                              value={newMediaTitle}
                              onChange={(e) => setNewMediaTitle(e.target.value)}
                              placeholder="e.g. Top 5 Tech Gadgets Every Student Needs! 📱"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-[#5B8BF7]"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddMedia(false)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#8FA5D9] hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddCustomMedia}
                            className="px-3.5 py-1.5 rounded-lg bg-[#5B8BF7] text-white text-xs font-medium hover:bg-[#4F75E8] shadow-md cursor-pointer"
                          >
                            Add to Creator Portfolio
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Media Cards Grid */}
                    {editableMedia.length === 0 ? (
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-[#8FA5D9]">
                        No recent media attached yet. Click "+ Add Live Reel" to attach creator reels.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {editableMedia.map((item) => (
                          <div key={item.id} className="relative rounded-xl overflow-hidden border border-white/10 bg-[#07090F] flex flex-col group hover:border-[#5B8BF7]/60 transition-all">
                            <div className="relative aspect-[4/5] overflow-hidden bg-[#020307]">
                              {/* Background Fallback in case of slow network */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#0B0E17] to-[#020307] text-[#8FA5D9]">
                                <Play className="w-5 h-5 text-[#5B8BF7]/70 mb-1" />
                                <span className="text-[9px] font-mono text-[#7189BA] line-clamp-2">{item.title}</span>
                              </div>

                              <img 
                                src={item.thumbnail} 
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  const shortcodeMatch = item.url?.match(/\/reel\/([a-zA-Z0-9_-]+)/);
                                  const shortcode = shortcodeMatch ? shortcodeMatch[1] : '';
                                  
                                  if (shortcode && !target.src.includes('thumbnail')) {
                                    target.src = `/api/thumbnail?shortcode=${shortcode}`;
                                  } else if (shortcode && !target.src.includes('onrender.com')) {
                                    target.src = `https://the-i-company-scraper.onrender.com/thumbnail?shortcode=${shortcode}`;
                                  }
                                }}
                              />
                              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/75 text-[9px] text-[#8FA5D9] font-mono flex items-center gap-1 z-20 border border-white/10">
                                <span>{item.type === 'Reel' ? '▶' : item.type === 'Carousel' ? '📷' : '🖼️'}</span>
                                <span>{item.type}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteMedia(item.id)}
                                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 hover:bg-[#F43F5E] text-white transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                                title="Delete media"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-[10px] text-white font-mono flex items-center justify-between z-20">
                                <span className="font-semibold">{formatFollowerCount(item.views || item.likes)} views</span>
                                {item.url && (
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-0.5 rounded hover:bg-white/20 text-white"
                                    title="Open on Instagram"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="p-2 flex-1 flex flex-col justify-between">
                              <p className="text-[11px] text-[#D7DCEA] font-medium line-clamp-2 leading-tight">
                                {item.title}
                              </p>
                              <div className="flex items-center justify-between text-[9px] text-[#7189BA] font-mono mt-1 pt-1 border-t border-white/[0.06]">
                                <span>{item.postedDaysAgo}d ago</span>
                                <span className="text-[#10B981] font-semibold">{item.engagement}% ER</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Editable Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-white block mb-1 font-sans">
                        Creator Full Name
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#5B8BF7]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-white font-sans">
                          Followers Count
                        </label>
                        <span className="text-[10px] font-mono text-[#10B981] font-semibold">
                          ({formatFollowerCount(customFollowers)})
                        </span>
                      </div>
                      <input
                        type="number"
                        value={customFollowers}
                        onChange={(e) => setCustomFollowers(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#5B8BF7]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-white block mb-1 font-sans">
                        Rate Per Reel (₹)
                      </label>
                      <input
                        type="number"
                        value={customRate}
                        onChange={(e) => setCustomRate(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#5B8BF7]"
                      />
                    </div>
                  </div>

                  {/* Profile Pic & Bio Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-white block mb-1 flex items-center gap-1 font-sans">
                        <ImageIcon className="w-3 h-3 text-[#5B8BF7]" />
                        <span>Profile Picture Avatar URL</span>
                      </label>
                      <input
                        type="url"
                        value={customAvatar}
                        onChange={(e) => setCustomAvatar(e.target.value)}
                        placeholder="https://images.unsplash.com/... or Instagram CDN link"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#5B8BF7] placeholder-white/30"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-white block mb-1 flex items-center gap-1 font-sans">
                        <FileText className="w-3 h-3 text-[#5B8BF7]" />
                        <span>Profile Bio</span>
                      </label>
                      <input
                        type="text"
                        value={customBio}
                        onChange={(e) => setCustomBio(e.target.value)}
                        placeholder="Digital Creator, YouTuber & Storyteller"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#5B8BF7] placeholder-white/30"
                      />
                    </div>
                  </div>

                  {/* Credentials Setup */}
                  <div className="p-4 rounded-xl bg-[#07090F]/80 border border-white/10 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA] font-semibold flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-[#5B8BF7]" />
                        <span>Admin-Assigned Login Credentials</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleGenerateStrongPassword}
                        className="text-[11px] font-sans text-[#5B8BF7] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Regenerate Password</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] text-[#8FA5D9] block mb-0.5 font-sans">Assigned Login Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={creatorEmail}
                            onChange={(e) => setCreatorEmail(e.target.value)}
                            placeholder="creator@creators.theicompany.com"
                            className="w-full pl-8 pr-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#5B8BF7] placeholder-white/30"
                          />
                          <Mail className="w-3.5 h-3.5 text-[#7189BA] absolute left-2.5 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-[#8FA5D9] block mb-0.5 font-sans">Assigned Password</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={creatorPassword}
                            onChange={(e) => setCreatorPassword(e.target.value)}
                            placeholder="creator#123"
                            className="w-full pl-8 pr-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs font-mono font-semibold text-white focus:outline-none focus:border-[#5B8BF7] placeholder-white/30"
                          />
                          <Lock className="w-3.5 h-3.5 text-[#7189BA] absolute left-2.5 top-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5B8BF7] to-[#4F75E8] hover:shadow-[0_0_24px_rgba(91,139,247,0.4)] text-white font-medium text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Confirm Onboarding & Issue Studio Credentials</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* SUCCESS CREDENTIALS PACKET */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-center space-y-1">
                <Check className="w-8 h-8 text-[#10B981] mx-auto" />
                <h4 className="font-sans text-lg font-bold text-white tracking-tight">
                  Creator Added to Roster & Credentials Live!
                </h4>
                <p className="text-xs text-[#10B981] font-mono">
                  @{scannedResult?.handle} is registered in Supabase Cloud Database and ready to log in.
                </p>
              </div>

              {/* Copyable Slip */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
                  <span className="text-[#7189BA] text-[10px] uppercase font-sans font-semibold">CREATOR CREDENTIALS SLIP</span>
                  <span className="text-[10px] text-[#10B981] font-sans font-semibold">ACTIVE TALENT DESK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA5D9]/80">Creator Name:</span>
                  <span className="font-semibold text-white">{customName} (@{handle.replace('@', '')})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA5D9]/80">Followers:</span>
                  <span className="font-bold text-[#10B981]">{formatFollowerCount(customFollowers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA5D9]/80">Studio URL:</span>
                  <span className="font-semibold text-[#5B8BF7]">{portalUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA5D9]/80">Assigned Email:</span>
                  <span className="font-semibold text-white">{creatorEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA5D9]/80">Password:</span>
                  <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">{creatorPassword}</span>
                </div>
              </div>

              {/* Quick Dispatch Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#8FA5D9]" />}
                  <span>{copied ? 'Copied' : 'Copy Slip'}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:shadow-[0_0_16px_rgba(16,185,129,0.3)] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${creatorEmail}?subject=${emailSubject}&body=${emailBody}`}
                  className="py-2.5 px-3 rounded-xl bg-[#5B8BF7] hover:bg-[#4F75E8] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-[0_0_16px_rgba(91,139,247,0.3)]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Creator</span>
                </a>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer"
              >
                Done & Return to Roster
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
