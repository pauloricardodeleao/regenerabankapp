/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Security Protocol Hub
   
  Developer: Don Paulo Ricardo
  CEO: Raphaela Cervesky
   
  ORCID: https://orcid.org/0009-0002-1934-3559
  Copyright © 2025 Regenera Ecosystem. All rights reserved.
═══════════════════════════════════════════════════════════════════════════════
*/

// [FILE] components/screens/SecurityCenterScreen.tsx
import React, { useState } from 'react';
import { 
  ArrowLeft, ShieldCheck, Fingerprint, Smartphone, Lock, 
  ChevronRight, AlertCircle, Eye, Activity, Key, Globe,
  ShieldAlert, ScanFace, MousePointer2
} from 'lucide-react';
import { ScreenProps } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { formatCurrency } from '../../services/formatters';

export const SecurityCenterScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const [limits, setLimits] = useState({
    pixDaily: 500000, // R$ 5.000,00
    pixNight: 100000,  // R$ 1.000,00
  });

  const [toggles, setToggles] = useState({
    faceId: true,
    locationAuth: true,
    quantumEncryption: true,
    hardwareTrust: true
  });

  const SecurityToggle = ({ label, desc, icon: Icon, isOn, onToggle }: any) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 mb-3 group hover:bg-white/[0.08] transition-all">
       <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${isOn ? 'bg-[#3A66FF]/20 text-[#3A66FF]' : 'bg-white/5 text-[#9CA3AF]'}`}>
             <Icon size={22} />
          </div>
          <div>
             <p className="text-white font-bold text-sm">{label}</p>
             <p className="text-[10px] text-[#9CA3AF] leading-tight mt-0.5">{desc}</p>
          </div>
       </div>
       <button 
          onClick={onToggle}
          className={`w-12 h-6 rounded-full p-1 transition-all duration-500 ${isOn ? 'bg-[#3A66FF]' : 'bg-white/10'}`}
       >
          <div className={`w-4 h-4 rounded-full bg-white shadow-lg transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`} />
       </button>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black flex flex-col pb-10 overflow-x-hidden">
      {/* Visual Depth */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#3A66FF]/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 bg-black/80 backdrop-blur-xl z-40 border-b border-white/5">
        <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full transition-all">
          <ArrowLeft size={24} />
        </button>
        <div>
           <h1 className="text-xl font-bold text-white tracking-tight">Centro de Segurança</h1>
           <p className="text-[9px] text-[#3A66FF] font-black uppercase tracking-[0.3em]">Quantum Shield V2.0</p>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 space-y-8 overflow-y-auto no-scrollbar">
        
        {/* Security Health Score */}
        <div className="relative text-center py-6 px-8 rounded-[32px] bg-gradient-to-b from-[#111827] to-black border border-white/10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#3A66FF] to-transparent" />
            <div className="w-20 h-20 mx-auto rounded-full bg-[#3A66FF]/10 flex items-center justify-center mb-4 relative">
               <ShieldCheck size={40} className="text-[#3A66FF] animate-pulse" />
               <div className="absolute inset-0 rounded-full border-2 border-[#3A66FF]/20 animate-ping" />
            </div>
            <h2 className="text-white font-bold text-lg mb-1">Proteção Máxima</h2>
            <p className="text-[#9CA3AF] text-xs leading-relaxed">
               Sua conta está sendo monitorada em tempo real por nossa inteligência artificial contra fraudes.
            </p>
        </div>

        {/* Transaction Limits Section */}
        <div>
           <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-white font-black text-[10px] uppercase tracking-widest opacity-40 flex items-center gap-2">
                 <Lock size={12} /> Gestão de Limites
              </h3>
              <button className="text-[#3A66FF] text-[10px] font-black uppercase tracking-widest">Aumentar</button>
           </div>
           
           <div className="space-y-3">
              <GlassCard className="flex items-center justify-between py-4 border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#9CA3AF]"><Globe size={20} /></div>
                    <div>
                       <p className="text-white font-bold text-sm">Pix Diário</p>
                       <p className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-tighter">Liquidado em instantes</p>
                    </div>
                 </div>
                 <p className="text-white font-black text-sm">{formatCurrency(limits.pixDaily)}</p>
              </GlassCard>

              <GlassCard className="flex items-center justify-between py-4 border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#9CA3AF]"><Activity size={20} /></div>
                    <div>
                       <p className="text-white font-bold text-sm">Pix Noturno</p>
                       <p className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-tighter">Das 20h às 06h</p>
                    </div>
                 </div>
                 <p className="text-white font-black text-sm">{formatCurrency(limits.pixNight)}</p>
              </GlassCard>
           </div>
        </div>

        {/* Advanced Governance */}
        <div>
           <h3 className="text-white font-black text-[10px] uppercase tracking-widest opacity-40 mb-4 px-2">Autenticação Avançada</h3>
           <SecurityToggle 
              label="Face ID / Biometria" 
              desc="Acesse o app e confirme transações com seu rosto."
              icon={ScanFace}
              isOn={toggles.faceId}
              onToggle={() => setToggles({...toggles, faceId: !toggles.faceId})}
           />
           <SecurityToggle 
              label="Trust Geolocation" 
              desc="Bloqueia transações fora do seu raio geográfico habitual."
              icon={Globe}
              isOn={toggles.locationAuth}
              onToggle={() => setToggles({...toggles, locationAuth: !toggles.locationAuth})}
           />
           <SecurityToggle 
              label="Quantum Encryption" 
              desc="Criptografia de ponta a ponta pós-quântica habilitada."
              icon={Key}
              isOn={toggles.quantumEncryption}
              onToggle={() => setToggles({...toggles, quantumEncryption: !toggles.quantumEncryption})}
           />
           <SecurityToggle 
              label="Hardware Trust" 
              desc="Vincular sua conta exclusivamente a este processador."
              icon={Smartphone}
              isOn={toggles.hardwareTrust}
              onToggle={() => setToggles({...toggles, hardwareTrust: !toggles.hardwareTrust})}
           />
        </div>

        {/* Audit Log Entry Point */}
        <button className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between px-6 group active:scale-[0.98] transition-all">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                 <ShieldAlert size={20} />
              </div>
              <span className="text-white font-bold text-sm">Log de Segurança</span>
           </div>
           <ChevronRight size={20} className="text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-[#9CA3AF] text-[9px] uppercase font-black tracking-[0.3em] pt-4 opacity-30">
           Certified Secure Environment by Regenera Labs
        </p>
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