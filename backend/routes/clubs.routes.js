"use strict"

import { Router } from 'express';
import {pool} from '../db.js'
import { getClub, getClubs, getClubsPorNombre, updateClub, delClub, addClub, addLecturaActual, getLecturaActual, delLecturaActual } from '../controllers/clubs.controllers.js';
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();


router.get('/clubs', getClubs);
router.get('/club/:id', getClub);
router.get('/buscarClubs/:nombre', getClubsPorNombre);
router.post('/clubs', autenticarToken, addClub);
router.put('/clubs/:id_club', updateClub);
router.delete('/clubs/:id_club',  delClub);

//lectura actual
router.get('/lectura_actual/:id_club', getLecturaActual);
router.post('/lectura_actual/:id_club', addLecturaActual);
// router.put('/lectura_actual/:id_club', updateClub);
router.delete('/lectura_actual/:id_club',  delLecturaActual);


export { router as routerClubs };
