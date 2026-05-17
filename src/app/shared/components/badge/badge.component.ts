import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeVariant, BadgeSize } from './badge.model';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <i *ngIf="icon" [class]="icon"></i>
      <span class="badge-text">
        <ng-content></ng-content>
      </span>
    </span>
  `,
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'md';
  @Input() icon?: string;
  @Input() rounded: boolean = false;

  get badgeClasses(): string {
    const classes = ['app-badge', `app-badge--${this.variant}`, `app-badge--${this.size}`];

    if (this.rounded) classes.push('app-badge--rounded');
    if (this.icon) classes.push('app-badge--with-icon');

    return classes.join(' ');
  }
}
