import { Router } from "express";
import { getEvents, getEvent } from "../controllers/events.controller.js";

const router = Router()
router.get("/events", getEvents)
router.get("/events/:id", getEvent)

export default router