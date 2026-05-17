export type TextVariant = 'body' | 'caption' | 'label' | 'error' | 'hint';
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TextColor = 'primary' | 'secondary' | 'muted' | 'success' | 'danger' | 'warning';

export interface TextConfig {
  variant: TextVariant;
  color: TextColor;
  truncate: boolean;
  multiLine: number | null;
}

export interface HeadingConfig {
  level: HeadingLevel;
  color: TextColor;
  subtitle?: string;
}
