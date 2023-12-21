import  { pool }  from "../db.js"

export const getEvents = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT e.id, e.title, e.description, e.dateEvent, e.hourEvent, c.name AS category, e.organizer, e.img   FROM events e" +
        " INNER JOIN category c ON c.id = e.idCategory;")
        return res.json(rows)
    } catch (error) {
        return res.status(500).send({message: "Algo fue mal"});
    }
}

export const getEvent = async (req, res) => {

    try {
        const id = req.params.id
        const [rows] = await pool.query("SELECT e.id, e.title, e.description, e.dateEvent, e.hourEvent, c.name AS category, e.organizer, e.img   FROM events e" +
        " INNER JOIN category c ON c.id = e.idCategory WHERE e.id = ?",[id])
        if(rows.length <= 0) return res.status(404).json({
            message: "Evento no encontrado."
        })
        return res.send(rows[0])
    } catch (error) {
        return res.status(500).send({message: "Algo fue mal"});
    }
}