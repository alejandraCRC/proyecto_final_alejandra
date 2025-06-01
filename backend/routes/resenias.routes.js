"use strict"

import { Router } from 'express';
import {pool} from '../db.js'
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();
import { addResenia, getReseniasPorLibroId,getReseniasPorUsuarioId} from '../controllers/resenias.controllers.js';

router.get('/resenias/:id_libro',autenticarToken, getReseniasPorLibroId);
router.get('/reseniasUsuario/:id_usuario', getReseniasPorUsuarioId);
router.post('/resenias',autenticarToken,addResenia);
// router.put('/librosUsuario/:id_libro/:id_usuario', updateLibroUsuario);
// router.delete('/libroUsuario/:id',  delLibroUsuario);

export { router as routerResenias };
