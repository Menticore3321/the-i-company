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
    <div className="fixed inset-0 z-50 bg-[#1C1917]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-2xl w-full max-w-lg shadow-vintage-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#E7E2DA] bg-[#F7F4EE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1C1917] text-white flex items-center justify-center shadow-vintage-sm">
              <Building2 className="w-5 h-5 text-[#FAF8F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">
                  ADMIN ACCESS CONTROL ·
                </span>
                <span className="font-mono text-[10px] text-[#2E523E] font-semibold">CLIENT ONBOARDING</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Onboard Brand Client & Generate Credentials
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

        {/* Content */}
        {!isCreated ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="p-3.5 rounded-xl bg-[#F0ECE4]/60 border border-[#E2DDD5] text-xs text-[#57534E] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E523E] flex-shrink-0" />
              <span>
                Admin will create the Brand's official portal and issue their dedicated login email & password.
              </span>
            </div>

            {/* Brand Name */}
            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Zomato, Puma India, CRED..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Industry */}
              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                  Industry / Category
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                >
                  <option value="D2C & Consumer Tech">D2C & Consumer Tech</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Food & Beverages">Food & Beverages</option>
                  <option value="Fintech & Banking">Fintech & Banking</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Gaming & Esports">Gaming & Esports</option>
                  <option value="Automotive & Travel">Automotive & Travel</option>
                </select>
              </div>

              {/* Initial Budget */}
              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                  Allocated Escrow Budget (₹)
                </label>
                <input
                  type="number"
                  value={initialBudget}
                  onChange={(e) => setInitialBudget(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#1C1917] font-mono focus:outline-none focus:border-[#1C1917]"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                Official Contact Email (Optional)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. marketing@brand.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E7E2DA] text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              />
            </div>

            {/* Generated Credentials Section */}
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
                  <span>Generate New</span>
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-[#78716C] block mb-0.5">Assigned Login Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="brand@brands.theicompany.com"
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
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="e.g. brand#4821"
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-xs font-mono font-semibold text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#1C1917]"
                    />
                    <Lock className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white font-medium text-xs shadow-vintage-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FBF9F5]" />
              <span>Activate Brand Account & Issue Portal Access</span>
            </button>
          </form>
        ) : (
          /* SUCCESS CREDENTIALS PACKET */
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-[#EEF5F1] border border-[#D1E3D8] text-center space-y-1">
              <Check className="w-8 h-8 text-[#2E523E] mx-auto" />
              <h4 className="font-serif text-lg font-bold text-[#1C1917]">
                Brand Account Activated Successfully!
              </h4>
              <p className="text-xs text-[#2E523E]">
                {name} is now onboarded and registered in Supabase Cloud Database.
              </p>
            </div>

            {/* Copyable Credentials Voucher */}
            <div className="p-4 rounded-xl bg-white border border-[#E7E2DA] font-mono text-xs space-y-2.5 shadow-vintage-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#F0ECE4]">
                <span className="text-[#78716C] text-[10px] uppercase font-sans font-semibold">PORTAL CREDENTIALS SLIP</span>
                <span className="text-[10px] text-[#2E523E] font-sans font-semibold">READY FOR DISPATCH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Portal URL:</span>
                <span className="font-semibold text-[#1C1917]">{portalUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Assigned Email:</span>
                <span className="font-semibold text-[#1C1917]">{loginEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Password:</span>
                <span className="font-bold text-[#C25E3E] bg-[#FDF3EE] px-1.5 py-0.5 rounded border border-[#F2DACF]">{loginPassword}</span>
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
                href={`mailto:${contactEmail || loginEmail}?subject=${emailSubject}&body=${emailBody}`}
                className="py-2.5 px-3 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-vintage-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Client</span>
              </a>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] hover:bg-[#F2EDE4] text-xs font-medium text-[#1C1917] transition-colors"
            >
              Done & Return to Master Deck
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
