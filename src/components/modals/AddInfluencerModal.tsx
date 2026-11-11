import React, { useState } from 'react';
import { Influencer, InfluencerCategory, UserAccount } from '../../types';
import { analyzeInstagramHandle } from '../../lib/instagramService';
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
  DollarSign
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

  // Editable fields by Admin
  const [customName, setCustomName] = useState('');
  const [customFollowers, setCustomFollowers] = useState(0);
  const [customRate, setCustomRate] = useState(0);
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorPassword, setCreatorPassword] = useState('');
  const [isCreated, setIsCreated] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 400);
    setTimeout(() => setScanStep(3), 800);
    setTimeout(() => {
      const result = analyzeInstagramHandle(handle, category);
      const cleanHandle = handle.replace('@', '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `${cleanHandle}@creators.theicompany.com`;
      const pwd = `creator#${Math.floor(1000 + Math.random() * 9000)}`;

      setScannedResult(result);
      setCustomName(result.name);
      setCustomFollowers(result.followers);
      setCustomRate(result.ratePerReel);
      setCreatorEmail(email);
      setCreatorPassword(pwd);
      setIsScanning(false);
      setScanStep(0);
    }, 1200);
  };

  const handleGenerateStrongPassword = () => {
    const cleanHandle = handle.replace('@', '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'talent';
    setCreatorPassword(`${cleanHandle}@${Math.floor(10000 + Math.random() * 90000)}!`);
  };

  const handleSave = () => {
    if (scannedResult) {
      const finalInfluencer: Influencer = {
        ...scannedResult,
        name: customName.trim() || scannedResult.name,
        followers: Number(customFollowers) || scannedResult.followers,
        ratePerReel: Number(customRate) || scannedResult.ratePerReel,
        category,
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
    setCreatorEmail('');
    setCreatorPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-2xl w-full max-w-xl shadow-vintage-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
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
                <span className="font-mono text-[10px] text-[#2E523E] font-semibold">TALENT ONBOARDING</span>
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
        <div className="p-6 overflow-y-auto space-y-6">
          {!isCreated ? (
            <>
              {/* Scan Form */}
              <form onSubmit={handleStartScan} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                      Instagram Handle *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="e.g. @tanmaybhat or @komalpandeyofficial"
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

                <button
                  type="submit"
                  disabled={isScanning || !handle.trim()}
                  className="w-full py-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F2EDE4] border border-[#D6CFBF] text-[#1C1917] font-medium text-xs shadow-vintage-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1C1917]" />
                      <span>
                        {scanStep === 1 && 'Scanning public Instagram graph...'}
                        {scanStep === 2 && 'Computing audience authenticity & reel views...'}
                        {scanStep === 3 && 'Generating credentials & telemetry dossier...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5 text-[#1C1917]" />
                      <span>{scannedResult ? 'Re-scan Profile Telemetry' : 'Scan & Prepare Onboarding'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Scanned & Editable Dossier */}
              {scannedResult && (
                <div className="space-y-4 pt-4 border-t border-[#E7E2DA] animate-fade-in">
                  <div className="p-3.5 rounded-xl bg-[#EEF5F1] border border-[#D1E3D8] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={scannedResult.avatar}
                        alt={scannedResult.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#1C1917]"
                      />
                      <div>
                        <strong className="text-[#1C1917] block font-serif text-sm">{scannedResult.name}</strong>
                        <span className="text-[11px] text-[#2E523E]">@{scannedResult.handle} · {scannedResult.tier}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#2E523E] text-xs">
                        {scannedResult.authenticityScore}% Authenticity
                      </span>
                      <span className="text-[10px] text-[#78716C] block">{scannedResult.engagementRate}% Engagement</span>
                    </div>
                  </div>

                  {/* Editable Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#1C1917] block mb-1">Creator Name</label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#1C1917] block mb-1">Followers Count</label>
                      <input
                        type="number"
                        value={customFollowers}
                        onChange={(e) => setCustomFollowers(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E7E2DA] text-xs font-mono text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#1C1917] block mb-1">Rate Per Reel (₹)</label>
                      <input
                        type="number"
                        value={customRate}
                        onChange={(e) => setCustomRate(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E7E2DA] text-xs font-mono text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
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
                        className="text-[11px] font-sans text-[#C25E3E] hover:underline flex items-center gap-1"
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
                  className="py-2.5 px-3 rounded-lg bg-white border border-[#D6CFBF] hover:bg-[#FAF8F5] text-xs font-medium text-[#1C1917] flex items-center justify-center gap-1.5 transition-colors shadow-vintage-xs"
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
                className="w-full py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] hover:bg-[#F2EDE4] text-xs font-medium text-[#1C1917] transition-colors"
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
