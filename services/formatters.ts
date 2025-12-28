/*
═══════════════════════════════════════════════════════════════════════════════
  REGENERA BANK - INFRASTRUCTURE LAYER
  Utility: Financial Formatters
═══════════════════════════════════════════════════════════════════════════════
*/

import { Money } from '../domain/Money';

/**
 * Formata valores monetários.
 * @param value Pode ser number (centavos) ou Money VO.
 */
export const formatCurrency = (value: number | Money): string => {
  if (value instanceof Money) {
    return value.getFormattedBRL();
  }
  
  if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
  
  // Don: Fallback pragmático pra código que ainda não usa o VO.
  const centsValue = Math.floor(value) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(centsValue);
};

export const formatDate = (dateString: string | number): string => {
  if (!dateString) return '--/--';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};
