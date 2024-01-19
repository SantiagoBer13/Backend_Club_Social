import { JWT_SECRET_USER, JWT_SECRET_ADMIN } from '../../config.js';
import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res) => {
    /*
    try {
        const { token } = req.body;
        jwt.verify(token, JWT_SECRET_USER || JWT_SECRET_ADMIN, (err, decoded) => {
            if (err) {
            res.status(401).json({ isValid: false });
            } else {
            res.json({ isValid: true });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Algo fue mal', messageError: error });
    }*/
    res.json({ isValid: true });
}

export const verifyTokenAdmi = async (req, res) => {
    try {
        const token = req.headers['authorization'];
        jwt.verify(token, JWT_SECRET_ADMIN, (err, decoded) => {
            if (err) {
                res.status(401).json({ isValid: false });
            } else {
                res.json({ isValid: true });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Algo fue mal', messageError: error });
    }
}