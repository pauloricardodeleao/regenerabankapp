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
`;

export const generateRaphaResponse = async (
  userMessage: string, 
  chatHistory: {role: 'user' | 'model', parts: [{text: string}]}[],
  retries = 3
): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("[CRITICAL] API_KEY missing in environment variables.");
    return "O terminal de inteligência está temporariamente offline para sincronização de chaves criptográficas.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: 1024,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE");

    return text;

  } catch (error: any) {
    const errorMsg = error?.message || "";
    
    // Tratamento de erro de propagação de credenciais
    if (errorMsg.includes("Requested entity was not found") || errorMsg.includes("403")) {
      return "Sincronização de credenciais pendente no ambiente de produção. Seus ativos permanecem protegidos pelo Quantum Shield.";
    }

    if (retries > 0) {
      // Exponential backoff simulado
      await new Promise(res => setTimeout(res, 1000));
      return generateRaphaResponse(userMessage, chatHistory, retries - 1);
    }
    
    console.error("[CRITICAL] AI Infrastructure failure:", error);
    return "O terminal de inteligência está em modo de manutenção preventiva. A integridade dos seus dados está garantida.";
  }
};