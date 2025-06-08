"use strict"

import { Router } from 'express';

import {getUsuario, getUsuariosPorNombre, getSeguidos, getSeguidores, seguirUsuario, dejarSeguirUsuario, updateUsuario, delUsuario} from '../controllers/usuarios.controllers.js'
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();

router.get('/usuario',autenticarToken,  getUsuario);
router.get('/usuario/:idUsuario',autenticarToken,  getUsuario);
router.get('/buscarUsuarios/:nombre',  getUsuariosPorNombre);
router.put('/usuarios/:id_usuario', updateUsuario);
router.delete('/usuarios', autenticarToken, delUsuario); // Asumiendo que el delete también actualiza el usuario

router.get('/seguidos/:id_seguidor',autenticarToken, getSeguidos);
router.get('/seguidos',autenticarToken, getSeguidos);

router.get('/seguidores/:id_seguido',autenticarToken, getSeguidores);
router.get('/seguidores',autenticarToken, getSeguidores);

router.post('/seguir/:id_seguido',autenticarToken, seguirUsuario);
router.delete('/dejarSeguir/:id_seguido',autenticarToken, dejarSeguirUsuario);

export { router as routerUsuarios };
