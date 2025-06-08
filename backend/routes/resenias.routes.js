"use strict"

import { Router } from 'express';
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();
import { addResenia, getReseniasPorLibroId,getReseniasPorUsuarioId} from '../controllers/resenias.controllers.js';

router.get('/resenias/:id_libro',autenticarToken, getReseniasPorLibroId); // Obtiene las reseñas de un libro
router.get('/reseniasUsuario/:id_usuario', getReseniasPorUsuarioId); // Obtiene las reseñas de un usuario
router.post('/resenias',autenticarToken,addResenia); // Añade una nueva reseña
// router.delete('/libroUsuario/:id',  delLibroUsuario);

export { router as routerResenias };
