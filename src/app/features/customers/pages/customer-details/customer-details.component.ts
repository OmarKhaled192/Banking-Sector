import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CustomerService } from '../../../../core/services/customer.service';
import { AccountService } from '../../../../core/services/account.service';
import { SEGMENT_SEVERITY, ACCOUNT_STATUS_SEVERITY } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, RouterLink],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);
  private readonly accountService = inject(AccountService);

  protected readonly segmentSeverity = SEGMENT_SEVERITY;
  protected readonly statusSeverity = ACCOUNT_STATUS_SEVERITY;

  protected readonly customer$ = this.route.params.pipe(
    map(p => p['cif']),
    switchMap(cif => this.customerService.getAll().pipe(
      map(list => list.find(c => c.CIF === cif) || null)
    )),
    tap(customer => {
      if (customer) this.customerService.select(customer);
    })
  );

  protected readonly accounts$ = this.customer$.pipe(
    switchMap(customer => {
      if (!customer) return [];
      return this.accountService.getByCustomerId(customer.CIF);
    })
  );

  ngOnInit(): void {
    this.accountService.clearSelection();
  }

  viewTransactions(accountId: string): void {
    const cif = this.route.snapshot.params['cif'];
    this.router.navigate(['/dashboard/customer', cif, 'account', accountId]);
  }
}
