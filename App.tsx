
import React, { useState, useMemo } from 'react';
import { ChannelData, HumanConfig, ModelBConfig } from './types';
import ChannelCard from './components/ChannelCard';
import FormulaDisplay from './components/FormulaDisplay';
import ComparisonTable from './components/ComparisonTable';
import { BrainCircuit, Users, RotateCcw, TrendingUp, Info } from 'lucide-react';

const ZERO_CHANNELS: ChannelData[] = [
  { id: 'ivr', name: 'IVR', dailyLeads: 0, unresolvedLeads: 0, icon: 'phone' },
  { id: 'whatsapp', name: 'WhatsApp', dailyLeads: 0, unresolvedLeads: 0, icon: 'whatsapp' },
  { id: 'web', name: 'Website Chat', dailyLeads: 0, unresolvedLeads: 0, icon: 'globe' },
];

const DEFAULT_CHANNELS: ChannelData[] = [
  { id: 'ivr', name: 'IVR', dailyLeads: 1000, unresolvedLeads: 400, icon: 'phone' },
  { id: 'whatsapp', name: 'WhatsApp', dailyLeads: 2500, unresolvedLeads: 1200, icon: 'whatsapp' },
  { id: 'web', name: 'Website Chat', dailyLeads: 1500, unresolvedLeads: 600, icon: 'globe' },
];

const INITIAL_HUMAN: HumanConfig = {
  costPerAgentMonth: 45000,
  convsPerAgentDay: 50,
  daysPerMonth: 22,
};

const INITIAL_MODEL_B: ModelBConfig = {
  ...INITIAL_HUMAN,
  aiResolutionRate: 70,
  avgAiMinutes: 2,
  costPerAiMinute: 2,
};

const App: React.FC = () => {
  const [channels, setChannels] = useState<ChannelData[]>(DEFAULT_CHANNELS);
  const [modelA, setModelA] = useState<HumanConfig>(INITIAL_HUMAN);
  const [modelB, setModelB] = useState<ModelBConfig>(INITIAL_MODEL_B);

  const updateChannel = (id: string, field: keyof ChannelData, value: number) => {
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, [field]: value } : ch));
  };

  const handleReset = () => {
    setChannels(ZERO_CHANNELS);
    setModelA({ costPerAgentMonth: 0, convsPerAgentDay: 0, daysPerMonth: 0 });
    setModelB({ costPerAgentMonth: 0, convsPerAgentDay: 0, daysPerMonth: 0, aiResolutionRate: 0, avgAiMinutes: 0, costPerAiMinute: 0 });
  };

  // 1. Total Unresolved Demand
  const totalUnresolvedLeads = useMemo(() => 
    channels.reduce((sum, ch) => sum + ch.unresolvedLeads, 0), 
  [channels]);

  // 2. Model A Calculations (Human-Only)
  const modelAAgentsReq = Math.ceil(totalUnresolvedLeads / (modelA.convsPerAgentDay || 1));
  const modelACostPerAgentDay = modelA.costPerAgentMonth / (modelA.daysPerMonth || 1);
  const modelADailyCost = modelAAgentsReq * modelACostPerAgentDay;

  // 3. Model B Calculations (Hybrid)
  const modelBAiResolved = (totalUnresolvedLeads * modelB.aiResolutionRate) / 100;
  const modelBHumanHandled = totalUnresolvedLeads - modelBAiResolved;
  const modelBAgentsReq = Math.ceil(modelBHumanHandled / (modelB.convsPerAgentDay || 1));
  const modelBCostPerAgentDay = modelB.costPerAgentMonth / (modelB.daysPerMonth || 1);
  const modelBHumanCost = modelBAgentsReq * modelBCostPerAgentDay;
  const modelBAiCost = modelBAiResolved * modelB.avgAiMinutes * modelB.costPerAiMinute;
  const modelBDailyCost = modelBHumanCost + modelBAiCost;

  const costDifference = modelADailyCost - modelBDailyCost;
  const efficientModel = modelADailyCost < modelBDailyCost ? 'Human-Only' : 'AI + Human Hybrid';

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI vs Human ROI</h1>
                <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-lg transition-all hover:bg-red-50">
                  <RotateCcw size={14} /> Clear to Zero
                </button>
              </div>
              <p className="text-slate-500 text-sm mt-1">Cost & Capacity Optimization Tool</p>
            </div>
            <div className="hidden md:block h-10 w-px bg-slate-200 mx-4"></div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 flex items-center gap-4">
              <div className="bg-indigo-600 p-2 rounded-lg text-white"><BrainCircuit size={20} /></div>
              <div>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none mb-1">Total Unresolved Leads</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-bold text-indigo-900 leading-none">{totalUnresolvedLeads.toLocaleString()}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">01. Channel Demand</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {channels.map(channel => (
              <ChannelCard key={channel.id} channel={channel} onChange={(field, value) => updateChannel(channel.id, field, value)} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Model A Section */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2.5 rounded-xl text-slate-600"><Users size={22} /></div>
                <h3 className="text-xl font-bold text-slate-900">Model A: Human-Only</h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase">100% Human</span>
            </div>
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Cost/Agent Month</label>
                  <input type="number" value={modelA.costPerAgentMonth} onChange={e => setModelA({...modelA, costPerAgentMonth: +e.target.value})} className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none" />
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Convs/Agent Day</label>
                  <input type="number" value={modelA.convsPerAgentDay} onChange={e => setModelA({...modelA, convsPerAgentDay: +e.target.value})} className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none" />
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Days/Month</label>
                  <input type="number" value={modelA.daysPerMonth} onChange={e => setModelA({...modelA, daysPerMonth: +e.target.value})} className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                <FormulaDisplay 
                  label="Agents Required" 
                  formula="Ceiling(Total Leads ÷ Convs/Agent/Day)" 
                  calculation={`Ceiling(${totalUnresolvedLeads} ÷ ${modelA.convsPerAgentDay})`}
                  result={modelAAgentsReq} 
                />
                <FormulaDisplay 
                  label="Daily Cost (₹)" 
                  formula="Agents Req × (Monthly Salary ÷ Operating Days)" 
                  calculation={`${modelAAgentsReq} × (₹${modelA.costPerAgentMonth} ÷ ${modelA.daysPerMonth})`}
                  result={`₹${Math.round(modelADailyCost).toLocaleString()}`} 
                  highlight
                />
              </div>
            </div>
          </section>

          {/* Model B Section */}
          <section className="bg-white rounded-3xl border border-indigo-100 p-8 shadow-md ring-2 ring-indigo-50 ring-offset-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2.5 rounded-xl text-white"><BrainCircuit size={22} /></div>
                <h3 className="text-xl font-bold text-slate-900">Model B: AI + Human</h3>
              </div>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold uppercase">Hybrid Efficiency</span>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <label className="block text-[10px] font-bold text-indigo-600 uppercase mb-2">AI Res Rate %</label>
                  <input type="number" value={modelB.aiResolutionRate} onChange={e => setModelB({...modelB, aiResolutionRate: +e.target.value})} className="w-full bg-transparent text-lg font-bold text-indigo-900 outline-none" />
                </div>
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <label className="block text-[10px] font-bold text-indigo-600 uppercase mb-2">Avg AI Min/Conv</label>
                  <input type="number" value={modelB.avgAiMinutes} onChange={e => setModelB({...modelB, avgAiMinutes: +e.target.value})} className="w-full bg-transparent text-lg font-bold text-indigo-900 outline-none" />
                </div>
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <label className="block text-[10px] font-bold text-indigo-600 uppercase mb-2">Cost/AI Min (₹)</label>
                  <input type="number" value={modelB.costPerAiMinute} onChange={e => setModelB({...modelB, costPerAiMinute: +e.target.value})} className="w-full bg-transparent text-lg font-bold text-indigo-900 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-80 border-t border-slate-100 pt-6">
                <div className="p-2"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Agent Salary (₹)</label><input type="number" value={modelB.costPerAgentMonth} onChange={e => setModelB({...modelB, costPerAgentMonth: +e.target.value})} className="w-full bg-transparent text-sm font-bold text-slate-600 outline-none" /></div>
                <div className="p-2"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cap/Agent Day</label><input type="number" value={modelB.convsPerAgentDay} onChange={e => setModelB({...modelB, convsPerAgentDay: +e.target.value})} className="w-full bg-transparent text-sm font-bold text-slate-600 outline-none" /></div>
                <div className="p-2"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Days/Month</label><input type="number" value={modelB.daysPerMonth} onChange={e => setModelB({...modelB, daysPerMonth: +e.target.value})} className="w-full bg-transparent text-sm font-bold text-slate-600 outline-none" /></div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormulaDisplay label="AI Resolved Leads" formula="Total Leads × AI Rate %" calculation={`${totalUnresolvedLeads} × ${modelB.aiResolutionRate}%`} result={Math.round(modelBAiResolved).toLocaleString()} />
                  <FormulaDisplay label="Agents Required" formula="Ceiling((Total - AI Resolved) ÷ Capacity)" calculation={`Ceiling(${Math.round(modelBHumanHandled)} ÷ ${modelB.convsPerAgentDay})`} result={modelBAgentsReq} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormulaDisplay label="Daily AI Cost" formula="AI Leads × Min/Conv × Cost/Min" calculation={`${Math.round(modelBAiResolved)} × ${modelB.avgAiMinutes} × ₹${modelB.costPerAiMinute}`} result={`₹${Math.round(modelBAiCost).toLocaleString()}`} />
                  <FormulaDisplay label="Daily Human Cost" formula="Agents Req × (Salary ÷ Days)" calculation={`${modelBAgentsReq} × (₹${modelB.costPerAgentMonth} ÷ ${modelB.daysPerMonth})`} result={`₹${Math.round(modelBHumanCost).toLocaleString()}`} />
                </div>
                <FormulaDisplay label="Total Hybrid Daily Cost (₹)" formula="AI Cost + Human Cost" calculation={`₹${Math.round(modelBAiCost)} + ₹${Math.round(modelBHumanCost)}`} result={`₹${Math.round(modelBDailyCost).toLocaleString()}`} highlight />
              </div>
            </div>
          </section>
        </div>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">02. Model Comparison</h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm animate-pulse">
              <TrendingUp size={16} className="text-emerald-500" />
              <span className="text-xs font-bold text-slate-700">Recommended: <span className="text-emerald-600">{efficientModel}</span></span>
            </div>
          </div>
          <ComparisonTable 
            totalLeads={totalUnresolvedLeads}
            daysPerMonth={modelA.daysPerMonth}
            modelA={{
              agents: modelAAgentsReq,
              dailyCost: modelADailyCost,
              humanHandled: totalUnresolvedLeads,
              aiResolved: 0
            }}
            modelB={{
              agents: modelBAgentsReq,
              dailyCost: modelBDailyCost,
              humanHandled: modelBHumanHandled,
              aiResolved: modelBAiResolved
            }}
            difference={costDifference}
          />
        </section>
      </main>
    </div>
  );
};

export default App;
