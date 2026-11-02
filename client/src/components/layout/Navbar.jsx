import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves, Shield, Wallet, ChevronDown, Check, Sparkles, Sprout, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';
import { formatAddress } from '../../utils/formatters';

export default function Navbar() {
  const location = useLocation();
  const { user, role, switchDemoRole } = useAuth();
  const { account, connectWallet, isConnecting, isDemoMode, setIsDemoMode, balance } = useWeb3();
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const roles = [
    { id: 'farmer', label: 'Farmer Portal', icon: Sprout, desc: 'GPS Plot Registration' },
    { id: 'admin', label: 'MRV Auditor Studio', icon: Shield, desc: 'NASA Satellite Telemetry & Minting' },
    { id: 'buyer', label: 'ESG Corporate Buyer', icon: Building2, desc: 'Marketplace & Retirement' },
  ];

  const currentRoleConfig = roles.find((r) => r.id === role) || roles[1];
  const CurrentIcon = currentRoleConfig.icon;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center p-2.5 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Waves className="w-full h-full text-obsidian-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                Veri<span className="text-emerald-400">Flow</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                v2.0 Web
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wider">
              BLUE CARBON MRV REGISTRY
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            to="/marketplace"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              location.pathname === '/marketplace'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Marketplace
          </Link>

          <Link
            to="/farmer"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              location.pathname.startsWith('/farmer')
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Farmer Portal
          </Link>

          <Link
            to="/admin/mrv"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              location.pathname.startsWith('/admin')
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            MRV Studio
          </Link>

          <Link
            to="/buyer/portfolio"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              location.pathname.startsWith('/buyer')
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            My Portfolio
          </Link>
        </nav>

        {/* Right Section: 1-Click Role Switcher & Web3 Wallet */}
        <div className="flex items-center gap-3">
          
          {/* 1-Click Evaluator Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/90 border border-emerald-500/40 text-slate-200 hover:border-emerald-400 transition-all shadow-sm"
              title="Click to switch persona (Farmer, MRV Auditor, Corporate Buyer)"
            >
              <CurrentIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentRoleConfig.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl p-2 border border-emerald-500/30 shadow-2xl z-50">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Switch Active Persona
                </div>
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isActive = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchDemoRole(r.id);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-500 text-obsidian-950' : 'bg-slate-800 text-slate-300'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{r.label}</div>
                        <div className="text-[10px] text-slate-400">{r.desc}</div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Web3 Wallet Connect Button */}
          {account ? (
            <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex flex-col text-right">
                <span className="font-mono text-slate-200 font-semibold">{formatAddress(account)}</span>
                <span className="text-[10px] text-emerald-400 font-mono">{balance} MATIC</span>
              </div>
              {isDemoMode && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Demo
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-obsidian-950 font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
