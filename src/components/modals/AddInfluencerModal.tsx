import React, { useState } from 'react';
import { Influencer, InfluencerCategory, UserAccount } from '../../types';
import { 
  analyzeInstagramHandle, 
  getSavedInstagramSession, 
  setSavedInstagramSession 
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
  Plus
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
    <div className="fixed inset-0 z-50 bg-[#1C1917]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-2xl w-full max-w-xl shadow-vintage-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E7E2DA] bg-[#F7F4EE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1C1917] text-white flex items-center justify-center shadow-vintage-sm">
              <Instagram className="w-5 h-5 text-[#FAF8F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">
                  ADMIN ACCESS CONTROL ·
                </span>
                <span className="font-mono text-[10px] text-[#2E523E] font-semibold">CUSTOM SCRAPER ENGINE</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Onboard Creator & Issue Studio Credentials
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-[#E2DDD5] text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
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
                    <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                      Instagram Handle or Profile Link *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="e.g. techburner or instagram.com/komalpandeyofficial"
                        required
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#1C1917] font-mono focus:outline-none focus:border-[#1C1917]"
                      />
                      <span className="absolute left-3 top-2.5 text-xs text-[#78716C] font-mono">@</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                      Niche Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as InfluencerCategory)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Collapsible Custom Session Bridge */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowEngineSettings(!showEngineSettings)}
                    className="text-[11px] font-mono text-[#78716C] hover:text-[#1C1917] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3 h-3 text-[#78716C]" />
                    <span>{showEngineSettings ? 'Hide Custom Scraper Bridge' : 'Configure Custom Instagram Session Key (Optional)'}</span>
                    {sessionId && (
                      <span className="w-2 h-2 rounded-full bg-[#2E523E] inline-block ml-1"></span>
                    )}
                  </button>

                  {showEngineSettings && (
                    <div className="mt-2 p-3.5 rounded-xl bg-[#F7F4EE] border border-[#E7E2DA] space-y-2 text-xs animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#1C1917]">
                          Proprietary Instagram Session Bridge
                        </span>
                        <span className="text-[10px] text-[#2E523E] font-mono font-semibold">
                          {sessionId ? '🟢 AUTHENTICATED GRAPH' : '⚪ OPENGRAPH FALLBACK'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#78716C] leading-relaxed">
                        Optionally paste the <code className="bg-white px-1 py-0.5 rounded border border-[#E2DDD5] text-[#1C1917] font-mono">sessionid</code> cookie from any dummy Instagram account to unlock single-digit follower accuracy and real Reels extraction.
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
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#E7E2DA] text-xs font-mono text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                        />
                        {sessionId && (
                          <button
                            type="button"
                            onClick={() => {
                              setSessionId('');
                              setSavedInstagramSession('');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#C25E3E] hover:bg-[#FDF3EE] cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isScanning || !handle.trim()}
                  className="w-full py-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F2EDE4] border border-[#D6CFBF] text-[#1C1917] font-medium text-xs shadow-vintage-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1C1917]" />
                      <span>
                        {scanStep === 1 && 'Querying Proprietary Instagram Engine...'}
                        {scanStep === 2 && 'Extracting authentic profile, followers & avatar...'}
                        {scanStep === 3 && 'Generating credentials & telemetry dossier...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5 text-[#1C1917]" />
                      <span>{scannedResult ? 'Re-scan Live Instagram Data' : 'Extract Live Instagram Data'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Scanned & Editable Dossier */}
              {scannedResult && (
                <div className="space-y-4 pt-4 border-t border-[#E7E2DA] animate-fade-in">
                  {/* Status Banner */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    isLiveExtracted 
                      ? 'bg-[#EEF5F1] border-[#D1E3D8]' 
                      : 'bg-[#FAF4E8] border-[#E9DFCE]'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={customAvatar || scannedResult.avatar}
                        alt={customName || scannedResult.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#1C1917] shadow-vintage-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-[#1C1917] font-serif text-sm">
                            {customName || scannedResult.name}
                          </strong>
                          {isLiveExtracted ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#2E523E] text-white text-[9px] font-mono uppercase tracking-wider font-semibold">
                              {extractionMode === 'authenticated_private_api' ? 'Private API Verified' : 'Live Scraped'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-[#78716C] text-white text-[9px] font-mono uppercase tracking-wider font-semibold">
                              Manual Entry
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#78716C]">
                          @{scannedResult.handle} · {formatFollowerCount(customFollowers || scannedResult.followers)} followers
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-[#2E523E] text-xs block">
                        {scannedResult.authenticityScore}% Authenticity
                      </span>
                      <span className="text-[10px] text-[#78716C] block">
                        {scannedResult.engagementRate}% Engagement
                      </span>
                    </div>
                  </div>

                  {extractionNotice && (
                    <div className="text-[11px] text-[#78716C] italic px-1">
                      ℹ️ {extractionNotice}
                    </div>
                  )}

                  {/* Extracted Recent Content Manager */}
                  <div className="space-y-3 p-4 rounded-xl bg-white border border-[#E7E2DA]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-semibold block">
                          Recent Media & Viral Reels ({editableMedia.length})
                        </span>
                        <span className="text-[11px] text-[#A8A29E]">
                          Tailored to creator category · Edit, remove or paste live Instagram Reel links
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddMedia(!showAddMedia)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] hover:bg-[#F2EDE4] text-xs text-[#1C1917] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#1C1917]" />
                        <span>{showAddMedia ? 'Cancel' : '+ Add Live Reel'}</span>
                      </button>
                    </div>

                    {/* Inline Add Live Reel / Post Form */}
                    {showAddMedia && (
                      <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#E7E2DA] space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-2">
                          <span className="text-xs font-semibold text-[#1C1917] flex items-center gap-1.5">
                            <Play className="w-3.5 h-3.5 text-[#C25E3E]" />
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
                                    ? 'bg-[#1C1917] text-white font-semibold' 
                                    : 'bg-white border border-[#E7E2DA] text-[#78716C]'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <div>
                            <label className="text-[10px] font-mono text-[#78716C] uppercase block mb-1">
                              Instagram Reel / Post URL *
                            </label>
                            <input
                              type="text"
                              value={newMediaUrl}
                              onChange={(e) => setNewMediaUrl(e.target.value)}
                              placeholder="e.g. instagram.com/reel/C8xYz123"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E7E2DA] text-xs font-mono text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-[#78716C] uppercase block mb-1">
                              Views / Reach Count
                            </label>
                            <input
                              type="text"
                              value={newMediaViews}
                              onChange={(e) => setNewMediaViews(e.target.value)}
                              placeholder="e.g. 1500000 or 1.5M"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E7E2DA] text-xs font-mono text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-mono text-[#78716C] uppercase block mb-1">
                              Reel Title / Caption Hook
                            </label>
                            <input
                              type="text"
                              value={newMediaTitle}
                              onChange={(e) => setNewMediaTitle(e.target.value)}
                              placeholder="e.g. Top 5 Tech Gadgets Every Student Needs! 📱"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddMedia(false)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#78716C] hover:text-[#1C1917]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddCustomMedia}
                            className="px-3.5 py-1.5 rounded-lg bg-[#2E523E] text-white text-xs font-medium hover:bg-[#254232] shadow-vintage-xs cursor-pointer"
                          >
                            Add to Creator Portfolio
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Media Cards Grid */}
                    {editableMedia.length === 0 ? (
                      <div className="p-4 rounded-lg bg-[#FAF8F5] border border-dashed border-[#D6CFBF] text-center text-xs text-[#78716C]">
                        No recent media attached yet. Click "+ Add Live Reel" to attach creator reels.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {editableMedia.map((item) => (
                          <div key={item.id} className="relative rounded-xl overflow-hidden border border-[#E7E2DA] bg-[#FAF8F5] flex flex-col group hover:border-[#1C1917] transition-all">
                            <div className="relative aspect-[4/5] overflow-hidden bg-[#1C1917]/5">
                              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] text-white font-mono flex items-center gap-1">
                                <span>{item.type === 'Reel' ? '▶' : item.type === 'Carousel' ? '📷' : '🖼️'}</span>
                                <span>{item.type}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteMedia(item.id)}
                                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 hover:bg-[#C25E3E] text-white transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                title="Delete media"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-[10px] text-white font-mono flex items-center justify-between">
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
                              <p className="text-[11px] text-[#1C1917] font-medium line-clamp-2 leading-tight">
                                {item.title}
                              </p>
                              <div className="flex items-center justify-between text-[9px] text-[#78716C] font-mono mt-1 pt-1 border-t border-[#EFECE6]">
                                <span>{item.postedDaysAgo}d ago</span>
                                <span className="text-[#2E523E] font-semibold">{item.engagement}% ER</span>
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
                      <label className="text-[11px] font-semibold text-[#1C1917] block mb-1">
                        Creator Full Name
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-[#1C1917]">
                          Followers Count
                        </label>
                        <span className="text-[10px] font-mono text-[#2E523E] font-semibold">
                          ({formatFollowerCount(customFollowers)})
                        </span>
                      </div>
                      <input
                        type="number"
                        value={customFollowers}
                        onChange={(e) => setCustomFollowers(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E7E2DA] text-xs font-mono text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#1C1917] block mb-1">
                        Rate Per Reel (₹)
                      </label>
                      <input
                        type="number"
                        value={customRate}
                        onChange={(e) => setCustomRate(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E7E2DA] text-xs font-mono text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                      />
                    </div>
                  </div>

                  {/* Profile Pic & Bio Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#1C1917] block mb-1 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-[#78716C]" />
                        <span>Profile Picture Avatar URL</span>
                      </label>
                      <input
                        type="url"
                        value={customAvatar}
                        onChange={(e) => setCustomAvatar(e.target.value)}
                        placeholder="https://images.unsplash.com/... or Instagram CDN link"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E7E2DA] text-xs font-mono text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#1C1917] block mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[#78716C]" />
                        <span>Profile Bio</span>
                      </label>
                      <input
                        type="text"
                        value={customBio}
                        onChange={(e) => setCustomBio(e.target.value)}
                        placeholder="Digital Creator, YouTuber & Storyteller"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                      />
                    </div>
                  </div>

                  {/* Credentials Setup */}
                  <div className="p-4 rounded-xl bg-white border border-[#E2DDD5] space-y-3.5 shadow-vintage-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-[#C25E3E]" />
                        <span>Admin-Assigned Login Credentials</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleGenerateStrongPassword}
                        className="text-[11px] font-sans text-[#C25E3E] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Regenerate Password</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] text-[#78716C] block mb-0.5">Assigned Login Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={creatorEmail}
                            onChange={(e) => setCreatorEmail(e.target.value)}
                            placeholder="creator@creators.theicompany.com"
                            className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-xs font-mono text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#1C1917]"
                          />
                          <Mail className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-[#78716C] block mb-0.5">Assigned Password</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={creatorPassword}
                            onChange={(e) => setCreatorPassword(e.target.value)}
                            placeholder="creator#123"
                            className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-xs font-mono font-semibold text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#1C1917]"
                          />
                          <Lock className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full py-3 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white font-medium text-xs shadow-vintage-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#FBF9F5]" />
                    <span>Confirm Onboarding & Issue Studio Credentials</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* SUCCESS CREDENTIALS PACKET */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#EEF5F1] border border-[#D1E3D8] text-center space-y-1">
                <Check className="w-8 h-8 text-[#2E523E] mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#1C1917]">
                  Creator Added to Roster & Credentials Live!
                </h4>
                <p className="text-xs text-[#2E523E]">
                  @{scannedResult?.handle} is registered in Supabase Cloud Database and ready to log in.
                </p>
              </div>

              {/* Copyable Slip */}
              <div className="p-4 rounded-xl bg-white border border-[#E7E2DA] font-mono text-xs space-y-2.5 shadow-vintage-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#F0ECE4]">
                  <span className="text-[#78716C] text-[10px] uppercase font-sans font-semibold">CREATOR CREDENTIALS SLIP</span>
                  <span className="text-[10px] text-[#2E523E] font-sans font-semibold">ACTIVE TALENT DESK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Creator Name:</span>
                  <span className="font-semibold text-[#1C1917]">{customName} (@{handle.replace('@', '')})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Followers:</span>
                  <span className="font-bold text-[#2E523E]">{formatFollowerCount(customFollowers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Studio URL:</span>
                  <span className="font-semibold text-[#1C1917]">{portalUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Assigned Email:</span>
                  <span className="font-semibold text-[#1C1917]">{creatorEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Password:</span>
                  <span className="font-bold text-[#C25E3E] bg-[#FDF3EE] px-1.5 py-0.5 rounded border border-[#F2DACF]">{creatorPassword}</span>
                </div>
              </div>

              {/* Quick Dispatch Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="py-2.5 px-3 rounded-lg bg-white border border-[#D6CFBF] hover:bg-[#FAF8F5] text-xs font-medium text-[#1C1917] flex items-center justify-center gap-1.5 transition-colors shadow-vintage-xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#2E523E]" /> : <Copy className="w-3.5 h-3.5 text-[#57534E]" />}
                  <span>{copied ? 'Copied' : 'Copy Slip'}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-lg bg-[#2E523E] hover:bg-[#244231] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-vintage-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${creatorEmail}?subject=${emailSubject}&body=${emailBody}`}
                  className="py-2.5 px-3 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-vintage-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Creator</span>
                </a>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] hover:bg-[#F2EDE4] text-xs font-medium text-[#1C1917] transition-colors cursor-pointer"
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
