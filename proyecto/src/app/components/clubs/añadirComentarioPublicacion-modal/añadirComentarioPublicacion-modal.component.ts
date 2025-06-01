import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-addComentarioPublicacion-modal',
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './añadirComentarioPublicacion-modal.component.html',

})
export class AñadirComentarioPublicacionModalComponent {
@Output() cerrarModalComentario = new EventEmitter<void>();
  @Output() guardarComentarioPublicacion = new EventEmitter<{
    contenido: string;
  }>(); // Evento para emitir el comentario al componente padre

  contenido: string = '';

  cerrar() {
    this.cerrarModalComentario.emit();
  }

  guardar() {
    this.guardarComentarioPublicacion.emit({
      contenido: this.contenido.trim(),
    });

    this.contenido = '';
    this.cerrar();
  }
}
