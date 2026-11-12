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
        <span className="font-mono text-xs px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold tracking-wide shadow-xs">
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
                className={`p-4 rounded-2xl text-left transition-all border relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-400/90 shadow-[0_4px_20px_rgba(37,99,235,0.12)]'
                    : 'bg-white/80 border-slate-200/80 hover:border-blue-300 hover:bg-white shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-sans text-base font-bold text-slate-900 tracking-tight">{hub.city}</h4>
                    <span className="text-[11px] text-slate-500 font-sans block mt-0.5 font-medium">{hub.region}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {hub.reach}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{hub.creators} Active Creators</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {hub.avgEngagement} Avg ER
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Hub Deep Dive Card (1 col) */}
        <div className="p-5 rounded-2xl bg-white/85 border border-white/90 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04),0_0_0_1px_rgba(255,255,255,0.8)_inset]">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/35 to-transparent" />
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold">TERRITORY PROFILE</span>
              <span className="font-mono text-xs font-extrabold text-blue-600 tracking-wider">{selectedHub.city.toUpperCase()}</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-mono font-semibold">Region Classification</span>
                <span className="font-bold text-slate-800">{selectedHub.region}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px] font-mono font-semibold">Audience Reach</span>
                  <span className="font-sans text-xl font-extrabold text-slate-900 tracking-tight">{selectedHub.reach}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-mono font-semibold">Managed Creators</span>
                  <span className="font-sans text-xl font-extrabold text-slate-900 tracking-tight">{selectedHub.creators} Profiles</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px] font-mono font-semibold">Dominant Category</span>
                <span className="font-bold text-slate-800">{selectedHub.dominantNiche}</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px] font-mono font-semibold mb-1.5">Active Brand Campaigns</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHub.activeCampaigns.map((camp, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium font-sans border border-slate-200">
                      {camp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Authenticity Index: <strong className="text-emerald-700 ml-1 font-bold">94%</strong></span>
            <span>Commercial Tier: <strong className="text-slate-900 ml-1 font-mono font-bold">Tier 1</strong></span>
          </div>
        </div>
      </div>
    </VintageCard>
  );
};
