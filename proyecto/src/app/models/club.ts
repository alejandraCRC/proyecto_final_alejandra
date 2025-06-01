
export interface Club {
    id_club: number,
    nombre: string,
    descripcion: string,
    fecha_creacion: Date,
    id_creador: number
}

export interface MiembroClub {
    id_club: number,
    id_miembro:number,
    fecha_ingreso: Date,
    rol: string
}

export interface Publicacion {
    id_publicacion: number,
    id_usuario: number,
    id_club: number,
    titulo: string,
    contenido: string,
    fecha_publicacion: Date    
}


export interface Comentario {
    id_comentario: number,
    id_publicacion: number,
    id_usuario: number,
    contenido: string,
    fecha_comentario: Date    
}

export interface LecturaActual {
    id_club: number,
    id_libro: number,
    fecha_inicio: Date,
    fecha_fin: Date
    personas_leido: number,
    finalizado: boolean
}