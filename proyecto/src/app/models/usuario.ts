export interface Usuario {
    id_usuario?: number,
    nombre: string, 
    email: string,
    contrasenia: string,
    fecha_registro: Date,
    biografia?:string
}
