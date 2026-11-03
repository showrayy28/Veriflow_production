import React from 'react';
import { Clock, CheckCircle2, Coins, ArrowRightLeft, Award } from 'lucide-react';

export default function StatusBadge({ status, className = '' }) {
  const normStatus = (status || 'SUBMITTED').toUpperCase();

  const configs = {
    SUBMITTED: {
      label: 'Submitted',
      icon: Clock,
      style: 'badge-submitted',
      dot: 'bg-amber-400',
    },
    VERIFIED: {
      label: 'MRV Verified',
      icon: CheckCircle2,
      style: 'badge-verified',
      dot: 'bg-teal-400',
    },
    MINTED: {
      label: 'NFT Minted',
      icon: Coins,
      style: 'badge-minted',
      dot: 'bg-emerald-400',
    },
    SOLD: {
      label: 'Sold to Buyer',
      icon: ArrowRightLeft,
      style: 'badge-sold',
      dot: 'bg-indigo-400',
    },
    RETIRED: {
      label: 'Retired (ESG)',
      icon: Award,
      style: 'badge-retired',
      dot: 'bg-yellow-400',
    },
  };

  const config = configs[normStatus] || configs.SUBMITTED;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${config.style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}
