export type BadgeVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeConfig {
  variant: BadgeVariant;
  size: BadgeSize;
  icon?: string;
  rounded: boolean;
}
