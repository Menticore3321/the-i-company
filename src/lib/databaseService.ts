import { supabase, isSupabaseConfigured } from './supabase';
import { Influencer, Brand, Campaign, FinancialLedger, UserAccount } from '../types';
import { 
  INITIAL_INFLUENCERS, 
  INITIAL_BRANDS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_FINANCIALS, 
  INITIAL_ACCOUNTS 
} from './mockData';

// Storage keys for local fallback
const STORAGE_KEYS = {
  ACCOUNTS: 'the_i_company_accounts',
  INFLUENCERS: 'the_i_company_influencers',
  BRANDS: 'the_i_company_brands',
  CAMPAIGNS: 'the_i_company_campaigns',
  FINANCIALS: 'the_i_company_financials'
};

// Safe LocalStorage helpers
function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save to local storage: ${key}`, e);
  }
}

export const databaseService = {
  // -------------------------------------------------------------
  // Accounts & Credentials
  // -------------------------------------------------------------
  async getAccounts(): Promise<UserAccount[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('accounts').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return loadLocal(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
  },

  async saveAccount(account: UserAccount): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('accounts').upsert(account);
    }
    const current = loadLocal(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
    saveLocal(STORAGE_KEYS.ACCOUNTS, [account, ...current.filter(a => a.id !== account.id)]);
  },

  // -------------------------------------------------------------
  // Influencers / Creators
  // -------------------------------------------------------------
  async getInfluencers(): Promise<Influencer[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('influencers').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return loadLocal(STORAGE_KEYS.INFLUENCERS, INITIAL_INFLUENCERS);
  },

  async saveInfluencer(influencer: Influencer): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('influencers').upsert(influencer);
    }
    const current = loadLocal(STORAGE_KEYS.INFLUENCERS, INITIAL_INFLUENCERS);
    saveLocal(STORAGE_KEYS.INFLUENCERS, [influencer, ...current.filter(i => i.id !== influencer.id)]);
  },

  // -------------------------------------------------------------
  // Brands
  // -------------------------------------------------------------
  async getBrands(): Promise<Brand[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('brands').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return loadLocal(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
  },

  async saveBrand(brand: Brand): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('brands').upsert(brand);
    }
    const current = loadLocal(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
    saveLocal(STORAGE_KEYS.BRANDS, [brand, ...current.filter(b => b.id !== brand.id)]);
  },

  // -------------------------------------------------------------
  // Campaigns
  // -------------------------------------------------------------
  async getCampaigns(): Promise<Campaign[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('campaigns').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return loadLocal(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
  },

  async saveCampaign(campaign: Campaign): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('campaigns').upsert(campaign);
    }
    const current = loadLocal(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
    saveLocal(STORAGE_KEYS.CAMPAIGNS, [campaign, ...current.filter(c => c.id !== campaign.id)]);
  },

  // -------------------------------------------------------------
  // Financial Ledger
  // -------------------------------------------------------------
  async getFinancials(): Promise<FinancialLedger> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('financials').select('*').single();
      if (!error && data) return data;
    }
    return loadLocal(STORAGE_KEYS.FINANCIALS, INITIAL_FINANCIALS);
  },

  async saveFinancials(financials: FinancialLedger): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('financials').upsert({ id: 'primary-ledger', ...financials });
    }
    saveLocal(STORAGE_KEYS.FINANCIALS, financials);
  }
};
