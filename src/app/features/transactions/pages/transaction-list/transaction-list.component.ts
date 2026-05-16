import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { map, switchMap, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { MonthlyInsights, Transaction } from '../../../../core/models/transaction/transaction.model';
import { TXN_TYPE_SEVERITY } from '../../../../core/constants/app.constants';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';
import { TransactionService } from '../../../../core/services/transaction.service';
import { AccountService } from '../../../../core/services/account.service';
import { CustomerService } from '../../../../core/services/customer.service';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    TagModule,
    CardModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    DialogModule,
    FormsModule,
    TransactionFormComponent
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private transactionService = inject(TransactionService);
  public accountService = inject(AccountService);
  public customerService = inject(CustomerService);

  cif$ = this.route?.paramMap?.pipe(map((params: any) => params?.get('cif') || ''));
  accountId$ = this.route?.paramMap?.pipe(map((params: any) => params?.get('accountId') || ''));

  transactions$: Observable<Transaction[]> = this.accountId$.pipe(
    switchMap((accountId: any) => this.transactionService.getByAccountId(accountId))
  );

  insights!: MonthlyInsights;
  typeSeverity = TXN_TYPE_SEVERITY;
  showTransactionForm = false;

  filterType: any = null;
  filterCategory: any = null;
  filterDates: Date[] | undefined;

  types$ = this.transactionService.types$;
  categories$ = this.transactionService.categories$;

  ngOnInit() {
    this.cif$.pipe(
      switchMap((cif: any) => this.customerService.getAll().pipe(
        map(customers => customers.find((c: any) => c.CIF === cif))
      ))
    ).subscribe((customer: any) => {
      if (customer) this.customerService.select(customer);
    });

    this.accountId$.pipe(
      switchMap((id: any) => this.accountService.getAll().pipe(
        map((accounts: any) => accounts.find((a: any) => a.id === id))
      ))
    ).subscribe((account: any) => {
      if (account) this.accountService.select(account);
    });

    this.transactions$.subscribe(txns => {
      this.insights = this.transactionService.computeInsights(txns);
    });
  }

  exportCsv() {
    this.transactions$.subscribe(txns => {
      this.transactionService.exportCsv(txns);
    });
  }

  openNewTransaction() {
    this.showTransactionForm = true;
  }

  onTransactionAdded(success: boolean) {
    if (success) {
      this.showTransactionForm = false;
      const currentAccountId = this.route?.snapshot?.paramMap?.get('accountId')!;
      this.transactions$ = this.transactionService.getByAccountId(currentAccountId);
      this.transactions$.subscribe((txns: any) => {
        this.insights = this.transactionService.computeInsights(txns);
      });
    }
  }

  clearFilters(dt: any) {
    this.filterType = null;
    this.filterCategory = null;
    this.filterDates = undefined;
    dt.clear();
  }
}
