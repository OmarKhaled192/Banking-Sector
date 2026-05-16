import {
  Pipe,
  PipeTransform,
} from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true,
})
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    if (!name) return '';

    return name
      .split(' ')
      .filter(Boolean)
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
