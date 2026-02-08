import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthComponent } from '../../../features/auth/auth.component';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatSidenavModule, MatIconModule, MatButtonModule, AuthComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  sidenavOpened = false;

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
