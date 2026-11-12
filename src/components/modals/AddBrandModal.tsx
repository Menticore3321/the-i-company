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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white/95 border border-white/90 rounded-3xl w-full max-w-lg shadow-[0_25px_70px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl overflow-hidden my-auto relative text-slate-800">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.3)]">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  ADMIN ACCESS CONTROL ·
                </span>
                <span className="font-mono text-[10px] text-emerald-600 font-bold">CLIENT ONBOARDING</span>
              </div>
              <h3 className="font-sans text-xl font-extrabold text-slate-900 tracking-tight">
                Onboard Brand Client & Generate Credentials
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

        {/* Content */}
        {!isCreated ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Admin will create the Brand's official portal and issue their dedicated login email & password.
              </span>
            </div>

            {/* Brand Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Brand Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Zomato, Puma India, CRED..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-sans placeholder-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Industry */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Industry / Category
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
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
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Allocated Escrow Budget (₹)
                </label>
                <input
                  type="number"
                  value={initialBudget}
                  onChange={(e) => setInitialBudget(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-900 font-mono font-semibold focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Official Contact Email (Optional)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. marketing@brand.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 placeholder-slate-400"
              />
            </div>

            {/* Generated Credentials Section */}
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
                  <span>Generate New</span>
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5 font-sans">Assigned Login Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="brand@brands.theicompany.com"
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
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="e.g. brand#4821"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 placeholder-slate-400"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Activate Brand Account & Issue Portal Access</span>
            </button>
          </form>
        ) : (
          /* SUCCESS CREDENTIALS PACKET */
          <div className="p-6 space-y-5">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <Check className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-sans text-lg font-extrabold text-slate-900 tracking-tight">
                Brand Account Activated Successfully!
              </h4>
              <p className="text-xs text-emerald-700 font-mono font-medium">
                {name} is now onboarded and registered in Supabase Cloud Database.
              </p>
            </div>

            {/* Copyable Credentials Voucher */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-sans font-bold">PORTAL CREDENTIALS SLIP</span>
                <span className="text-[10px] text-emerald-700 font-sans font-bold">READY FOR DISPATCH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Portal URL:</span>
                <span className="font-bold text-blue-600">{portalUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Email:</span>
                <span className="font-bold text-slate-900">{loginEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Password:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{loginPassword}</span>
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
                href={`mailto:${contactEmail || loginEmail}?subject=${emailSubject}&body=${emailBody}`}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Client</span>
              </a>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Done & Return to Master Deck
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
