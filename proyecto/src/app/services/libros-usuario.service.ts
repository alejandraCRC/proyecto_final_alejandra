import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Club } from '../models/club';
import { AuthService } from './auth.service';
import { Libro } from '../models/libro';

@Injectable({
  providedIn: 'root',
})
export class LibrosUsuarioService {
  public url: string = 'https://proyecto-final-alejandra.onrender.com';
  //crear el objeto http
  public http = inject(HttpClient);
  private authService = inject(AuthService);

  getLibrosUsuario(id_usuario?:any): Observable<Libro[]> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    const url = id_usuario 
        ? `${this.url}/librosUsuario/${id_usuario}` 
        : `${this.url}/librosUsuario`;
          return this.http.get<Libro[]>(url, {headers}).pipe(catchError(this.handleError));
  }

  getLibroUsuario(id_libro: string, id_usuario?:any): Observable<any> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    return this.http.get<any>(`${this.url}/librosUsuario/${id_libro}/${id_usuario}`, {headers});
  };

  guardarLibroUsuario(
    id_libro: string,
    fecha: Date,
    estado: string
  ): Observable<any> {
    
    //crear cabeceras
    const headers=new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` //la autorizacion va con esta estructura   
    })
    const body = { id_libro, fecha, estado };
    return this.http
      .post(`${this.url}/librosUsuario`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  eliminarLibroUsuario(id_libro: string, id_usuario?:any): Observable<any> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    const url = id_usuario 
        ? `${this.url}/librosUsuario/${id_libro}/${id_usuario}` 
        : `${this.url}/librosUsuario/${id_libro}`;
          return this.http.delete<Libro[]>(url, {headers}).pipe(catchError(this.handleError));
  }  

  //funciones para pasar los libros entre componentes
   private librosSeleccionados: any[] = [];

   //obtiene los libros del usuario del storage
  getLibros(): any[] {
  if (this.librosSeleccionados.length === 0) {
    const guardados = localStorage.getItem('libros_seleccionados');
    if (guardados) {
      this.librosSeleccionados = JSON.parse(guardados);
    }
  }
  return this.librosSeleccionados;
}
//guarda los libros seleccionados en el localStorage
setLibros(libros: any[]) {
  console.log('Libros seleccionados:', libros);
  this.librosSeleccionados = libros;
  localStorage.setItem('libros_seleccionados', JSON.stringify(libros));
}



  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Error desde librosUsuarioService:', error);
    return throwError(
      () =>
        new Error(error.error?.message || 'Error de conexión con el servidor')
    );
  }
}
