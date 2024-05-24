import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./src/resources/users/users.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});