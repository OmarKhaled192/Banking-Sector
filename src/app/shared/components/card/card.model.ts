export type CardVariant = 'elevated' | 'outlined' | 'flat' | 'glass';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardConfig {
  variant: CardVariant;
  padding: CardPadding;
  clickable: boolean;
  hoverable: boolean;
}
