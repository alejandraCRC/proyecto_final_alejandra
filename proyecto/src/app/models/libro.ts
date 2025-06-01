
export interface Libro {
    id_libro?: number,
    titulo: String,
    autor: String,
    isbn: String,
    fecha_publicacion: Date,
    genero: String,
    descripcion: String,
    portada: String
}

export interface LibrosUsuario {
    id_usuario: number,
    id_libro: number,
    fecha_registro: Date,
    estado: String,
    puntuacion: number,
    comentario: String
}
// export interface Tarea {
//     idTarea:number,
//     titulo:string,
//     descripcion:string,
//     fecha_creacion:Date,
//     estado:string,
//     idUsuario:number,
//     importancia:number
// }
