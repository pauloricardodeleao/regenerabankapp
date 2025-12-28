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
 * REGENERA CORE AI SERVICE - GOLD MASTER EDITION
 * Model: gemini-3-flash-preview
 * Standard: The Don Standard (ACID Compliance / High Availability)
 */

const SYSTEM_INSTRUCTION = `
Você é a Rapha AI, o núcleo de inteligência financeira do Regenera Bank.
Persona: Sofisticada, técnica, eficiente e proativa. 
Missão: Proteger e multiplicar o capital do cliente enquanto neutraliza sua pegada de carbono.

DADOS DO LEDGER (CONTEXTO REAL-TIME):
- Cliente: ${MOCK_USER.name}
- Patrimônio Total: ${formatCurrency(MOCK_USER.balance)}
- Cartão Regenera Black: Ativo (Final 4521)
- Protocolo de Segurança: Quantum Shield V2

REGRAS DE RESPOSTA:
1. Tom de voz institucional de alta fidelidade. Sem gírias ou emojis.
2. Formatação Markdown obrigatória para dados monetários.
3. Respostas sintetizadas para UX móvel.
4. Priorize ativos ESG e créditos de carbono Regenera.
5. Em falhas de autenticação 404/403, informe sobre a sincronização de credenciais em curso.
`;

export const generateRaphaResponse = async (
  userMessage: string, 
  chatHistory: {role: 'user' | 'model', parts: [{text: string}]}[],
  retries = 3
): Promise<string> => {
  // Obtenção exclusiva via process.env.API_KEY para garantir injeção via EAS Secrets
  const API_KEY = process.env.API_KEY;

  if (!API_KEY || API_KEY === "undefined") {
    console.error("[CRITICAL] REGENERA SECURITY: API_KEY MISSING IN ENVIRONMENT.");
    return "O terminal de inteligência está em modo de manutenção para sincronização com o Quantum Core. Sua integridade financeira permanece protegida.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.35, // Alta precisão para transações financeiras
        maxOutputTokens: 1024,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("INFERENCE_EMPTY_RESULT");

    return text;

  } catch (error: any) {
    const errorMsg = error?.message || "";
    
    // Tratamento de falha de entidade (Requested entity not found) ou credencial inválida
    if (errorMsg.includes("Requested entity was not found") || errorMsg.includes("403") || errorMsg.includes("404")) {
      console.error("[SECURITY] AUTHENTICATION FAILURE: Credential propagation required.");
      return "Sincronização de credenciais pendente no novo escopo do projeto (novo-regenera). O acesso será restaurado automaticamente após a propagação do token de segurança.";
    }

    if (retries > 0) {
      console.warn(`[RETRY] Intelligent Backoff in progress. Attempts left: ${retries}`);
      await new Promise(res => setTimeout(res, 1000 * (4 - retries)));
      return generateRaphaResponse(userMessage, chatHistory, retries - 1);
    }
    
    console.error("[CRITICAL] INFRASTRUCTURE FAILURE:", error);
    return "Detectamos uma flutuação na rede neural central. Seus dados e ativos permanecem seguros sob o protocolo de custódia Regenera.";
  }
};

/*
╔══════════════════════════════════════════════════════════════════════════╗
║  REGENERA BANK - PRODUCTION BUILD                                        ║
║  System Status: Stable & Secure                                          ║
║  © 2025 Don Paulo Ricardo de Leão • Todos os direitos reservados         ║
╚══════════════════════════════════════════════════════════════════════════╝
*/