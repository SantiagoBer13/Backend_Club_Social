import { pool } from "../db.js";
import bcrypt from 'bcryptjs';

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
        req.body.password = bcrypt.hashSync(req.body.password, 12);
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

export const loginUser = async (req, res) => {
    try {
        const { mail ,password} = req.body
        const [rows] = await pool.query("SELECT mail, password FROM users WHERE mail = ?", 
        [mail])
        if(rows.length <= 0){
            return res.status(404).json({message: "Credenciales inválidas"})
        }
        const isPasswordValid = bcrypt.compareSync(password, rows[0].password);

        if (!isPasswordValid) {
            return res.status(404).json({ message: "Credenciales inválidas" });
        }

        return res.status(200).json({ message: "Inicio de sesión exitoso" });
        /*
        return res.status(201).json({
            id: rows.insertId,
            name, surname, username, mail, birthDate, gender, country, city, phone, registerDate
        })
        */
    } catch (error) {
        return res.status(500).send({ message: "Algo fue mal", messageError:  error});
    }
}