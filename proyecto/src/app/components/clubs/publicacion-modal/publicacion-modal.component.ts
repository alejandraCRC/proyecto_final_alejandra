import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-publicacion-modal',
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './publicacion-modal.component.html',
  styleUrl: './publicacion-modal.component.css'
})
export class PublicacionModalComponent {
@Output() cerrarModal = new EventEmitter<void>();
  @Output() guardarPublicacion = new EventEmitter<{
    titulo: string;
    contenido: string;
  }>(); // Evento para emitir la publicacion al componente padre

  titulo: string = '';
  contenido: string = '';

  cerrar() {
    this.cerrarModal.emit();
  }

  guardar() {
    this.guardarPublicacion.emit({
      titulo: this.titulo.trim(),
      contenido: this.contenido.trim(),
    });

    this.titulo = '';
    this.contenido = '';
    this.cerrar();
  }
}
