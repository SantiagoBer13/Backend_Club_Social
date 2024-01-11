import { config } from "dotenv"
config()

export const PORT = process.env.PORT 
export const DB_HOST = process.env.DB_HOST
export const DB_PORT = process.env.DB_PORT
export const DB_USER = process.env.DB_USER
export const PASSWORD = process.env.PASSWORD
export const DB_DATABASE = process.env.DB_DATABASE
export const JWT_SECRET_USER = process.env.JWT_SECRET_USER
export const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN