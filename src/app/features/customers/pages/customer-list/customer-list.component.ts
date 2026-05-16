import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CustomerService } from '../../../../core/services/customer.service';
import { SEGMENT_SEVERITY } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule, CardModule, TableModule,
    InputTextModule, ButtonModule, TagModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent {
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);

  protected readonly customers$ = this.customerService.getAll();
  protected readonly segmentSeverity = SEGMENT_SEVERITY;

  ngOnInit() {
    this.customerService.clearSelection();
  }

  viewDetails(cif: string): void {
    this.router.navigate(['/dashboard/customer', cif]);
  }
}
