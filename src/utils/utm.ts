// --- helpers UTM ---
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
  
  const UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_id",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
  ] as const;
  
  const STORAGE_KEY = "utm_data_v1";
  
  function readUtmFromSearch(search: string): UTM {
    const params = new URLSearchParams(search || "");
    const out: UTM = {};
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) (out as any)[k] = v;
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
  // --- fim helpers UTM ---
  