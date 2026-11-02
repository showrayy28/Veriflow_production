import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Printer, X, ShieldCheck, ExternalLink, Leaf } from 'lucide-react';
import { formatDate, formatTons } from '../../utils/formatters';

export default function ESGCertificate({ isOpen, onClose, certificateData }) {
  if (!isOpen || !certificateData) return null;

  const { plot, report, credit, beneficiary, certificate_id, retired_at, retire_tx_hash } = certificateData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="w-full max-w-3xl my-8 relative"
        >
          {/* Action Bar (Print & Close) */}
          <div className="flex items-center justify-between mb-3 text-white">
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Official On-Chain Blue Carbon Retirement Proof
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 transition-colors shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Certificate Container with Gold & Emerald Border */}
          <div
            id="printable-esg-certificate"
            className="bg-gradient-to-br from-slate-950 via-slate-900 to-obsidian-950 p-8 sm:p-12 rounded-3xl border-4 border-amber-500/60 shadow-2xl relative overflow-hidden"
          >
            {/* Background watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Leaf className="w-96 h-96 text-emerald-400" />
            </div>

            {/* Inner Decorative Framing */}
            <div className="border border-amber-400/30 p-6 sm:p-10 rounded-2xl relative z-10 flex flex-col items-center text-center">
              
              {/* Header Badge */}
              <div className="flex items-center gap-2 mb-2 text-amber-400">
                <Award className="w-7 h-7" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">
                  VeriFlow Blue Carbon Registry • Polygon Amoy
                </span>
                <Award className="w-7 h-7" />
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300 font-serif mb-2 tracking-wide">
                Certificate of ESG Carbon Offset
              </h1>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-8">
                Permanent On-Chain Environmental Retirement
              </p>

              {/* Beneficiary Statement */}
              <p className="text-xs text-slate-400 font-serif italic mb-2">This is to officially certify that</p>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-2 underline decoration-emerald-500/50 underline-offset-8">
                {beneficiary || credit?.retirement_beneficiary || 'GreenFuture ESG Capital Corp'}
              </h2>
              <p className="text-xs text-slate-300 max-w-lg mx-auto font-sans leading-relaxed mb-6">
                has voluntarily and permanently retired verified Blue Carbon Credits for greenhouse gas mitigation under the IPCC Tier-2 Coastal Wetlands MRV Protocol.
              </p>

              {/* Carbon Volume Highlight */}
              <div className="my-4 py-4 px-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight">
                  {formatTons(report?.co2_tons_total || 664.25)}
                </span>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1 font-mono">
                  ({(Number(report?.carbon_kg_total) || 664250).toLocaleString()} Kilograms Pure Carbon)
                </span>
              </div>

              {/* Telemetry & Geographic Details Table */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-left">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Mangrove Species</span>
                  <span className="text-xs font-bold text-slate-200 italic truncate block">
                    {plot?.species || 'Rhizophora mucronata'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">GPS Coordinates</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 block">
                    {plot?.latitude?.toFixed(4)}, {plot?.longitude?.toFixed(4)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Spectral Health</span>
                  <span className="text-xs font-mono font-bold text-teal-400 block">
                    NDVI {Number(report?.ndvi_score || 0.784).toFixed(3)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Retirement Date</span>
                  <span className="text-xs font-mono font-bold text-slate-200 block">
                    {formatDate(retired_at || new Date())}
                  </span>
                </div>
              </div>

              {/* On-Chain Verification Footer */}
              <div className="w-full pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 uppercase">Certificate Serial Number</div>
                  <div className="font-bold text-amber-300">{certificate_id || `VF-ESG-${plot?.id || 1}-9X2B`}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Immutable Transaction Hash</div>
                  <a
                    href={`https://amoy.polygonscan.com/tx/${retire_tx_hash || credit?.purchase_tx_hash || '0x'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
                  >
                    <span>{(retire_tx_hash || credit?.mint_tx_hash || '0x4d5e...').slice(0, 16)}...</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
