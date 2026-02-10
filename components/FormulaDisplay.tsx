
import React from 'react';

interface FormulaDisplayProps {
  label: string;
  formula: string;
  calculation?: string;
  result: string | number;
  highlight?: boolean;
  variant?: 'default' | 'compact' | 'mini';
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ 
  label, 
  formula, 
  calculation, 
  result, 
  highlight = false,
  variant = 'default' 
}) => {
  if (variant === 'mini') {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-500 italic font-medium">{formula}</span>
      </div>
    );
  }

  const isCompact = variant === 'compact';

  return (
    <div className={`rounded-xl transition-all ${
      highlight 
        ? 'bg-indigo-600 p-6 text-white shadow-lg ring-4 ring-indigo-50 min-w-[280px]' 
        : isCompact 
          ? 'bg-slate-50 p-3' 
          : 'bg-white border border-slate-100 p-4'
    }`}>
      {/* Label and Result Stack */}
      <div className="flex flex-col gap-0.5 mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${
          highlight ? 'text-indigo-200' : 'text-slate-500'
        }`}>
          {label}
        </span>
        <span className={`${
          highlight ? 'text-3xl font-black' : isCompact ? 'text-lg font-bold' : 'text-2xl font-bold'
        } ${highlight ? 'text-white' : 'text-slate-900'} leading-tight`}>
          {result}
        </span>
      </div>

      {/* Formula and Calculation Footer */}
      <div className={`pt-3 border-t ${
        highlight ? 'border-indigo-500/50 text-indigo-100' : 'border-slate-200/60 text-slate-400'
      } text-[11px] leading-tight font-medium`}>
        <div className="italic mb-1">{formula}</div>
        {calculation && (
          <div className={`font-mono mt-1 ${highlight ? 'bg-white/10' : 'bg-slate-100'} rounded px-1.5 py-0.5 inline-block opacity-90`}>
            Value: {calculation}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaDisplay;
