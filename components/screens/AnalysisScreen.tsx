/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Account & Ledger (Analysis)
   
  Developer: Don Paulo Ricardo
  CEO: Raphaela Cervesky
   
  ORCID: https://orcid.org/0009-0002-1934-3559
  Copyright © 2025 Regenera Ecosystem. All rights reserved.
═══════════════════════════════════════════════════════════════════════════════
*/

// [FILE] components/screens/AnalysisScreen.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Coffee, Zap, Car, ArrowDownLeft, Settings2, ShoppingBag, Filter, Search, X, Edit2, Trash2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ScreenProps, Transaction } from '../../types';
import { formatCurrency } from '../../services/formatters';
import { GlassCard } from '../ui/GlassCard';
import { BottomNav } from '../Layout/BottomNav';
import { GlassButton } from '../ui/GlassButton';

const MOCK_HISTORY: Partial<Transaction>[] = [
  { id: '1', description: 'Amazon Cloud AWS', amount: 45050, date: '2025-05-12', category: 'shopping', type: 'out' },
  { id: '2', description: 'Uber Corp Services', amount: 2490, date: '2025-05-11', category: 'transport', type: 'out' },
  { id: '3', description: 'Regenera Dividend', amount: 500000, date: '2025-05-10', category: 'income', type: 'in' },
  { id: '4', description: 'Netflix Premium', amount: 5590, date: '2025-05-08', category: 'leisure', type: 'out' },
  { id: '5', description: 'Stark Industries Food', amount: 32000, date: '2025-05-05', category: 'food', type: 'out' },
  { id: '6', description: 'Shell V-Power', amount: 25000, date: '2025-04-28', category: 'transport', type: 'out' },
  { id: '7', description: 'Salário Regenera', amount: 1250000, date: '2025-04-05', category: 'income', type: 'in' },
];

interface Category {
  id: string;
  label: string;
  color: string;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'all', label: 'Todos', color: '#FFFFFF' },
  { id: 'food', label: 'Alimentação', color: '#3A66FF' },
  { id: 'transport', label: 'Transporte', color: '#06B6D4' },
  { id: 'leisure', label: 'Lazer', color: '#8B5CF6' },
  { id: 'shopping', label: 'Compras', color: '#10B981' },
  { id: 'income', label: 'Entradas', color: '#F59E0B' },
];

const PERIODS = [
  { id: '2025-05', label: 'Maio 2025' },
  { id: '2025-04', label: 'Abril 2025' },
  { id: '2025-03', label: 'Março 2025' },
];

const useAnimatedCounter = (target: number, duration: number = 1000) => {
  const [current, setCurrent] = useState(target);
  const previousRef = useRef(target);
  
  useEffect(() => {
    const start = previousRef.current;
    const end = target;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 5);
      const next = start + (end - start) * ease;
      setCurrent(next);
      previousRef.current = next;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrent(end);
        previousRef.current = end;
      }
    };

    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [target, duration]);

  return current;
};

export const AnalysisScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('2025-05');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const filteredData = useMemo(() => {
    return MOCK_HISTORY.filter(item => 
      item.date?.startsWith(selectedPeriod) && 
      (selectedCategory === 'all' || item.category === selectedCategory)
    );
  }, [selectedPeriod, selectedCategory]);

  const chartData = useMemo(() => {
    const isIncomeView = selectedCategory === 'income';
    const baseData = filteredData.filter(t => 
      isIncomeView ? t.type === 'in' : (selectedCategory === 'all' ? t.type === 'out' : t.category === selectedCategory)
    );
    const grouped = baseData.reduce((acc, curr) => {
      if (!curr.category) return acc;
      acc[curr.category] = (acc[curr.category] || 0) + (curr.amount || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(grouped).map(key => ({
      name: categories.find(c => c.id === key)?.label || key,
      value: grouped[key],
      color: categories.find(c => c.id === key)?.color || '#9CA3AF'
    }));
  }, [filteredData, selectedCategory, categories]);

  const totalValue = chartData.reduce((sum, d) => sum + d.value, 0);
  const animatedTotal = useAnimatedCounter(totalValue);

  const getIcon = (catId: string) => {
    switch (catId) {
      case 'food': return <Coffee size={18} />;
      case 'transport': return <Car size={18} />;
      case 'leisure': return <Zap size={18} />;
      case 'shopping': return <ShoppingBag size={18} />;
      case 'income': return <ArrowDownLeft size={18} />;
      default: return <Filter size={18} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col pb-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#3A66FF]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white/70 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Análise de Fluxo</h1>
            <p className="text-[10px] text-[#3A66FF] font-black uppercase tracking-widest">Protocolo Quantum Shield</p>
          </div>
        </div>
        <button onClick={() => setIsManageModalOpen(true)} className="p-2.5 bg-white/5 rounded-xl text-white/50 hover:text-white transition-all">
          <Settings2 size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-6">
        <div className="px-6 mb-8">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {PERIODS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border
                  ${selectedPeriod === p.id 
                    ? 'bg-white text-black border-white shadow-xl shadow-white/10' 
                    : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 mb-10">
          <GlassCard variant="neo" className="h-72 relative flex items-center justify-center border-white/10">
             {chartData.length > 0 ? (
               <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={80} outerRadius={105} paddingAngle={4} dataKey="value" stroke="none" cornerRadius={8} isAnimationActive={true} animationDuration={1000}>
                      {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    {selectedCategory === 'income' ? 'Entradas' : 'Saídas'}
                  </p>
                  <p className="text-3xl font-black text-white tracking-tighter">{formatCurrency(Math.round(animatedTotal))}</p>
                </div>
               </>
             ) : (
               <div className="flex flex-col items-center text-white/20">
                  <Search size={48} className="mb-4" />
                  <p className="text-sm font-bold">Sem registros</p>
               </div>
             )}
          </GlassCard>
        </div>

        <div className="px-6 mb-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all
                  ${selectedCategory === cat.id 
                    ? 'bg-[#3A66FF] border-[#3A66FF] text-white shadow-lg shadow-[#3A66FF]/20' 
                    : 'bg-white/5 border-white/5 text-[#9CA3AF] hover:border-white/20'}`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 space-y-3 pb-8">
          {filteredData.map((tx) => (
            <GlassCard key={tx.id} className="flex items-center justify-between py-4 px-5 border-white/5 group" hoverEffect>
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors
                  ${tx.type === 'in' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-white/5 text-white/50 group-hover:text-white'}`}>
                  {tx.type === 'in' ? <ArrowDownLeft size={20} /> : getIcon(tx.category!)}
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{tx.description}</p>
                  <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-widest mt-1 opacity-60">
                    {new Date(tx.date!).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-sm tracking-tight ${tx.type === 'in' ? 'text-[#10B981]' : 'text-white'}`}>
                  {tx.type === 'in' ? '+' : '-'}{formatCurrency(tx.amount || 0)}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {isManageModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-2xl flex items-end sm:items-center justify-center animate-in fade-in">
          <div className="w-full max-w-md bg-[#0A0E17] sm:rounded-[3rem] rounded-t-[3rem] border-t border-white/10 p-8 animate-in slide-in-from-bottom">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white tracking-tight">Gestão de Categorias</h3>
                <button onClick={() => setIsManageModalOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X size={20} className="text-white"/></button>
             </div>
             <div className="space-y-3">
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <div key={cat.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="flex-1 text-white font-bold text-sm">{cat.label}</span>
                    <Edit2 size={16} className="text-white/30" />
                    <Trash2 size={16} className="text-red-500/50" />
                  </div>
                ))}
             </div>
             <GlassButton fullWidth className="mt-8 bg-white text-black border-none" onClick={() => setIsManageModalOpen(false)}>Concluído</GlassButton>
          </div>
        </div>
      )}

      <BottomNav activeScreen="analysis" onNavigate={onNavigate} />
    </div>
  );
};