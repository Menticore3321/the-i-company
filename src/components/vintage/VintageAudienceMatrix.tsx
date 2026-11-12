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
        <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#5B8BF7]/10 border border-[#5B8BF7]/30 text-[#8FA5D9] font-medium tracking-wide">
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
                className={`p-4 rounded-xl text-left transition-all border relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[#121829]/90 border-[#5B8BF7]/60 shadow-[0_0_24px_rgba(91,139,247,0.18)]'
                    : 'bg-[#0B0E17]/70 border-white/[0.07] hover:border-white/20 hover:bg-[#0F1424]/70'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#5B8BF7] to-transparent" />
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-sans text-base font-semibold text-white tracking-tight">{hub.city}</h4>
                    <span className="text-[11px] text-[#8FA5D9]/70 font-sans block mt-0.5">{hub.region}</span>
                  </div>
                  <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full ${
                    isSelected 
                      ? 'bg-[#5B8BF7] text-white shadow-[0_0_12px_rgba(91,139,247,0.5)]' 
                      : 'bg-white/5 border border-white/10 text-[#8FA5D9]'
                  }`}>
                    {hub.reach}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#7189BA]">
                  <span>{hub.creators} Active Creators</span>
                  <span className="font-medium text-[#10B981] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    {hub.avgEngagement} Avg ER
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Hub Deep Dive Card (1 col) */}
        <div className="p-5 rounded-xl bg-[#0B0E17]/85 border border-white/10 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5B8BF7]/40 to-transparent" />
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="font-mono text-[10px] tracking-widest text-[#7189BA] uppercase">TERRITORY PROFILE</span>
              <span className="font-mono text-xs font-bold text-[#5B8BF7] tracking-wider">{selectedHub.city.toUpperCase()}</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-[#7189BA] block text-[11px] font-mono">Region Classification</span>
                <span className="font-medium text-white/90">{selectedHub.region}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                <div>
                  <span className="text-[#7189BA] block text-[11px] font-mono">Audience Reach</span>
                  <span className="font-sans text-lg font-bold text-white tracking-tight">{selectedHub.reach}</span>
                </div>
                <div>
                  <span className="text-[#7189BA] block text-[11px] font-mono">Managed Creators</span>
                  <span className="font-sans text-lg font-bold text-white tracking-tight">{selectedHub.creators} Profiles</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <span className="text-[#7189BA] block text-[11px] font-mono">Dominant Category</span>
                <span className="font-medium text-white/90">{selectedHub.dominantNiche}</span>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <span className="text-[#7189BA] block text-[11px] font-mono mb-1.5">Active Brand Campaigns</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHub.activeCampaigns.map((camp, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[#D7DCEA]">
                      {camp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#7189BA]">
            <span>Authenticity Index: <strong className="text-[#10B981] ml-1">94%</strong></span>
            <span>Commercial Tier: <strong className="text-white ml-1 font-mono">Tier 1</strong></span>
          </div>
        </div>
      </div>
    </VintageCard>
  );
};

