import React from 'react';
import { ExternalLink, Award, ShoppingCart, ShieldCheck, MapPin, Sprout, Tag } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import { formatMatic, formatUsd, formatTons, formatAddress } from '../../utils/formatters';

export default function CreditCard({
  plot,
  onPurchase,
  onRetire,
  onViewCertificate,
  currentAccount,
  isProcessing = false,
}) {
  const credit = plot.credit;
  const report = plot.report;

  const isForSale = credit?.is_for_sale && plot.status === 'MINTED';
  const isRetired = credit?.is_retired || plot.status === 'RETIRED';
  const isSold = plot.status === 'SOLD' && !isRetired;

  const isOwner = currentAccount && credit?.owner_wallet &&
    credit.owner_wallet.toLowerCase() === currentAccount.toLowerCase();

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between glass-card-hover border border-emerald-500/20 group">
      
      {/* Top Banner with Token ID & Status */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              NFT #{credit?.token_id || plot.id + 100}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {plot.area_hectares} Ha
            </span>
          </div>
          <StatusBadge status={plot.status} />
        </div>

        {/* Title & Region */}
        <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mb-1">
          {plot.title}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="line-clamp-1">{plot.region_name}</span>
        </div>

        {/* Species & NDVI Badge */}
        <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800 mb-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="italic line-clamp-1">{plot.species}</span>
          </div>
          {report?.ndvi_score && (
            <span className="font-mono text-[11px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              NDVI {Number(report.ndvi_score).toFixed(3)}
            </span>
          )}
        </div>

        {/* Sequestration Metrics */}
        <div className="grid grid-cols-2 gap-2 text-center mb-4">
          <div className="bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total CO2e</span>
            <span className="text-base font-extrabold text-white font-mono">
              {formatTons(report?.co2_tons_total || 450.0)}
            </span>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Farmer Payout</span>
            <span className="text-xs font-mono text-slate-300 truncate block mt-0.5" title={plot.farmer_wallet}>
              {formatAddress(plot.farmer_wallet)}
            </span>
          </div>
        </div>

        {/* IPFS & PolygonScan Proof Links */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          {credit?.ipfs_metadata_uri ? (
            <a
              href={`https://ipfs.io/ipfs/${credit.ipfs_metadata_uri.replace('ipfs://', '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>IPFS Proof</span>
            </a>
          ) : (
            <span className="text-slate-500">IPFS: Pending</span>
          )}

          {credit?.mint_tx_hash && (
            <a
              href={`https://amoy.polygonscan.com/tx/${credit.mint_tx_hash}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-slate-300 hover:underline font-mono"
            >
              <span>PolygonScan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="p-5 pt-3 bg-slate-900/40 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registry Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white font-mono">
                {formatMatic(credit?.price_matic || 0.25)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({formatUsd(credit?.price_matic || 0.25)})
              </span>
            </div>
          </div>
          <Tag className="w-5 h-5 text-emerald-400/50" />
        </div>

        {/* Action Buttons based on lifecycle */}
        {isForSale && (
          <button
            onClick={() => onPurchase(plot)}
            disabled={isProcessing}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-obsidian-950 flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Purchase Carbon Credit</span>
          </button>
        )}

        {isSold && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onRetire(plot)}
              disabled={isProcessing}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-obsidian-950 flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Award className="w-4 h-4" />
              <span>Retire for ESG Offset</span>
            </button>
          </div>
        )}

        {isRetired && (
          <button
            onClick={() => onViewCertificate(plot)}
            className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 flex items-center justify-center gap-1.5 transition-all"
          >
            <Award className="w-4 h-4 text-yellow-400" />
            <span>View ESG Certificate</span>
          </button>
        )}
      </div>

    </div>
  );
}
