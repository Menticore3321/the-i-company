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

// Strict Whitelist of valid Supabase PostgreSQL table columns to avoid PostgREST PGRST204 schema errors
const VALID_INFLUENCER_COLUMNS = new Set([
  'id', 'name', 'handle', 'avatar', 'bio', 'category', 'tier', 'location',
  'followers', 'following', 'posts_count', 'engagement_rate', 'avg_reel_views',
  'avg_likes', 'avg_comments', 'authenticity_score', 'rate_per_reel',
  'rate_per_story', 'rate_per_post', 'rating', 'performance_status',
  'progress_trajectory', 'audience', 'recent_content', 'connected_instagram',
  'last_synced_at', 'login_email', 'login_password'
]);

const VALID_ACCOUNT_COLUMNS = new Set([
  'id', 'email', 'password', 'role', 'name', 'associated_id', 'avatar', 'status', 'last_login'
]);

function sanitizeRecord(obj: Record<string, any>, allowedSnakeColumns: Set<string>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    if (allowedSnakeColumns.has(snakeKey)) {
      result[snakeKey] = obj[key];
    }
  }
  return result;
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
    const local = loadLocal<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('accounts').select('*');
        if (!error && data && data.length > 0) {
          const cloudAccounts = data.map(row => toCamelCase<UserAccount>(row));
          // Merge cloud with local accounts by email so no account ever gets lost
          const accountMap = new Map<string, UserAccount>();
          cloudAccounts.forEach(acc => accountMap.set(acc.email.toLowerCase(), acc));
          local.forEach(acc => {
            if (!accountMap.has(acc.email.toLowerCase())) {
              accountMap.set(acc.email.toLowerCase(), acc);
            }
          });
          const merged = Array.from(accountMap.values());
          saveLocal(STORAGE_KEYS.ACCOUNTS, merged);
          return merged;
        }
        if (!error && data && data.length === 0) {
          // Auto-seed initial accounts to Supabase
          const rows = INITIAL_ACCOUNTS.map(a => sanitizeRecord(a, VALID_ACCOUNT_COLUMNS));
          await supabase.from('accounts').upsert(rows);
          return INITIAL_ACCOUNTS;
        }
      } catch (err) {
        console.warn('Supabase getAccounts error:', err);
      }
    }
    return local;
  },

  async saveAccount(account: UserAccount): Promise<void> {
    const current = loadLocal<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
    const updated = [account, ...current.filter(a => a.id !== account.id && a.email.toLowerCase() !== account.email.toLowerCase())];
    saveLocal(STORAGE_KEYS.ACCOUNTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const sanitized = sanitizeRecord(account, VALID_ACCOUNT_COLUMNS);
        const { error } = await supabase.from('accounts').upsert(sanitized, { onConflict: 'email' });
        if (error) console.warn('Supabase saveAccount error:', error);
      } catch (err) {
        console.warn('Supabase saveAccount network exception:', err);
      }
    }
  },

  // -------------------------------------------------------------
  // Influencers / Creators
  // -------------------------------------------------------------
  async getInfluencers(): Promise<Influencer[]> {
    const local = loadLocal<Influencer[]>(STORAGE_KEYS.INFLUENCERS, INITIAL_INFLUENCERS);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('influencers').select('*');
        if (!error && data && data.length > 0) {
          const cloudInfluencers = data.map(row => toCamelCase<Influencer>(row));
          // Merge cloud with local storage by handle so onboarded creators NEVER disappear
          const infMap = new Map<string, Influencer>();
          cloudInfluencers.forEach(inf => infMap.set(inf.handle.toLowerCase().replace('@', ''), inf));
          local.forEach(inf => {
            const clean = inf.handle.toLowerCase().replace('@', '');
            if (!infMap.has(clean)) {
              infMap.set(clean, inf);
            }
          });
          const merged = Array.from(infMap.values());
          saveLocal(STORAGE_KEYS.INFLUENCERS, merged);
          return merged;
        }
        if (!error && data && data.length === 0) {
          // Auto-seed initial creators to Supabase
          const rows = INITIAL_INFLUENCERS.map(i => sanitizeRecord(i, VALID_INFLUENCER_COLUMNS));
          await supabase.from('influencers').upsert(rows);
          return INITIAL_INFLUENCERS;
        }
      } catch (err) {
        console.warn('Supabase getInfluencers error:', err);
      }
    }
    return local;
  },

  async saveInfluencer(influencer: Influencer): Promise<void> {
    const current = loadLocal<Influencer[]>(STORAGE_KEYS.INFLUENCERS, INITIAL_INFLUENCERS);
    const cleanHandle = influencer.handle.toLowerCase().replace('@', '');
    const updated = [influencer, ...current.filter(i => i.id !== influencer.id && i.handle.toLowerCase().replace('@', '') !== cleanHandle)];
    saveLocal(STORAGE_KEYS.INFLUENCERS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const sanitized = sanitizeRecord(influencer, VALID_INFLUENCER_COLUMNS);
        const { error } = await supabase.from('influencers').upsert(sanitized, { onConflict: 'handle' });
        if (error) console.warn('Supabase saveInfluencer error:', error);
      } catch (err) {
        console.warn('Supabase saveInfluencer network exception:', err);
      }
    }
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
  },

  // -------------------------------------------------------------
  // Deletion Operations (Admin Level Removal)
  // -------------------------------------------------------------
  async deleteInfluencer(id: string): Promise<void> {
    const current = loadLocal<Influencer[]>(STORAGE_KEYS.INFLUENCERS, INITIAL_INFLUENCERS);
    saveLocal(STORAGE_KEYS.INFLUENCERS, current.filter(i => i.id !== id));

    const currentAccounts = loadLocal<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
    saveLocal(STORAGE_KEYS.ACCOUNTS, currentAccounts.filter(a => a.associatedId !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('influencers').delete().eq('id', id);
        await supabase.from('accounts').delete().eq('associated_id', id);
      } catch (err) {
        console.warn('Supabase deleteInfluencer error:', err);
      }
    }
  },

  async deleteBrand(id: string): Promise<void> {
    const current = loadLocal<Brand[]>(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
    saveLocal(STORAGE_KEYS.BRANDS, current.filter(b => b.id !== id));

    const currentAccounts = loadLocal<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
    saveLocal(STORAGE_KEYS.ACCOUNTS, currentAccounts.filter(a => a.associatedId !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('brands').delete().eq('id', id);
        await supabase.from('accounts').delete().eq('associated_id', id);
      } catch (err) {
        console.warn('Supabase deleteBrand error:', err);
      }
    }
  },

  async deleteCampaign(id: string): Promise<void> {
    const current = loadLocal<Campaign[]>(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
    saveLocal(STORAGE_KEYS.CAMPAIGNS, current.filter(c => c.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('campaigns').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteCampaign error:', err);
      }
    }
  },

  async deleteAccount(id: string): Promise<void> {
    const current = loadLocal<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
    saveLocal(STORAGE_KEYS.ACCOUNTS, current.filter(a => a.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('accounts').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteAccount error:', err);
      }
    }
  }
};
