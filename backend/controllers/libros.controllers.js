import { pool } from '../db.js'

export const getLibros = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM libros");

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los libros", error: error.message });
  }
};

export const getLibro = async (req, res) => {
  try {
    const {id}=req.params
    const [result] = await pool.query("SELECT * FROM libros where id_libro=?",[id] );

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la tarea", error: error.message });
  }
};

export const getLibrosGenero = async (req, res) => {
  try {
    const {genero}=req.params
    const [result] = await pool.query("SELECT * FROM libros where genero=?",[genero] );

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los libros", error: error.message });
  }
};

// export const addTarea = async (req, res) => {
//   try {
//     console.log(req.body);
//     const {titulo, descripcion,fecha_creacion, estado, idUsuario, importancia}=req.body;

//      const [result]=await pool.query("INSERT INTO tareas (titulo, descripcion,fecha_creacion, estado, idUsuario, importancia) VALUES (?,?,?,?,?,?)", [titulo, descripcion,fecha_creacion, estado, idUsuario, importancia]);
//      console.log(result);

//      res.status(201).json({id:result.insertId});
// } catch (error) {
//     res.status(500).json({
//         message:"Error en el servidor"
//     })
// }
// };

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


