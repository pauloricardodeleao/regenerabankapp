/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Bootstrapping & Runtime Control
   
  Developer: Don Paulo Ricardo
  CEO: Raphaela Cervesky
   
  ORCID: https://orcid.org/0009-0002-1934-3559
  Copyright © 2025 Regenera Ecosystem. All rights reserved.
═══════════════════════════════════════════════════════════════════════════════
*/

// [FILE] index.tsx
import { registerRootComponent } from 'expo';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Platform } from 'react-native';
import App from './App';

/**
 * Bootstrapping Logic:
 * Ensures cross-platform compatibility for production distribution.
 */
try {
  if (Platform.OS === 'web') {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error("CRITICAL: Root element #root not found in index.html");
    }
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    // Mobile Environment (Android/iOS)
    registerRootComponent(App);
  }
} catch (error) {
  console.error("FATAL_RUNTIME_ERROR:", error);
}

/*
╔══════════════════════════════════════════════════════════════════════════╗
║  REGENERA BANK - PRODUCTION BUILD                                        ║
║  System Status: Stable & Secure                                          ║
║  © 2025 Don Paulo Ricardo de Leão • Todos os direitos reservados         ║
╚══════════════════════════════════════════════════════════════════════════╝
*/