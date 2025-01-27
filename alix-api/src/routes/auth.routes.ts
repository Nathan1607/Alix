import { Router, Request, Response } from 'express';
import { generateToken } from '../auth/auth';

const authRouter = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecte un utilisateur et génère un token JWT
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *                 example: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczNzk3MzQyNywiZXhwIjoxNzM3OTc3MDI3fQ._4yM_YDVTVza7k3n3v3xH-tdM0B2XOYekdi0MolY8ek
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Identifiants invalides
 */
authRouter.post('/login', (req: Request, res: Response): void => {
    const { username, password } = req.body;

    // Vérifie les identifiants
    if (username === 'admin' && password === 'password') {
        const token = generateToken(1);
        res.setHeader('Content-Type', 'text/plain');
        res.send(token);
    } else {
        res.status(401).json({ message: 'Identifiants invalides' });
    }
});

export default authRouter;
