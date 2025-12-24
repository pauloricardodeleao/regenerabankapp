
// [FILE] services/raphaAI.ts
import { GoogleGenAI } from "@google/genai";
import { MOCK_USER } from "../constants";
import { formatCurrency } from "./formatters";

// Initialize Gemini Client
// IMPORTANT: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// This is securely injected by the build system.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Mock Financial Context to feed the AI
const FINANCIAL_CONTEXT = {
  user: MOCK_USER.name,
  balance: formatCurrency(MOCK_USER.balance),
  creditCard: {
    limit: formatCurrency(350000),
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
    totalInvested: formatCurrency(15000000),
    cdb: "110% CDI",
    crypto: "Bitcoin, Ethereum"
  }
};

const SYSTEM_INSTRUCTION = `
Você é a Rapha AI, a assistente financeira de elite do Regenera Bank.
Sua persona: Profissional, sofisticada, direta, mas empática. Você é especialista em finanças pessoais, investimentos e sustentabilidade.

DADOS DO CLIENTE (Contexto RAG simulado):
Nome: ${FINANCIAL_CONTEXT.user}
Saldo em Conta: ${FINANCIAL_CONTEXT.balance}
Fatura Cartão: ${FINANCIAL_CONTEXT.creditCard.currentInvoice} (Vence: ${FINANCIAL_CONTEXT.creditCard.dueDate})
Limite Disponível: ${FINANCIAL_CONTEXT.creditCard.limit}
Gastos do Mês: ${FINANCIAL_CONTEXT.spendingAnalysis.totalSpentMonth}
Maior Gasto: ${FINANCIAL_CONTEXT.spendingAnalysis.topCategory} (${FINANCIAL_CONTEXT.spendingAnalysis.topCategoryAmount})
Investimentos: ${FINANCIAL_CONTEXT.investments.totalInvested} (Perfil: ${FINANCIAL_CONTEXT.investments.profile})

DIRETRIZES:
1. Respostas curtas e objetivas (máximo 3 frases), ideais para chat mobile.
2. Use formatação Markdown (negrito) para destacar valores e datas.
3. Se o usuário perguntar sobre gastos, use os dados acima.
4. Se o usuário pedir dicas de investimento, sugira com base no perfil moderado e produtos sustentáveis (ESG).
5. Se o usuário perguntar sobre o banco, destaque que somos focados em regeneração ambiental e tecnologia.
6. Nunca invente dados financeiros que não estejam no contexto. Se não souber, diga que precisa consultar o extrato detalhado.
`;

/**
 * Generates a response from Rapha AI using Google Gemini.
 * Implements exponential backoff for robustness.
 */
const generateWithRetry = async (
  userMessage: string, 
  history: {role: 'user' | 'model', parts: [{text: string}]}[],
  retries = 3
): Promise<string> => {
  try {
    // Fix: Updated model to 'gemini-3-flash-preview' for basic text tasks following @google/genai guidelines
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, 
        maxOutputTokens: 250, 
      }
    });

    if (!response.text) {
        throw new Error("Empty response from AI Model");
    }

    return response.text;
  } catch (error) {
    if (retries > 0) {
      const delay = Math.pow(2, 3 - retries) * 1000; // Exponential backoff: 1s, 2s, 4s
      console.warn(`Rapha AI: Retry attempt ${4 - retries} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateWithRetry(userMessage, history, retries - 1);
    }
    console.error("Rapha AI Secure Error after retries:", error);
    // Fallback message for user
    throw new Error("Service currently unavailable.");
  }
};

export const generateRaphaResponse = async (userMessage: string, chatHistory: {role: 'user' | 'model', parts: [{text: string}]}[]): Promise<string> => {
  try {
    return await generateWithRetry(userMessage, chatHistory);
  } catch (error) {
    return "Estou enfrentando uma instabilidade momentânea na minha conexão neural. Por favor, tente novamente em instantes.";
  }
};
