import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { Sprout, Eye } from 'lucide-react';

export default function NdviGauge({ ndviScore = 0.78, canopyCoverPct = 88.5 }) {
  const normNdvi = Math.min(1.0, Math.max(0, Number(ndviScore)));
  const percentage = Math.round(normNdvi * 100);

  const data = [
    {
      name: 'NDVI Score',
      value: percentage,
      fill: '#10b981',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col items-center justify-between relative overflow-hidden">
      <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-1">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <Sprout className="w-4 h-4" /> NDVI Spectral Health
        </span>
        <span className="font-mono text-[11px] text-slate-500">Sentinel-2 / MODIS</span>
      </div>

      {/* Gauge Visualization */}
      <div className="w-full h-44 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={14}
            data={data}
            startAngle={210}
            endAngle={-30}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: '#1e293b' }}
              dataKey="value"
              cornerRadius={8}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center NDVI reading */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {ndviScore.toFixed(3)}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider mt-0.5">
            {normNdvi >= 0.7 ? 'Healthy Canopy' : normNdvi >= 0.5 ? 'Moderate Cover' : 'Sparse'}
          </span>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-center">
        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Canopy Cover</span>
          <span className="text-sm font-bold text-teal-400 font-mono">{canopyCoverPct}%</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Spectral Band</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">NIR / Red</span>
        </div>
      </div>
    </div>
  );
}
