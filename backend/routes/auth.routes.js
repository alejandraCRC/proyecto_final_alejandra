"use strict"

import { Router } from 'express';
import {login, register, refreshToken} from '../controllers/auth.controllers.js';

const router = Router();

router.post('/login', login); //iniciar sesión
router.post('/register', register); //registrar usuario
router.get('/refresh-token',refreshToken); //refrescar token

export { router as routerAuth }; 
