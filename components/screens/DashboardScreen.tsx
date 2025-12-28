/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Dashboard Evolution — GOLD MASTER REAL
═══════════════════════════════════════════════════════════════════════════════
*/

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bell, Eye, EyeOff, QrCode, ArrowUpRight, ArrowDownLeft, 
  Wallet, TrendingUp, ShieldCheck, Sparkles, HelpCircle, 
  Cpu, Activity, Lock, ArrowRight, Zap, Globe, Fingerprint,
  RefreshCcw, Shield
} from 'lucide-react';
import { ScreenProps, ScreenName } from '../../types';
import { MOCK_USER } from '../../constants';
import { formatCurrency } from '../../services/formatters';
import { GlassCard } from '../ui/GlassCard';
import { BottomNav } from '../Layout/BottomNav';
import { Money } from '../../domain/Money';
import { Account } from '../../domain/Account';
import { DeviceShell } from '../shared/DeviceShell';
import { QuantumGuard } from '../../services/QuantumGuard';

export const DashboardScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [systemHealth, setSystemHealth] = useState(QuantumGuard.getIntegrityStatus());
  
  // Don: Core Ledger Initialization
  const account = useMemo(() => new Account(
    "ACC-GM-001",
    Money.fromCents(MOCK_USER.balance)
  ), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(QuantumGuard.getIntegrityStatus());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { icon: QrCode, label: 'Pix', screen: 'pix' as ScreenName, color: 'text-[#00F0FF]' },
    { icon: ArrowUpRight, label: 'Enviar', screen: 'pix-transfer' as ScreenName, color: 'text-white' },
    { icon: Wallet, label: 'Pagar', screen: 'dashboard' as ScreenName, color: 'text-white' },
    { icon: TrendingUp, label: 'Investir', screen: 'investment-hub' as ScreenName, color: 'text-[#10B981]' },
  ];

  return (
    <DeviceShell>
      <div className="flex-1 bg-black flex flex-col overflow-hidden relative">
        <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-[#3A66FF]/10 rounded-full blur-[120px] pointer-events-none animate-quantum" />
        <div className="scanline" />
        
        {/* Header: Executive Presence */}
        <div className="px-6 py-8 flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onNavigate('profile-edit')} 
              className="relative group cursor-pointer active:scale-95 transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A66FF] to-[#00F0FF] rounded-2xl blur-md opacity-40" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3A66FF] to-[#06B6D4] p-[1px] relative">
                <div className="w-full h-full rounded-[15px] bg-black flex items-center justify-center text-white font-black text-lg">
                  {MOCK_USER.name.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-black flex items-center justify-center">
                 <ShieldCheck size={10} className="text-black" />
              </div>
            </div>
            <div>
              <p className="text-[#3A66FF] text-[9px] uppercase font-black tracking-[0.3em] animate-pulse">Gold Master Real</p>
              <h1 className="text-white font-bold text-base tracking-tight">{MOCK_USER.name}</h1>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex flex-col items-end mr-3">
               <span className="text-[8px] text-[#9CA3AF] font-bold uppercase tracking-widest opacity-40">Integridade</span>
               <span className="text-[10px] text-[#00F0FF] font-mono font-medium">{systemHealth.entropy}%</span>
            </div>
            <button onClick={() => onNavigate('notifications')} className="relative w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-[#FF3B30] rounded-full border-2 border-black shadow-[0_0_10px_rgba(255,59,48,0.5)]" />
            </button>
          </div>
        </div>

        {/* Content Flow */}
        <div className="flex-1 px-6 space-y-6 overflow-y-auto no-scrollbar pb-32 relative z-10">
          
          {/* Main Liquidity Card: Quantum Core */}
          <GlassCard variant="neo" className="!p-8 border-white/10 group relative overflow-hidden" onClick={() => onNavigate('investment-hub')} hoverEffect>
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Cpu size={80} className="text-[#3A66FF]" />
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                <span className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.25em]">Liquidez Quantum Core</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40">
                {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            
            <div className="flex flex-col">
              <span className="text-white text-4xl font-black tracking-tighter sm:text-5xl">
                {showBalance ? formatCurrency(account.getBalance()) : 'R$ ••••••••'}
              </span>
              <div className="mt-4 flex items-center gap-4">
                <div className="bg-[#10B981]/10 px-2.5 py-1 rounded-lg border border-[#10B981]/20 flex items-center gap-1.5">
                    <Activity size={10} className="text-[#10B981]" />
                    <span className="text-[#10B981] text-[10px] font-black">+1.25%</span>
                </div>
                <span className="text-[#9CA3AF] text-[9px] font-bold uppercase tracking-[0.15em] opacity-60">Delta 24h: +R$ 15.625,00</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
               <div className="flex gap-2">
                  <div className="w-8 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                     <Lock size={10} className="text-white/40" />
                  </div>
                  <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-1">Shield Ativo: 0xF2..A1</span>
               </div>
               <ArrowRight size={16} className="text-white/20 group-hover:text-[#3A66FF] group-hover:translate-x-1 transition-all" />
            </div>
          </GlassCard>

          {/* Quick Atomic Actions */}
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button 
                key={i} 
                onClick={() => onNavigate(action.screen)} 
                className="flex flex-col items-center gap-2.5 group"
              >
                <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#3A66FF]/10 group-hover:border-[#3A66FF]/30 group-active:scale-90 transition-all shadow-xl">
                  <action.icon size={24} className={action.color} />
                </div>
                <span className="text-[9px] text-[#9CA3AF] font-black uppercase tracking-widest group-hover:text-white transition-colors">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Rapha AI Insight: Dynamic Integration */}
          <div 
              onClick={() => onNavigate('chat')} 
              className="p-6 rounded-[32px] bg-gradient-to-br from-[#1A1F3D] to-[#0A0E17] border border-[#3A66FF]/20 cursor-pointer flex items-center gap-5 relative overflow-hidden group hover:border-[#3A66FF]/50 transition-all shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#3A66FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3A66FF] to-[#00F0FF] flex items-center justify-center text-white shadow-[0_0_20px_rgba(58,102,255,0.4)] animate-float">
              <Sparkles size={28} fill="currentColor" />
            </div>
            <div className="flex-1 relative z-10">
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#00F0FF] font-black text-[9px] uppercase tracking-[0.25em]">Rapha Alpha Core</span>
                  <div className="w-1 h-1 rounded-full bg-[#10B981] animate-pulse" />
               </div>
               <p className="text-white text-sm font-medium leading-tight">Sugestão: Realocar excedente em CDB 110%.</p>
               <p className="text-[#9CA3AF] text-[10px] mt-1 opacity-60">Análise de risco concluída em 12ms.</p>
            </div>
            <ArrowRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>

          {/* Ledger History: Atomic Records */}
          <div className="pb-4">
            <div className="flex items-center justify-between mb-5 px-2">
               <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                  <Shield size={12} /> Immutable Ledger
               </h3>
               <button className="text-[#3A66FF] text-[9px] font-black uppercase tracking-widest hover:underline">Auditar Tudo</button>
            </div>
            <div className="space-y-3">
              <GlassCard className="flex items-center justify-between py-5 px-6 border-white/5 group" hoverEffect onClick={() => onNavigate('transaction-detail')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shadow-inner group-hover:bg-[#10B981]/20 transition-colors">
                    <ArrowDownLeft size={22} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm tracking-tight">Dividendos Regenera</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest opacity-60">Payout Auto</span>
                       <div className="w-1 h-1 rounded-full bg-white/10" />
                       <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest opacity-40 font-mono">HASH: 8A2E</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[#10B981] font-black text-sm tracking-tighter">+R$ 5.000,00</p>
                   <p className="text-[8px] text-[#9CA3AF] font-bold uppercase mt-1 opacity-40">SETTLED</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Don Supremo Signature Watermark */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none opacity-[0.03] select-none">
           <span className="text-[60px] font-black tracking-[1em] text-white">REGENERA</span>
        </div>

        <BottomNav activeScreen="dashboard" onNavigate={onNavigate} />
      </div>
    </DeviceShell>
  );
};
