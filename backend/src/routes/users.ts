import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// POST /users
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: { username, email, password },
    });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: `An error occurred: ${error.message}` });
  }
});

export default router;
