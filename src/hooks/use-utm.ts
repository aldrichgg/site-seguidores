import { useEffect, useState } from "react";

type UTM = Partial<{
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_id: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  fbclid: string;
}>;

const STORAGE_KEY = "utm_data_v1";

const UTM_KEYS: (keyof UTM)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_id",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
];

function readUtmFromSearch(search: string): UTM {
  const params = new URLSearchParams(search || "");
  const out: UTM = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) out[k] = v;
  });
  return out;
}

function readUtmFromStorage(): UTM | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UTM) : null;
  } catch {
    return null;
  }
}

function saveUtmToStorage(utm: UTM) {
  try {
    if (Object.keys(utm).length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    }
  } catch {}
}

function mergeUtm(priority: UTM, fallback: UTM | null): UTM {
  return { ...(fallback || {}), ...priority };
}

/**
 * Hook para capturar e persistir UTMs
 */
export function useUTM() {
  const [utm, setUtm] = useState<UTM>({});

  useEffect(() => {
    const fromUrl = readUtmFromSearch(window.location.search);
    const fromStorage = readUtmFromStorage();
    const finalUtm = mergeUtm(fromUrl, fromStorage);

    setUtm(finalUtm);

    // Se veio da URL, sobrescreve o storage
    if (Object.keys(fromUrl).length) {
      saveUtmToStorage(finalUtm);
    }
  }, []);

  return utm;
}
