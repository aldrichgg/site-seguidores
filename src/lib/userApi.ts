import { getApiBase } from "./api_base";

export async function getUserByUid(uid: string, token: string) {
  const base = getApiBase();
  const response = await fetch(`${base}/user/uid/${uid}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Erro ao buscar usuário');
  }
  
  return response.json();
}
