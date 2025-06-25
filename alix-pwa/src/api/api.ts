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

export const registerToContent = async ({
  userId,
  contentType,
  contentId,
}: {
  userId: number;
  contentType: 'event' | 'workshop';
  contentId: number;
}) => {
  try {
    const payload = {
      user_id: userId,
      event_id: contentType === 'event' ? contentId : undefined,
      workshop_id: contentType === 'workshop' ? contentId : undefined,
      registered_at: new Date().toISOString(),
    };

    console.log('📦 Payload envoyé :', payload);

    const response = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    console.error('Erreur d\'inscription :', error.response?.data || error.message);
    throw new Error('Échec de l\'inscription');
  }
};


export async function checkRegistration(userId: number, contentType: 'event' | 'workshop', contentId: number) {
  const paramName = contentType === 'event' ? 'eventId' : 'workshopId';
  const response = await fetch(`${API_BASE_URL}/registrations/check?userId=${userId}&${paramName}=${contentId}`);

  const text = await response.text();
  console.log('Réponse brute :', text);

  if (!response.ok) {
    throw new Error(`Erreur lors de la vérification de l'inscription : ${text}`);
  }

  return JSON.parse(text);
}


export const unregisterFromContent = async ({
  userId,
  contentType,
  contentId,
}: {
  userId: number;
  contentType: "event" | "workshop";
  contentId: number;
}) => {
  const paramName = contentType === "event" ? "eventId" : "workshopId";

  const url = `${API_BASE_URL}/registrations?userId=${userId}&${paramName}=${contentId}`;

  const res = await fetch(url, {
    method: "DELETE",
  });

  if (!res.ok && res.status !== 204) {
    const errorText = await res.text();
    console.error("Erreur de désinscription :", errorText);
    throw new Error("Échec de la désinscription");
  }

  return true;
};