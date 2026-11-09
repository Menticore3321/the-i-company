import { Influencer, Brand, Campaign, FinancialLedger, UserAccount } from '../types';

export const INITIAL_INFLUENCERS: Influencer[] = [
  {
    id: 'inf-1',
    name: 'Shlok Srivastava',
    handle: 'techburner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Tech simplicity & storytelling. Founder @ Layers & BurnerMedia.',
    category: 'Tech & AI',
    tier: 'Mega (1M+)',
    location: 'New Delhi, India',
    followers: 4320000,
    following: 215,
    postsCount: 1420,
    engagementRate: 6.8,
    avgReelViews: 1850000,
    avgLikes: 295000,
    avgComments: 4200,
    authenticityScore: 94,
    ratePerReel: 450000,
    ratePerStory: 120000,
    ratePerPost: 320000,
    rating: 4.9,
    performanceStatus: 'stellar',
    progressTrajectory: {
      weekGrowth: 3.8,
      monthGrowth: 14.6,
      consistencyScore: 96,
      aiRecommendation: 'Prime candidate for flagship gadget launches. High reel virality on consumer electronics.'
    },
    audience: {
      gender: { male: 78, female: 22 },
      ageDistribution: [
        { range: '13-17', percentage: 12 },
        { range: '18-24', percentage: 54 },
        { range: '25-34', percentage: 28 },
        { range: '35+', percentage: 6 }
      ],
      topCities: [
        { city: 'Mumbai', percentage: 24 },
        { city: 'Delhi NCR', percentage: 22 },
        { city: 'Bengaluru', percentage: 18 },
        { city: 'Pune', percentage: 9 }
      ]
    },
    recentContent: [
      {
        id: 'cnt-1',
        type: 'Reel',
        title: 'I tested the Transparent Phone in real life! 🤯',
        views: 2450000,
        likes: 380000,
        comments: 5400,
        postedDaysAgo: 2,
        engagement: 7.4,
        thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80',
        url: 'https://instagram.com/p/reel-01'
      },
      {
        id: 'cnt-2',
        type: 'Reel',
        title: 'AI glasses that transcribe real conversations 🕶️',
        views: 1980000,
        likes: 310000,
        comments: 4100,
        postedDaysAgo: 5,
        engagement: 6.9,
        thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop&q=80',
        url: 'https://instagram.com/p/reel-02'
      }
    ],
    connectedInstagram: true,
    lastSyncedAt: '2026-11-09 21:30 UTC'
  },
  {
    id: 'inf-2',
    name: 'Komal Pandey',
    handle: 'komalpandeyofficial',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: 'Expressive fashion filmmaker & editorial creator. 2x Cosmopolitan Awardee.',
    category: 'Fashion & Beauty',
    tier: 'Mega (1M+)',
    location: 'Mumbai, India',
    followers: 2150000,
    following: 540,
    postsCount: 2310,
    engagementRate: 5.4,
    avgReelViews: 920000,
    avgLikes: 115000,
    avgComments: 3100,
    authenticityScore: 91,
    ratePerReel: 320000,
    ratePerStory: 85000,
    ratePerPost: 240000,
    rating: 4.8,
    performanceStatus: 'high_growth',
    progressTrajectory: {
      weekGrowth: 2.4,
      monthGrowth: 9.8,
      consistencyScore: 92,
      aiRecommendation: 'Exceptional visual aesthetic. 65% female audience; best suited for luxury apparel & beauty lines.'
    },
    audience: {
      gender: { male: 26, female: 74 },
      ageDistribution: [
        { range: '18-24', percentage: 48 },
        { range: '25-34', percentage: 38 },
        { range: '35-44', percentage: 10 },
        { range: '45+', percentage: 4 }
      ],
      topCities: [
        { city: 'Mumbai', percentage: 32 },
        { city: 'Delhi NCR', percentage: 26 },
        { city: 'Bengaluru', percentage: 14 },
        { city: 'Jaipur', percentage: 8 }
      ]
    },
    recentContent: [
      {
        id: 'cnt-3',
        type: 'Reel',
        title: '7 Ways to drape festive silk with modern corsets ✨',
        views: 1120000,
        likes: 142000,
        comments: 3800,
        postedDaysAgo: 1,
        engagement: 6.2,
        thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80',
        url: 'https://instagram.com/p/reel-03'
      }
    ],
    connectedInstagram: true,
    lastSyncedAt: '2026-11-09 20:15 UTC'
  },
  {
    id: 'inf-3',
    name: 'Ranveer Allahbadia',
    handle: 'ranveerallahbadia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Host @ The Ranveer Show. Co-founder @ Monk-E & BigBrainco.',
    category: 'Lifestyle & Entertainment',
    tier: 'Mega (1M+)',
    location: 'Mumbai, India',
    followers: 3840000,
    following: 412,
    postsCount: 3100,
    engagementRate: 4.9,
    avgReelViews: 1450000,
    avgLikes: 185000,
    avgComments: 2800,
    authenticityScore: 89,
    ratePerReel: 400000,
    ratePerStory: 110000,
    ratePerPost: 280000,
    rating: 4.7,
    performanceStatus: 'stable',
    progressTrajectory: {
      weekGrowth: 1.8,
      monthGrowth: 7.2,
      consistencyScore: 94,
      aiRecommendation: 'High credibility with Tier 1 & Tier 2 audiences. Top fit for wellness, leadership & fintech.'
    },
    audience: {
      gender: { male: 68, female: 32 },
      ageDistribution: [
        { range: '18-24', percentage: 42 },
        { range: '25-34', percentage: 44 },
        { range: '35+', percentage: 14 }
      ],
      topCities: [
        { city: 'Mumbai', percentage: 28 },
        { city: 'Delhi', percentage: 21 },
        { city: 'Ahmedabad', percentage: 12 },
        { city: 'Pune', percentage: 10 }
      ]
    },
    recentContent: [
      {
        id: 'cnt-4',
        type: 'Reel',
        title: 'The discipline routine of Olympic athletes 🧘‍♂️',
        views: 1650000,
        likes: 210000,
        comments: 3200,
        postedDaysAgo: 3,
        engagement: 5.2,
        thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
        url: 'https://instagram.com/p/reel-04'
      }
    ],
    connectedInstagram: true,
    lastSyncedAt: '2026-11-09 19:40 UTC'
  },
  {
    id: 'inf-4',
    name: 'Ankur Warikoo',
    handle: 'ankurwarikoo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: 'Author & Entrepreneur. Helping 10M+ people make smarter life and money decisions.',
    category: 'Finance & Crypto',
    tier: 'Mega (1M+)',
    location: 'Gurugram, India',
    followers: 2420000,
    following: 112,
    postsCount: 1890,
    engagementRate: 4.2,
    avgReelViews: 840000,
    avgLikes: 98000,
    avgComments: 1950,
    authenticityScore: 95,
    ratePerReel: 300000,
    ratePerStory: 75000,
    ratePerPost: 220000,
    rating: 4.9,
    performanceStatus: 'stellar',
    progressTrajectory: {
      weekGrowth: 2.9,
      monthGrowth: 11.4,
      consistencyScore: 98,
      aiRecommendation: 'Exceptional trust index. Audience consists of working professionals and aspirational investors.'
    },
    audience: {
      gender: { male: 72, female: 28 },
      ageDistribution: [
        { range: '18-24', percentage: 35 },
        { range: '25-34', percentage: 52 },
        { range: '35+', percentage: 13 }
      ],
      topCities: [
        { city: 'Bengaluru', percentage: 30 },
        { city: 'Delhi NCR', percentage: 25 },
        { city: 'Mumbai', percentage: 22 },
        { city: 'Hyderabad', percentage: 12 }
      ]
    },
    recentContent: [
      {
        id: 'cnt-5',
        type: 'Reel',
        title: '3 Money habits that will make your 30s 10x richer 💰',
        views: 1250000,
        likes: 135000,
        comments: 2400,
        postedDaysAgo: 4,
        engagement: 4.8,
        thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80',
        url: 'https://instagram.com/p/reel-05'
      }
    ],
    connectedInstagram: true,
    lastSyncedAt: '2026-11-09 21:00 UTC'
  },
  {
    id: 'inf-5',
    name: 'Natasha Noel',
    handle: 'natashanoel001',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    bio: 'Yogini, mental health activist, and movement teacher. Breathe & Move.',
    category: 'Fitness & Health',
    tier: 'Mid (50k-500k)',
    location: 'Goa, India',
    followers: 410000,
    following: 380,
    postsCount: 1640,
    engagementRate: 7.2,
    avgReelViews: 240000,
    avgLikes: 28500,
    avgComments: 890,
    authenticityScore: 97,
    ratePerReel: 85000,
    ratePerStory: 25000,
    ratePerPost: 60000,
    rating: 4.9,
    performanceStatus: 'stellar',
    progressTrajectory: {
      weekGrowth: 4.2,
      monthGrowth: 18.2,
      consistencyScore: 97,
      aiRecommendation: 'High community trust with deep comment engagement. Top conversion rate for organic health brands.'
    },
    audience: {
      gender: { male: 30, female: 70 },
      ageDistribution: [
        { range: '18-24', percentage: 38 },
        { range: '25-34', percentage: 48 },
        { range: '35+', percentage: 14 }
      ],
      topCities: [
        { city: 'Mumbai', percentage: 34 },
        { city: 'Bengaluru', percentage: 22 },
        { city: 'Delhi', percentage: 18 },
        { city: 'Goa', percentage: 12 }
      ]
    },
    recentContent: [
      {
        id: 'cnt-6',
        type: 'Reel',
        title: 'Morning spinal decompression in 5 minutes 🧘‍♀️',
        views: 310000,
        likes: 38000,
        comments: 1100,
        postedDaysAgo: 1,
        engagement: 8.1,
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80',
        url: 'https://instagram.com/p/reel-06'
      }
    ],
    connectedInstagram: true,
    lastSyncedAt: '2026-11-09 21:10 UTC'
  },
  {
    id: 'inf-6',
    name: 'Tanmay Bhat',
    handle: 'tanmaybhat',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    bio: 'Humor, vlogs, reactions and finance meme lord. Also angel investor.',
    category: 'Gaming & Esports',
    tier: 'Mega (1M+)',
    location: 'Mumbai, India',
    followers: 1890000,
    following: 490,
    postsCount: 1280,
    engagementRate: 6.1,
    avgReelViews: 1150000,
    avgLikes: 118000,
    avgComments: 3400,
    authenticityScore: 92,
    ratePerReel: 350000,
    ratePerStory: 90000,
    ratePerPost: 260000,
    rating: 4.8,
    performanceStatus: 'high_growth',
    progressTrajectory: {
      weekGrowth: 3.1,
      monthGrowth: 12.8,
      consistencyScore: 91,
      aiRecommendation: 'Ultra-high organic sharing and group forwarding. Exceptional for Gen-Z & millennial brand awareness.'
    },
    audience: {
      gender: { male: 82, female: 18 },
      ageDistribution: [
        { range: '18-24', percentage: 58 },
        { range: '25-34', percentage: 34 },
        { range: '35+', percentage: 8 }
      ],
      topCities: [
        { city: 'Mumbai', percentage: 30 },
        { city: 'Delhi NCR', percentage: 24 },
        { city: 'Bengaluru', percentage: 20 },
        { city: 'Kolkata', percentage: 8 }
      ]
    },
    recentContent: [
      {
        id: 'cnt-7',
        type: 'Reel',
        title: 'Reviewing crazy startup pitches with friends 😂',
        views: 1480000,
        likes: 165000,
        comments: 4200,
        postedDaysAgo: 3,
        engagement: 6.8,
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
        url: 'https://instagram.com/p/reel-07'
      }
    ],
    connectedInstagram: true,
    lastSyncedAt: '2026-11-09 21:20 UTC'
  },
  {
    id: 'inf-7',
    name: 'Rohan Mehra',
    handle: 'rohan.techcraft',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    bio: 'Coding setups, desk ergonomics and AI developer workflows. Bangalore engineer.',
    category: 'Tech & AI',
    tier: 'Micro (10k-50k)',
    location: 'Bengaluru, India',
    followers: 38400,
    following: 310,
    postsCount: 290,
    engagementRate: 8.9,
    avgReelViews: 65000,
    avgLikes: 3400,
    avgComments: 190,
    authenticityScore: 98,
    ratePerReel: 22000,
    ratePerStory: 6000,
    ratePerPost: 15000,
    rating: 4.9,
    performanceStatus: 'stellar',
    progressTrajectory: {
      weekGrowth: 5.6,
      monthGrowth: 24.1,
      consistencyScore: 99,
      aiRecommendation: 'Rising micro star! 8.9% engagement is 3x industry average for tech creators. Highly cost effective.'
    },
    audience: {
      gender: { male: 85, female: 15 },
      ageDistribution: [
        { range: '18-24', percentage: 55 },
        { range: '25-34', percentage: 40 },
        { range: '35+', percentage: 5 }
      ],
      topCities: [
        { city: 'Bengaluru', percentage: 44 },
        { city: 'Hyderabad', percentage: 22 },
        { city: 'Pune', percentage: 16 },
        { city: 'Chennai', percentage: 10 }
      ]
    },
    recentContent: [
      {
        id: 'cnt-8',
        type: 'Reel',
        title: 'Minimalist desk cable management in under ₹500 ⚡',
        views: 89000,
        likes: 5400,
        comments: 280,
        postedDaysAgo: 2,
        engagement: 9.4,
        thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80',
        url: 'https://instagram.com/p/reel-08'
      }
    ],
    connectedInstagram: true,
    lastSyncedAt: '2026-11-09 18:30 UTC'
  },
  {
    id: 'inf-8',
    name: 'Aanya Sharma',
    handle: 'aanyastyles',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    bio: 'College fashion, thrift hauls & sustainable wardrobe styling. DU grad.',
    category: 'Fashion & Beauty',
    tier: 'Mid (50k-500k)',
    location: 'Delhi, India',
    followers: 185000,
    following: 420,
    postsCount: 680,
    engagementRate: 3.2,
    avgReelViews: 45000,
    avgLikes: 5800,
    avgComments: 140,
    authenticityScore: 82,
    ratePerReel: 40000,
    ratePerStory: 12000,
    ratePerPost: 28000,
    rating: 3.8,
    performanceStatus: 'boost_needed',
    progressTrajectory: {
      weekGrowth: -0.4,
      monthGrowth: 1.2,
      consistencyScore: 68,
      aiRecommendation: 'Engagement has dipped 18% this month. Needs hook optimization on first 3 seconds of Reels.'
    },
    audience: {
      gender: { male: 18, female: 82 },
      ageDistribution: [
        { range: '18-24', percentage: 65 },
        { range: '25-34', percentage: 28 },
        { range: '35+', percentage: 7 }
      ],
      topCities: [
        { city: 'Delhi NCR', percentage: 48 },
        { city: 'Chandigarh', percentage: 20 },
        { city: 'Jaipur', percentage: 14 },
        { city: 'Lucknow', percentage: 10 }
      ]
    },
    recentContent: [
      {
        id: 'cnt-9',
        type: 'Reel',
        title: 'Sarojini Nagar winter thrift haul under ₹2000 🧥',
        views: 48000,
        likes: 6100,
        comments: 160,
        postedDaysAgo: 6,
        engagement: 3.4,
        thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80',
        url: 'https://instagram.com/p/reel-09'
      }
    ],
    connectedInstagram: true,
    lastSyncedAt: '2026-11-09 17:00 UTC'
  }
];

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'br-1',
    name: 'Nothing India',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    industry: 'Consumer Tech',
    contactEmail: 'partnerships.in@nothing.tech',
    activeCampaignsCount: 2,
    totalSpent: 1850000,
    escrowBalance: 650000
  },
  {
    id: 'br-2',
    name: 'Boat Lifestyle',
    logo: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop&q=80',
    industry: 'Audio & Wearables',
    contactEmail: 'creator.collabs@boat-lifestyle.com',
    activeCampaignsCount: 3,
    totalSpent: 3400000,
    escrowBalance: 980000
  },
  {
    id: 'br-3',
    name: 'CRED',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80',
    industry: 'Fintech & Lifestyle',
    contactEmail: 'growth@cred.club',
    activeCampaignsCount: 1,
    totalSpent: 4200000,
    escrowBalance: 1200000
  },
  {
    id: 'br-4',
    name: 'Mamaearth',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80',
    industry: 'Personal Care & Beauty',
    contactEmail: 'influencers@mamaearth.in',
    activeCampaignsCount: 2,
    totalSpent: 2100000,
    escrowBalance: 450000
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-101',
    name: 'Phone (3) India Launch Blitz',
    brandId: 'br-1',
    brandName: 'Nothing India',
    niche: 'Tech & AI',
    totalBudget: 850000,
    spentBudget: 620000,
    agencyMarginRate: 0.20,
    status: 'live',
    startDate: '2026-11-01',
    endDate: '2026-11-20',
    targetDeliverables: {
      reels: 3,
      stories: 6,
      carousels: 2
    },
    assignedInfluencers: ['inf-1', 'inf-7'],
    deliverables: [
      {
        id: 'del-1',
        influencerId: 'inf-1',
        influencerHandle: 'techburner',
        influencerName: 'Shlok Srivastava',
        type: 'Reel',
        status: 'live',
        submittedUrl: 'https://instagram.com/reel/nothing-phone-3-unboxing',
        dueDate: '2026-11-04',
        agreedPayout: 450000,
        liveViews: 2450000,
        liveLikes: 380000
      },
      {
        id: 'del-2',
        influencerId: 'inf-7',
        influencerHandle: 'rohan.techcraft',
        influencerName: 'Rohan Mehra',
        type: 'Reel',
        status: 'approved',
        submittedUrl: 'https://instagram.com/reel/nothing-glyph-desk-setup',
        dueDate: '2026-11-12',
        agreedPayout: 22000,
        liveViews: 0,
        liveLikes: 0
      },
      {
        id: 'del-3',
        influencerId: 'inf-1',
        influencerHandle: 'techburner',
        influencerName: 'Shlok Srivastava',
        type: 'Story',
        status: 'pending',
        dueDate: '2026-11-15',
        agreedPayout: 120000
      }
    ],
    projectedMetrics: {
      impressions: 4800000,
      reach: 3900000,
      estimatedClicks: 82000,
      estimatedCPE: 0.18
    }
  },
  {
    id: 'cmp-102',
    name: 'Airdopes Pro Max Wireless Fest',
    brandId: 'br-2',
    brandName: 'Boat Lifestyle',
    niche: 'Gaming & Esports',
    totalBudget: 500000,
    spentBudget: 350000,
    agencyMarginRate: 0.20,
    status: 'production',
    startDate: '2026-11-05',
    endDate: '2026-11-25',
    targetDeliverables: {
      reels: 2,
      stories: 4,
      carousels: 1
    },
    assignedInfluencers: ['inf-6'],
    deliverables: [
      {
        id: 'del-4',
        influencerId: 'inf-6',
        influencerHandle: 'tanmaybhat',
        influencerName: 'Tanmay Bhat',
        type: 'Reel',
        status: 'draft_submitted',
        submittedUrl: 'https://instagram.com/draft/boat-airdopes-comedy',
        dueDate: '2026-11-14',
        agreedPayout: 350000
      }
    ],
    projectedMetrics: {
      impressions: 2200000,
      reach: 1800000,
      estimatedClicks: 45000,
      estimatedCPE: 0.22
    }
  },
  {
    id: 'cmp-103',
    name: 'Festive Glow Up 2026',
    brandId: 'br-4',
    brandName: 'Mamaearth',
    niche: 'Fashion & Beauty',
    totalBudget: 450000,
    spentBudget: 405000,
    agencyMarginRate: 0.20,
    status: 'review',
    startDate: '2026-10-25',
    endDate: '2026-11-15',
    targetDeliverables: {
      reels: 2,
      stories: 3,
      carousels: 1
    },
    assignedInfluencers: ['inf-2', 'inf-8'],
    deliverables: [
      {
        id: 'del-5',
        influencerId: 'inf-2',
        influencerHandle: 'komalpandeyofficial',
        influencerName: 'Komal Pandey',
        type: 'Reel',
        status: 'live',
        submittedUrl: 'https://instagram.com/reel/mamaearth-glow-serum',
        dueDate: '2026-11-02',
        agreedPayout: 320000,
        liveViews: 1120000,
        liveLikes: 142000
      },
      {
        id: 'del-6',
        influencerId: 'inf-8',
        influencerHandle: 'aanyastyles',
        influencerName: 'Aanya Sharma',
        type: 'Reel',
        status: 'draft_submitted',
        dueDate: '2026-11-10',
        agreedPayout: 40000
      }
    ],
    projectedMetrics: {
      impressions: 1900000,
      reach: 1550000,
      estimatedClicks: 38000,
      estimatedCPE: 0.24
    }
  }
];

export const INITIAL_FINANCIALS: FinancialLedger = {
  totalGMV: 11550000,
  agencyRevenue: 2310000, // 20%
  creatorsPaid: 7850000,
  escrowHeld: 1390000,
  activeDealsCount: 8,
  recentTransactions: [
    {
      id: 'tx-801',
      timestamp: '2026-11-09 18:22 IST',
      type: 'brand_deposit',
      partyName: 'Nothing India',
      campaignName: 'Phone (3) India Launch Blitz',
      amount: 850000,
      status: 'settled'
    },
    {
      id: 'tx-802',
      timestamp: '2026-11-08 14:10 IST',
      type: 'creator_payout',
      partyName: 'Shlok Srivastava (@techburner)',
      campaignName: 'Phone (3) India Launch Blitz',
      amount: 450000,
      status: 'settled'
    },
    {
      id: 'tx-803',
      timestamp: '2026-11-08 14:10 IST',
      type: 'agency_margin',
      partyName: 'The I company Escrow Yield',
      campaignName: 'Phone (3) India Launch Blitz',
      amount: 170000,
      status: 'settled'
    },
    {
      id: 'tx-804',
      timestamp: '2026-11-07 11:45 IST',
      type: 'brand_deposit',
      partyName: 'Boat Lifestyle',
      campaignName: 'Airdopes Pro Max Wireless Fest',
      amount: 500000,
      status: 'escrow_hold'
    },
    {
      id: 'tx-805',
      timestamp: '2026-11-06 16:30 IST',
      type: 'creator_payout',
      partyName: 'Komal Pandey (@komalpandeyofficial)',
      campaignName: 'Festive Glow Up 2026',
      amount: 320000,
      status: 'settled'
    }
  ]
};

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'acc-admin',
    email: 'admin@theicompany.com',
    password: 'admin123',
    role: 'agency',
    name: 'Executive Director (Super Admin)',
    status: 'active',
    lastLogin: '2026-11-09 23:45 IST'
  },
  {
    id: 'acc-br-1',
    email: 'nothing@brands.theicompany.com',
    password: 'nothing123',
    role: 'brand',
    name: 'Nothing India',
    associatedId: 'br-1',
    status: 'active',
    lastLogin: '2026-11-09 19:20 IST'
  },
  {
    id: 'acc-br-2',
    email: 'boat@brands.theicompany.com',
    password: 'boat123',
    role: 'brand',
    name: 'Boat Lifestyle',
    associatedId: 'br-2',
    status: 'active',
    lastLogin: '2026-11-08 14:15 IST'
  },
  {
    id: 'acc-br-3',
    email: 'cred@brands.theicompany.com',
    password: 'cred123',
    role: 'brand',
    name: 'CRED Club',
    associatedId: 'br-3',
    status: 'active',
    lastLogin: '2026-11-07 11:30 IST'
  },
  {
    id: 'acc-br-4',
    email: 'mamaearth@brands.theicompany.com',
    password: 'mama123',
    role: 'brand',
    name: 'Mamaearth',
    associatedId: 'br-4',
    status: 'active',
    lastLogin: '2026-11-06 17:45 IST'
  },
  {
    id: 'acc-inf-1',
    email: 'techburner@creators.theicompany.com',
    password: 'tech123',
    role: 'influencer',
    name: 'Shlok Srivastava (@techburner)',
    associatedId: 'inf-1',
    status: 'active',
    lastLogin: '2026-11-09 21:10 IST'
  },
  {
    id: 'acc-inf-2',
    email: 'komal@creators.theicompany.com',
    password: 'komal123',
    role: 'influencer',
    name: 'Komal Pandey (@komalpandeyofficial)',
    associatedId: 'inf-2',
    status: 'active',
    lastLogin: '2026-11-08 18:40 IST'
  },
  {
    id: 'acc-inf-3',
    email: 'ranveer@creators.theicompany.com',
    password: 'ranveer123',
    role: 'influencer',
    name: 'Ranveer Allahbadia (@ranveerallahbadia)',
    associatedId: 'inf-3',
    status: 'active',
    lastLogin: '2026-11-07 10:15 IST'
  },
  {
    id: 'acc-inf-4',
    email: 'warikoo@creators.theicompany.com',
    password: 'warikoo123',
    role: 'influencer',
    name: 'Ankur Warikoo (@ankurwarikoo)',
    associatedId: 'inf-4',
    status: 'active',
    lastLogin: '2026-11-05 15:20 IST'
  }
];

