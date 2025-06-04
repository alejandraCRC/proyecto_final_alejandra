import { pool } from "../db.js";

export const getPublicaciones = async (req, res) => {
  const { id_club } = req.params;

  try {
    const [result] = await pool.query(
      "SELECT p.id_publicacion, p.id_usuario, p.titulo, p.contenido, p.fecha_publicacion, u.nombre FROM publicaciones p JOIN usuarios u ON p.id_usuario = u.id_usuario WHERE p.id_club = ?",
      [id_club]
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las publicaciones",
      error: error.message,
    });
  }
};

export const getPublicacionesUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const [result] = await pool.query(
      "SELECT p.id_publicacion, p.id_usuario, p.id_club, p.titulo, p.contenido, p.fecha_publicacion, u.nombre AS nombre_usuario, c.nombre AS nombre_club FROM publicaciones p JOIN usuarios u ON p.id_usuario = u.id_usuario LEFT JOIN clubes_de_lectura c ON p.id_club = c.id_club WHERE p.id_usuario = ?",
      [id_usuario]
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las publicaciones",
      error: error.message,
    });
  }
};

export const addPublicacion = async (req, res) => {
  try {
    const id_usuario = req.user.id;
    const { id_club, titulo, contenido, fecha_publicacion } = req.body;
    const fechaFormateada = new Date(fecha_publicacion).toISOString().slice(0, 19).replace('T', ' '); 
    const [result] = await pool.query(
      "INSERT INTO publicaciones (id_usuario, id_club,titulo, contenido, fecha_publicacion) VALUES (?,?,?,?,?) ",
      [id_usuario, id_club, titulo, contenido, fechaFormateada]
    );
   

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error,
    });
  }
};

export const delPublicacion = async (req, res) => {
  try {
    const { id_publicacion } = req.params;
    const [result] = await pool.query("DELETE FROM publicaciones WHERE id_publicacion=?", [id_publicacion]);

    if (result.affectedRows == 0) {
      return res.status(400).json({
        message: "no existe",
      });
    } else {
      return res.status(200).json({
        message: "ha sido borrado",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
}

export const getComentariosPublicaciones = async (req, res) => {
  const { id_publicacion } = req.params;
  console.log(' comentarios id_publicacion', id_publicacion);
  try {
    const [result] = await pool.query(
      "SELECT c.id_comentario, c.id_usuario, c.contenido, c.fecha_comentario, u.nombre FROM comentarios_publicacion c JOIN usuarios u ON c.id_usuario = u.id_usuario WHERE c.id_publicacion = ?",
      [id_publicacion]
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los comentarios",
      error: error.message,
    });
  }
};

export const addComentarioPublicacion = async (req, res) => {
  try {
    const id_usuario = req.user.id;
    const { id_publicacion, contenido, fecha_comentario } = req.body;
    const fechaFormateada = new Date(fecha_comentario).toISOString().slice(0, 19).replace('T', ' ')
    const [result] = await pool.query(
      "INSERT INTO comentarios_publicacion (id_usuario, id_publicacion, contenido, fecha_comentario) VALUES (?,?,?,?) ",
      [id_usuario, id_publicacion, contenido, fechaFormateada]
    );
    console.log(result);

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error,
    });
  }
};

export const delComentarioPublicacion = async (req, res) => {
  try {
    const { id_comentario } = req.params;
    console.log('borrar comentario', id_comentario);
    const [result] = await pool.query("DELETE FROM comentarios_publicacion WHERE id_comentario=?", [id_comentario]);

    if (result.affectedRows == 0) {
      return res.status(400).json({
        message: "no existe",
      });
    } else {
      return res.status(200).json({
        message: "ha sido borrado",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
}

// export const getmiembrosClub = async (req, res) => {
//   const {id_club} = req.params;

//   try {
//     const [result] = await pool.query("SELECT * FROM miembros_club WHERE id_club = ?", [id_club]);

//     res.status(200).json(result);
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         message: "Error al obtener los libros del usuario",
//         error: error.message,
//       });
//   }
// };
// export const addClubUsuario = async (req, res) => {
//   try {
//     const id_usuario = req.user.id;
//   // console.log('red',req.user);
//   //   console.log(req.body);
//     const {  id_libro, fecha, estado } = req.body;

//     const [result] = await pool.query(
//       "INSERT INTO libros_usuario (id_usuario, id_libro, fecha, estado) VALUES (?,?,?,?)",
//       [id_usuario, id_libro, fecha, estado]
//     );

//     res.status(201).json({ id: result.insertId });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error en el servidor",
//     });
//   }
// };

// export const updateLibroUsuario = async (req, res) => {
//   try {
//     const { fecha, estado } = req.body;
//     const { id_libro, id_usuario } = req.params;

//     const [result] = await pool.query(
//       "UPDATE libros_usuario SET fecha=?, estado=? WHERE id_libro=? AND id_usuario=?",
//       [fecha, estado, id_libro, id_usuario]
//     );

//     if (result.affectedRows == 0) {
//       return res.status(400).json({
//         message: "no existe",
//       });
//     } else {
//       return res.status(200).json({
//         message: "ha sido actualizado",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "Error en el servidor",
//     });
//   }
// };

// export const delLibroUsuario = async (req, res) => {
//   try {
//     const {id_libro, id_usuario} =req.params
//     const [result]=await pool.query("DELETE FROM libros_usuario WHERE id_libro=? AND id_usuario=?", [id_libro, id_usuario]);

//     if (result.affectedRows==0){
//         return res.status(400).json({
//             message:'no existe'
//         })
//     }else{
//         return res.status(200).json({
//             message:'ha sido borrado'
//         })
//     }
// } catch (error) {
//     res.status(500).json({
//         message:"Error en el servidor"
//     })
// }
// };
