import { Router } from "express";
import { createUser, getUsers, getUser, loginUser, updateUser, checkUser } from "../controllers/users.controller.js";
import { checkToken } from "../middlewares/middlewares.js";

const router = Router();
//router.get("/users", checkToken,getUsers)
router.get("/user", checkToken, getUser)
router.post("/user", createUser)
router.post('/login', loginUser)
router.patch("/user", updateUser)

//Developing
router.post("/resend", checkUser)

export default router;