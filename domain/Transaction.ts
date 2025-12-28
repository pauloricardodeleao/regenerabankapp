/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - DOMAIN LAYER
  Entity: Transaction
═══════════════════════════════════════════════════════════════════════════════
*/

import { Money } from './Money';

export type TransactionType = 'INBOUND' | 'OUTBOUND';
export type TransactionStatus = 'PENDING' | 'VALIDATED' | 'REJECTED' | 'SETTLED';

/**
 * @author Don Paulo Ricardo
 * @description Agregado de Transação. 
 * Don: Isso aqui é o coração do ledger. Cada campo aqui é auditável.
 */
export class Transaction {
  public readonly id: string;
  public readonly correlationId: string;
  public readonly timestamp: number;
  
  private status: TransactionStatus = 'PENDING';

  constructor(
    id: string,
    correlationId: string,
    private readonly amount: Money,
    private readonly type: TransactionType,
    private readonly description: string,
    private readonly senderId: string,
    private readonly receiverId: string
  ) {
    this.id = id;
    this.correlationId = correlationId;
    this.timestamp = Date.now();
  }

  /**
   * Don: Seta o status com trava de estado (State Machine simples).
   * Uma transação SETTLED nunca volta a PENDING.
   */
  settle() {
    if (this.status === 'REJECTED') {
      throw new Error("DOMAIN_LOGIC_ERROR: Cannot settle a rejected transaction.");
    }
    this.status = 'SETTLED';
    // Don: Emitir evento de domínio aqui na v2 (Integration Bus).
  }

  reject(reason: string) {
    console.warn(`[Audit] Transaction ${this.id} rejected: ${reason}`);
    this.status = 'REJECTED';
  }

  getStatus(): TransactionStatus {
    return this.status;
  }

  getAmount(): Money {
    return this.amount;
  }

  // Don: Helper rápido pra UI não ter que carregar o VO direto se for preguiçosa.
  toJSON() {
    return {
      id: this.id,
      correlationId: this.correlationId,
      amount: this.amount.getRawCents(),
      formatted: this.amount.getFormattedBRL(),
      type: this.type,
      status: this.status,
      timestamp: this.timestamp,
      description: this.description
    };
  }
}
