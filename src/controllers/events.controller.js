import  { pool }  from "../db.js"
import { JWT_SECRET_ADMIN, JWT_SECRET_USER } from "../../config.js"
import jwt from "jsonwebtoken"


function validateToken(token){
  try {
    const decoded = jwt.verify(token, JWT_SECRET_USER)
    return [true, decoded.user_id]
  } catch (errUser) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET_ADMIN)
      return [true, decoded.user_id]
    } catch (errAdmin) {
      return [false, 0]
    }
  }
}

export const  getEvents = async (req, res) => {
    try {
      const token = req.headers['authorization']
      const [valid, user_id] = validateToken(token)

        if(req.headers['authorization'] ){
          if(valid && user_id !== 0){
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
          }else{
            return res.status(401).json({ message: "Token no válido" });
          }
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
        const token = req.headers['authorization']
        const [valid, user_id] = validateToken(token)
        if(req.headers['authorization']){
          if(valid && user_id !== 0){
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
          }else{
            return res.status(401).json({ message: "Token no válido" });
          }
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
      const [valid, user_id] = validateToken(token)
      if(valid && user_id !== 0){
            const [rows] = await pool.query("SELECT e.id, e.title, e.description, e.dateEvent, e.hourEvent, c.name AS category, e.organizer, e.img   FROM events_club e"+
            " INNER JOIN category c ON c.id = e.idCategory" +
            " INNER JOIN inscriptions i ON e.id = i.idEvent" +
            " INNER JOIN users u ON u.id = i.idUser" +
            " WHERE u.id = ?;",[user_id])
            if(rows.length <= 0) return res.status(404).json({
                message: "Evento no encontrado."
            })
            return res.send(rows)
      }else{
        return res.status(401).json({ message: "Token no válido" });
      }
    } catch (error){
        return res.status(500).send({message: "Algo fue mal"});
    }
}

export const inscription = async (req, res) => {
    try {
      const token = req.headers['authorization']
      const [valid, user_id] = validateToken(token)
      if(valid && user_id !== 0){
            const { event_id, date_inscription } = req.body
            const [rows] = await pool.query("INSERT INTO inscriptions (idEvent, idUser, dateInscription) VALUES(?,?,?)",[event_id, user_id, date_inscription])

            return res.json({ message: "Inscripción exitosa"});
      }else{
        return res.status(401).json({ message: "Token no válido" });
      }
    } catch (error) {
        return res.status(500).send({ message: "Algo fue mal", messageError:  error});
    }
}

export const deleteInscription = async (req, res) => {
    try {
      const token = req.headers['authorization']
      const [valid, user_id] = validateToken(token)
      if(valid && user_id !== 0){
        const { event_id } = req.body; // Lee el event_id desde el cuerpo de la solicitud
  
        const [rows] = await pool.query(`
          DELETE FROM inscriptions
          WHERE idUser = ? AND idEvent = ?
        `, [user_id, event_id]);
  
        return res.json({ message: "Inscripción eliminada exitosamente" });
      }else{
        return res.status(401).json({ message: "Token no válido" });
      }
    } catch (error) {
      return res.status(500).send({ message: "Algo fue mal", messageError:  error});
    }
  }

export const createEvent = async (req, res) => {
  try{
    const token = req.headers['authorization'];

    jwt.verify(token, JWT_SECRET_ADMIN, async (err, decode) => {
      console.log(req.body)
      const { title, date_event, date_created, organizer, description, hour_event, id_category, img } = req.body;
      const [rows] = await pool.query(`
      INSERT INTO events_club (title, dateCreated, dateEvent, organizer, description, hourEvent, idCategory, img) VALUES(?,?,?,?,?,?,?,?)
      `,[title, date_created, date_event, organizer, description, hour_event, id_category, img ])

      if(rows.affectedRows > 0){
        const [event] = await pool.query("SELECT title, dateCreated, dateEvent, organizer, description, hourEvent, idCategory, img FROM events_club WHERE id = ?", [rows.insertId]);        
        return res.status(201).json({
          message: "Evento Creado",
          event: event[0]
        })
        
      }
    })
  } catch (error) {
    return res.status(500).send({ message: "Algo fue mal", messageError:  error});
  } 
}

export const updateEvent = async (req, res) => {
  try{
    const token = req.headers['authorization'];

    jwt.verify(token, JWT_SECRET_ADMIN, async (err, decode) => {
      const { title, date_event, date_created, organizer, description, hour_event, id_category, img, event_id } = req.body;
      const [result] = await pool.query(`
      UPDATE events_club 
        SET title = IFNULL(?, title), 
            dateCreated = IFNULL(?, dateCreated), 
            dateEvent = IFNULL(?, dateEvent), 
            organizer = IFNULL(?, organizer), 
            description = IFNULL(?, description), 
            hourEvent = IFNULL(?, hourEvent), 
            idCategory = IFNULL(?, idCategory), 
            img = IFNULL(?, img)
        WHERE id = ?
      `,[title, date_created, date_event, organizer, description, hour_event, id_category, img, event_id ])

      if (result.affectedRows <= 0) {
        return res.status(404).json({ message: "Evento no encontrado" });
      }

      const [event] = await pool.query("SELECT title, dateCreated, dateEvent, organizer, description, hourEvent, idCategory, img FROM events_club WHERE id = ?", [event_id]);  
      return res.json(event[0]);

    })
  } catch (error) {
    return res.status(500).send({ message: "Algo fue mal", messageError:  error});
  } 
}