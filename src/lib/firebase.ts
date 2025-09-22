import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  // Você precisa adicionar suas credenciais do Firebase aqui
  apiKey: "AIzaSyArfAUDS2o5Feg4xaal9QtJ88U1IwsWqVM",
  authDomain: "impulsegram-36ed2.firebaseapp.com",
  projectId: "impulsegram-36ed2",
  storageBucket: "impulsegram-36ed2.firebasestorage.app",
  messagingSenderId: "796721393442",
  appId: "1:796721393442:web:6255f8293526e43d15ff7b"
};

// Inicializar Firebase apenas se não existir uma instância
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
