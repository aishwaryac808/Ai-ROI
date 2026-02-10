
import React from 'react';
import { ChannelData } from '../types';
import { Phone, MessageCircle, Globe } from 'lucide-react';
import FormulaDisplay from './FormulaDisplay';

interface ChannelCardProps {
  channel: ChannelData;
  onChange: (field: keyof ChannelData, value: number) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onChange }) => {
  const resolvedLeads = channel.dailyLeads - channel.unresolvedLeads;
  const resolutionRate = channel.dailyLeads > 0 
    ? (resolvedLeads / channel.dailyLeads) * 100 
    : 0;

  const IconComponent = () => {
    switch (channel.id) {
      case 'ivr': return <Phone size={20} className="text-emerald-600" />;
      case 'whatsapp': return <MessageCircle size={20} className="text-green-600" />;
      case 'web': return <Globe size={20} className="text-sky-600" />;
      default: return null;
    }
  };

  const getThemeClass = () => {
    switch (channel.id) {
      case 'ivr': return 'border-emerald-100 bg-emerald-50/30';
      case 'whatsapp': return 'border-green-100 bg-green-50/30';
      case 'web': return 'border-sky-100 bg-sky-50/30';
      default: return 'border-slate-100 bg-slate-50/30';
    }
  };

  return (
    <div className={`rounded-2xl border p-6 transition-all hover:shadow-md bg-white ${getThemeClass()}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg bg-white shadow-sm border border-inherit`}>
          <IconComponent />
        </div>
        <h4 className="font-bold text-slate-800 text-lg">{channel.name}</h4>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">Daily Leads</label>
          <input 
            type="number"
            value={channel.dailyLeads}
            onChange={(e) => onChange('dailyLeads', Number(e.target.value))}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-lg font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">Unresolved Leads (without AI)</label>
          <input 
            type="number"
            value={channel.unresolvedLeads}
            onChange={(e) => onChange('unresolvedLeads', Number(e.target.value))}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-lg font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <FormulaDisplay 
          formula={`Resolved Leads = Daily (${channel.dailyLeads}) − Unresolved (${channel.unresolvedLeads})`}
          calculation={`${channel.dailyLeads} - ${channel.unresolvedLeads}`}
          result={resolvedLeads.toLocaleString()}
          label="Resolved Leads"
          variant="compact"
        />
        <FormulaDisplay 
          formula={`Resolution Rate = ((${channel.dailyLeads} − ${channel.unresolvedLeads}) ÷ ${channel.dailyLeads}) × 100`}
          calculation={`(${resolvedLeads} / ${channel.dailyLeads}) * 100`}
          result={`${resolutionRate.toFixed(1)}%`}
          label="Resolution Rate"
          variant="compact"
        />
      </div>
    </div>
  );
};

export default ChannelCard;
