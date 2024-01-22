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
      const { title, date_event, organizer, description, hour_event, id_category, img, event_id } = req.body;
      const [result] = await pool.query(`
      UPDATE events_club 
        SET title = IFNULL(?, title), 
            dateEvent = IFNULL(?, dateEvent), 
            organizer = IFNULL(?, organizer), 
            description = IFNULL(?, description), 
            hourEvent = IFNULL(?, hourEvent), 
            idCategory = IFNULL(?, idCategory), 
            img = IFNULL(?, img)
        WHERE id = ?
      `,[title, date_event, organizer, description, hour_event, id_category, img, event_id ])

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

export const getUsersByEvent = async (req, res) => {
  try{
    const event_id = req.params.id
    const [users] = await pool.query("SELECT u.id, u.name, u.surname, u.username, u.mail, u.birthDate, u.gender, u.country, u.city, u.phone FROM users u "+
    "INNER JOIN inscriptions i ON i.idUser = u.id " +
    "WHERE idEvent = ?",[event_id])

    if(users.length <= 0) return res.status(404).json({
        message: "Usuarios no encontrado."
    })

    return res.send(users)      
    
    //  return res.status(401).json({ message: "Token no válido" })
  } catch (error){
      return res.status(500).send({message: "Algo fue mal"});
  }
}

export const deleteEvent = async (req, res) => {
  try {

    // Extraer el event_id del cuerpo de la solicitud
    const { event_id } = req.body;

    // Utilizar transacciones si necesitas que ambas consultas se ejecuten o ninguna
    // await pool.beginTransaction()

    // Eliminar registros de la tabla 'inscriptions' donde 'idEvent' es igual a event_id
    await pool.query("DELETE FROM inscriptions WHERE idEvent = ?", [event_id]);

    // Eliminar registros de la tabla 'events_club' donde 'id' es igual a event_id
    await pool.query("DELETE FROM events_club WHERE id = ?", [event_id]);

    // Confirmar la transacción si ambas consultas se ejecutan correctamente
    // await pool.commit();

    // Enviar respuesta exitosa al cliente
    res.status(204).json({ message: "Evento Eliminado" });
  } catch (error) {
    // Si hay un error, revertir la transacción (si se inició)
    // await pool.rollback();

    // Enviar respuesta de error al cliente
    res.status(500).json({ message: error.message || "Error al eliminar el evento" });
  }
};
