"use strict"

import { Router } from 'express';
import {pool} from '../db.js'
import { getPublicaciones,getPublicacionesUsuario, addPublicacion, getComentariosPublicaciones, addComentarioPublicacion } from '../controllers/publicaciones.controllers.js';
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();

//publicaciones
router.get('/publicaciones/:id_club', getPublicaciones);
router.get('/publicacionesUsuario/:id_usuario', getPublicacionesUsuario);
router.post('/publicaciones',autenticarToken,addPublicacion);

//comentarios de publicaciones
router.get('/comentarios/:id_publicacion', getComentariosPublicaciones);
router.post('/comentarios',autenticarToken, addComentarioPublicacion);
// router.put('/tareas/:id', updateTarea);
// router.delete('/tareas/:id',  delTarea);

export { router as routerPublicaciones };
