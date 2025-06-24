import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Registration } from '../class/Registration';
import { User } from '../class/User';
import { Event } from '../class/Event';
import { Workshop } from '../class/Workshop';

const router = Router();
const registrationRepository = AppDataSource.getRepository(Registration);

/**
 * @swagger
 * /registrations:
 *   get:
 *     summary: Récupérer toutes les inscriptions
 *     tags: [Registrations]
 *     responses:
 *       200:
 *         description: Liste des inscriptions
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const registrations = await registrationRepository.find({
      relations: ['user', 'event', 'workshop'],
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des inscriptions .',
    });
  }
});

/**
 * @swagger
 * /registrations/check:
 *   get:
 *     summary: Vérifie si un utilisateur est inscrit à un événement ou un atelier
 *     tags: [Registrations]
 */
router.get('/check', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, eventId, workshopId } = req.query;

    if (!userId || (!eventId && !workshopId)) {
      res.status(400).json({ error: "Paramètres manquants" });
      return;
    }

    // const query = registrationRepository
    //   .createQueryBuilder('registration')
    //   .leftJoin('registration.user', 'user')
    //   .leftJoin('registration.event', 'event')
    //   .leftJoin('registration.workshop', 'workshop')
    //   .where('user.id = :userId', { userId: Number(userId) });

    // if (eventId) {
    //   query.andWhere('event.id = :eventId', { eventId: Number(eventId) });
    // } else if (workshopId) {
    //   query.andWhere('workshop.id = :workshopId', { workshopId: Number(workshopId) });
    // }

    console.log('🧪 Params', { userId, eventId, workshopId });

    const existing = await registrationRepository.findOne({
      where: {
         user: { id: Number(userId) },
         event: eventId ? { id: Number(eventId) } : undefined,
         workshop: workshopId ? { id: Number(workshopId) } : undefined,
      },
    });

    res.json({ isRegistered: !!existing });
  } catch (error) {
    console.error("❌ Vérification inscription échouée:", error);
  
    const e = error as Error;
  
    res.status(500).json({
      message: "Erreur lors de la récupération de l’inscription :",
      detail: e.stack || e.message || 'Pas de stack disponible',
    });
  }
});

/**
 * @swagger
 * /registrations/{id}:
 *   get:
 *     summary: Récupérer une inscription par ID
 *     tags: [Registrations]
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const registration = await registrationRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ['user', 'event', 'workshop'],
    });
    if (!registration) {
      res.status(404).json({ message: 'Inscription non trouvée' });
      return;
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l’inscription...' });
  }
});

/**
 * @swagger
 * /registrations:
 *   post:
 *     summary: Créer une nouvelle inscription
 *     tags: [Registrations]
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, event_id, workshop_id, registered_at } = req.body;

    if (!user_id || (!event_id && !workshop_id) || !registered_at) {
      res.status(400).json({ message: 'Données invalides, tous les champs sont requis' });
      return;
    }

    const user = await AppDataSource.getRepository(User).findOne({ where: { id: user_id } });
    if (!user) {
      res.status(400).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    const event = event_id
      ? await AppDataSource.getRepository(Event).findOne({ where: { id: event_id } })
      : undefined;

    const workshop = workshop_id
      ? await AppDataSource.getRepository(Workshop).findOne({ where: { id: workshop_id } })
      : undefined;

    if (!event && !workshop) {
      res.status(400).json({ message: 'Ni event_id ni workshop_id fourni' });
      return;
    }

    const newRegistration = registrationRepository.create({
      user: user as User,
      event: event as Event | undefined,
      workshop: workshop as Workshop | undefined,
      registered_at: new Date(registered_at),
    });

    const result = await registrationRepository.save(newRegistration);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de l’inscription', error });
  }
});

/**
 * @swagger
 * /registrations/{id}:
 *   put:
 *     summary: Mettre à jour une inscription par ID
 *     tags: [Registrations]
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const registration = await registrationRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ['user', 'event', 'workshop'],
    });

    if (!registration) {
      res.status(404).json({ message: 'Inscription non trouvée' });
      return;
    }

    const { user_id, event_id, workshop_id, registered_at } = req.body;

    if (user_id) {
      const user = await AppDataSource.getRepository(User).findOne({ where: { id: user_id } });
      if (!user) {
        res.status(400).json({ message: 'Utilisateur non trouvé' });
        return;
      }
      registration.user = user;
    }

    if (event_id) {
      const event = await AppDataSource.getRepository(Event).findOne({ where: { id: event_id } });
      if (!event) {
        res.status(400).json({ message: 'Événement non trouvé' });
        return;
      }
      registration.event = event;
      registration.workshop = undefined;
    } else if (workshop_id) {
      const workshop = await AppDataSource.getRepository(Workshop).findOne({ where: { id: workshop_id } });
      if (!workshop) {
        res.status(400).json({ message: 'Atelier non trouvé' });
        return;
      }
      registration.workshop = workshop;
      registration.event = undefined;
    }

    if (registered_at) {
      registration.registered_at = new Date(registered_at);
    }

    const updatedRegistration = await registrationRepository.save(registration);
    res.json(updatedRegistration);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l’inscription', error });
  }
});

/**
 * @swagger
 * /registrations:
 *   delete:
 *     summary: Supprimer une inscription via userId + eventId ou workshopId
 *     tags: [Registrations]
 */
router.delete('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, eventId, workshopId } = req.query;

    if (!userId || (!eventId && !workshopId)) {
      res.status(400).json({ message: 'Paramètres manquants' });
      return;
    }

    const registration = await registrationRepository.findOne({
      where: {
        user: { id: Number(userId) },
        ...(eventId ? { event: { id: Number(eventId) } } : {}),
        ...(workshopId ? { workshop: { id: Number(workshopId) } } : {}),
      },
      relations: ['user', 'event', 'workshop'],
    });

    if (!registration) {
      res.status(404).json({ message: 'Inscription non trouvée' });
      return;
    }

    await registrationRepository.delete(registration.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la désinscription', error });
  }
});

export default router;
