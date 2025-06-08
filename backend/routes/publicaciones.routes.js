"use strict"

import { Router } from 'express';
import { getPublicaciones,getPublicacionesUsuario, addPublicacion, getComentariosPublicaciones, addComentarioPublicacion, delPublicacion, delComentarioPublicacion } from '../controllers/publicaciones.controllers.js';
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();

//publicaciones
router.get('/publicaciones/:id_club', getPublicaciones); // Obtiene las publicaciones de un club
router.get('/publicacionesUsuario/:id_usuario', getPublicacionesUsuario); // Obtiene las publicaciones de un usuario
router.post('/publicaciones',autenticarToken,addPublicacion); // Añade una nueva publicación
router.delete('/publicaciones/:id_publicacion',autenticarToken,  delPublicacion); // Elimina una publicación

//comentarios de publicaciones
router.get('/comentarios/:id_publicacion', getComentariosPublicaciones); // Obtiene los comentarios de una publicación
router.post('/comentarios',autenticarToken, addComentarioPublicacion); // Añade un comentario a una publicación
router.delete('/comentarios/:id_comentario',autenticarToken,  delComentarioPublicacion); // Elimina un comentario de una publicación

export { router as routerPublicaciones };
