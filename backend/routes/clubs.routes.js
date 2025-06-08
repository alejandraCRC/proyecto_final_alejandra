"use strict"

import { Router } from 'express';
import { getClub, getClubs, getClubsPorNombre, updateClub, delClub, addClub, addLecturaActual, getLecturaActual, delLecturaActual } from '../controllers/clubs.controllers.js';
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();

router.get('/clubs', getClubs); // Obtener todos los clubes de lectura
router.get('/club/:id', getClub); // Obtener un club de lectura por ID
router.get('/buscarClubs/:nombre', getClubsPorNombre); // Obtener clubes de lectura por nombre 
router.post('/clubs', autenticarToken, addClub); // Añadir un nuevo club de lectura
router.put('/clubs/:id_club', updateClub); // Actualizar un club de lectura
router.delete('/clubs/:id_club',  delClub); // Eliminar un club de lectura

//lectura actual
router.get('/lectura_actual/:id_club', getLecturaActual); // Obtener la lectura actual de un club
router.post('/lectura_actual/:id_club', addLecturaActual); // Añadir una lectura actual a un club
router.delete('/lectura_actual/:id_club',  delLecturaActual); // Eliminar la lectura actual de un club


export { router as routerClubs };
