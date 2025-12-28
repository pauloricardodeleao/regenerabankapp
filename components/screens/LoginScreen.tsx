/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Authentication Gateway
   
  Developer: Don Paulo Ricardo
  CEO: Raphaela Cervesky
   
  ORCID: https://orcid.org/0009-0002-1934-3559
  Copyright © 2025 Regenera Ecosystem. All rights reserved.
═══════════════════════════════════════════════════════════════════════════════
*/

// [FILE] components/screens/LoginScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, ScanFace, Building2, User, Delete, Mail, ArrowRight, CheckCircle, AlertCircle, Mic, Lock, Camera, X } from 'lucide-react';
import { MOCK_USER } from '../../constants';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';

interface LoginScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onRegisterPJ: () => void;
  onRecovery: () => void;
}

type LoginStep = 'email' | 'pin' | 'biometric';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister, onRegisterPJ, onRecovery }) => {
  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pin, setPin] = useState('');
  const [showAccountTypeSelection, setShowAccountTypeSelection] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Security Protocol OMEGA: 18 Character High-Entropy PIN
  const PIN_LENGTH = 18; 

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      if (step === 'biometric') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: 400, height: 400 } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        } catch (err) {
          console.error("Biometric Hardware Access Denied");
        }
      }
    };
    if (step === 'biometric') startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    };
  }, [step]);

  const validateEmail = (value: string) => {
    setEmail(value);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setEmailError(!value || emailRegex.test(value) ? '' : 'Credencial Inválida');
  };

  const handleEmailSubmit = () => {
    if (!emailError && email.length > 0) setStep('pin');
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === PIN_LENGTH) {
        // Atomic Transition to Dashboard
        setTimeout(() => onLogin(), 300);
      }
    }
  };

  const handleDelete = () => setPin(prev => prev.slice(0, -1));

  if (showAccountTypeSelection) {
    return (
      <div className="relative h-full w-full bg-[#0A0E17] flex flex-col min-h-screen p-6 animate-in slide-in-from-bottom">
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Protocolo de Acesso</h2>
          <p className="text-[#9CA3AF] text-center mb-8">Defina o nível de operação.</p>
          <div className="space-y-4">
            <GlassCard onClick={onRegister} className="cursor-pointer group" hoverEffect>
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#3A66FF]/20 flex items-center justify-center text-[#3A66FF]">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Pessoa Física</h3>
                    <p className="text-xs text-[#9CA3AF]">Custódia individual.</p>
                  </div>
               </div>
            </GlassCard>
            <GlassCard onClick={onRegisterPJ} className="cursor-pointer group" hoverEffect>
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4]">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Pessoa Jurídica</h3>
                    <p className="text-xs text-[#9CA3AF]">Governança corporativa.</p>
                  </div>
               </div>
            </GlassCard>
          </div>
          <button onClick={() => setShowAccountTypeSelection(false)} className="mt-8 text-white/50 text-sm py-4">Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black flex flex-col min-h-screen overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3A66FF]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 pt-20 px-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl bg-black border border-white/20 flex items-center justify-center shadow-2xl mb-10">
             <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#3A66FF] to-[#00F0FF]">R</span>
        </div>
        
        {step === 'email' ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Quantum Access</h1>
            <p className="text-[#9CA3AF] text-sm font-medium">Autenticação Gold Master</p>
          </div>
        ) : (
          <div className="text-center animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-white mb-2">Olá, {MOCK_USER.name}</h1>
            <button onClick={() => { setStep('email'); setPin(''); }} className="text-[#3A66FF] text-xs font-black uppercase tracking-widest">Alternar Credencial</button>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-end pb-12 relative z-10 px-8">
        {step === 'email' && (
           <div className="w-full max-w-sm mx-auto animate-in slide-in-from-right">
              <GlassCard className={`mb-6 ${emailError ? 'border-red-500/50' : ''}`} variant="neo">
                 <label className="text-[10px] text-[#06B6D4] uppercase font-black tracking-[0.2em] mb-2 block">ID Global / CPF</label>
                 <div className="flex items-center gap-3">
                    <Mail className={emailError ? "text-red-400" : "text-[#3A66FF]"} size={20} />
                    <input 
                       value={email}
                       onChange={(e) => validateEmail(e.target.value)}
                       className="w-full bg-transparent text-white outline-none placeholder:text-white/10 text-lg font-medium"
                       placeholder="id@regenera.com"
                       autoFocus
                    />
                 </div>
              </GlassCard>
              <GlassButton fullWidth onClick={handleEmailSubmit} disabled={!email || !!emailError} icon={<ArrowRight size={20} />}>Validar</GlassButton>
           </div>
        )}

        {step === 'pin' && (
          <div className="animate-in slide-in-from-right w-full">
            <div className="flex justify-center flex-wrap gap-1.5 mb-12 h-4 px-4">
              {[...Array(PIN_LENGTH)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i < pin.length ? 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-y-4 gap-x-6 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'bio', 0, 'del'].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (item === 'del') handleDelete();
                    else if (item === 'bio') setStep('biometric');
                    else handlePinInput(String(item));
                  }}
                  className="h-16 w-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white mx-auto transition-all bg-white/5 active:scale-90 border border-white/5"
                >
                  {item === 'del' ? <Delete size={20} /> : item === 'bio' ? <ScanFace size={24} className="text-[#06B6D4]" /> : item}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'biometric' && (
          <div className="flex flex-col items-center justify-center animate-in zoom-in">
            <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-[#3A66FF]/30 mb-10 shadow-2xl">
               <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover grayscale" />
               <div className="absolute inset-0 z-10 border border-[#00F0FF]/20 rounded-full">
                  <div className="absolute top-1/2 w-full h-0.5 bg-[#00F0FF] shadow-[0_0_15px_#00F0FF] animate-pulse" />
               </div>
            </div>
            <div className="flex gap-4">
               <GlassButton onClick={() => onLogin()} className="px-10">Validar FaceID</GlassButton>
               <button onClick={() => setStep('pin')} className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold">PIN</button>
            </div>
          </div>
        )}
        
        <div className="mt-12 flex flex-col items-center gap-6 border-t border-white/5 pt-10">
          <button onClick={onRecovery} className="text-[#3A66FF] font-black text-[9px] uppercase tracking-[0.2em]">Recuperação Atuarial</button>
          <button onClick={() => setShowAccountTypeSelection(true)} className="w-full text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Solicitar Abertura de Conta</button>
        </div>
      </div>
    </div>
  );
};