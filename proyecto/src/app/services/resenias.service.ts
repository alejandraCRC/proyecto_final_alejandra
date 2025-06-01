import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Resenia } from '../models/resenia';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReseniasService {

    public url:string='https://proyecto-final-alejandra.onrender.com'
    //crear el objeto http
    public http = inject(HttpClient);
  
  private authService = inject(AuthService);

  //obtener reseñas de un libro
  getReseniasPorLibroId(id_libro: string): Observable<Resenia[]> {
    //crear cabeceras
    const headers=new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` //la autorizacion va con esta estructura   
    })
    return this.http.get<Resenia[]>(`${this.url}/resenias/${id_libro}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

    //obtener reseñas de un usuario
  getReseniasPorUsuarioId(id_usuario: number): Observable<Resenia[]> {
    //crear cabeceras
    const headers=new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` //la autorizacion va con esta estructura   
    })
    return this.http.get<Resenia[]>(`${this.url}/reseniasUsuario/${id_usuario}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

    // //añadir reseña
  guardarResenia(
    id_libro: string,    
    calificacion: number,
    resenia: string,
    fecha: Date,
  ): Observable<any> {
    
    //crear cabeceras
    const headers=new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` //la autorizacion va con esta estructura   
    })
    const body = { id_libro, calificacion, resenia, fecha};
    return this.http
      .post(`${this.url}/resenias`, body, { headers })
      .pipe(catchError(this.handleError));
  }
  //   //solicitar las tareas
  //   getTareas():Observable<Tarea[]>{ 
  //     //crear cabeceras
  //     return this.http.get<Tarea[]>(`${this.url}/tareas`).pipe(
  //       catchError(this.handleError)
  //     );
  //   }

  //   //solicitar una tarea segun su estado
  //   getTareasEstado(estado:string):Observable<Tarea[]>{ 
  //     //crear cabeceras
  //     return this.http.get<Tarea[]>(`${this.url}/tareas/estado/${estado}`).pipe(
  //       catchError(this.handleError)
  //     );
  //   }

  //   //solicitar una tarea segun su usuario
  //   getTareasUsuario(usuario:number):Observable<Tarea[]>{ 
  //     //crear cabeceras
  //     return this.http.get<Tarea[]>(`${this.url}/tareas/usuario/${usuario}`).pipe(
  //       catchError(this.handleError)
  //     );
  //   }

  //   //solicitar una tarea
  // getTarea(id:number):Observable<Tarea[]>{ 
  //   return this.http.get<Tarea[]>(`${this.url}/tareas/${id}`).pipe(
  //     catchError(this.handleError)
  //   )
  // }
  
  //   //eliminar tarea
  // deleteTarea(id:number):Observable<{message:string}>{ 
  //   return this.http.delete<{message:string}>(`${this.url}/tareas/${id}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }




  // //editar tarea
  // putTarea(tarea:Tarea):Observable<{message:string}>{ 
  //   return this.http.put<{message:string}>(`${this.url}/tareas/${tarea.idTarea}`,tarea).pipe(
  //     catchError(this.handleError)
  //   );
    
  // }

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
