"use strict"

import { Router } from 'express';
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();
import { addResenia, delResenia, getReseniasPorLibroId, getReseniasPorUsuarioId} from '../controllers/resenias.controllers.js';

router.get('/resenias/:id_libro',autenticarToken, getReseniasPorLibroId); // Obtiene las reseñas de un libro
router.get('/reseniasUsuario/:id_usuario', getReseniasPorUsuarioId); // Obtiene las reseñas de un usuario
router.post('/resenias',autenticarToken,addResenia); // Añade una nueva reseña
router.delete('/resenias/:id_libro', autenticarToken, delResenia); // Elimina una reseña

export { router as routerResenias };
