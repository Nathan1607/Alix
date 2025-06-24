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
  contentType: string;
  contentId: number;
}) => {
  const payload = {
    userId,
    contentType,
    contentId,
  };

  console.log("Payload envoyé :", payload);

  const response = await fetch(`${API_BASE_URL}/registrations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text(); // Lire le texte brut même si pas JSON

  console.log("Code réponse :", response.status);
  console.log("Texte de réponse :", responseText);

  if (!response.ok) {
    let errorData;
    try {
      errorData = JSON.parse(responseText);
    } catch (err) {
      errorData = { message: responseText };
    }
    console.error("Erreur d'inscription :", errorData);
    throw new Error("Échec de l'inscription");
  }

  try {
    return JSON.parse(responseText);
  } catch (err) {
    console.warn("Réponse non JSON :", responseText);
    return responseText;
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
  const res = await fetch(
    `${API_BASE_URL}/registrations/by-data?userId=${userId}&contentType=${contentType}&contentId=${contentId}`,
    { method: "DELETE" }
  );

  if (!res.ok && res.status !== 204) {
    const errorText = await res.text();
    console.error("Erreur de désinscription :", errorText);
    throw new Error("Échec de la désinscription");
  }

  return true;
};
