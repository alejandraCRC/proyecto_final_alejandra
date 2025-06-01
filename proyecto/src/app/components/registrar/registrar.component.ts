import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-registrar',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './registrar.component.html',
})
export class RegistrarComponent {
  public title: string = 'Page to Page';

  //inyectar servicios a partir de la versión 17
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  public frm!: FormGroup; //la exclamación para no tener que inicializar
  public aUsuarios: Usuario[] = [];
  ngOnInit() {
    this.frm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,30}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      rPassword: ['', [Validators.required, this.passwordIdem.bind(this)]],
      terminos: [false, [Validators.requiredTrue]],
    });
  }

  //getters
  get emailNoRequerido() {
    return (
      this.frm.get('email')?.errors?.['required'] &&
      this.frm.get('email')?.touched
    );
  }

  get emailNoEmail() {
    return this.frm.get('email')?.errors?.['email'];
  }

  get passNoRequerido() {
    return (
      this.frm.get('password')?.errors?.['required'] &&
      this.frm.get('password')?.touched
    );
  }

  get passNoLongitud() {
    return (
      this.frm.get('password')?.errors?.['minlength'] ||
      this.frm.get('password')?.errors?.['maxlength']
    );
    //el minlength es minuscula aqui aunque fue mayuscula antes
  }

  get rPassNoRequerido() {
    return (
      this.frm.get('rPassword')?.errors?.['required'] &&
      this.frm.get('rPassword')?.touched
    );
  }

  get rPassNoIdem() {
    return this.frm.get('rPassword')?.errors?.['passNoIdem'];
  }

  get passNoValido() {
    const pass1 = this.frm.get('password')?.value;
    const pass2 = this.frm.get('rPassword')?.value;
    return pass1 === pass2 ? false : true;
  }

  //comprueba que las contraseñas sean iguales
  passwordIdem(control: AbstractControl) {
    if (this.frm) {
      const pass1 = this.frm.get('password')?.value;
      const pass2 = control.value;

      return pass1 === pass2 ? null : { passNoIdem: true };
    } else {
      return null;
    }
  }

  sendDatos() {
    if (this.frm.invalid) {
      this.frm.markAllAsTouched(); // marca todos los campos como tocados para que se vean errores
      return;
    }

    const datos = this.frm.value;

    const nombre = datos.username;
    const email = datos.email;
    const contrasenia = datos.password;
    const fecha_registro = new Date().toISOString(); // o el formato que esperes

    this.authService
      .register(nombre, email, contrasenia, fecha_registro)
      .subscribe({
        next: (respuesta) => {
          console.log('Usuario registrado:', respuesta);
          // podrías mostrar un mensaje, redirigir, etc.
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
          // aquí podrías mostrar un mensaje de error al usuario
        },
      });
  }
}
