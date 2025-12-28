/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Dashboard & Ecosystem Navigation
   
  Developer: Don Paulo Ricardo
  CEO: Raphaela Cervesky
   
  ORCID: https://orcid.org/0009-0002-1934-3559
  Copyright © 2025 Regenera Ecosystem. All rights reserved.
═══════════════════════════════════════════════════════════════════════════════
*/

// [FILE] components/screens/DashboardScreen.tsx
import React, { useState } from 'react';
import { 
  Bell, Eye, EyeOff, QrCode, ArrowUpRight, ArrowDownLeft, 
  Wallet, TrendingUp, Leaf, ShoppingBag, Gamepad2, Bone, 
  Aperture, ArrowRight, ShieldCheck, Sparkles, HelpCircle 
} from 'lucide-react';
import { ScreenProps, ScreenName } from '../../types';
import { MOCK_USER } from '../../constants';
import { formatCurrency } from '../../services/formatters';
import { GlassCard } from '../ui/GlassCard';
import { BottomNav } from '../Layout/BottomNav';

const WealthPulse = () => (
  <svg viewBox="0 0 100 30" className="w-24 h-10 overflow-visible">
    <defs>
      <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3A66FF" stopOpacity="0" />
        <stop offset="50%" stopColor="#06B6D4" stopOpacity="1" />
        <stop offset="100%" stopColor="#00F0FF" stopOpacity="1" />
      </linearGradient>
    </defs>
    <path 
      d="M0,25 C10,25 15,5 25,15 C35,25 45,5 55,10 C65,15 75,20 85,5 C95,-10 100,5 110,0" 
      fill="none" 
      stroke="url(#pulseGrad)" 
      strokeWidth="2.5" 
      strokeLinecap="round"
      className="animate-pulse"
    />
  </svg>
);

export const DashboardScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const quickActions = [
    { icon: QrCode, label: 'Pix', screen: 'pix' as ScreenName },
    { icon: ArrowUpRight, label: 'Enviar', screen: 'pix-transfer' as ScreenName },
    { icon: Wallet, label: 'Pagar', screen: 'dashboard' as ScreenName },
    { icon: TrendingUp, label: 'Investir', screen: 'investment-hub' as ScreenName },
  ];

  const ecosystem = [
    { title: 'Carbono', icon: Leaf, route: 'carbon' as ScreenName, color: 'text-[#10B981]' },
    { title: 'Store', icon: ShoppingBag, route: 'marketplace' as ScreenName, color: 'text-[#F59E0B]' },
    { title: 'Kids', icon: Gamepad2, route: 'kids' as ScreenName, color: 'text-[#8B5CF6]' },
    { title: 'Pets', icon: Bone, route: 'pets' as ScreenName, color: 'text-[#EC4899]' }
  ];

  return (
    <div className="relative h-screen bg-black flex flex-col overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3A66FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className={`px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('profile-edit')} 
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3A66FF] to-[#06B6D4] p-0.5 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center text-white font-bold text-sm">
              {MOCK_USER.name.charAt(0)}
            </div>
          </div>
          <div>
            <p className="text-[#9CA3AF] text-[10px] uppercase font-black tracking-widest opacity-60">Gold Master Access</p>
            <h1 className="text-white font-bold text-sm">Olá, {MOCK_USER.name}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate('support')} 
            className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 transition-all"
          >
            <HelpCircle size={20} />
          </button>
          <button 
            onClick={() => onNavigate('notifications')} 
            className="relative w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF3B30] rounded-full border-2 border-black animate-pulse" />
          </button>
        </div>
      </div>

      <div 
        className="flex-1 px-6 space-y-6 overflow-y-auto no-scrollbar pb-32 pt-4" 
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 20)}
      >
        <GlassCard 
          variant="neo" 
          className="!p-6 border-white/10 group overflow-hidden" 
          onClick={() => onNavigate('investment-hub')} 
          hoverEffect
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={80} className="text-[#3A66FF]" />
          </div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#3A66FF]" />
              <span className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.2em]">Liquidez Disponível</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }} 
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          
          <div className="flex items-end justify-between relative z-10">
            <div>
              <span className="text-white text-4xl font-black tracking-tighter">
                {showBalance ? formatCurrency(MOCK_USER.balance) : 'R$ ••••••••'}
              </span>
              <div className="mt-3 flex items-center gap-2">
                <div className="bg-[#10B981]/10 px-2 py-0.5 rounded flex items-center gap-1 border border-[#10B981]/20">
                    <TrendingUp size={12} className="text-[#10B981]" />
                    <span className="text-[#10B981] text-[10px] font-black">+1.25%</span>
                </div>
                <span className="text-[#9CA3AF] text-[9px] font-bold uppercase tracking-widest">Yield Mensal</span>
              </div>
            </div>
            <div className="pb-1 opacity-60 group-hover:opacity-100 transition-opacity">
              <WealthPulse />
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button 
                key={i} 
                onClick={() => onNavigate(action.screen)} 
                className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#3A66FF]/20 group-hover:border-[#3A66FF]/30 transition-all shadow-xl">
                <action.icon size={22} className="group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[9px] text-[#9CA3AF] font-black uppercase tracking-tighter group-hover:text-white transition-colors">{action.label}</span>
            </button>
          ))}
        </div>

        <div 
            onClick={() => onNavigate('chat')} 
            className="p-5 rounded-3xl bg-gradient-to-br from-[#1A1F3D] to-[#0A0E17] border border-[#3A66FF]/20 cursor-pointer flex items-center gap-4 group hover:border-[#3A66FF]/40 transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3A66FF]/5 rounded-full blur-2xl group-hover:bg-[#3A66FF]/10 transition-colors" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3A66FF] to-[#00F0FF] flex items-center justify-center text-white shadow-lg shadow-[#3A66FF]/20 animate-pulse relative z-10">
            <Sparkles size={24} fill="currentColor" />
          </div>
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-1.5 mb-0.5">
               <span className="text-[#00F0FF] font-black text-[9px] uppercase tracking-[0.2em]">Rapha Insight</span>
               <div className="w-1 h-1 rounded-full bg-[#10B981] animate-ping" />
            </div>
            <p className="text-white text-sm font-medium leading-tight">Sua reserva de oportunidade rendeu <strong>R$ 450,00</strong> hoje. Deseja reinvestir?</p>
          </div>
          <ArrowRight size={18} className="text-white/40 group-hover:translate-x-1 group-hover:text-white transition-all relative z-10" />
        </div>

        <div>
           <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] opacity-40 mb-4 px-2">Ecosystem Horizon</h3>
           <div className="grid grid-cols-4 gap-3">
              {ecosystem.map((item, i) => (
                <button 
                    key={i} 
                    onClick={() => onNavigate(item.route)} 
                    className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                >
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${item.color} group-hover:bg-white/10 transition-all`}>
                        <item.icon size={22} />
                    </div>
                    <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-tighter">{item.title}</span>
                </button>
              ))}
           </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] opacity-40">Financial Ledger</h3>
            <button 
                onClick={() => onNavigate('analysis')} 
                className="text-[#3A66FF] text-[10px] font-black uppercase tracking-widest hover:underline"
            >
                View Full
            </button>
          </div>
          <div className="space-y-3">
            <GlassCard 
                className="flex items-center justify-between py-4 px-5 border-white/5 group hover:bg-white/5 active:scale-[0.99] transition-all" 
                hoverEffect 
                onClick={() => onNavigate('transaction-detail')}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <ArrowDownLeft size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Pix Recebido</p>
                  <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-widest opacity-60">Hoje • Carlos Silva • Quantum Guard OK</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#10B981] font-black text-sm tracking-tight">+R$ 1.500,00</p>
                <p className="text-[8px] text-[#9CA3AF] font-black uppercase mt-0.5">Liquidado</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <div className="fixed bottom-28 right-6 z-50">
        <button 
            onClick={() => onNavigate('ar-view')} 
            className="w-14 h-14 rounded-2xl bg-[#3A66FF] flex items-center justify-center shadow-[0_0_40px_rgba(58,102,255,0.4)] border border-white/20 active:scale-90 transition-all group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Aperture size={28} className="text-white animate-[spin_12s_linear_infinite]" />
        </button>
      </div>

      <BottomNav activeScreen="dashboard" onNavigate={onNavigate} />
    </div>
  );
};