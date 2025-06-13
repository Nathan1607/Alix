import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Registration } from '../class/Registration';
import { User } from '../class/User'; // Ajouté si tu as besoin de lier l'utilisateur

const router = Router();
const registrationRepository = AppDataSource.getRepository(Registration);

/**
 * @swagger
 * tags:
 *   name: Registrations
 *   description: API pour gérer les inscriptions
 */

/**
 * @swagger
 * /registrations:
 *   get:
 *     summary: Récupérer toutes les inscriptions
 *     tags: [Registrations]
 *     responses:
 *       200:
 *         description: Liste des inscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Registration'
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const registrations = await registrationRepository.find({
            relations: ['user', 'event', 'workshop'],});
        res.json(registrations);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des inscriptions',
        });
    }
});

/**
 * @swagger
 * /registrations/{id}:
 *   get:
 *     summary: Récupérer une inscription par ID
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'inscription
 *     responses:
 *       200:
 *         description: Détails de l'inscription
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       404:
 *         description: Inscription non trouvée
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
        res.status(500).json({ message: 'Erreur lors de la récupération de l’inscription' });
    }
});

/**
 * @swagger
 * /registrations:
 *   post:
 *     summary: Créer une nouvelle inscription
 *     tags: [Registrations]
 *     requestBody:
 *       description: Données de l'inscription à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     responses:
 *       201:
 *         description: Inscription créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Données invalides
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id, content_type, content_id, registered_at } = req.body;
        
        // Validation des données (facultatif, mais recommandé)
        if (!user_id || !content_type || !content_id || !registered_at) {
            res.status(400).json({ message: 'Données invalides, tous les champs sont requis' });
            return;
        }

        // Création de l'inscription
        const user = await AppDataSource.getRepository(User).findOne({ where: { id: user_id } });
        if (!user) {
            res.status(400).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        const newRegistration = registrationRepository.create({
            user,
            content_type,
            content_id,
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'inscription à mettre à jour
 *     requestBody:
 *       description: Données mises à jour de l'inscription
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     responses:
 *       200:
 *         description: Inscription mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Inscription non trouvée
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

        const { user_id, content_type, content_id, registered_at } = req.body;

        if (user_id) {
            const user = await AppDataSource.getRepository(User).findOne({ where: { id: user_id } });
            if (!user) {
                res.status(400).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            registration.user = user;
        }

        if (content_type) registration.content_type = content_type;
        if (content_id) registration.content_id = content_id;
        if (registered_at) registration.registered_at = new Date(registered_at);

        const updatedRegistration = await registrationRepository.save(registration);
        res.json(updatedRegistration);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l’inscription', error });
    }
});

/**
 * @swagger
 * /registrations/{id}:
 *   delete:
 *     summary: Supprimer une inscription par ID
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'inscription à supprimer
 *     responses:
 *       204:
 *         description: Inscription supprimée avec succès (pas de contenu)
 *       404:
 *         description: Inscription non trouvée
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await registrationRepository.delete(Number(req.params.id));
        if (result.affected === 0) {
            res.status(404).json({ message: 'Inscription non trouvée' });
            return;
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la suppression de l’inscription', error });
    }
});

export default router;
