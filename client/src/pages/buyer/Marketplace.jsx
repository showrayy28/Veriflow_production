import React, { useState, useEffect } from 'react';
import { ShoppingCart, Filter, Search, Award, RefreshCw, Sparkles } from 'lucide-react';
import CreditCard from '../../components/marketplace/CreditCard';
import ESGCertificate from '../../components/marketplace/ESGCertificate';
import TransactionModal from '../../components/shared/TransactionModal';
import apiClient from '../../config/api';
import { useWeb3 } from '../../context/Web3Context';
import { useAuth } from '../../context/AuthContext';
import { MANGROVE_SPECIES } from '../../config/constants';

export default function Marketplace() {
  const { account, purchaseOnChain, retireOnChain } = useWeb3();
  const { user } = useAuth();

  const [plots, setPlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [speciesFilter, setSpeciesFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Purchase Modal State
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState(0);
  const [purchaseTxHash, setPurchaseTxHash] = useState(null);
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);

  // ESG Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  const purchaseSteps = [
    'Verifying contract escrow availability on Polygon Amoy',
    'Awaiting MetaMask purchase signature with exact MATIC value',
    'Atomic escrow transfer to buyer & direct payment to farmer',
    'Synchronizing credit ownership in PostgreSQL registry',
  ];

  const fetchPlots = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/plots');
      if (res.data?.data) {
        setPlots(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load marketplace plots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  // Purchase Handler
  const handlePurchase = async (plot) => {
    setIsPurchaseModalOpen(true);
    setPurchaseStep(0);
    setPurchaseTxHash(null);
    setIsPurchaseComplete(false);
    setPurchaseError(null);

    const tokenId = plot.credit?.token_id || plot.id + 100;
    const priceMatic = plot.credit?.price_matic || 0.25;

    try {
      setPurchaseStep(1);
      const onChainRes = await purchaseOnChain({
        tokenId,
        priceMatic,
        onStepUpdate: (msg) => {
          if (msg.includes('MetaMask')) setPurchaseStep(1);
          if (msg.includes('escrow') || msg.includes('Polygon')) setPurchaseStep(2);
        },
      });

      setPurchaseTxHash(onChainRes.txHash);
      setPurchaseStep(3);

      // Record in PostgreSQL
      await apiClient.post(`/plots/${plot.id}/record-purchase`, {
        buyer_wallet: account || '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        purchase_tx_hash: onChainRes.txHash,
        retire_immediately: false,
      });

      setIsPurchaseComplete(true);
      await fetchPlots();
    } catch (err) {
      console.error('Purchase failed:', err);
      setPurchaseError(err.message || 'Purchase transaction failed');
    }
  };

  // Retire Handler
  const handleRetire = async (plot) => {
    const defaultBeneficiary = user?.full_name || 'GreenFuture ESG Capital Corp';
    const beneficiary = window.prompt(
      'Enter ESG Offset Beneficiary Statement / Company Name:',
      defaultBeneficiary
    );
    if (!beneficiary) return;

    try {
      const tokenId = plot.credit?.token_id || plot.id + 100;
      const onChainRes = await retireOnChain({
        tokenId,
        reason: `${beneficiary} - Blue Carbon Net-Zero Commitment`,
      });

      // Synchronize retirement in database and receive certificate payload
      const res = await apiClient.post(`/plots/${plot.id}/retire`, {
        beneficiary,
        retire_tx_hash: onChainRes.txHash,
      });

      if (res.data?.certificate) {
        setCertificateData(res.data.certificate);
        setIsCertModalOpen(true);
      }
      await fetchPlots();
    } catch (err) {
      alert('Retirement failed: ' + err.message);
    }
  };

  // View Existing Certificate
  const handleViewCertificate = (plot) => {
    const cert = {
      certificate_id: `VF-ESG-${plot.id}-CERT`,
      plot,
      report: plot.report,
      credit: plot.credit,
      beneficiary: plot.credit?.retirement_beneficiary || 'GreenFuture ESG Capital Corp',
      retired_at: plot.credit?.retired_at || plot.updated_at,
      retire_tx_hash: plot.credit?.purchase_tx_hash || plot.credit?.mint_tx_hash,
    };
    setCertificateData(cert);
    setIsCertModalOpen(true);
  };

  // Filtered plots (only plots that have been MINTED, SOLD, or RETIRED appear in marketplace)
  const marketplacePlots = plots.filter((p) => {
    const isMarketplaceReady = p.status === 'MINTED' || p.status === 'SOLD' || p.status === 'RETIRED';
    if (!isMarketplaceReady) return false;

    if (speciesFilter !== 'ALL' && p.species !== speciesFilter) return false;
    if (statusFilter === 'FOR_SALE' && (p.status !== 'MINTED' || !p.credit?.is_for_sale)) return false;
    if (statusFilter === 'RETIRED' && p.status !== 'RETIRED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchRegion = p.region_name.toLowerCase().includes(q);
      const matchSpecies = p.species.toLowerCase().includes(q);
      if (!matchTitle && !matchRegion && !matchSpecies) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShoppingCart className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Blue Carbon Credit Marketplace</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Contract Escrow Listings • Direct MATIC Settlement to Coastal Farmers • Permanent ESG Retirement
          </p>
        </div>

        <button
          onClick={fetchPlots}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Listings</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by mangrove region, title, or species..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Listing States</option>
            <option value="FOR_SALE">Listed For Sale</option>
            <option value="RETIRED">Retired (ESG Offsets)</option>
          </select>

          {/* Species Filter */}
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Mangrove Species</option>
            {MANGROVE_SPECIES.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Credit Cards Grid */}
      {marketplacePlots.length === 0 && !isLoading ? (
        <div className="glass-card text-center py-16 rounded-2xl">
          <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No marketplace credits matched your filters</h3>
          <p className="text-xs text-slate-400">
            Check the MRV Studio to verify pending plots and mint new carbon credits.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplacePlots.map((plot) => (
            <CreditCard
              key={plot.id}
              plot={plot}
              onPurchase={handlePurchase}
              onRetire={handleRetire}
              onViewCertificate={handleViewCertificate}
              currentAccount={account}
            />
          ))}
        </div>
      )}

      {/* Live Blockchain Purchase Stepper Modal */}
      <TransactionModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        title="Executing On-Chain Escrow Purchase"
        steps={purchaseSteps}
        currentStep={purchaseStep}
        txHash={purchaseTxHash}
        isComplete={isPurchaseComplete}
        error={purchaseError}
        successMessage="Carbon Credit Transferred to Your Wallet & MATIC Sent to Coastal Farmer!"
      />

      {/* ESG Offset Certificate Modal */}
      <ESGCertificate
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificateData={certificateData}
      />

    </div>
  );
}
