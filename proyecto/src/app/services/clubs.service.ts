import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Club } from '../models/club';
import { LecturaActual } from '../models/club';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClubsService {

   public url:string='http://localhost:3000'
    //crear el objeto http
    public http = inject(HttpClient);
    private authService = inject(AuthService)

    //solicitar las clubs
    getClubs():Observable<Club[]>{ 
      //crear cabeceras
      return this.http.get<Club[]>(`${this.url}/clubs`).pipe(
        catchError(this.handleError)
      );
    }

    //solicitar una tarea segun su usuario
    getClubsUsuario():Observable<Club[]>{ 
      //crear cabeceras
      const headers=new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}` //la autorizacion va con esta estructura   
      })
      return this.http.get<Club[]>(`${this.url}/clubsUsuario`, { headers }).pipe(
        catchError(this.handleError)
      );
    }

      //solicitar un club
  obtenerClubPorId(id_club:number):Observable<Club[]>{ 
    return this.http.get<Club[]>(`${this.url}/club/${id_club}`).pipe(
      catchError(this.handleError)
    )
  }

  buscarClubsPorNombre(nombre: string): Observable<Club[]> {
    return this.http.get<Club[]>(`${this.url}/buscarClubs/${nombre}`).pipe(
      catchError(this.handleError)
    );
  }

  crearClub(club: { nombre: string; descripcion: string; fecha_creacion: Date }
  ): Observable<any> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    return this.http
      .post(`${this.url}/clubs`, club, { headers })
      .pipe(catchError(this.handleError));
  }

      //editar club
  actualizarClub(club: Club):Observable<{message:string}>{ 
    return this.http.put<{message:string}>(`${this.url}/clubs/${club.id_club}`,club).pipe(
      catchError(this.handleError)
    );
  }

  //eliminar club
  eliminarClub(id_club: number):Observable<{message:string}>{ 
    return this.http.delete<{message:string}>(`${this.url}/clubs/${id_club}`).pipe(
      catchError(this.handleError)
    );
  }

  //metodos para lectura actual
  getLecturaActual(id_club: number):Observable<LecturaActual[]>{ 
      return this.http.get<LecturaActual[]>(`${this.url}/lectura_actual/${id_club}`).pipe(
        catchError(this.handleError)
      );
    }

    crearLecturaActual(id_club: number, id_libro: string, fecha_fin: Date):Observable<LecturaActual>{ 
      const body = {
        id_libro: id_libro,
        fecha_inicio: new Date(),
        fecha_fin: new Date(fecha_fin),
        personas_leido: 0
      }
      return this.http.post<LecturaActual>(`${this.url}/lectura_actual/${id_club}`, body).pipe(
        catchError(this.handleError)
      );
    }
  actualizarLecturaActual(id_club: number):Observable<{message:string}>{ 
    return this.http.put<{message:string}>(`${this.url}/lectura_actual/${id_club}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  finalizarLecturaActual(id_club: number):Observable<{message:string}>{ 
    return this.http.delete<{message:string}>(`${this.url}/lectura_actual/${id_club}`).pipe(
      catchError(this.handleError)
    );
  }

  //metodo para manejar los errores
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
