import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const auth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied");
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "internal server error" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid token");
  }
};
