import { pool } from '../db.js'

export const getClubs = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM clubes_de_lectura");
    // console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los clubes de lectura", error: error.message });
  }
};

export const getClub = async (req, res) => {
  try {
    console.log('params',req.params);
    const {id}=req.params
    const [result] = await pool.query("SELECT * FROM clubes_de_lectura where id_club=?",[id] );
     console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el club", error: error.message });
  }
};

export const getClubsPorNombre = async (req, res) => {
  try {
    console.log('params',req.params);
    const {nombre}=req.params
    const [result] = await pool.query("SELECT * FROM clubes_de_lectura WHERE nombre LIKE ?", [`%${nombre}%`] );// búsqueda parcial
     console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los clubs", error: error.message });
  }
}

 export const updateClub = async (req, res) => {
    try {
      console.log('update',req.body);
      const { nombre, descripcion } = req.body;
      const { id_club } = req.params;

      const [result] = await pool.query(
        "UPDATE clubes_de_lectura SET nombre=?, descripcion=? WHERE id_club=?",
        [nombre, descripcion, id_club]
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

export const addClub = async (req, res) => {
  try {
    const id_creador = req.user.id;
    const {nombre, descripcion,fecha_creacion}=req.body;
    console.log('addClub',req.body, req.user.id);
     const [result]=await pool.query("INSERT INTO clubes_de_lectura (nombre, descripcion,fecha_creacion,id_creador) VALUES (?,?,?,?)", [nombre, descripcion,fecha_creacion, id_creador]);
      console.log(result);
     res.status(201).json({id_club:result.insertId});
} catch (error) {
    res.status(500).json({
        message:"Error en el servidor"
    })
}
};

export const delClub = async (req, res) => {  
  try {
    const {id_club} =req.params
    const [result]=await pool.query("DELETE FROM clubes_de_lectura WHERE id_club=?", [id_club]);
    if (result.affectedRows==0){
        return res.status(400).json({
            message:'no existe'
        })
    }else{
        return res.status(200).json({
            message:'ha sido borrado'
        })
    }
} catch (error) {
    res.status(500).json({
        message:"Error en el servidor"
    })
}
};


//lectura actual
export const addLecturaActual = async (req, res) => {
  try {
    const {id_club} = req.params
    const {id_libro,fecha_inicio, fecha_fin, personas_leido}=req.body;
    console.log(req.body)
     const [result]=await pool.query("INSERT INTO lectura_actual (id_club, id_libro,fecha_inicio, fecha_fin, personas_leido) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE id_libro = VALUES(id_libro), fecha_inicio = VALUES(fecha_inicio), fecha_fin = VALUES(fecha_fin), personas_leido = VALUES(personas_leido);", [id_club, id_libro,fecha_inicio, fecha_fin, personas_leido]);

     res.status(201).json({id_club:result.insertId});
} catch (error) {
    res.status(500).json({
        message:"Error en el servidor"
    })
}
};

export const getLecturaActual = async (req, res) => {
  try {
    const {id_club}=req.params
    const [result] = await pool.query("SELECT * FROM lectura_actual where id_club=?",[id_club] );
     console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la lectura actual", error: error.message });
  }
}

export const delLecturaActual = async (req, res) => {  
  try {
    const {id_club} =req.params
    const [result]=await pool.query("DELETE FROM lectura_actual WHERE id_club=?", [id_club]);
    if (result.affectedRows==0){
        return res.status(400).json({
            message:'no existe'
        })
    }else{
        return res.status(200).json({
            message:'ha sido borrado'
        })
    }
} catch (error) {
    res.status(500).json({
        message:"Error en el servidor"
    })
}
};