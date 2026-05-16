import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bp-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  @Input() icon = 'pi-inbox';
  @Input() title = 'No data found';
  @Input() subtitle = '';
}
