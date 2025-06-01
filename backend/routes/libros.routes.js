"use strict"

import { Router } from 'express';
import {pool} from '../db.js'
import { getLibro, getLibros, getLibrosGenero } from '../controllers/libros.controllers.js';

const router = Router();


router.get('/libros', getLibros);
router.get('/libro/:id', getLibro);
router.get('/libros/genero/:genero', getLibrosGenero);
// router.post('/tareas',addTarea);
// router.put('/tareas/:id', updateTarea);
// router.delete('/tareas/:id',  delTarea);

export { router as routerLibros };
