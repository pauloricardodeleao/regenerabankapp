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

// [FILE] components/screens/PixScreen.tsx
import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, QrCode, Copy, Share2, CheckCircle, 
  ChevronRight, User, Building2, ScanLine, ShieldAlert, 
  ShieldCheck, BrainCircuit, Lock, Fingerprint, Activity
} from 'lucide-react';
import { ScreenName, ScreenProps } from '../../types';
import { BottomNav } from '../Layout/BottomNav';
import { formatCurrency } from '../../services/formatters';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { analyzeTransactionRisk, FraudAnalysisResult } from '../../services/fraudDetection';
import { SECURITY_CONFIG } from '../../constants';
import { TwoFactorAuthModal } from '../modals/TwoFactorAuthModal';

interface PixScreenProps extends ScreenProps {
  initialMode?: 'hub' | 'scan' | 'receive' | 'transfer' | 'amount' | 'confirm' | 'success';
}

export const PixScreen: React.FC<PixScreenProps> = ({ onNavigate, onBack, initialMode = 'hub' }) => {
  const [amount, setAmount] = useState('0');
  const [analysisState, setAnalysisState] = useState<'idle' | 'scanning' | 'flagged'>('idle');
  const [fraudResult, setFraudResult] = useState<FraudAnalysisResult | null>(null);
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const handleAmountInput = (value: string) => {
    let newAmount = amount;
    if (value === 'backspace') {
      newAmount = newAmount.slice(0, -1);
    } else {
      if (newAmount === '0') newAmount = value;
      else if (newAmount.length < 10) newAmount += value;
    }
    setAmount(newAmount || '0');
  };

  const getFormattedAmount = () => {
    const numericValue = parseInt(amount, 10);
    return isNaN(numericValue) ? 'R$ 0,00' : formatCurrency(numericValue);
  };

  const initiateTransfer = async () => {
    const value = parseInt(amount, 10);
    if (value > SECURITY_CONFIG.TRANSACTION_LIMIT_NO_2FA) {
      setShowTwoFactor(true);
      return;
    }
    await performRiskAnalysis();
  };

  const onTwoFactorSuccess = async () => {
    setShowTwoFactor(false);
    await performRiskAnalysis();
  };

  const performRiskAnalysis = async () => {
    setAnalysisState('scanning');
    try {
        const result = await analyzeTransactionRisk(parseInt(amount), 'Destinatário Alpha');
        setFraudResult(result);
        if (['SAFE', 'LOW'].includes(result.riskLevel)) {
          setTimeout(() => onNavigate('pix-success'), 500);
        } else {
          setAnalysisState('flagged');
        }
    } catch (e) {
        setAnalysisState('idle');
    }
  };

  // --- RENDERS ---

  if (initialMode === 'hub') {
    return (
      <div className="relative min-h-screen bg-black flex flex-col pb-24">
        <div className="px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 bg-black/90 backdrop-blur-md z-40">
           <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full transition-all">
             <ArrowLeft size={24} />
           </button>
           <h1 className="text-xl font-bold text-white">Área Pix</h1>
        </div>

        <div className="px-6 flex-1 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <GlassButton onClick={() => onNavigate('pix-scan')} className="flex flex-col items-center justify-center h-32 gap-2 bg-[#3A66FF]/10 hover:bg-[#3A66FF]/20 border border-[#3A66FF]/20">
                 <ScanLine size={32} className="text-[#06B6D4]" />
                 <span className="text-sm font-bold">Ler QR Code</span>
              </GlassButton>
              <GlassButton onClick={() => onNavigate('pix-transfer')} className="flex flex-col items-center justify-center h-32 gap-2 bg-white/5 hover:bg-white/10 border border-white/5">
                 <User size={32} className="text-white/80" />
                 <span className="text-sm font-bold">Transferir</span>
              </GlassButton>
              <GlassButton onClick={() => onNavigate('pix-receive')} className="flex flex-col items-center justify-center h-32 gap-2 bg-white/5 hover:bg-white/10 border border-white/5">
                 <QrCode size={32} className="text-white/80" />
                 <span className="text-sm font-bold">Receber</span>
              </GlassButton>
              <GlassButton onClick={() => onNavigate('pix-transfer')} className="flex flex-col items-center justify-center h-32 gap-2 bg-white/5 hover:bg-white/10 border border-white/5">
                 <FileText size={32} className="text-white/80" />
                 <span className="text-sm font-bold">Copia e Cola</span>
              </GlassButton>
           </div>

           <GlassCard variant="neo">
              <h3 className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.2em] mb-4">Transferências Recentes</h3>
              <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
                 {['Raphaela', 'Mãe', 'Carlos', 'João', 'Airbnb'].map((name, i) => (
                    <div key={i} onClick={() => onNavigate('pix-amount')} className="flex flex-col items-center gap-3 min-w-[70px] cursor-pointer group">
                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3A66FF] to-[#06B6D4] p-0.5 transition-transform group-hover:scale-105 active:scale-95 shadow-lg shadow-[#3A66FF]/10">
                          <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center text-white font-bold">
                             {name.charAt(0)}
                          </div>
                       </div>
                       <span className="text-[10px] text-white font-bold uppercase tracking-tighter opacity-70">{name}</span>
                    </div>
                 ))}
              </div>
           </GlassCard>
        </div>
        <BottomNav activeScreen="pix" onNavigate={onNavigate} />
      </div>
    );
  }

  if (initialMode === 'amount') {
     return (
        <div className="relative min-h-screen bg-black flex flex-col">
           <div className="px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 bg-black/90 backdrop-blur-md z-40">
              <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full transition-all"><ArrowLeft size={24} /></button>
              <h1 className="text-xl font-bold text-white">Qual o valor?</h1>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center px-8">
              <div className="flex items-center gap-2 mb-2 text-[#9CA3AF] text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <ShieldCheck size={10} className="text-[#10B981]" /> Quantum Guard Ativo
              </div>
              <div className="text-5xl font-black text-white tracking-tighter mb-12 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                {getFormattedAmount()}
              </div>

              <div className="grid grid-cols-3 gap-x-12 gap-y-8 w-full max-w-xs">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button key={num} onClick={() => handleAmountInput(num.toString())} className="text-3xl font-bold text-white h-16 w-16 flex items-center justify-center rounded-full hover:bg-white/5 active:scale-90 transition-all">{num}</button>
                ))}
                <div />
                <button onClick={() => handleAmountInput('0')} className="text-3xl font-bold text-white h-16 w-16 flex items-center justify-center rounded-full hover:bg-white/5 active:scale-90 transition-all">0</button>
                <button onClick={() => handleAmountInput('backspace')} className="text-[#9CA3AF] h-16 w-16 flex items-center justify-center rounded-full hover:bg-white/5 active:scale-90 transition-all"><ArrowLeft /></button>
              </div>
           </div>

           <div className="p-8 pb-12">
              <GlassButton fullWidth disabled={parseInt(amount) === 0} onClick={() => onNavigate('pix-confirm')} size="lg">Continuar</GlassButton>
           </div>
        </div>
     );
  }

  if (initialMode === 'confirm') {
     return (
        <div className="relative min-h-screen bg-black flex flex-col">
           <TwoFactorAuthModal 
              isOpen={showTwoFactor}
              onCancel={() => setShowTwoFactor(false)}
              onSuccess={onTwoFactorSuccess}
              transactionAmount={parseInt(amount)}
           />

           {/* AI RISK ANALYSIS OVERLAY */}
           {analysisState === 'scanning' && (
             <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                <div className="relative w-40 h-40 mb-10">
                   <div className="absolute inset-0 bg-[#3A66FF] rounded-full opacity-10 animate-ping" />
                   <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                   <div className="absolute inset-0 border-t-2 border-l-2 border-[#06B6D4] rounded-full animate-[spin_2s_linear_infinite]" />
                   <div className="absolute inset-4 border-2 border-white/5 rounded-full" />
                   <div className="absolute inset-4 border-b-2 border-r-2 border-[#3A66FF] rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <BrainCircuit size={48} className="text-[#06B6D4] animate-pulse" />
                   </div>
                </div>
                <h2 className="text-2xl font-black text-white mb-3 text-center tracking-tight">Análise Neural em Curso</h2>
                <p className="text-[#9CA3AF] text-center max-w-[280px] text-sm leading-relaxed">
                  Verificando mais de <strong>250 vetores de risco</strong>, incluindo consistência geográfica e integridade do hardware.
                </p>
                <div className="mt-12 w-full max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-[#3A66FF] to-[#00F0FF] animate-[loading_2s_ease-in-out_infinite]" />
                   <style>{`@keyframes loading { 0% { width: 0; margin-left: 0; } 50% { width: 50%; } 100% { width: 0; margin-left: 100%; } }`}</style>
                </div>
             </div>
           )}

           {/* RISK FLAGGED VIEW */}
           {analysisState === 'flagged' && fraudResult && (
             <div className="absolute inset-0 bg-black z-50 flex flex-col p-8 animate-in slide-in-from-bottom duration-700">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mb-8 ring-4 ring-red-500/10 rotate-12">
                       <ShieldAlert size={48} className="text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 text-center">Protocolo de Risco</h2>
                    <p className="text-red-400 font-bold mb-8 uppercase tracking-widest text-xs">Score de Risco: {fraudResult.score}/100</p>
                    
                    <GlassCard className="mb-10 border-red-500/20 bg-red-900/5 !p-6">
                       <div className="flex items-start gap-4">
                          <Activity size={20} className="text-red-500 mt-1 flex-shrink-0" />
                          <div>
                             <p className="text-white font-bold text-sm">Causa Raiz</p>
                             <p className="text-white/60 text-xs mt-1 leading-relaxed">{fraudResult.reason}</p>
                          </div>
                       </div>
                    </GlassCard>

                    <div className="w-full space-y-4">
                       <GlassButton fullWidth variant="primary" className="h-16 gap-3">
                          <Fingerprint size={24} /> Autenticar via Biometria
                       </GlassButton>
                       <button onClick={() => setAnalysisState('idle')} className="w-full py-4 text-[#9CA3AF] font-bold text-sm uppercase tracking-widest hover:text-white transition-colors">Cancelar Operação</button>
                    </div>
                </div>
             </div>
           )}

           <div className="px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 bg-black/90 backdrop-blur-md z-40">
              <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full transition-all"><ArrowLeft size={24} /></button>
              <h1 className="text-xl font-bold text-white">Revisão</h1>
           </div>

           <div className="px-6 flex-1">
              <div className="bg-[#3A66FF]/5 border border-[#3A66FF]/10 rounded-3xl p-8 text-center mb-8 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3A66FF] to-transparent opacity-30" />
                 <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Valor Total</p>
                 <p className="text-4xl font-black text-white tracking-tighter">{getFormattedAmount()}</p>
              </div>

              <div className="space-y-4">
                 <h3 className="text-white/30 font-black text-[9px] uppercase tracking-[0.3em] px-2">Dados do Destino</h3>
                 <GlassCard className="space-y-4 !p-6 border-white/5">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest">Para</span>
                        <div className="text-right">
                            <span className="text-white font-black text-sm">João Silva da Costa</span>
                            <p className="text-[#3A66FF] text-[10px] font-bold mt-0.5">Nubank • ***.123.***-**</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest">Agendamento</span>
                        <span className="text-white font-black text-sm">Imediato</span>
                    </div>
                 </GlassCard>

                 <div className="px-4 py-3 bg-[#10B981]/5 rounded-2xl border border-[#10B981]/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                        <ShieldCheck size={18} />
                    </div>
                    <p className="text-[#10B981] text-[10px] font-bold uppercase tracking-widest">Transação Gratuita e Segura</p>
                 </div>
              </div>
           </div>

           <div className="p-8 pb-12">
              <GlassButton fullWidth onClick={initiateTransfer} size="lg" className="h-16 shadow-[0_10px_30px_rgba(58,102,255,0.3)]">
                 <div className="flex items-center gap-2">
                    <Lock size={18} />
                    Confirmar e Transferir
                 </div>
              </GlassButton>
           </div>
        </div>
     );
  }

  if (initialMode === 'success') {
     return (
        <div className="relative min-h-screen bg-black flex flex-col items-center justify-center p-8 animate-in zoom-in duration-500">
           <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#10B981]/10 to-transparent pointer-events-none" />
           <div className="w-24 h-24 bg-[#10B981]/20 rounded-full flex items-center justify-center mb-8 ring-4 ring-[#10B981]/10 animate-bounce-slow">
              <CheckCircle size={48} className="text-[#10B981]" />
           </div>
           <h2 className="text-3xl font-black text-white mb-2 text-center tracking-tighter">Dinheiro Enviado!</h2>
           <p className="text-[#9CA3AF] text-center mb-12 text-sm max-w-[240px] leading-relaxed">
             Sua transferência foi liquidada instantaneamente. O comprovante já está disponível.
           </p>
           
           <div className="w-full space-y-4">
              <GlassButton fullWidth onClick={() => onNavigate('transaction-detail')} variant="secondary" className="h-14 font-black uppercase tracking-widest text-[10px]">Ver Comprovante</GlassButton>
              <GlassButton fullWidth onClick={() => onNavigate('dashboard')} className="h-14 font-black uppercase tracking-widest text-[10px]">Ir para Início</GlassButton>
           </div>
        </div>
     );
  }

  return null;
};

/*
╔══════════════════════════════════════════════════════════════════════════╗
║  REGENERA BANK - PRODUCTION BUILD                                        ║
║  System Status: Stable & Secure                                          ║
║  © 2025 Don Paulo Ricardo de Leão • Todos os direitos reservados         ║
╚══════════════════════════════════════════════════════════════════════════╝
*/