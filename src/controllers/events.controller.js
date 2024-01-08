import  { pool }  from "../db.js"
import { JWT_SECRET_USER } from "../../config.js"
import jwt from "jsonwebtoken"

export const getEvents = async (req, res) => {
    try {
        if(req.headers['authorization']){
            const token = req.headers['authorization']
            jwt.verify(token, JWT_SECRET_USER, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Token no válido" });
                }
                const { user_id } = decoded;
                const [result] = await pool.query(`
                SELECT
                e.id,
                e.title,
                e.description,
                e.dateEvent,
                e.hourEvent,
                c.name AS category,
                e.organizer,
                e.img,
                CASE
                  WHEN EXISTS (
                    SELECT 1
                    FROM inscriptions i
                    WHERE i.idEvent = e.id AND i.idUser = ?
                  ) THEN 'inscrito'
                  ELSE 'no inscrito'
                END AS inscription
              FROM
                events_club e
              LEFT JOIN
                category c ON c.id = e.idCategory;`,
                    [user_id]);

                return res.json(result)
            })
        }else{
            const [rows] = await pool.query("SELECT e.id, e.title, e.description, e.dateEvent, e.hourEvent, c.name AS category, e.organizer, e.img   FROM events_club e" +
        " INNER JOIN category c ON c.id = e.idCategory;");
        return res.json(rows)
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Algo fue mal", error: error.message });
    }
}

export const getEvent = async (req, res) => {
    try {
        const id = req.params.id
        if(req.headers['authorization']){
            const token = req.headers['authorization']
            jwt.verify(token, JWT_SECRET_USER, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Token no válido" });
                }
                const { user_id } = decoded;
                const [result] = await pool.query(`
                SELECT
                e.id,
                e.title,
                e.description,
                e.dateEvent,
                e.hourEvent,
                c.name AS category,
                e.organizer,
                e.img,
                CASE
                  WHEN EXISTS (
                    SELECT 1
                    FROM inscriptions i
                    WHERE i.idEvent = e.id AND i.idUser = ?
                  ) THEN 'inscrito'
                  ELSE 'no inscrito'
                END AS inscription
              FROM
                events_club e
              LEFT JOIN
                category c ON c.id = e.idCategory
              WHERE e.id = ?  ;`,
                    [user_id, id]);
                return res.json(result[0])
            })
        }else{
            const [rows] = await pool.query("SELECT e.id, e.title, e.description, e.dateEvent, e.hourEvent, c.name AS category, e.organizer, e.img   FROM events_club e" +
            " INNER JOIN category c ON c.id = e.idCategory WHERE e.id = ?",[id])
            if(rows.length <= 0) return res.status(404).json({
                message: "Evento no encontrado."
            })
        return res.send(rows[0])
        }
    } catch (error) {
        return res.status(500).send({message: "Algo fue mal"});
    }
}

export const getEventsByUser = async (req, res) =>{
    try{
        const token = req.headers['authorization']

        jwt.verify(token, JWT_SECRET_USER, async (err, decoded) => {
            if (err) {
                return res.status(401).json({message: "Token no válido"})
            }
            const { user_id } = decoded;
            const [rows] = await pool.query("SELECT e.id, e.title, e.description, e.dateEvent, e.hourEvent, c.name AS category, e.organizer, e.img   FROM events_club e"+
            " INNER JOIN category c ON c.id = e.idCategory" +
            " INNER JOIN inscriptions i ON e.id = i.idEvent" +
            " INNER JOIN users u ON u.id = i.idUser" +
            " WHERE u.id = ?;",[user_id])
            if(rows.length <= 0) return res.status(404).json({
                message: "Evento no encontrado."
            })
            return res.send(rows)
        })
    } catch (error){
        return res.status(500).send({message: "Algo fue mal"});
    }
}

export const inscription = async (req, res) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }
        jwt.verify(token, JWT_SECRET_USER, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token no válido" });
            }
            const { user_id } = decoded;
            const { event_id, date_inscription } = req.body
            const [rows] = await pool.query("INSERT INTO inscriptions (idEvent, idUser, dateInscription) VALUES(?,?,?)",[event_id, user_id, date_inscription])

            return res.json({ message: "Inscripción exitosa"});
        });
    } catch (error) {
        return res.status(500).send({ message: "Algo fue mal", messageError:  error});
    }
}

export const deleteInscription = async (req, res) => {
    try {
      const token = req.headers['authorization'];
      if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }
  
      jwt.verify(token, JWT_SECRET_USER, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Token no válido" });
        }
  
        const { user_id } = decoded;
        const { event_id } = req.body; // Lee el event_id desde el cuerpo de la solicitud
  
        const [rows] = await pool.query(`
          DELETE FROM inscriptions
          WHERE idUser = ? AND idEvent = ?
        `, [user_id, event_id]);
  
        return res.json({ message: "Inscripción eliminada exitosamente" });
      });
    } catch (error) {
      return res.status(500).send({ message: "Algo fue mal", messageError:  error});
    }
  }