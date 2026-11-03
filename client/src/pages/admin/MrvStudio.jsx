import React, { useState, useEffect } from 'react';
import { Shield, Play, Loader2, CheckCircle2, Sparkles, MapPin, Eye, Coins, ExternalLink, RefreshCw } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import StatusBadge from '../../components/shared/StatusBadge';
import NdviGauge from '../../components/charts/NdviGauge';
import BiomassChart from '../../components/charts/BiomassChart';
import CarbonProjection from '../../components/charts/CarbonProjection';
import TransactionModal from '../../components/shared/TransactionModal';
import apiClient from '../../config/api';
import { useWeb3 } from '../../context/Web3Context';
import { formatTons, formatMatic } from '../../utils/formatters';

export default function MrvStudio() {
  const { mintOnChain, account, isDemoMode } = useWeb3();

  const [plots, setPlots] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isLoadingPlots, setIsLoadingPlots] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Minting transaction modal state
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [mintStep, setMintStep] = useState(0);
  const [mintTxHash, setMintTxHash] = useState(null);
  const [isMintComplete, setIsMintComplete] = useState(false);
  const [mintError, setMintError] = useState(null);

  const mintSteps = [
    'Building OpenSea-standard ERC-721 metadata schema',
    'Pinning satellite telemetry & MRV proof to IPFS',
    'Awaiting Polygon Amoy signature in MetaMask',
    'Broadcasting mintCarbonCredit() into contract escrow',
    'Synchronizing minted NFT credit with PostgreSQL registry',
  ];

  const fetchPlots = async () => {
    setIsLoadingPlots(true);
    try {
      const res = await apiClient.get('/plots');
      if (res.data?.data) {
        setPlots(res.data.data);
        if (!selectedPlot && res.data.data.length > 0) {
          setSelectedPlot(res.data.data[0]);
        } else if (selectedPlot) {
          const updated = res.data.data.find((p) => p.id === selectedPlot.id);
          if (updated) setSelectedPlot(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load plots for MRV:', err);
    } finally {
      setIsLoadingPlots(false);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  // Run Satellite Remote Sensing Analysis
  const handleRunSatelliteAnalysis = async () => {
    if (!selectedPlot) return;
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const res = await apiClient.post(`/plots/${selectedPlot.id}/verify-satellite`);
      if (res.data?.success) {
        setVerificationResult(res.data);
        await fetchPlots();
      }
    } catch (err) {
      alert('Satellite analysis failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsVerifying(false);
    }
  };

  // Launch IPFS Pinning + MetaMask Minting
  const handleMintCarbonNFT = async () => {
    if (!selectedPlot) return;

    setIsMintModalOpen(true);
    setMintStep(0);
    setMintTxHash(null);
    setIsMintComplete(false);
    setMintError(null);

    try {
      // Step 0: Prepare metadata & pin to IPFS
      setMintStep(1);
      const prepRes = await apiClient.post(`/plots/${selectedPlot.id}/prepare-mint`, {
        price_matic: 0.25,
        farmer_wallet: selectedPlot.farmer_wallet || '0x71C83D431a89c9d4b009FE543477F5B648834465',
      });

      if (!prepRes.data?.success) {
        throw new Error('Failed to pin metadata to IPFS');
      }

      const { ipfs_uri, carbon_kg } = prepRes.data;

      // Step 2 & 3: Invoke Solidity Contract
      setMintStep(2);
      const onChainRes = await mintOnChain({
        farmerWallet: selectedPlot.farmer_wallet || '0x71C83D431a89c9d4b009FE543477F5B648834465',
        carbonKg: carbon_kg || 664250,
        priceMatic: 0.25,
        coords: `${selectedPlot.latitude},${selectedPlot.longitude}`,
        tokenUri: ipfs_uri,
        onStepUpdate: (msg) => {
          if (msg.includes('MetaMask')) setMintStep(2);
          if (msg.includes('Broadcasting') || msg.includes('Waiting for block')) setMintStep(3);
        },
      });

      setMintTxHash(onChainRes.txHash);
      setMintStep(4);

      // Step 4: Record in PostgreSQL database
      await apiClient.post(`/plots/${selectedPlot.id}/record-mint`, {
        token_id: onChainRes.tokenId,
        contract_address: '0x3565F438cf15D91444dE3D35B3B7075A0693a7eb',
        farmer_wallet: selectedPlot.farmer_wallet || '0x71C83D431a89c9d4b009FE543477F5B648834465',
        price_matic: 0.25,
        ipfs_metadata_uri: ipfs_uri,
        mint_tx_hash: onChainRes.txHash,
      });

      setIsMintComplete(true);
      await fetchPlots();
    } catch (err) {
      console.error('Minting error:', err);
      setMintError(err.message || 'On-chain transaction failed');
    }
  };

  const report = selectedPlot?.report;
  const isVerified = selectedPlot?.status === 'VERIFIED' || !!report;
  const isMinted = selectedPlot?.status === 'MINTED' || selectedPlot?.status === 'SOLD' || selectedPlot?.status === 'RETIRED';

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">MRV Verification & Minting Studio</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Zero-Image NASA POWER Agro-Climatic Earth Observation • IPCC Tier-2 Allometry • Polygon Amoy Minting
          </p>
        </div>

        <button
          onClick={fetchPlots}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPlots ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Main Studio Layout: Queue Sidebar + Telemetry Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Verification Queue */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold uppercase tracking-wider">
            <span>Verification Queue ({plots.length})</span>
            <span className="text-[10px] text-emerald-400">Live Status Sync</span>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {plots.map((plot) => {
              const isSelected = selectedPlot?.id === plot.id;
              return (
                <div
                  key={plot.id}
                  onClick={() => {
                    setSelectedPlot(plot);
                    setVerificationResult(null);
                  }}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-900/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                      : 'glass-card border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      PLOT #{plot.id}
                    </span>
                    <StatusBadge status={plot.status} />
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">{plot.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="line-clamp-1">{plot.region_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                    <span>{plot.area_hectares} Ha</span>
                    <span className="italic">{plot.species.split(' ')[0]}</span>
                    <span>{plot.report ? `${formatTons(plot.report.co2_tons_total)}` : 'Pending'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Plot Telemetry Studio */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {selectedPlot ? (
            <>
              {/* Studio Header Card */}
              <GlassCard className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        INSPECTION TARGET: PLOT #{selectedPlot.id}
                      </span>
                      <StatusBadge status={selectedPlot.status} />
                    </div>
                    <h2 className="text-xl font-bold text-white">{selectedPlot.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Coordinates: <span className="text-emerald-400 font-mono">{selectedPlot.latitude.toFixed(6)}, {selectedPlot.longitude.toFixed(6)}</span> • Area: <span className="font-mono">{selectedPlot.area_hectares} Hectares</span>
                    </p>
                  </div>

                  {/* Actions: Run Analysis or Mint NFT */}
                  <div className="flex items-center gap-2">
                    {selectedPlot.status === 'SUBMITTED' && (
                      <button
                        onClick={handleRunSatelliteAnalysis}
                        disabled={isVerifying}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-obsidian-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Querying NASA Earth Telemetry...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Run Satellite MRV Analysis</span>
                          </>
                        )}
                      </button>
                    )}

                    {selectedPlot.status === 'VERIFIED' && (
                      <button
                        onClick={handleMintCarbonNFT}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-obsidian-950 flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
                      >
                        <Coins className="w-4 h-4" />
                        <span>Approve & Mint Carbon Credit NFT</span>
                      </button>
                    )}

                    {isMinted && (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono">
                          MINTED (NFT #{selectedPlot.credit?.token_id})
                        </span>
                        {selectedPlot.credit?.mint_tx_hash && (
                          <a
                            href={`https://amoy.polygonscan.com/tx/${selectedPlot.credit.mint_tx_hash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                            title="View on PolygonScan"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* NASA Telemetry Ribbon */}
                {report && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800 text-xs">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Solar Irradiance</span>
                      <span className="font-mono font-bold text-amber-400">{report.solar_irradiance} MJ/m²/day</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Coastal Humidity</span>
                      <span className="font-mono font-bold text-teal-400">{report.coastal_humidity}%</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Verified Net CO2e</span>
                      <span className="font-mono font-bold text-emerald-400">{formatTons(report.co2_tons_total)}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Pure Carbon Mass</span>
                      <span className="font-mono font-bold text-white">{(Number(report.carbon_kg_total)).toLocaleString()} kg</span>
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* Recharts Analytics Studio (3 Gauges) */}
              {report ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NdviGauge
                    ndviScore={Number(report.ndvi_score)}
                    canopyCoverPct={Number(report.canopy_cover_pct)}
                  />
                  <BiomassChart
                    agb={Number(report.agb_mg_per_ha)}
                    bgb={Number(report.bgb_mg_per_ha)}
                    soc={Number(report.soc_mg_per_ha)}
                    species={selectedPlot.species}
                  />
                  <CarbonProjection
                    baseCo2Tons={Number(report.co2_tons_total)}
                    projections={verificationResult?.projections}
                  />
                </div>
              ) : (
                <GlassCard className="text-center py-16 flex flex-col items-center justify-center">
                  <Shield className="w-12 h-12 text-slate-600 mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Awaiting Satellite MRV Analysis</h3>
                  <p className="text-xs text-slate-400 max-w-md mb-6">
                    Click "Run Satellite MRV Analysis" above to query NASA POWER Earth Observation telemetry and compute NDVI, biomass splits, and tCO2e sequestration.
                  </p>
                  <button
                    onClick={handleRunSatelliteAnalysis}
                    disabled={isVerifying}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 flex items-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Querying NASA Earth Telemetry...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Run Satellite Analysis Now</span>
                      </>
                    )}
                  </button>
                </GlassCard>
              )}
            </>
          ) : (
            <GlassCard className="text-center py-16">
              <span className="text-sm text-slate-400">Select a plot from the queue to inspect telemetry</span>
            </GlassCard>
          )}
        </div>

      </div>

      {/* Live Blockchain Minting Modal */}
      <TransactionModal
        isOpen={isMintModalOpen}
        onClose={() => setIsMintModalOpen(false)}
        title="Minting Blue Carbon Credit NFT into Escrow"
        steps={mintSteps}
        currentStep={mintStep}
        txHash={mintTxHash}
        isComplete={isMintComplete}
        error={mintError}
        successMessage="Carbon Credit NFT Minted into Escrow and Listed on Marketplace!"
      />

    </div>
  );
}
