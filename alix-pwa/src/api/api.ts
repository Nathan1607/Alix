import { Articles } from '../types/articles';
import { Workshops } from '../types/workshop';
import { Events } from '../types/events';

const API_BASE_URL = 'http://localhost:3000';

export const getArticles = async (communeId: number): Promise<Articles[]> => {
  const res = await fetch(`${API_BASE_URL}/articles?communeId=${communeId}`);

  console.log(`Fetching articles for communeId: ${communeId} from ${API_BASE_URL}/articles?communeId=${communeId}`);

  if (!res.ok) throw new Error('Erreur lors de la récupération des articles');
  return await res.json();
};

export const getEvents = async (communeId: number): Promise<Events[]> => {
  const res = await fetch(`${API_BASE_URL}/events?communeId=${communeId}`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des events');
  return await res.json();
};

export const getWorkshops = async (communeId: number): Promise<Workshops[]> => {
  const res = await fetch(`${API_BASE_URL}/workshops?communeId=${communeId}`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des workshops');
  return await res.json();
};
