
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

// [FILE] components/Layout/BottomNav.tsx
import React from 'react';
import { Home, BarChart2, QrCode, Wallet, User } from 'lucide-react';
import { ScreenName } from '../../types';

interface BottomNavProps {
  activeScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  // Screens where BottomNav should be visible
  const visibleScreens: ScreenName[] = [
    'dashboard', 'analysis', 'pix', 'pix-receive', 'cards', 
    'settings', 'support', 'profile-edit', 'marketplace',
    'goals', 'carbon', 'kids', 'pets', 'card-settings'
  ];

  if (!visibleScreens.includes(activeScreen)) return null;

  // Enhanced Active State Logic: Maps sub-screens to main nav items
  const isTabActive = (tab: 'home' | 'analysis' | 'pix' | 'wallet' | 'profile') => {
    switch (tab) {
      case 'home':
        return ['dashboard', 'notifications', 'carbon', 'goals', 'kids', 'pets', 'marketplace'].includes(activeScreen);
      case 'analysis':
        return ['analysis'].includes(activeScreen);
      case 'pix':
        return activeScreen.startsWith('pix') || activeScreen === 'transfer-new' || activeScreen === 'top-up';
      case 'wallet':
        // Ensures 'Carteira' stays active for all card-related screens
        return ['cards', 'add-card', 'card-new', 'new-card-offer', 'card-settings'].includes(activeScreen);
      case 'profile':
        return ['settings', 'support', 'profile-edit', 'language', 'theme'].includes(activeScreen);
      default:
        return false;
    }
  };

  return (
    <div className="absolute bottom-0 w-full h-[90px] bg-[#0A0E17]/80 border-t border-white/10 backdrop-blur-2xl flex flex-col justify-start z-50 rounded-b-[2.5rem]">
        <div className="flex w-full justify-around items-center pt-3">
            
            {/* Início */}
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`flex flex-col items-center gap-1 w-16 group transition-all duration-300 ${isTabActive('home') ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            >
                <Home size={24} className={isTabActive('home') ? 'text-white fill-white/20' : 'text-[#9CA3AF]'} />
                <span className={`text-[10px] font-medium ${isTabActive('home') ? 'text-white' : 'text-[#9CA3AF]'}`}>Início</span>
            </button>
            
            {/* Análise */}
            <button 
              onClick={() => onNavigate('analysis')}
              className={`flex flex-col items-center gap-1 w-16 group transition-all duration-300 ${isTabActive('analysis') ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            >
                <BarChart2 size={24} className={isTabActive('analysis') ? 'text-white fill-white/20' : 'text-[#9CA3AF]'} />
                <span className={`text-[10px] font-medium ${isTabActive('analysis') ? 'text-white' : 'text-[#9CA3AF]'}`}>Análise</span>
            </button>

            {/* Pix (Central Action) */}
            <button 
              onClick={() => onNavigate('pix')}
              className="flex flex-col items-center gap-1 w-16 group hover:opacity-100 transition-opacity"
            >
                <div className={`
                  w-12 h-12 -mt-6 rounded-full flex items-center justify-center 
                  border-4 border-[#0A0E17] transform group-active:scale-95 transition-all duration-300
                  ${isTabActive('pix') 
                    ? 'bg-[#3A66FF] shadow-[0_0_25px_rgba(58,102,255,0.6)] scale-110' 
                    : 'bg-[#3A66FF] shadow-[0_0_20px_rgba(58,102,255,0.4)]'}
                `}>
                     <QrCode size={20} className="text-white" />
                </div>
                <span className={`text-[10px] font-medium mt-1 ${isTabActive('pix') ? 'text-white' : 'text-[#9CA3AF]'}`}>Pix</span>
            </button>

            {/* Carteira */}
            <button 
              onClick={() => onNavigate('cards')}
              className={`flex flex-col items-center gap-1 w-16 group transition-all duration-300 ${isTabActive('wallet') ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            >
                <Wallet size={24} className={isTabActive('wallet') ? 'text-white fill-white/20' : 'text-[#9CA3AF]'} />
                <span className={`text-[10px] font-medium ${isTabActive('wallet') ? 'text-white' : 'text-[#9CA3AF]'}`}>Carteira</span>
            </button>

            {/* Perfil */}
            <button 
              onClick={() => onNavigate('settings')}
              className={`flex flex-col items-center gap-1 w-16 group transition-all duration-300 ${isTabActive('profile') ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            >
                <User size={24} className={isTabActive('profile') ? 'text-white fill-white/20' : 'text-[#9CA3AF]'} />
                <span className={`text-[10px] font-medium ${isTabActive('profile') ? 'text-white' : 'text-[#9CA3AF]'}`}>Perfil</span>
            </button>
        </div>
        
        {/* Home Indicator */}
        <div className="w-full flex justify-center mt-auto mb-2">
            <div className="w-32 h-1 bg-white/20 rounded-full"></div>
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
