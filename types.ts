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

// [FILE] types.ts
import { Money as MoneyVO } from './domain/Money';

export type ScreenName = 
  // Auth & Onboarding
  | 'splash' 
  | 'login' 
  | 'recovery'
  | 'onboarding'
  | 'onboarding-pj'
  
  // Core
  | 'dashboard' 
  | 'ar-view' 
  | 'investment-hub' 
  
  // Cards
  | 'cards' 
  | 'add-card'
  | 'card-new'
  | 'new-card-offer'
  | 'card-settings'
  
  // Transactions
  | 'pix' 
  | 'pix-scan'
  | 'pix-transfer'
  | 'pix-amount'
  | 'pix-confirm'
  | 'pix-success'
  | 'pix-receive'
  | 'transfer-new'
  | 'manual-transfer'
  | 'transaction-detail'
  | 'top-up'
  | 'international-transfer'
  
  // Analysis & AI
  | 'analysis' 
  | 'chat' 
  | 'goals'
  
  // Sustainability
  | 'carbon'
  
  // Special Accounts
  | 'kids'
  | 'pets'

  // Marketplace
  | 'marketplace'
  | 'partner-amazon'
  | 'partner-magalu'
  | 'partner-nike'
  
  // Support & Settings
  | 'support' 
  | 'settings'
  | 'profile-edit'
  | 'notifications'
  | 'language'
  | 'theme'
  | 'security-center';

export interface ScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onBack?: () => void;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone: string;
  document: string;
  tier: 'Standard' | 'Gold' | 'Black' | 'Quantum';
}

// Don: 'number' era herança de código legado. Agora usamos o Value Object.
export type Money = MoneyVO; 

export interface Transaction {
  id: string;
  type: 'in' | 'out';
  amount: number; // Don: No DTO ainda mantemos number (centavos) pra serialização JSON leve.
  description: string;
  date: string;
  category: string;
  merchantIcon?: string;
  authCode?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Bill {
  id: string;
  title: string;
  amount: number; // Centavos
  dueDate: {
    day: string;
    month: string;
  };
  status: 'urgent' | 'scheduled' | 'paid';
  daysLeft?: number;
  route: string;
}

/*
╔══════════════════════════════════════════════════════════════════════════╗
║  REGENERA BANK - PRODUCTION BUILD                                        ║
║  System Status: Stable & Secure                                          ║
║  © 2025 Don Paulo Ricardo de Leão • Todos os direitos reservados         ║
╚══════════════════════════════════════════════════════════════════════════╝
*/