import { Router } from "express";
import { getEvents, getEvent, getEventsByUser, inscription , deleteInscription, createEvent, updateEvent} from "../controllers/events.controller.js";
import { checkToken, checkTokenAdmi } from "../middlewares/middlewares.js";

const router = Router()
router.get("/events", getEvents)
router.get("/events/:id", getEvent)
router.get("/events-by-user", checkToken , getEventsByUser)
router.post("/inscription", checkToken, inscription)
router.delete("/inscription", checkToken, deleteInscription)

/**Desarrolando */
router.post("/create-event", checkTokenAdmi, createEvent)
router.patch("/update-event", checkTokenAdmi, updateEvent)

export default router