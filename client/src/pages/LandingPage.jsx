import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Waves, Shield, Sprout, ShoppingCart, ArrowRight, CheckCircle2, TrendingUp, Layers, Award, ExternalLink } from 'lucide-react';
import GlassCard from '../components/shared/GlassCard';
import apiClient from '../config/api';
import { formatTons, formatMatic } from '../utils/formatters';

export default function LandingPage() {
  const [stats, setStats] = useState({
    totalPlots: 4,
    totalHectares: '41.1',
    totalCo2eTons: '1928.45',
    activeListings: 1,
    retiredCount: 1,
    totalVolumeMatic: '0.60',
  });

  useEffect(() => {
    apiClient.get('/marketplace/stats').then((res) => {
      if (res.data?.stats) {
        setStats(res.data.stats);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-16 py-4">
      
      {/* Hero Section */}
      <section className="text-center relative py-12 md:py-16 overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto flex flex-col items-center gap-6 relative z-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Zero-Image Satellite Remote Sensing • Polygon Amoy Web3</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Decentralized <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Blue Carbon</span> MRV & Web3 Marketplace
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Empowering coastal communities to tokenize verified mangrove restoration projects via NASA Earth Observation remote sensing and trade verified ERC-721 carbon credits on Polygon.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link
              to="/marketplace"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-obsidian-950 flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/admin/mrv"
              className="px-6 py-3.5 rounded-xl font-bold text-sm glass-card border-emerald-500/30 text-white hover:bg-slate-800/60 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>MRV Telemetry Studio</span>
            </Link>
          </div>
        </motion.div>

        {/* Live Platform Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14"
        >
          <div className="glass-card p-4 rounded-2xl text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">
              {stats.totalHectares} Ha
            </span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1 block">
              Restored Mangroves
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono block">
              {formatTons(stats.totalCo2eTons)}
            </span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1 block">
              Verified Carbon Sink
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono block">
              {formatMatic(stats.totalVolumeMatic)}
            </span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1 block">
              Farmer Payout Volume
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono block">
              {stats.retiredCount} Credits
            </span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1 block">
              ESG Offsets Retired
            </span>
          </div>
        </motion.div>
      </section>

      {/* 3 Role Entryways (Evaluator Fast-Track) */}
      <section className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Three Stakeholder Portals</h2>
          <p className="text-sm text-slate-400 mt-1">Select a role to experience the end-to-end 5-stage blue carbon lifecycle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Farmer Card */}
          <GlassCard className="flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Coastal Farmer Portal</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Register mangrove plantation plots using an interactive satellite map. Zero image uploads required — GPS coordinates and species factors seed automated remote sensing.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 mb-6 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Interactive Leaflet Map Picker
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automatic Farmer Wallet Settlement
                </li>
              </ul>
            </div>
            <Link
              to="/farmer/register"
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-emerald-500 hover:text-obsidian-950 text-emerald-400 text-center transition-all flex items-center justify-center gap-2"
            >
              <span>Register New Plot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </GlassCard>

          {/* 2. Admin MRV Auditor Card */}
          <GlassCard className="flex flex-col justify-between group" glow={true}>
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">MRV Verification Studio</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Execute automated satellite remote sensing via NASA POWER Earth Observation API. Computes NDVI, AGB, BGB, and IPCC Tier-2 sequestration in under 2 seconds.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 mb-6 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" /> Recharts NDVI & Biomass Gauges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" /> IPFS Pinning + MetaMask Minting
                </li>
              </ul>
            </div>
            <Link
              to="/admin/mrv"
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span>Open Verification Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </GlassCard>

          {/* 3. Corporate ESG Buyer Card */}
          <GlassCard className="flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Web3 Carbon Marketplace</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Browse verified blue carbon credits listed in contract escrow. Purchase with MATIC, retire on-chain, and generate printable ESG carbon offset compliance certificates.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 mb-6 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Atomic Smart Contract Escrow
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Printable Gold-Bordered Certificate
                </li>
              </ul>
            </div>
            <Link
              to="/marketplace"
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-indigo-500 hover:text-white text-indigo-300 text-center transition-all flex items-center justify-center gap-2"
            >
              <span>Browse Carbon Credits</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </GlassCard>

        </div>
      </section>

      {/* Scientific MRV Formula Showcase */}
      <section className="glass-card rounded-3xl p-8 border border-emerald-500/30">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            Deterministic Environmental Engineering
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            The Mathematics Behind VeriFlow MRV
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Instead of unpredictable black-box ML models, VeriFlow implements peer-reviewed remote sensing equations from the <strong>IPCC Coastal Wetlands Supplement</strong> and Komiyama mangrove allometry:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">1. Spectral NDVI</span>
              <code className="text-[11px] text-slate-300 font-mono block">NDVI = (NIR - Red) / (NIR + Red)</code>
              <p className="text-[11px] text-slate-400 mt-2">Crown closure correlation: Canopy% = min(98.5, NDVI × 112.4)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono font-bold text-teal-400 block mb-1">2. Allometric Biomass</span>
              <code className="text-[11px] text-slate-300 font-mono block">AGB = 185.0 × (NDVI)^1.65 × Sf</code>
              <p className="text-[11px] text-slate-400 mt-2">Wetland root system (BGB) = 0.42 × AGB beneath waterline</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono font-bold text-amber-400 block mb-1">3. Net CO2e Conversion</span>
              <code className="text-[11px] text-slate-300 font-mono block">tCO2e = Area × C_ann × (44/12)</code>
              <p className="text-[11px] text-slate-400 mt-2">Stoichiometric molecular mass ratio: 44/12 ≈ 3.6667</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
