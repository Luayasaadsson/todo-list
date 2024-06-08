import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/users";
import todoRoutes from "./routes/todos";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/users", userRoutes);
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
