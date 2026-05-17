import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingLevel, TextColor } from './typography.model';

@Component({
  selector: 'app-heading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-heading">
      <component
        [ngSwitch]="level"
        [class]="headingClasses"
      >
        <h1 *ngSwitchCase="'h1'" [class]="headingClasses">
          <ng-content></ng-content>
        </h1>
        <h2 *ngSwitchCase="'h2'" [class]="headingClasses">
          <ng-content></ng-content>
        </h2>
        <h3 *ngSwitchCase="'h3'" [class]="headingClasses">
          <ng-content></ng-content>
        </h3>
        <h4 *ngSwitchCase="'h4'" [class]="headingClasses">
          <ng-content></ng-content>
        </h4>
        <h5 *ngSwitchCase="'h5'" [class]="headingClasses">
          <ng-content></ng-content>
        </h5>
        <h6 *ngSwitchCase="'h6'" [class]="headingClasses">
          <ng-content></ng-content>
        </h6>
      </component>
      <p *ngIf="subtitle" class="app-heading__subtitle">
        {{ subtitle }}
      </p>
    </div>
  `,
  styleUrls: ['./heading.component.scss'],
})
export class HeadingComponent {
  @Input() level: HeadingLevel = 'h1';
  @Input() color: TextColor = 'primary';
  @Input() subtitle?: string;

  get headingClasses(): string {
    return ['app-heading__title', `app-heading__${this.level}`, `app-heading--${this.color}`].join(
      ' '
    );
  }
}
