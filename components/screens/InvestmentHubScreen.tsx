/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Wealth Management Hub
   
  Developer: Don Paulo Ricardo
  CEO: Raphaela Cervesky
   
  ORCID: https://orcid.org/0009-0002-1934-3559
  Copyright © 2025 Regenera Ecosystem. All rights reserved.
═══════════════════════════════════════════════════════════════════════════════
*/

// [FILE] components/screens/InvestmentHubScreen.tsx
import React, { useState } from 'react';
import { 
  ArrowLeft, TrendingUp, ShieldCheck, PieChart as PieIcon, 
  ArrowUpRight, Bitcoin, Briefcase, Globe, Info, Search, 
  ChevronRight, Sparkles, Filter, LayoutGrid, List,
  // FIX: Added missing imports for ArrowRight and Aperture icons
  ArrowRight, Aperture
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ScreenProps } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { formatCurrency } from '../../services/formatters';

const PORTFOLIO_DATA = [
  { name: 'CDB Regenera', value: 45000000, color: '#3A66FF', icon: Briefcase },
  { name: 'Bitcoin', value: 12000000, color: '#F7931A', icon: Bitcoin },
  { name: 'FIIs ESG', value: 25000000, color: '#10B981', icon: Globe },
  { name: 'Saldo Livre', value: 43000000, color: '#06B6D4', icon: TrendingUp },
];

const OPPORTUNITIES = [
  { id: 'op1', title: 'Regenera Fixed 120%', type: 'Renda Fixa', yield: '120% CDI', min: 10000, risk: 'Baixo' },
  { id: 'op2', title: 'Quantum Tech Fund', type: 'Ações', yield: '+24.5% aa', min: 50000, risk: 'Alto' },
  { id: 'op3', title: 'Amazon Carbon Credits', type: 'ESG', yield: 'Impacto A+', min: 1000, risk: 'Médio' },
];

export const InvestmentHubScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'market'>('portfolio');
  const totalWealth = PORTFOLIO_DATA.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative min-h-screen bg-black flex flex-col pb-6 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#3A66FF]/10 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full transition-all">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-white tracking-tight">Investimentos</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50">
          <Search size={20} />
        </button>
      </div>

      {/* Primary Liquidity Overview */}
      <div className="px-6 py-6 animate-in fade-in duration-700">
        <div className="flex flex-col mb-8">
           <span className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Patrimônio Alocado</span>
           <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-white tracking-tighter">
                {formatCurrency(totalWealth)}
              </h2>
              <div className="flex items-center gap-1 text-[#10B981] font-bold text-xs">
                <TrendingUp size={12} />
                <span>+12.4%</span>
              </div>
           </div>
        </div>

        {/* Tab Control */}
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 mb-8">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all duration-300 ${
              activeTab === 'portfolio' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Meus Ativos
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all duration-300 ${
              activeTab === 'market' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Oportunidades
          </button>
        </div>

        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* Allocation Chart */}
            <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PORTFOLIO_DATA}
                      innerRadius={75}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {PORTFOLIO_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <PieIcon size={24} className="text-[#3A66FF] mb-1" />
                    <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest">Alocação</span>
                </div>
            </div>

            {/* Asset List */}
            <div className="space-y-3">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-white font-black text-[10px] uppercase tracking-widest opacity-40">Portfolio Ledger</h3>
                  <div className="flex gap-2">
                     <Filter size={14} className="text-[#9CA3AF]" />
                     <LayoutGrid size={14} className="text-[#3A66FF]" />
                  </div>
               </div>

               {PORTFOLIO_DATA.map((asset, i) => (
                  <GlassCard key={i} className="flex items-center justify-between py-4 px-5 border-white/5 group hover:bg-white/5 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${asset.color}15`, color: asset.color }}>
                           <asset.icon size={22} />
                        </div>
                        <div>
                           <p className="text-white font-bold text-sm">{asset.name}</p>
                           <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[9px] text-[#9CA3AF] font-black uppercase tracking-widest">Performance</span>
                              <div className="w-1 h-1 rounded-full bg-[#10B981]" />
                              <span className="text-[9px] text-[#10B981] font-bold">+1.2%</span>
                           </div>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-white font-black text-sm">{formatCurrency(asset.value)}</p>
                        <p className="text-[8px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-1">Ver Detalhes</p>
                     </div>
                  </GlassCard>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6 animate-in slide-in-from-left duration-500">
             {/* AI Matcher Banner */}
             <div className="p-5 rounded-3xl bg-gradient-to-br from-[#3A66FF]/20 to-[#06B6D4]/10 border border-[#3A66FF]/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-20 animate-pulse">
                   <Sparkles size={40} className="text-[#00F0FF]" />
                </div>
                <div className="relative z-10">
                   <span className="bg-[#00F0FF] text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Rapha Recommendation</span>
                   <h3 className="text-white font-bold text-lg mt-2 leading-tight">Vimos que você possui R$ 43k em saldo livre.</h3>
                   <p className="text-[#9CA3AF] text-xs mt-1">Sugerimos o <strong>Quantum Tech Fund</strong> para potencializar seus ganhos em 2025.</p>
                   <button className="mt-4 text-[#00F0FF] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-3 transition-all">
                      Analisar Estratégia <ArrowRight size={12} />
                   </button>
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-white font-black text-[10px] uppercase tracking-widest opacity-40 px-2">High Performance Opportunities</h3>
                
                {OPPORTUNITIES.map((op) => (
                   <GlassCard key={op.id} className="relative overflow-hidden group border-white/5" hoverEffect>
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <p className="text-[9px] text-[#3A66FF] font-black uppercase tracking-[0.2em] mb-1">{op.type}</p>
                            <h4 className="text-white font-bold text-base">{op.title}</h4>
                         </div>
                         <div className="bg-[#10B981]/10 px-2 py-1 rounded border border-[#10B981]/20">
                            <span className="text-[#10B981] font-black text-[10px]">{op.yield}</span>
                         </div>
                      </div>

                      <div className="flex gap-6 mb-5">
                         <div>
                            <p className="text-[#9CA3AF] text-[9px] font-bold uppercase tracking-widest">Aporte Mín.</p>
                            <p className="text-white font-bold text-xs mt-0.5">{formatCurrency(op.min)}</p>
                         </div>
                         <div>
                            <p className="text-[#9CA3AF] text-[9px] font-bold uppercase tracking-widest">Risco</p>
                            <p className={`font-bold text-xs mt-0.5 ${op.risk === 'Baixo' ? 'text-[#10B981]' : op.risk === 'Médio' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                               {op.risk}
                            </p>
                         </div>
                      </div>

                      <GlassButton fullWidth size="sm" className="bg-white text-black hover:bg-white/90 border-none h-11">
                         Aportar Agora
                      </GlassButton>
                   </GlassCard>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Floating Action: AR Visualization */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <button 
           onClick={() => onNavigate('ar-view')}
           className="px-6 py-4 rounded-full bg-gradient-to-r from-[#3A66FF] to-[#06B6D4] text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3 border border-white/20 active:scale-95 transition-transform"
        >
           <Aperture size={18} className="animate-spin-slow" />
           Visualização Imersiva (AR)
        </button>
      </div>
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