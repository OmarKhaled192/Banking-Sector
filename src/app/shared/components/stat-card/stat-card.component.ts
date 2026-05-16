import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'bp-stat-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() sub = '';
  @Input() icon = 'pi-chart-bar';
  @Input() iconColor = '#6366f1';
  @Input() iconBg = '#eef2ff';
}
