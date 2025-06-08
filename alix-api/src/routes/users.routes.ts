import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../class/User';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API pour gérer les utilisateurs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userRepository.find({ relations: ['commune'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ['commune'],
    });
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l’utilisateur' });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       description: Données de l'utilisateur à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = userRepository.create(req.body);
    const result = await userRepository.save(newUser);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de l’utilisateur', error });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour
 *     requestBody:
 *       description: Données mises à jour de l'utilisateur
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userRepository.findOneBy({ id: Number(req.params.id) });
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }
    userRepository.merge(user, req.body);
    const result = await userRepository.save(user);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l’utilisateur', error });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       204:
 *         description: Utilisateur supprimé avec succès (pas de contenu)
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await userRepository.delete(Number(req.params.id));
    if (result.affected === 0) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de l’utilisateur', error });
  }
});

export default router;
