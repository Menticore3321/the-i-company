import React, { useState } from 'react';
import { Brand, UserAccount } from '../../types';
import { 
  X, 
  Building2, 
  Mail, 
  Lock, 
  Copy, 
  Check, 
  Sparkles, 
  DollarSign,
  ShieldCheck
} from 'lucide-react';

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBrand: (brand: Brand, account: UserAccount) => void;
}

export const AddBrandModal: React.FC<AddBrandModalProps> = ({
  isOpen,
  onClose,
  onAddBrand
}) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('D2C & Consumer');
  const [contactEmail, setContactEmail] = useState('');
  const [initialBudget, setInitialBudget] = useState(1000000);
  const [logoUrl, setLogoUrl] = useState('');
  
  // Credentials state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isCreated, setIsCreated] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Auto generate credentials when brand name changes
  const handleNameChange = (val: string) => {
    setName(val);
    const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (slug) {
      setLoginEmail(`${slug}@brands.theicompany.com`);
      setLoginPassword(`${slug}#${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const brandId = `br-${Date.now()}`;
    const newBrand: Brand = {
      id: brandId,
      name,
      industry,
      contactEmail: contactEmail || `${name.toLowerCase()}@example.com`,
      logo: logoUrl || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
      activeCampaignsCount: 0,
      totalSpent: initialBudget,
      escrowBalance: initialBudget,
      loginEmail,
      loginPassword
    };

    const newAccount: UserAccount = {
      id: `acc-${brandId}`,
      email: loginEmail,
      password: loginPassword,
      role: 'brand',
      name: newBrand.name,
      associatedId: brandId,
      status: 'active',
      lastLogin: 'Never (Newly Onboarded)'
    };

    onAddBrand(newBrand, newAccount);
    setIsCreated(true);
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`Brand Portal Access:
URL: http://localhost:3000
Email: ${loginEmail}
Password: ${loginPassword}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleFinish = () => {
    setIsCreated(false);
    setName('');
    setContactEmail('');
    setLoginEmail('');
    setLoginPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C1917]/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white border border-[#E7E2DA] rounded-2xl shadow-vintage-lg text-[#1C1917] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF8F5] border-b border-[#E7E2DA]">
          <div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#78716C]">
              BRAND CLIENT ONBOARDING
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Issue Brand Portal Access & Account
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!isCreated ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#1C1917] block mb-1">
                  Brand Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78716C]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Lenskart, Zepto, Tata Neu, Dyson"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] focus:border-[#1C1917] focus:bg-white text-xs text-[#1C1917] placeholder-[#A8A29E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#1C1917] block mb-1">
                    Industry / Sector
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] focus:border-[#1C1917] text-xs text-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#1C1917] block mb-1">
                    Official Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="marketing@brand.com"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] focus:border-[#1C1917] text-xs text-[#1C1917] font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-[#1C1917]">
                    Initial Escrow Allocation (INR)
                  </label>
                  <span className="font-serif font-bold text-sm text-[#2E523E]">
                    ₹{(initialBudget / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="5000000"
                  step="100000"
                  value={initialBudget}
                  onChange={(e) => setInitialBudget(Number(e.target.value))}
                  className="w-full accent-[#1C1917] cursor-pointer"
                />
              </div>

              {/* Generated Credentials Preview Box */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1C1917] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#C25E3E]" />
                    <span>Designated Login Credentials for Brand</span>
                  </span>
                  <span className="text-[10px] text-[#2E523E] font-mono font-medium">AUTO-CONFIGURED</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-white border border-[#E2DDD5]">
                    <span className="text-[10px] text-[#A8A29E] block">Assigned Email:</span>
                    <span className="text-[#1C1917] truncate block">{loginEmail || 'brand@brands.theicompany.com'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-white border border-[#E2DDD5]">
                    <span className="text-[10px] text-[#A8A29E] block">Temporary Password:</span>
                    <span className="text-[#1C1917] block">{loginPassword || 'brand#2026'}</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#78716C] font-sans">
                  The client will log in with these credentials to submit briefs and review creator deliverables.
                </p>
              </div>

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
                  disabled={!name.trim()}
                  className="px-5 py-2 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white font-medium text-xs shadow-vintage-sm transition-all"
                >
                  Create Account & Issue Login
                </button>
              </div>
            </form>
          ) : (
            /* Success & Copy Dialog */
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-[#EEF5F1] text-[#2E523E] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-serif text-lg font-bold text-[#1C1917]">
                  {name} Account Active!
                </h4>
                <p className="text-xs text-[#78716C] mt-1">
                  Brand credentials generated successfully. Share them with the client to grant portal access.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] text-left space-y-2 font-mono text-xs">
                <div>
                  <span className="text-[#A8A29E] block text-[10px]">Portal URL:</span>
                  <span className="text-[#1C1917] font-medium">http://localhost:3000</span>
                </div>
                <div>
                  <span className="text-[#A8A29E] block text-[10px]">Login Email:</span>
                  <span className="text-[#1C1917] font-medium">{loginEmail}</span>
                </div>
                <div>
                  <span className="text-[#A8A29E] block text-[10px]">Password:</span>
                  <span className="text-[#1C1917] font-medium">{loginPassword}</span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={handleCopyCredentials}
                  className="flex-1 py-2.5 rounded-lg bg-white border border-[#E2DDD5] text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-[#2E523E]" /> : <Copy className="w-4 h-4 text-[#78716C]" />}
                  <span>{copied ? 'Credentials Copied!' : 'Copy Credentials'}</span>
                </button>

                <button
                  onClick={handleFinish}
                  className="flex-1 py-2.5 rounded-lg bg-[#1C1917] text-white text-xs font-medium hover:bg-[#2E2A27]"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

