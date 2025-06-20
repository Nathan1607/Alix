import { Articles } from '../types/articles';
import { Workshops } from '../types/workshop';
import { Events } from '../types/events';

const API_BASE_URL = 'http://localhost:3000';

export const getArticles = async (): Promise<Articles[]> => {
  const res = await fetch(`${API_BASE_URL}/articles`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des articles');
  return await res.json();
};

export const getEvents = async (): Promise<Events[]> => {
  const res = await fetch(`${API_BASE_URL}/events`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des events');
  return await res.json();
};

export const getWorkshops = async (): Promise<Workshops[]> => {
  const res = await fetch(`${API_BASE_URL}/workshops`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des workshops');
  return await res.json();
};
