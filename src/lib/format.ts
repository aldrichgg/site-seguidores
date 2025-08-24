export function fmtBRL(vCents: number): string {
  return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((vCents ?? 0) / 100);
}

export function fmtInt(n: number): string {
  return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(n ?? 0);
}

export function weekdayPt(iso: string): string {
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const d = new Date(iso);
  return dias[d.getDay()];
}
