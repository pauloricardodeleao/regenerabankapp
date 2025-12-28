/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Quantum AI Hub (Rapha AI)
   
  Developer: Don Paulo Ricardo
  CEO: Raphaela Cervesky
   
  ORCID: https://orcid.org/0009-0002-1934-3559
  Copyright © 2025 Regenera Ecosystem. All rights reserved.
═══════════════════════════════════════════════════════════════════════════════
*/

// [FILE] services/raphaAI.ts
import { GoogleGenAI } from "@google/genai";
import { MOCK_USER } from "../constants";
import { formatCurrency } from "./formatters";

/**
 * REGENERA CORE AI INITIALIZATION
 * The API key is injected via secure environment variables.
 * Standard: The Don Standard - Zero leakage, High-compute inference.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FINANCIAL_CONTEXT = {
  user: MOCK_USER.name,
  balance: formatCurrency(MOCK_USER.balance),
  creditCard: {
    limit: formatCurrency(35000000),
    currentInvoice: formatCurrency(245080),
    dueDate: "10/06/2025"
  },
  spendingAnalysis: {
    topCategory: "Alimentação (Food)",
    topCategoryAmount: formatCurrency(185000),
    totalSpentMonth: formatCurrency(510000),
    anomalies: "Gasto 15% acima da média em Lazer."
  },
  investments: {
    profile: "Moderado",
    totalInvested: formatCurrency(150000000),
    cdb: "110% CDI",
    crypto: "Bitcoin, Ethereum"
  }
};

const SYSTEM_INSTRUCTION = `
Você é a Rapha AI, o núcleo de inteligência financeira do Regenera Bank.
Persona: Sofisticada, técnica, eficiente e proativa. 
Missão: Proteger e multiplicar o capital do cliente enquanto neutraliza sua pegada de carbono.

CONTEXTO ATUAL (REAL-TIME LEDGER):
- Cliente: ${FINANCIAL_CONTEXT.user}
- Liquidez: ${FINANCIAL_CONTEXT.balance}
- Cartão: ${FINANCIAL_CONTEXT.creditCard.currentInvoice} (Limite: ${FINANCIAL_CONTEXT.creditCard.limit})
- Perfil Investidor: ${FINANCIAL_CONTEXT.investments.profile} (${FINANCIAL_CONTEXT.investments.totalInvested} alocados)

DIRETRIZES TÉCNICAS:
1. Tom de voz institucional de alta fidelidade.
2. Formatação Markdown obrigatória para dados monetários e percentuais.
3. Respostas sintetizadas para UX móvel (max 3 parágrafos).
4. Em caso de dúvidas de segurança, sugira o bloqueio imediato via Centro de Segurança.
5. Priorize ativos ESG e créditos de carbono Regenera em recomendações de investimento.
`;

/**
 * generateRaphaResponse - High-level abstraction for Gemini interaction.
 * Implements architectural safeguards and retry logic.
 */
export const generateRaphaResponse = async (
  userMessage: string, 
  chatHistory: {role: 'user' | 'model', parts: [{text: string}]}[],
  retries = 3
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.65, // Balancing precision and creativity
        maxOutputTokens: 512,
        thinkingConfig: { thinkingBudget: 0 } // Flash low-latency mode
      }
    });

    if (!response.text) throw new Error("Null model turn output.");

    return response.text;
  } catch (error) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, 1500));
      return generateRaphaResponse(userMessage, chatHistory, retries - 1);
    }
    console.error("[CRITICAL] Rapha AI Communication Failure:", error);
    return "Detectei uma flutuação na rede neural. A integridade dos dados permanece segura, mas peço que reinicie o terminal de chat em alguns instantes.";
  }
};

/*
╔══════════════════════════════════════════════════════════════════════════╗
║  REGENERA BANK - PRODUCTION BUILD                                        ║
║  System Status: Stable & Secure                                          ║
║  © 2025 Don Paulo Ricardo de Leão • Todos os direitos reservados         ║
╚══════════════════════════════════════════════════════════════════════════╝
*/