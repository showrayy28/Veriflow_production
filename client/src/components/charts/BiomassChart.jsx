import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Layers } from 'lucide-react';

export default function BiomassChart({
  agb = 142.6,
  bgb = 59.89,
  soc = 7.1,
  species = 'Rhizophora mucronata',
}) {
  const data = [
    {
      category: 'Plot Mangrove',
      AGB: Number(agb),
      BGB: Number(bgb),
      SOC: Number(soc) * 10, // Scaled for comparison representation
    },
    {
      category: 'Terrestrial Forest (Ref)',
      AGB: 85.0,
      BGB: 18.0,
      SOC: 22.0,
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span className="flex items-center gap-1.5 font-semibold text-teal-400">
          <Layers className="w-4 h-4" /> IPCC Carbon Pools (Mg/ha)
        </span>
        <span className="text-[11px] text-slate-500 font-mono truncate max-w-[150px]">{species}</span>
      </div>

      <div className="w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#10b981',
                borderRadius: '0.75rem',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
            <Bar dataKey="AGB" name="Above-Ground (AGB)" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="BGB" name="Root Network (BGB)" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
            <Bar dataKey="SOC" name="Soil Carbon (SOC)" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-[11px] text-slate-400 text-center font-mono bg-slate-900/50 py-1.5 px-2 rounded-lg border border-slate-800">
        Mangrove root systems (BGB) store <span className="text-emerald-400 font-bold">42%</span> of AGB beneath waterline
      </div>
    </div>
  );
}
