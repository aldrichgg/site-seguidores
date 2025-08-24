// src/lib/apiBase.ts
export function getApiBase() {
  // Vite
  const vite = typeof import.meta !== 'undefined'
    ? (import.meta as any).env?.VITE_API_URL
    : undefined;

  // Next.js
  const next = typeof process !== 'undefined'
    ? (process as any).env?.NEXT_PUBLIC_API_URL
    : undefined;

  // CRA
  const cra = typeof process !== 'undefined'
    ? (process as any).env?.REACT_APP_API_URL
    : undefined;

  // Fallback: mesma origem (quando o backend está no mesmo host)
  const sameOrigin = typeof window !== 'undefined' ? '' : 'http://localhost:3000';

  return vite || next || cra 
}
