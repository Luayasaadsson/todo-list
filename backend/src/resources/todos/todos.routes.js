import express from "express";
import {
  createTodoByUser,
  getTodosByUser,
  getTodoByUser,
  updateTodoById,
  deleteTodoById,
} from "./todos.controllers.js";

const router = express.Router();

// CRUD for todos
router.post("/users/:userId/todos", createTodoByUser);
router.get("/users/:userId/todos", getTodosByUser);
router.get("/users/:userId/todos/:todoId", getTodoByUser);
router.put("/todos/:id", updateTodoById);
router.delete("/todos/:id", deleteTodoById);

export default router;
