import { pool } from "../db.js";

export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users")
        return res.json(rows)
    } catch (error) {
        return res.status(500).send({message: "Algo fue mal"});
    }
}

/*
export const getUser = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users")
        return res.json(rows)
    } catch (error) {
        return res.status(500).send({message: "Algo fue mal"});
    }
}
*/

export const createUser = async (req, res) => {
    try {
        const {name , surname, username, mail, birthDate, gender, country, city, phone, registerDate, password} = req.body
        const [rows] = await pool.query("INSERT INTO users (name, surname, username,mail,birthDate,gender,country,city,phone,registerDate,password) VALUES (?,?,?,?,?,?,?,?,?,?,?)", 
        [name, surname, username, mail, birthDate, gender, country, city, phone, registerDate, password])
        return res.status(201).json({
            id: rows.insertId,
            name, surname, username, mail, birthDate, gender, country, city, phone, registerDate
        })
    } catch (error) {
        return res.status(500).send({ message: "Algo fue mal", messageError:  error});
    }

}