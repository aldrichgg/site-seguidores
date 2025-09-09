import { getApiBase } from "@/lib/api_base";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserByUid } from "@/lib/userApi";

export function useInfluencerDashboard(
  period: "week" | "month" | "year",
  selectedPageId?: string
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user } = useAuth();
  const base = getApiBase();

  // Buscar dados do usuário primeiro
  useEffect(() => {
    let cancelled = false;
    
    if (user?.user_id) {
      const token = localStorage.getItem("token");
      if (token) {
        getUserByUid(user.user_id, token)
          .then((userData) => {
            if (!cancelled) {
              setUserProfile(userData);
            }
          })
          .catch((err) => {
            if (!cancelled) {
              setError(err.message || "Erro ao buscar dados do usuário");
            }
          });
      }
    }

    return () => { cancelled = true; };
  }, [user?.user_id]);

  // Buscar dados do dashboard
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    if (!userProfile) return;

    // Construir a URL com parâmetros
    const url = new URL(`${base}/analytics/overview`);
    url.searchParams.set('period', period);
    
    // Se uma página específica foi selecionada, usar o utm_source dessa página
    if (selectedPageId && userProfile?.profilePages) {
      const selectedPage = userProfile.profilePages.find((page: any) => page.id === selectedPageId);
      if (selectedPage) {
        url.searchParams.set('utm_source', selectedPage.name);
      }
    }
    // Se nenhuma página específica foi selecionada, buscar dados de todas as páginas do influenciador
    else if (user?.user_id) {
      // Usar o influencer_uid para buscar dados de todas as páginas
      url.searchParams.set('influencer_uid', user.user_id);
    }
    
    /* console.log(url.toString()); */
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
  }, [period, selectedPageId, userProfile, user?.user_id]);

  return { data, loading, error, userProfile };
}
