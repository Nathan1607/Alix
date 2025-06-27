import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { AppDataSource } from "./src/config/data-source"; 
import userRoutes from "./src/routes/users.routes";
import { setupSwagger } from "./src/config/swagger";
import authRouter from "./src/routes/auth.routes";
import communesRoutes from "./src/routes/communes.routes";
import articlesRoutes from "./src/routes/articles.routes";
import eventsRoutes from "./src/routes/events.routes";
import registrationsRoutes from "./src/routes/registrations.routes";
import workshopsRoutes from "./src/routes/workshops.routes";

export const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.use("/users", userRoutes);
app.use("/auth", authRouter);
app.use("/communes", communesRoutes);
app.use("/articles", articlesRoutes);
app.use("/events", eventsRoutes);
app.use("/registrations", registrationsRoutes);
app.use("/workshops", workshopsRoutes);

setupSwagger(app);

const PORT = 3010;

export const startServer = async () => {
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

if (require.main === module) {
   startServer();
 }
