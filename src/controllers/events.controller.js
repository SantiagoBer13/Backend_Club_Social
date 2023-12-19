import  { pool }  from "../db.js"

export const getEvents = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT e.title, e.dateEvent, c.name AS category, e.organizer, e.img, e.description  FROM events e"+
        " INNER JOIN category c ON c.id = e.idCategory;")
        return res.json(rows)
    } catch (error) {
        return res.status(500).send({message: "Algo fue mal"});
    }
}