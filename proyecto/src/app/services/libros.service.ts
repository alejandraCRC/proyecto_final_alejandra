import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  private http = inject(HttpClient);

  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';

  buscarLibros(query: string) {
  const params = new HttpParams()
    .set('q', query)
    .set('maxResults', '6'); //limita desde la API a 5 resultados

  return this.http.get('https://www.googleapis.com/books/v1/volumes', { params });
}

  obtenerLibroPorId(idLibro: string): Observable<any> {
    console.log(idLibro);
    return this.http.get<any>(`${this.apiUrl}/${idLibro}`);
  }
}
