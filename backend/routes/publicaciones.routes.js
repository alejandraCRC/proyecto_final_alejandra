"use strict"

import { Router } from 'express';
import {pool} from '../db.js'
import { getPublicaciones,getPublicacionesUsuario, addPublicacion, getComentariosPublicaciones, addComentarioPublicacion, delPublicacion, delComentarioPublicacion } from '../controllers/publicaciones.controllers.js';
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();

//publicaciones
router.get('/publicaciones/:id_club', getPublicaciones);
router.get('/publicacionesUsuario/:id_usuario', getPublicacionesUsuario);
router.post('/publicaciones',autenticarToken,addPublicacion);
router.delete('/publicaciones/:id_publicacion',  delPublicacion);

//comentarios de publicaciones
router.get('/comentarios/:id_publicacion', getComentariosPublicaciones);
router.post('/comentarios',autenticarToken, addComentarioPublicacion);
router.delete('/comentarios/:id_comentario',  delComentarioPublicacion);


export { router as routerPublicaciones };
