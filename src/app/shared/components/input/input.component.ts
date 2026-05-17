import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputType, InputSize } from './input.model';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-input-wrapper">
      <label *ngIf="label" [for]="inputId" class="app-input__label">
        {{ label }}
        <span *ngIf="required" class="app-input__required">*</span>
      </label>
      <div class="app-input__container">
        <input
          [id]="inputId"
          [type]="type"
          [class]="inputClasses"
          [value]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [attr.aria-label]="ariaLabel || label"
          [attr.aria-required]="required"
          [attr.aria-invalid]="hasError"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />
        <button
          *ngIf="clearable && value"
          type="button"
          class="app-input__clear"
          (click)="onClear()"
          [attr.aria-label]="'Clear ' + label"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      <p *ngIf="hasError && errorMessage" class="app-input__error">
        {{ errorMessage }}
      </p>
      <p *ngIf="hint" class="app-input__hint">
        {{ hint }}
      </p>
    </div>
  `,
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() type: InputType = 'text';
  @Input() size: InputSize = 'md';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() clearable: boolean = false;
  @Input() hint?: string;
  @Input() errorMessage?: string;
  @Input() hasError: boolean = false;
  @Input() ariaLabel?: string;
  @Input() inputId: string = `input-${Math.random().toString(36).substr(2, 9)}`;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blurred = new EventEmitter<void>();
  @Output() focused = new EventEmitter<void>();

  value: string = '';
  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  get inputClasses(): string {
    const classes = ['app-input', `app-input--${this.size}`];

    if (this.disabled) classes.push('app-input--disabled');
    if (this.readonly) classes.push('app-input--readonly');
    if (this.hasError) classes.push('app-input--error');
    if (this.clearable && this.value) classes.push('app-input--with-clear');

    return classes.join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onClear(): void {
    this.value = '';
    this.onChange('');
    this.valueChange.emit('');
  }

  onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  onFocus(): void {
    this.focused.emit();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
