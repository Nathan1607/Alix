import { Router, Request, Response } from 'express';
import { generateToken } from '../auth/auth';

const authRouter = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentification et génération d'un token
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
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: Token généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Identifiants invalides' });
    }
});

export default authRouter;
