import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'bp-topbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    AvatarModule,
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  public readonly auth = inject(AuthService);

  readonly menuToggle = output<void>();
}
