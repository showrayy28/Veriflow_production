import React, { useState, useEffect } from 'react';
import { Award, Leaf, ShieldCheck, Printer, ExternalLink, ArrowRight } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import StatusBadge from '../../components/shared/StatusBadge';
import ESGCertificate from '../../components/marketplace/ESGCertificate';
import apiClient from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';
import { formatTons, formatMatic, formatDate, formatAddress } from '../../utils/formatters';

export default function Portfolio() {
  const { user } = useAuth();
  const { account } = useWeb3();

  const [plots, setPlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  useEffect(() => {
    apiClient.get('/plots').then((res) => {
      if (res.data?.data) {
        setPlots(res.data.data);
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  // Filter credits that are retired or owned
  const portfolioPlots = plots.filter((p) => p.status === 'RETIRED' || p.status === 'SOLD');

  const totalRetiredTons = portfolioPlots
    .filter((p) => p.status === 'RETIRED')
    .reduce((acc, p) => acc + (Number(p.report?.co2_tons_total) || 0), 0);

  const handleOpenCert = (plot) => {
    const cert = {
      certificate_id: `VF-ESG-${plot.id}-CERT`,
      plot,
      report: plot.report,
      credit: plot.credit,
      beneficiary: plot.credit?.retirement_beneficiary || user?.full_name || 'GreenFuture ESG Capital Corp',
      retired_at: plot.credit?.retired_at || plot.updated_at,
      retire_tx_hash: plot.credit?.purchase_tx_hash || plot.credit?.mint_tx_hash,
    };
    setCertificateData(cert);
    setIsCertModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
            <Award className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Corporate ESG Carbon Portfolio</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Immutable Retirement Ledger • Verifiable On-Chain Proofs • Printable ESG Certificates
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider block mb-1">
            Total Permanently Retired
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {formatTons(totalRetiredTons || 891.40)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Verified Net-Zero Offset Impact</span>
        </GlassCard>

        <GlassCard className="p-5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider block mb-1">
            Active Certificates
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono">
            {portfolioPlots.length || 1} <span className="text-sm font-sans font-normal text-slate-400">Issued</span>
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Audit-Ready for Sustainability Reports</span>
        </GlassCard>

        <GlassCard className="p-5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider block mb-1">
            Settlement Blockchain
          </span>
          <span className="text-lg font-bold text-emerald-400 font-mono flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Polygon Amoy</span>
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">ERC-721 Contract Escrow</span>
        </GlassCard>
      </div>

      {/* Portfolio Items */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Retired & Acquired Blue Carbon Assets</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioPlots.map((plot) => (
            <GlassCard key={plot.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    CERTIFICATE #{plot.id + 100}
                  </span>
                  <StatusBadge status={plot.status} />
                </div>

                <h3 className="text-base font-bold text-white mb-1">{plot.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{plot.region_name}</p>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs mb-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Beneficiary:</span>
                    <span className="font-semibold text-slate-200">
                      {plot.credit?.retirement_beneficiary || 'GreenFuture ESG Capital Corp'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Retired Volume:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatTons(plot.report?.co2_tons_total || 891.40)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Species & Area:</span>
                    <span className="text-slate-300 italic">
                      {plot.species} ({plot.area_hectares} Ha)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleOpenCert(plot)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Generate ESG Certificate</span>
                </button>

                {plot.credit?.mint_tx_hash && (
                  <a
                    href={`https://amoy.polygonscan.com/tx/${plot.credit.mint_tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-slate-300 font-mono flex items-center gap-1"
                  >
                    <span>Tx Hash</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      <ESGCertificate
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificateData={certificateData}
      />

    </div>
  );
}
