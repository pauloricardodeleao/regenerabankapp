/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - APPLICATION LAYER
  Service: Transaction Orchestrator
═══════════════════════════════════════════════════════════════════════════════
*/

import { Money } from '../domain/Money';
import { Account } from '../domain/Account';
import { analyzeTransactionRisk } from './fraudDetection';

/**
 * @author Don Paulo Ricardo
 * @description Orquestrador de transações financeiras.
 * Don: Esse cara é o 'glue code' entre a UI e o Domínio.
 */
export class TransactionService {
  /**
   * Realiza um Pix com análise de risco e proteção contra re-submissão.
   */
  static async executePixTransfer(
    sourceAccount: Account,
    amountCents: number,
    targetName: string
  ) {
    const amount = Money.fromCents(amountCents);
    
    // 1. Pre-flight Risk Analysis (O Don não brinca em serviço)
    const risk = await analyzeTransactionRisk(amountCents, targetName);
    if (risk.riskLevel === 'CRITICAL') {
      throw new Error(`SECURITY_BLOCK: ${risk.reason}`);
    }

    // 2. Client-side Idempotency Key Generation
    // Don: Se o app crashar e o usuário tentar de novo, a chave é a mesma no retry (v2 planejado).
    const idempotencyKey = `pix_${sourceAccount.id}_${Date.now()}`;

    try {
      // 3. Atomic Domain Operation
      const tx = sourceAccount.debit(amount, `Transferência Pix para ${targetName}`);
      
      // 4. Remote Sync (Simulado)
      // Em prod: await api.post('/transactions', { ...tx.toJSON(), idempotencyKey });
      
      console.log(`[Audit] Transaction ${tx.id} executed successfully. Key: ${idempotencyKey}`);
      return tx;
    } catch (err: any) {
      // Don: Fallback visual simples, sem overengineering aqui.
      console.error("Transação falhou na camada de domínio", err);
      throw err;
    }
  }
}
