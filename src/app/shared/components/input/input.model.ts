export type InputType = 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputConfig {
  type: InputType;
  size: InputSize;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  clearable: boolean;
}
