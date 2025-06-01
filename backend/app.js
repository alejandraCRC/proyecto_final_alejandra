import express from 'express';
import cors from 'cors';


import { PORT } from './config.js';
import { routerAuth } from './routes/auth.routes.js';
import { routerLibros } from './routes/libros.routes.js';
import { routerLibrosUsuarios } from './routes/libros-usuarios.routes.js';
import { routerUsuarios } from './routes/usuarios.routes.js';
import { routerClubs } from './routes/clubs.routes.js';
import { routerClubsUsuarios } from './routes/clubs-usuarios.routes.js';
import { routerPublicaciones } from './routes/publicaciones.routes.js';
import { routerResenias } from './routes/resenias.routes.js';



const app = express();
import cookieParser from 'cookie-parser';
//Configurar puerto
//const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());


//Middleware para manejar las CORS
app.use (cors())
// app.use(cors({
//   origin: 'https://proyecto-final-alejandra-haso.vercel.app',
//   credentials: true
// }));
app.use(cookieParser());

//para parsear la peticion al usuario
app.use(express.json());

//ruta de autenticación
app.use(routerAuth);

// Usar las rutas directas); // No necesitas añadir un prefijo aquí
app.use(routerLibros);
app.use(routerLibrosUsuarios);
app.use(routerUsuarios);
app.use(routerClubs);
app.use(routerClubsUsuarios);
app.use(routerPublicaciones);
app.use(routerResenias);

// Manejar rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ message: 'Página no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
