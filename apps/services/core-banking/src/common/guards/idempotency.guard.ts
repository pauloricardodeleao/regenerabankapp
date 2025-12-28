/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Security & Integrity
═══════════════════════════════════════════════════════════════════════════════
*/

import { Injectable, CanActivate, ExecutionContext, ConflictException } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  // Don: Redis Cluster é mandatório aqui. Single point of failure = prejuízo.
  private redis = new Redis({ 
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers['x-idempotency-key'];

    // Don: GET é safe, não precisa de lock.
    if (request.method === 'GET' || !idempotencyKey) return true;

    const cacheKey = `idempotency:${idempotencyKey}`;
    const status = await this.redis.get(cacheKey);

    if (status) {
      // Don: Se já existe, é tentativa de double-spending ou retry desnecessário.
      throw new ConflictException('Idempotency conflict: transação já processada ou bloqueada.');
    }

    // TTL de 24h é o padrão da casa.
    await this.redis.set(cacheKey, 'LOCKED', 'EX', 86400);
    return true;
  }
}
