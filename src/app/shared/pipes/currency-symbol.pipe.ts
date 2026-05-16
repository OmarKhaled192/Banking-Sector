import { Pipe, PipeTransform } from '@angular/core';

const SYMBOLS: Record<string, string> = {
  EGP: 'EGP',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
};

@Pipe({
  name: 'currencySymbol',
  standalone: true,
})
export class CurrencySymbolPipe implements PipeTransform {
  transform(currency: string | undefined): string {
    if (!currency) return '';
    return SYMBOLS[currency] ?? currency;
  }
}
