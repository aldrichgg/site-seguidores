import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

export type UTM = Partial<{
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
  "utm_source","utm_medium","utm_campaign","utm_id","utm_term","utm_content","gclid","fbclid",
];

function readFromSearch(search: string): UTM {
  const params = new URLSearchParams(search || "");
  const out: UTM = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) out[k] = v;
  });
  return out;
}
function readFromStorage(): UTM | null {
  try { const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UTM) : null;
  } catch { return null; }
}
function saveToStorage(utm: UTM) {
  try { if (Object.keys(utm).length) localStorage.setItem(STORAGE_KEY, JSON.stringify(utm)); } catch {}
}
function mergeUtm(priority: UTM, fallback: UTM | null): UTM {
  return { ...(fallback || {}), ...priority };
}

type Ctx = {
  utm: UTM;
  setUtm: (u: UTM) => void;
  utmQueryString: string;
  buildUrlWithUtm: (url: string) => string;
};

const UTMContext = createContext<Ctx | null>(null);

export const UTMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [utm, setUtm] = useState<UTM>({});

  // Inicializa e atualiza quando a busca (querystring) mudar
  useEffect(() => {
    const fromUrl = readFromSearch(location.search);
    const fromStorage = readFromStorage();
    const finalUtm = mergeUtm(fromUrl, fromStorage);
    setUtm(finalUtm);
    if (Object.keys(fromUrl).length) saveToStorage(finalUtm);
  }, [location.search]);

  // Sincroniza entre abas (opcional)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setUtm(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const utmQueryString = useMemo(() => {
    const qs = new URLSearchParams();
    UTM_KEYS.forEach((k) => { const v = utm[k]; if (v) qs.set(k, v); });
    return qs.toString();
  }, [utm]);

  const buildUrlWithUtm = (url: string) => {
    try {
      const u = new URL(url);
      const qs = new URLSearchParams(u.search);
      UTM_KEYS.forEach((k) => { const v = utm[k]; if (v) qs.set(k, v); });
      u.search = qs.toString();
      return u.toString();
    } catch {
      const prefix = url.includes("?") ? "&" : "?";
      return utmQueryString ? `${url}${prefix}${utmQueryString}` : url;
    }
  };

  const value = useMemo(() => ({ utm, setUtm, utmQueryString, buildUrlWithUtm }), [utm, utmQueryString]);

  return <UTMContext.Provider value={value}>{children}</UTMContext.Provider>;
};

export function useUTMContext() {
  const ctx = useContext(UTMContext);
  if (!ctx) throw new Error("useUTMContext must be used inside <UTMProvider>");
  return ctx;
}
