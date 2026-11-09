import { supabase, isSupabaseConfigured } from './supabase';
import { Influencer, Brand, Campaign, FinancialLedger, UserAccount } from '../types';
import { 
  INITIAL_INFLUENCERS, 
  INITIAL_BRANDS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_FINANCIALS, 
  INITIAL_ACCOUNTS 
} from './mockData';

// Top-level Case Converters for PostgreSQL compatibility
function toSnakeCase<T extends Record<string, any>>(obj: T): any {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  return Object.keys(obj).reduce((acc, key) => {
    // Only convert top-level keys to snake_case so nested JSON objects remain intact
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = obj[key];
    return acc;
  }, {} as any);
}

function toCamelCase<T>(obj: any): T {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = obj[key];
    return acc;
  }, {} as any);
}

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
      try {
        const { data, error } = await supabase.from('accounts').select('*');
        if (!error && data && data.length > 0) {
          return data.map(row => toCamelCase<UserAccount>(row));
        }
        if (!error && data && data.length === 0) {
          // Auto-seed initial accounts to Supabase
          const rows = INITIAL_ACCOUNTS.map(toSnakeCase);
          await supabase.from('accounts').upsert(rows);
          return INITIAL_ACCOUNTS;
        }
      } catch (err) {
        console.warn('Supabase getAccounts error:', err);
      }
    }
    return loadLocal(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
  },

  async saveAccount(account: UserAccount): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('accounts').upsert(toSnakeCase(account));
      } catch (err) {
        console.warn('Supabase saveAccount error:', err);
      }
    }
    const current = loadLocal(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
    saveLocal(STORAGE_KEYS.ACCOUNTS, [account, ...current.filter(a => a.id !== account.id)]);
  },

  // -------------------------------------------------------------
  // Influencers / Creators
  // -------------------------------------------------------------
  async getInfluencers(): Promise<Influencer[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('influencers').select('*');
        if (!error && data && data.length > 0) {
          return data.map(row => toCamelCase<Influencer>(row));
        }
        if (!error && data && data.length === 0) {
          // Auto-seed initial creators to Supabase
          const rows = INITIAL_INFLUENCERS.map(toSnakeCase);
          await supabase.from('influencers').upsert(rows);
          return INITIAL_INFLUENCERS;
        }
      } catch (err) {
        console.warn('Supabase getInfluencers error:', err);
      }
    }
    return loadLocal(STORAGE_KEYS.INFLUENCERS, INITIAL_INFLUENCERS);
  },

  async saveInfluencer(influencer: Influencer): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('influencers').upsert(toSnakeCase(influencer));
      } catch (err) {
        console.warn('Supabase saveInfluencer error:', err);
      }
    }
    const current = loadLocal(STORAGE_KEYS.INFLUENCERS, INITIAL_INFLUENCERS);
    saveLocal(STORAGE_KEYS.INFLUENCERS, [influencer, ...current.filter(i => i.id !== influencer.id)]);
  },

  // -------------------------------------------------------------
  // Brands
  // -------------------------------------------------------------
  async getBrands(): Promise<Brand[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('brands').select('*');
        if (!error && data && data.length > 0) {
          return data.map(row => toCamelCase<Brand>(row));
        }
        if (!error && data && data.length === 0) {
          // Auto-seed initial brands to Supabase
          const rows = INITIAL_BRANDS.map(toSnakeCase);
          await supabase.from('brands').upsert(rows);
          return INITIAL_BRANDS;
        }
      } catch (err) {
        console.warn('Supabase getBrands error:', err);
      }
    }
    return loadLocal(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
  },

  async saveBrand(brand: Brand): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('brands').upsert(toSnakeCase(brand));
      } catch (err) {
        console.warn('Supabase saveBrand error:', err);
      }
    }
    const current = loadLocal(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
    saveLocal(STORAGE_KEYS.BRANDS, [brand, ...current.filter(b => b.id !== brand.id)]);
  },

  // -------------------------------------------------------------
  // Campaigns
  // -------------------------------------------------------------
  async getCampaigns(): Promise<Campaign[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('campaigns').select('*');
        if (!error && data && data.length > 0) {
          return data.map(row => toCamelCase<Campaign>(row));
        }
        if (!error && data && data.length === 0) {
          // Auto-seed initial campaigns to Supabase
          const rows = INITIAL_CAMPAIGNS.map(toSnakeCase);
          await supabase.from('campaigns').upsert(rows);
          return INITIAL_CAMPAIGNS;
        }
      } catch (err) {
        console.warn('Supabase getCampaigns error:', err);
      }
    }
    return loadLocal(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
  },

  async saveCampaign(campaign: Campaign): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('campaigns').upsert(toSnakeCase(campaign));
      } catch (err) {
        console.warn('Supabase saveCampaign error:', err);
      }
    }
    const current = loadLocal(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
    saveLocal(STORAGE_KEYS.CAMPAIGNS, [campaign, ...current.filter(c => c.id !== campaign.id)]);
  },

  // -------------------------------------------------------------
  // Financial Ledger
  // -------------------------------------------------------------
  async getFinancials(): Promise<FinancialLedger> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('financials').select('*').single();
        if (!error && data) {
          return toCamelCase<FinancialLedger>(data);
        }
        if (!error && !data) {
          await supabase.from('financials').upsert(toSnakeCase({ id: 'primary-ledger', ...INITIAL_FINANCIALS }));
          return INITIAL_FINANCIALS;
        }
      } catch (err) {
        console.warn('Supabase getFinancials error:', err);
      }
    }
    return loadLocal(STORAGE_KEYS.FINANCIALS, INITIAL_FINANCIALS);
  },

  async saveFinancials(financials: FinancialLedger): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('financials').upsert(toSnakeCase({ id: 'primary-ledger', ...financials }));
      } catch (err) {
        console.warn('Supabase saveFinancials error:', err);
      }
    }
    saveLocal(STORAGE_KEYS.FINANCIALS, financials);
  }
};
