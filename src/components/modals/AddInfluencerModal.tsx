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
  Check
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

  // Credentials
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorPassword, setCreatorPassword] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 500);
    setTimeout(() => setScanStep(3), 1000);
    setTimeout(() => {
      const result = analyzeInstagramHandle(handle, category);
      const cleanHandle = handle.replace('@', '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `${cleanHandle}@creators.theicompany.com`;
      const pwd = `creator#${Math.floor(1000 + Math.random() * 9000)}`;

      setCreatorEmail(email);
      setCreatorPassword(pwd);
      setScannedResult(result);
      setIsScanning(false);
      setScanStep(0);
    }, 1500);
  };

  const handleSave = () => {
    if (scannedResult) {
      const finalInfluencer: Influencer = {
        ...scannedResult,
        loginEmail: creatorEmail,
        loginPassword: creatorPassword
      };

      const newAccount: UserAccount = {
        id: `acc-${scannedResult.id}`,
        email: creatorEmail,
        password: creatorPassword,
        role: 'influencer',
        name: `${scannedResult.name} (@${scannedResult.handle})`,
        associatedId: scannedResult.id,
        status: 'active',
        lastLogin: 'Never (Newly Onboarded)'
      };

      onAddInfluencer(finalInfluencer, newAccount);
      onClose();
      setHandle('');
      setScannedResult(null);
    }
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`Creator Studio Login Access:
URL: http://localhost:3000
Email: ${creatorEmail}
Password: ${creatorPassword}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C1917]/50 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white border border-[#E7E2DA] rounded-2xl shadow-vintage-lg text-[#1C1917] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF8F5] border-b border-[#E7E2DA]">
          <div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#78716C]">CREATOR ONBOARDING</span>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Link Instagram Creator Profile & Issue Login
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
          {!scannedResult ? (
            <form onSubmit={handleStartScan} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#1C1917] block mb-1.5">
                  Instagram Handle or URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78716C]">
                    <Instagram className="w-4 h-4 text-[#C25E3E]" />
                  </div>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. @techburner, @komalpandeyofficial, @virat.kohli"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] focus:border-[#1C1917] focus:bg-white text-xs text-[#1C1917] placeholder-[#A8A29E] transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-[#78716C] mt-1 font-sans">
                  The system connects to telemetry, verifies follower authenticity, and automatically configures creator login credentials.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-[#1C1917] block mb-1.5">
                  Primary Niche Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InfluencerCategory)}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] focus:border-[#1C1917] text-xs text-[#1C1917]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress Scanner Indicator */}
              {isScanning && (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#1C1917]">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#C25E3E]" />
                      <span className="font-medium">
                        {scanStep === 1 && 'Connecting to Instagram Profile Graph...'}
                        {scanStep === 2 && 'Auditing engagement metrics & bot index...'}
                        {scanStep === 3 && 'Formulating commercial rate matrix & issuing credentials...'}
                      </span>
                    </span>
                    <span className="font-mono">{scanStep * 33}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E7E2DA] overflow-hidden">
                    <div 
                      className="bg-[#1C1917] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${scanStep * 33}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-white border border-[#E2DDD5] text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScanning || !handle.trim()}
                  className="px-5 py-2 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white font-medium text-xs shadow-vintage-sm disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Analyze Handle & Generate Login</span>
                </button>
              </div>
            </form>
          ) : (
            /* Scanned Result Preview with Login Credentials */
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={scannedResult.avatar}
                      alt={scannedResult.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#E2DDD5]"
                    />
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-1">
                        <span>{scannedResult.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E523E]" />
                      </h4>
                      <span className="text-xs text-[#78716C]">@{scannedResult.handle}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#EEF5F1] text-[#2E523E] border border-[#D1E3D8] text-[11px] font-semibold">
                    {scannedResult.tier}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#EFECE6] text-xs">
                  <div>
                    <span className="text-[#A8A29E] block text-[10px]">Followers</span>
                    <strong className="font-serif text-sm text-[#1C1917]">{(scannedResult.followers / 1000).toFixed(0)}k</strong>
                  </div>
                  <div>
                    <span className="text-[#A8A29E] block text-[10px]">Engagement</span>
                    <strong className="font-mono text-xs text-[#2E523E]">{scannedResult.engagementRate}%</strong>
                  </div>
                  <div>
                    <span className="text-[#A8A29E] block text-[10px]">Authenticity</span>
                    <strong className="font-mono text-xs text-[#1C1917]">{scannedResult.authenticityScore}%</strong>
                  </div>
                </div>

                {/* Generated Creator Credentials Box */}
                <div className="p-3.5 rounded-lg bg-white border border-[#E7E2DA] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1C1917] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#C25E3E]" />
                      <span>Issued Creator Studio Login</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCredentials}
                      className="text-[11px] text-[#78716C] hover:text-[#1C1917] flex items-center gap-1 font-mono"
                    >
                      {copied ? <Check className="w-3 h-3 text-[#2E523E]" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-[#FAF8F5] border border-[#E7E2DA]">
                      <span className="text-[10px] text-[#A8A29E] block">Login Email:</span>
                      <span className="text-[#1C1917] text-[11px] truncate block">{creatorEmail}</span>
                    </div>
                    <div className="p-2 rounded bg-[#FAF8F5] border border-[#E7E2DA]">
                      <span className="text-[10px] text-[#A8A29E] block">Password:</span>
                      <span className="text-[#1C1917] text-[11px] block">{creatorPassword}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setScannedResult(null)}
                  className="px-4 py-2 rounded-lg bg-white border border-[#E2DDD5] text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5]"
                >
                  Scan Another
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-lg bg-[#2E523E] hover:bg-[#244231] text-white font-medium text-xs shadow-vintage-sm transition-all"
                >
                  Add Creator & Activate Credentials
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
