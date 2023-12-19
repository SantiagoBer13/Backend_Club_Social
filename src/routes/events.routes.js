import { Router } from "express";
import { getEvents } from "../controllers/events.controller.js";

const router = Router()
router.get("/events", getEvents)

export default router