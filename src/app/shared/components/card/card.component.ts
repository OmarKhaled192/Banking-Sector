import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardVariant, CardPadding } from './card.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="cardClasses"
      (click)="handleClick()"
      [attr.role]="clickable ? 'button' : 'region'"
      [attr.tabindex]="clickable ? 0 : -1"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() variant: CardVariant = 'elevated';
  @Input() padding: CardPadding = 'md';
  @Input() clickable: boolean = false;
  @Input() hoverable: boolean = true;

  @Output() cardClicked = new EventEmitter<void>();

  get cardClasses(): string {
    const classes = [
      'app-card',
      `app-card--${this.variant}`,
      `app-card--padding-${this.padding}`,
    ];

    if (this.clickable) classes.push('app-card--clickable');
    if (this.hoverable) classes.push('app-card--hoverable');

    return classes.join(' ');
  }

  handleClick(): void {
    if (this.clickable) {
      this.cardClicked.emit();
    }
  }
}
