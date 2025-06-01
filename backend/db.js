import mysql from 'mysql2/promise'; // Importamos el módulo `mysql2` con soporte para promesas
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } from './config.js';


// Configuramos un pool de conexiones con MySQL
export const pool = mysql.createPool({
    host: DB_HOST,  // Dirección del servidor MySQL (usualmente 'localhost' si está en tu máquina local)
    user: DB_USER,       // Nombre de usuario para conectarse a la base de datos
    password: DB_PASSWORD,       // Contraseña del usuario (debe ser configurada si tienes una contraseña definida)
    database: DB_DATABASE, // Nombre de la base de datos a la que deseas conectarte
    waitForConnections: true,    // Espera conexiones si todas están ocupadas
    connectionLimit: 10,         // Número máximo de conexiones simultáneas en el pool
    queueLimit: 0                // Límite para la cola de solicitudes (0 significa ilimitado)
});

// Verificamos si la conexión al pool de MySQL es exitosa
(async () => {
    try {
        // Intentamos obtener una conexión del pool
        const connection = await pool.getConnection();
        console.log('Conexión con MySQL establecida correctamente.'); // Si es exitoso, mostramos un mensaje en la consola

        // Liberamos la conexión para que pueda ser reutilizada
        connection.release();
    } catch (error) {
        // En caso de error, mostramos el mensaje correspondiente en la consola
        console.error('Error al conectar con MySQL:', error.message);
    }
})();
