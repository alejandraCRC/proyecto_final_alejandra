import mysql from 'mysql2/promise';
import postgres from 'postgres';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, DATABASE_URL, DB_TYPE } from './config.js';

let db;
let pool;

if (DB_TYPE === 'mysql') {
  // Pool para MySQL
  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  (async () => {
    try {
      const connection = await pool.getConnection();
      console.log('Conexión con MySQL establecida correctamente.');
      connection.release();
    } catch (error) {
      console.error('Error al conectar con MySQL:', error.message);
    }
  })();

  db = pool; // exportar o usar pool para queries

} else if (DB_TYPE === 'postgres') {
  // Conexión para PostgreSQL
  const sql = postgres(DATABASE_URL);
  console.log('Conexión con PostgreSQL establecida correctamente.');
  db = sql; // exportar o usar sql para queries
}

export { pool };
export default db;
