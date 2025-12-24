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
import React, { useState, useEffect } from 'react';
import { 
  Bell, Eye, EyeOff, QrCode, ArrowUpRight, ArrowDownLeft, 
  Wallet, CreditCard, TrendingUp, Leaf, ChevronRight, 
  Sparkles, ShieldCheck, Zap, Store, Gamepad2, Bone, Globe, Aperture,
  Search, ArrowRight, ShoppingBag
} from 'lucide-react';
import { ScreenProps, ScreenName } from '../../types';
import { MOCK_USER } from '../../constants';
import { formatCurrency } from '../../services/formatters';
import { GlassCard } from '../ui/GlassCard';
import { BottomNav } from '../Layout/BottomNav';

/**
 * WealthPulse - High-performance SVG sparkline for equity visualization.
 */
const WealthPulse = () => (
  <svg viewBox="0 0 100 30" className="w-24 h-10 overflow-visible">
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3A66FF" stopOpacity="0" />
        <stop offset="50%" stopColor="#06B6D4" stopOpacity="1" />
        <stop offset="100%" stopColor="#00F0FF" stopOpacity="1" />
      </linearGradient>
    </defs>
    <path 
      d="M0,25 C10,25 15,5 25,15 C35,25 45,5 55,10 C65,15 75,20 85,5 C95,-10 100,5 110,0" 
      fill="none" 
      stroke="url(#lineGradient)" 
      strokeWidth="2" 
      strokeLinecap="round"
      className="animate-[dash_3s_ease-in-out_infinite]"
      style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: 'pulse-line 4s linear infinite' }}
    />
    <style>{`
      @keyframes pulse-line {
        0% { stroke-dashoffset: 400; }
        100% { stroke-dashoffset: 0; }
      }
    `}</style>
  </svg>
);

export const DashboardScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [greeting, setGreeting] = useState('Bem-vindo');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 20);
  };

  const quickActions = [
    { icon: QrCode, label: 'Pix', screen: 'pix' as ScreenName },
    { icon: ArrowUpRight, label: 'Transferir', screen: 'pix-transfer' as ScreenName },
    { icon: Wallet, label: 'Pagar', screen: 'dashboard' as ScreenName },
    { icon: TrendingUp, label: 'Investir', screen: 'investment-hub' as ScreenName },
  ];

  const ecosystemItems = [
    { title: 'Carbono', route: 'carbon' as ScreenName, subtitle: 'ESG Meta', icon: Leaf, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
    { title: 'Market', route: 'marketplace' as ScreenName, subtitle: 'Cashback', icon: Store, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
    { title: 'Kids', route: 'kids' as ScreenName, subtitle: 'Level 12', icon: Gamepad2, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10' },
    { title: 'Pets', route: 'pets' as ScreenName, subtitle: 'Thor Pro', icon: Bone, color: 'text-[#EC4899]', bg: 'bg-[#EC4899]/10' }
  ];

  return (
    <div className="relative h-screen bg-black flex flex-col overflow-hidden">
      {/* Cinematic Ambient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3A66FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header Layer */}
      <div className={`px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3A66FF] to-[#06B6D4] p-0.5 shadow-lg shadow-[#3A66FF]/20 cursor-pointer active:scale-95 transition-transform"
            onClick={() => onNavigate('profile-edit')}
          >
            <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center text-white font-bold text-sm">
              {MOCK_USER.name.charAt(0)}
            </div>
          </div>
          <div>
            <p className="text-[#9CA3AF] text-[10px] uppercase font-bold tracking-[0.2em]">{greeting},</p>
            <h1 className="text-white font-bold text-sm">{MOCK_USER.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
                <Search size={20} />
            </button>
            <button 
                onClick={() => onNavigate('notifications')}
                className="relative w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors"
            >
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF3B30] rounded-full border-2 border-black animate-pulse" />
            </button>
        </div>
      </div>

      <div 
        className="flex-1 px-6 space-y-6 overflow-y-auto no-scrollbar pb-32 pt-4"
        onScroll={handleScroll}
      >
        {/* Main Liquidity Hub */}
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3A66FF] to-[#06B6D4] rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />
            <GlassCard variant="neo" className="relative overflow-hidden !p-6 border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2" onClick={() => onNavigate('investment-hub')}>
                        <ShieldCheck size={14} className="text-[#3A66FF]" />
                        <span className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-widest">Patrimônio Consolidado</span>
                    </div>
                    <button onClick={() => setShowBalance(!showBalance)} className="text-white/40 hover:text-white transition-colors">
                        {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>
                
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-baseline gap-1" onClick={() => onNavigate('investment-hub')}>
                            <span className="text-white text-4xl font-bold tracking-tighter">
                                {showBalance ? formatCurrency(MOCK_USER.balance) : 'R$ ••••••••'}
                            </span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="bg-[#10B981]/10 px-2 py-0.5 rounded flex items-center gap-1 border border-[#10B981]/20">
                                <TrendingUp size={12} className="text-[#10B981]" />
                                <span className="text-[#10B981] text-[10px] font-bold">+R$ 1.250,50</span>
                            </div>
                            <span className="text-white/30 text-[10px] font-medium uppercase tracking-tight">Variação Mensal</span>
                        </div>
                    </div>
                    <div className="pb-1 opacity-60">
                        <WealthPulse />
                    </div>
                </div>
            </GlassCard>
        </div>

        {/* Rapid Interaction Grid */}
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button 
              key={i}
              onClick={() => onNavigate(action.screen)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#3A66FF]/20 group-hover:border-[#3A66FF]/30 transition-all active:scale-95 shadow-xl">
                <action.icon size={22} className="group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[9px] text-[#9CA3AF] font-extrabold uppercase tracking-tighter group-hover:text-white transition-colors">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Intelligence Layer: Rapha AI */}
        <div 
          onClick={() => onNavigate('chat')}
          className="relative overflow-hidden rounded-3xl p-5 cursor-pointer active:scale-[0.98] transition-all group border border-[#3A66FF]/20 bg-[#1A1F3D]/50 backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3A66FF]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#3A66FF]/20 transition-colors" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3A66FF] to-[#00F0FF] flex items-center justify-center text-white shadow-lg shadow-[#3A66FF]/30 animate-pulse">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[#00F0FF] font-black text-[9px] uppercase tracking-[0.2em]">Rapha Insight</span>
                  <div className="w-1 h-1 bg-[#10B981] rounded-full" />
              </div>
              <p className="text-white text-sm font-medium leading-tight">Sua fatura do cartão vence em 3 dias. Deseja agendar o pagamento?</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-[#3A66FF]/20 group-hover:text-white transition-all">
                <ArrowRight size={18} />
            </div>
          </div>
        </div>

        {/* Ecosystem Horizon */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                    <Globe size={12} /> Ecossistema Quantum
                </h3>
                <span className="text-[10px] text-[#3A66FF] font-bold">Ver Todos</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {ecosystemItems.map((eco, i) => (
                    <GlassCard 
                        key={i} 
                        onClick={() => onNavigate(eco.route)} 
                        className="cursor-pointer border-white/5 group hover:bg-white/5 active:scale-[0.97] transition-all !p-4 overflow-hidden" 
                    >
                        <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
                            <eco.icon size={64} className={eco.color} />
                        </div>
                        <div className={`w-10 h-10 rounded-xl ${eco.bg} flex items-center justify-center ${eco.color} mb-4 relative z-10`}>
                            <eco.icon size={20} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-white font-bold text-sm">{eco.title}</p>
                            <p className="text-[#9CA3AF] text-[10px] font-medium mt-0.5 uppercase tracking-tighter opacity-70">{eco.subtitle}</p>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>

        {/* Asset Ledger */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] opacity-40">Atividade Recente</h3>
            <button onClick={() => onNavigate('analysis')} className="text-[#3A66FF] text-[10px] font-black uppercase tracking-widest hover:underline">Full Ledger</button>
          </div>
          <div className="space-y-3">
            {[
                { id: 'tx1', title: 'Apple Store', amount: -150000, date: '12:30', category: 'Shopping', icon: ShoppingBag },
                { id: 'tx2', title: 'Pix Recebido', amount: 50000, date: 'Ontem', category: 'Transferência', icon: ArrowDownLeft, isPositive: true },
            ].map((tx) => (
              <GlassCard 
                key={tx.id} 
                className="flex items-center justify-between py-3.5 px-4 border-white/5 hover:bg-white/5 active:scale-[0.99] transition-all cursor-pointer"
                onClick={() => onNavigate('transaction-detail')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tx.isPositive ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-white/5 text-white/60 shadow-inner'}`}>
                    <tx.icon size={20} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{tx.title}</p>
                    <p className="text-[#9CA3AF] text-[10px] uppercase font-bold tracking-tighter opacity-60">{tx.date} • {tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm tracking-tight ${tx.isPositive ? 'text-[#10B981]' : 'text-white'}`}>
                    {tx.isPositive ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-[8px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-0.5">Liquidado</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action: AR Vision */}
      <div className="fixed bottom-28 right-6 z-50">
        <button 
            onClick={() => onNavigate('ar-view')}
            className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#3A66FF] to-[#06B6D4] flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)] border border-white/20 active:scale-90 transition-all group"
        >
            <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-[ping_3s_infinite] pointer-events-none" />
            <Aperture size={28} className="text-white animate-[spin_12s_linear_infinite]" />
        </button>
      </div>

      <BottomNav activeScreen="dashboard" onNavigate={onNavigate} />
    </div>
  );
};

/*
╔══════════════════════════════════════════════════════════════════════════╗
║  REGENERA BANK - PRODUCTION BUILD                                        ║
║  System Status: Stable & Secure                                          ║
║  © 2025 Don Paulo Ricardo de Leão • Todos os direitos reservados         ║
╚══════════════════════════════════════════════════════════════════════════╝
*/