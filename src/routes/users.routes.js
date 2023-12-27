import { Router } from "express";
import { createUser, getUsers, loginUser } from "../controllers/users.controller.js";

const router = Router();
router.get("/users",getUsers)
router.get("/users/:id")
router.post("/user", createUser)
router.post('/login', loginUser);

export default router;