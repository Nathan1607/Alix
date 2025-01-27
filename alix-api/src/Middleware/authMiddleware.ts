import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: any;
}

const secretKey = 'tonSecretKey'; // Change cette clé pour une clé sécurisée en production

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Récupérer le token après "Bearer "

    if (!token) {
        res.status(403).json({ message: 'Token manquant' });
        return; // Terminer ici pour éviter d'appeler next()
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            res.status(403).json({ message: 'Token invalide' });
            return; // Terminer ici pour éviter d'appeler next()
        }

        req.user = user; // Attache l'utilisateur décodé à la requête
        next(); // Continue vers le prochain middleware
    });
};
