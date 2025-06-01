import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estrellas'
})
export class EstrellasPipe implements PipeTransform {

  transform(value: number,): string {
    if(!value) return '';
    const aEstrellas = [];
    for(let i=0; i<value;i++){
      aEstrellas.push('<i class="fa-solid fa-star text-yellow-500"></i>');
    }    
    if(value<5){
      for(let i=0; i<5-value;i++){
        aEstrellas.push('<i class="fa-solid fa-star text-gray-400"></i>');
      }
    }
    return aEstrellas.join('');
  }

}
