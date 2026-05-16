import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'bp-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  readonly open = input(true);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi-home', route: '/dashboard' },
    { label: 'Customers', icon: 'pi-users', route: '/customers' },
    { label: 'Transactions', icon: 'pi-credit-card', route: '/transactions' },
  ];
}
