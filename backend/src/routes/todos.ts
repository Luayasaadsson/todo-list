import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { auth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// POST /todos - Creating a new todo
router.post(
  "/",
  auth,
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, content, completed, published } = req.body;
    const userId = req.user?.id;

    try {
      const newTodo = await prisma.todo.create({
        data: {
          title,
          content,
          completed: completed || false,
          published: published || false,
          userId,
        },
      });
      res.status(201).json(newTodo);
    } catch (error) {
      console.error("Error creating a todo:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET /todos - Getting all todos
router.get("/", auth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: userId },
    });
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error retrieving todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /todos/:id - Getting a specific todo
router.get("/:id", auth, async (req: AuthenticatedRequest, res: Response) => {
  const todoId = parseInt(req.params.id);
  const userId = req.user?.id;
  try {
    const todo = await prisma.todo.findFirst({
      where: { id: todoId, userId: userId },
    });
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.error("Error finding todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /todos/:id - Updating a specific todo
router.put("/:id", auth, async (req: AuthenticatedRequest, res: Response) => {
  const todoId = parseInt(req.params.id);
  const { title, content, completed, published } = req.body;
  const userId = req.user?.id;
  try {
    const updatedTodo = await prisma.todo.update({
      where: { id: todoId, userId: userId },
      data: { title, content, completed, published },
    });
    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /todos/:id - Deleting a specific todo
router.delete(
  "/:id",
  auth,
  async (req: AuthenticatedRequest, res: Response) => {
    const todoId = parseInt(req.params.id);
    const userId = req.user?.id;
    try {
      await prisma.todo.delete({
        where: { id: todoId, userId: userId },
      });
      res.status(200).send("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE /todos - Deleting all todos for the authenticated user
router.delete("/", auth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const deleteResult = await prisma.todo.deleteMany({
      where: { userId: userId },
    });
    res
      .status(200)
      .json({ message: `Deleted ${deleteResult.count} todos successfully.` });
  } catch (error) {
    console.error("Error deleting todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
