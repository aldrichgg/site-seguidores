import { getApiBase } from "@/lib/api_base";
import { useEffect, useState } from "react";

export function useDashboard(
  period: "week" | "month" | "year",
  utmSource?: string
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const base = getApiBase();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // Construir a URL com parâmetros opcionais
    const url = new URL(`${base}/analytics/overview`);
    url.searchParams.set('period', period);
    if (utmSource) {
      url.searchParams.set('utm_source', utmSource);
    }

    fetch(url.toString())
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados");
        const json = await res.json();
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Erro desconhecido");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [period, utmSource]);

  return { data, loading, error };
}
