import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Plus, MapPin, Clock, CheckCircle2, Coins, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import StatusBadge from '../../components/shared/StatusBadge';
import apiClient from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { formatTons, formatDate } from '../../utils/formatters';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [plots, setPlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlots = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/plots');
      if (res.data?.data) {
        setPlots(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load plots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  const totalHectares = plots.reduce((acc, p) => acc + (Number(p.area_hectares) || 0), 0);
  const totalVerifiedCo2e = plots.reduce((acc, p) => acc + (Number(p.report?.co2_tons_total) || 0), 0);
  const pendingPlots = plots.filter((p) => p.status === 'SUBMITTED').length;
  const mintedPlots = plots.filter((p) => p.status === 'MINTED' || p.status === 'SOLD' || p.status === 'RETIRED').length;

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header with Title and Register Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sprout className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Coastal Farmer Command Center</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Registered Plantation Plots • Blue Carbon MRV Lifecycle • On-Chain Settlement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPlots}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh registry"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/farmer/register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-obsidian-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Register New Mangrove Plot</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider block mb-1">
            Total Mangrove Area
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalHectares.toFixed(1)} <span className="text-sm text-slate-400 font-sans font-normal">Ha</span>
          </span>
        </GlassCard>

        <GlassCard className="p-5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider block mb-1">
            Verified Carbon Volume
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {formatTons(totalVerifiedCo2e)}
          </span>
        </GlassCard>

        <GlassCard className="p-5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider block mb-1">
            Pending MRV Verification
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {pendingPlots} <span className="text-sm text-slate-400 font-sans font-normal">Plots</span>
          </span>
        </GlassCard>

        <GlassCard className="p-5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider block mb-1">
            On-Chain Tokenized
          </span>
          <span className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">
            {mintedPlots} <span className="text-sm text-slate-400 font-sans font-normal">NFTs</span>
          </span>
        </GlassCard>
      </div>

      {/* Plots Registry List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>My Registered Plantation Plots</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {plots.length}
            </span>
          </h2>
        </div>

        {plots.length === 0 && !isLoading ? (
          <GlassCard className="text-center py-12">
            <Sprout className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No mangrove plots registered yet</h3>
            <p className="text-xs text-slate-400 mb-4">
              Pinpoint your coastal restoration area on the satellite map to begin MRV.
            </p>
            <Link
              to="/farmer/register"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-obsidian-950"
            >
              Register First Plot
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plots.map((plot) => (
              <GlassCard key={plot.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      PLOT #{plot.id}
                    </span>
                    <StatusBadge status={plot.status} />
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{plot.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{plot.region_name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800 mb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Mangrove Species</span>
                      <span className="font-medium text-slate-200 italic">{plot.species}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Area</span>
                      <span className="font-mono text-slate-200 font-bold">{plot.area_hectares} Hectares</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between py-1">
                    <span>GPS: {Number(plot.latitude).toFixed(4)}, {Number(plot.longitude).toFixed(4)}</span>
                    <span>Registered: {formatDate(plot.created_at)}</span>
                  </div>
                </div>

                {/* Status action hint */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  {plot.status === 'SUBMITTED' && (
                    <span className="text-amber-400/90 text-[11px] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Awaiting MRV Lead Auditor Remote Sensing
                    </span>
                  )}
                  {plot.status === 'VERIFIED' && (
                    <span className="text-teal-400 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified: {formatTons(plot.report?.co2_tons_total)}
                    </span>
                  )}
                  {(plot.status === 'MINTED' || plot.status === 'SOLD' || plot.status === 'RETIRED') && (
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1 font-mono">
                      <Coins className="w-3.5 h-3.5" /> NFT Token #{plot.credit?.token_id}
                    </span>
                  )}

                  <Link
                    to="/admin/mrv"
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    <span>View Telemetry</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
