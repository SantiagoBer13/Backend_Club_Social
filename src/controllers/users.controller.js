import { pool } from "../db.js";
import { JWT_SECRET_USER, JWT_SECRET_ADMIN } from "../../config.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { Resend } from 'resend';

const resend = new Resend('re_iCdccdXw_Lusu1iw6nRbF152iGMa8HzXt');

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
        const token = req.headers['authorization']
        const [valid, user_id] = validateToken(token)
        if(valid && user_id !== 0){
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
        }else{
            return res.status(401).json({ message: "Token no válido" });
        }
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
            return res.status(200).json({ message: "Inicio de sesión exitoso", token: createTokenAdmin(rows[0]), rol: "a" });
        }else{
            return res.status(200).json({ message: "Inicio de sesión exitoso", token: createTokenUser(rows[0]), rol: "u"});
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

export const checkUser = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Verificar si el correo está asociado a una cuenta de usuario
        const [rows] = await pool.query(`
            SELECT IF(COUNT(*) > 0, true, false) AS found_user
            FROM users
            WHERE mail = ?;`,
            [email]
        );
        const usuarioEncontrado = rows[0].found_user;

        if (usuarioEncontrado == "1") {
            // Generar un token de restablecimiento de contraseña
            const token = jwt.sign({ email }, 'secreto', { expiresIn: '1h' });

            // Enviar correo electrónico de restablecimiento de contraseña
            const { data, error } = await sendMail(email, token);

            if (error) {
                return res.status(400).json(error);
            }
            res.status(200).json({ message: 'Correo electrónico enviado con éxito.' });
        } else {
            res.status(404).json({ message: 'El correo electrónico no está asociado a ninguna cuenta.' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error al procesar la solicitud.');
    }
};

// Función para enviar correo electrónico de restablecimiento de contraseña
async function sendMail(email, token) {
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: "devpassionate0.0@gmail.com",
        subject: 'Restablecimiento de Contraseña',
        html: `
            <h1 style="color: red; text-align: center">Restablecimiento de Contraseña</h1>
            <p>Haz clic en este <a href="http://tuapp.com/reset-password/${token}">enlace</a> para restablecer tu contraseña.</p>
        `
    });
    return { data, error };
}

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