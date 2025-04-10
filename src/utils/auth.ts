// src/utils/auth.ts
import {jwtDecode} from 'jwt-decode';

export interface FirebaseUserClaims {
  user_id: string;
  email: string;
  name?: string;
  role?: string | number;
  exp: number;
  iat: number;
  [key: string]: any;
}

export function getUserFromToken(idToken: string): FirebaseUserClaims | null {
  try {
    return jwtDecode<FirebaseUserClaims>(idToken);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}
