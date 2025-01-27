import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: any;
}

const secretKey = 'tonSecretKey';

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(403).json({ message: 'Token manquant' });
        return;
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            res.status(403).json({ message: 'Token invalide' });
            return;
        }

        req.user = user;
        next();
    });
};
