import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function CarbonProjection({
  projections = [],
  baseCo2Tons = 664.25,
}) {
  // If no projections passed, generate 5-year default curve
  const data = projections.length > 0
    ? projections
    : [1, 2, 3, 4, 5].map((yr) => ({
        year: `Year ${yr}`,
        co2Tons: Number((baseCo2Tons * Math.pow(1.052, yr)).toFixed(2)),
      }));

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <TrendingUp className="w-4 h-4" /> 5-Year Cumulative Carbon Sink (tCO2e)
        </span>
        <span className="text-[11px] text-emerald-400/80 font-mono">+5.2% Compounded Growth/yr</span>
      </div>

      <div className="w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#10b981',
                borderRadius: '0.75rem',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value} tCO2e`, 'Net Sequestration']}
            />
            <Area
              type="monotone"
              dataKey="co2Tons"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCo2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-[11px] text-slate-400 text-center font-mono bg-slate-900/50 py-1.5 px-2 rounded-lg border border-slate-800">
        Projected Sequestration at Year 5: <span className="text-emerald-400 font-bold">{data[data.length - 1]?.co2Tons} tCO2e</span>
      </div>
    </div>
  );
}
