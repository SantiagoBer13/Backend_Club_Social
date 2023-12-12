import { createPool } from "mysql2/promise.js";

import { 
    DB_DATABASE,DB_HOST,DB_PORT,DB_USER,PASSWORD,PORT
} from "../config.js"

export const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
})