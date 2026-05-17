import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextVariant, TextColor } from './typography.model';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="textClasses">
      <ng-content></ng-content>
    </p>
  `,
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  @Input() variant: TextVariant = 'body';
  @Input() color: TextColor = 'primary';
  @Input() truncate: boolean = false;
  @Input() multiLine?: number;

  get textClasses(): string {
    const classes = [
      'app-text',
      `app-text--${this.variant}`,
      `app-text--${this.color}`,
    ];

    if (this.truncate) classes.push('app-text--truncate');
    if (this.multiLine) classes.push(`app-text--line-clamp-${this.multiLine}`);

    return classes.join(' ');
  }
}
