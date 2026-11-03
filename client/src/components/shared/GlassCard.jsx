import React from 'react';

export default function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  glow = false,
}) {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 ${
        hoverEffect ? 'glass-card-hover' : ''
      } ${glow ? 'shadow-glow-emerald border-emerald-500/40' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
