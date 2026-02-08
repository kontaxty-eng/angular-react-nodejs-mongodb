import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule, RouterOutlet, RouterLink, RouterLinkActive, AuthComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
