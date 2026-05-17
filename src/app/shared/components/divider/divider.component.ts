import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="dividerClasses"
      [attr.aria-orientation]="orientation"
    ></div>
  `,
  styleUrls: ['./divider.component.scss'],
})
export class DividerComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() spacing: 'sm' | 'md' | 'lg' = 'md';

  get dividerClasses(): string {
    return ['app-divider', `app-divider--${this.orientation}`, `app-divider--spacing-${this.spacing}`].join(
      ' '
    );
  }
}
