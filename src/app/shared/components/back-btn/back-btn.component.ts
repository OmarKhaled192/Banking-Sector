import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-btn',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './back-btn.component.html',
  styleUrls: ['./back-btn.component.scss']
})
export class BackBtnComponent {
  @Input() label: string = 'Back';
  @Input() severity: any = 'secondary';
  @Input() variant: any = 'outlined';
  @Input() route?: string | any[];

  @Output() clicked = new EventEmitter<void>();

  constructor(private location: Location, private router: Router) { }

  onBack(): void {
    this.clicked.emit();
    if (this.route) {
      if (Array.isArray(this.route)) {
        this.router.navigate(this.route);
      } else {
        this.router.navigateByUrl(this.route);
      }
    } else {
      this.location.back();
    }
  }
}
