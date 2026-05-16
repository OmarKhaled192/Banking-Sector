import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { TopbarComponent } from './components/topbar/topbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'bp-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  protected readonly sidebarOpen = signal(true);
}
