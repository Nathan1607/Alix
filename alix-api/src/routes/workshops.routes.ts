import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Workshop } from '../class/Workshop';

const router = Router();
const workshopRepository = AppDataSource.getRepository(Workshop);

/**
 * @swagger
 * tags:
 *   name: Workshops
 *   description: API pour gérer les ateliers
 */

/**
 * @swagger
 * /workshops:
 *   get:
 *     summary: Récupérer tous les ateliers
 *     tags: [Workshops]
 *     responses:
 *       200:
 *         description: Liste des ateliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workshop'
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {

        const { communeId } = _req.query;

        const whereClause = communeId
            ? { commune: { id: String(communeId) } }
            : {};

        const workshops = await workshopRepository.find({ where: whereClause, relations: ['commune'] });
        res.json(workshops);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des ateliers' });
    }
});

/**
 * @swagger
 * /workshops/{id}:
 *   get:
 *     summary: Récupérer un atelier par ID
 *     tags: [Workshops]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'atelier
 *     responses:
 *       200:
 *         description: Détails de l'atelier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workshop'
 *       404:
 *         description: Atelier non trouvé
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const workshop = await workshopRepository.findOne({
            where: { id: Number(req.params.id) },
            relations: ['commune'],
        });
        if (!workshop) {
            res.status(404).json({ message: 'Atelier non trouvé' });
            return;
        }
        res.json(workshop);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l’atelier' });
    }
});

/**
 * @swagger
 * /workshops:
 *   post:
 *     summary: Créer un nouvel atelier
 *     tags: [Workshops]
 *     requestBody:
 *       description: Données de l'atelier à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workshop'
 *     responses:
 *       201:
 *         description: Atelier créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workshop'
 *       400:
 *         description: Données invalides
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const newWorkshop = workshopRepository.create(req.body);
        const result = await workshopRepository.save(newWorkshop);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l’atelier', error });
    }
});

/**
 * @swagger
 * /workshops/{id}:
 *   put:
 *     summary: Mettre à jour un atelier par ID
 *     tags: [Workshops]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'atelier à mettre à jour
 *     requestBody:
 *       description: Données mises à jour de l'atelier
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workshop'
 *     responses:
 *       200:
 *         description: Atelier mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workshop'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Atelier non trouvé
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const workshop = await workshopRepository.findOneBy({ id: Number(req.params.id) });
        if (!workshop) {
            res.status(404).json({ message: 'Atelier non trouvé' });
            return;
        }
        workshopRepository.merge(workshop, req.body);
        const result = await workshopRepository.save(workshop);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l’atelier', error });
    }
});

/**
 * @swagger
 * /workshops/{id}:
 *   delete:
 *     summary: Supprimer un atelier par ID
 *     tags: [Workshops]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'atelier à supprimer
 *     responses:
 *       204:
 *         description: Atelier supprimé avec succès (pas de contenu)
 *       404:
 *         description: Atelier non trouvé
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await workshopRepository.delete(Number(req.params.id));
        if (result.affected === 0) {
            res.status(404).json({ message: 'Atelier non trouvé' });
            return;
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la suppression de l’atelier', error });
    }
});

export default router;
