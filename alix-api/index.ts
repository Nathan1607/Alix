import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { AppDataSource } from "./src/class/data-source"; 

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("API is running !");
});

const startServer = async () => {
    try {
      // Connexion à la base de données
      await AppDataSource.initialize();
      console.log("Connected to the database successfully!");
  
      // Démarrage du serveur Express
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  };
  
  startServer();



