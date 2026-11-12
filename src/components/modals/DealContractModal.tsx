import React, { useState } from 'react';
import { Campaign, Brand, Influencer, UserRole } from '../../types';
import { 
  X, 
  FileText, 
  Printer, 
  Receipt, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Building2, 
  Award,
  Send,
  Calendar,
  DollarSign
} from 'lucide-react';

interface DealContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  brand?: Brand;
  influencer?: Influencer;
  userRole: UserRole;
}

export const DealContractModal: React.FC<DealContractModalProps> = ({
  isOpen,
  onClose,
  campaign,
  brand,
  influencer,
  userRole
}) => {
  const [activeTab, setActiveTab] = useState<'agreement' | 'invoice' | 'voucher' | 'whatsapp'>('agreement');
  const [copied, setCopied] = useState(false);
  const [isSigned, setIsSigned] = useState(true);

  if (!isOpen || !campaign) return null;

  // Fiscal Calculations
  const contractId = `TIC-AGMT-${campaign.id.toUpperCase()}`;
  const invoiceId = `TIC-INV-2026-${campaign.id.replace('camp-', '').padStart(4, '0')}`;
  const voucherId = `TIC-VCHR-${campaign.id.replace('camp-', '').padStart(4, '0')}`;
  
  const baseBudget = campaign.totalBudget;
  const gstRate = 0.18; // 18% GST (SAC: 998311 - Advertising Services)
  const gstAmount = Math.round(baseBudget * gstRate);
  const totalInvoiceAmount = baseBudget + gstAmount;

  // Agency margin and creator pot
  const agencyMargin = Math.round(baseBudget * (campaign.agencyMarginRate || 0.2));
  const totalCreatorBudget = baseBudget - agencyMargin;

  // Creator specific calculations if viewed by creator
  const targetCreatorDeliverables = influencer 
    ? campaign.deliverables.filter(d => d.influencerId === influencer.id || d.influencerHandle === influencer.handle)
    : campaign.deliverables;

  const creatorTotalGross = targetCreatorDeliverables.reduce((acc, d) => acc + d.agreedPayout, 0) || (influencer ? influencer.ratePerReel : 150000);
  const tdsRate = 0.10; // 10% TDS under Section 194J (Professional fees)
  const tdsAmount = Math.round(creatorTotalGross * tdsRate);
  const creatorNetPayout = creatorTotalGross - tdsAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `THE I COMPANY · OFFICIAL DEAL MEMO & CONTRACT
Contract ID: ${contractId}
Campaign: ${campaign.name}
Client Brand: ${campaign.brandName}
Term: ${campaign.startDate} to ${campaign.endDate}
Commercial Consideration: ₹${campaign.totalBudget.toLocaleString()} (+ 18% GST)
Total Deliverables: ${campaign.deliverables.length} verified creator milestones
Escrow Protection: Active (The I Company Commercial Escrow Rail)
Status: Legally Stamped & Active`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const generateWhatsAppMessage = (recipientType: 'brand' | 'creator') => {
    let msg = '';
    if (recipientType === 'brand') {
      msg = `*The I Company · Official Campaign Agreement & Invoice*
Greetings from The I Company Atelier.

*Campaign:* ${campaign.name}
*Contract Ref:* ${contractId}
*Total Contract Value:* ₹${campaign.totalBudget.toLocaleString()} + 18% GST
*Milestone Deliverables:* ${campaign.deliverables.length} Content Deliverables
*Escrow Rail:* Locked & Insured

You can review the full legal agreement, creator drafts, and download the tax invoice anytime on your Brand Portal:
https://theicompany.netlify.app`;
    } else {
      msg = `*The I Company · Creator Deliverable Agreement & Payout Voucher*
Hey Creator! Your official collaboration terms are confirmed.

*Campaign:* ${campaign.name}
*Brand:* ${campaign.brandName}
*Agreement Ref:* ${contractId}
*Deliverables:* ${targetCreatorDeliverables.map(d => `${d.type} (Due: ${d.dueDate})`).join(', ')}
*Agreed Escrow Payout:* ₹${creatorTotalGross.toLocaleString()} (Net Payout after TDS: ₹${creatorNetPayout.toLocaleString()})

Submit your drafts & request instant payouts on your Creator Desk:
https://theicompany.netlify.app`;
    }
    return encodeURIComponent(msg);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white/95 border border-white/90 rounded-3xl w-full max-w-4xl shadow-[0_25px_70px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] relative text-slate-800">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
        
        {/* Top Control Bar (Hidden during Print) */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.3)]">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  LEGAL DEED & BILLING ENGINE ·
                </span>
                <span className="font-mono text-xs font-bold text-blue-600">{contractId}</span>
              </div>
              <h3 className="font-sans text-lg font-extrabold text-slate-900 leading-tight">
                {campaign.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print official document"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigator (Hidden during Print) */}
        <div className="px-5 pt-3 border-b border-slate-200 bg-slate-50/70 flex items-center gap-2 overflow-x-auto print:hidden">
          <button
            onClick={() => setActiveTab('agreement')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'agreement'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Legal Deal Agreement</span>
          </button>

          {userRole !== 'influencer' && (
            <button
              onClick={() => setActiveTab('invoice')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'invoice'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>2. Commercial GST Tax Invoice</span>
            </button>
          )}

          {userRole !== 'brand' && (
            <button
              onClick={() => setActiveTab('voucher')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'voucher'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>3. Creator Payout Voucher (TDS)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-emerald-600'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>4. 1-Click WhatsApp Dispatch</span>
          </button>
        </div>

        {/* Scrollable Content Body (Styled for Document Printing) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FAF8F5]">
          
          {/* TAB 1: LEGAL COLLABORATION AGREEMENT */}
          {activeTab === 'agreement' && (
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 border border-[#E7E2DA] rounded-xl shadow-vintage-sm space-y-8 font-serif text-[#1C1917] relative">
              
              {/* Document Header */}
              <div className="flex items-start justify-between border-b-2 border-[#1C1917] pb-6">
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-[#78716C]">
                    COMMERCIAL COLLABORATION AGREEMENT · MMXXVI
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] mt-1">
                    The I Company Atelier
                  </h1>
                  <p className="text-xs font-sans text-[#78716C] mt-1 max-w-sm">
                    Operating as Influencer Marketing Agency of Record & Escrow Clearing House, Mumbai, India.
                  </p>
                </div>

                <div className="text-right font-sans">
                  <div className="inline-block px-3 py-1 rounded bg-[#F7F4EE] border border-[#E2DDD5] text-[11px] font-mono text-[#1C1917] font-bold">
                    {contractId}
                  </div>
                  <span className="text-[10px] text-[#78716C] block mt-1 font-mono">
                    Date of Execution: {campaign.startDate}
                  </span>
                </div>
              </div>

              {/* Contracting Parties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block">
                    FIRST PARTY (CLIENT BRAND):
                  </span>
                  <div className="font-serif text-base font-bold text-[#1C1917]">{campaign.brandName}</div>
                  <div className="text-[#57534E]">Industry: {campaign.niche}</div>
                  <div className="text-[#78716C] text-[11px]">Commercial Portal ID: {campaign.brandId}</div>
                </div>

                <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block">
                    SECOND PARTY (AGENCY & ESCROW):
                  </span>
                  <div className="font-serif text-base font-bold text-[#1C1917]">The I Company Pvt. Ltd.</div>
                  <div className="text-[#57534E]">Corporate Escrow & Talent Management Rail</div>
                  <div className="text-[#78716C] text-[11px]">Registration: ROC-MUM-2026-TIC-099</div>
                </div>
              </div>

              {/* Recitals & Scope */}
              <div className="space-y-3 text-xs leading-relaxed text-[#2C2926]">
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#1C1917] border-b border-[#F0ECE4] pb-1">
                  1. Scope of Creative Engagement
                </h4>
                <p>
                  The Client Brand hereby engages <strong>The I Company</strong> to orchestrate, commission, and administer content deliverables for the campaign titled <em>"{campaign.name}"</em>. The agency covenants to oversee creator production, brand guidelines compliance, milestone review, and escrow disbursement.
                </p>

                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#1C1917] border-b border-[#F0ECE4] pb-1 pt-2">
                  2. Scheduled Deliverables Matrix
                </h4>
                <div className="font-sans border border-[#E7E2DA] rounded-lg overflow-hidden my-2">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F4EE] text-[#57534E] border-b border-[#E7E2DA] text-[10px] font-mono uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Creator Handle</th>
                        <th className="py-2.5 px-3">Content Format</th>
                        <th className="py-2.5 px-3">Publish Due Date</th>
                        <th className="py-2.5 px-3 text-right">Escrow Milestone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0ECE4]">
                      {campaign.deliverables.map((del) => (
                        <tr key={del.id} className="hover:bg-[#FAF8F5]">
                          <td className="py-2.5 px-3 font-semibold text-[#1C1917]">@{del.influencerHandle}</td>
                          <td className="py-2.5 px-3 text-[#57534E]">{del.type}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-[#78716C]">{del.dueDate}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-medium text-[#2E523E]">
                            ₹{del.agreedPayout.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#1C1917] border-b border-[#F0ECE4] pb-1 pt-2">
                  3. Commercial Escrow & Release Terms
                </h4>
                <p>
                  Total campaign budget consideration is <strong>₹{campaign.totalBudget.toLocaleString()} INR</strong> (+ applicable 18% GST). Funds are sequestered within The I Company Escrow Vault. Milestone disbursements are unlocked strictly following client approval on the Brand Portal.
                </p>

                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#1C1917] border-b border-[#F0ECE4] pb-1 pt-2">
                  4. Intellectual Property & Digital Usage Rights
                </h4>
                <p>
                  The Brand Client is granted non-exclusive, worldwide digital amplification and whitelisting rights for a period of <strong>90 (ninety) days</strong> across Instagram, Meta Ads, and official brand digital channels. Raw creator assets remain subject to moral rights under Indian Copyright laws.
                </p>
              </div>

              {/* Vintage Seal & Signatures */}
              <div className="pt-6 border-t-2 border-[#1C1917] grid grid-cols-2 sm:grid-cols-3 gap-6 items-end font-sans text-xs">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] mb-2">CLIENT SIGN-OFF:</div>
                  <div className="h-12 border-b border-[#B8B2A7] flex items-center font-serif italic text-base text-[#1C1917]">
                    {campaign.brandName} Team
                  </div>
                  <span className="text-[10px] text-[#78716C] block mt-1">Authorized Representative</span>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] mb-2">AGENCY EXECUTIVE:</div>
                  <div className="h-12 border-b border-[#B8B2A7] flex items-center font-serif italic text-base text-[#1C1917]">
                    The I Company Atelier
                  </div>
                  <span className="text-[10px] text-[#78716C] block mt-1">Director of Commercial Partnerships</span>
                </div>

                {/* Vintage Stamped Seal */}
                <div className="flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#2E523E] flex flex-col items-center justify-center p-2 text-[#2E523E] rotate-[-6deg] bg-[#EEF5F1]/60">
                    <ShieldCheck className="w-5 h-5 text-[#2E523E] mb-0.5" />
                    <span className="text-[8px] font-mono font-bold tracking-widest uppercase">THE I COMPANY</span>
                    <span className="text-[7px] font-sans uppercase">OFFICIAL SEAL</span>
                    <span className="text-[7px] font-mono">MMXXVI</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#2E523E] mt-1">ENFORCED VIA ESCROW RAIL</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMMERCIAL GST TAX INVOICE */}
          {activeTab === 'invoice' && (
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 border border-[#E7E2DA] rounded-xl shadow-vintage-sm space-y-6 font-sans text-[#1C1917]">
              
              {/* Invoice Header */}
              <div className="flex items-start justify-between border-b border-[#E7E2DA] pb-6">
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-[#78716C]">
                    TAX INVOICE · ORIGINAL FOR RECIPIENT
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
                    The I Company Pvt. Ltd.
                  </h2>
                  <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                    Atelier 104, Nariman Point Commercial Chambers<br />
                    Mumbai, Maharashtra, India · 400021<br />
                    <strong>GSTIN:</strong> 27AAACT9920K1ZX · <strong>PAN:</strong> AAACT9920K
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-[#78716C] block">INVOICE NUMBER</span>
                  <div className="font-mono text-base font-bold text-[#1C1917]">{invoiceId}</div>
                  <span className="text-xs text-[#78716C] block mt-1">Invoice Date: {campaign.startDate}</span>
                  <span className="text-xs text-[#78716C] block">Due Date: Net 15 Days</span>
                </div>
              </div>

              {/* Billed To */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] flex flex-col sm:flex-row justify-between gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#78716C] block">BILLED TO (CLIENT):</span>
                  <div className="font-serif text-base font-bold text-[#1C1917] mt-0.5">{campaign.brandName}</div>
                  <div className="text-[#57534E]">Enterprise Advertising Division</div>
                  <div className="text-[#78716C]">Client Contact: {brand?.contactEmail || 'commercial@brand.com'}</div>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[10px] font-mono uppercase text-[#78716C] block">PLACE OF SUPPLY:</span>
                  <strong className="text-[#1C1917] block">Maharashtra (27) · Domestic</strong>
                  <span className="text-[11px] text-[#78716C]">Commercial Service Category: Influencer Ads</span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-[#E7E2DA] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F4EE] text-[#57534E] border-b border-[#E7E2DA] font-mono text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Description of Services</th>
                      <th className="py-2.5 px-3">HSN/SAC</th>
                      <th className="py-2.5 px-3 text-right">Taxable Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE4]">
                    <tr>
                      <td className="py-3 px-3 font-mono text-[#78716C]">01</td>
                      <td className="py-3 px-3">
                        <strong className="text-[#1C1917] block">{campaign.name} — Campaign Orchestration</strong>
                        <span className="text-[11px] text-[#78716C]">
                          Managed talent execution, {campaign.deliverables.length} Instagram creator deliverables, escrow custody & performance reporting.
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#57534E]">998311</td>
                      <td className="py-3 px-3 text-right font-mono font-medium text-[#1C1917]">
                        ₹{baseBudget.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tax Computation */}
              <div className="flex justify-end pt-2">
                <div className="w-full sm:w-80 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F0ECE4]">
                    <span className="text-[#78716C]">Subtotal (Taxable Amount):</span>
                    <span className="font-mono font-medium text-[#1C1917]">₹{baseBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0ECE4]">
                    <span className="text-[#78716C]">CGST @ 9%:</span>
                    <span className="font-mono text-[#1C1917]">₹{(gstAmount / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0ECE4]">
                    <span className="text-[#78716C]">SGST @ 9%:</span>
                    <span className="font-mono text-[#1C1917]">₹{(gstAmount / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b-2 border-[#1C1917] text-sm">
                    <strong className="font-serif text-[#1C1917]">Total Invoice Amount:</strong>
                    <strong className="font-mono text-[#2E523E] font-bold">₹{totalInvoiceAmount.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Bank Transfer Details */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-[#78716C]">DIRECT RTGS / NEFT ESCROW REMITTANCE:</span>
                  <div className="font-mono text-[11px] text-[#1C1917]">
                    Bank: HDFC Bank Limited · A/C: 50200088912340 · IFSC: HDFC0000060
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded bg-[#EEF5F1] text-[#2E523E] font-mono text-[11px] font-bold border border-[#D1E3D8]">
                  ESCROW CLEARED
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CREATOR PAYOUT VOUCHER */}
          {activeTab === 'voucher' && (
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 border border-[#E7E2DA] rounded-xl shadow-vintage-sm space-y-6 font-sans text-[#1C1917]">
              
              <div className="flex items-start justify-between border-b border-[#E7E2DA] pb-6">
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-[#78716C]">
                    TALENT REMUNERATION VOUCHER & TDS ADVICE
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
                    Creator Disbursement Certificate
                  </h2>
                  <p className="text-xs text-[#57534E] mt-1">
                    Issued under The I Company Talent Protection Escrow Framework.
                  </p>
                </div>

                <div className="text-right font-mono">
                  <div className="inline-block px-2.5 py-1 rounded bg-[#F7F4EE] border border-[#E2DDD5] text-xs font-bold text-[#1C1917]">
                    {voucherId}
                  </div>
                  <span className="text-[10px] text-[#78716C] block mt-1">Status: Disbursable</span>
                </div>
              </div>

              {/* Beneficiary Box */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#78716C]">BENEFICIARY CREATOR:</span>
                  <div className="font-serif text-base font-bold text-[#1C1917] mt-0.5">
                    {influencer ? influencer.name : 'Contracted Creator Talent'}
                  </div>
                  <div className="text-[#57534E]">
                    Handle: @{influencer ? influencer.handle : targetCreatorDeliverables[0]?.influencerHandle || 'creator'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#78716C]">CAMPAIGN SPONSOR:</span>
                  <div className="font-serif text-base font-bold text-[#1C1917] mt-0.5">{campaign.brandName}</div>
                  <div className="text-[#78716C]">{campaign.name}</div>
                </div>
              </div>

              {/* Payout Breakdown */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase text-[#78716C] block">
                  CONTRACTED DELIVERABLES & TDS WITHHOLDING:
                </span>

                <div className="border border-[#E7E2DA] rounded-lg overflow-hidden text-xs">
                  <div className="p-3 bg-[#F7F4EE] border-b border-[#E7E2DA] font-semibold text-[#1C1917] flex justify-between">
                    <span>Deliverable Component</span>
                    <span>Gross Fee</span>
                  </div>
                  <div className="p-3 divide-y divide-[#F0ECE4]">
                    {targetCreatorDeliverables.map((del) => (
                      <div key={del.id} className="py-2 flex justify-between items-center">
                        <div>
                          <strong className="text-[#1C1917]">{del.type}</strong>
                          <span className="text-[11px] text-[#78716C] ml-2">Due: {del.dueDate}</span>
                        </div>
                        <span className="font-mono font-medium text-[#1C1917]">₹{del.agreedPayout.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#FDF8EC] border border-[#F5E6BD] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Total Gross Remuneration:</span>
                    <strong className="font-mono text-[#1C1917]">₹{creatorTotalGross.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-[#C25E3E]">
                    <span>Less: Income Tax TDS (Sec 194J @ 10%):</span>
                    <span className="font-mono">- ₹{tdsAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E8DAB0] text-sm font-bold">
                    <span className="font-serif text-[#1C1917]">Net Wallet Credit / Disbursable Amount:</span>
                    <span className="font-mono text-[#2E523E]">₹{creatorNetPayout.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#78716C] leading-relaxed pt-2">
                * Note: Form 16A TDS Certificates are published quarterly to the creator's registered PAN. Payouts are remitted via IMPS/NEFT directly to the verified creator account upon client milestone clearance.
              </div>
            </div>
          )}

          {/* TAB 4: 1-CLICK WHATSAPP DISPATCH */}
          {activeTab === 'whatsapp' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-vintage-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF5F1] text-[#2E523E] flex items-center justify-center border border-[#D1E3D8]">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#1C1917]">Instant WhatsApp Dispatch</h4>
                    <p className="text-xs text-[#78716C]">
                      Send structured agreements, deal memos, and portal credentials directly to stakeholders via WhatsApp.
                    </p>
                  </div>
                </div>

                {/* Option 1: Send to Brand */}
                <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="font-serif text-sm text-[#1C1917] block">Dispatch to Brand Client</strong>
                      <span className="text-xs text-[#78716C]">{campaign.brandName} · Contract Packet & Invoice</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#EEF5F1] text-[#2E523E] text-[10px] font-mono font-medium">
                      TAX INVOICE READY
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/?text=${generateWhatsAppMessage('brand')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#2E523E] hover:bg-[#244231] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-vintage-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Agreement & Invoice via WhatsApp</span>
                  </a>
                </div>

                {/* Option 2: Send to Creator */}
                <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="font-serif text-sm text-[#1C1917] block">Dispatch to Creator Talent</strong>
                      <span className="text-xs text-[#78716C]">
                        Deliverable brief, due dates & escrow payout terms
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#FAF4E8] text-[#8A6B32] text-[10px] font-mono font-medium">
                      ESCROW PROTECTED
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/?text=${generateWhatsAppMessage('creator')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#1C1917] hover:bg-[#2E2A27] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-vintage-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Deal Voucher to Creator via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E7E2DA] bg-[#F7F4EE] flex items-center justify-between text-xs text-[#78716C] print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2E523E]" />
            <span>Legally binding digital memo stamped under The I Company Operating Charter MMXXVI</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1C1917] text-white hover:bg-[#2E2A27] font-medium transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

