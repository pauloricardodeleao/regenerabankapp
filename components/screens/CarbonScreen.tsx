
/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Sustainability & ESG
   
  Developer: Don Paulo Ricardo
  CEO: Raphaela Cervesky
   
  ORCID: https://orcid.org/0009-0002-1934-3559
  Copyright © 2025 Regenera Ecosystem. All rights reserved.
═══════════════════════════════════════════════════════════════════════════════
*/

// [FILE] components/screens/CarbonScreen.tsx
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Leaf, TrendingUp, Info, CheckCircle, 
  Sprout, Wind, Car, Zap, Utensils, Calculator, 
  BarChart3, ChevronRight, Lightbulb, ShieldCheck
} from 'lucide-react';
import { ScreenProps } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { formatCurrency } from '../../services/formatters';

type CarbonTab = 'overview' | 'calculator';

/**
 * CarbonScreen - Módulo de Sustentabilidade Gold Master.
 * Implementa cálculos de impacto ambiental e mecanismos de compensação.
 */
export const CarbonScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const [activeTab, setActiveTab] = useState<CarbonTab>('overview');
  const [compensating, setCompensating] = useState(false);
  const [compensated, setCompensated] = useState(false);
  
  // State: Inputs da Calculadora
  const [transportKm, setTransportKm] = useState<number>(200);
  const [energyBill, setEnergyBill] = useState<number>(150);
  const [meatMeals, setMeatMeals] = useState<number>(5);
  const [flights, setFlights] = useState<number>(1);

  const transactionCo2 = 128; // Estático baseado no extrato real
  
  // Cálculo Atuarial de Impacto (Kg CO2)
  const calculatedCo2 = useMemo(() => {
    try {
      const transportImpact = (Number(transportKm) || 0) * 4 * 0.12;
      const energyImpact = (Number(energyBill) || 0) * 0.08;
      const foodImpact = (Number(meatMeals) || 0) * 4 * 2;
      const flightImpact = ((Number(flights) || 0) * 200) / 12;
      const total = transportImpact + energyImpact + foodImpact + flightImpact;
      return Math.round(total) || 0;
    } catch (e) {
      return 0;
    }
  }, [transportKm, energyBill, meatMeals, flights]);

  const totalCo2 = activeTab === 'overview' ? transactionCo2 : calculatedCo2;
  const treesNeeded = Math.ceil(totalCo2 / 20) || 0;
  // Custo fixo de regeneração: R$ 0,15 por Kg de CO2
  const compensationPriceCents = Math.round(totalCo2 * 15); 

  const handleCompensation = () => {
    setCompensating(true);
    // Simulação de transação atômica em blockchain
    setTimeout(() => {
       setCompensating(false);
       setCompensated(true);
    }, 2800);
  };

  const CustomSlider = ({ 
    label, 
    icon: Icon, 
    value, 
    setValue, 
    min, 
    max, 
    unit 
  }: { 
    label: string, 
    icon: any, 
    value: number, 
    setValue: (val: number) => void, 
    min: number, 
    max: number, 
    unit: string 
  }) => (
    <div className="mb-6 group">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-[#9CA3AF] group-hover:text-white transition-colors">
          <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#10B981]/20 group-hover:text-[#10B981] transition-all">
             <Icon size={16} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-[#10B981] font-bold text-sm bg-[#10B981]/10 px-3 py-1 rounded-md border border-[#10B981]/20 shadow-sm">
           {value} <span className="text-[10px] text-[#10B981]/70 font-medium ml-0.5">{unit}</span>
        </span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 bg-white/10 rounded-full" />
        <div className="absolute h-1.5 bg-[#10B981] rounded-full" style={{ width: `${(value / max) * 100}%` }} />
        <input 
            type="range" 
            min={min} 
            max={max} 
            value={value} 
            onChange={(e) => setValue(Number(e.target.value))}
            className="absolute w-full opacity-0 cursor-pointer z-10"
        />
        <div 
            className="absolute w-5 h-5 bg-white rounded-full shadow-lg border-2 border-[#10B981] pointer-events-none transition-all duration-75"
            style={{ left: `calc(${(value / max) * 100}% - 10px)` }}
        />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#0A0E17] flex flex-col pb-6 overflow-x-hidden">
      {/* Background VFX: Noise & Gradients to avoid "pure black screen" feel */}
      <div className="absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b from-[#10B981]/15 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="bg-noise absolute inset-0 opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-4 sticky top-0 z-40 bg-[#0A0E17]/90 backdrop-blur-xl border-b border-white/5">
        <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full transition-all">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
           <h1 className="text-xl font-bold text-white tracking-tight">Carbon Zero</h1>
           <p className="text-[10px] text-[#10B981] font-bold tracking-[0.2em] uppercase flex items-center gap-1.5">
              <Sprout size={10} /> Regenera Planet Protocol
           </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
           <Info size={18} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-6">
        <div className="flex p-1 bg-[#111827] rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all duration-500 ${
              activeTab === 'overview' 
                ? 'bg-[#10B981] text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]' 
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <BarChart3 size={16} /> Impacto Real
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all duration-500 ${
              activeTab === 'calculator' 
                ? 'bg-[#10B981] text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]' 
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Calculator size={16} /> Calculadora
          </button>
        </div>
      </div>

      <div className="px-6 flex-1 flex flex-col relative z-10 animate-in slide-in-from-bottom-4 duration-700">
         
         {/* Visual Core: Carbon Counter */}
         <div className="text-center mb-10 relative">
            <div className={`w-48 h-48 mx-auto rounded-full flex flex-col items-center justify-center border-4 mb-6 relative transition-all duration-1000 transform
               ${compensated ? 'bg-[#10B981]/20 border-[#10B981] shadow-[0_0_60px_rgba(16,185,129,0.4)] scale-110' : 'bg-white/5 border-white/10 shadow-2xl'}
            `}>
               {compensated ? (
                  <div className="animate-in zoom-in duration-700 flex flex-col items-center">
                     <CheckCircle size={64} className="text-[#10B981] mb-2" />
                     <span className="text-[10px] text-[#10B981] font-bold uppercase tracking-widest">Neutralizado</span>
                  </div>
               ) : (
                  <>
                     <Leaf size={60} className="text-[#10B981] drop-shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-bounce-slow" />
                     <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="96" cy="96" r="92" stroke="currentColor" strokeWidth="2" fill="none" className="text-white/5" />
                        {/* Fix: Merged duplicate className attributes on the progress circle element */}
                        <circle cx="96" cy="96" r="92" stroke="currentColor" strokeWidth="4" fill="none"
                          strokeDasharray="578" 
                          strokeDashoffset={578 - (578 * Math.min((Number(totalCo2) || 0) / 1000, 1))} 
                          strokeLinecap="round"
                          className="text-[#10B981] transition-all duration-1000 ease-out"
                        />
                     </svg>
                  </>
               )}
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-2">
                 <h2 className={`text-6xl font-black transition-all duration-1000 tracking-tighter ${compensated ? 'text-[#10B981]' : 'text-white'}`}>
                    {compensated ? 0 : (totalCo2 || 0)}
                 </h2>
                 <span className="text-xl font-bold text-[#9CA3AF] mb-1">kgCO₂</span>
              </div>
              <p className="text-[#9CA3AF] mt-2 font-bold text-[10px] uppercase tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                {compensated ? 'Status: Pegada Zero' : activeTab === 'overview' ? 'Emissões do Mês Atual' : 'Projeção de Emissão Anual'}
              </p>
            </div>
         </div>

         {/* Extrato View */}
         {activeTab === 'overview' && !compensated && (
            <div className="animate-in fade-in slide-in-from-right duration-500">
               <GlassCard className="mb-6 border-[#10B981]/20 bg-[#111827]/60">
                  <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-xs uppercase tracking-widest text-opacity-70">
                     <TrendingUp size={16} className="text-[#10B981]" /> Análise de Emissões
                  </h3>
                  <div className="space-y-5">
                     <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-[#3A66FF]/10 rounded-2xl text-[#3A66FF] group-hover:bg-[#3A66FF]/20 transition-all shadow-inner"><Car size={20} /></div>
                           <div>
                              <p className="text-white font-bold text-sm">Transporte Apps</p>
                              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Uber, 99 • 8 Corridas</p>
                           </div>
                        </div>
                        <span className="text-white font-black text-sm">45 kg</span>
                     </div>
                     <div className="flex justify-between items-center group border-t border-white/5 pt-4">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-[#F59E0B]/10 rounded-2xl text-[#F59E0B] group-hover:bg-[#F59E0B]/20 transition-all shadow-inner"><Wind size={20} /></div>
                           <div>
                              <p className="text-white font-bold text-sm">Logística e-Commerce</p>
                              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Amazon, Magalu • 3 Entregas</p>
                           </div>
                        </div>
                        <span className="text-white font-black text-sm">83 kg</span>
                     </div>
                  </div>
               </GlassCard>
            </div>
         )}

         {/* Calculator View */}
         {activeTab === 'calculator' && !compensated && (
            <div className="animate-in fade-in slide-in-from-right duration-500">
               <GlassCard className="mb-6 border-[#10B981]/20 bg-[#111827]/60">
                  <h3 className="text-white font-bold mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-opacity-70">
                     <Calculator size={16} className="text-[#10B981]" /> Simular Pegada Diária
                  </h3>
                  <CustomSlider label="Kilometragem Semanal" icon={Car} value={transportKm} setValue={setTransportKm} min={0} max={1000} unit="km" />
                  <CustomSlider label="Gasto Médio Energia" icon={Zap} value={energyBill} setValue={setEnergyBill} min={0} max={1000} unit="R$" />
                  <CustomSlider label="Refeições com Carne" icon={Utensils} value={meatMeals} setValue={setMeatMeals} min={0} max={21} unit="un" />
                  <CustomSlider label="Viagens Aéreas" icon={Wind} value={flights} setValue={setFlights} min={0} max={20} unit="voos" />
               </GlassCard>

               {calculatedCo2 > 400 && (
                  <GlassCard className="mb-6 bg-yellow-500/5 border-yellow-500/20 flex items-start gap-4">
                     <Lightbulb className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                     <div>
                        <p className="text-yellow-100 font-bold text-xs uppercase tracking-wider mb-1">Dica de Regeneração</p>
                        <p className="text-white/60 text-xs leading-relaxed">
                           Reduzir o consumo de proteína animal para 3x por semana pode diminuir sua pegada de carbono em até <strong>15%</strong> anualmente.
                        </p>
                     </div>
                  </GlassCard>
               )}
            </div>
         )}

         {/* Success Blockchain Certificate View */}
         {compensated && (
            <div className="animate-in zoom-in duration-700">
                <GlassCard className="mb-6 border-[#10B981]/40 bg-[#10B981]/5 text-center shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                <h3 className="text-[#10B981] font-black text-xl mb-2">Neutralização Concluída!</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                    Você apoiou o projeto <strong>Amazon Guardians</strong>.
                    Seu certificado digital NFT foi emitido na rede Quantum Core.
                </p>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-black/60 transition-all">
                    <div className="text-left">
                        <p className="text-[9px] text-[#9CA3AF] uppercase font-black tracking-[0.2em]">Transaction Hash</p>
                        <p className="text-white font-mono text-xs mt-1 truncate max-w-[180px]">0x71C92A...B382F</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                        <ShieldCheck size={20} />
                    </div>
                </div>
                </GlassCard>
            </div>
         )}

         <div className="grid grid-cols-2 gap-4 mb-8">
            <GlassCard className="bg-[#10B981]/10 border-[#10B981]/20 flex flex-col items-center text-center py-5">
               <div className="flex items-end gap-1.5 mb-1.5">
                  <span className="text-4xl font-black text-[#10B981] leading-none tracking-tighter">{compensated ? treesNeeded + 1 : treesNeeded}</span>
                  <Sprout size={18} className="text-[#10B981] mb-1" />
               </div>
               <span className="text-[9px] text-[#9CA3AF] uppercase font-black tracking-[0.2em]">Árvores a Plantar</span>
            </GlassCard>
            <GlassCard className="flex flex-col items-center text-center py-5 bg-white/5 border-white/10">
               <div className="flex items-end gap-1 mb-1.5">
                  <span className="text-4xl font-black text-white leading-none tracking-tighter">{compensated ? 'A+' : (totalCo2 < 150 ? 'A' : 'B')}</span>
               </div>
               <span className="text-[9px] text-[#9CA3AF] uppercase font-black tracking-[0.2em]">Rating ESG Global</span>
            </GlassCard>
         </div>

         <div className="mt-auto space-y-4 pb-8 safe-area-bottom">
            <GlassButton 
               fullWidth 
               className={`shadow-2xl h-16 transition-all duration-700 ${compensated 
                 ? 'bg-white/5 text-white/40 shadow-none border-white/5 cursor-default' 
                 : 'bg-[#10B981] hover:bg-[#059669] shadow-[0_10px_30px_rgba(16,185,129,0.3)] border-t border-white/30'}`}
               onClick={handleCompensation}
               disabled={compensated}
               isLoading={compensating}
               icon={!compensated && !compensating ? <Leaf size={20} /> : undefined}
            >
               {compensated ? 'Compensação Concluída' : `Neutralizar Agora (${formatCurrency(compensationPriceCents)})`}
            </GlassButton>
            
            {!compensated && (
               <div className="flex items-center justify-center gap-2 opacity-50">
                  <ShieldCheck size={12} className="text-[#10B981]" />
                  <p className="text-[9px] text-white uppercase font-bold tracking-[0.15em]">Garantia de Regeneração verificada por auditoria externa</p>
               </div>
            )}
         </div>
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
