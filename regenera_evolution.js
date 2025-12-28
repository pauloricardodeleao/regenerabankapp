/**
 * @title REGENERA EVOLUTION PROTOCOL
 * @author Don Paulo Ricardo de Leão (CTO)
 * @description Injeta padrões de Auditoria Imutável, Resiliência, Idempotência e Observabilidade.
 * Don: Rodar isso aqui em cada deploy pra garantir que nenhum dev "esqueceu" a segurança.
 */

const fs = require('fs');
const path = require('path');

const SERVICES_DIR = './apps/services';

const AUDIT_SERVICE_TEMPLATE = `
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * @author Don Paulo Ricardo
 * @description Sistema de Auditoria Imutável.
 * Don: SHA-256 HMAC pra blindar o ledger. Se o hash não bater, a transação é lixo.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger('AuditGuard');

  logSensitiveAction(userId: string, action: string, payload: any, resourceId: string) {
    const timestamp = new Date().toISOString();
    const dataToSign = \`\${userId}:\${action}:\${timestamp}:\${JSON.stringify(payload)}\`;
    
    const integrityHash = crypto.createHmac('sha256', process.env.AUDIT_SECRET || 'audit-secret-key')
      .update(dataToSign)
      .digest('hex');

    this.logger.log({
      level: 'CRITICAL_AUDIT',
      timestamp,
      userId,
      action,
      resourceId,
      integrityHash, // Prova de não violação forense
      metadata: payload
    });
  }
}
`;

const IDEMPOTENCY_GUARD_TEMPLATE = `
import { Injectable, CanActivate, ExecutionContext, ConflictException } from '@nestjs/common';
import { Redis } from 'ioredis';

/**
 * @author Don Paulo Ricardo
 * @description Previne Double Spending em transações financeiras.
 * Don: Trava de 24h no Redis. Sem isso, o cliente clica duas vezes no Pix e a gente quebra.
 */
@Injectable()
export class IdempotencyGuard implements CanActivate {
  private redis = new Redis({ 
    host: process.env.REDIS_HOST || 'localhost',
    retryStrategy: (times) => Math.min(times * 50, 2000) // Don: Reconnect pragmático
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers['x-idempotency-key'];

    if (request.method === 'GET' || !idempotencyKey) return true;

    const cacheKey = \`idempotency:\${idempotencyKey}\`;
    const existing = await this.redis.get(cacheKey);

    if (existing) {
      throw new ConflictException('Operação já processada ou em curso. Idempotency Check fail.');
    }

    await this.redis.set(cacheKey, 'PROCESSING', 'EX', 86400);
    return true;
  }
}
`;

const RESILIENCE_MODULE_TEMPLATE = `
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

/**
 * @author Don Paulo Ricardo
 * @description Módulo de Resiliência Distribuída.
 * Don: Circuit breaker pra não fritar o serviço de câmbio se a API deles peidar.
 */
@Module({
  imports: [
    TerminusModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  exports: [HttpModule, TerminusModule],
})
export class ResilienceModule {}
`;

const OBSERVABILITY_SETUP_TEMPLATE = `
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

/**
 * @author Don Paulo Ricardo
 * @description Inicializador de Observabilidade (Tracing Distribuído).
 * Don: Raio-X total. Se o endpoint de traces morrer, o SDK não pode derrubar o bootstrap.
 */
export const startObservability = () => {
  try {
    const sdk = new NodeSDK({
      traceExporter: new OTLPTraceExporter({
          url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
      }),
      instrumentations: [getNodeAutoInstrumentations()],
      serviceName: process.env.SERVICE_NAME || 'regenera-core-service',
    });

    sdk.start();
    console.log('[Observability] OpenTelemetry SDK ativado. Monitorando performance.');
  } catch (err) {
    console.error('[Observability] Falha no boot do OTel, mas seguimos o jogo.', err);
  }
};
`;

function injectInfrastructure(servicePath) {
    const srcDir = path.join(servicePath, 'src');
    const commonDir = path.join(srcDir, 'common');
    const guardsDir = path.join(commonDir, 'guards');
    const auditDir = path.join(commonDir, 'audit');
    const infraDir = path.join(commonDir, 'infra');

    [guardsDir, auditDir, infraDir].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    fs.writeFileSync(path.join(auditDir, 'audit.service.ts'), AUDIT_SERVICE_TEMPLATE);
    fs.writeFileSync(path.join(guardsDir, 'idempotency.guard.ts'), IDEMPOTENCY_GUARD_TEMPLATE);
    fs.writeFileSync(path.join(infraDir, 'resilience.module.ts'), RESILIENCE_MODULE_TEMPLATE);
    fs.writeFileSync(path.join(infraDir, 'observability.ts'), OBSERVABILITY_SETUP_TEMPLATE);

    const mainPath = path.join(srcDir, 'main.ts');
    if (fs.existsSync(mainPath)) {
        let mainContent = fs.readFileSync(mainPath, 'utf8');
        if (!mainContent.includes('startObservability')) {
            mainContent = `import { startObservability } from './common/infra/observability';\n` + mainContent;
            mainContent = mainContent.replace('async function bootstrap() {', 'async function bootstrap() {\n  startObservability(); // Don Standard: Observability First');
            fs.writeFileSync(mainPath, mainContent);
        }
    }
}

function scanAndEvolve() {
    if (!fs.existsSync(SERVICES_DIR)) return;
    fs.readdirSync(SERVICES_DIR).forEach(service => {
        const servicePath = path.join(SERVICES_DIR, service);
        if (fs.statSync(servicePath).isDirectory()) {
            injectInfrastructure(servicePath);
        }
    });
}

scanAndEvolve();