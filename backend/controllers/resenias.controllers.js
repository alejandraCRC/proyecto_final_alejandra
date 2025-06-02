import { pool } from '../db.js'
import axios from 'axios';

// export const getLibros = async (req, res) => {
//   try {
//     const [result] = await pool.query("SELECT * FROM libros");
//     console.log(result);
//     res.status(200).json(result);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error al obtener los libros", error: error.message });
//   }
// };

export const getReseniasPorLibroId = async (req, res) => {
  try {
    console.log(req.params);
    const {id_libro}=req.params
    const [result] = await pool.query("SELECT r.id_usuario, r.resenia, r.calificacion, r.fecha, u.nombre FROM resenias r JOIN usuarios u ON r.id_usuario = u.id_usuario WHERE r.id_libro = ?",[id_libro] );
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las resenias", error: error.message });
  }
};



export const getReseniasPorUsuarioId = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const [resenias] = await pool.query(`
      SELECT r.id_usuario, r.id_libro, r.resenia, r.calificacion, r.fecha, u.nombre
      FROM resenias r
      JOIN usuarios u ON r.id_usuario = u.id_usuario
      WHERE r.id_usuario = ?
    `, [id_usuario]);

    // Para cada reseña, consultar Google Books
    const reseniasConTitulo = await Promise.all(
      resenias.map(async (r) => {
        try {
          const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${r.id_libro}`);
          const tituloLibro = response.data.volumeInfo?.title || 'Título no disponible';
          return {
            ...r,
            tituloLibro
          };
        } catch (err) {
          // En caso de error, solo retorna el nombre original
          return {
            ...r,
            tituloLibro: 'Error al obtener libro'
          };
        }
      })
    );

    res.status(200).json(reseniasConTitulo);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ message: 'Error al obtener reseñas', error: error.message });
  }
};




export const addResenia = async (req, res) => {
  try {
    const id_usuario = req.user.id;
console.log(id_usuario);
    const { id_libro, calificacion, resenia, fecha } = req.body;
    const fechaFormateada = new Date(fecha).toISOString().slice(0, 19).replace('T', ' '); 
    console.log(req.body);
    const [result] = await pool.query(
      "INSERT INTO resenias (id_usuario, id_libro,calificacion, resenia, fecha) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE fecha = VALUES(fecha), calificacion = VALUES(calificacion), resenia = VALUES(resenia)",
      [id_usuario, id_libro, calificacion, resenia, fechaFormateada]
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

// export const updateTarea = async (req, res) =>{
//   try {
//     console.log(req.body);
//     const {titulo, descripcion,fecha_creacion, estado, idUsuario, importancia}=req.body;
//     const {id}=req.params;

//     const [result]=await pool.query("UPDATE tareas SET titulo=?, descripcion=?, fecha_creacion=?, estado=?, idUsuario=?, importancia=? WHERE idTarea=?", [titulo, descripcion,fecha_creacion, estado, idUsuario, importancia, id]);
//     //const [result]=await pool.query("UPDATE alumnos SET apellidosNombre=IFNULL(?,apellidosNombre), idCurso=IFNULL(?, idCurso) WHERE idAlumno=?", [nameAl, idCiclo, id]);
    
//      console.log(result);
//      if (result.affectedRows==0){
//         return res.status(400).json({
//             message:'no existe'
//         })
//      }else{
//         return res.status(200).json({
//             message:'ha sido actualizado'
//         })
//      }

// } catch (error) {
//     res.status(500).json({
//         message:"Error en el servidor"
//     })
// }

// }

// export const delTarea = async (req, res) => {  
//   try {
//     console.log({req});
//     const {id} =req.params
//     const [result]=await pool.query("DELETE FROM tareas WHERE idTarea=?", [id]);
//     console.log('borrado', result);
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


