import jwt from 'jsonwebtoken';

const secretKey = 'tonSecretKey'; //A changer en production

export const generateToken = (userId: number) => {
    return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};
