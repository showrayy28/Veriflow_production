import React from 'react';
import Navbar from './Navbar';
import { Waves, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-obsidian-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-slate-800/80 bg-obsidian-950/80 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-emerald-400" />
            <span>VeriFlow Web 2.0 • Decentralized Blue Carbon MRV Registry</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> NASA POWER Earth Observation
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Polygon Amoy (Chain 80002)
            </span>
            <span>•</span>
            <a
              href="https://amoy.polygonscan.com/address/0x3565F438cf15D91444dE3D35B3B7075A0693a7eb"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Smart Contract <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
