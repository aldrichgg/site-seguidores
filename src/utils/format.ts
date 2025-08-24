export const formatBRL = (cents?: number | null) =>
  typeof cents === 'number'
    ? (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '—';

export const formatDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString('pt-BR') : '—';
