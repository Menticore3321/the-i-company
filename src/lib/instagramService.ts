import { Influencer, InfluencerCategory, InfluencerTier } from '../types';

export function analyzeInstagramHandle(rawHandle: string, category: InfluencerCategory = 'Tech & AI'): Influencer {
  const cleanHandle = rawHandle.replace('@', '').trim().toLowerCase();
  
  // Seed random deterministically from handle string
  let hash = 0;
  for (let i = 0; i < cleanHandle.length; i++) {
    hash = cleanHandle.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);

  // Generate followers between 15,000 and 2,500,000 based on hash
  const followerTiers = [25000, 68000, 185000, 420000, 980000, 1650000, 3200000];
  const followers = followerTiers[absHash % followerTiers.length] + (absHash % 14500);

  let tier: InfluencerTier = 'Mid (50k-500k)';
  if (followers < 10000) tier = 'Nano (1k-10k)';
  else if (followers < 50000) tier = 'Micro (10k-50k)';
  else if (followers < 500000) tier = 'Mid (50k-500k)';
  else if (followers < 1000000) tier = 'Macro (500k-1M)';
  else tier = 'Mega (1M+)';

  const engagementRate = Number((2.8 + (absHash % 55) / 10).toFixed(1)); // 2.8% to 8.3%
  const authenticityScore = 85 + (absHash % 14); // 85% to 98%
  const avgReelViews = Math.round(followers * (0.35 + (absHash % 30) / 100));
  const avgLikes = Math.round(avgReelViews * (engagementRate / 100));
  const avgComments = Math.round(avgLikes * 0.035);

  // Pricing based on tier and engagement
  const ratePerReel = Math.round((followers * 0.08 * (engagementRate / 4)) / 1000) * 1000;
  const ratePerStory = Math.round(ratePerReel * 0.28 / 500) * 500;
  const ratePerPost = Math.round(ratePerReel * 0.72 / 1000) * 1000;

  const maleRatio = 35 + (absHash % 45);
  const femaleRatio = 100 - maleRatio;

  const weekGrowth = Number((1.2 + (absHash % 40) / 10).toFixed(1));
  const monthGrowth = Number((weekGrowth * 3.8).toFixed(1));

  const citiesList = [
    ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune'],
    ['Bengaluru', 'Hyderabad', 'Chennai', 'Mumbai'],
    ['Delhi NCR', 'Chandigarh', 'Jaipur', 'Lucknow'],
    ['Mumbai', 'Ahmedabad', 'Surat', 'Indore']
  ];
  const chosenCities = citiesList[absHash % citiesList.length];

  // AI recommendations
  const recommendations = [
    'Strong viral trajectory on short-form Reels. High comment intent for retail conversions.',
    'High organic save rate. Recommended for educational or product demonstration campaigns.',
    'Loyal regional audience concentration. Excellent for targeted geo-deliverables.',
    'Rapidly accelerating follower momentum (+14% monthly). Lock multi-deliverable rate before quote increases.'
  ];

  return {
    id: `inf-custom-${Date.now()}`,
    name: cleanHandle.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
    handle: cleanHandle,
    avatar: `https://images.unsplash.com/photo-${1500000000000 + (absHash % 500000000)}?w=400&auto=format&fit=crop&q=80`,
    bio: `Content Creator & Digital Storyteller in ${category}. Building audience in India & Global.`,
    category,
    tier,
    location: `${chosenCities[0]}, India`,
    followers,
    following: 200 + (absHash % 400),
    postsCount: 150 + (absHash % 800),
    engagementRate,
    avgReelViews,
    avgLikes,
    avgComments,
    authenticityScore,
    ratePerReel: Math.max(15000, ratePerReel),
    ratePerStory: Math.max(5000, ratePerStory),
    ratePerPost: Math.max(10000, ratePerPost),
    rating: Number((4.2 + (absHash % 8) / 10).toFixed(1)),
    performanceStatus: engagementRate > 6 ? 'stellar' : engagementRate > 4 ? 'high_growth' : 'stable',
    progressTrajectory: {
      weekGrowth,
      monthGrowth,
      consistencyScore: 88 + (absHash % 11),
      aiRecommendation: recommendations[absHash % recommendations.length]
    },
    audience: {
      gender: { male: maleRatio, female: femaleRatio },
      ageDistribution: [
        { range: '13-17', percentage: 10 + (absHash % 5) },
        { range: '18-24', percentage: 48 + (absHash % 10) },
        { range: '25-34', percentage: 30 - (absHash % 5) },
        { range: '35+', percentage: 12 }
      ],
      topCities: [
        { city: chosenCities[0], percentage: 36 },
        { city: chosenCities[1], percentage: 25 },
        { city: chosenCities[2], percentage: 18 },
        { city: chosenCities[3], percentage: 11 }
      ]
    },
    recentContent: [
      {
        id: `cnt-${Date.now()}-1`,
        type: 'Reel',
        title: `Latest insights on ${category} trends! ✨`,
        views: avgReelViews,
        likes: avgLikes,
        comments: avgComments,
        postedDaysAgo: 1,
        engagement: engagementRate,
        thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=80',
        url: `https://instagram.com/reel/${cleanHandle}-01`
      },
      {
        id: `cnt-${Date.now()}-2`,
        type: 'Carousel',
        title: `5 Key Things you need to know about this niche`,
        views: Math.round(avgReelViews * 0.7),
        likes: Math.round(avgLikes * 0.8),
        comments: Math.round(avgComments * 0.9),
        postedDaysAgo: 4,
        engagement: engagementRate - 0.4,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
        url: `https://instagram.com/p/${cleanHandle}-02`
      }
    ],
    connectedInstagram: true,
    lastSyncedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC'
  };
}

