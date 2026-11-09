export type UserRole = 'agency' | 'brand' | 'influencer';

export type InfluencerTier = 'Nano (1k-10k)' | 'Micro (10k-50k)' | 'Mid (50k-500k)' | 'Macro (500k-1M)' | 'Mega (1M+)';

export type InfluencerCategory = 
  | 'Tech & AI'
  | 'Fashion & Beauty'
  | 'Fitness & Health'
  | 'Finance & Crypto'
  | 'Gaming & Esports'
  | 'Food & Travel'
  | 'Lifestyle & Entertainment';

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  category: InfluencerCategory;
  tier: InfluencerTier;
  location: string;
  followers: number;
  following: number;
  postsCount: number;
  engagementRate: number; // e.g. 4.8%
  avgReelViews: number;
  avgLikes: number;
  avgComments: number;
  authenticityScore: number; // 0 - 100%
  ratePerReel: number; // in INR
  ratePerStory: number;
  ratePerPost: number;
  rating: number; // 1 to 5 stars
  performanceStatus: 'stellar' | 'high_growth' | 'stable' | 'boost_needed';
  progressTrajectory: {
    weekGrowth: number; // e.g. +3.4%
    monthGrowth: number; // e.g. +14.2%
    consistencyScore: number; // 0-100
    aiRecommendation: string;
  };
  audience: {
    gender: { male: number; female: number };
    ageDistribution: { range: string; percentage: number }[];
    topCities: { city: string; percentage: number }[];
  };
  recentContent: {
    id: string;
    type: 'Reel' | 'Carousel' | 'Post';
    title: string;
    views: number;
    likes: number;
    comments: number;
    postedDaysAgo: number;
    engagement: number;
    thumbnail: string;
    url: string;
  }[];
  connectedInstagram: boolean;
  lastSyncedAt: string;
  loginEmail?: string;
  loginPassword?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  industry: string;
  contactEmail: string;
  activeCampaignsCount: number;
  totalSpent: number;
  escrowBalance: number;
  loginEmail?: string;
  loginPassword?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  associatedId?: string; // brandId or influencerId
  avatar?: string;
  status: 'active' | 'suspended';
  lastLogin?: string;
}

export interface CampaignDeliverable {
  id: string;
  influencerId: string;
  influencerHandle: string;
  influencerName: string;
  type: 'Reel' | 'Story' | 'Carousel';
  status: 'pending' | 'draft_submitted' | 'approved' | 'live';
  submittedUrl?: string;
  dueDate: string;
  agreedPayout: number;
  liveViews?: number;
  liveLikes?: number;
}

export interface Campaign {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  niche: InfluencerCategory;
  totalBudget: number; // in INR
  spentBudget: number;
  agencyMarginRate: number; // e.g. 0.20 (20%)
  status: 'draft' | 'brief_signed' | 'production' | 'review' | 'live' | 'completed';
  startDate: string;
  endDate: string;
  targetDeliverables: {
    reels: number;
    stories: number;
    carousels: number;
  };
  assignedInfluencers: string[]; // influencer IDs
  deliverables: CampaignDeliverable[];
  projectedMetrics: {
    impressions: number;
    reach: number;
    estimatedClicks: number;
    estimatedCPE: number; // Cost Per Engagement
  };
}

export interface FinancialLedger {
  totalGMV: number;
  agencyRevenue: number;
  creatorsPaid: number;
  escrowHeld: number;
  activeDealsCount: number;
  recentTransactions: {
    id: string;
    timestamp: string;
    type: 'brand_deposit' | 'creator_payout' | 'agency_margin';
    partyName: string;
    campaignName: string;
    amount: number;
    status: 'settled' | 'escrow_hold' | 'pending';
  }[];
}

