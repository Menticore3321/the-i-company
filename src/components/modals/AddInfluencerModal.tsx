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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white/95 border border-white/90 rounded-3xl w-full max-w-xl shadow-[0_25px_70px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col relative text-slate-800">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-600 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(244,63,94,0.3)]">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  ADMIN ACCESS CONTROL ·
                </span>
                <span className="font-mono text-[10px] text-emerald-600 font-bold">CUSTOM SCRAPER ENGINE</span>
              </div>
              <h3 className="font-sans text-xl font-extrabold text-slate-900 tracking-tight">
                Onboard Creator & Issue Studio Credentials
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
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
                    <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                      Instagram Handle or Profile Link *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="e.g. techburner or instagram.com/komalpandeyofficial"
                        required
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-slate-400"
                      />
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">@</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                      Niche Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as InfluencerCategory)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-white text-slate-800">{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Collapsible Custom Session Bridge */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowEngineSettings(!showEngineSettings)}
                    className="text-[11px] font-mono text-slate-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3 h-3 text-blue-600" />
                    <span>{showEngineSettings ? 'Hide Custom Scraper Bridge' : 'Configure Custom Instagram Session Key (Optional)'}</span>
                    {sessionId && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-1 animate-pulse"></span>
                    )}
                  </button>

                  {showEngineSettings && (
                    <div className="mt-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs animate-fade-in shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-slate-700 tracking-wider">
                          Proprietary Instagram Session Bridge
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono font-bold">
                          {sessionId ? '🟢 AUTHENTICATED GRAPH' : '⚪ OPENGRAPH FALLBACK'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                        Optionally paste the <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-600 font-mono font-semibold">sessionid</code> cookie from any dummy Instagram account to unlock single-digit follower accuracy and real Reels extraction.
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
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                        {sessionId && (
                          <button
                            type="button"
                            onClick={() => {
                              setSessionId('');
                              setSavedInstagramSession('');
                            }}
                            className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 hover:bg-rose-100 font-medium cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Option A Headless Scraper Microservice Endpoint */}
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase font-bold text-slate-700 flex items-center gap-1.5">
                            <Server className="w-3 h-3 text-emerald-600" />
                            Option A: Headless Chromium Microservice
                          </span>
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {scraperServiceUrl ? '🟢 CONFIGURED' : '⚪ NOT CONFIGURED'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                          Enter your dedicated Headless Chromium Scraper URL (e.g. <code className="bg-white px-1 py-0.5 rounded border border-slate-200 text-blue-600 font-mono">http://localhost:4000</code> or Render URL) to extract live 10 reels.
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
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                          {scraperServiceUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setScraperServiceUrlState('');
                                setScraperServiceUrl('');
                              }}
                              className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 hover:bg-rose-100 font-medium cursor-pointer"
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
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] cursor-pointer disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>
                        {scanStep === 1 && 'Querying Proprietary Instagram Engine...'}
                        {scanStep === 2 && 'Extracting authentic profile, followers & avatar...'}
                        {scanStep === 3 && 'Generating credentials & telemetry dossier...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-white" />
                      <span>{scannedResult ? 'Re-scan Live Instagram Data' : 'Extract Live Instagram Data'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Scanned & Editable Dossier */}
              {scannedResult && (
                <div className="space-y-4 pt-4 border-t border-slate-200/80 animate-fade-in">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
                    isLiveExtracted 
                      ? 'bg-emerald-50/70 border-emerald-200/80' 
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <img
                        src={customAvatar || scannedResult.avatar}
                        alt={customName || scannedResult.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-sans text-sm font-bold">
                            {customName || scannedResult.name}
                          </strong>
                          {isLiveExtracted ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-mono uppercase tracking-wider font-bold">
                              {extractionMode === 'authenticated_private_api' ? 'Private API Verified' : 'Live Scraped'}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[9px] font-mono uppercase tracking-wider font-semibold">
                              Manual Entry
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                          @{scannedResult.handle} · {formatFollowerCount(customFollowers || scannedResult.followers)} followers
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-extrabold text-emerald-600 text-sm block">
                        {scannedResult.authenticityScore}% Authenticity
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {scannedResult.engagementRate}% Engagement
                      </span>
                    </div>
                  </div>

                  {extractionNotice && (
                    <div className="text-[11px] text-slate-500 italic px-1 font-mono">
                      ℹ️ {extractionNotice}
                    </div>
                  )}

                  {/* Extracted Recent Content Manager */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block">
                          Recent Media & Viral Reels ({editableMedia.length})
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Verified reel deliverables · Edit, remove or scrape live from Instagram
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={handleFetchMicroserviceReels}
                          disabled={isFetchingReels || !handle.trim()}
                          className="px-3 py-1.5 rounded-xl bg-emerald-100/70 border border-emerald-200 hover:bg-emerald-200/70 text-xs text-emerald-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                          title="Scrape top 10 reels via Headless Chromium"
                        >
                          {isFetchingReels ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                          ) : (
                            <Zap className="w-3.5 h-3.5 text-emerald-700" />
                          )}
                          <span>{isFetchingReels ? 'Scraping 10 Reels...' : 'Live Scrape 10 Reels'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddMedia(!showAddMedia)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5 text-slate-700" />
                          <span>{showAddMedia ? 'Cancel' : '+ Add Live Reel'}</span>
                        </button>
                      </div>
                    </div>

                    {isFetchingReels && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3 animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0 text-emerald-600" />
                        <div>
                          <div className="font-bold">Launching Headless Chromium on Render (~15–20s)...</div>
                          <div className="text-[11px] text-slate-600 font-mono">Navigating to Instagram @{handle.replace('@', '')} and scraping real reels with views</div>
                        </div>
                      </div>
                    )}

                    {fetchReelsMessage && !isFetchingReels && (
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 font-mono shadow-sm">
                        {fetchReelsMessage}
                      </div>
                    )}

                    {/* Inline Add Live Reel / Post Form */}
                    {showAddMedia && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 animate-fade-in shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Play className="w-3.5 h-3.5 text-blue-600" />
                            Add Live Instagram Reel / Deliverable
                          </span>
                          <div className="flex gap-1">
                            {(['Reel', 'Carousel', 'Post'] as const).map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setNewMediaType(t)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors ${
                                  newMediaType === t 
                                    ? 'bg-blue-600 text-white font-bold' 
                                    : 'bg-slate-100 border border-slate-200 text-slate-600'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <div>
                            <label className="text-[10px] font-mono text-slate-600 uppercase block mb-1 font-semibold">
                              Instagram Reel / Post URL *
                            </label>
                            <input
                              type="text"
                              value={newMediaUrl}
                              onChange={(e) => setNewMediaUrl(e.target.value)}
                              placeholder="e.g. instagram.com/reel/C8xYz123"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-slate-600 uppercase block mb-1 font-semibold">
                              Views / Reach Count
                            </label>
                            <input
                              type="text"
                              value={newMediaViews}
                              onChange={(e) => setNewMediaViews(e.target.value)}
                              placeholder="e.g. 1500000 or 1.5M"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-mono text-slate-600 uppercase block mb-1 font-semibold">
                              Reel Title / Caption Hook
                            </label>
                            <input
                              type="text"
                              value={newMediaTitle}
                              onChange={(e) => setNewMediaTitle(e.target.value)}
                              placeholder="e.g. Top 5 Tech Gadgets Every Student Needs! 📱"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddMedia(false)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddCustomMedia}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm cursor-pointer"
                          >
                            Add to Creator Portfolio
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Media Cards Grid */}
                    {editableMedia.length === 0 ? (
                      <div className="p-4 rounded-xl bg-white border border-dashed border-slate-300 text-center text-xs text-slate-500">
                        No recent media attached yet. Click "+ Add Live Reel" or use "Live Scrape 10 Reels" to attach.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {editableMedia.map((item) => (
                          <div key={item.id} className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col group hover:border-blue-400 hover:shadow-md transition-all">
                            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-slate-100 text-slate-400">
                                <Play className="w-6 h-6 text-blue-500/60 mb-1" />
                                <span className="text-[9px] font-mono text-slate-500 line-clamp-2">{item.title}</span>
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
                                  } else {
                                    target.style.display = 'none';
                                  }
                                }}
                              />
                              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-[9px] text-white font-mono flex items-center gap-1 z-20 shadow-sm">
                                <span>{item.type === 'Reel' ? '▶' : item.type === 'Carousel' ? '📷' : '🖼️'}</span>
                                <span>{item.type}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteMedia(item.id)}
                                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer z-20 shadow"
                                title="Delete media"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-[10px] text-white font-mono flex items-center justify-between z-20">
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
                            <div className="p-2 flex-1 flex flex-col justify-between bg-white">
                              <p className="text-[11px] text-slate-800 font-semibold line-clamp-2 leading-tight">
                                {item.title}
                              </p>
                              <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-100">
                                <span>{item.postedDaysAgo}d ago</span>
                                <span className="text-emerald-600 font-bold">{item.engagement}% ER</span>
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
                      <label className="text-[11px] font-bold text-slate-700 block mb-1 font-sans">
                        Creator Full Name
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700 font-sans">
                          Followers Count
                        </label>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold">
                          ({formatFollowerCount(customFollowers)})
                        </span>
                      </div>
                      <input
                        type="number"
                        value={customFollowers}
                        onChange={(e) => setCustomFollowers(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1 font-sans">
                        Rate Per Reel (₹)
                      </label>
                      <input
                        type="number"
                        value={customRate}
                        onChange={(e) => setCustomRate(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Profile Pic & Bio Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1 font-sans">
                        <ImageIcon className="w-3 h-3 text-blue-600" />
                        <span>Profile Picture Avatar URL</span>
                      </label>
                      <input
                        type="url"
                        value={customAvatar}
                        onChange={(e) => setCustomAvatar(e.target.value)}
                        placeholder="https://images.unsplash.com/... or Instagram link"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1 font-sans">
                        <FileText className="w-3 h-3 text-blue-600" />
                        <span>Profile Bio</span>
                      </label>
                      <input
                        type="text"
                        value={customBio}
                        onChange={(e) => setCustomBio(e.target.value)}
                        placeholder="Digital Creator, YouTuber & Storyteller"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Credentials Setup */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600 font-bold flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-blue-600" />
                        <span>Admin-Assigned Login Credentials</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleGenerateStrongPassword}
                        className="text-[11px] font-sans font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Regenerate Password</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] font-medium text-slate-600 block mb-0.5 font-sans">Assigned Login Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={creatorEmail}
                            onChange={(e) => setCreatorEmail(e.target.value)}
                            placeholder="creator@creators.theicompany.com"
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 placeholder-slate-400"
                          />
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-600 block mb-0.5 font-sans">Assigned Password</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={creatorPassword}
                            onChange={(e) => setCreatorPassword(e.target.value)}
                            placeholder="creator#123"
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 placeholder-slate-400"
                          />
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
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
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-sans text-lg font-extrabold text-slate-900 tracking-tight">
                  Creator Added to Roster & Credentials Live!
                </h4>
                <p className="text-xs text-emerald-700 font-mono font-medium">
                  @{scannedResult?.handle} is registered in Supabase Cloud Database and ready to log in.
                </p>
              </div>

              {/* Copyable Slip */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2.5 shadow-sm">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-sans font-bold">CREATOR CREDENTIALS SLIP</span>
                  <span className="text-[10px] text-emerald-700 font-sans font-bold">ACTIVE TALENT DESK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Creator Name:</span>
                  <span className="font-bold text-slate-900">{customName} (@{handle.replace('@', '')})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Followers:</span>
                  <span className="font-extrabold text-emerald-600">{formatFollowerCount(customFollowers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Studio URL:</span>
                  <span className="font-bold text-blue-600">{portalUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Email:</span>
                  <span className="font-bold text-slate-900">{creatorEmail}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Password:</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{creatorPassword}</span>
                </div>
              </div>

              {/* Quick Dispatch Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Copied' : 'Copy Slip'}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${creatorEmail}?subject=${emailSubject}&body=${emailBody}`}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Creator</span>
                </a>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
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
