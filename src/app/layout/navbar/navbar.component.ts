import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, ToolbarModule, ButtonModule, MenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public readonly auth = inject(AuthService);
  protected readonly userName = this.auth.currentUserName;

  menuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user'
    },
    {
      label: 'Sign Out',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  logout(): void {
    this.auth.logout();
  }
}
