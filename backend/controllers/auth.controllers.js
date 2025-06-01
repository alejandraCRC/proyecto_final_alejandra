"use strict"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import { SECRET_KEY, REFRESH_SECRET_KEY } from '../config.js';
// import {v4 as uuidv4} from 'uuid';
// import { sendMail } from '../mailer.js';


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
    // //validar que la cuenta está activa
    // if(!result[0].is_verif){
    //   return res.status(403).json({message: "Cuenta no activa, revisa tu correo para activarla"});
    // }
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

    // //enviar un email
    // sendMail(result[0].email, 'logueado2', `<h1>Hola ${result[0].username}</h1><p>Gracias por loguearte</p>`)

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
    // console.log(token);
    
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
  try {
    
    const [resultEmail] = await pool.query("SELECT * FROM usuarios WHERE email=?", [email]);
    if(resultEmail.length == 1){
      return res.status(400).json({message: "El email ya existe"});
   
    }
      const hashPassword = await bcrypt.hash(contrasenia, 10)
      // const activacionToken= uuidv4();
      const [result]=await pool.query("INSERT INTO usuarios (nombre, email, contrasenia, fecha_registro) VALUES (?,?,?,?)", [nombre, email, hashPassword, fecha_registro]);
      // console.log(result);
    
    // const activarLink=`http://localhost:3000/activa/${activacionToken}`;
    // const emailHTML = '<h2>Bienvenid@ a nuestra plataforma</h2>' +
    // '<p>Para activar su cuenta haga click en el siguiente enlace</p>' +
    //  `<a href="${activarLink}">Activar cuenta</a>`;
    //  await sendMail(email,'Activa cuenta',emailHTML)

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
    return res.status(401).json({ message: 'No hay refresh token, inicie sesión nuevamente' });
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

/**
 * 
 * @param {Array} rolesPermitidos donde establecerá los roles permitidos
 * @returns permite que siga al siguiente metodo o error
 */
// export const autorizarRol=(rolesPermitidos)=>{
//   return (req, res, next)=>{
//     console.log();
//     if(!rolesPermitidos.includes(req.user.role)){
//       return res.status(403).json({message: "No tiene permiso para acceder a esta ruta"});
//     }
//     next();
//   }
// }

// export const activaCuenta= async(req, res)=>{
//   const {token}=req.params; //esta en la url
//   //buscar el usuario que ha recivido ese token
//   const [user] = await pool.query("SELECT * FROM usuarios WHERE token_verif=?",[token]);

//   if(user.length == 0){
//     return res.status(400).json({message: 'Token no válido o no existe'})
//   }
//   //actualizar is_verif y token_verif
//   await pool.query("UPDATE usuarios SET is_verif=?, token_verif=? WHERE token_verif=?",[true, null, token]);
//   res.status(200).json({message: 'Cuenta activada correctamente, ya puedes iniciar sesión'})
// }