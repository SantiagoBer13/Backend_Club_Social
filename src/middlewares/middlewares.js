import { JWT_SECRET_USER } from '../../config.js';
import jwt from 'jsonwebtoken'

/*
export const checkToken = (req, res, next) => {
    if(!req.headers['authorization']){
        return res.json({error: "Debes incluir el header"})
    }

    const token = req.headers['authorization']

    let payload
    try{
        payload = jwt.verify(token, "usuario logueado")
    }catch{
        return res.json({error: "El token no es correcto"})
    }
    next()
}
*/

export const checkToken = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(401).json({ error: "Debes incluir el header" });
  }

  const token = req.headers['authorization'];

  try {
    const payload = jwt.verify(token, JWT_SECRET_USER);
    // Puedes adjuntar el payload a la solicitud si es necesario
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "El token no es correcto mi" });
  }
};

export const checkTokenAdmi = (req, res, next) => {
    if(!req.headers['authorization']){
        return res.json({error: "Debes incluir el header"})
    }

    const token = req.headers['authorization']

    let payload
    try{
        payload = jwt.verify(token, "admi logueado")
    }catch{
        return res.json({error: "El token no es correcto"})
    }
    next()
}