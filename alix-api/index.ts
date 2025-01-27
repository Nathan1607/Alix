import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { AppDataSource } from "./src/class/data-source"; 
import userRouter from "./src/routes/user.routes";
import { setupSwagger } from "./src/config/swagger";
import authRouter from "./src/routes/auth.routes";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.use("/users", userRouter);
app.use("/auth", authRouter);

setupSwagger(app);

const startServer = async () => {
    try {
      await AppDataSource.initialize();
      console.log("Connected to the database successfully!");
  
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  };
  
  startServer();



