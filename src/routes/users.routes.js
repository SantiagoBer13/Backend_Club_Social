import { Router } from "express";
import { createUser, getUsers } from "../controllers/users.controller.js";

const router = Router();
router.get("/users",getUsers)
router.get("/users/:id")
router.post("/user", createUser)

export default router;