import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoFecha'
})
export class FormatoFechaPipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return '';

    const date = new Date(value);
    
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',  
      month: 'numeric',   
      year: 'numeric'  
    };

    return date.toLocaleDateString('es-ES', options);
  }

}
