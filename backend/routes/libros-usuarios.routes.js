"use strict"

import { Router } from 'express';
import { updateLibroUsuario, addLibroUsuario, getLibrosUsuario, delLibroUsuario } from '../controllers/libros-usuarios.controllers.js';
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();


router.get('/librosUsuario',autenticarToken, getLibrosUsuario);
router.get('/librosUsuario/:id_usuario',autenticarToken, getLibrosUsuario);
router.post('/librosUsuario',autenticarToken,addLibroUsuario);
router.put('/librosUsuario/:id_libro/:id_usuario', updateLibroUsuario);
router.delete('/librosUsuario/:id_libro', autenticarToken, delLibroUsuario);

export { router as routerLibrosUsuarios };
