import { JWT_SECRET_USER, JWT_SECRET_ADMIN} from '../../config.js';
import jwt from 'jsonwebtoken'

export const checkToken = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(401).json({ error: "Debes incluir el header" });
  }

  const token = req.headers['authorization'];

  try {
    const decodedUser = jwt.verify(token, JWT_SECRET_USER);
  } catch (errUser) {
    try {
      const decodedAdmin = jwt.verify(token, JWT_SECRET_ADMIN);
    } catch (errAdmin) {
      return res.status(401).json({ message: "Token no válido" });
    }
  }
  next();
};

/*
export const checkToken = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(401).json({ error: "Debes incluir el header" });
  }

  const token = req.headers['authorization'];

  try {

  
    next();
  } catch (error) {
    return res.status(401).json({ error: "El token no es correcto user" });
  }
};

*/

export const checkTokenAdmi = (req, res, next) => {
    if(!req.headers['authorization']){
        return res.json({error: "Debes incluir el header"})
    }

    const token = req.headers['authorization']

    let payload
    try{
        payload = jwt.verify(token, JWT_SECRET_ADMIN)
    }catch{
        return res.status(401).json({error: "El token no es correcto admin"})
    }
    next()
}