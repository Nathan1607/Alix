import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Commune } from "../class/Commune";

const router = Router();
const communeRepository = AppDataSource.getRepository(Commune);

// GET all communes
/**
 * @swagger
 * /communes:
 *   get:
 *     summary: Récupérer toutes les communes
 *     tags:
 *       - Communes
 *     responses:
 *       200:
 *         description: Liste des communes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commune'
 */
router.get('/', async (req, res) => {
  try {
    const communes = await communeRepository.find();
    res.json(communes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des communes' });
  }
});


// GET commune by id
/**
 * @swagger
 * /communes/{id}:
 *   get:
 *     summary: Récupérer une commune par son id
 *     tags:
 *       - Communes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commune
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commune trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commune'
 *       404:
 *         description: Commune non trouvée
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const commune = await communeRepository.findOne({
        where: { id: req.params.id },
      });
      if (!commune) {
        res.status(404).json({ message: 'Commune non trouvée' });
        return;
      }
      res.json(commune);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de la commune' });
    }
  });

// POST create new commune
/**
 * @swagger
 * /communes:
 *   post:
 *     summary: Créer une nouvelle commune
 *     tags:
 *       - Communes
 *     requestBody:
 *       description: Commune à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commune'
 *     responses:
 *       201:
 *         description: Commune créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commune'
 *       400:
 *         description: Données invalides
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const newCommune = communeRepository.create(req.body);
    const savedCommune = await communeRepository.save(newCommune);
    res.status(201).json(savedCommune);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la commune", error });
  }
});

// PUT update commune by id
/**
 * @swagger
 * /communes/{id}:
 *   put:
 *     summary: Mettre à jour une commune existante
 *     tags:
 *       - Communes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commune à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Données mises à jour de la commune
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commune'
 *     responses:
 *       200:
 *         description: Commune mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commune'
 *       404:
 *         description: Commune non trouvée
 *       400:
 *         description: Données invalides
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const commune = await communeRepository.findOneBy({ id: req.params.id });
      if (!commune) {
        res.status(404).json({ message: 'Commune non trouvée' });
        return;
      }
      communeRepository.merge(commune, req.body);
      const result = await communeRepository.save(commune);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la mise à jour de la commune', error });
    }
  });

// DELETE commune by id
/**
 * @swagger
 * /communes/{id}:
 *   delete:
 *     summary: Supprimer une commune par son ID
 *     tags:
 *       - Communes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commune à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Commune supprimée avec succès
 *       404:
 *         description: Commune non trouvée
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await communeRepository.delete(Number(req.params.id));
      if (result.affected === 0) {
        res.status(404).json({ message: 'Commune non trouvée' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la suppression de la commune', error });
    }
  });

export default router;
