// src/routes/test.routes.ts
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Test route OK' });
});

export default router;
