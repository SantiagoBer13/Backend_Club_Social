import { Router } from "express";
import { verifyToken, verifyTokenAdmi } from "../controllers/authentication.controller.js";
import { checkToken, checkTokenAdmi } from "../middlewares/middlewares.js";

const router = Router();
router.post("/verify-token", checkToken , verifyToken)
router.get("/verify-token-admi", checkToken, verifyTokenAdmi)

export default router;