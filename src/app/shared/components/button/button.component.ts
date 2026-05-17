import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonVariant, ButtonSize, ButtonConfig } from './button.model';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick()"
      [attr.aria-label]="ariaLabel"
    >
      <div class="button-content">
        <i *ngIf="icon && iconPosition === 'left'" [class]="icon"></i>
        <span class="button-text">
          {{ loading ? loadingText : label }}
        </span>
        <i *ngIf="icon && iconPosition === 'right'" [class]="icon"></i>
      </div>
    </button>
  `,
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() loadingText: string = 'Loading...';
  @Input() fullWidth: boolean = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() ariaLabel?: string;

  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): string {
    const classes = [
      'app-button',
      `app-button--${this.variant}`,
      `app-button--${this.size}`,
    ];

    if (this.disabled) classes.push('app-button--disabled');
    if (this.loading) classes.push('app-button--loading');
    if (this.fullWidth) classes.push('app-button--full-width');
    if (this.icon) classes.push('app-button--with-icon');

    return classes.join(' ');
  }

  handleClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
