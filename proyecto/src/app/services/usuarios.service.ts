import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../models/usuario';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

   public url:string='https://proyecto-final-alejandra.onrender.com'
    //crear el objeto http
    public http = inject(HttpClient);
    private authService = inject(AuthService)

    getUsuario(id_usuario?:any):Observable<Usuario>{
      //crear cabeceras 
      const headers=new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}` //la autorizacion va con esta estructura   
      })
      const url = id_usuario 
    ? `${this.url}/usuario/${id_usuario}` 
    : `${this.url}/usuario`;
      return this.http.get<Usuario>(url, {headers}).pipe(
        catchError(this.handleError)
      );
    }
 // Seguir a un usuario
seguirUsuario( id_seguido: number): Observable<{ message: string }> {
  //crear cabeceras 
  const headers=new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}` //la autorizacion va con esta estructura   
  })
  return this.http.post<{ message: string }>(
    `${this.url}/seguir/${id_seguido}`,{}, { headers} 
  ).pipe(
    catchError(this.handleError)
  );
}

// Dejar de seguir a un usuario
dejarDeSeguir( id_seguido: number): Observable<{ message: string }> {
   //crear cabeceras 
   const headers=new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}` //la autorizacion va con esta estructura   
  })
  return this.http.delete<{ message: string }>(
    `${this.url}/dejarSeguir/${id_seguido}`,
    {headers},
  ).pipe(
    catchError(this.handleError)
  );
}

// Obtener la lista de usuarios que sigo
getSeguidos(id_seguidor?: number): Observable<Usuario[]> {
     //crear cabeceras 
   const headers=new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}` //la autorizacion va con esta estructura   
  })
      const url = id_seguidor 
    ? `${this.url}/seguidos/${id_seguidor}` 
    : `${this.url}/seguidos`;
  return this.http.get<Usuario[]>(url, {headers}).pipe(
    catchError(this.handleError)
  );
} 

// Obtener la lista de seguidores de un usuario (opcional)
getSeguidores(id_seguido?: number): Observable<Usuario[]> {
     //crear cabeceras 
   const headers=new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}` //la autorizacion va con esta estructura   
  })
        const url = id_seguido 
    ? `${this.url}/seguidores/${id_seguido}` 
    : `${this.url}/seguidores`;
  return this.http.get<Usuario[]>(url, {headers}).pipe(
    catchError(this.handleError)
  );
}

  buscarUsuariosPorNombre(nombre: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/buscarUsuarios/${nombre}`).pipe(
      catchError(this.handleError)
    );
  }

    //editar usuario
  actualizarUsuario(id_usuario: number, datos: FormData):Observable<{message:string}>{ 
    return this.http.put<{message:string}>(`${this.url}/usuarios/${id_usuario}`,datos).pipe(
      catchError(this.handleError)
    );
  }

  // //metodo para manejar los errores
  private handleError(err: HttpErrorResponse){
    let errorMessage:string="";
    if(err.error instanceof ErrorEvent){
      errorMessage =`Error del cliente ${err.error.message}`
    }else{
      errorMessage =`Error del servidor ${err.error.message}`
    }
    return throwError(()=>{
      new Error (errorMessage)
    })
  }


  
}
