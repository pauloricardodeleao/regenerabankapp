/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - CORE TRANSACTION SERVICE
  Module: Network Resilience
═══════════════════════════════════════════════════════════════════════════════
*/

import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TerminusModule,
    HttpModule.register({
      timeout: 3000, // Don: 3s é o limite da paciência do usuário no app.
      maxRedirects: 3,
    }),
  ],
  exports: [HttpModule, TerminusModule],
})
export class ResilienceModule {}
