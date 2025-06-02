import { pool } from "../db.js";

export const getClubsUsuario = async (req, res) => {
  const id_usuario = req.user.id;

  try {
    const [result] = await pool.query(`SELECT c.*, u.nombre AS nombre_usuario
       FROM miembros_club mc
       JOIN clubes_de_lectura c ON mc.id_club = c.id_club
       JOIN usuarios u ON mc.id_miembro = u.id_usuario
       WHERE mc.id_miembro = ?`, [id_usuario]);

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener los libros del usuario",
        error: error.message,
      });
  }
};

export const getmiembrosClub = async (req, res) => {
  const {id_club} = req.params;

  try {
    const [result] = await pool.query("SELECT * FROM miembros_club WHERE id_club = ?", [id_club]);
    console.log('clubMiembros', result)
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener los libros del usuario",
        error: error.message,
      });
  }
};
export const addMiembroClub = async (req, res) => {
 const {id_club, id_usuario} = req.params;
 console.log('111', req.params);
 const { fecha_ingreso, rol } = req.body;
 const fechaFormateada = new Date(fecha_ingreso).toISOString().slice(0, 19).replace('T', ' '); 
  try {
    const [result] = await pool.query(
      "INSERT INTO miembros_club (id_club, id_miembro, fecha_ingreso, rol) VALUES (?, ?, ?, ?) ",
      [id_club, id_usuario, fechaFormateada, rol]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error,
    });
  }
}

export const delMiembroClub = async (req, res) => {
  const { id_club, id_miembro } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM miembros_club WHERE id_club = ? AND id_miembro = ?",
      [id_club, id_miembro]
    );

    if (result.affectedRows == 0) {
      return res.status(400).json({
        message: "No existe el miembro en el club",
      });
    } else {
      return res.status(200).json({
        message: "Miembro eliminado del club",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};