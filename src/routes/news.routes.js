import {Router} from "express"
import { getNews, getNew } from "../controllers/news.controller.js"
import { checkTokenAdmi } from "../middlewares/middlewares.js"
import { createNew, updateNew, deleteNew } from "../controllers/news.controller.js"

const router = Router()
router.get("/news", getNews)
router.get("/news/:id", getNew)
router.post("/create-new", checkTokenAdmi, createNew)
router.patch("/update-new", checkTokenAdmi, updateNew)
router.delete("/new",checkTokenAdmi, deleteNew)

export default router