/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Account & Ledger
   
  Developer: Don Paulo Ricardo
  CEO: Raphaela Cervesky
   
  ORCID: https://orcid.org/0009-0002-1934-3559
  Copyright © 2025 Regenera Ecosystem. All rights reserved.
═══════════════════════════════════════════════════════════════════════════════
*/

// [FILE] components/screens/TopUpScreen.tsx
import React, { useState } from 'react';
import { ArrowLeft, CreditCard, ArrowRight, Wallet } from 'lucide-react';
import { ScreenProps } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { formatCurrency } from '../../services/formatters';

export const TopUpScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTopUp = () => {
    if (!amount) return;
    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       onNavigate('pix-success'); // Reuse success screen for simplicity
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0E17] flex flex-col">
       <div className="px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 bg-[#0A0E17]/90 backdrop-blur-md z-40">
        <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full transition-all">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">Recarregar Cartão</h1>
      </div>

      <div className="px-6 flex-1 flex flex-col">
         {/* Origin -> Destination Visual */}
         <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex flex-col items-center gap-2">
               <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Wallet size={24} />
               </div>
               <span className="text-xs text-[#9CA3AF]">Conta Corrente</span>
            </div>
            
            <div className="flex-1 h-px bg-white/10 mx-4 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0E17] p-2">
                  <ArrowRight size={16} className="text-[#3A66FF]" />
               </div>
            </div>

            <div className="flex flex-col items-center gap-2">
               <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3A66FF] to-[#06B6D4] flex items-center justify-center text-white shadow-lg shadow-[#3A66FF]/20">
                  <CreditCard size={24} />
               </div>
               <span className="text-xs text-white font-bold">Cartão Pré-pago</span>
            </div>
         </div>

         <GlassCard className="mb-6 flex items-center gap-4">
             <div className="bg-white/10 p-2 rounded-lg"><CreditCard size={24} className="text-white"/></div>
             <div>
                <p className="text-sm font-bold text-white">Regenera Card Final 4521</p>
                <p className="text-xs text-[#9CA3AF]">Don Paulo R Leão</p>
             </div>
             <button className="text-[#3A66FF] text-xs font-bold ml-auto">Alterar</button>
         </GlassCard>

         <h3 className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider mb-4">Valor da Recarga</h3>
         <div className="bg-[#0A0E17] border-b border-white/20 pb-2 mb-8 flex items-center gap-2">
            <span className="text-2xl text-[#9CA3AF]">R$</span>
            <input 
               type="number" 
               placeholder="0,00"
               className="w-full bg-transparent text-4xl font-bold text-white outline-none"
               onChange={(e) => setAmount(Number(e.target.value))}
            />
         </div>

         {/* Suggestions */}
         <div className="grid grid-cols-3 gap-3 mb-8">
            {[50, 100, 200].map((val) => (
               <button 
                  key={val}
                  onClick={() => setAmount(val)}
                  className="py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all text-sm"
               >
                  {formatCurrency(val * 100)}
               </button>
            ))}
         </div>
         
         <div className="mt-auto pb-6">
            <GlassButton fullWidth disabled={!amount} onClick={handleTopUp} isLoading={loading}>Confirmar Recarga</GlassButton>
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