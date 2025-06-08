import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-resenia-modal',
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './resenia-modal.component.html',
  styleUrl: `./resenia-modal.component.css`,
})
export class ReseniaModalComponent {
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() guardarResenia = new EventEmitter<{
    resenia: string;
    calificacion: number;
  }>(); // Evento para emitir la reseña al componente padre

  // Variables del formulario
  resenia: string = '';
  calificacion: number = 0;
  hover: number = 0;
  mostrarError: boolean = false;
  
  //metodo de cerrar modal
  cerrar() {
    this.cerrarModal.emit();
  }

  //metodo para guardar reseña
  guardar() {
  // Verifica si los campos están vacíos o si la calificación es cero, se puede guardar con solo uno relleno
    if (!this.resenia.trim() && this.calificacion === 0) {
    this.mostrarError = true;
    return;
  }
  this.mostrarError = false;
    this.guardarResenia.emit({
      resenia: this.resenia.trim(),
      calificacion: this.calificacion,
    });

    this.resenia = '';
    this.calificacion = 0;
    this.hover = 0;
    this.cerrar();
  }
}
