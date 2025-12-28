/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Audit & Compliance
═══════════════════════════════════════════════════════════════════════════════
*/

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger('AuditGuard');

  /**
   * Registra ações sensíveis com prova de integridade.
   * Don: Se o banco de dados for comprometido, os logs assinados provam a verdade.
   */
  logSensitiveAction(userId: string, action: string, payload: any, resourceId: string) {
    const timestamp = new Date().toISOString();
    const dataToSign = `${userId}:${action}:${timestamp}:${JSON.stringify(payload)}`;
    
    // Hash SHA-256 HMAC para detectar qualquer tentativa de tamper nos logs.
    const integrityHash = crypto.createHmac('sha256', process.env.AUDIT_SECRET || 'fallback-secret-2025')
      .update(dataToSign)
      .digest('hex');

    this.logger.log({
      level: 'CRITICAL_AUDIT',
      timestamp,
      userId,
      action,
      resourceId,
      integrityHash, 
      metadata: payload
    });
  }
}
