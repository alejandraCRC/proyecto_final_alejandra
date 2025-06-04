import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app/home',
    pathMatch: 'full',
  },

  // Login sin header/footer
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },

  // Register sin header/footer
  {
    path: 'register',
    loadComponent: () =>
      import('./components/registrar/registrar.component').then(
        (c) => c.RegistrarComponent
      ),
  },

  // Rutas privadas (con layout)
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./layouts/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./components/home/home.component').then(
            (c) => c.HomeComponent
          ),
      },
      {
        path: 'creditos-soporte',
        loadComponent: () =>
          import('./components/creditos-soporte/creditos-soporte.component').then(
            (c) => c.CreditosSoporteComponent
          ),
      },
      {
        path: 'libros',
        loadComponent: () =>
          import(
            './components/libros/buscarLibros/buscarLibros.component'
          ).then((c) => c.BuscarLibrosComponent),
      },
      {
        path: 'detalle/:idLibro',
        loadComponent: () =>
          import('./components/libros/libro/libro.component').then(
            (c) => c.LibroComponent
          ),
      },
      {
        path: 'libros-guardados',
        loadComponent: () =>
          import(
            './components/libros/lista-libros-guardados/lista-libros-guardados.component'
          ).then((c) => c.ListaLibrosGuardadosComponent),
      },
      {
        path: 'libros-guardados/:idUsuario',
        loadComponent: () =>
          import(
            './components/libros/lista-libros-guardados/lista-libros-guardados.component'
          ).then((c) => c.ListaLibrosGuardadosComponent),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import(
            './components/perfil-usuario/perfil/perfil-usuario.component'
          ).then((c) => c.PerfilUsuarioComponent),
      },
      {
        path: 'perfil/:idUsuario',
        loadComponent: () =>
          import(
            './components/perfil-usuario/perfil/perfil-usuario.component'
          ).then((c) => c.PerfilUsuarioComponent),
      },

      {
        path: 'perfil/:idUsuario/seguidos',
        loadComponent: () =>
          import(
            './components/perfil-usuario/lista-usuarios/lista-usuarios.component'
          ).then((c) => c.ListaUsuariosComponent),
      },
      {
        path: 'perfil/:idUsuario/seguidores',
        loadComponent: () =>
          import(
            './components/perfil-usuario/lista-usuarios/lista-usuarios.component'
          ).then((c) => c.ListaUsuariosComponent),
      },
      {
        path: 'editar-perfil/:idUsuario',
        loadComponent: () =>
          import(
            './components/perfil-usuario/editar-perfil/editar-perfil.component'
          ).then((c) => c.EditarPerfilComponent),
      },
      {
        path: 'clubs',
        loadComponent: () =>
          import('./components/clubs/buscarClubs/buscar-clubs.component').then(
            (c) => c.BuscarClubsComponent
          ),
      },
      {
        path: 'club/:idClub',
        loadComponent: () =>
          import('./components/clubs/club/club.component').then(
            (c) => c.ClubComponent
          ),
      },
         {
        path: 'form-club',
        loadComponent: () =>
          import(
            './components/clubs/form-club/form-club.component'
          ).then((c) => c.FormClubComponent),
      },
            {
        path: 'form-club/:idClub',
        loadComponent: () =>
          import(
            './components/clubs/form-club/form-club.component'
          ).then((c) => c.FormClubComponent),
      },
       {
        path: 'lectura-actual/:idClub',
        loadComponent: () =>
          import(
            './components/clubs/elegir-lectura-actual/elegir-lectura-actual.component'
          ).then((c) => c.ElegirLecturaActualComponent),
      },
    ],
  },

  // 404
  {
    path: '**',
    loadComponent: () =>
      import('./components/c404/c404.component').then((c) => c.C404Component),
  },
];
