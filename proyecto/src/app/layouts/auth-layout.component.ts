import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent,],
  templateUrl: './auth-layout.component.html',
  styles: ``,
  standalone: true
})
export class AuthLayoutComponent {

}
