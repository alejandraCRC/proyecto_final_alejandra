import { pool } from "../db.js";

export const getLibrosUsuario = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario || req.user?.id;
    const [result] = await pool.query("SELECT * FROM libros_usuario WHERE id_usuario=?", [
      id_usuario,
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los libros del usuario",
      error: error.message,
    });
  }
};

export const addLibroUsuario = async (req, res) => {
  try {
    const id_usuario = req.user.id;

    const { id_libro, fecha, estado } = req.body;
    const fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' '); 
    const [result] = await pool.query(
      "INSERT INTO libros_usuario (id_libro, id_usuario, fecha, estado) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE fecha = VALUES(fecha), estado = VALUES(estado)",
      [id_libro,id_usuario, fechaFormateada, estado]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error,
    });
  }
};

export const updateLibroUsuario = async (req, res) => {
  try {
    const { fecha, estado } = req.body;
    const { id_libro, id_usuario } = req.params;

    const [result] = await pool.query(
      "UPDATE libros_usuario SET fecha=?, estado=? WHERE id_libro=? AND id_usuario=?",
      [fecha, estado, id_libro, id_usuario]
    );

    if (result.affectedRows == 0) {
      return res.status(400).json({
        message: "no existe",
      });
    } else {
      return res.status(200).json({
        message: "ha sido actualizado",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

export const delLibroUsuario = async (req, res) => {
  try {
    const id_usuario = req.user.id;
    const { id_libro } = req.params;
    const [result] = await pool.query(
      "DELETE FROM libros_usuario WHERE id_libro=? AND id_usuario=?",
      [id_libro, id_usuario]
    );
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
    });
  }
};
