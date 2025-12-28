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
 * REGENERA CORE AI SERVICE
 * Model: gemini-3-flash-preview
 * Deployment Standard: The Don Standard
 */

const SYSTEM_INSTRUCTION = `
Você é a Rapha AI, o núcleo de inteligência financeira do Regenera Bank.
Persona: Sofisticada, técnica, eficiente e proativa. 
Missão: Proteger e multiplicar o capital do cliente enquanto neutraliza sua pegada de carbono.

DADOS DO LEDGER (CONTEXTO REAL-TIME):
- Cliente: ${MOCK_USER.name}
- Patrimônio Total: ${formatCurrency(MOCK_USER.balance)}
- Cartão Regenera Black: Ativo (Final 4521)
- Cashback Acumulado: R$ 452,10

REGRAS DE RESPOSTA:
1. Tom de voz institucional de alta fidelidade. Sem gírias ou emojis.
2. Formatação Markdown obrigatória para dados monetários.
3. Respostas sintetizadas para UX móvel.
4. Priorize ativos ESG e créditos de carbono Regenera.
5. Falhas de conexão devem ser tratadas como "Protocolo de Sincronização em curso".
`;

export const generateRaphaResponse = async (
  userMessage: string, 
  chatHistory: {role: 'user' | 'model', parts: [{text: string}]}[],
  retries = 3
): Promise<string> => {
  // O SDK exige process.env.API_KEY para autenticação segura.
  const API_KEY = process.env.API_KEY;

  if (!API_KEY || API_KEY === "undefined") {
    console.error("[SECURITY] CRITICAL: API_KEY NOT DETECTED IN ENVIRONMENT.");
    return "Sincronização Quantum Core em curso. A integridade dos seus dados e transações permanece intacta sob o protocolo de segurança.";
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
        temperature: 0.4,
        maxOutputTokens: 1024,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("EMPTY_INFERENCE_RESULT");

    return text;

  } catch (error: any) {
    const errorMsg = error?.message || "";
    
    // Tratamento de Race Conditions e Falhas de Credenciais (Requested entity handle)
    if (errorMsg.includes("Requested entity was not found") || errorMsg.includes("403") || errorMsg.includes("404")) {
      console.error("[SECURITY] AUTHENTICATION FAILURE: Credential sync required.");
      return "Sincronização de credenciais de segurança pendente no servidor central. O acesso à inteligência será restaurado automaticamente após a propagação do token.";
    }

    if (retries > 0) {
      const backoff = (4 - retries) * 1000;
      await new Promise(res => setTimeout(res, backoff));
      return generateRaphaResponse(userMessage, chatHistory, retries - 1);
    }
    
    console.error("[CRITICAL] INFRASTRUCTURE FAILURE:", error);
    return "Flutuação detectada na rede neural. Seus ativos permanecem seguros. Tente novamente em instantes.";
  }
};