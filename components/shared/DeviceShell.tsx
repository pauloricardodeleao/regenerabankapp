/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - PRESENTATION LAYER
  Component: DeviceShell (The Don's Frame)
═══════════════════════════════════════════════════════════════════════════════
*/

import React from 'react';

/**
 * @author Don Paulo Ricardo
 * @description Wrapper para garantir que o app pareça nativo mesmo na web.
 * Don: Cuida do notch e das margens de segurança.
 */
export const DeviceShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
      {/* Dynamic StatusBar Simulation */}
      <div className="h-10 w-full flex items-center justify-between px-8 pt-4 pointer-events-none z-[100]">
         <span className="text-[10px] font-bold text-white/40 font-mono">9:41</span>
         <div className="flex gap-1.5 items-center">
            <div className="w-4 h-2 border border-white/20 rounded-sm" />
            <div className="w-1 h-1 bg-white/20 rounded-full" />
         </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {children}
      </div>

      {/* Home Indicator - Don Standard */}
      <div className="h-6 w-full flex justify-center items-end pb-2 pointer-events-none z-[100]">
         <div className="w-32 h-1 bg-white/10 rounded-full" />
      </div>
    </div>
  );
};
