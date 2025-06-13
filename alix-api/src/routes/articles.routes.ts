import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Article } from '../class/Article';

const router = Router();
const articleRepository = AppDataSource.getRepository(Article);

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API pour gérer les articles
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Récupérer tous les articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Liste des articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const articles = await articleRepository.find({ relations: ['commune'] });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des articles' });
    }
});

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Récupérer un article par ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'article
 *     responses:
 *       200:
 *         description: Détails de l'article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article non trouvé
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const article = await articleRepository.findOne({
            where: { id: Number(req.params.id) },
            relations: ['commune'],
        });
        if (!article) {
            res.status(404).json({ message: 'Article non trouvé' });
            return;
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l’article' });
    }
});

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Créer un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       description: Données de l'article à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: Article créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Données invalides
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const newArticle = articleRepository.create(req.body);
        const result = await articleRepository.save(newArticle);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l’article', error });
    }
});

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Mettre à jour un article par ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'article à mettre à jour
 *     requestBody:
 *       description: Données mises à jour de l'article
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       200:
 *         description: Article mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Article non trouvé
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const article = await articleRepository.findOneBy({ id: Number(req.params.id) });
        if (!article) {
            res.status(404).json({ message: 'Article non trouvé' });
            return;
        }
        articleRepository.merge(article, req.body);
        const result = await articleRepository.save(article);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l’article', error });
    }
});

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Supprimer un article par ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'article à supprimer
 *     responses:
 *       204:
 *         description: Article supprimé avec succès (pas de contenu)
 *       404:
 *         description: Article non trouvé
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await articleRepository.delete(Number(req.params.id));
        if (result.affected === 0) {
            res.status(404).json({ message: 'Article non trouvé' });
            return;
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la suppression de l’article', error });
    }
});

export default router;
