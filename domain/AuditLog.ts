/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - DOMAIN LAYER
  Entity: AuditLog
═══════════════════════════════════════════════════════════════════════════════
*/

import { Money } from './Money';

export type AuditAction = 'PIX_SENT' | 'AUTH_SUCCESS' | 'LIMIT_REACHED' | 'RISK_FLAG';

/**
 * @author Don Paulo Ricardo
 * @description Rastro de auditoria assinado digitalmente (Simulação).
 * Don: Em prod, isso aqui vira um hash SHA-256 numa blockchain privada ou AWS QLDB.
 */
export class AuditLog {
  public readonly id: string;
  public readonly hash: string;
  public readonly timestamp: number;

  constructor(
    public readonly userId: string,
    public readonly action: AuditAction,
    public readonly metadata: Record<string, any>
  ) {
    this.id = crypto.randomUUID();
    this.timestamp = Date.now();
    this.hash = this.generateIntegrityHash();
  }

  private generateIntegrityHash(): string {
    // Don: Prova forense de integridade do log.
    const payload = `${this.id}-${this.userId}-${this.action}-${this.timestamp}`;
    return btoa(payload).slice(0, 16); // Simulação de hash atômico
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      action: this.action,
      integrity: this.hash,
      ...this.metadata
    };
  }
}
