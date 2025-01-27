import { Router, Request, Response } from "express";
import { AppDataSource } from "../class/data-source";
import { User } from "../class/User";
import { authenticateJWT } from "../Middleware/authMiddleware";

const userRouter = Router();
const userRepository = AppDataSource.getRepository(User);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
userRouter.get("/", authenticateJWT, async (req, res) => {
  try {
    const users = await userRepository.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs.", error });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       500:
 *         description: Erreur lors de la création
 */
userRouter.post("/", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = userRepository.create(req.body);
    const savedUser = await userRepository.save(user);
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur.", error });
  }
});

export default userRouter;
