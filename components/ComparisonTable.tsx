
import React from 'react';
import FormulaDisplay from './FormulaDisplay';
import { IndianRupee, UserCheck, ShieldCheck } from 'lucide-react';

interface ModelResult {
  agents: number;
  dailyCost: number;
  humanHandled: number;
  aiResolved: number;
}

interface ComparisonTableProps {
  totalLeads: number;
  daysPerMonth: number;
  modelA: ModelResult;
  modelB: ModelResult;
  difference: number;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ totalLeads, modelA, modelB, difference }) => {
  const isHybridBetter = difference > 0;
  // Per user request: Days will 30 always for monthly calculations
  const DAYS_CONSTANT = 30;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">Metric</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">Model A: Human-Only</th>
              <th className="px-8 py-5 text-xs font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-100 bg-indigo-50/30">Model B: AI + Human</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-8 py-6 font-semibold text-slate-700">Total Conversations</td>
              <td className="px-8 py-6 text-slate-900">{totalLeads.toLocaleString()}</td>
              <td className="px-8 py-6 text-slate-900 bg-indigo-50/10">{totalLeads.toLocaleString()}</td>
            </tr>
            <tr>
              <td className="px-8 py-6 font-semibold text-slate-700">AI Resolved</td>
              <td className="px-8 py-6 text-slate-300">0</td>
              <td className="px-8 py-6 text-indigo-700 font-bold bg-indigo-50/10">{Math.round(modelB.aiResolved).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="px-8 py-6 font-semibold text-slate-700">Human Handled</td>
              <td className="px-8 py-6 text-slate-900">{modelA.humanHandled.toLocaleString()}</td>
              <td className="px-8 py-6 text-slate-900 bg-indigo-50/10">{Math.round(modelB.humanHandled).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="px-8 py-6 font-semibold text-slate-700">Agents Required</td>
              <td className="px-8 py-6 text-slate-900 font-bold">{modelA.agents}</td>
              <td className="px-8 py-6 text-indigo-600 font-bold bg-indigo-50/10">{modelB.agents}</td>
            </tr>
            <tr>
              <td className="px-8 py-6 font-semibold text-slate-700">Daily OpEx (₹)</td>
              <td className="px-8 py-6 text-lg font-bold text-slate-900">₹{Math.round(modelA.dailyCost).toLocaleString()}</td>
              <td className="px-8 py-6 text-lg font-bold text-indigo-700 bg-indigo-50/10">₹{Math.round(modelB.dailyCost).toLocaleString()}</td>
            </tr>
            <tr className="bg-slate-50/30">
              <td className="px-8 py-6 font-bold text-slate-900 italic">Monthly OpEx (₹)</td>
              <td className="px-8 py-6 text-xl font-bold text-slate-900">₹{Math.round(modelA.dailyCost * DAYS_CONSTANT).toLocaleString()}</td>
              <td className="px-8 py-6 text-xl font-extrabold text-indigo-900 bg-indigo-50/20">₹{Math.round(modelB.dailyCost * DAYS_CONSTANT).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={`p-8 rounded-3xl border-2 flex flex-col md:flex-row items-center justify-between gap-8 ${isHybridBetter ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${isHybridBetter ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            <ShieldCheck size={32} />
          </div>
          <div className="space-y-1">
            <h4 className={`text-xl font-bold ${isHybridBetter ? 'text-emerald-900' : 'text-rose-900'}`}>
              {isHybridBetter ? 'Monthly Savings Realized' : 'Human-Only Advantage'}
            </h4>
            <p className="text-slate-600 text-sm max-w-sm">
              {isHybridBetter 
                ? 'The AI + Human hybrid significantly reduces headcount costs while maintaining 100% resolution.' 
                : 'Given the current low AI accuracy or cost inputs, a pure human model remains more efficient.'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end w-full md:w-auto">
          <FormulaDisplay 
            label="Monthly Difference"
            formula={`Diff = |Model A - Model B| × ${DAYS_CONSTANT}`}
            calculation={`|₹${Math.round(modelA.dailyCost).toLocaleString()} - ₹${Math.round(modelB.dailyCost).toLocaleString()}| × ${DAYS_CONSTANT}`}
            result={`₹${Math.round(Math.abs(difference) * DAYS_CONSTANT).toLocaleString()}`}
            highlight
          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
