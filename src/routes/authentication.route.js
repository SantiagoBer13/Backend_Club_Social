import { Router } from "express";
import { verifyToken } from "../controllers/authentication.controller.js";
import { checkToken } from "../middlewares/middlewares.js";

const router = Router();
router.post("/verify-token", checkToken, verifyToken)

export default router;