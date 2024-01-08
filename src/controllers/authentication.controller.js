import { JWT_SECRET_USER } from '../../config.js';
import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res) => {
    try {
        const { token } = req.body;
        jwt.verify(token, JWT_SECRET_USER, (err, decoded) => {
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