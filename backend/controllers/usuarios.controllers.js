import { pool } from "../db.js";

//obtener un usuario
export const getUsuario = async (req, res) => {
  try {
    const id_usuario = req.params.idUsuario || req.user?.id;
    const [result] = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario=?",
      [id_usuario]
    );
    console.log(result);
    const usuario = result[0];
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener usuarios seguidos",
      error: error.message,
    });
  }
};

//obtener usuarios por nombre
export const getUsuariosPorNombre = async (req, res) => {
  try {
    console.log("params", req.params);
    const { nombre } = req.params;
    const [result] = await pool.query(
      "SELECT * FROM usuarios WHERE nombre LIKE ?",
      [`%${nombre}%`]
    ); // búsqueda parcial
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

//obtener los usuarios seguidos por un usuario
export const getSeguidos = async (req, res) => {
  try {
    console.log("params seguidos", req.params, req.user?.id);
    const id_seguidor = req.params.id_seguidor || req.user?.id;
    const [result] = await pool.query(
      "SELECT u.id_usuario, u.nombre, u.email FROM seguimientos s JOIN usuarios u ON s.id_seguido = u.id_usuario WHERE s.id_seguidor = ?",
      [id_seguidor]
    );
    result;
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener usuarios seguidos",
      error: error.message,
    });
  }
};

//obtener los seguidores de un usuario
export const getSeguidores = async (req, res) => {
  try {
    const id_seguido = req.params.id_seguido || req.user?.id;
    const [result] = await pool.query(
      "SELECT u.id_usuario, u.nombre, u.email FROM seguimientos s JOIN usuarios u ON s.id_seguidor = u.id_usuario WHERE s.id_seguido = ?",
      [id_seguido]
    );
    "prueba", result;
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener seguidores", error: error.message });
  }
};

// Seguir a un usuario
export const seguirUsuario = async (req, res) => {
  try {
    const id_seguidor = req.user.id;
    const { id_seguido } = req.params;
    const [result] = await pool.query(
      "INSERT INTO seguimientos (id_seguidor, id_seguido) VALUES (?,?)",
      [id_seguidor, id_seguido]
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

// Dejar de seguir a un usuario
export const dejarSeguirUsuario = async (req, res) => {
  try {
    const id_seguidor = req.user.id;
    const { id_seguido } = req.params;
    console.log(req.body);
    const [result] = await pool.query(
      "DELETE FROM seguimientos WHERE id_seguidor=? AND id_seguido=?",
      [id_seguidor, id_seguido]
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

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario || req.user?.id;
    const { nombre, email, biografia } = req.body;


    const [result] = await pool.query(
      "UPDATE usuarios SET nombre=?, email=?,  biografia=? WHERE id_usuario=?",
      [nombre, email, biografia, id_usuario]
    );

    console.log(result);
    //Comprueba que se hayan cambiado los datos de la fila
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

// Eliminar un usuario
export const delUsuario = async (req, res) => {
  try {
    const id_usuario =  req.user.id;
    const [result] = await pool.query("DELETE FROM usuarios WHERE id_usuario=?", [
      id_usuario,
    ]);
    console.log("borrado", result);
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
}
