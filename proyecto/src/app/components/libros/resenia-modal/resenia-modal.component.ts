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

  resenia: string = '';
  calificacion: number = 0;
  hover: number = 0;

  cerrar() {
    this.cerrarModal.emit();
  }

  guardar() {
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
