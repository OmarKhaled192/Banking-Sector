import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, ParamMap } from '@angular/router';
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
import { MonthlyInsights, Transaction, TransactionType, TransactionCategory } from '../../../../core/models/transaction/transaction.model';
import { Customer } from '../../../../core/models/customer/customer.model';
import { Account } from '../../../../core/models/account/account.model';
import { TXN_TYPE_SEVERITY } from '../../../../core/constants/app.constants';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';
import { BackBtnComponent, ButtonComponent, HeadingComponent, TextComponent, StatCardComponent, BadgeComponent } from '../../../../shared/components';
import { TransactionService } from '../../../../core/services/transaction.service';
import { AccountService } from '../../../../core/services/account.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { Table } from 'primeng/table';

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
    TransactionFormComponent,
    BackBtnComponent,
    ButtonComponent,
    HeadingComponent,
    TextComponent,
    StatCardComponent,
    BadgeComponent
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

  cif$: Observable<string> = this.route?.paramMap?.pipe(map((params: ParamMap) => params?.get('cif') || '')) || new Observable();
  accountId$: Observable<string> = this.route?.paramMap?.pipe(map((params: ParamMap) => params?.get('accountId') || '')) || new Observable();

  transactions$: Observable<Transaction[]> = this.accountId$.pipe(
    switchMap((accountId: string) => this.transactionService.getByAccountId(accountId))
  );

  insights: MonthlyInsights | null = null;
  typeSeverity = TXN_TYPE_SEVERITY;
  showTransactionForm: boolean = false;

  filterType: TransactionType | null = null;
  filterCategory: TransactionCategory | null = null;
  filterDates: Date[] | undefined;

  types$ = this.transactionService.types$;
  categories$ = this.transactionService.categories$;

  ngOnInit(): void {
    this.cif$.pipe(
      switchMap((cif: string) => this.customerService.getAll().pipe(
        map((customers: Customer[]) => customers.find((c: Customer) => c.CIF === cif))
      ))
    ).subscribe((customer: Customer | undefined) => {
      if (customer) this.customerService.select(customer);
    });

    this.accountId$.pipe(
      switchMap((id: string) => this.accountService.getAll().pipe(
        map((accounts: Account[]) => accounts.find((a: Account) => a.id === id))
      ))
    ).subscribe((account: Account | undefined) => {
      if (account) this.accountService.select(account);
    });

    this.transactions$.subscribe((txns: Transaction[]) => {
      this.insights = this.transactionService.computeInsights(txns);
    });
  }

  exportCsv(): void {
    this.transactions$.subscribe((txns: Transaction[]) => {
      this.transactionService.exportCsv(txns);
    });
  }

  openNewTransaction(): void {
    this.showTransactionForm = true;
  }

  onTransactionAdded(success: boolean): void {
    if (success) {
      this.showTransactionForm = false;
      const currentAccountId = this.route?.snapshot?.paramMap?.get('accountId')!;
      this.transactions$ = this.transactionService.getByAccountId(currentAccountId);
      this.transactions$.subscribe((txns: Transaction[]) => {
        this.insights = this.transactionService.computeInsights(txns);
      });
    }
  }

  clearFilters(dt: Table): void {
    this.filterType = null;
    this.filterCategory = null;
    this.filterDates = undefined;
    dt.clear();
  }
}
