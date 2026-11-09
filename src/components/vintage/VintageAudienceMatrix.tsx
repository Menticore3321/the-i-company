import React, { useState } from 'react';
import { VintageCard } from './VintageCard';
import { MapPin, Users, TrendingUp, Compass, Globe } from 'lucide-react';

interface GeoNode {
  id: string;
  city: string;
  region: string;
  reach: string;
  creators: number;
  dominantNiche: string;
  avgEngagement: string;
  activeCampaigns: string[];
}

const REGIONAL_HUBS: GeoNode[] = [
  {
    id: 'bom',
    city: 'Mumbai',
    region: 'Western Commercial Hub · Agency HQ',
    reach: '7.9 Million',
    creators: 4,
    dominantNiche: 'Lifestyle & Entertainment',
    avgEngagement: '6.2%',
    activeCampaigns: ['Boat Airdopes Pro', 'Nothing Phone (3)', 'Mamaearth Glow']
  },
  {
    id: 'del',
    city: 'Delhi NCR',
    region: 'Northern Creative & Fashion Hub',
    reach: '6.4 Million',
    creators: 3,
    dominantNiche: 'Fashion, Lifestyle & Tech',
    avgEngagement: '5.8%',
    activeCampaigns: ['Nothing Phone (3)', 'Mamaearth Glow']
  },
  {
    id: 'blr',
    city: 'Bengaluru',
    region: 'Technology, Startup & AI Corridor',
    reach: '3.8 Million',
    creators: 2,
    dominantNiche: 'Tech, Gadgets & FinTech',
    avgEngagement: '8.4%',
    activeCampaigns: ['Nothing Phone (3)', 'CRED Launch']
  },
  {
    id: 'kol',
    city: 'Kolkata',
    region: 'Eastern Cultural Center',
    reach: '2.1 Million',
    creators: 2,
    dominantNiche: 'Art, Culture & Entertainment',
    avgEngagement: '5.2%',
    activeCampaigns: ['Boat Airdopes Pro']
  },
  {
    id: 'hyd',
    city: 'Hyderabad',
    region: 'Media & Esports Center',
    reach: '1.8 Million',
    creators: 1,
    dominantNiche: 'Gaming & Technology',
    avgEngagement: '6.9%',
    activeCampaigns: ['Boat Airdopes Pro']
  },
  {
    id: 'dxb',
    city: 'Dubai & Gulf',
    region: 'Global Diaspora & Luxury Market',
    reach: '4.2 Million',
    creators: 2,
    dominantNiche: 'Luxury, FinTech & Travel',
    avgEngagement: '4.9%',
    activeCampaigns: ['CRED Global']
  }
];

export const VintageAudienceMatrix: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<GeoNode>(REGIONAL_HUBS[0]);

  return (
    <VintageCard
      sectionNumber="SECTION IV · GEOGRAPHIC REACH"
      title="Regional Audience & Creator Distribution"
      subtitle="Geographic concentration of managed talent audience reach across domestic hubs and overseas diaspora"
      badge={
        <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#F5F2EB] border border-[#E7E2DA] text-[#1C1917] font-semibold">
          TOTAL NETWORK REACH: 26.2M
        </span>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hub Selection Grid (2 cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REGIONAL_HUBS.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            return (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-[#F7F4EE] border-[#1C1917] shadow-vintage-sm'
                    : 'bg-white border-[#E7E2DA] hover:border-[#D6CFBF] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif text-base font-semibold text-[#1C1917]">{hub.city}</h4>
                    <span className="text-[11px] text-[#78716C] font-sans block">{hub.region}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-[#1C1917] text-white' : 'bg-[#F5F2EB] text-[#1C1917]'
                  }`}>
                    {hub.reach}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-[#F0ECE4] flex items-center justify-between text-xs text-[#78716C]">
                  <span>{hub.creators} Active Creators</span>
                  <span className="font-medium text-[#2E523E]">{hub.avgEngagement} Avg ER</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Hub Deep Dive Card (1 col) */}
        <div className="p-5 rounded-xl bg-[#F7F4EE] border border-[#E7E2DA] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
              <span className="font-mono text-[10px] tracking-wider text-[#A8A29E] uppercase">TERRITORY PROFILE</span>
              <span className="font-mono text-xs font-bold text-[#1C1917]">{selectedHub.city.toUpperCase()}</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-[#A8A29E] block text-[11px]">Region Classification</span>
                <span className="font-medium text-[#1C1917]">{selectedHub.region}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EFECE6]">
                <div>
                  <span className="text-[#A8A29E] block text-[11px]">Audience Reach</span>
                  <span className="font-serif text-base font-bold text-[#1C1917]">{selectedHub.reach}</span>
                </div>
                <div>
                  <span className="text-[#A8A29E] block text-[11px]">Managed Creators</span>
                  <span className="font-serif text-base font-bold text-[#1C1917]">{selectedHub.creators} Profiles</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EFECE6]">
                <span className="text-[#A8A29E] block text-[11px]">Dominant Category</span>
                <span className="font-medium text-[#1C1917]">{selectedHub.dominantNiche}</span>
              </div>

              <div className="pt-2 border-t border-[#EFECE6]">
                <span className="text-[#A8A29E] block text-[11px] mb-1">Active Brand Campaigns</span>
                <div className="flex flex-wrap gap-1">
                  {selectedHub.activeCampaigns.map((camp, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E2DDD5] text-[#1C1917]">
                      {camp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2DDD5] flex items-center justify-between text-[11px] text-[#78716C]">
            <span>Authenticity Index: <strong className="text-[#2E523E]">94%</strong></span>
            <span>Commercial Tier: <strong className="text-[#1C1917]">Tier 1</strong></span>
          </div>
        </div>
      </div>
    </VintageCard>
  );
};

