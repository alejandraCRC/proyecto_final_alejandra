"use strict"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import { SECRET_KEY, REFRESH_SECRET_KEY } from '../config.js';


export const login = async (req, res) => {
  const {email, password} = req.body
  try {
    const [result] = await pool.query("SELECT * FROM usuarios WHERE email=?", [email]);

    //comprobar que el email existe
    if(result.length == 0){
      return res.status(401).json({message: "Email y/o contraseña incorrectos"});
    }
    
    //verificar la contraseña con bcrypt
    const validarPass = await bcrypt.compare(password, result[0].contrasenia);
    if(!validarPass){
      return res.status(401).json({message: "Email y/o contraseña incorrectos"});
    }
    // //generar el token  
    const token = jwt.sign({id:result[0].id_usuario, createTo:new Date().toISOString()},SECRET_KEY,{
      "expiresIn": "3h"
    })
    // //generar el refresh token (7 dias)
    const refreshtoken = jwt.sign({id:result[0].id_usuario, createTo:new Date().toISOString()},REFRESH_SECRET_KEY,{
      "expiresIn": "7d"
    })

    // //guardar refresh token en una cookie HTTP-only
    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true, //la cookie es accesible solo por el servidor no javaScript
      secure: true,
      sameSite: "none", //protección CSRF
    })

    //devolver al usuario
    res.status(200).json({
      token: token,
    usuario: result[0]});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
};

export const autenticarToken=(req, res, next)=>{
    //extraer el token de la peticion (req)
    const autHeader = req.headers['authorization'];
    
    //extraer el token de la constante autheader
    if(!autHeader){
      return res.status(403).json({message: 'token no proporcionado'})
    }
    const token = autHeader.split(' ')[1];
    
    //verificar la autenticidad del token
    jwt.verify(token, SECRET_KEY, (err, user)=>{
      if(err){//no es correcto el token
        return res.status(403).json({message: 'token no válido'})
      }
      req.user = user; //adquirir al usuario del token
      next(); //sigue el proceso
    })
}

export const register = async (req, res) => {
  const {nombre, email, contrasenia, fecha_registro} = req.body;
  const fechaFormateada = new Date(fecha_registro).toISOString().slice(0, 19).replace('T', ' '); 
  try {
    
    const [resultEmail] = await pool.query("SELECT * FROM usuarios WHERE email=?", [email]);
    if(resultEmail.length == 1){
      return res.status(400).json({message: "El email ya existe"});
   
    }
      const hashPassword = await bcrypt.hash(contrasenia, 10)
      const [result]=await pool.query("INSERT INTO usuarios (nombre, email, contrasenia, fecha_registro) VALUES (?,?,?,?)", [nombre, email, hashPassword, fechaFormateada]);

    if(result.affectedRows == 1){
      res.status(201).json({message: "Usuario creado correctamente"});
    }else{
      res.status(400).json({message: 'usuario no insertado'})
    }
     
} catch (error) {
    res.status(500).json({
        message:"Error en el servidor"
    })
}
};

export const refreshToken = async (req, res) => {
  // console.log('refresh');
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(204).end();
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);

    // Validamos que el usuario existe
    const [result] = await pool.query('SELECT id_usuario FROM usuarios WHERE id_usuario = ?', [decoded.id]);

    if (result.length === 0) {
      return res.status(401).json({ message: 'Usuario no válido' });
    }

    // Creamos un nuevo access token
    const token = jwt.sign(
      { id: result[0].id_usuario },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ accessToken: token });
  } catch (error) {
    console.error('Error al refrescar token:', error.message);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
