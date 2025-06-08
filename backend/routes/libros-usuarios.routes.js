"use strict"

import { Router } from 'express';
import { updateLibroUsuario, addLibroUsuario, getLibrosUsuario, delLibroUsuario } from '../controllers/libros-usuarios.controllers.js';
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();


router.get('/librosUsuario',autenticarToken, getLibrosUsuario); // Obtiene los libros de un usuario 
router.get('/librosUsuario/:id_usuario',autenticarToken, getLibrosUsuario); // Obtiene los libros de un usuario por ID 
router.post('/librosUsuario',autenticarToken,addLibroUsuario); // Añade un libro a un usuario
router.put('/librosUsuario/:id_libro/:id_usuario', updateLibroUsuario); // Actualiza un libro de un usuario
router.delete('/librosUsuario/:id_libro', autenticarToken, delLibroUsuario); // Elimina un libro de un usuario

export { router as routerLibrosUsuarios };
