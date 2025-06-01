"use strict"

import { Router } from 'express';
import {pool} from '../db.js'
import {login, register, refreshToken} from '../controllers/auth.controllers.js';
// import { validarLogin, validarRegister } from '../validators/auth.validators .js';
//import { validar } from '../validators/alumnos.validators.js';

const router = Router();


router.post('/login', login); //validar login
router.post('/register', register); //validar register
router.get('/refresh-token',refreshToken);
// router.get('/activa/:token',activaCuenta);

export { router as routerAuth }; 
