import {Router} from "express"
import { getNews, getNew } from "../controllers/news.controller.js"

const router = Router()
router.get("/news", getNews)
router.get("/news/:id", getNew)

export default router