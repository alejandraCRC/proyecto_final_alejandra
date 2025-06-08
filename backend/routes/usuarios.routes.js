"use strict"

import { Router } from 'express';

import {getUsuario, getUsuariosPorNombre, getSeguidos, getSeguidores, seguirUsuario, dejarSeguirUsuario, updateUsuario, delUsuario} from '../controllers/usuarios.controllers.js'
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();

router.get('/usuario',autenticarToken,  getUsuario); // Obtiene el usuario autenticado
router.get('/usuario/:idUsuario',autenticarToken,  getUsuario); // Obtiene un usuario por ID
router.get('/buscarUsuarios/:nombre',  getUsuariosPorNombre); // Busca usuarios por nombre
router.put('/usuarios/:id_usuario', updateUsuario); // Actualiza un usuario por ID
router.delete('/usuarios', autenticarToken, delUsuario); // Elimina un usuario autenticado

router.get('/seguidos/:id_seguidor',autenticarToken, getSeguidos); // Obtiene los usuarios seguidos por un usuario por ID
router.get('/seguidos',autenticarToken, getSeguidos); // Obtiene los usuarios seguidos por el usuario autenticado

router.get('/seguidores/:id_seguido',autenticarToken, getSeguidores); // Obtiene los seguidores de un usuario por ID
router.get('/seguidores',autenticarToken, getSeguidores); // Obtiene los seguidores del usuario autenticado

router.post('/seguir/:id_seguido',autenticarToken, seguirUsuario); // Sigue a un usuario por ID
router.delete('/dejarSeguir/:id_seguido',autenticarToken, dejarSeguirUsuario); // Deja de seguir a un usuario por ID

export { router as routerUsuarios };
