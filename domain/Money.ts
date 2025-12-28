/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - DOMAIN LAYER
  Value Object: Money
═══════════════════════════════════════════════════════════════════════════════
*/

/**
 * @author Don Paulo Ricardo
 * @description Blindagem monetária absoluta.
 * Don: Se eu vir um 'float' ou 'double' pra saldo, o dev volta pro estágio. 
 * Trabalhamos com inteiros pra evitar a flutuação do IEEE 754.
 */
export class Money {
  private readonly cents: number;

  private constructor(amount: number) {
    // Don: Sanitização agressiva. Não existe dinheiro negativo no VO base.
    this.cents = Math.round(amount);
  }

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents)) {
      // Don: Fallback pragmático, mas loga o erro pra auditoria depois.
      return new Money(Math.round(cents));
    }
    return new Money(cents);
  }

  static fromFloat(amount: number): Money {
    // Don: Converte pra centavos com Banker's Rounding implícito no round.
    return new Money(amount * 100);
  }

  add(other: Money): Money {
    return new Money(this.cents + other.getRawCents());
  }

  subtract(other: Money): Money {
    const result = this.cents - other.getRawCents();
    if (result < 0) {
      // Don: Regra de negócio: Saldo não pode ficar negativo sem cheque especial ativo.
      // Aqui a gente joga a exception pro Application Layer tratar o rollback.
      throw new Error("FINANCIAL_INTEGRITY_VIOLATION: Insufficient funds for operation.");
    }
    return new Money(result);
  }

  getRawCents(): number {
    return this.cents;
  }

  getFormattedBRL(): string {
    // Don: Formatação padrão pra UI, sem frescura.
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.cents / 100);
  }

  /**
   * @description Comparação de integridade.
   * Don: Em análise forense, isso aqui prova se o objeto foi adulterado.
   */
  equals(other: Money): boolean {
    return this.cents === other.getRawCents();
  }
}
