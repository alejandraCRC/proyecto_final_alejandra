"use strict"
import { Router } from 'express';
import { addMiembroClub, getClubsUsuario, getmiembrosClub, delMiembroClub} from '../controllers/clubs-usuarios.controllers.js';
import { autenticarToken } from '../controllers/auth.controllers.js';
const router = Router();

router.get('/clubsUsuario',autenticarToken, getClubsUsuario); //Obtiene los clubs a los que pertenece el usuario
router.get('/miembros/:id_club' , getmiembrosClub); //Obtiene los miembros de un club
router.post('/miembros/:id_club/:id_usuario',addMiembroClub); //añade un miembro a un club
router.delete('/miembros/:id_club/:id_usuario',  delMiembroClub); // Elimina un miembro de un club

export { router as routerClubsUsuarios };
  