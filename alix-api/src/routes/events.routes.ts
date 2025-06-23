import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Event } from '../class/Event';

const router = Router();
const eventRepository = AppDataSource.getRepository(Event);

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API pour gérer les événements
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Récupérer tous les événements
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Liste des événements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const { communeId } = req.query;
  
      // Si communeId est présent, on filtre
      const whereClause = communeId
        ? { commune: { id: String(communeId) } }
        : {};
  
      const events = await eventRepository.find({
        where: whereClause,
        relations: ['commune'],
      });
  
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
    }
});
  

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Récupérer un événement par ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'événement
 *     responses:
 *       200:
 *         description: Détails de l'événement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Événement non trouvé
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await eventRepository.findOne({
            where: { id: Number(req.params.id) },
            relations: ['commune'],
        });
        if (!event) {
            res.status(404).json({ message: 'Événement non trouvé' });
            return;
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l’événement' });
    }
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Créer un nouvel événement
 *     tags: [Events]
 *     requestBody:
 *       description: Données de l'événement à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Événement créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Données invalides
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const newEvent = eventRepository.create(req.body);
        const result = await eventRepository.save(newEvent);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l’événement', error });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Mettre à jour un événement par ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'événement à mettre à jour
 *     requestBody:
 *       description: Données mises à jour de l'événement
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Événement mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Événement non trouvé
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await eventRepository.findOneBy({ id: Number(req.params.id) });
        if (!event) {
            res.status(404).json({ message: 'Événement non trouvé' });
            return;
        }
        eventRepository.merge(event, req.body);
        const result = await eventRepository.save(event);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l’événement', error });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Supprimer un événement par ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'événement à supprimer
 *     responses:
 *       204:
 *         description: Événement supprimé avec succès (pas de contenu)
 *       404:
 *         description: Événement non trouvé
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await eventRepository.delete(Number(req.params.id));
        if (result.affected === 0) {
            res.status(404).json({ message: 'Événement non trouvé' });
            return;
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la suppression de l’événement', error });
    }
});

export default router;
