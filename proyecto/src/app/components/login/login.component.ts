import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslateModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  public title: string = 'Gestión de tareas colaborativas';
  idiomaActual = 'es';

  //inyectar servicios 
  private fb= inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  
  public frm!:FormGroup //la exclamación para no tener que inicializar
  public aUsuarios: Usuario[]=[]
  ngOnInit(){
    this.frm=this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],

    })
  }

    traducir(idioma: string) {
    this.translate.use(idioma);
    localStorage.setItem('idioma', idioma);
  }

//getters
get emailNoRequerido(){
  return this.frm.get('email')?.errors?.['required'] && this.frm.get('email')?.touched;
}

get emailNoEmail(){
  return this.frm.get('email')?.errors?.['email'];
}

get passNoRequerido(){
  return this.frm.get('password')?.errors?.['required'] && this.frm.get('password')?.touched;
}

sendDatos() {
  if (this.frm.invalid) {
    this.frm.markAllAsTouched();
    return;
  }

  const datos = this.frm.value; 
  console.log('Datos enviados:', datos);

  this.authService.login(datos.email, datos.password).subscribe({
    next: (res) => {
      this.authService.setToken(res.token)
      this.authService.setUsuario(res.usuario);
    console.log(res);
      // Redirigir
      this.router.navigate(['/app/home']);
    },
    error: (err) => {
      console.error('Error al iniciar sesión:', err.message);
       Swal.fire({
          icon: 'error',
          title: this.translate.instant('login.error_titulo'),
          text:  this.translate.instant('login.error_texto')
        });
    }
  });
}
}
