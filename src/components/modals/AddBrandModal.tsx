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
  ShieldCheck,
  Send,
  ExternalLink,
  Key
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
  const [industry, setIndustry] = useState('D2C & Consumer Tech');
  const [contactEmail, setContactEmail] = useState('');
  const [initialBudget, setInitialBudget] = useState(1500000);
  const [logoUrl, setLogoUrl] = useState('');
  
  // Custom & Auto Credentials
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isCreated, setIsCreated] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Auto generate credentials when brand name changes
  const handleNameChange = (val: string) => {
    setName(val);
    const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (slug && !loginEmail) {
      setLoginEmail(`${slug}@brands.theicompany.com`);
    }
    if (slug && !loginPassword) {
      setLoginPassword(`brand#${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const handleGenerateStrongPassword = () => {
    const slug = name ? name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) : 'brand';
    setLoginPassword(`${slug}@${Math.floor(10000 + Math.random() * 90000)}!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const brandId = `br-${Date.now()}`;
    const finalEmail = loginEmail.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@brands.theicompany.com`;
    const finalPassword = loginPassword.trim() || 'brand123';

    const newBrand: Brand = {
      id: brandId,
      name: name.trim(),
      industry,
      contactEmail: contactEmail.trim() || finalEmail,
      logo: logoUrl.trim() || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
      activeCampaignsCount: 0,
      totalSpent: Number(initialBudget),
      escrowBalance: Number(initialBudget),
      loginEmail: finalEmail,
      loginPassword: finalPassword
    };

    const newAccount: UserAccount = {
      id: `acc-${brandId}`,
      email: finalEmail.toLowerCase(),
      password: finalPassword,
      role: 'brand',
      name: `${newBrand.name} Team`,
      associatedId: brandId,
      status: 'active',
      lastLogin: 'Never (Newly Onboarded)'
    };

    onAddBrand(newBrand, newAccount);
    setIsCreated(true);
  };

  const portalUrl = 'https://theicompany.netlify.app';

  const credentialsSummary = `THE I COMPANY · OFFICIAL BRAND CLIENT PORTAL ACCESS
Client: ${name}
Access Portal: ${portalUrl}
Assigned Email: ${loginEmail}
Temporary Password: ${loginPassword}
Security Status: Escrow-Protected Dedicated Workspace

Please log in and review your contracted campaigns, talent deliverables, and approve video drafts.`;

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(credentialsSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const whatsappMessage = encodeURIComponent(
    `*The I Company · Official Brand Client Portal Access*\n` +
    `Hello ${name} Team,\n\n` +
    `Your dedicated brand campaign portal is active:\n` +
    `🔗 *URL:* ${portalUrl}\n` +
    `📧 *Assigned Email:* ${loginEmail}\n` +
    `🔑 *Password:* ${loginPassword}\n\n` +
    `You can now review creator drafts, track active campaigns, and download official GST tax invoices.`
  );

  const emailSubject = encodeURIComponent(`The I Company · Brand Portal Access Credentials for ${name}`);
  const emailBody = encodeURIComponent(credentialsSummary);

  const handleFinish = () => {
    setIsCreated(false);
    setName('');
    setContactEmail('');
    setLoginEmail('');
    setLoginPassword('');
    setInitialBudget(1500000);
    setLogoUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020307]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-[#0B0E17]/95 border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_16px_64px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden my-auto relative text-[#D7DCEA]">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#5B8BF7] to-transparent" />
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] bg-[#07090F]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B8BF7] to-[#7189BA] text-white flex items-center justify-center shadow-[0_0_16px_rgba(91,139,247,0.3)]">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#7189BA]">
                  ADMIN ACCESS CONTROL ·
                </span>
                <span className="font-mono text-[10px] text-[#10B981] font-semibold">CLIENT ONBOARDING</span>
              </div>
              <h3 className="font-sans text-xl font-bold text-white tracking-tight">
                Onboard Brand Client & Generate Credentials
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

        {/* Content */}
        {!isCreated ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-[#8FA5D9] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981] flex-shrink-0" />
              <span>
                Admin will create the Brand's official portal and issue their dedicated login email & password.
              </span>
            </div>

            {/* Brand Name */}
            <div>
              <label className="text-xs font-semibold text-white block mb-1 font-sans">
                Brand Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Zomato, Puma India, CRED..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#5B8BF7] transition-all font-sans placeholder-white/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Industry */}
              <div>
                <label className="text-xs font-semibold text-white block mb-1 font-sans">
                  Industry / Category
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#07090F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#5B8BF7]"
                >
                  <option value="D2C & Consumer Tech" className="bg-[#0B0E17] text-white">D2C & Consumer Tech</option>
                  <option value="Fashion & Apparel" className="bg-[#0B0E17] text-white">Fashion & Apparel</option>
                  <option value="Food & Beverages" className="bg-[#0B0E17] text-white">Food & Beverages</option>
                  <option value="Fintech & Banking" className="bg-[#0B0E17] text-white">Fintech & Banking</option>
                  <option value="Health & Wellness" className="bg-[#0B0E17] text-white">Health & Wellness</option>
                  <option value="Gaming & Esports" className="bg-[#0B0E17] text-white">Gaming & Esports</option>
                  <option value="Automotive & Travel" className="bg-[#0B0E17] text-white">Automotive & Travel</option>
                </select>
              </div>

              {/* Initial Budget */}
              <div>
                <label className="text-xs font-semibold text-white block mb-1 font-sans">
                  Allocated Escrow Budget (₹)
                </label>
                <input
                  type="number"
                  value={initialBudget}
                  onChange={(e) => setInitialBudget(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#5B8BF7]"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label className="text-xs font-semibold text-white block mb-1 font-sans">
                Official Contact Email (Optional)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. marketing@brand.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#5B8BF7] placeholder-white/30"
              />
            </div>

            {/* Generated Credentials Section */}
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
                  <span>Generate New</span>
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-[#8FA5D9] block mb-0.5 font-sans">Assigned Login Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="brand@brands.theicompany.com"
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
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="e.g. brand#4821"
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs font-mono font-semibold text-white focus:outline-none focus:border-[#5B8BF7] placeholder-white/30"
                    />
                    <Lock className="w-3.5 h-3.5 text-[#7189BA] absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5B8BF7] to-[#4F75E8] hover:shadow-[0_0_24px_rgba(91,139,247,0.4)] text-white font-medium text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Activate Brand Account & Issue Portal Access</span>
            </button>
          </form>
        ) : (
          /* SUCCESS CREDENTIALS PACKET */
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-center space-y-1">
              <Check className="w-8 h-8 text-[#10B981] mx-auto" />
              <h4 className="font-sans text-lg font-bold text-white tracking-tight">
                Brand Account Activated Successfully!
              </h4>
              <p className="text-xs text-[#10B981] font-mono">
                {name} is now onboarded and registered in Supabase Cloud Database.
              </p>
            </div>

            {/* Copyable Credentials Voucher */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
                <span className="text-[#7189BA] text-[10px] uppercase font-sans font-semibold">PORTAL CREDENTIALS SLIP</span>
                <span className="text-[10px] text-[#10B981] font-sans font-semibold">READY FOR DISPATCH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8FA5D9]/80">Portal URL:</span>
                <span className="font-semibold text-[#5B8BF7]">{portalUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8FA5D9]/80">Assigned Email:</span>
                <span className="font-semibold text-white">{loginEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8FA5D9]/80">Password:</span>
                <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">{loginPassword}</span>
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
                href={`mailto:${contactEmail || loginEmail}?subject=${emailSubject}&body=${emailBody}`}
                className="py-2.5 px-3 rounded-xl bg-[#5B8BF7] hover:bg-[#4F75E8] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-[0_0_16px_rgba(91,139,247,0.3)]"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Client</span>
              </a>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              Done & Return to Master Deck
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
