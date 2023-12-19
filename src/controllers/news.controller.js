
import  { pool }  from "../db.js"

export const getNews = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT n.id, n.title, n.dateNew, n.description, c.name as category,n.img FROM news n"+
        " INNER JOIN category c ON c.id = n.idCategory;")
        return res.json(rows)
    } catch (error) {
        return res.status(500).send({message: "Algo fue mal"});
    }
}