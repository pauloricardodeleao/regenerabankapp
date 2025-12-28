/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - DOMAIN LAYER
  Aggregate: Account
═══════════════════════════════════════════════════════════════════════════════
*/

import { Money } from './Money';
import { Transaction } from './Transaction';

/**
 * @author Don Paulo Ricardo
 * @description Agregado de Conta. 
 * Don: A única fonte da verdade pro saldo. Se tentar subtrair o que não tem, o VO barra.
 */
export class Account {
  constructor(
    public readonly id: string,
    private balance: Money,
    private transactions: Transaction[] = []
  ) {}

  getBalance(): Money {
    return this.balance;
  }

  /**
   * Don: Processa entrada de capital. 
   * Idempotência aqui é tratada no TransactionService, mas a conta aceita o crédito.
   */
  credit(amount: Money, description: string): Transaction {
    this.balance = this.balance.add(amount);
    const tx = new Transaction(
      crypto.randomUUID(),
      `CORR-${Date.now()}`,
      amount,
      'INBOUND',
      description,
      'EXTERNAL',
      this.id
    );
    tx.settle();
    this.transactions.unshift(tx);
    return tx;
  }

  /**
   * Don: Fluxo de débito blindado.
   * Se o balance.subtract der throw, a transação nem é criada. 
   */
  debit(amount: Money, description: string): Transaction {
    // Portinglês: Tentando subtrair. Se falhar, o erro sobe pro service.
    this.balance = this.balance.subtract(amount);
    
    const tx = new Transaction(
      crypto.randomUUID(),
      `CORR-${Date.now()}`,
      amount,
      'OUTBOUND',
      description,
      this.id,
      'TARGET'
    );
    tx.settle();
    this.transactions.unshift(tx);
    return tx;
  }

  getRecentHistory(limit = 10): Transaction[] {
    return this.transactions.slice(0, limit);
  }
}
