import { Router } from "express";
import { getEvents, getEvent, getEventsByUser, inscription , deleteInscription} from "../controllers/events.controller.js";
import { checkToken } from "../middlewares/middlewares.js";

const router = Router()
router.get("/events", getEvents)
router.get("/events/:id", getEvent)
router.get("/events-by-user", checkToken, getEventsByUser)
router.post("/inscription", checkToken, inscription)
router.delete("/inscription", checkToken, deleteInscription)



export default router