import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, Shield, Sprout, Building2, ArrowRight, Loader2, Lock, Mail, User } from 'lucide-react';
import GlassCard from '../components/shared/GlassCard';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../config/constants';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, switchDemoRole } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'farmer',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    let res;
    if (isRegister) {
      res = await register(formData);
    } else {
      res = await login(formData.email, formData.password);
    }

    setIsSubmitting(false);
    if (res?.success) {
      navigate('/marketplace');
    } else {
      setError(res?.message || 'Authentication failed');
    }
  };

  const handleQuickDemoLogin = (roleKey) => {
    switchDemoRole(roleKey);
    if (roleKey === 'farmer') navigate('/farmer');
    else if (roleKey === 'admin') navigate('/admin/mrv');
    else navigate('/marketplace');
  };

  return (
    <div className="max-w-md mx-auto my-8 flex flex-col gap-6">
      
      {/* Brand Header */}
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center p-2.5 mx-auto mb-3 shadow-lg shadow-emerald-500/25">
          <Waves className="w-full h-full text-obsidian-950 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">
          {isRegister ? 'Create VeriFlow Account' : 'Welcome to VeriFlow'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Decentralized Blue Carbon MRV Registry & Marketplace
        </p>
      </div>

      {/* 1-Click Fast-Track Demo Login Buttons */}
      <div className="glass-card p-4 rounded-2xl border border-emerald-500/30">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-2 text-center">
          ⚡ 1-Click Evaluator Fast-Track Login
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('farmer')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/50 flex flex-col items-center text-center transition-all group"
          >
            <Sprout className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-white">Farmer</span>
            <span className="text-[9px] text-slate-400">Ramesh</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('admin')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-teal-500/20 border border-slate-700 hover:border-teal-500/50 flex flex-col items-center text-center transition-all group"
          >
            <Shield className="w-4 h-4 text-teal-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-white">Auditor</span>
            <span className="text-[9px] text-slate-400">Dr. Aris</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('buyer')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-500/20 border border-slate-700 hover:border-indigo-500/50 flex flex-col items-center text-center transition-all group"
          >
            <Building2 className="w-4 h-4 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-white">Buyer</span>
            <span className="text-[9px] text-slate-400">GreenFuture</span>
          </button>
        </div>
      </div>

      {/* Main Auth Form Card */}
      <GlassCard className="p-6">
        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-5 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`py-2 rounded-lg transition-all ${
              !isRegister ? 'bg-emerald-500 text-obsidian-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`py-2 rounded-lg transition-all ${
              isRegister ? 'bg-emerald-500 text-obsidian-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Mondal"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Platform Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="farmer">Coastal Mangrove Farmer</option>
                <option value="admin">MRV Lead Auditor</option>
                <option value="buyer">Corporate ESG Buyer</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-obsidian-950 flex items-center justify-center gap-2 transition-all shadow-md"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>
      </GlassCard>

    </div>
  );
}
