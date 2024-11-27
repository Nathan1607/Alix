import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("API is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
