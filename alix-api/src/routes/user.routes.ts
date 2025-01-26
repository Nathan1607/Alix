import { Router, Request, Response } from "express";
import { AppDataSource } from "../class/data-source";
import { User } from "../class/User";

const userRouter = Router();

// Repository User
const userRepository = AppDataSource.getRepository(User);

// GET : Récupérer tous les utilisateurs
userRouter.get("/", async (req, res) => {
    try {
        const users = await userRepository.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs.", error });
    }
});

// POST : Créer un nouvel utilisateur
userRouter.post("/e", async (req: Request, res: Response) => {
    try {
        const user = userRepository.create(req.body);
        const savedUser = await userRepository.save(user);
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur.", error });
    }
});

export default userRouter;
