import express from "express";
import { getUsers, getUser, createUsers, updateUser, deleteUser } from "./users.controllers.js";

const router = express.Router();

router.post("/users", createUsers);
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser)
router.delete("/users/:id", deleteUser);

export default router;