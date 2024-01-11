import { pool } from "../db.js";
import { JWT_SECRET_USER, JWT_SECRET_ADMIN } from "../../config.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users")
        return res.json(rows)
    } catch (error) {
        return res.status(500).send({message: "Algo fue mal"});
    }
}

export const getUser = async (req, res) => {
    try {
        const token = req.headers['authorization'];
        jwt.verify(token, JWT_SECRET_USER, async (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({ message: "Token no válido" });
            }
            const { user_id } = decoded;
            try {
                const [rows] = await pool.query(`
                    SELECT u.id, u.name, u.surname, u.username, u.mail, u.birthDate, u.gender, u.country, u.city, u.phone
                    FROM users u
                    WHERE id = ?`,
                    [user_id]);

                if (rows.length === 0) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                }

                return res.json(rows[0]);
            } catch (error) {
                return res.status(500).send({ message: "Algo fue mal" });
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Algo fue mal" });
    }
};

export const createUser = async (req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 12);
        const { name, surname, username, mail, birthDate, gender, country, city, phone, registerDate, password } = req.body;

        const [rows] = await pool.query("INSERT INTO users (name, surname, username, mail, birthDate, gender, country, city, phone, registerDate, password) VALUES (?,?,?,?,?,?,?,?,?,?,?)", 
        [name, surname, username, mail, birthDate, gender, country, city, phone, registerDate, password]);

        if (rows.affectedRows !== 1) {
            return res.status(500).json({ message: "Error al crear el usuario" });
        }

        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [rows.insertId]);

        return res.status(201).json({
            id: rows.insertId,
            name, surname, username, mail, birthDate, gender, country, city, phone, registerDate,
            token: createTokenUser(user[0])
        });
    } catch (error) {
        return res.status(500).json({ message: "Algo fue mal", messageError:  error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { mail, password } = req.body;

        

        const [rows] = await pool.query("SELECT id, mail, password FROM users WHERE mail = ?", [mail]);

        if (rows.length <= 0) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const isPasswordValid = bcrypt.compareSync(password, rows[0].password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        if(mail == "adm1@gmail.com"){
            return res.status(200).json({ message: "Inicio de sesión exitoso", token: createTokenAdmin(rows[0]) });
        }else{
            return res.status(200).json({ message: "Inicio de sesión exitoso", token: createTokenUser(rows[0]) });
        }
  
    } catch (error) {
        return res.status(500).json({ message: "Algo fue mal", messageError:  error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const token = req.headers['authorization']

        jwt.verify(token, JWT_SECRET_USER, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token no válido" });
            }

            const { user_id } = decoded;
            const { name, surname, username, mail, birthDate, gender, country, city, phone } = req.body;
            
            try {
                const [result] = await pool.query(`
                    UPDATE users 
                    SET name = IFNULL(?, name), 
                        surname = IFNULL(?, surname), 
                        username = IFNULL(?, username), 
                        mail = IFNULL(?, mail), 
                        birthDate = IFNULL(?, birthDate), 
                        gender = IFNULL(?, gender), 
                        country = IFNULL(?, country), 
                        city = IFNULL(?, city), 
                        phone = IFNULL(?, phone) 
                    WHERE id = ?`,
                    [name, surname, username, mail, birthDate, gender, country, city, phone, user_id]);

                if (result.affectedRows <= 0) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                }

                const [user] = await pool.query("SELECT id, name, surname, username, mail, birthDate, gender, country, city, phone FROM users WHERE id = ?", [user_id]);
                return res.json(user[0]);
            } catch (error) {
                return res.status(500).json({ message: "Algo fue mal", messageError:  error.message });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Algo fue mal" });
    }
};

function createTokenUser(user){
    const payload = {
        user_id: user.id,
        user_rol: "user"
    }
    return jwt.sign(payload, JWT_SECRET_USER)
}

function createTokenAdmin(user){
    const payload = {
        user_id: user.id,
        user_rol: "admin"
    }
    return jwt.sign(payload, JWT_SECRET_ADMIN)
}