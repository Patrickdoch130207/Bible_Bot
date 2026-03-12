import { v4 as uuidv4 } from 'uuid';

export const getOrCreateUserId = (): string => {
  const STORAGE_KEY = "lumiere_user_id";
  
  // 1. Chercher si un ID existe déjà
  let userId = localStorage.getItem(STORAGE_KEY);
  
  // 2. Si non, le générer et l'enregistrer
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(STORAGE_KEY, userId);
  }
  
  return userId;
};