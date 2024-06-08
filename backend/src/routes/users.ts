import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
const prisma = new PrismaClient();

// POST /users/register
router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return res.status(201).json({ message: `User with id ${user.id} created` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /users/login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).send("User does not exist. Please register");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Invalid credentials");
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "Internal server error" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: `Token created: ${token}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Middleware för att verifiera att användaren är betrodd
const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied");
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "internal server error" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid token");
  }
};

// PUT /users/update
router.put("/update", auth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, email, password: hashedPassword },
    });
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /users/:id - Hämtar en specifik användares information
router.get("/:id", auth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, email: true, password: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// DELETE /users/delete
router.delete("/delete", auth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    res.status(200).send("User account deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Protected route
router.get("/protected", auth, (req: AuthenticatedRequest, res: Response) => {
  res.send("The user it authenticated and can access this route");
});

export default router;
