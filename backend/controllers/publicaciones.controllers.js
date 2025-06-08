import { pool } from "../db.js";

//obtener todas las publicaciones de un club
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

// Obtener las publicaciones de un usuario
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

// Añadir una nueva publicación
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

// eliminar una publicación
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

//a partir de aquí endpoints de comentarios de publicaciones

// Obtener los comentarios de una publicación
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

// Añadir un comentario a una publicación
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

// Eliminar un comentario de una publicación
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
